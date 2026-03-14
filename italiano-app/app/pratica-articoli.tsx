import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/constants/mockData';
import { Theme } from '@/constants/Theme';
import { getExercisesByLessonId } from '@/services/firestoreService';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, ChevronRight, Info, RotateCcw, Trophy, Volume2, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

// Subtopics to include in this practice screen
const RELEVANT_SUBTOPICS = [
    'Artículos Determinativos',
    'Artículos Indeterminativos',
    'Formación del plural',
    'Pronunciación especial'
];

export default function PraticaArticoliScreen() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const theme = Colors[colorScheme ?? 'light'];
    const { width } = useWindowDimensions();

    const [practiceExercises, setPracticeExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showTip, setShowTip] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [errors, setErrors] = useState<number[]>([]);

    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await getExercisesByLessonId('3');
                const filtered = data.filter(ex => RELEVANT_SUBTOPICS.includes(ex.subtopic || ''));
                setPracticeExercises(filtered);
            } catch (error) {
                console.error('Error fetching articole exercises:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.95 });
    };

    useEffect(() => {
        if (practiceExercises.length > 0) {
            Animated.timing(progressAnim, {
                toValue: (currentIndex) / practiceExercises.length,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [currentIndex, practiceExercises.length]);

    const handleOptionSelect = (option: string) => {
        if (selectedOption || practiceExercises.length === 0) return;
        setSelectedOption(option);

        const currentEx = practiceExercises[currentIndex];
        if (option === currentEx.correctAnswer) {
            setCorrectCount(prev => prev + 1);
            speak('Bene! ' + currentEx.question.replace('_______', option));
        } else {
            speak(option);
            setErrors(prev => [...prev, currentIndex]);
        }
    };

    const nextStep = () => {
        if (currentIndex < practiceExercises.length - 1) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setShowTip(false);
                fadeAnim.setValue(1);
            });
        } else {
            setIsCompleted(true);
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const ricomincia = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowTip(false);
        setIsCompleted(false);
        setCorrectCount(0);
        setErrors([]);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.muted, marginTop: 10 }}>Cargando ejercicios...</Text>
            </View>
        );
    }

    if (practiceExercises.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Nessun esercizio trovato.</Text>
                <Pressable onPress={() => router.back()}><Text style={{ color: theme.primary, marginTop: 20 }}>Torna indietro</Text></Pressable>
            </View>
        );
    }

    const currentEx = practiceExercises[currentIndex];

    if (isCompleted) {
        return (
            <>
                <Stack.Screen options={{ title: 'Completato', headerShown: false }} />
                <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30, elevation: 10 }]}>
                        <Trophy size={80} color="#FFD700" style={{ marginBottom: 20 }} />
                        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>Ottimo Lavoro!</Text>
                        <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                            Hai completato la pratica su articoli e generi.
                        </Text>
                        <View style={[styles.resultsBoard, { backgroundColor: theme.surface }]}>
                            <View style={styles.resultItem}>
                                <Text style={[styles.resultLabel, { color: theme.muted }]}>CORRETTE</Text>
                                <Text style={[styles.resultValue, { color: theme.success }]}>{correctCount}</Text>
                            </View>
                            <View style={[styles.resultDivider, { backgroundColor: theme.border }]} />
                            <View style={styles.resultItem}>
                                <Text style={[styles.resultLabel, { color: theme.muted }]}>ERRORI</Text>
                                <Text style={[styles.resultValue, { color: theme.error }]}>{errors.length}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%', marginTop: 24 }]}
                            onPress={ricomincia}
                        >
                            <RotateCcw size={18} color="white" />
                            <Text style={styles.primaryButtonText}>Ricomincia</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                            onPress={() => router.back()}
                        >
                            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Torna alla lezione</Text>
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Pratica: Articoli e Genere',
                headerTransparent: true,
                headerTintColor: theme.primary
            }} />
            <View style={[styles.container, { backgroundColor: theme.surface }]}>
                <View style={[styles.progressBarContainer, { paddingTop: 100 }]}>
                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: theme.primary,
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <View style={styles.header}>
                            <Text style={[styles.subtopicBadge, { color: theme.primary, borderColor: theme.primary }]}>
                                {currentEx.subtopic ? currentEx.subtopic.toUpperCase() : 'ARTICOLI'}
                            </Text>
                        </View>
                        <View style={[styles.exerciseContainer]}>
                            <View style={styles.questionSpeakerRow}>
                                <Pressable onPress={() => speak(currentEx.question.replace('_______', selectedOption || ''))} style={styles.audioIconLarge}>
                                    <Volume2 size={24} color={theme.primary} />
                                </Pressable>
                                <Text style={[styles.exerciseQuestion, { color: theme.text }]}>
                                    {currentEx.question.split('_______').map((part, i) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i === 0 && (
                                                <View style={[
                                                    styles.blank,
                                                    {
                                                        backgroundColor: selectedOption ? (selectedOption === currentEx.correctAnswer ? '#dcfce7' : '#fee2e2') : theme.surface,
                                                        borderColor: selectedOption ? (selectedOption === currentEx.correctAnswer ? '#22c55e' : '#ef4444') : theme.border
                                                    }
                                                ]}>
                                                    <Text style={{
                                                        color: selectedOption ? (selectedOption === currentEx.correctAnswer ? '#166534' : '#991b1b') : theme.primary,
                                                        fontWeight: 'bold',
                                                        fontSize: 22
                                                    }}>
                                                        {selectedOption || '___'}
                                                    </Text>
                                                </View>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Text>
                            </View>
                            <View style={styles.optionsGrid}>
                                {currentEx.options.map((option, idx) => {
                                    const isSelected = selectedOption === option;
                                    const isAnswer = option === currentEx.correctAnswer;
                                    const hasSelected = selectedOption !== null;
                                    let optionStyle = { backgroundColor: theme.card, borderColor: theme.border };
                                    let textColor = theme.text;
                                    if (hasSelected) {
                                        if (isSelected) {
                                            if (isAnswer) {
                                                optionStyle = { backgroundColor: '#dcfce7', borderColor: '#22c55e' };
                                                textColor = '#166534';
                                            } else {
                                                optionStyle = { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
                                                textColor = '#991b1b';
                                            }
                                        } else if (isAnswer) {
                                            optionStyle = { backgroundColor: '#dcfce7', borderColor: '#22c55e' };
                                            textColor = '#166534';
                                        }
                                    }
                                    return (
                                        <Pressable
                                            key={idx}
                                            style={[styles.optionButton, optionStyle, isSelected && !hasSelected && { borderColor: theme.primary }]}
                                            onPress={() => handleOptionSelect(option)}
                                            disabled={hasSelected}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={[styles.audioIconMini, { backgroundColor: theme.surface }]}>
                                                    <Volume2 size={14} color={theme.primary} />
                                                </View>
                                                <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                                            </View>
                                            {hasSelected && isSelected && (
                                                isAnswer ? <CheckCircle2 size={20} color="#22c55e" /> : <XCircle size={20} color="#ef4444" />
                                            )}
                                            {hasSelected && !isSelected && isAnswer && (
                                                <CheckCircle2 size={20} color="#22c55e" />
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </View>
                            {selectedOption && (
                                <View style={styles.feedbackContainer}>
                                    <View style={[styles.tipCard, { backgroundColor: selectedOption === currentEx.correctAnswer ? '#f0fdf4' : '#fff7ed', borderColor: selectedOption === currentEx.correctAnswer ? '#dcfce7' : '#ffedd5' }]}>
                                        <View style={styles.tipHeader}>
                                            <Info size={16} color={selectedOption === currentEx.correctAnswer ? '#16a34a' : '#ea580c'} />
                                            <Text style={[styles.tipTitle, { color: selectedOption === currentEx.correctAnswer ? '#16a34a' : '#ea580c' }]}>
                                                {selectedOption === currentEx.correctAnswer ? 'Ottimo!' : 'Suggerimento:'}
                                            </Text>
                                        </View>
                                        <Text style={[styles.tipText, { color: theme.text }]}>{currentEx.tip}</Text>
                                    </View>
                                    <Pressable
                                        style={[styles.nextButton, { backgroundColor: theme.primary }]}
                                        onPress={nextStep}
                                    >
                                        <Text style={styles.nextButtonText}>
                                            {currentIndex < practiceExercises.length - 1 ? 'CONTINUA' : 'FINIRE'}
                                        </Text>
                                        <ChevronRight size={20} color="white" />
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: Theme.spacing.lg,
        paddingTop: 20,
        paddingBottom: 40,
    },
    progressBarContainer: {
        paddingHorizontal: Theme.spacing.lg,
        width: '100%',
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    subtopicBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    exerciseContainer: {
        width: '100%',
    },
    questionSpeakerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 15,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    audioIconLarge: {
        padding: 12,
        backgroundColor: '#f0f9ff',
        borderRadius: 20,
        elevation: 2,
    },
    exerciseQuestion: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 40,
        textAlign: 'center',
        flexShrink: 1,
    },
    blank: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: 8 }],
        marginHorizontal: 8,
    },
    optionsGrid: {
        gap: 12,
        marginTop: 10,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        borderRadius: 18,
        borderWidth: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    audioIconMini: {
        padding: 6,
        borderRadius: 10,
    },
    optionText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    feedbackContainer: {
        marginTop: 30,
        gap: 15,
    },
    tipCard: {
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    tipTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    tipText: {
        fontSize: 16,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
    resultsBoard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    resultItem: {
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    resultDivider: {
        width: 1,
        height: 40,
    },
    primaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        gap: 10,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 2,
        gap: 10,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        ...Theme.shadows.medium,
        marginBottom: Theme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    }
});
