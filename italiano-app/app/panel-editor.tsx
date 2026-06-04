import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Exercise, LevelContent, VocabularyItem } from '@/constants/mockData';
import {
    getDialogueExercisesByLessonId,
    getExercisesByLessonId,
    getLevelContentByLessonId,
    getVocabularyByCategory,
    saveDialogueExercisesForLesson,
    saveLevelContentForLesson,
    saveSubtopicExercises,
    saveVocabularyByCategory,
} from '@/services/firestoreService';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type SubtopicState = { json: string; valid: boolean; status: SaveStatus };

export default function PanelEditorScreen() {
    const { type, lessonId, lessonTitle } = useLocalSearchParams<{
        type: string; lessonId: string; lessonTitle: string;
    }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const screenTitle = type === 'quiz'
        ? `Quiz — ${lessonTitle}`
        : type === 'vocabulary'
        ? `Vocab — ${lessonTitle}`
        : type === 'content'
        ? `Contenido — ${lessonTitle}`
        : `Sesión Total — ${lessonTitle}`;

    return (
        <>
            <Stack.Screen options={{ title: screenTitle, headerBackTitle: 'Panel' }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {type === 'quiz'
                    ? <QuizEditor lessonId={lessonId ?? ''} theme={theme} />
                    : type === 'vocabulary'
                    ? <VocabularyEditor category={lessonId ?? ''} theme={theme} />
                    : type === 'content'
                    ? <ContentEditor lessonId={lessonId ?? ''} theme={theme} />
                    : <DialogueEditor lessonId={lessonId ?? ''} theme={theme} />
                }
            </KeyboardAvoidingView>
        </>
    );
}

// ── Quiz Editor ──────────────────────────────────────────────────────────────

function QuizEditor({ lessonId, theme }: { lessonId: string; theme: any }) {
    const [subtopics, setSubtopics] = useState<Map<string, SubtopicState>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExercisesByLessonId(lessonId).then(exercises => {
            const grouped = new Map<string, Exercise[]>();
            for (const ex of exercises) {
                const key = ex.subtopic ?? 'Sin subtema';
                if (!grouped.has(key)) grouped.set(key, []);
                grouped.get(key)!.push(ex);
            }
            const stateMap = new Map<string, SubtopicState>();
            grouped.forEach((exs, key) => {
                stateMap.set(key, { json: JSON.stringify(exs, null, 2), valid: true, status: 'idle' });
            });
            setSubtopics(stateMap);
            setLoading(false);
        });
    }, [lessonId]);

    const update = (key: string, text: string) => {
        let valid = false;
        try { JSON.parse(text); valid = true; } catch {}
        setSubtopics(prev => {
            const next = new Map(prev);
            next.set(key, { ...prev.get(key)!, json: text, valid, status: 'idle' });
            return next;
        });
    };

    const save = async (key: string) => {
        const st = subtopics.get(key);
        if (!st?.valid) return;
        setSubtopics(prev => { const n = new Map(prev); n.set(key, { ...st, status: 'saving' }); return n; });
        try {
            await saveSubtopicExercises(lessonId, key, JSON.parse(st.json) as Exercise[]);
            setSubtopics(prev => { const n = new Map(prev); n.set(key, { ...st, status: 'saved' }); return n; });
        } catch {
            setSubtopics(prev => { const n = new Map(prev); n.set(key, { ...st, status: 'error' }); return n; });
        }
    };

    if (loading) return <LoadingView theme={theme} />;

    if (subtopics.size === 0) {
        return (
            <View style={[styles.center, { backgroundColor: theme.surface }]}>
                <Text style={{ color: theme.muted }}>Esta lección no tiene ejercicios de quiz.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.surface }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            {[...subtopics.entries()].map(([key, st]) => {
                let count = 0;
                try { count = JSON.parse(st.json).length; } catch {}
                return (
                    <View key={key} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={[styles.subtopicLabel, { color: '#3B82F6' }]}>{key}</Text>
                                <Text style={[styles.countLabel, { color: theme.muted }]}>{count} ejercicios</Text>
                            </View>
                            <SaveButton valid={st.valid} status={st.status} color="#3B82F6" onPress={() => save(key)} />
                        </View>
                        <JsonInput value={st.json} onChangeText={t => update(key, t)} valid={st.valid} />
                        <StatusLine status={st.status} valid={st.valid} />
                    </View>
                );
            })}
        </ScrollView>
    );
}

// ── Dialogue Editor ──────────────────────────────────────────────────────────

