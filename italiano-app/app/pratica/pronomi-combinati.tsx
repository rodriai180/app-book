import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Layers, Lightbulb, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    answer: string;
    dialogue: { person: string; text: string; hasInput?: boolean }[];
    hint: string;
}

const ESERCIZI: Esercizio[] = [
    {
        id: 1,
        answer: 'te lo',
        dialogue: [
            { person: 'A', text: 'Mi presti il libro?' },
            { person: 'B', text: 'Sì, ' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' presto domani.' }
        ],
        hint: 'Ti + lo = TE LO.'
    },
    {
        id: 2,
        answer: 'glielo',
        dialogue: [
            { person: 'A', text: 'Dai il regalo a Marco?' },
            { person: 'B', text: 'Sì, ' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' do subito.' }
        ],
        hint: 'Gli + lo = GLIELO.'
    },
    {
        id: 3,
        answer: 'me ne',
        dialogue: [
            { person: 'A', text: 'Quanti caffè bevi?' },
            { person: 'B', text: '' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' bevo uno solo.' }
        ],
        hint: 'Mi + ne = ME NE.'
    },
    {
        id: 4,
        answer: 'ce la',
        dialogue: [
            { person: 'A', text: 'Cucini la pasta?' },
            { person: 'B', text: 'Sì, ' },
            { person: 'B', text: '', hasInput: true },
            { person: 'B', text: ' cucino io.' }
        ],
        hint: 'Ci + la = CE LA.'
    }
];

export default function PraticaPronomiCombinatiScreen() {
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

    const isCorrect = userInput.toLowerCase().trim() === currentEsercizio.answer.toLowerCase();

    const handleVerifica = () => {
        if (isCorrect) {
            speak(currentEsercizio.answer);
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
                <Text style={[styles.title, { color: theme.text, marginTop: 20 }]}>¡Fluidez Total!</Text>
                <Text style={{ color: theme.muted, textAlign: 'center', marginVertical: 20 }}>
                    Combinas pronombres como un nativo. ¡Sigue así!
                </Text>
                <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]} onPress={() => router.back()}>
                    <Text style={styles.primaryButtonText}>Finalizar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Práctica: Combinati' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <Layers size={16} color={theme.primary} />
                    <Text style={[styles.progressText, { color: theme.text, marginLeft: 6 }]}>Glie-lo, Te-ne, Ce-la...</Text>
                    <Text style={[styles.progressCount, { color: theme.muted, marginLeft: 'auto' }]}>{currentIndex + 1} / {ESERCIZI.length}</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
                {currentEsercizio.dialogue.map((line, idx) => (
                    <View key={idx} style={styles.dialogueLine}>
                        <Pressable onPress={() => speak(line.text || currentEsercizio.answer)} style={styles.speakerMini}>
                            <Volume2 size={14} color={theme.primary} />
                        </Pressable>
                        <Text style={[styles.dialoguePerson, { color: theme.primary }]}>{line.person}: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                            {line.hasInput ? (
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: 80 }]}
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    autoFocus
                                    autoCapitalize="none"
                                />
                            ) : (
                                <Text style={[styles.dialogueText, { color: theme.text }]}>{line.text}</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.actionsContainer}>
                {showHint && (
                    <View style={styles.hintCard}>
                        <Lightbulb size={16} color="#1976D2" />
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
    card: { padding: Theme.spacing.lg, borderRadius: Theme.roundness.xl, borderWidth: 2, ...Theme.shadows.medium, marginBottom: Theme.spacing.xl },
    dialogueLine: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
    dialoguePerson: { fontWeight: 'bold', fontSize: 16 },
    dialogueText: { fontSize: 16, lineHeight: 24 },
    speakerMini: { padding: 6, backgroundColor: '#f0f4f8', borderRadius: 10, marginRight: 8 },
    input: { fontSize: 16, fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 8, borderWidth: 2, borderRadius: 6, textAlign: 'center', marginHorizontal: 4 },
    actionsContainer: { gap: 12 },
    buttonRow: { flexDirection: 'row', gap: Theme.spacing.md },
    hintCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, backgroundColor: '#E3F2FD', flexDirection: 'row', gap: 8, alignItems: 'center' },
    hintText: { fontSize: 14, color: '#0D47A1' },
    primaryButton: { flexDirection: 'row', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 8 },
    primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: '#CCC' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }
});
