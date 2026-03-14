import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Modal, ViewStyle, TextStyle } from 'react-native';
import { Text } from '@/components/Themed';
import { Card, Button } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface ExerciseDetail {
    id: string;
    name: string;
    muscle: string;
    secondaryMuscles: string[];
    equipment: string;
    level: 'Principiante' | 'Intermedio' | 'Avanzado';
    description: string;
    benefits: string[];
}

const EXERCISES_DATA: ExerciseDetail[] = [
    {
        id: '1',
        name: 'Press de Banca',
        muscle: 'Pecho',
        secondaryMuscles: ['Tríceps', 'Hombro frontal'],
        equipment: 'Barra',
        level: 'Principiante',
        description: 'Túmbate en un banco plano, baja la barra hasta el pecho y empuja hacia arriba extendiendo los brazos.',
        benefits: ['Fuerza en tren superior', 'Desarrollo pectoral', 'Estabilidad de hombros'],
    },
    {
        id: '2',
        name: 'Sentadilla Libre',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos', 'Lumbar'],
        equipment: 'Barra',
        level: 'Principiante',
        description: 'Baja la cadera manteniendo la espalda recta hasta que los muslos estén paralelos al suelo y vuelve a subir.',
        benefits: ['Fuerza funcional', 'Quema de calorías', 'Densidad ósea'],
    },
    {
        id: '3',
        name: 'Peso Muerto',
        muscle: 'Espalda',
        secondaryMuscles: ['Isquiotibiales', 'Glúteos', 'Core'],
        equipment: 'Barra',
        level: 'Intermedio',
        description: 'Levanta la barra desde el suelo hasta que estés erguido, manteniendo la barra cerca de las piernas.',
        benefits: ['Postura mejorada', 'Fuerza en cadena posterior', 'Agarre potente'],
    },
    {
        id: '4',
        name: 'Press Militar',
        muscle: 'Hombros',
        secondaryMuscles: ['Tríceps', 'Core'],
        equipment: 'Barra',
        level: 'Intermedio',
        description: 'Empuja el peso por encima de la cabeza desde los hombros hasta extender los brazos completamente.',
        benefits: ['Hombros redondeados', 'Estabilidad del tronco'],
    },
    {
        id: '5',
        name: 'Dominadas',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps', 'Antebrazos'],
        equipment: 'Peso corporal',
        level: 'Intermedio',
        description: 'Cuélgate de una barra y tira de tu cuerpo hacia arriba hasta que la barbilla supere la barra.',
        benefits: ['Espalda ancha (V-taper)', 'Fuerza relativa'],
    },
    {
        id: '6',
        name: 'Curl de Bíceps',
        muscle: 'Brazos',
        secondaryMuscles: ['Antebrazos'],
        equipment: 'Mancuernas',
        level: 'Principiante',
        description: 'Flexiona los codos para llevar las pesas hacia los hombros sin balancear el cuerpo.',
        benefits: ['Aislamiento de bíceps', 'Estética del brazo'],
    },
    {
        id: '7',
        name: 'Plancha Abdominal',
        muscle: 'Core',
        secondaryMuscles: ['Hombros', 'Glúteos'],
        equipment: 'Peso corporal',
        level: 'Principiante',
        description: 'Mantén el cuerpo recto apoyado en los antebrazos y las puntas de los pies durante un tiempo determinado.',
        benefits: ['Estabilidad central', 'Prevención de dolor lumbar'],
    },
    {
        id: '8',
        name: 'Zancadas',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos', 'Core'],
        equipment: 'Mancuernas',
        level: 'Principiante',
        description: 'Da un paso largo hacia adelante y baja la rodilla trasera hasta casi tocar el suelo.',
        benefits: ['Equilibrio unilateral', 'Coordinación'],
    },
];

