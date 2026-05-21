import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/constants/mockData';
import { Theme } from '@/constants/Theme';
import { getExercisesByLessonId } from '@/services/firestoreService';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, ChevronRight, Info, Trophy, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PraticaCalendarioScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [calendarioExercises, setCalendarioExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showFinished, setShowFinished] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await getExercisesByLessonId('9');
                setCalendarioExercises(data);
            } catch (error) {
                console.error('Error fetching calendar exercises:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', rate: 0.9 });
    };

    const handleOptionPress = (option: string) => {
        if (isCorrect !== null || calendarioExercises.length === 0) return;

        setSelectedOption(option);
        const correct = option === calendarioExercises[currentIndex].correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
            speak('Bene! ' + calendarioExercises[currentIndex].correctAnswer);
        } else {
            speak('No, riprova.');
        }
    };

    const nextExercise = () => {
        if (currentIndex < calendarioExercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowFinished(true);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.muted, marginTop: 10 }}>Cargando ejercicios...</Text>
            </View>
        );
    }

    if (calendarioExercises.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>No hay ejercicios disponibles.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentExercise = calendarioExercises[currentIndex];

    if (showFinished) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface }]}>
                <Stack.Screen options={{ title: 'Sesión Finalizada' }} />
                <View style={styles.finishedContent}>
                    <Trophy size={80} color={theme.primary} />
                    <Text style={[styles.finishedTitle, { color: theme.text }]}>¡Felicidades!</Text>
                    <Text style={[styles.finishedSubtitle, { color: theme.muted }]}>
                        Has dominado los números y el calendario.
                    </Text>
                    <View style={[styles.scoreCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.scoreLabel, { color: theme.muted }]}>Puntuación</Text>
                        <Text style={[styles.scoreValue, { color: theme.primary }]}>{score}/{calendarioExercises.length}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.primaryButtonText}>Volver a la clase</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <Stack.Screen options={{ title: 'Práctica: Tiempo' }} />

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                backgroundColor: theme.primary,
                                width: `${((currentIndex + 1) / calendarioExercises.length) * 100}%`
                            }
                        ]}
                    />
                </View>
                <Text style={[styles.progressText, { color: theme.muted }]}>
                    {currentIndex + 1} de {calendarioExercises.length}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.quizCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.subtopic, { color: theme.primary }]}>{currentExercise.subtopic}</Text>
                    <Text style={[styles.question, { color: theme.text }]}>{currentExercise.question}</Text>

                    <View style={styles.optionsContainer}>
                        {currentExercise.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    { borderColor: theme.border },
                                    selectedOption === option && (isCorrect ? styles.correctOption : styles.incorrectOption),
                                    selectedOption === option && { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }
                                ]}
                                onPress={() => handleOptionPress(option)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    { color: theme.text },
                                    selectedOption === option && { color: isCorrect ? '#2E7D32' : '#C62828' }
                                ]}>
                                    {option}
                                </Text>
                                {selectedOption === option && (
                                    isCorrect ? <CheckCircle2 size={20} color="#2E7D32" /> : <XCircle size={20} color="#C62828" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isCorrect !== null && (
                        <View style={[styles.feedbackContainer, { backgroundColor: isCorrect ? '#F1F8E9' : '#FFF3E0' }]}>
                            <View style={styles.feedbackHeader}>
                                <Info size={16} color={isCorrect ? '#558B2F' : '#EF6C00'} />
                                <Text style={[styles.feedbackTitle, { color: isCorrect ? '#558B2F' : '#EF6C00' }]}>
                                    {isCorrect ? '¡Correcto!' : 'Sugerencia'}
                                </Text>
                            </View>
                            <Text style={[styles.feedbackTip, { color: theme.text }]}>
                                {currentExercise.tip}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {isCorrect !== null && (
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: theme.primary }]}
                        onPress={nextExercise}
                    >
                        <Text style={styles.nextButtonText}>Siguiente</Text>
                        <ChevronRight size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressContainer: {
        padding: Theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: 'bold',
        minWidth: 50,
    },
    scrollContent: {
        padding: Theme.spacing.md,
        paddingBottom: 100,
    },
    quizCard: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        ...Theme.shadows.medium,
    },
    subtopic: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Theme.spacing.xs,
    },
    question: {
        ...Theme.typography.h2,
        fontSize: 22,
        marginBottom: Theme.spacing.xl,
    },
    optionsContainer: {
        gap: Theme.spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
    },
    correctOption: {
        borderColor: '#2E7D32',
    },
    incorrectOption: {
        borderColor: '#C62828',
    },
    feedbackContainer: {
        marginTop: Theme.spacing.xl,
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    feedbackTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    feedbackTip: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
        borderTopWidth: 1,
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.lg,
        gap: 8,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.xxl,
    },
    finishedTitle: {
        ...Theme.typography.h1,
        marginTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.sm,
    },
    finishedSubtitle: {
        ...Theme.typography.body,
        textAlign: 'center',
        marginBottom: Theme.spacing.xxl,
    },
    scoreCard: {
        padding: Theme.spacing.xl,
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        marginBottom: Theme.spacing.xxl,
    },
    scoreLabel: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    primaryButton: {
        width: '100%',
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.lg,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
