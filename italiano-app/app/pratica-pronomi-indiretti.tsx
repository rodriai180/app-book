import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Lightbulb, Trophy, UserPlus, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    question: string;
    answer: string;
    dialogue: { person: string; text: string; hasInput?: boolean }[];
    hint: string;
}

const ESERCIZI: Esercizio[] = [
    {
        id: 1,
        question: 'A te piace la pasta?',
        answer: 'ti',
        dialogue: [
            { person: 'A', text: 'A te piace la pasta?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' piace molto.' }
        ],
        hint: 'A te -> Ti.'
    },
    {
        id: 2,
        question: 'Telefoni a Paolo?',
        answer: 'gli',
        dialogue: [
            { person: 'A', text: 'Telefoni a Paolo?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' telefono stasera.' }
        ],
        hint: 'A lui -> Gli.'
    },
    {
        id: 3,
        question: 'Scrivi a Maria?',
        answer: 'le',
        dialogue: [
            { person: 'A', text: 'Scrivi a Maria?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' scrivo una letter.' }
        ],
        hint: 'A lei -> Le.'
    },
    {
        id: 4,
        question: 'Porti il caffè a noi?',
        answer: 'ci',
        dialogue: [
            { person: 'A', text: 'Porti il caffè a noi?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' porto il caffè subito.' }
        ],
        hint: 'A noi -> Ci.'
    },
    {
        id: 5,
        question: 'Dici la verità a voi?',
        answer: 'vi',
        dialogue: [
            { person: 'A', text: 'Vi dico la verità?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' dite la verità.' }
        ],
        hint: 'A voi -> Vi.'
    },
    {
        id: 6,
        question: 'Regali i fiori a tua madre?',
        answer: 'le',
        dialogue: [
            { person: 'A', text: 'Regali i fiori a tua madre?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' regalo delle rose.' }
        ],
        hint: 'A lei -> Le.'
    },
    {
        id: 7,
        question: 'Dai il libro a Marco?',
        answer: 'gli',
        dialogue: [
            { person: 'A', text: 'Dai il libro a Marco?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' do nulla.' }
        ],
        hint: 'A lui -> Gli.'
    },
    {
        id: 8,
        question: 'Cosa dici ai tuoi amici?',
        answer: 'loro',
        dialogue: [
            { person: 'A', text: 'Cosa dici ai tuoi amici?' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' di venire qui.' }
        ],
        hint: 'A loro -> Loro (va después del verbo).'
    }
];

export default function PraticaPronomiIndirettiScreen() {
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

    const handleVerifica = () => {
        if (isCorrect) {
            speak(expectedAnswer);
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
                    Animated.timing(progressAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
                }
            }, 700);
        }
    };

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Stack.Screen options={{ title: 'Ottimo!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Dominio Indirecto!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Has aprendido a quién dirigir tus palabras y acciones. ¡Fantastico!
                    </Text>
                    <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]} onPress={() => router.back()}>
                        <Text style={styles.primaryButtonText}>Finalizar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Pronomi Indiretti' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <UserPlus size={16} color={theme.primary} />
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>A chi?</Text>
                    <Text style={[styles.progressCount, { color: theme.muted, marginLeft: 'auto' }]}>{currentIndex + 1} / {ESERCIZI.length}</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
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
                            <Pressable onPress={() => {
                                const fullText = row.segments.map((s: any) => s.hasInput ? expectedAnswer : s.text).join('');
                                speak(fullText);
                            }} style={styles.speakerButton}>
                                <Volume2 size={16} color={theme.primary} />
                            </Pressable>
                            <Text style={[styles.personLabel, { color: theme.primary }]}>{row.person}:</Text>
                            <View style={styles.segmentsContainer}>
                                {row.segments.map((seg: any, segIdx: number) => (
                                    <React.Fragment key={segIdx}>
                                        {seg.hasInput ? (
                                            <TextInput style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: 60 }]} value={userInput} onChangeText={setUserInput} autoFocus autoCapitalize="none" autoCorrect={false} placeholder="..." />
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
                    <View style={[styles.hintCard, { backgroundColor: '#E1F5FE', borderColor: '#03A9F4' }]}>
                        <Lightbulb size={16} color="#0288D1" />
                        <Text style={[styles.hintText, { color: '#01579B' }]}>{currentEsercizio.hint}</Text>
                    </View>
                )}
                <View style={styles.buttonRow}>
                    <Pressable style={[styles.secondaryButton, { borderColor: theme.border, flex: 1 }]} onPress={() => setShowHint(true)}>
                        <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Ayuda</Text>
                    </Pressable>
                    <Pressable style={[styles.primaryButton, { backgroundColor: isCorrect ? theme.success : theme.primary, flex: 2 }]} onPress={handleVerifica} disabled={!isCorrect || isVerifying}>
                        <CheckCircle2 size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Verificare</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { padding: Theme.spacing.lg },
    progressCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, borderWidth: 1, marginBottom: Theme.spacing.lg },
    progressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    progressText: { fontSize: 14, fontWeight: 'bold' },
    progressCount: { fontSize: 12 },
    progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    card: { padding: Theme.spacing.lg, borderRadius: Theme.roundness.xl, borderWidth: 2, ...Theme.shadows.medium, marginBottom: Theme.spacing.xl, minHeight: 180, justifyContent: 'center' },
    dialogueContainer: { gap: 16 },
    dialogueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    speakerButton: { padding: 4, borderRadius: 8, backgroundColor: '#f0f4f8' },
    personLabel: { fontWeight: 'bold', fontSize: 18, width: 25 },
    segmentsContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', flex: 1 },
    dialogueText: { fontSize: 18, lineHeight: 28 },
    input: { fontSize: 18, fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 8, borderWidth: 2, borderRadius: 8, textAlign: 'center', marginHorizontal: 4 },
    actionsContainer: { gap: 12 },
    buttonRow: { flexDirection: 'row', gap: Theme.spacing.md },
    hintCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, borderWidth: 1, flexDirection: 'row', gap: 8, alignItems: 'center' },
    hintText: { fontSize: 14, flex: 1 },
    primaryButton: { flexDirection: 'row', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 8 },
    primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    title: { ...Theme.typography.h1, fontSize: 24 },
    subtitle: { ...Theme.typography.body }
});
