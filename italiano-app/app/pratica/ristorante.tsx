import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Lightbulb, RotateCcw, ShoppingBag, Trophy, Utensils, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Esercizio {
    id: number;
    type: 'restaurant' | 'shopping';
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
        type: 'restaurant',
        answer: 'tavolo',
        dialogue: [
            { person: 'Cameriere', text: 'Buongiorno! Avete una prenotazione?' },
            { person: 'Cliente', text: 'No, vorrei un ', hasInput: true },
            { person: 'Cliente', text: ' per due persone.' }
        ],
        hint: '"Tavolo" es mesa.'
    },
    {
        id: 2,
        type: 'restaurant',
        answer: 'menù',
        dialogue: [
            { person: 'Cliente', text: 'Scusi, posso avere il ', hasInput: true },
            { person: 'Cliente', text: '?' },
            { person: 'Cameriere', text: 'Certamente, arrivo subito.' }
        ],
        hint: 'Es igual que en español pero con tilde grave (ù).'
    },
    {
        id: 3,
        type: 'restaurant',
        answer: 'ordinare',
        dialogue: [
            { person: 'Cameriere', text: 'Siete pronti per ', hasInput: true },
            { person: 'Cameriere', text: '?' },
            { person: 'Cliente', text: 'Sì, vorrei una lasagna.' }
        ],
        hint: '"Ordinare" es pedir comida.'
    },
    {
        id: 4,
        type: 'restaurant',
        answer: 'conto',
        dialogue: [
            { person: 'Cliente', text: 'Era tutto buonissimo. Il ', hasInput: true },
            { person: 'Cliente', text: ', per favore.' },
            { person: 'Cameriere', text: 'Ariva subito.' }
        ],
        hint: '"Conto" es la cuenta.'
    },
    {
        id: 5,
        type: 'shopping',
        answer: 'costa',
        dialogue: [
            { person: 'Cliente', text: 'Buongiorno, quanto ', hasInput: true },
            { person: 'Cliente', text: ' questo vestito?' },
            { person: 'Commesso', text: 'Costa 50 euro.' }
        ],
        hint: 'Verbo "costare" en 3ª persona singular.'
    },
    {
        id: 6,
        type: 'shopping',
        answer: 'provare',
        dialogue: [
            { person: 'Cliente', text: 'È molto bello. Posso ', hasInput: true },
            { person: 'Cliente', text: 'lo?' },
            { person: 'Commesso', text: 'Sì, i camerini sono lì.' }
        ],
        hint: '"Provare" es probarse la ropa.'
    },
    {
        id: 7,
        type: 'shopping',
        answer: 'sconto',
        dialogue: [
            { person: 'Cliente', text: 'È un po\' caro. C\'è uno ', hasInput: true },
            { person: 'Cliente', text: '?' },
            { person: 'Commesso', text: 'Sì, oggi c\'è il 20%.' }
        ],
        hint: '"Sconto" es descuento.'
    },
    {
        id: 8,
        type: 'shopping',
        answer: 'carta',
        dialogue: [
            { person: 'Commesso', text: 'Come desidera pagare?' },
            { person: 'Cliente', text: 'Pago con ', hasInput: true },
            { person: 'Cliente', text: ' di credito.' }
        ],
        hint: '"Tarjeta" se dice "carta".'
    }
];

export default function PraticaRistoranteScreen() {
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
    const hasStarted = userInput.length > 0;

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

    if (isCompleted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Stack.Screen options={{ title: 'Pronto!' }} />
                <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
                    <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>¡Cliente Experto!</Text>
                    <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
                        Ya sabes cómo pedir comida y comprar en Italia. ¡Buen provecho!
                    </Text>

                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]}
                        onPress={ricomincia}
                    >
                        <RotateCcw size={18} color="white" />
                        <Text style={styles.primaryButtonText}>Reiniciar</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Volver</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Restaurante y Compras' }} />

            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.progressHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {currentEsercizio.type === 'restaurant' ? (
                            <Utensils size={16} color={theme.primary} />
                        ) : (
                            <ShoppingBag size={16} color={theme.primary} />
                        )}
                        <Text style={[styles.progressText, { color: theme.text }]}>
                            {currentEsercizio.type === 'restaurant' ? 'Al Ristorante' : 'Shopping Time'}
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
                                            <TextInput
                                                style={[
                                                    styles.input,
                                                    {
                                                        color: theme.text,
                                                        borderColor: isCorrect ? theme.success : theme.border,
                                                        minWidth: 80
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
                    <View style={[styles.hintCard, { backgroundColor: '#F1F8E9', borderColor: '#8BC34A' }]}>
                        <View style={styles.hintHeader}>
                            <Lightbulb size={16} color="#558B2F" />
                            <Text style={[styles.hintTitle, { color: '#558B2F' }]}>Suggerimento:</Text>
                        </View>
                        <Text style={[styles.hintText, { color: '#33691E' }]}>{currentEsercizio.hint}</Text>
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
        minHeight: 180,
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
        fontSize: 16,
        width: 80,
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
