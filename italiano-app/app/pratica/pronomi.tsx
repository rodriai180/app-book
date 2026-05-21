import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Lightbulb, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    question: string;
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
        question: 'Compri il pane?',
        answer: 'lo',
        dialogue: [
            { person: 'A', text: 'Compri il pane?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' compro.' }
        ],
        hint: 'Il pane = maschile singolare (lo).'
    },
    {
        id: 2,
        question: 'Vedi Maria?',
        answer: 'la',
        dialogue: [
            { person: 'A', text: 'Vedi Maria?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' vedo.' }
        ],
        hint: 'Maria = femminile singolare (la).'
    },
    {
        id: 3,
        question: 'Mangi gli spaghetti?',
        answer: 'li',
        dialogue: [
            { person: 'A', text: 'Mangi gli spaghetti?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' mangio.' }
        ],
        hint: 'Gli spaghetti = maschile plurale (li).'
    },
    {
        id: 4,
        question: 'Leggi le riviste?',
        answer: 'le',
        dialogue: [
            { person: 'A', text: 'Leggi le riviste?' },
            { person: 'B', text: 'Sì, ', hasInput: true },
            { person: 'B', text: ' leggo.' }
        ],
        hint: 'Le riviste = femminile plurale (le).'
    },
    {
        id: 5,
        question: 'Chi chiama Paolo?',
        answer: 'lo',
        dialogue: [
            { person: 'A', text: 'Chi chiama Paolo?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' chiamo io.' }
        ],
        hint: 'Paolo = maschile singolare (lo).'
    },
    {
        id: 6,
        question: 'Prendi la borsa?',
        answer: 'la',
        dialogue: [
            { person: 'A', text: 'Prendi la borsa?' },
            { person: 'B', text: 'No, non ', hasInput: true },
            { person: 'B', text: ' prendo.' }
        ],
        hint: 'La borsa = femminile singolare (la).'
    },
    {
        id: 7,
        question: 'Ascolti i dischi?',
        answer: 'li',
        dialogue: [
            { person: 'A', text: 'Ascolti i dischi?' },
            { person: 'B', text: 'Purtroppo non ', hasInput: true },
            { person: 'B', text: ' ascolto mai.' }
        ],
        hint: 'I dischi = maschile plurale (li).'
    },
    {
        id: 8,
        question: 'Conosci le amiche di Sara?',
        answer: 'le',
        dialogue: [
            { person: 'A', text: 'Conosci le amiche di Sara?' },
            { person: 'B', text: 'No, non ', hasInput: true },
            { person: 'B', text: ' conosco.' }
        ],
        hint: 'Le amiche = femminile plurale (le).'
    }
];

export default function PraticaPronomiScreen() {
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
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.95 });
    };

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentIndex) / ESERCIZI.length,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [currentIndex]);

    const isCorrect = userInput.toLowerCase().trim() === expectedAnswer.toLowerCase();
    const hasStarted = userInput.length > 0;

    const handleVerifica = () => {
        if (isCorrect) {
            speak(expectedAnswer + '!');
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
            }, 700);
        }
    };

    const ricomincia = () => {
        setCurrentIndex(0);
        setUserInput('');
        setShowHint(false);
        setIsCompleted(false);
    };

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Stack.Screen options={{ title: 'Ottimo!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Buen trabajo!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Has dominado los pronombres directos. ¡Ahora puedes hablar sin repetir tanto!
                    </Text>

                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]}
                        onPress={ricomincia}
                    >
                        <RotateCcw size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Reiniciar Práctica</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Finalizar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Práctica: Pronombres' }} />

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

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
                <Text style={[styles.questionLabel, { color: theme.muted }]}>Sostituisci l'oggetto:</Text>
                <View style={styles.dialogueContainer}>
                    {currentEsercizio.dialogue.reduce((acc: any[], line) => {
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
                                    const fullText = row.segments.map((s: any) => s.hasInput ? (isCorrect ? expectedAnswer : '...') : s.text).join('');
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
                                            <TextInput
                                                style={[
                                                    styles.input,
                                                    {
                                                        color: theme.text,
                                                        borderColor: isCorrect ? theme.success : theme.border,
                                                        width: Math.max(60, expectedAnswer.length * 20)
                                                    }
                                                ]}
                                                value={userInput}
                                                onChangeText={setUserInput}
                                                autoFocus={true}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                placeholder="..."
                                            />
                                        ) : (
                                            <Text style={[styles.dialogueText, { color: theme.text }]}>{seg.text}</Text>
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.actionsContainer}>
                {showHint && (
                    <View style={[styles.hintCard, { backgroundColor: '#E3F2FD', borderColor: '#2196F3' }]}>
                        <View style={styles.hintHeader}>
                            <Lightbulb size={16} color="#1976D2" />
                            <Text style={[styles.hintTitle, { color: '#1976D2' }]}>Ayuda:</Text>
                        </View>
                        <Text style={[styles.hintText, { color: '#0D47A1' }]}>{currentEsercizio.hint}</Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <Pressable
                        style={[styles.secondaryButton, { borderColor: theme.border, flex: 1 }]}
                        onPress={() => setShowHint(true)}
                    >
                        <Lightbulb size={18} color={theme.primary} />
                        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Ayuda</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.primaryButton,
                            {
                                backgroundColor: isCorrect ? theme.success : theme.primary,
                                flex: 2,
                                opacity: isVerifying ? 0.7 : 1
                            }
                        ]}
                        onPress={handleVerifica}
                        disabled={!isCorrect || isVerifying}
                    >
                        <CheckCircle2 size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Verificare</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: Theme.spacing.lg,
    },
    progressCard: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: Theme.spacing.lg,
    },
    progressHeader: {
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
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
    questionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    dialogueContainer: {
        gap: 16,
    },
    dialogueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    speakerButton: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#f0f4f8',
    },
    personLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        width: 25,
    },
    segmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        flex: 1,
    },
    dialogueText: {
        fontSize: 18,
        lineHeight: 28,
    },
    input: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 2,
        borderRadius: 8,
        textAlign: 'center',
        marginHorizontal: 4,
    },
    actionsContainer: {
        gap: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Theme.spacing.md,
    },
    hintCard: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: 4,
    },
    hintHeader: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginBottom: 4,
    },
    hintTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    hintText: {
        fontSize: 14,
        lineHeight: 20,
    },
    primaryButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        ...Theme.typography.h1,
        fontSize: 24,
    },
    subtitle: {
        ...Theme.typography.body,
    }
});
