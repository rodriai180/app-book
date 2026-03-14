import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';

export default function HistorialScreen() {
    const colorScheme = useColorScheme();
    const { history } = useWorkout();
    const router = useRouter();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="calendar-o" size={50} color="#ccc" />
                    <Text style={styles.emptyText}>No hay entrenamientos guardados aún.</Text>
                </View>
            ) : (
                history.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/history/${item.id}`)}
                    >
                        <Card style={styles.historyCard}>
                            <View style={styles.cardMain}>
                                <View>
                                    <Text style={styles.dateText}>{item.date}</Text>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.sessionTitle}>Sesión de Entrenamiento</Text>
                                    </View>
                                </View>
                                <FontAwesome name="chevron-right" size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.stat}>
                                    <FontAwesome name="clock-o" size={12} color="#666" style={{ marginRight: 4 }} />
                                    <Text style={styles.statText}>{formatDuration(item.duration)}</Text>
                                </View>
                                <View style={styles.stat}>
                                    <FontAwesome name="bolt" size={12} color="#666" style={{ marginRight: 4 }} />
                                    <Text style={styles.statText}>{item.exercises.length} ejercicios</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

// ... styles below

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyCard: {
        marginBottom: 12,
    },
    cardMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateText: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 2,
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardFooter: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingTop: 8,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        fontSize: 12,
        color: '#666',
    },
});
