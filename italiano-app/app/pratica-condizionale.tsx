import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Lightbulb, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Note: Using Heart as a symbol for desires

interface Esercizio {
    id: number;
    sentence: { text: string; hasInput?: boolean }[];
    answer: string;
    translation: string;
    hint: string;
}

const ESERCIZI: Esercizio[] = [
    {
        id: 1,
        sentence: [{ text: '(Io) ' }, { hasInput: true, text: '' }, { text: ' (volere) un bicchiere d\'acqua.' }],
        answer: 'vorrei',
        translation: 'Quisiera un vaso de agua.',
        hint: 'Vorrei (cortesía).'
    },
    {
        id: 2,
        sentence: [{ text: 'Ti ' }, { hasInput: true, text: '' }, { text: ' (piacere) venire al cinema?' }],
        answer: 'piacerebbe',
        translation: '¿Te gustaría venir al cine?',
        hint: 'Piacere -> piacerebbe.'
    },
    {
        id: 3,
        sentence: [{ text: 'Loro ' }, { hasInput: true, text: '' }, { text: ' (mangiare) volentieri una pizza.' }],
        answer: 'mangerebbero',
        translation: 'Ellos comerían de buena gana una pizza.',
        hint: '-ARE -> -ebbero (loro).'
    },
    {
        id: 4,
        sentence: [{ text: 'Tu ' }, { hasInput: true, text: '' }, { text: ' (potere) aiutarmi?' }],
        answer: 'potresti',
        translation: '¿Podrías ayudarme?',
        hint: 'Potere (irreg.): potrei, potresti...'
    },
    {
        id: 5,
        sentence: [{ text: 'Noi ' }, { hasInput: true, text: '' }, { text: ' (andare) al mare, ma piove.' }],
        answer: 'andremmo',
        translation: 'Iríamos al mar, pero llueve.',
        hint: 'Andare (irreg.): andrei, andresti, andrebbe, andremmo.'
    },
    {
        id: 6,
        sentence: [{ text: 'Voi ' }, { hasInput: true, text: '' }, { text: ' (dovere) studiare di più.' }],
        answer: 'dovreste',
        translation: 'Deberíais estudiar más.',
        hint: 'Consejo: dovrei, dovresti, dovrebbe, dovremmo, dovreste.'
    },
    {
        id: 7,
        sentence: [{ text: 'Al tuo posto (io) ' }, { hasInput: true, text: '' }, { text: ' (parlare) con Maria.' }],
        answer: 'parlerei',
        translation: 'En tu lugar hablaría con Maria.',
        hint: '-ARE -> -erei (io).'
    },
    {
        id: 8,
        sentence: [{ text: 'Lui ' }, { hasInput: true, text: '' }, { text: ' (vivere) volentieri a Roma.' }],
        answer: 'vivrebbe',
        translation: 'Él viviría con gusto en Roma.',
        hint: 'Vivere (irreg.): vivrei, vivresti, vivrebbe.'
    }
];

export default function PraticaCondizionaleScreen() {
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
        Speech.speak(text, { language: 'it-IT', pitch: 1.05, rate: 0.9 });
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
                <Stack.Screen options={{ title: 'Bravissimo!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Deseos cumplidos!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Has dominado el condicional. Ahora puedes pedir cosas con máxima cortesía.
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
            <Stack.Screen options={{ title: 'Práctica: Condizionale' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <Text style={{ fontSize: 16 }}>✨</Text>
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>Cortesia e Desideri</Text>
                    <Text style={[styles.progressCount, { color: theme.muted, marginLeft: 'auto' }]}>{currentIndex + 1} / {ESERCIZI.length}</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
                <View style={styles.sentenceRow}>
                    <Pressable onPress={() => {
                        const fullText = currentEsercizio.sentence.map(s => s.hasInput ? expectedAnswer : s.text).join('');
                        speak(fullText);
                    }} style={styles.speakerButton}>
                        <Volume2 size={24} color={theme.primary} />
                    </Pressable>
                    <View style={styles.segmentsContainer}>
                        {currentEsercizio.sentence.map((seg, idx) => (
                            <React.Fragment key={idx}>
                                {seg.hasInput ? (
                                    <TextInput style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: 100 }]} value={userInput} onChangeText={setUserInput} autoFocus autoCapitalize="none" autoCorrect={false} placeholder="..." />
                                ) : (
                                    <Text style={[styles.sentenceText, { color: theme.text }]}>{seg.text}</Text>
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
                <Text style={[styles.translation, { color: theme.muted }]}>{currentEsercizio.translation}</Text>
            </View>

            <View style={styles.actionsContainer}>
                {showHint && (
                    <View style={[styles.hintCard, { backgroundColor: '#F3E5F5', borderColor: '#AB47BC' }]}>
                        <Lightbulb size={16} color="#8E24AA" />
                        <Text style={[styles.hintText, { color: '#4A148C' }]}>{currentEsercizio.hint}</Text>
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
    sentenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    speakerButton: { padding: 10, borderRadius: 15, backgroundColor: '#f0f4f8' },
    segmentsContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', flex: 1 },
    sentenceText: { fontSize: 20, fontWeight: '600', lineHeight: 32 },
    input: { fontSize: 20, fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 10, borderWidth: 2, borderRadius: 8, textAlign: 'center', marginHorizontal: 4 },
    translation: { fontSize: 14, fontStyle: 'italic', marginTop: 12, textAlign: 'center' },
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