export default function EjerciciosScreen() {
    const colorScheme = useColorScheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null);

    const categories = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

    const filteredExercises = EXERCISES_DATA.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.muscle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || ex.muscle === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getLevelStyle = (level: string): ViewStyle => {
        return {
            backgroundColor: level === 'Principiante' ? '#4CAF50' : '#FF9800',
        };
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <FontAwesome name="search" size={16} color="#888" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Buscar ejercicio o músculo..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <FontAwesome name="times-circle" size={16} color="#ccc" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                                styles.filterChip,
                                selectedCategory === cat && styles.filterChipActive
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === cat && styles.filterTextActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
                {filteredExercises.length === 0 ? (
                    <View style={styles.emptyResults}>
                        <FontAwesome name="search-minus" size={40} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron ejercicios.</Text>
                    </View>
                ) : (
                    filteredExercises.map((exercise) => (
                        <TouchableOpacity key={exercise.id} onPress={() => setSelectedExercise(exercise)}>
                            <Card style={styles.exerciseCard}>
                                <View style={styles.exerciseInfo}>
                                    <View style={styles.imagePlaceholder}>
                                        <FontAwesome
                                            name={exercise.muscle === 'Core' ? 'shield' : 'child'}
                                            size={20}
                                            color="#2f95dc"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                        <View style={styles.tagRow}>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>{exercise.muscle}</Text>
                                            </View>
                                            <View style={[styles.tag, getLevelStyle(exercise.level)]}>
                                                <Text style={[styles.tagText, { color: '#fff' }]}>{exercise.level}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <FontAwesome name="info-circle" size={20} color="#2f95dc" style={{ opacity: 0.5 }} />
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <Modal
                visible={!!selectedExercise}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedExercise(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedExercise(null)}>
                                <FontAwesome name="times" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.detailSection}>
                                <Text style={styles.sectionLabel}>Músculo Principal</Text>
                                <Text style={styles.sectionValue}>{selectedExercise?.muscle}</Text>
                            </View>

                            <View style={styles.detailSection}>
                                <Text style={styles.sectionLabel}>Músculos Secundarios</Text>
                                <View style={styles.secondaryMusclesRow}>
                                    {selectedExercise?.secondaryMuscles.map(m => (
                                        <View key={m} style={styles.secondaryBadge}>
                                            <Text style={styles.secondaryBadgeText}>{m}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.detailSection}>
                                <Text style={styles.sectionLabel}>Ejecución</Text>
                                <Text style={styles.descriptionText}>{selectedExercise?.description}</Text>
                            </View>

                            <View style={styles.detailSection}>
                                <Text style={styles.sectionLabel}>Beneficios</Text>
                                {selectedExercise?.benefits.map((b, i) => (
                                    <View key={i} style={styles.benefitItem}>
                                        <FontAwesome name="check" size={12} color="#4CAF50" style={{ marginRight: 8 }} />
                                        <Text style={styles.benefitText}>{b}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <Button
                            title="CERRAR"
                            onPress={() => setSelectedExercise(null)}
                            style={styles.closeModalBtn}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    } as ViewStyle,
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    } as ViewStyle,
    searchInput: {
        flex: 1,
        fontSize: 16,
    } as TextStyle,
    filtersContainer: {
        height: 50,
        marginBottom: 8,
    } as ViewStyle,
    filtersScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    } as ViewStyle,
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginRight: 8,
    } as ViewStyle,
    filterChipActive: {
        backgroundColor: '#2f95dc',
    } as ViewStyle,
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    } as TextStyle,
    filterTextActive: {
        color: '#fff',
    } as TextStyle,
    listContainer: {
        flex: 1,
    } as ViewStyle,
    listContent: {
        padding: 16,
        paddingTop: 8,
    } as ViewStyle,
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 10,
    } as ViewStyle,
    exerciseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    } as ViewStyle,
    imagePlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(47, 149, 220, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    } as ViewStyle,
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    } as TextStyle,
    tagRow: {
        flexDirection: 'row',
    } as ViewStyle,
    tag: {
        backgroundColor: 'rgba(47, 149, 220, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
    } as ViewStyle,
    tagText: {
        fontSize: 11,
        color: '#2f95dc',
        fontWeight: '600',
    } as TextStyle,
    emptyResults: {
        alignItems: 'center',
        marginTop: 50,
        opacity: 0.5,
    } as ViewStyle,
    emptyText: {
        marginTop: 12,
        fontSize: 16,
    } as TextStyle,
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    } as ViewStyle,
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 24,
    } as ViewStyle,
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    } as ViewStyle,
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    } as TextStyle,
    modalBody: {
        flex: 1,
    } as ViewStyle,
    detailSection: {
        marginBottom: 20,
    } as ViewStyle,
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    } as TextStyle,
    sectionValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2f95dc',
    } as TextStyle,
    secondaryMusclesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    } as ViewStyle,
    secondaryBadge: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
    } as ViewStyle,
    secondaryBadgeText: {
        fontSize: 13,
        color: '#666',
    } as TextStyle,
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    } as TextStyle,
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    } as ViewStyle,
    benefitText: {
        fontSize: 15,
        color: '#444',
    } as TextStyle,
    closeModalBtn: {
        marginTop: 20,
    } as ViewStyle
});
