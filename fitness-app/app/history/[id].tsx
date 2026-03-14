import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { Card, Button } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams();
    const { history } = useWorkout();
    const router = useRouter();
    const colorScheme = useColorScheme();

    const workout = history.find(w => w.id === id);

    if (!workout) {
        return (
            <View style={styles.center}>
                <Text>Entrenamiento no encontrado</Text>
                <Button title="Volver" onPress={() => router.back()} style={{ marginTop: 20 }} />
            </View>
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Detalle de Sesión', headerTitle: workout.date }} />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={styles.summaryItem}>
                        <FontAwesome name="clock-o" size={20} color="#2f95dc" />
                        <Text style={styles.summaryLabel}>Duración</Text>
                        <Text style={styles.summaryValue}>{formatTime(workout.duration)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <FontAwesome name="bolt" size={20} color="#2f95dc" />
                        <Text style={styles.summaryLabel}>Ejercicios</Text>
                        <Text style={styles.summaryValue}>{workout.exercises.length}</Text>
                    </View>
                </View>

                {workout.exercises.map((exercise, exIndex) => (
                    <Card key={exIndex} style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.columnLabel, { flex: 1 }]}>Serie</Text>
                            <Text style={[styles.columnLabel, { flex: 2 }]}>Peso (kg)</Text>
                            <Text style={[styles.columnLabel, { flex: 2 }]}>Reps</Text>
                        </View>

                        {exercise.sets.map((set, setIndex) => (
                            <View key={setIndex} style={styles.setRow}>
                                <Text style={[styles.setText, { flex: 1 }]}>{setIndex + 1}</Text>
                                <Text style={[styles.setText, { flex: 2 }]}>{set.weight || '0'}</Text>
                                <Text style={[styles.setText, { flex: 2 }]}>{set.reps || '0'}</Text>
                            </View>
                        ))}
                    </Card>
                ))}

                <Button
                    title="VOLVER AL HISTORIAL"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={styles.backButton}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(47, 149, 220, 0.1)',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
    },
    exerciseCard: {
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f95dc',
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 4,
    },
    columnLabel: {
        fontSize: 12,
        opacity: 0.5,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    setText: {
        textAlign: 'center',
        fontSize: 14,
    },
    backButton: {
        marginTop: 10,
        marginBottom: 40,
    },
});
