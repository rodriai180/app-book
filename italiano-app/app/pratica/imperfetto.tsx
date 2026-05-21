import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, History, Lightbulb, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
        sentence: [{ text: 'Da bambino ' }, { hasInput: true, text: '' }, { text: ' (giocare) sempre al parco.' }],
        answer: 'giocavo',
        translation: 'De niño jugaba siempre en el parque.',
        hint: '-ARE -> -avo (io).'
    },
    {
        id: 2,
        sentence: [{ text: 'Quando ' }, { hasInput: true, text: '' }, { text: ' (essere) piccola, avevo i capelli corti.' }],
        answer: 'ero',
        translation: 'Cuando era pequeña, tenía el pelo corto.',
        hint: 'Essere (irregular): ero, eri, era...'
    },
    {
        id: 3,
        sentence: [{ text: 'Noi ' }, { hasInput: true, text: '' }, { text: ' (andare) ogni estate in montagna.' }],
        answer: 'andavamo',
        translation: 'Íbamos cada verano a la montaña.',
        hint: '-ARE -> -avamo (noi).'
    },
    {
        id: 4,
        sentence: [{ text: 'Loro ' }, { hasInput: true, text: '' }, { text: ' (leggere) molti libri da giovani.' }],
        answer: 'leggevano',
        translation: 'Ellos leían muchos libros de jóvenes.',
        hint: '-ERE -> -evano (loro).'
    },
    {
        id: 5,
        sentence: [{ text: 'Mentre io ' }, { hasInput: true, text: '' }, { text: ' (studiare), lui guardava la TV.' }],
        answer: 'studiavo',
        translation: 'Mientras yo estudiaba, él miraba la TV.',
        hint: 'Acción continua en el pasado.'
    },
    {
        id: 6,
        sentence: [{ text: 'Ieri ' }, { hasInput: true, text: '' }, { text: ' (fare) freddo e tirava vento.' }],
        answer: 'faceva',
        translation: 'Ayer hacía frío y soplaba el viento.',
        hint: 'Descripciones meteorológicas en el pasado.'
    },
    {
        id: 7,
        sentence: [{ text: 'Voi ' }, { hasInput: true, text: '' }, { text: ' (mangiare) spesso al ristorante?' }],
        answer: 'mangiavate',
        translation: '¿Comíais a menudo en el restaurante?',
        hint: '-ARE -> -avate (voi).'
    },
    {
        id: 8,
        sentence: [{ text: 'Tu ' }, { hasInput: true, text: '' }, { text: ' (avere) paura del buio?' }],
        answer: 'avevi',
        translation: '¿Tenías miedo a la oscuridad?',
        hint: '-ERE -> -evi (tu).'
    }
];

export default function PraticaImperfettoScreen() {
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
                    Animated.timing(progressAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
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
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Experto en el Pasado!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Has completado la práctica del imperfecto. ¡Ya puedes contar tus historias de la infancia!
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
            <Stack.Screen options={{ title: 'Práctica: Imperfetto' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <History size={16} color={theme.primary} />
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>Descrizioni e Abitudini</Text>
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
                    <View style={[styles.hintCard, { backgroundColor: '#E3F2FD', borderColor: '#2196F3' }]}>
                        <Lightbulb size={16} color="#1976D2" />
                        <Text style={[styles.hintText, { color: '#0D47A1' }]}>{currentEsercizio.hint}</Text>
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
