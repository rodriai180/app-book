import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import {
    ArrowLeft, BookOpen, Play, Square, Mic, Bookmark, ChevronDown, ChevronUp,
} from 'lucide-react-native';
import {
    getBookById, getChaptersByBook, getMicrolearningsByChapter,
    isBookSaved, saveBook, unsaveBook,
} from '../src/services/bookContentService';
import { BookData, ChapterData, MicrolearningData, Exercise } from '../src/models/BookModels';
import { AudioService } from '../src/services/AudioService';
import { useTheme } from '../src/services/themeContext';
import { useSettings } from '../src/services/settingsContext';
import { useAuth } from '../src/services/authContext';
import GeneratedCover from '../src/components/GeneratedCover';
import HighlightedText from '../src/components/HighlightedText';

// ─── Colores de categoría (mismo helper que summaries.tsx) ───────────────────
const CATEGORY_COLORS = [
    '#5E5CE6', '#FF6B6B', '#FF9F43', '#1DD1A1',
    '#48DBFB', '#FF9FF3', '#54A0FF', '#C8D6E5',
];
function categoryColor(cat: string): string {
    let hash = 0;
    for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

// ─── Ícono y color por tipo de ejercicio ─────────────────────────────────────
const EXERCISE_META: Record<Exercise['type'], { icon: React.ReactNode; color: string; label: string }> = {
    reflection: { icon: null, color: '#5E5CE6', label: 'Reflexión' },
    action:     { icon: null, color: '#FF9F43', label: 'Acción' },
    journaling: { icon: null, color: '#1DD1A1', label: 'Journaling' },
};

type PlayTarget = { kind: 'summary' } | { kind: 'ml'; id: string };

export default function ChapterDetailScreen() {
    const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const { user } = useAuth();
    const navigation = useNavigation();
    const router = useRouter();

    const [book, setBook] = useState<BookData | null>(null);
    const [chapter, setChapter] = useState<ChapterData | null>(null);
    const [microlearnings, setMicrolearnings] = useState<MicrolearningData[]>([]);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState<PlayTarget | null>(null);
    const [boundary, setBoundary] = useState<{ charIndex: number; charLength: number } | null>(null);
    const [saved, setSaved] = useState(false);
    const [savingToggle, setSavingToggle] = useState(false);
    const [summaryCollapsed, setSummaryCollapsed] = useState(true);

    // Ocultar el header nativo — usamos solo el header custom
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // ── Carga de datos ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!bookId || !chapterId) return;
        (async () => {
            try {
                const [bookData, chapters, mls] = await Promise.all([
                    getBookById(bookId),
                    getChaptersByBook(bookId),
                    getMicrolearningsByChapter(bookId, chapterId),
                ]);
                const ch = chapters.find(c => c.id === chapterId) ?? null;
                setBook(bookData);
                setChapter(ch);
                setMicrolearnings(mls);
                if (user && bookId) {
                    isBookSaved(user.uid, bookId).then(setSaved);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => AudioService.stop();
    }, [bookId, chapterId]);

    // ── Bookmark ──────────────────────────────────────────────────────────────
    const toggleSave = async () => {
        if (!user || !bookId || savingToggle) return;
        setSavingToggle(true);
        try {
            if (saved) {
                await unsaveBook(user.uid, bookId);
                setSaved(false);
            } else {
                await saveBook(user.uid, bookId);
                setSaved(true);
            }
        } finally {
            setSavingToggle(false);
        }
    };

    // ── TTS helpers ───────────────────────────────────────────────────────────
    const isPlaying = (target: PlayTarget) => {
        if (!playing) return false;
        if (target.kind === 'summary' && playing.kind === 'summary') return true;
        if (target.kind === 'ml' && playing.kind === 'ml') return target.id === playing.id;
        return false;
    };

    const speak = (text: string, target: PlayTarget) => {
        if (isPlaying(target)) {
            AudioService.stop();
            setPlaying(null);
            setBoundary(null);
            return;
        }
        AudioService.stop();
        setBoundary(null);
        setPlaying(target);
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onBoundary: setBoundary,
            onDone: () => { setPlaying(null); setBoundary(null); },
            onError: () => { setPlaying(null); setBoundary(null); },
        });
    };

    // ── Colores de superficie ─────────────────────────────────────────────────
    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';
    const sectionTitleColor = colors.secondaryText;

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </SafeAreaView>
        );
    }

    if (!chapter) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <Text style={{ color: colors.secondaryText }}>Capítulo no encontrado.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
                    <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                        Cap. {chapter.chapterNumber} — {chapter.title}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleSave} disabled={savingToggle} style={styles.backBtn} hitSlop={8}>
                    <Bookmark
                        size={22}
                        color={saved ? colors.tint : colors.secondaryText}
                        fill={saved ? colors.tint : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Hero image / GeneratedCover del capítulo ── */}
                <View style={styles.chapterHeroWrapper}>
                    <GeneratedCover
                        type="microlearning"
                        title={chapter.title}
                        category={book?.category}
                        height={260}
                        style={styles.chapterHero}
                    />
                </View>

                {book && (
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/summary-detail', params: { bookId } })}
                        style={[styles.bookLink, { marginVertical: 12, paddingHorizontal: 6, alignSelf: 'stretch', justifyContent: 'flex-start' }]}
                        activeOpacity={0.8}
                    >
                        <BookOpen size={14} color={colors.tint} />
                        <Text style={[styles.bottomBookLinkText, { color: colors.tint, textAlign: 'left' }]} numberOfLines={1} ellipsizeMode="tail">
                            {book.title}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* ── Resumen del capítulo ── */}
                {chapter.summary ? (
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <View style={styles.summaryHeader}>
                            <TouchableOpacity
                                onPress={() => setSummaryCollapsed(prev => !prev)}
                                activeOpacity={0.8}
                                style={{ flex: 1 }}
                            >
                                <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>RESUMEN</Text>
                            </TouchableOpacity>
                            <View style={styles.summaryActions}>
                                {!summaryCollapsed && (
                                    <TouchableOpacity
                                        onPress={() => speak(chapter.summary, { kind: 'summary' })}
                                        style={[
                                            styles.audioBtn,
                                            { backgroundColor: isPlaying({ kind: 'summary' }) ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') },
                                        ]}
                                    >
                                        {isPlaying({ kind: 'summary' })
                                            ? <Square size={14} color="#FFF" fill="#FFF" />
                                            : <Play size={14} color={colors.tint} fill={colors.tint} />
                                        }
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => setSummaryCollapsed(prev => !prev)}
                                    activeOpacity={0.8}
                                >
                                    {summaryCollapsed ? (
                                        <ChevronDown size={18} color={colors.tint} />
                                    ) : (
                                        <ChevronUp size={18} color={colors.tint} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {!summaryCollapsed && (
                            <View>
                                <HighlightedText
                                    text={chapter.summary}
                                    start={isPlaying({ kind: 'summary' }) && boundary ? boundary.charIndex : -1}
                                    length={isPlaying({ kind: 'summary' }) && boundary ? boundary.charLength : 0}
                                    baseStyle={[styles.bodyText, { color: colors.text }]}
                                    highlightBg={colors.tint + '33'}
                                />
                            </View>
                        )}
                    </View>
                ) : null}

                {/* ── Insights ── */}
                {chapter.insights?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>INSIGHTS</Text>
                        {chapter.insights.map((insight, i) => (
                            <View key={i} style={[styles.insightCard, { backgroundColor: cardBg }]}>
                                <View style={[styles.insightDot, { backgroundColor: colors.tint }]} />
                                <Text style={[styles.insightText, { color: colors.text }]}>{insight}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Micro-learnings ── */}
                {microlearnings.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>MICRO-LEARNINGS</Text>
                        {microlearnings.map(ml => {
                            const mlPlaying = isPlaying({ kind: 'ml', id: ml.id! });
                            const chipColor = categoryColor(ml.category);
                            return (
                                <View key={ml.id} style={[styles.card, { backgroundColor: cardBg }]}>
                                    {ml.category ? (
                                        <View style={[styles.chip, { backgroundColor: chipColor + '22' }]}>
                                            <Text style={[styles.chipText, { color: chipColor }]}>{ml.category}</Text>
                                        </View>
                                    ) : null}

                                    <View style={styles.mlTitleRow}>
                                        <Text style={[styles.mlTitle, { color: colors.text }]}>{ml.title}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const text = [ml.title, ml.content, ml.reflectionQuestion
                                                    ? `Pregunta de reflexión: ${ml.reflectionQuestion}` : '']
                                                    .filter(Boolean).join('. ');
                                                speak(text, { kind: 'ml', id: ml.id! });
                                            }}
                                            style={[
                                                styles.audioBtn,
                                                { backgroundColor: mlPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') },
                                            ]}
                                        >
                                            {mlPlaying
                                                ? <Square size={14} color="#FFF" fill="#FFF" />
                                                : <Play size={14} color={colors.tint} fill={colors.tint} />
                                            }
                                        </TouchableOpacity>
                                    </View>

                                    {(() => {
                                        const mlActive = mlPlaying && boundary;
                                        const contentOffset = ml.title.length + 2;
                                        const questionOffset = contentOffset + ml.content.length + 2 + 'Pregunta de reflexión: '.length;
                                        const highlightBg = colors.tint + '33';
                                        return (
                                            <>
                                                <HighlightedText
                                                    text={ml.content}
                                                    start={mlActive && boundary!.charIndex >= contentOffset ? boundary!.charIndex - contentOffset : -1}
                                                    length={mlActive ? boundary!.charLength : 0}
                                                    baseStyle={[styles.bodyText, { color: colors.text }]}
                                                    highlightBg={highlightBg}
                                                />
                                                {ml.reflectionQuestion ? (
                                                    <>
                                                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                                                        <View style={styles.reflectionRow}>
                                                            <Mic size={13} color={colors.secondaryText} />
                                                            <HighlightedText
                                                                text={ml.reflectionQuestion}
                                                                start={mlActive && boundary!.charIndex >= questionOffset ? boundary!.charIndex - questionOffset : -1}
                                                                length={mlActive ? boundary!.charLength : 0}
                                                                baseStyle={[styles.reflectionText, { color: colors.secondaryText }]}
                                                                highlightBg={highlightBg}
                                                            />
                                                        </View>
                                                    </>
                                                ) : null}
                                            </>
                                        );
                                    })()}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* ── Ejercicios prácticos ── */}
                {chapter.exercises?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>EJERCICIOS PRÁCTICOS</Text>
                        {chapter.exercises.map((ex, i) => {
                            const meta = EXERCISE_META[ex.type];
                            return (
                                <View key={i} style={[styles.exerciseCard, { backgroundColor: cardBg, borderLeftColor: meta.color }]}>
                                    <View style={styles.exerciseHeader}>
                                        {ex.type === 'reflection' && <Text style={styles.exerciseEmoji}>🪞</Text>}
                                        {ex.type === 'action'     && <Text style={styles.exerciseEmoji}>⚡</Text>}
                                        {ex.type === 'journaling' && <Text style={styles.exerciseEmoji}>📝</Text>}
                                        <View style={{ flex: 1 }}>
                                            <View style={[styles.exerciseTypeBadge, { backgroundColor: meta.color + '22' }]}>
                                                <Text style={[styles.exerciseTypeText, { color: meta.color }]}>{meta.label}</Text>
                                            </View>
                                            <Text style={[styles.exerciseTitle, { color: colors.text }]}>{ex.title}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.exerciseDesc, { color: colors.secondaryText }]}>{ex.description}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Espacio para el FAB */}
                <View style={{ height: 88 }} />
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, gap: 12,
    },
    backBtn: { padding: 4 },
    headerCenter: { flex: 1, gap: 2 },
    headerTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
    bookLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    bookLinkText: { fontSize: 12, fontWeight: '600' },
    bottomBookLinkText: { flex: 1, fontSize: 13, fontWeight: '700' },

    // Scroll
    scroll: { paddingTop: 0, paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
    chapterHeroWrapper: {
        marginHorizontal: -16,
        overflow: 'hidden',
    },
    chapterHero: { width: '100%', height: 260 },

    // Section
    section: { gap: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    summaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    summaryActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

    // Card base
    card: {
        borderRadius: 16, padding: 16, gap: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    bodyText: { fontSize: 14, lineHeight: 22 },
    divider: { height: 1 },

    // Audio button
    audioBtn: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    },

    // Insights
    insightCard: {
        borderRadius: 12, padding: 14, flexDirection: 'row',
        gap: 10, alignItems: 'flex-start',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    insightDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
    insightText: { flex: 1, fontSize: 14, lineHeight: 22 },

    // ML card extras
    chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    chipText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    mlTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    mlThumb: { width: 60, height: 60, borderRadius: 8, flexShrink: 0 },
    mlTitle: { flex: 1, fontSize: 15, fontWeight: '800', lineHeight: 22 },
    reflectionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
    reflectionText: { flex: 1, fontSize: 13, lineHeight: 19, fontStyle: 'italic' },

    // Exercises
    exerciseCard: {
        borderRadius: 12, padding: 14, borderLeftWidth: 4, gap: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    exerciseHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    exerciseEmoji: { fontSize: 22, lineHeight: 28 },
    exerciseTypeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginBottom: 4 },
    exerciseTypeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    exerciseTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
    exerciseDesc: { fontSize: 13, lineHeight: 20 },

    // FAB compra
    fabContainer: { padding: 16, borderTopWidth: 1 },
    buyBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingVertical: 14, borderRadius: 14,
    },
    buyLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