function DialogueEditor({ lessonId, theme }: { lessonId: string; theme: any }) {
    const [fullData, setFullData] = useState<any>(null);
    const [json, setJson] = useState('');
    const [valid, setValid] = useState(true);
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDialogueExercisesByLessonId(lessonId).then(data => {
            setFullData(data);
            setJson(JSON.stringify(data?.exercises ?? [], null, 2));
            setLoading(false);
        });
    }, [lessonId]);

    const handleChange = (text: string) => {
        setJson(text);
        setStatus('idle');
        try { JSON.parse(text); setValid(true); } catch { setValid(false); }
    };

    const save = async () => {
        if (!valid) return;
        setStatus('saving');
        try {
            await saveDialogueExercisesForLesson(lessonId, JSON.parse(json));
            setStatus('saved');
        } catch {
            setStatus('error');
        }
    };

    if (loading) return <LoadingView theme={theme} />;

    let count = 0;
    try { const p = JSON.parse(json); count = Array.isArray(p) ? p.length : 0; } catch {}

    return (
        <View style={[styles.fullscreenOuter, { backgroundColor: theme.surface }]}>
            <View style={[styles.fullscreenCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={[styles.subtopicLabel, { color: '#8B5CF6' }]}>exercises</Text>
                        <Text style={[styles.countLabel, { color: theme.muted }]}>
                            {!fullData ? 'Nuevo documento — pega el JSON y guarda' : `${count} ejercicios`}
                        </Text>
                    </View>
                    <SaveButton valid={valid} status={status} color="#8B5CF6" onPress={save} />
                </View>
                <JsonInput value={json} onChangeText={handleChange} valid={valid} grow />
                <StatusLine status={status} valid={valid} />
            </View>
        </View>
    );
}

// ── Content Editor ───────────────────────────────────────────────────────────

function ContentEditor({ lessonId, theme }: { lessonId: string; theme: any }) {
    const [json, setJson] = useState('');
    const [valid, setValid] = useState(true);
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLevelContentByLessonId(lessonId).then(items => {
            setJson(JSON.stringify(items, null, 2));
            setLoading(false);
        });
    }, [lessonId]);

    const handleChange = (text: string) => {
        setJson(text);
        setStatus('idle');
        try { JSON.parse(text); setValid(true); } catch { setValid(false); }
    };

    const save = async () => {
        if (!valid) return;
        setStatus('saving');
        try {
            await saveLevelContentForLesson(lessonId, JSON.parse(json) as LevelContent[]);
            setStatus('saved');
        } catch {
            setStatus('error');
        }
    };

    if (loading) return <LoadingView theme={theme} />;

    let count = 0;
    try { const p = JSON.parse(json); count = Array.isArray(p) ? p.length : 0; } catch {}

    return (
        <View style={[styles.fullscreenOuter, { backgroundColor: theme.surface }]}>
            <View style={[styles.fullscreenCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={[styles.subtopicLabel, { color: '#F59E0B' }]}>levelContents</Text>
                        <Text style={[styles.countLabel, { color: theme.muted }]}>{count} subtemas</Text>
                    </View>
                    <SaveButton valid={valid} status={status} color="#F59E0B" onPress={save} />
                </View>
                <JsonInput value={json} onChangeText={handleChange} valid={valid} grow />
                <StatusLine status={status} valid={valid} />
            </View>
        </View>
    );
}

// ── Vocabulary Editor ────────────────────────────────────────────────────────

function VocabularyEditor({ category, theme }: { category: string; theme: any }) {
    const [json, setJson] = useState('');
    const [valid, setValid] = useState(true);
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVocabularyByCategory(category).then(items => {
            setJson(JSON.stringify(items, null, 2));
            setLoading(false);
        });
    }, [category]);

    const handleChange = (text: string) => {
        setJson(text);
        setStatus('idle');
        try { JSON.parse(text); setValid(true); } catch { setValid(false); }
    };

    const save = async () => {
        if (!valid) return;
        setStatus('saving');
        try {
            await saveVocabularyByCategory(category, JSON.parse(json) as VocabularyItem[]);
            setStatus('saved');
        } catch {
            setStatus('error');
        }
    };

    if (loading) return <LoadingView theme={theme} />;

    let count = 0;
    try { const p = JSON.parse(json); count = Array.isArray(p) ? p.length : 0; } catch {}

    return (
        <View style={[styles.fullscreenOuter, { backgroundColor: theme.surface }]}>
            <View style={[styles.fullscreenCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={[styles.subtopicLabel, { color: '#10B981' }]}>{category}</Text>
                        <Text style={[styles.countLabel, { color: theme.muted }]}>{count} palabras</Text>
                    </View>
                    <SaveButton valid={valid} status={status} color="#10B981" onPress={save} />
                </View>
                <JsonInput value={json} onChangeText={handleChange} valid={valid} grow />
                <StatusLine status={status} valid={valid} />
            </View>
        </View>
    );
}

// ── Shared components ────────────────────────────────────────────────────────

function SaveButton({ valid, status, color, onPress }: {
    valid: boolean; status: SaveStatus; color: string; onPress: () => void;
}) {
    if (status === 'saving') return <ActivityIndicator size="small" color={color} />;
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!valid}
            style={[styles.saveBtn, { backgroundColor: valid ? color : '#9ca3af' }]}
            activeOpacity={0.8}
        >
            <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
    );
}

function JsonInput({ value, onChangeText, valid, grow }: {
    value: string; onChangeText: (t: string) => void; valid: boolean; grow?: boolean;
}) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            style={[styles.jsonInput, { borderColor: valid ? '#334155' : '#ef4444' }, grow && styles.jsonInputGrow]}
        />
    );
}

function StatusLine({ status, valid }: { status: SaveStatus; valid: boolean }) {
    if (!valid) return <Text style={styles.errorText}>JSON inválido</Text>;
    if (status === 'saved') return <Text style={styles.savedText}>✓ Guardado en Firestore</Text>;
    if (status === 'error') return <Text style={styles.errorText}>Error al guardar</Text>;
    return null;
}

function LoadingView({ theme }: { theme: any }) {
    return (
        <View style={[styles.center, { backgroundColor: theme.surface }]}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, gap: 12, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fullscreenOuter: { flex: 1, padding: 16 },
    fullscreenCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
    card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    subtopicLabel: { fontSize: 14, fontWeight: '700' },
    countLabel: { fontSize: 12, marginTop: 2 },
    saveBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
    saveBtnText: { color: 'white', fontSize: 13, fontWeight: '600' },
    jsonInput: {
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        padding: 12,
        borderRadius: 8,
        fontSize: 12,
        lineHeight: 18,
        minHeight: 200,
        borderWidth: 1,
    },
    jsonInputGrow: { flex: 1, minHeight: undefined },
    errorText: { fontSize: 12, color: '#ef4444' },
    savedText: { fontSize: 12, color: '#22c55e' },
});
