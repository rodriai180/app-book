import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Volume2, Info, Lightbulb } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { vocabulary } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function VocabDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
    };

    const item = vocabulary.find((v) => v.id === id);

    if (!item) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Palabra no encontrada</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Detalle',
            }} />
            <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
                <View style={styles.header}>
                    <View style={[styles.wordHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.wordText, { color: theme.primary }]}>{item.word}</Text>
                        <Text style={[styles.translationText, { color: theme.text }]}>{item.translation}</Text>
                        <Pressable
                            style={[styles.listenButton, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}
                            onPress={() => speak(item.word)}
                        >
                            <Volume2 size={24} color={theme.primary} />
                            <Text style={[styles.listenText, { color: theme.primary }]}>Escuchar pronunciación</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Info size={18} color={theme.muted} />
                        <Text style={[styles.sectionTitle, { color: theme.muted }]}>EJEMPLOS DE USO</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.exampleRow}>
                            <Pressable onPress={() => speak(item.example)} style={styles.speakerButtonSmall}>
                                <Volume2 size={16} color={theme.primary} />
                            </Pressable>
                            <Text style={[styles.primaryExample, { color: theme.text, flex: 1 }]}>"{item.example}"</Text>
                        </View>
                        <View style={styles.divider} />
                        {item.extraExamples.map((ex, i) => (
                            <View key={i} style={styles.exampleRowSmall}>
                                <Pressable onPress={() => speak(ex)} style={styles.speakerButtonSmall}>
                                    <Volume2 size={14} color={theme.primary} />
                                </Pressable>
                                <Text style={[styles.secondaryExample, { color: theme.muted, flex: 1 }]}>• {ex}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Lightbulb size={18} color="#FF9800" />
                        <Text style={[styles.sectionTitle, { color: '#FF9800' }]}>TIP DE USO</Text>
                    </View>
                    <View style={[styles.tipCard, { backgroundColor: '#FFF9C4', borderColor: '#FFF176' }]}>
                        <Text style={styles.tipText}>{item.usageTip}</Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: Theme.spacing.md,
    },
    wordHeader: {
        padding: Theme.spacing.xl,
        alignItems: 'center',
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        ...Theme.shadows.medium,
    },
    wordText: {
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 24,
        fontWeight: '500',
        opacity: 0.8,
        marginBottom: Theme.spacing.lg,
    },
    listenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: Theme.roundness.full,
        borderWidth: 1,
    },
    listenText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        padding: Theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Theme.spacing.sm,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    card: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
    },
    primaryExample: {
        fontSize: 18,
        fontStyle: 'italic',
        lineHeight: 26,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: Theme.spacing.md,
    },
    secondaryExample: {
        fontSize: 15,
        marginBottom: 0,
    },
    exampleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    exampleRowSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    speakerButtonSmall: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#f0f9ff',
    },
    tipCard: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
    },
    tipText: {
        fontSize: 15,
        color: '#5D4037',
        lineHeight: 22,
    },
});
