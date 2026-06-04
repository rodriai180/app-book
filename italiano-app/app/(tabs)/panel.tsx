import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Exercise, Lesson, VocabularyItem } from '@/constants/mockData';
import { DialogueLessonData, getAllDialogueExercises, getAllExercises, getLessons, getVocabulary } from '@/services/firestoreService';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SubtopicGroup = { subtopic: string; count: number; exercises: Exercise[] };
type LessonRow = {
    lesson: Lesson;
    subtopics: SubtopicGroup[];
    total: number;
    dialogueData: DialogueLessonData | null;
    expanded: boolean;
};

export default function PanelScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [rows, setRows] = useState<LessonRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalExercises, setTotalExercises] = useState(0);
    const [totalDialogue, setTotalDialogue] = useState(0);
    const [vocabByCategory, setVocabByCategory] = useState<Map<string, VocabularyItem[]>>(new Map());
    const [totalVocab, setTotalVocab] = useState(0);
    const [vocabExpanded, setVocabExpanded] = useState(false);

    useEffect(() => {
        Promise.all([getLessons(), getAllExercises(), getAllDialogueExercises(), getVocabulary()]).then(([lessons, exercises, dialogueMap, vocab]) => {
            const byLesson = groupExercises(lessons, exercises, dialogueMap);
            setRows(byLesson);
            setTotalExercises(exercises.length);
            setTotalDialogue(Object.values(dialogueMap).reduce((a, b) => a + b.count, 0));
            const catMap = new Map<string, VocabularyItem[]>();
            for (const v of vocab) {
                const cat = v.category || 'Sin categoría';
                if (!catMap.has(cat)) catMap.set(cat, []);
                catMap.get(cat)!.push(v);
            }
            setVocabByCategory(catMap);
            setTotalVocab(vocab.length);
            setLoading(false);
        });
    }, []);

    const toggle = (lessonId: string) => {
        setRows(prev => prev.map(r => r.lesson.id === lessonId ? { ...r, expanded: !r.expanded } : r));
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.surface }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.muted }]}>Cargando ejercicios...</Text>
            </View>
        );
    }

    const lessonsWithAny = rows.filter(r => r.total > 0 || (r.dialogueData?.count ?? 0) > 0);
    const lessonsWithout = rows.filter(r => r.total === 0 && (r.dialogueData?.count ?? 0) === 0);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={styles.content}>
            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.summaryTitle, { color: theme.text }]}>Resumen general</Text>
                <View style={styles.summaryRow}>
                    <StatBox label="Lecciones" value={rows.length} color={theme.primary} bg={theme.surface} textColor={theme.text} />
                    <StatBox label="Quiz" value={totalExercises} color={theme.quiz} bg={theme.surface} textColor={theme.text} />
                    <StatBox label="Diálogo" value={totalDialogue} color={theme.dialogue} bg={theme.surface} textColor={theme.text} />
                    <StatBox label="Vocab" value={totalVocab} color={theme.vocab} bg={theme.surface} textColor={theme.text} />
                </View>
            </View>

            <View style={[styles.legend, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.quiz }]} />
                    <Text style={[styles.legendText, { color: theme.muted }]}>Quiz — opción múltiple</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.dialogue }]} />
                    <Text style={[styles.legendText, { color: theme.muted }]}>Diálogo — completar texto</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.vocab }]} />
                    <Text style={[styles.legendText, { color: theme.muted }]}>Vocabulario</Text>
                </View>
            </View>

            <VocabularyCard
                vocabByCategory={vocabByCategory}
                totalVocab={totalVocab}
                expanded={vocabExpanded}
                onToggle={() => setVocabExpanded(v => !v)}
                theme={theme}
            />

            {lessonsWithAny.map(row => (
                <LessonCard key={row.lesson.id} row={row} theme={theme} onToggle={() => toggle(row.lesson.id)} />
            ))}

            {lessonsWithout.length > 0 && (
                <View style={[styles.emptySection, { borderColor: theme.border }]}>
                    <Text style={[styles.emptySectionTitle, { color: theme.muted }]}>Sin ejercicios ({lessonsWithout.length})</Text>
                    {lessonsWithout.map(r => (
                        <Text key={r.lesson.id} style={[styles.emptyLesson, { color: theme.muted }]}>
                            · [{r.lesson.level}] {r.lesson.title}
                        </Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

function VocabularyCard({ vocabByCategory, totalVocab, expanded, onToggle, theme }: {
    vocabByCategory: Map<string, VocabularyItem[]>;
    totalVocab: number;
    expanded: boolean;
    onToggle: () => void;
    theme: any;
}) {
    const router = useRouter();

    const goToVocabEditor = (category: string) => {
        router.push({
            pathname: '/panel-editor',
            params: { type: 'vocabulary', lessonId: category, lessonTitle: category },
        });
    };

    return (
        <View style={[styles.lessonCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.lessonHeader} onPress={onToggle} activeOpacity={0.7}>
                <View style={styles.lessonHeaderLeft}>
                    <View style={[styles.levelBadge, { backgroundColor: theme.vocab }]}>
                        <Text style={styles.levelBadgeText}>VOCAB</Text>
                    </View>
                    <Text style={[styles.lessonTitle, { color: theme.text }]}>Vocabulario</Text>
                </View>
                <View style={styles.countsRow}>
                    <CountPill value={totalVocab} color={theme.vocab} />
                    {vocabByCategory.size > 0
                        ? <ChevronDown size={16} color={theme.muted} style={expanded ? {} : { transform: [{ rotate: '-90deg' }] }} />
                        : <ChevronRight size={16} color={theme.muted} style={{ opacity: 0.3 }} />
                    }
                </View>
            </TouchableOpacity>

            {expanded && vocabByCategory.size > 0 && (
                <View style={[styles.expandedBody, { borderTopColor: theme.border }]}>
                    <View style={styles.section}>
                        {[...vocabByCategory.keys()].map((cat, idx) => (
                            <View key={cat} style={idx > 0 ? { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 6, paddingTop: 8 } : undefined}>
                                <TouchableOpacity onPress={() => goToVocabEditor(cat)} activeOpacity={0.7}>
                                    <Text style={[styles.sectionLabel, styles.sectionLabelLink, { color: theme.vocab }]}>
                                        {cat.toUpperCase()} ›
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

function LessonCard({ row, theme, onToggle }: { row: LessonRow; theme: any; onToggle: () => void }) {
    const router = useRouter();
    const dialogueCount = row.dialogueData?.count ?? 0;
    const hasExpandable = true;

    const goToEditor = (type: 'quiz' | 'dialogue' | 'content') => {
        router.push({
            pathname: '/panel-editor',
            params: { type, lessonId: row.lesson.id, lessonTitle: row.lesson.title },
        });
    };

    return (
        <View style={[styles.lessonCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.lessonHeader} onPress={onToggle} activeOpacity={0.7}>
                <View style={styles.lessonHeaderLeft}>
                    <View style={[styles.levelBadge, { backgroundColor: levelColor(row.lesson.level, theme) }]}>
                        <Text style={styles.levelBadgeText}>{row.lesson.level}</Text>
                    </View>
                    <Text style={[styles.lessonTitle, { color: theme.text }]} numberOfLines={1}>
                        {row.lesson.title}
                    </Text>
                </View>
                <View style={styles.countsRow}>
                    <CountPill value={row.total} color={theme.quiz} />
                    <CountPill value={dialogueCount} color={theme.dialogue} />
                    {hasExpandable
                        ? <ChevronDown size={16} color={theme.muted} style={row.expanded ? {} : { transform: [{ rotate: '-90deg' }] }} />
                        : <ChevronRight size={16} color={theme.muted} style={{ opacity: 0.3 }} />
                    }
                </View>
            </TouchableOpacity>

            {row.expanded && (
                <View style={[styles.expandedBody, { borderTopColor: theme.border }]}>
                    {row.subtopics.length > 0 && (
                        <View style={styles.section}>
                            <TouchableOpacity onPress={() => goToEditor('quiz')} activeOpacity={0.7}>
                                <Text style={[styles.sectionLabel, styles.sectionLabelLink, { color: theme.quiz }]}>
                                    QUIZ — RETO RÁPIDO ›
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.section, row.subtopics.length > 0 && { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 4, paddingTop: 10 }]}>
                        <TouchableOpacity onPress={() => goToEditor('dialogue')} activeOpacity={0.7}>
                            <Text style={[styles.sectionLabel, styles.sectionLabelLink, { color: theme.dialogue }]}>
                                {dialogueCount > 0
                                    ? `SESIÓN TOTAL — COMPLETAR TEXTO ›`
                                    : `SESIÓN TOTAL — CREAR NUEVO ›`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.section, { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 4, paddingTop: 10 }]}>
                        <TouchableOpacity onPress={() => goToEditor('content')} activeOpacity={0.7}>
                            <Text style={[styles.sectionLabel, styles.sectionLabelLink, { color: theme.vocab }]}>
                                CONTENIDO — EJEMPLOS ›
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

function CountPill({ value, color }: { value: number; color: string }) {
    return (
        <View style={[styles.pill, { backgroundColor: value > 0 ? color + '20' : '#f3f4f6' }]}>
            <Text style={[styles.pillText, { color: value > 0 ? color : '#9ca3af' }]}>{value}</Text>
        </View>
    );
}

function StatBox({ label, value, color, bg, textColor }: { label: string; value: number; color: string; bg: string; textColor: string }) {
    return (
        <View style={[styles.statBox, { backgroundColor: bg }]}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
        </View>
    );
}

function groupExercises(lessons: Lesson[], exercises: Exercise[], dialogueMap: Record<string, DialogueLessonData>): LessonRow[] {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1/C2'];
    const sorted = [...lessons].sort((a, b) => {
        const ai = levelOrder.indexOf(a.level);
        const bi = levelOrder.indexOf(b.level);
        return ai !== bi ? ai - bi : Number(a.id) - Number(b.id);
    });

    return sorted.map(lesson => {
        const lessonExercises = exercises.filter(e => String(e.lessonId) === String(lesson.id));
        const subtopicMap = new Map<string, Exercise[]>();
        for (const ex of lessonExercises) {
            const key = ex.subtopic || 'Sin subtema';
            if (!subtopicMap.has(key)) subtopicMap.set(key, []);
            subtopicMap.get(key)!.push(ex);
        }
        const subtopics: SubtopicGroup[] = Array.from(subtopicMap.entries()).map(([subtopic, exs]) => ({ subtopic, count: exs.length, exercises: exs }));
        return {
            lesson,
            subtopics,
            total: lessonExercises.length,
            dialogueData: dialogueMap[String(lesson.id)] ?? null,
            expanded: false,
        };
    });
}

function levelColor(level: string, theme: any): string {
    // Progresión bandera italiana: Verde (principiante) → Oro (intermedio) → Rojo (avanzado)
    const map: Record<string, string> = {
        A1:     theme.primary,    // Verde italiano — principiante
        A2:     '#00A855',        // Verde claro — pre-intermedio
        B1:     theme.vocab,      // Oro italiano — intermedio
        B2:     '#D4820A',        // Ámbar oscuro — pre-avanzado
        'C1/C2': theme.secondary, // Rojo italiano — avanzado
    };
    return map[level] ?? theme.muted;
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, gap: 12, paddingBottom: 32 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14 },
    summaryCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    summaryRow: { flexDirection: 'row', gap: 8 },
    statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: 'bold' },
    statLabel: { fontSize: 10, marginTop: 2, textAlign: 'center' },
    legend: { borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12 },
    lessonCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    lessonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
    lessonHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    levelBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    levelBadgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
    lessonTitle: { fontSize: 13, fontWeight: '600', flex: 1 },
    countsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, minWidth: 32, alignItems: 'center' },
    pillText: { fontSize: 13, fontWeight: 'bold' },
    expandedBody: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
    section: { gap: 4 },
    sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginBottom: 6, marginTop: 2 },
    sectionLabelLink: { textDecorationLine: 'underline' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3 },
    itemName: { fontSize: 13, flex: 1, paddingRight: 8 },
    countBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, minWidth: 32, alignItems: 'center' },
    countText: { fontSize: 13, fontWeight: 'bold' },
    emptySection: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 4 },
    emptySectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
    emptyLesson: { fontSize: 12 },
});
