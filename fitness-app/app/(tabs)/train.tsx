import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Text } from '@/components/Themed';
import { Card, Button } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useWorkout, Exercise, Set, Workout } from '../../context/WorkoutContext';

const ROUTINES = [
    {
        name: 'Empuje (Push)',
        exercises: [
            { name: 'Press de Banca', sets: 3 },
            { name: 'Press Militar', sets: 3 },
            { name: 'Aperturas Pecho', sets: 3 },
            { name: 'Extensiones Tríceps', sets: 3 },
        ]
    },
    {
        name: 'Tracción (Pull)',
        exercises: [
            { name: 'Peso Muerto', sets: 3 },
            { name: 'Dominadas', sets: 3 },
            { name: 'Remo con Mancuerna', sets: 3 },
            { name: 'Curl de Bíceps', sets: 3 },
        ]
    },
    {
        name: 'Pierna (Legs)',
        exercises: [
            { name: 'Sentadilla Libre', sets: 3 },
            { name: 'Prensa', sets: 3 },
            { name: 'Zancadas', sets: 3 },
            { name: 'Extensión Cuádriceps', sets: 3 },
        ]
    },
    {
        name: 'Torso',
        exercises: [
            { name: 'Press de Banca', sets: 3 },
            { name: 'Remo con Barra', sets: 3 },
            { name: 'Press Inclinado', sets: 3 },
            { name: 'Jalón al Pecho', sets: 3 },
        ]
    },
    {
        name: 'Full Body',
        exercises: [
            { name: 'Sentadilla', sets: 3 },
            { name: 'Press de Banca', sets: 3 },
            { name: 'Peso Muerto Rumano', sets: 3 },
            { name: 'Remo con Barra', sets: 3 },
        ]
    }
];

