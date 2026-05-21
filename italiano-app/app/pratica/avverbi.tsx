import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { BarChart3, CheckCircle2, Clock, Lightbulb, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    type: 'quantity' | 'frequency';
    answer: string;
    sentence: {
        text: string;
        hasInput?: boolean;
    }[];
    translation: string;
    hint: string;
}

const ESERCIZI: Esercizio[] = [
    {
        id: 1,
        type: 'quantity',
        answer: 'molto',
        sentence: [
            { text: 'Sono ' },
            { text: '', hasInput: true },
            { text: ' contento di vederti!' }
        ],
        translation: '¡Estoy muy contento de verte!',
        hint: '"Molto" puede significar "mucho" o "muy".'
    },
    {
        id: 2,
        type: 'frequency',
        answer: 'sempre',
        sentence: [
            { text: 'Vado ' },
            { text: '', hasInput: true },
            { text: ' in palestra la mattina.' }
        ],
        translation: 'Voy siempre al gimnasio por la mañana.',
        hint: '"Sempre" significa siempre.'
    },
    {
        id: 3,
        type: 'frequency',
        answer: 'mai',
        sentence: [
            { text: 'Non vado ' },
            { text: '', hasInput: true },
            { text: ' al cinema da solo.' }
        ],
        translation: 'Nunca voy al cine solo.',
        hint: '"Mai" (nunca) se usa con la negación "non".'
    },
    {
        id: 4,
        type: 'quantity',
        answer: 'troppo',
        sentence: [
            { text: 'Mangi ' },
            { text: '', hasInput: true },
            { text: ' zucchero, non fa bene.' }
        ],
        translation: 'Comes demasiada azúcar, no es bueno.',
        hint: '"Troppo" indica exceso (demasiado).'
    },
    {
        id: 5,
        type: 'frequency',
        answer: 'spesso',
        sentence: [
            { text: 'Usciamo ' },
            { text: '', hasInput: true },
            { text: ' con i nostri amici.' }
        ],
        translation: 'Salimos a menudo con nuestros amigos.',
        hint: '"Spesso" significa a menudo.'
    },
    {
        id: 6,
        type: 'quantity',
        answer: 'poco',
        sentence: [
            { text: 'Ho ' },
            { text: '', hasInput: true },
            { text: ' tempo oggi, devo correre.' }
        ],
        translation: 'Tengo poco tiempo hoy, debo correr.',
        hint: '"Poco" indica una cantidad pequeña.'
    },
    {
        id: 7,
        type: 'frequency',
        answer: 'qualche volta',
        sentence: [
            { text: '', hasInput: true },
            { text: ' cucino io la cena.' }
        ],
        translation: 'A veces cocino yo la cena.',
        hint: '"Qualche volta" significa a veces.'
    },
    {
        id: 8,
        type: 'quantity',
        answer: 'abbastanza',
        sentence: [
            { text: 'Ho mangiato ' },
            { text: '', hasInput: true },
            { text: ', sono sazio.' }
        ],
        translation: 'He mangiado suficiente, estoy lleno.',
        hint: '"Abbastanza" es suficiente o bastante.'
    }
];

export default function PraticaAvverbiScreen() {
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

    const ricomincia = () => {
        setCurrentIndex(0);
        setUserInput('');
        setShowHint(false);
        setIsCompleted(false);
    };

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Stack.Screen options={{ title: 'Bravissimo!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Precisión Total!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Has aprendido a usar los adverbios de cantidad y tiempo con precisión. ¡Ottimo lavoro!
                    </Text>

                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]}
                        onPress={ricomincia}
                    >
                        <RotateCcw size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Repetir</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Salir</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Práctica: Adverbios' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {currentEsercizio.type === 'quantity' ? (
                            <BarChart3 size={16} color={theme.primary} />
                        ) : (
                            <Clock size={16} color={theme.primary} />
                        )}
                        <Text style={[styles.progressText, { color: theme.text }]}>
                            {currentEsercizio.type === 'quantity' ? 'Quantità' : 'Frequenza'}
                        </Text>
                    </View>
                    <Text style={[styles.progressCount, { color: theme.muted }]}>
                        {currentIndex + 1} / {ESERCIZI.length}
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
                <View style={styles.sentenceContainer}>
                    <View style={styles.sentenceRow}>
                        <Pressable
                            onPress={() => {
                                const fullText = currentEsercizio.sentence.map(s => s.hasInput ? expectedAnswer : s.text).join('');
                                speak(fullText);
                            }}
                            style={styles.speakerButton}
                        >
                            <Volume2 size={20} color={theme.primary} />
                        </Pressable>
                        <View style={styles.segmentsContainer}>
                            {currentEsercizio.sentence.map((seg, idx) => (
                                <React.Fragment key={idx}>
                                    {seg.hasInput ? (
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    color: theme.text,
                                                    borderColor: isCorrect ? theme.success : theme.border,
                                                    minWidth: 100
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
                                        <Text style={[styles.sentenceText, { color: theme.text }]}>{seg.text}</Text>
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </View>
                <Text style={[styles.translation, { color: theme.muted }]}>{currentEsercizio.translation}</Text>
            </View>

            <View style={styles.actionsContainer}>
                {showHint && (
                    <View style={[styles.hintCard, { backgroundColor: '#FFF3E0', borderColor: '#FFB300' }]}>
                        <View style={styles.hintHeader}>
                            <Lightbulb size={16} color="#F57C00" />
                            <Text style={[styles.hintTitle, { color: '#F57C00' }]}>Ayuda:</Text>
                        </View>
                        <Text style={[styles.hintText, { color: '#E65100' }]}>{currentEsercizio.hint}</Text>
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
                        <Text style={styles.primaryButtonText}>¡Buen trabajo!</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressCount: {
        fontSize: 12,
        fontWeight: '600'
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
        minHeight: 160,
        justifyContent: 'center'
    },
    sentenceContainer: {
        marginBottom: 12,
    },
    sentenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    speakerButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#f0f4f8',
    },
    segmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        flex: 1,
    },
    sentenceText: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 32,
    },
    input: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 8,
        textAlign: 'center',
        marginHorizontal: 6,
    },
    translation: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center'
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
