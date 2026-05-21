import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Info, Lightbulb, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    answer: string;
    dialogue: {
        person: string;
        text: string;
        hasInput?: boolean;
    }[];
    hint: string;
}

const ESERCIZI: Esercizio[] = [
    {
        id: 1,
        answer: 'Buongiorno',
        dialogue: [
            { person: 'A', text: '', hasInput: true },
            { person: 'B', text: 'Buongiorno, come sta?' },
            { person: 'A', text: 'Bene, grazie.' }
        ],
        hint: 'È un saluto formale che si usa la mattina.'
    },
    {
        id: 2,
        answer: 'Ciao',
        dialogue: [
            { person: 'A', text: '', hasInput: true },
            { person: 'A', text: ', Marco!' },
            { person: 'B', text: 'Ciao, Anna! Come va?' }
        ],
        hint: 'È il saluto più comune per amici e famiglia.'
    },
    {
        id: 3,
        answer: 'Come stai?',
        dialogue: [
            { person: 'A', text: 'Ciao! ' },
            { person: 'A', text: '', hasInput: true },
            { person: 'B', text: 'Sto bene, e tu?' }
        ],
        hint: 'Si usa per chiedere come va a un amico.'
    },
    {
        id: 4,
        answer: 'Come sta?',
        dialogue: [
            { person: 'A', text: 'Buongiorno, professore. ' },
            { person: 'A', text: '', hasInput: true },
            { person: 'B', text: 'Buongiorno, sto bene. E Lei?' }
        ],
        hint: 'Si usa per chiedere come va in modo formale.'
    },
    {
        id: 5,
        answer: 'Arrivederci',
        dialogue: [
            { person: 'A', text: 'Arrivederci, signora!' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ', a domani!' }
        ],
        hint: 'Un saluto formale quando si va via.'
    },
    {
        id: 6,
        answer: 'A presto',
        dialogue: [
            { person: 'A', text: 'Grazie per tutto. Ci vediamo!' },
            { person: 'B', text: 'Di niente! ' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: '!' }
        ],
        hint: 'Si dice quando si pensa di rivedere qualcuno a breve.'
    },
    {
        id: 7,
        answer: 'Buonanotte',
        dialogue: [
            { person: 'A', text: 'Vado a letto, sono stanco.' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ', sogni d’oro!' }
        ],
        hint: 'Si dice prima di andare a dormire.'
    }
];