export default function EntrenarScreen() {
    const colorScheme = useColorScheme();
    const { addWorkout } = useWorkout();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
    const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const loadTemplate = (routine: typeof ROUTINES[0]) => {
        const templateExercises: Exercise[] = routine.exercises.map(ex => ({
            id: Math.random().toString(36).substr(2, 9),
            name: ex.name,
            sets: Array(ex.sets).fill(null).map(() => ({ weight: '', reps: '', completed: false }))
        }));

        if (exercises.length > 0) {
            Alert.alert(
                'Cargar Plantilla',
                'Esto reemplazará tu sesión actual. ¿Continuar?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'SÍ', onPress: () => {
                            setExercises(templateExercises);
                            setSelectedTemplate(routine.name);
                            setIsActive(true);
                            setIsTemplateModalVisible(false);
                        }
                    }
                ]
            );
        } else {
            setExercises(templateExercises);
            setSelectedTemplate(routine.name);
            setIsActive(true);
            setIsTemplateModalVisible(false);
        }
    };

    const addExercise = () => {
        if (!isActive) setIsActive(true);
        const newExercise: Exercise = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'Nuevo Ejercicio',
            sets: [{ weight: '', reps: '', completed: false }],
        };
        setExercises([...exercises, newExercise]);
    };

    const removeExercise = (id: string) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    const addSet = (exerciseId: string) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: [...ex.sets, { weight: '', reps: '', completed: false }]
                };
            }
            return ex;
        }));
    };

    const updateSet = (exerciseId: string, setIndex: number, field: keyof Set, value: string | boolean) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = [...ex.sets];
                newSets[setIndex] = { ...newSets[setIndex], [field]: value };
                return { ...ex, sets: newSets };
            }
            return ex;
        }));
    };

    const removeSet = (exerciseId: string, setIndex: number) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = ex.sets.filter((_, i) => i !== setIndex);
                return { ...ex, sets: newSets };
            }
            return ex;
        }));
    };

    const updateExerciseName = (id: string, name: string) => {
        setExercises(exercises.map(ex => ex.id === id ? { ...ex, name } : ex));
    };

    const finishWorkout = () => {
        if (exercises.length === 0) {
            Alert.alert('Sesión vacía', 'Añade al menos un ejercicio antes de terminar.');
            return;
        }

        Alert.alert(
            'Finalizar entrenamiento',
            '¿Seguro que quieres terminar la sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Finalizar',
                    onPress: () => {
                        const newWorkout: Workout = {
                            id: Math.random().toString(36).substr(2, 9),
                            date: new Date().toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            duration: timer,
                            exercises: exercises,
                            templateName: selectedTemplate
                        };
                        addWorkout(newWorkout);

                        setIsActive(false);
                        setExercises([]);
                        setTimer(0);
                        setSelectedTemplate(undefined);
                        Alert.alert('¡Entrenamiento guardado!', 'Buen trabajo hoy.');
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.sessionTitle}>
                        {selectedTemplate ? `Rutina: ${selectedTemplate}` : 'Sesión Activa'}
                    </Text>
                    <Text style={styles.sessionDuration}>{formatTime(timer)}</Text>
                </View>
                {!isActive && (
                    <TouchableOpacity
                        style={styles.templatePickerBtn}
                        onPress={() => setIsTemplateModalVisible(true)}
                    >
                        <FontAwesome name="list-alt" size={16} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.templatePickerText}>PLANTILLAS</Text>
                    </TouchableOpacity>
                )}
            </View>

            {exercises.map((exercise) => (
                <Card key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                        <TextInput
                            style={styles.exerciseNameInput}
                            value={exercise.name}
                            onChangeText={(text) => updateExerciseName(exercise.id, text)}
                            placeholder="Nombre del ejercicio"
                        />
                        <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                            <FontAwesome name="trash" size={18} color="#ff4444" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={[styles.columnLabel, { flex: 1 }]}>Serie</Text>
                        <Text style={[styles.columnLabel, { flex: 2 }]}>Peso (kg)</Text>
                        <Text style={[styles.columnLabel, { flex: 2 }]}>Reps</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {exercise.sets.map((set, index) => (
                        <View key={index} style={styles.setRow}>
                            <View style={[styles.setNumberContainer, { flex: 1 }]}>
                                <Text style={styles.setNumber}>{index + 1}</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                placeholder="0"
                                value={set.weight}
                                onChangeText={(text) => updateSet(exercise.id, index, 'weight', text)}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                placeholder="0"
                                value={set.reps}
                                onChangeText={(text) => updateSet(exercise.id, index, 'reps', text)}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                style={styles.checkButton}
                                onPress={() => updateSet(exercise.id, index, 'completed', !set.completed)}
                            >
                                <FontAwesome
                                    name="check-circle"
                                    size={20}
                                    color={set.completed ? '#4CAF50' : '#ccc'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => removeSet(exercise.id, index)}
                                style={{ marginLeft: 10 }}
                            >
                                <FontAwesome name="times" size={16} color="#ff4444" opacity={0.5} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <Button
                        title="+ Añadir Serie"
                        onPress={() => addSet(exercise.id)}
                        variant="secondary"
                        style={styles.addSetButton}
                    />
                </Card>
            ))}

            <View style={styles.actionRow}>
                <Button
                    title="+ AÑADIR EJERCICIO"
                    onPress={addExercise}
                    variant="secondary"
                    style={styles.addExerciseButton}
                />
                {!isActive && (
                    <Button
                        title="USAR PLANTILLA"
                        onPress={() => setIsTemplateModalVisible(true)}
                        variant="secondary"
                        style={styles.useTemplateBtn}
                    />
                )}
            </View>

            {exercises.length > 0 && (
                <Button
                    title="FINALIZAR ENTRENAMIENTO"
                    onPress={finishWorkout}
                    style={styles.finishButton}
                />
            )}

            <Modal visible={isTemplateModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Plantilla</Text>
                            <TouchableOpacity onPress={() => setIsTemplateModalVisible(false)}>
                                <FontAwesome name="times" size={24} color="#888" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {ROUTINES.map((routine, i) => (
                                <TouchableOpacity key={i} onPress={() => loadTemplate(routine)}>
                                    <Card style={styles.templateCard}>
                                        <Text style={styles.templateName}>{routine.name}</Text>
                                        <Text style={styles.templateDesc}>
                                            {routine.exercises.length} ejercicios: {routine.exercises.slice(0, 2).map(e => e.name).join(', ')}...
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sessionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f95dc',
    },
    sessionDuration: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    templatePickerBtn: {
        backgroundColor: '#2f95dc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    templatePickerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    exerciseCard: {
        marginBottom: 16,
        padding: 12,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseNameInput: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2f95dc',
        flex: 1,
        marginRight: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    columnLabel: {
        fontSize: 12,
        opacity: 0.5,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    setNumberContainer: {
        alignItems: 'center',
    },
    setNumber: {
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        marginHorizontal: 4,
        padding: 6,
        textAlign: 'center',
    },
    checkButton: {
        width: 30,
        alignItems: 'center',
    },
    addSetButton: {
        marginTop: 8,
        paddingVertical: 8,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
    addExerciseButton: {
        flex: 1.2,
        marginRight: 8,
        borderColor: '#2f95dc',
        borderStyle: 'dashed',
    },
    useTemplateBtn: {
        flex: 1,
    },
    finishButton: {
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#4CAF50',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '60%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    templateCard: {
        padding: 16,
        marginBottom: 12,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2f95dc',
        marginBottom: 4,
    },
    templateDesc: {
        fontSize: 12,
        color: '#888',
    }
});
