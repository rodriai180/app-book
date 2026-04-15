import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Linking, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import {
    ArrowLeft, Play, Square, ChevronDown, ChevronUp,
    ShoppingCart, ChevronRight, Layers, Bookmark,
} from 'lucide-react-native';
import {
    getBookById, getChaptersByBook, getMicrolearningsByChapter,
    isBookSaved, saveBook, unsaveBook,
} from '../src/services/bookContentService';
import { BookData, ChapterData } from '../src/models/BookModels';
import { AudioService } from '../src/services/AudioService';
import { useTheme } from '../src/services/themeContext';
import { useSettings } from '../src/services/settingsContext';
import { useAuth } from '../src/services/authContext';

type PlayTarget = 'preface' | 'short' | 'long';

export default function SummaryDetailScreen() {
    const { bookId } = useLocalSearchParams<{ bookId: string }>();
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const { user } = useAuth();
    const navigation = useNavigation();
    const router = useRouter();

    const [book, setBook] = useState<BookData | null>(null);
    const [chapters, setChapters] = useState<ChapterData[]>([]);
    const [mlCounts, setMlCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [savingToggle, setSavingToggle] = useState(false);

    const [playing, setPlaying] = useState<PlayTarget | null>(null);
    const [prefaceOpen, setPrefaceOpen] = useState(false);
    const [shortOpen, setShortOpen] = useState(false);
    const [longOpen, setLongOpen] = useState(false);

    // ── Ocultar header de navegación ─────────────────────────────────────────
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // ── Carga ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!bookId) return;
        (async () => {
            try {
                const [bookData, chapterList] = await Promise.all([
                    getBookById(bookId),
                    getChaptersByBook(bookId),
                ]);
                setBook(bookData);
                setChapters(chapterList);


                if (user && bookId) {
                    isBookSaved(user.uid, bookId).then(setSaved);
                }

                // Contar microlearnings por capítulo en paralelo
                if (chapterList.length > 0) {
                    const counts = await Promise.all(
                        chapterList.map(ch =>
                            getMicrolearningsByChapter(bookId, ch.id!).then(mls => ({ id: ch.id!, count: mls.length }))
                        )
                    );
                    setMlCounts(Object.fromEntries(counts.map(c => [c.id, c.count])));
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => AudioService.stop();
    }, [bookId]);

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

    // ── TTS ───────────────────────────────────────────────────────────────────
    const speak = (text: string, target: PlayTarget) => {
        if (playing === target) {
            AudioService.stop();
            setPlaying(null);
            return;
        }
        AudioService.stop();
        setPlaying(target);
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onDone: () => setPlaying(null),
            onError: () => setPlaying(null),
        });
    };

    // ── Colores ───────────────────────────────────────────────────────────────
    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';
    const sectionLabelColor = colors.secondaryText;

    // ── Helpers ───────────────────────────────────────────────────────────────
    const AudioBtn = ({ target, text }: { target: PlayTarget; text: string }) => {
        const active = playing === target;
        return (
            <TouchableOpacity
                onPress={() => speak(text, target)}
                style={[styles.audioBtn, { backgroundColor: active ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
            >
                {active
                    ? <Square size={13} color="#FFF" fill="#FFF" />
                    : <Play size={13} color={colors.tint} fill={colors.tint} />
                }
            </TouchableOpacity>
        );
    };

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

    if (!book) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <Text style={{ color: colors.secondaryText }}>Libro no encontrado.</Text>
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
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    {book.title}
                </Text>
                <TouchableOpacity onPress={toggleSave} disabled={savingToggle} style={styles.bookmarkBtn} hitSlop={8}>
                    <Bookmark
                        size={22}
                        color={saved ? colors.tint : colors.secondaryText}
                        fill={saved ? colors.tint : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Portada + título + autor ── */}
                <View style={[styles.heroCard, { backgroundColor: cardBg }]}>
                    {book.coverImageUrl ? (
                        <Image
                            source={{ uri: book.coverImageUrl }}
                            style={styles.cover}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.cover, styles.coverFallback, { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                            <Text style={[styles.coverInitial, { color: colors.secondaryText }]}>
                                {book.title.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.heroInfo}>
                        <Text style={[styles.bookTitle, { color: colors.text }]}>{book.title}</Text>
                        <Text style={[styles.bookAuthor, { color: colors.secondaryText }]}>{book.author}</Text>
                        {book.category ? (
                            <View style={[styles.categoryBadge, { backgroundColor: colors.tint + '22' }]}>
                                <Text style={[styles.categoryText, { color: colors.tint }]}>{book.category}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* ── Tags ── */}
                {book.tags?.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
                        {book.tags.map((tag, i) => (
                            <View key={i} style={[styles.tag, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                                <Text style={[styles.tagText, { color: colors.secondaryText }]}>#{tag}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {/* ── Prefacio (colapsable) ── */}
                {book.preface ? (
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <TouchableOpacity
                            onPress={() => setPrefaceOpen(v => !v)}
                            style={styles.cardHeader}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>PREFACIO</Text>
                            <View style={styles.cardHeaderRight}>
                                {prefaceOpen && <AudioBtn target="preface" text={book.preface} />}
                                {prefaceOpen
                                    ? <ChevronUp size={18} color={colors.secondaryText} />
                                    : <ChevronDown size={18} color={colors.secondaryText} />
                                }
                            </View>
                        </TouchableOpacity>
                        {prefaceOpen && (
                            <Text style={[styles.bodyText, { color: colors.text }]}>{book.preface}</Text>
                        )}
                    </View>
                ) : null}

                {/* ── Resumen corto (colapsable) ── */}
                {book.shortSummary ? (
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <TouchableOpacity
                            onPress={() => setShortOpen(v => !v)}
                            style={styles.cardHeader}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>RESUMEN</Text>
                            <View style={styles.cardHeaderRight}>
                                {shortOpen && <AudioBtn target="short" text={book.shortSummary} />}
                                {shortOpen
                                    ? <ChevronUp size={18} color={colors.secondaryText} />
                                    : <ChevronDown size={18} color={colors.secondaryText} />
                                }
                            </View>
                        </TouchableOpacity>
                        {shortOpen && (
                            <Text style={[styles.bodyText, { color: colors.text }]}>{book.shortSummary}</Text>
                        )}
                    </View>
                ) : null}

                {/* ── Resumen largo (colapsable) ── */}
                {book.longSummary ? (
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <TouchableOpacity
                            onPress={() => setLongOpen(v => !v)}
                            style={styles.cardHeader}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>RESUMEN COMPLETO</Text>
                            <View style={styles.cardHeaderRight}>
                                {longOpen && <AudioBtn target="long" text={book.longSummary} />}
                                {longOpen
                                    ? <ChevronUp size={18} color={colors.secondaryText} />
                                    : <ChevronDown size={18} color={colors.secondaryText} />
                                }
                            </View>
                        </TouchableOpacity>
                        {longOpen && (
                            <Text style={[styles.bodyText, { color: colors.text }]}>{book.longSummary}</Text>
                        )}
                    </View>
                ) : null}

                {/* ── Capítulos ── */}
                {chapters.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>
                            CAPÍTULOS · {chapters.length}
                        </Text>
                        {chapters.map(ch => {
                            const count = mlCounts[ch.id!] ?? 0;
                            return (
                                <TouchableOpacity
                                    key={ch.id}
                                    onPress={() => router.push({
                                        pathname: '/chapter-detail',
                                        params: { bookId, chapterId: ch.id },
                                    })}
                                    style={[styles.chapterCard, { backgroundColor: cardBg }]}
                                    activeOpacity={0.75}
                                >
                                    <View style={styles.chapterLeft}>
                                        <Text style={[styles.chapterNum, { color: colors.tint }]}>
                                            Cap. {ch.chapterNumber}
                                        </Text>
                                        <Text style={[styles.chapterTitle, { color: colors.text }]} numberOfLines={2}>
                                            {ch.title}
                                        </Text>
                                    </View>
                                    <View style={styles.chapterRight}>
                                        {count > 0 && (
                                            <View style={[styles.mlBadge, { backgroundColor: colors.tint + '22' }]}>
                                                <Layers size={11} color={colors.tint} />
                                                <Text style={[styles.mlBadgeText, { color: colors.tint }]}>{count}</Text>
                                            </View>
                                        )}
                                        <ChevronRight size={18} color={colors.secondaryText} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={{ height: 88 }} />
            </ScrollView>

            {/* ── FAB comprar ── */}
            {book.purchaseLink ? (
                <View style={[styles.fabContainer, { backgroundColor: colors.background, borderTopColor: dividerColor }]}>
                    <TouchableOpacity
                        style={[styles.buyBtn, { backgroundColor: colors.tint }]}
                        onPress={() => Linking.openURL(book.purchaseLink)}
                    >
                        <ShoppingCart size={18} color="#FFF" />
                        <Text style={styles.buyLabel}>Comprar libro</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
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
    bookmarkBtn: { padding: 4 },
    headerTitle: { flex: 1, fontSize: 16, fontWeight: '700' },

    // Scroll
    scroll: { padding: 16, gap: 12 },
    section: { gap: 8 },

    // Hero
    heroCard: {
        borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    cover: { width: 88, height: 120, borderRadius: 10 },
    coverFallback: { justifyContent: 'center', alignItems: 'center' },
    coverInitial: { fontSize: 36, fontWeight: '700' },
    heroInfo: { flex: 1, justifyContent: 'center', gap: 6 },
    bookTitle: { fontSize: 18, fontWeight: '800', lineHeight: 24 },
    bookAuthor: { fontSize: 14, fontWeight: '500' },
    categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    categoryText: { fontSize: 12, fontWeight: '700' },

    // Tags
    tagsRow: { gap: 8, paddingVertical: 2 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    tagText: { fontSize: 13, fontWeight: '500' },

    // Cards
    card: {
        borderRadius: 16, padding: 16, gap: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    bodyText: { fontSize: 14, lineHeight: 22 },
    readMore: { fontSize: 13, fontWeight: '600', marginTop: 2 },

    // Audio btn
    audioBtn: {
        width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center',
    },

    // Capítulos
    chapterCard: {
        borderRadius: 14, padding: 14,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    chapterLeft: { flex: 1, gap: 2 },
    chapterNum: { fontSize: 12, fontWeight: '700' },
    chapterTitle: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    mlBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    mlBadgeText: { fontSize: 12, fontWeight: '700' },

    // FAB compra
    fabContainer: { padding: 16, borderTopWidth: 1 },
    buyBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingVertical: 14, borderRadius: 14,
    },
    buyLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
