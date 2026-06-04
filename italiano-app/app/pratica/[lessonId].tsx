import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { getDialogueExercisesByLessonId } from '@/services/firestoreService';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CheckCircle2, Info, Lightbulb, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type DialogueSeg = { person: string; text: string; hasInput?: boolean };
type SentenceSeg = { text: string; hasInput?: boolean };

interface DialogueExercise {
  id: number;
  answer: string;
  dialogue: DialogueSeg[];
  hint: string;
}

interface SentenceExercise {
  id: number;
  answer: string;
  sentence: SentenceSeg[];
  translation: string;
  hint: string;
}

type Exercise = DialogueExercise | SentenceExercise;

function isDialogue(ex: Exercise): ex is DialogueExercise {
  return 'dialogue' in ex;
}

export default function GenericPraticaScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = Colors[colorScheme ?? 'light'];

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState('Pratica');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getDialogueExercisesByLessonId(lessonId ?? '');
        if (data) {
          setExercises(data.exercises ?? []);
          setTitle(data.title ?? 'Pratica');
        }
      } catch (err) {
        console.error('Error fetching dialogue exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [lessonId]);

  useEffect(() => {
    if (exercises.length > 0) {
      Animated.timing(progressAnim, {
        toValue: currentIndex / exercises.length,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, exercises.length]);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ title: 'Pratica' }} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.muted, marginTop: 10 }}>Cargando ejercicios...</Text>
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ title: 'Pratica' }} />
        <Text style={{ color: theme.text }}>No hay ejercicios disponibles.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: theme.primary, marginTop: 20 }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const currentEx = exercises[currentIndex];
  const expectedAnswer = currentEx.answer;
  const isCorrect = userInput.toLowerCase().trim() === expectedAnswer.toLowerCase();
  const hasStarted = userInput.length > 0;

  let feedbackMessage = '';
  let feedbackColor = theme.muted;
  if (hasStarted && !isCorrect) {
    if (userInput.toLowerCase() === expectedAnswer.toLowerCase()) {
      feedbackMessage = 'Controlla le maiuscole.';
      feedbackColor = '#E65100';
    } else {
      feedbackMessage = '📝 Continua…';
    }
  }

  const handleVerifica = () => {
    if (!isCorrect) return;
    speak(expectedAnswer);
    setIsVerifying(true);
    setTimeout(() => {
      if (currentIndex < exercises.length - 1) {
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
  };

  const ricomincia = () => {
    setCurrentIndex(0);
    setUserInput('');
    setShowHint(false);
    setIsCompleted(false);
    progressAnim.setValue(0);
  };

  if (isCompleted) {
    return (
      <>
        <Stack.Screen options={{ title: 'Completato' }} />
        <View style={[styles.container, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <View style={[styles.card, { backgroundColor: theme.card, width: '100%', alignItems: 'center', padding: 30 }]}>
            <Trophy size={64} color={theme.primary} style={{ marginBottom: 20 }} />
            <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>Complimenti!</Text>
            <Text style={[styles.subtitle, { color: theme.muted, textAlign: 'center', marginBottom: 30 }]}>
              Hai completato la pratica di {exercises.length} esercizi.
            </Text>
            <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary, width: '100%' }]} onPress={ricomincia}>
              <RotateCcw size={18} color="white" />
              <Text style={styles.primaryButtonText}>Ricomincia</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, { borderColor: theme.border, width: '100%', marginTop: 12 }]} onPress={() => router.back()}>
              <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Torna alla lezione</Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.contentContainer}>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: theme.text }]}>
              Esercizio {currentIndex + 1} di {exercises.length}
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
            <Animated.View style={[styles.progressBarFill, {
              backgroundColor: theme.primary,
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]} />
          </View>
        </View>

        {/* Exercise card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: isCorrect ? theme.success : theme.border }]}>
          {isDialogue(currentEx) ? (
            <DialogueRenderer ex={currentEx} userInput={userInput} setUserInput={setUserInput} isCorrect={isCorrect} theme={theme} speak={speak} />
          ) : (
            <SentenceRenderer ex={currentEx as SentenceExercise} userInput={userInput} setUserInput={setUserInput} isCorrect={isCorrect} theme={theme} speak={speak} />
          )}

          {hasStarted && (
            <View style={styles.feedbackArea}>
              <View style={styles.feedbackRow}>
                {isCorrect
                  ? <CheckCircle2 size={16} color={theme.success} />
                  : <Info size={16} color={feedbackColor} />
                }
                <Text style={[styles.feedbackText, { color: isCorrect ? theme.success : feedbackColor, fontWeight: isCorrect ? 'bold' : '500' }]}>
                  {isCorrect ? '✅ Corretto' : feedbackMessage}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {showHint && (
            <View style={[styles.hintCard, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
              <View style={styles.hintHeader}>
                <Lightbulb size={16} color="#F57F17" />
                <Text style={styles.hintTitle}>Suggerimento:</Text>
              </View>
              <Text style={styles.hintText}>{currentEx.hint}</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <Pressable style={[styles.secondaryButton, { borderColor: theme.border, flex: 1 }]} onPress={() => setShowHint(true)}>
              <Lightbulb size={18} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Suggerimento</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: isCorrect ? theme.success : theme.primary, flex: 1.5, opacity: isVerifying ? 0.7 : 1 }]}
              onPress={handleVerifica}
            >
              {isVerifying
                ? <Text style={styles.primaryButtonText}>Ottimo!</Text>
                : <><CheckCircle2 size={18} color="white" /><Text style={styles.primaryButtonText}>Verifica</Text></>
              }
            </Pressable>
          </View>
          <Pressable style={styles.resetButton} onPress={() => { setUserInput(''); setShowHint(false); }}>
            <Text style={[styles.resetText, { color: theme.muted }]}>Ricomincia esercizio</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

// ── Dialogue renderer ────────────────────────────────────────────────────────

function DialogueRenderer({ ex, userInput, setUserInput, isCorrect, theme, speak }: {
  ex: DialogueExercise; userInput: string; setUserInput: (v: string) => void;
  isCorrect: boolean; theme: any; speak: (t: string) => void;
}) {
  const rows: { person: string; segments: DialogueSeg[] }[] = [];
  for (const seg of ex.dialogue) {
    const last = rows[rows.length - 1];
    if (!last || last.person !== seg.person) {
      rows.push({ person: seg.person, segments: [seg] });
    } else {
      last.segments.push(seg);
    }
  }

  return (
    <View style={styles.dialogueContainer}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.dialogueRow}>
          <Pressable
            onPress={() => {
              const full = row.segments.map(s => s.hasInput ? ex.answer : s.text).join('');
              speak(full);
            }}
            style={styles.speakerButton}
          >
            <Volume2 size={16} color={theme.primary} />
          </Pressable>
          <Text style={[styles.personLabel, { color: theme.primary }]}>{row.person}:</Text>
          <View style={styles.segmentsContainer}>
            {row.segments.map((seg, si) =>
              seg.hasInput ? (
                <React.Fragment key={si}>
                  {seg.text ? <Text style={[styles.dialogueText, { color: theme.text }]}>{seg.text}</Text> : null}
                  <TextInput
                    style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: Math.max(80, ex.answer.length * 10) }]}
                    value={userInput}
                    onChangeText={setUserInput}
                    autoFocus={si === 0 && ri === 0}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </React.Fragment>
              ) : (
                <Text key={si} style={[styles.dialogueText, { color: theme.text }]}>{seg.text}</Text>
              )
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Sentence renderer ─────────────────────────────────────────────────────────

function SentenceRenderer({ ex, userInput, setUserInput, isCorrect, theme, speak }: {
  ex: SentenceExercise; userInput: string; setUserInput: (v: string) => void;
  isCorrect: boolean; theme: any; speak: (t: string) => void;
}) {
  return (
    <View>
      <View style={styles.sentenceRow}>
        <Pressable
          onPress={() => {
            const full = ex.sentence.map(s => s.hasInput ? ex.answer : s.text).join('');
            speak(full);
          }}
          style={styles.speakerButton}
        >
          <Volume2 size={20} color={theme.primary} />
        </Pressable>
        <View style={styles.segmentsContainer}>
          {ex.sentence.map((seg, i) =>
            seg.hasInput ? (
              <TextInput
                key={i}
                style={[styles.input, { color: theme.text, borderColor: isCorrect ? theme.success : theme.border, minWidth: 100 }]}
                value={userInput}
                onChangeText={setUserInput}
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="..."
              />
            ) : (
              <Text key={i} style={[styles.sentenceText, { color: theme.text }]}>{seg.text}</Text>
            )
          )}
        </View>
      </View>
      {ex.translation ? (
        <Text style={[styles.translation, { color: theme.muted }]}>{ex.translation}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: Theme.spacing.lg, paddingBottom: Theme.spacing.xxl, gap: Theme.spacing.lg },
  progressCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, borderWidth: 1 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 14, fontWeight: 'bold' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  card: { padding: Theme.spacing.lg, borderRadius: Theme.roundness.xl, borderWidth: 2, ...Theme.shadows.medium, minHeight: 160 },
  dialogueContainer: { gap: Theme.spacing.md },
  dialogueRow: { flexDirection: 'row', gap: 12, alignItems: 'baseline' },
  personLabel: { fontWeight: 'bold', fontSize: 18, width: 28 },
  speakerButton: { padding: 4, marginRight: 4, borderRadius: 12, backgroundColor: '#f0f9ff' },
  segmentsContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' },
  dialogueText: { fontSize: 18, fontWeight: '500', lineHeight: 28 },
  sentenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sentenceText: { fontSize: 20, fontWeight: '600', lineHeight: 32 },
  translation: { fontSize: 14, fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  input: {
    fontSize: 18, fontWeight: '700', paddingVertical: 2, paddingHorizontal: 8,
    borderWidth: 2, borderRadius: Theme.roundness.md, textAlign: 'center',
  },
  feedbackArea: { marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackText: { fontSize: 15 },
  actionsContainer: { gap: Theme.spacing.md },
  buttonRow: { flexDirection: 'row', gap: Theme.spacing.md },
  hintCard: { padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, borderWidth: 1 },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  hintTitle: { fontWeight: 'bold', fontSize: 14, color: '#F57F17' },
  hintText: { fontSize: 14, color: '#5D4037', lineHeight: 20 },
  primaryButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: Theme.spacing.md, borderRadius: Theme.roundness.full, gap: 8,
  },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: Theme.spacing.md, borderRadius: Theme.roundness.full, borderWidth: 1, gap: 8,
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '600' },
  resetButton: { alignItems: 'center', padding: 8 },
  resetText: { fontSize: 13, textDecorationLine: 'underline' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 22 },
});
