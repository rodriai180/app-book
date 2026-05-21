import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { BookOpen, CheckCircle2, PenTool, Trophy, Volume2 } from 'lucide-react-native';
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
        sentence: [{ text: 'Dante ' }, { text: '', hasInput: true }, { text: ' la Divina Commedia. (scrivere)' }],
        answer: 'scrisse',
        translation: 'Dante escribió la Divina Comedia.',
        hint: 'Scrivere (passato remoto, 3ª pers. sing.): scrisse.'
    },
    {
        id: 2,
        sentence: [{ text: 'Cesare ' }, { text: '', hasInput: true }, { text: ' ucciso in Senato. (essere)' }],
        answer: 'fu',
        translation: 'César fue asesinado en el Senado.',
        hint: 'Essere (passato remoto, 3ª pers. sing.): fu.'
    },
    {
        id: 3,
        sentence: [{ text: 'Noi ' }, { text: '', hasInput: true }, { text: ' a Roma molti anni fa. (andare)' }],
        answer: 'andammo',
        translation: 'Fuimos a Roma hace muchos años.',
        hint: 'Andare (passato remoto, 1ª pers. plur.): andammo.'
    },
    {
        id: 4,
        sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' tutto il segreto. (sapere)' }],
        answer: 'seppero',
        translation: 'Ellos supieron todo el secreto.',
        hint: 'Sapere (passato remoto, 3ª pers. plur.): seppero.'
    },
    {
        id: 5,
        sentence: [{ text: 'Io ' }, { text: '', hasInput: true }, { text: ' un grande onore. (avere)' }],
        answer: 'ebbi',
        translation: 'Tuve un gran honor.',
        hint: 'Avere (passato remoto, 1ª pers. sing.): ebbi.'
    }
];

export default function PraticaPassatoRemotoScreen() {
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
                }
            }, 700);
        }
    };

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Trophy size={64} color={theme.primary} />
                <Text style={styles.title}>¡Historiador Maestro!</Text>
                <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.muted }}>
                    Has dominado el Passato Remoto. ¡Ya puedes leer a los grandes clásicos italianos!
                </Text>
                <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]} onPress={() => router.back()}>
                    <Text style={styles.primaryButtonText}>Finalizar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Práctica: Passato Remoto' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <BookOpen size={16} color={theme.primary} />
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>Literatura e Historia</Text>
                    <Text style={[styles.progressCount, { color: theme.muted, marginLeft: 'auto' }]}>{currentIndex + 1} / {ESERCIZI.length}</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
                <View style={styles.sentenceRow}>
                    <Pressable onPress={() => speak(currentEsercizio.sentence.map(s => s.hasInput ? expectedAnswer : s.text).join(''))} style={styles.speakerButton}>
                        <Volume2 size={24} color={theme.primary} />
                    </Pressable>
                    <View style={styles.segmentsContainer}>
                        {currentEsercizio.sentence.map((seg, idx) => (
                            <React.Fragment key={idx}>
                                {seg.hasInput ? (
                                    <TextInput
                                        style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: 100 }]}
                                        value={userInput}
                                        onChangeText={setUserInput}
                                        autoFocus
                                        autoCapitalize="none"
                                    />
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
                    <View style={styles.hintCard}>
                        <PenTool size={16} color="#1976D2" />
                        <Text style={styles.hintText}>{currentEsercizio.hint}</Text>
                    </View>
                )}
                <View style={styles.buttonRow}>
                    <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={() => setShowHint(true)}>
                        <Text style={{ color: theme.primary }}>Ayuda</Text>
                    </Pressable>
                    <Pressable style={[styles.primaryButton, { backgroundColor: isCorrect ? theme.success : theme.primary, flex: 2 }]} onPress={handleVerifica} disabled={!isCorrect}>
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
    sentenceText: { fontSize: 16, fontWeight: '600', lineHeight: 26 },
    input: { fontSize: 16, fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 10, borderWidth: 2, borderRadius: 8, textAlign: 'center', marginHorizontal: 4 },
    translation: { fontSize: 14, fontStyle: 'italic', marginTop: 12, textAlign: 'center' },
    actionsContainer: { gap: 12 },
    buttonRow: { flexDirection: 'row', gap: Theme.spacing.md },
    hintCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, backgroundColor: '#E3F2FD', flexDirection: 'row', gap: 8, alignItems: 'center' },
    hintText: { fontSize: 14, color: '#0D47A1' },
    primaryButton: { flexDirection: 'row', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 8 },
    primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: '#CCC' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }
});
