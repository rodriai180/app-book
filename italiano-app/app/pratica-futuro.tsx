import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Lightbulb, TrendingUp, Trophy, Volume2 } from 'lucide-react-native';
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
        sentence: [{ text: 'Domani (io) ' }, { hasInput: true, text: '' }, { text: ' (andare) al mare.' }],
        answer: 'andrò',
        translation: 'Mañana iré al mar.',
        hint: 'Andare (irreg.): andrò, andrai...'
    },
    {
        id: 2,
        sentence: [{ text: 'L\'anno prossimo noi ' }, { hasInput: true, text: '' }, { text: ' (comprare) una casa.' }],
        answer: 'compreremo',
        translation: 'El año que viene compraremos una casa.',
        hint: '-ARE -> -eremo (en futuro se cambia la A por E).'
    },
    {
        id: 3,
        sentence: [{ text: 'Stasera ' }, { hasInput: true, text: '' }, { text: ' (piovere), prendi l\'ombrello.' }],
        answer: 'pioverà',
        translation: 'Esta noche lloverá, toma el paraguas.',
        hint: 'Predicción: -ERE -> -erà.'
    },
    {
        id: 4,
        sentence: [{ text: 'Loro ' }, { hasInput: true, text: '' }, { text: ' (finire) il lavoro domani.' }],
        answer: 'finiranno',
        translation: 'Ellos terminarán el trabajo mañana.',
        hint: '-IRE -> -iranno (loro).'
    },
    {
        id: 5,
        sentence: [{ text: 'Tu ' }, { hasInput: true, text: '' }, { text: ' (essere) felice a Roma.' }],
        answer: 'sarai',
        translation: 'Tú serás feliz en Roma.',
        hint: 'Essere (irreg.): sarò, sarai, sarà...'
    },
    {
        id: 6,
        sentence: [{ text: 'Voi ' }, { hasInput: true, text: '' }, { text: ' (vedere) il Colosseo.' }],
        answer: 'vedrete',
        translation: 'Vosotros veréis el Coliseo.',
        hint: 'Vedere (irreg.): vedrò, vedrai, vedrà, vedremo, vedrete.'
    },
    {
        id: 7,
        sentence: [{ text: 'Lui ' }, { hasInput: true, text: '' }, { text: ' (fare) un viaggio in Asia.' }],
        answer: 'farà',
        translation: 'Él hará un viaje a Asia.',
        hint: 'Fare (irreg.): farò, farai, farà...'
    },
    {
        id: 8,
        sentence: [{ text: 'Tra due giorni io ' }, { hasInput: true, text: '' }, { text: ' (partire) per Milano.' }],
        answer: 'partirò',
        translation: 'Dentro de dos días partiré hacia Milán.',
        hint: '-IRE -> -irò (io).'
    }
];

export default function PraticaFuturoScreen() {
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
                    Animated.timing(progressAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
                }
            }, 700);
        }
    };

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Stack.Screen options={{ title: 'Grande!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Futuro brillante!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Ya puedes expresar tus planes y predicciones en italiano. ¡Bravo!
                    </Text>
                    <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]} onPress={() => router.back()}>
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Práctica: Futuro' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <TrendingUp size={16} color={theme.primary} />
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>Progetti e Previsioni</Text>
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
                    <View style={[styles.hintCard, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
                        <Lightbulb size={16} color="#F57F17" />
                        <Text style={[styles.hintText, { color: '#BF360C' }]}>{currentEsercizio.hint}</Text>
                    </View>
                )}
                <View style={styles.buttonRow}>
                    <Pressable style={[styles.secondaryButton, { borderColor: theme.border, flex: 1 }]} onPress={() => setShowHint(true)}>
                        <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Ayuda</Text>
                    </Pressable>
                    <Pressable style={[styles.primaryButton, { backgroundColor: isCorrect ? theme.success : theme.primary, flex: 2 }]} onPress={handleVerifica} disabled={!isCorrect || isVerifying}>
                        <CheckCircle2 size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Confermare</Text>
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