export default function PraticaSalutiScreen() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const theme = Colors[colorScheme ?? 'light'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const progressAnim = useRef(new Animated.Value(0)).current;

    const currentEsercizio = ESERCIZI[currentIndex];
    const expectedAnswer = currentEsercizio.answer;

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
    };

    // Live validation
    const isCorrect = userInput === expectedAnswer;
    const hasStarted = userInput.length > 0;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentIndex) / ESERCIZI.length,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentIndex]);

    let feedbackMessage = '';
    let feedbackColor = theme.muted;
    let isWarning = false;

    if (hasStarted) {
        if (isCorrect) {
            feedbackMessage = 'Ottimo! Ben fatto.';
            feedbackColor = theme.success;
        } else {
            // Live tips in Italian
            if (userInput.toLowerCase() === expectedAnswer.toLowerCase()) {
                feedbackMessage = 'Controlla le maiuscole.';
                feedbackColor = '#E65100';
                isWarning = true;
            } else if (expectedAnswer.endsWith('?') && !userInput.endsWith('?')) {
                if (userInput.length >= expectedAnswer.length - 1) {
                    feedbackMessage = 'Attenzione al punto interrogativo.';
                    feedbackColor = '#E65100';
                    isWarning = true;
                } else {
                    feedbackMessage = '📝 Continua…';
                    feedbackColor = theme.muted;
                }
            } else if (userInput.includes('  ')) {
                feedbackMessage = 'Manca uno spazio o una virgola.';
                feedbackColor = '#E65100';
                isWarning = true;
            } else {
                feedbackMessage = '📝 Continua…';
                feedbackColor = theme.muted;
            }
        }
    }

    const handleVerifica = () => {
        if (isCorrect) {
            speak('Bene! ' + expectedAnswer);
            if (currentIndex < ESERCIZI.length - 1) {
                // Flash success then move
                setIsVerifying(true);
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    setUserInput('');
                    setShowHint(false);
                    setIsVerifying(false);
                }, 800);
            } else {
                setIsVerifying(true);
                setTimeout(() => {
                    setIsCompleted(true);
                    setIsVerifying(false);
                    // Fill progress bar to 100%
                    Animated.timing(progressAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }, 800);
            }
        }
    };

    const ricomincia = () => {
        setCurrentIndex(0);
        setUserInput('');
        setShowHint(false);
        setIsCompleted(false);
    };

    const resetEsercizio = () => {
        setUserInput('');
        setShowHint(false);
    };

    if (isCompleted) {
        return (
            <>
                <Stack.Screen options={{ title: 'Completato' }} />
                <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                        <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>Complimenti!</Text>
                        <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                            Hai completato la pratica.
                        </Text>

                        <Pressable
                            style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]}
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
            <Stack.Screen options={{ title: 'Pratica: Saluti' }} />
            <ScrollView
                style={[styles.container, { backgroundColor: theme.surface }]}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressText, { color: theme.text }]}>
                            Esercizio {currentIndex + 1} di {ESERCIZI.length}
                        </Text>
                    </View>
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

                <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : (isWarning ? '#FFB74D' : theme.border) }]}>
                    <View style={styles.dialogueContainer}>
                        {currentEsercizio.dialogue.reduce((acc: any[], line, idx) => {
                            // Find or create the row for this line
                            let lastRow = acc[acc.length - 1];
                            if (!lastRow || lastRow.person !== line.person) {
                                lastRow = { person: line.person, segments: [] };
                                acc.push(lastRow);
                            }
                            lastRow.segments.push(line);
                            return acc;
                        }, []).map((row, rowIdx) => (
                            <View key={rowIdx} style={styles.dialogueRow}>
                                <Pressable
                                    onPress={() => {
                                        const fullText = row.segments.map((s: any) => s.hasInput ? expectedAnswer : s.text).join('');
                                        speak(fullText);
                                    }}
                                    style={styles.speakerButton}
                                >
                                    <Volume2 size={16} color={theme.primary} />
                                </Pressable>
                                <Text style={[styles.personLabel, { color: theme.primary }]}>{row.person}:</Text>
                                <View style={styles.segmentsContainer}>
                                    {row.segments.map((seg: any, segIdx: number) => (
                                        <React.Fragment key={segIdx}>
                                            {seg.hasInput ? (
                                                <View style={styles.inputContainer}>
                                                    <TextInput
                                                        style={[
                                                            styles.input,
                                                            {
                                                                color: theme.text,
                                                                borderColor: isCorrect ? theme.success : (isWarning ? '#FFB74D' : theme.border),
                                                                minWidth: Math.max(100, expectedAnswer.length * 10)
                                                            }
                                                        ]}
                                                        value={userInput}
                                                        onChangeText={setUserInput}
                                                        autoFocus={true}
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                    />
                                                </View>
                                            ) : (
                                                <Text style={[styles.dialogueText, { color: theme.text }]}>{seg.text}</Text>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    {hasStarted && (
                        <View style={styles.feedbackArea}>
                            <View style={styles.feedbackRow}>
                                {isCorrect ? (
                                    <CheckCircle2 size={16} color={theme.success} />
                                ) : (
                                    <Info size={16} color={feedbackColor} />
                                )}
                                <Text style={[styles.feedbackText, { color: feedbackColor, fontWeight: isCorrect ? 'bold' : '500' }]}>
                                    {isCorrect ? '✅ Corretto' : feedbackMessage}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.actionsContainer}>
                    {showHint && (
                        <View style={[styles.hintCard, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
                            <View style={styles.hintHeader}>
                                <Lightbulb size={16} color="#F57F17" />
                                <Text style={styles.hintTitle}>Suggerimento:</Text>
                            </View>
                            <Text style={styles.hintText}>{currentEsercizio.hint}</Text>
                        </View>
                    )}

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={[styles.secondaryButton, { borderColor: theme.border, flex: 1 }]}
                            onPress={() => setShowHint(true)}
                        >
                            <Lightbulb size={18} color={theme.primary} />
                            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Suggerimento</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.primaryButton,
                                {
                                    backgroundColor: isCorrect ? theme.success : theme.primary,
                                    flex: 1.5,
                                    opacity: isVerifying ? 0.7 : 1
                                }
                            ]}
                            onPress={handleVerifica}
                        >
                            {isVerifying ? (
                                <Text style={styles.primaryButtonText}>Ottimo!</Text>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} color="white" />
                                    <Text style={styles.primaryButtonText}>Verifica</Text>
                                </>
                            )}
                        </Pressable>
                    </View>

                    <Pressable
                        style={styles.resetEsercizioButton}
                        onPress={resetEsercizio}
                    >
                        <Text style={[styles.resetEsercizioText, { color: theme.muted }]}>Ricomincia esercizio</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: Theme.spacing.lg,
        paddingBottom: Theme.spacing.xxl,
    },
    header: {
        marginBottom: Theme.spacing.lg,
    },
    title: {
        ...Theme.typography.h1,
        fontSize: 28,
        marginBottom: 8,
    },
    subtitle: {
        ...Theme.typography.body,
        fontSize: 16,
        lineHeight: 22,
    },
    progressCard: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: Theme.spacing.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    card: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.roundness.xl,
        borderWidth: 2,
        ...Theme.shadows.medium,
        marginBottom: Theme.spacing.xl,
        minHeight: 180,
    },
    dialogueContainer: {
        gap: Theme.spacing.md,
    },
    dialogueRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'baseline',
    },
    personLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        width: 25,
    },
    speakerButton: {
        padding: 4,
        marginRight: 4,
        borderRadius: 12,
        backgroundColor: '#f0f9ff',
    },
    segmentsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
    },
    dialogueText: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 28,
    },
    inputContainer: {
        borderBottomWidth: 0,
        marginHorizontal: 4,
    },
    input: {
        fontSize: 18,
        fontWeight: '700',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 2,
        borderRadius: Theme.roundness.md,
        textAlign: 'center',
    },
    feedbackArea: {
        marginTop: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    feedbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    feedbackText: {
        fontSize: 15,
    },
    actionsContainer: {
        gap: Theme.spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Theme.spacing.md,
    },
    hintCard: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: Theme.spacing.sm,
    },
    hintHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    hintTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#F57F17',
    },
    hintText: {
        fontSize: 14,
        color: '#5D4037',
        lineHeight: 20,
    },
    primaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.full,
        gap: 8,
        ...Theme.shadows.light,
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
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.full,
        borderWidth: 1,
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    resetEsercizioButton: {
        alignItems: 'center',
        padding: 8,
    },
    resetEsercizioText: {
        fontSize: 13,
        textDecorationLine: 'underline',
    }
});
