import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { exercises } from '@/constants/mockData';
import * as Speech from 'expo-speech';
import { AlertCircle, CheckCircle2, ChevronRight, RotateCcw, Trophy, Volume2, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const SESSION_LENGTH = 5;

export default function PracticaRapidaScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [sessionExercises, setSessionExercises] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const progressAnim = React.useRef(new Animated.Value(0)).current;

    const startNewSession = () => {
        const shuffled = [...exercises].sort(() => 0.5 - Math.random());
        setSessionExercises(shuffled.slice(0, SESSION_LENGTH));
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setScore(0);
        setIsFinished(false);
    };

    useEffect(() => {
        startNewSession();
    }, []);

    useEffect(() => {
        if (sessionExercises.length > 0) {
            Animated.timing(progressAnim, {
                toValue: (currentIndex) / SESSION_LENGTH,
                duration: 400,
                useNativeDriver: false,
            }).start();
        }
    }, [currentIndex, sessionExercises.length]);

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
    };

    if (sessionExercises.length === 0) return null;

    if (isFinished) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Sesión Completa!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 24 }]}>
                        Has respondido correctamente {score} de {SESSION_LENGTH} preguntas.
                    </Text>

                    <View style={[styles.scoreBox, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.scoreText, { color: theme.primary }]}>{Math.round((score / SESSION_LENGTH) * 100)}%</Text>
                    </View>

                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%', marginTop: 24 }]}
                        onPress={startNewSession}
                    >
                        <RotateCcw size={20} color="white" />
                        <Text style={styles.primaryButtonText}>Nueva Sesión</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const currentExercise = sessionExercises[currentIndex];
    const isCorrect = selectedOption === currentExercise.correctAnswer;

    const handleOptionPress = (option: string) => {
        if (showFeedback) return;
        setSelectedOption(option);
        setShowFeedback(true);
        if (option === currentExercise.correctAnswer) {
            setScore(prev => prev + 1);
            speak(option);
        }
    };

    const nextExercise = () => {
        if (currentIndex < SESSION_LENGTH - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            setIsFinished(true);
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
            <View style={styles.cardContainer}>
                <View style={[styles.progressBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.progressText, { color: theme.text }]}>Pregunta {currentIndex + 1} de {SESSION_LENGTH}</Text>
                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                        <Animated.View style={[styles.progressBarFill, {
                            backgroundColor: theme.primary,
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }]} />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.questionLabel, { color: theme.muted }]}>RETO RÁPIDO</Text>
                    <Text style={[styles.questionText, { color: theme.text }]}>{currentExercise.question}</Text>

                    <View style={styles.optionsContainer}>
                        {currentExercise.options.map((option) => {
                            const isActive = selectedOption === option;
                            const isOptionCorrect = option === currentExercise.correctAnswer;

                            let bgColor = theme.card;
                            let borderColor = theme.border;

                            if (showFeedback) {
                                if (isOptionCorrect) {
                                    bgColor = '#E8F5E9';
                                    borderColor = theme.success;
                                } else if (isActive && !isOptionCorrect) {
                                    bgColor = '#FFEBEE';
                                    borderColor = theme.error;
                                }
                            } else if (isActive) {
                                borderColor = theme.primary;
                            }

                            return (
                                <Pressable
                                    key={option}
                                    style={[styles.optionButton, { backgroundColor: bgColor, borderColor }]}
                                    onPress={() => handleOptionPress(option)}>
                                    <View style={styles.optionContent}>
                                        <Pressable
                                            onPress={() => speak(option)}
                                            style={styles.speakerButtonSmall}
                                        >
                                            <Volume2 size={16} color={theme.primary} />
                                        </Pressable>
                                        <Text style={[styles.optionText, { color: theme.text }]}>{option}</Text>
                                    </View>
                                    {showFeedback && isOptionCorrect && (
                                        <CheckCircle2 size={20} color={theme.success} />
                                    )}
                                    {showFeedback && isActive && !isOptionCorrect && (
                                        <XCircle size={20} color={theme.error} />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    {showFeedback && (
                        <View style={[styles.feedbackContainer, { backgroundColor: isCorrect ? '#F1F8E9' : '#FFF3E0' }]}>
                            <View style={styles.feedbackHeader}>
                                {isCorrect ? (
                                    <CheckCircle2 size={18} color={theme.success} />
                                ) : (
                                    <AlertCircle size={18} color="#FF9800" />
                                )}
                                <Text style={[styles.feedbackTitle, { color: isCorrect ? theme.success : '#E65100' }]}>
                                    {isCorrect ? '¡Excelente!' : 'Casi...'}
                                </Text>
                            </View>
                            <Text style={styles.feedbackText}>
                                {isCorrect ? '¡Respuesta correcta!' : currentExercise.tip}
                            </Text>
                        </View>
                    )}
                </View>

                {showFeedback && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.nextButton,
                            { backgroundColor: theme.primary },
                            pressed && { opacity: 0.9 }
                        ]}
                        onPress={nextExercise}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex < SESSION_LENGTH - 1 ? 'Siguiente' : 'Ver resultados'}
                        </Text>
                        <ChevronRight size={20} color="white" />
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        padding: Theme.spacing.md,
        gap: Theme.spacing.lg,
    },
    progressBox: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
    card: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        ...Theme.shadows.medium,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    scoreBox: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    questionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: Theme.spacing.sm,
    },
    questionText: {
        ...Theme.typography.h2,
        marginBottom: Theme.spacing.xl,
    },
    optionsContainer: {
        gap: Theme.spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 2,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    speakerButtonSmall: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#f0f9ff',
    },
    optionText: {
        ...Theme.typography.body,
        fontWeight: '500',
    },
    feedbackContainer: {
        marginTop: Theme.spacing.xl,
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.xs,
        marginBottom: 4,
    },
    feedbackTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    feedbackText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.full,
        gap: Theme.spacing.sm,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 30,
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
