import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Exercise } from '@/constants/mockData';
import { getExercisesByLessonId } from '@/services/firestoreService';
import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, ChevronLeft, Info, Trophy, XCircle } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RetoRapidoScreen() {
    const { lessonId, subtopic } = useLocalSearchParams<{ lessonId: string; subtopic: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showTip, setShowTip] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const progressAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchExercises = async () => {
            if (!lessonId) return;
            try {
                const data = await getExercisesByLessonId(lessonId);
                setAllExercises(data);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, [lessonId]);

    // Filter exercises for this lesson and subtopic
    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex =>
            !subtopic || ex.subtopic === subtopic
        );
    }, [allExercises, subtopic]);

    useEffect(() => {
        if (filteredExercises.length > 0) {
            Animated.timing(progressAnim, {
                toValue: (currentStep) / filteredExercises.length,
                duration: 400,
                useNativeDriver: false,
            }).start();
        }
    }, [currentStep, filteredExercises.length]);

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
    };

    const playErrorSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://www.soundjay.com/buttons/beep-10.mp3' }
            );
            await sound.playAsync();
            // Automatically unload sound to prevent memory leaks
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    const handleOptionSelect = (option: string) => {
        if (selectedOption || isFinished) return;

        setSelectedOption(option);
        const correct = option === filteredExercises[currentStep].correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
            // Replace the blank and strip "A: " / "B: " labels for natural reading
            const rawDialogue = filteredExercises[currentStep].question.replace('_______', option);
            const cleanDialogue = rawDialogue.replace(/A: |B: /g, '');
            speak(cleanDialogue);
        } else {
            playErrorSound();
        }
    };

    const nextStep = () => {
        if (currentStep < filteredExercises.length - 1) {
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowTip(false);
        } else {
            setIsFinished(true);
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const resetPractice = () => {
        setCurrentStep(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowTip(false);
        setScore(0);
        setIsFinished(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.muted, marginTop: 10 }}>Cargando reto...</Text>
            </View>
        );
    }

    if (filteredExercises.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>No hay ejercicios disponibles para este reto.</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    if (isFinished) {
        return (
            <>
                <Stack.Screen options={{ title: '¡Reto Completado!' }} />
                <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <View style={[styles.resultCard, { backgroundColor: theme.card }]}>
                        <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Buen trabajo!</Text>
                        <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 24 }]}>
                            Has completado el reto de{"\n"}{subtopic || "esta lección"}
                        </Text>

                        <View style={[styles.scoreContainer, { backgroundColor: theme.surface }]}>
                            <Text style={[styles.scoreValue, { color: theme.primary }]}>{score} / {filteredExercises.length}</Text>
                            <Text style={[styles.scoreLabel, { color: theme.muted }]}>Respuestas correctas</Text>
                        </View>

                        <Pressable
                            style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%', marginTop: 24 }]}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.primaryButtonText}>Volver a la clase</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                            onPress={resetPractice}
                        >
                            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Repetir Reto</Text>
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    const currentEx = filteredExercises[currentStep];

    return (
        <>
            <Stack.Screen options={{
                title: 'Reto Rápido',
            }} />
            <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
                <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.progressText, { color: theme.text }]}>Esercizio {currentStep + 1} di {filteredExercises.length}</Text>
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
                    {currentEx.question.includes(' B:') ? (
                        <>
                            <Text style={[styles.questionText, { color: theme.text, marginBottom: 8 }]}>
                                {currentEx.question.split(' B:')[0]}
                            </Text>
                            <Text style={[styles.questionText, { color: theme.text }]}>
                                B: {currentEx.question.split(' B:')[1]}
                            </Text>
                        </>
                    ) : (
                        <Text style={[styles.questionText, { color: theme.text }]}>{currentEx.question}</Text>
                    )}

                    <View style={styles.optionsContainer}>
                        {currentEx.options.map((option, idx) => {
                            const isSelected = selectedOption === option;
                            const isCorrectAnswer = option === currentEx.correctAnswer;

                            let btnStyle = { backgroundColor: theme.surface, borderColor: theme.border };
                            let textColor = theme.text;

                            if (selectedOption) {
                                if (isCorrectAnswer) {
                                    btnStyle = { backgroundColor: '#dcfce7', borderColor: '#22c55e' };
                                    textColor = '#166534';
                                } else if (isSelected) {
                                    btnStyle = { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
                                    textColor = '#991b1b';
                                }
                            }

                            return (
                                <Pressable
                                    key={idx}
                                    style={[styles.optionButton, btnStyle]}
                                    onPress={() => handleOptionSelect(option)}
                                    disabled={!!selectedOption}
                                >
                                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                                    {selectedOption && isCorrectAnswer && (
                                        <CheckCircle2 size={20} color="#22c55e" />
                                    )}
                                    {selectedOption && isSelected && !isCorrectAnswer && (
                                        <XCircle size={20} color="#ef4444" />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    {selectedOption && (
                        <View style={styles.feedbackContainer}>
                            <Pressable
                                style={styles.tipToggle}
                                onPress={() => setShowTip(!showTip)}
                            >
                                <Info size={16} color={theme.primary} />
                                <Text style={[styles.tipToggleText, { color: theme.primary }]}>
                                    {showTip ? 'Ocultar explicación' : 'Ver explicación'}
                                </Text>
                            </Pressable>

                            {showTip && (
                                <View style={[styles.tipBox, { backgroundColor: theme.surface }]}>
                                    <Text style={[styles.tipText, { color: theme.muted }]}>{currentEx.tip}</Text>
                                </View>
                            )}

                            <Pressable
                                style={[styles.nextButton, { backgroundColor: theme.primary }]}
                                onPress={nextStep}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentStep < filteredExercises.length - 1 ? 'Siguiente' : 'Finalizar'}
                                </Text>
                                <ChevronLeft size={20} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                            </Pressable>
                        </View>
                    )}
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
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.lg,
    },
    headerCategory: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    progressCard: {
        marginHorizontal: Theme.spacing.lg,
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: Theme.spacing.lg,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
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
        marginHorizontal: Theme.spacing.lg,
        padding: Theme.spacing.xl,
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        ...Theme.shadows.medium,
        marginBottom: Theme.spacing.xxl,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: Theme.spacing.xl,
        lineHeight: 30,
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
        borderWidth: 2,
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
    },
    feedbackContainer: {
        marginTop: Theme.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: Theme.spacing.lg,
    },
    tipToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Theme.spacing.md,
    },
    tipToggleText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    tipBox: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.md,
        marginBottom: Theme.spacing.lg,
    },
    tipText: {
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: Theme.roundness.full,
        gap: 8,
        ...Theme.shadows.medium,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        padding: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        ...Theme.shadows.medium,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    scoreContainer: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '900',
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    primaryButton: {
        paddingVertical: 16,
        borderRadius: Theme.roundness.full,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 16,
        borderRadius: Theme.roundness.full,
        alignItems: 'center',
        borderWidth: 1,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
