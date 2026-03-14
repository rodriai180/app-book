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
        answer: 'Ho mangiato',
        dialogue: [
            { person: 'A', text: 'Hai fame?' },
            { person: 'B', text: 'No, grazie. ', hasInput: true },
            { person: 'B', text: ' una pizza poco fa.' }
        ],
        hint: 'Usa il passato prossimo del verbo MANGIARE.'
    },
    {
        id: 2,
        answer: 'Ho studiato',
        dialogue: [
            { person: 'A', text: 'Sei pronto per l’esame?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' tutto il giorno ieri.' }
        ],
        hint: 'Usa il passato prossimo del verbo STUDIARE.'
    },
    {
        id: 3,
        answer: 'Ho lavorato',
        dialogue: [
            { person: 'A', text: 'Sei stanco?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' fino a tardi in ufficio.' }
        ],
        hint: 'Usa il passato prossimo del verbo LAVORARE.'
    },
    {
        id: 4,
        answer: 'Sono andato',
        dialogue: [
            { person: 'A', text: 'Dov’eri stamattina?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' al mercato.' }
        ],
        hint: 'Usa il passato prossimo del verbo ANDARE (verbo di movimento).'
    },
    {
        id: 5,
        answer: 'Sono arrivato',
        dialogue: [
            { person: 'A', text: 'A che ora sei tornato?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' a casa alle otto.' }
        ],
        hint: 'Usa il passato prossimo del verbo ARRIVARE.'
    },
    {
        id: 6,
        answer: 'Ho visto',
        dialogue: [
            { person: 'A', text: 'Hai visto il nuovo film?' },
            { person: 'B', text: 'Sì, lo ', hasInput: true },
            { person: 'B', text: ' ieri sera.' }
        ],
        hint: 'Usa il participio passato irregolare del verbo VEDERE.'
    },
    {
        id: 7,
        answer: 'Ho fatto',
        dialogue: [
            { person: 'A', text: 'Cosa hai fatto nel weekend?' },
            { person: 'B', text: 'Io ', hasInput: true },
            { person: 'B', text: ' una gita in montagna.' }
        ],
        hint: 'Usa il participio passato irregolare del verbo FARE.'
    }
];

export default function PraticaPassatoScreen() {
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

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentIndex) / ESERCIZI.length,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentIndex]);

    const isCorrect = userInput === expectedAnswer;
    const hasStarted = userInput.length > 0;

    let feedbackMessage = '';
    let feedbackColor = theme.muted;
    let isWarning = false;

    if (hasStarted) {
        if (isCorrect) {
            feedbackMessage = 'Ottimo! Ben fatto.';
            feedbackColor = theme.success;
        } else {
            if (userInput.toLowerCase() === expectedAnswer.toLowerCase()) {
                feedbackMessage = 'Controlla le maiuscole.';
                feedbackColor = '#E65100';
                isWarning = true;
            } else if (userInput.includes('Ho') || userInput.includes('Sono')) {
                feedbackMessage = "Controlla l'ausiliare o il participio.";
                feedbackColor = '#E65100';
                isWarning = true;
            } else if (userInput.length >= 4) {
                if (expectedAnswer.startsWith('Sono') && userInput.startsWith('Ho')) {
                    feedbackMessage = "Controlla l'ausiliare (essere o avere).";
                    feedbackColor = '#E65100';
                    isWarning = true;
                } else if (!userInput.endsWith('ato') && !userInput.endsWith('uto') && !userInput.endsWith('ito') && !userInput.endsWith('to')) {
                    feedbackMessage = "Controlla la fine del participio (-ato/-uto/-ito).";
                    feedbackColor = '#E65100';
                    isWarning = true;
                } else {
                    feedbackMessage = '📝 Continua…';
                    feedbackColor = theme.muted;
                }
            } else {
                feedbackMessage = '📝 Continua…';
                feedbackColor = theme.muted;
            }
        }
    }

    const handleVerifica = () => {
        if (isCorrect) {
            speak('Bene! ' + expectedAnswer);
            setIsVerifying(true);
            setTimeout(() => {
                if (currentIndex < ESERCIZI.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setUserInput('');
                    setShowHint(false);
                    setIsVerifying(false);
                } else {
                    setIsCompleted(true);
                    setIsVerifying(false);
                    Animated.timing(progressAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }
            }, 800);
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
                        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>Spettacolare!</Text>
                        <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                            Hai completato tutti i moduli di pratica. Hai imparato moltissimo!
                        </Text>

                        <Pressable
                            style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]}
                            onPress={ricomincia}
                        >
                            <RotateCcw size={18} color="white" />
                            <Text style={styles.primaryButtonText}>Ricomincia Pratica</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                            onPress={() => router.replace('/')}
                        >
                            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Torna all’inizio</Text>
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: 'Pratica: Passato' }} />
            <ScrollView
                style={[styles.container, { backgroundColor: theme.surface }]}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Pratica: Passato</Text>
                    <Text style={[styles.subtitle, { color: theme.muted }]}>
                        Scrivi la forma corretta del Passato Prossimo.
                    </Text>
                </View>

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
                        {currentEsercizio.dialogue.reduce((acc: any[], line) => {
                            let lastRow = acc[acc.length - 1];
                            if (!lastRow || lastRow.person !== line.person) {
                                lastRow = { person: line.person, segments: [] };
                                acc.push(lastRow);
                            }
                            lastRow.segments.push(line);
                            return acc;
                        }, []).map((row: any, rowIdx: number) => (
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
                                                                minWidth: Math.max(120, expectedAnswer.length * 12)
                                                            }
                                                        ]}
                                                        value={userInput}
                                                        onChangeText={setUserInput}
                                                        autoFocus={true}
                                                        autoCapitalize="sentences"
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
