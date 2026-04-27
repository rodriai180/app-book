import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
    ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, Bookmark } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import {
    getMicrolearningsFeed,
    saveMicrolearning, unsaveMicrolearning, getSavedMicrolearnings,
} from '../../src/services/bookContentService';
import { MicrolearningData } from '../../src/models/BookModels';
import { AudioService } from '../../src/services/AudioService';
import { useTheme } from '../../src/services/themeContext';
import { useSettings } from '../../src/services/settingsContext';
import { useAuth } from '../../src/services/authContext';
import GeneratedCover from '../../src/components/GeneratedCover';
import HighlightedText from '../../src/components/HighlightedText';

const DESKTOP_CARD_WIDTH = 300;
const DESKTOP_CARD_HEIGHT = 460;

const FETCH_SIZE = 80;

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

type Boundary = { charIndex: number; charLength: number };

function localHighlight(boundary: Boundary | null, sectionOffset: number, sectionLen: number) {
    if (!boundary || boundary.charIndex < sectionOffset || boundary.charIndex >= sectionOffset + sectionLen) {
        return { start: -1, length: 0 };
    }
    return { start: boundary.charIndex - sectionOffset, length: boundary.charLength };
}


export default function SummariesScreen() {
    const { colors, isDark } = useTheme();
    const { settings, preferredCategories } = useSettings();
    const { user } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isDesktop = Platform.OS === 'web' && width >= 768;

    // Altura real del contenedor medida con onLayout (solo mobile)
    const [cardHeight, setCardHeight] = useState(0);

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [savedMlIds, setSavedMlIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [boundary, setBoundary] = useState<Boundary | null>(null);

    const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);

    // ── Carga inicial / refresh ───────────────────────────────────────────────
    const loadFeed = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        lastDocRef.current = null;
        try {
            const [{ items: fetched, lastDoc }, saved] = await Promise.all([
                getMicrolearningsFeed(undefined, undefined, FETCH_SIZE),
                user ? getSavedMicrolearnings(user.uid) : Promise.resolve([]),
            ]);
            lastDocRef.current = lastDoc;
            const filtered = preferredCategories.length > 0
                ? fetched.filter(item => preferredCategories.includes(item.category))
                : fetched;
            setItems(shuffle(filtered));
            setSavedMlIds(new Set(saved.map(ml => ml.id!)));
            setHasMore(fetched.length === FETCH_SIZE);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [preferredCategories]);

    useFocusEffect(
        useCallback(() => {
            loadFeed();
            return () => { AudioService.stop(); setPlayingId(null); };
        }, [loadFeed])
    );

    // ── Paginación ────────────────────────────────────────────────────────────
    const loadMore = async () => {
        if (loadingMore || !hasMore || !lastDocRef.current) return;
        setLoadingMore(true);
        try {
            const { items: more, lastDoc } = await getMicrolearningsFeed(
                undefined, lastDocRef.current, FETCH_SIZE
            );
            lastDocRef.current = lastDoc;
            const filtered = preferredCategories.length > 0
                ? more.filter(item => preferredCategories.includes(item.category))
                : more;
            setItems(prev => [...prev, ...shuffle(filtered)]);
            setHasMore(more.length === FETCH_SIZE);
        } finally {
            setLoadingMore(false);
        }
    };

    // ── Bookmark ──────────────────────────────────────────────────────────────
    const toggleSave = async (mlId: string) => {
        if (!user) return;
        const isSaved = savedMlIds.has(mlId);
        setSavedMlIds(prev => {
            const next = new Set(prev);
            isSaved ? next.delete(mlId) : next.add(mlId);
            return next;
        });
        try {
            isSaved
                ? await unsaveMicrolearning(user.uid, mlId)
                : await saveMicrolearning(user.uid, mlId);
        } catch {
            setSavedMlIds(prev => {
                const next = new Set(prev);
                isSaved ? next.add(mlId) : next.delete(mlId);
                return next;
            });
        }
    };

    // ── TTS ───────────────────────────────────────────────────────────────────
    const handlePlay = (item: MicrolearningData) => {
        if (playingId === item.id) {
            AudioService.stop();
            setPlayingId(null);
            setBoundary(null);
            return;
        }
        AudioService.stop();
        setBoundary(null);
        setPlayingId(item.id!);
        const text = [
            item.title,
            item.content,
            item.reflectionQuestion ? `Pregunta de reflexión: ${item.reflectionQuestion}` : '',
        ].filter(Boolean).join('. ');
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onBoundary: setBoundary,
            onDone: () => { setPlayingId(null); setBoundary(null); },
            onError: () => { setPlayingId(null); setBoundary(null); },
        });
    };

    // ── Render card ───────────────────────────────────────────────────────────
    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isPlaying = playingId === item.id;
        const isSaved = savedMlIds.has(item.id!);

        // Offsets de cada sección dentro del texto combinado que lee el TTS:
        // "title. content. Pregunta de reflexión: question"
        const contentOffset = item.title.length + 2;
        const questionOffset = contentOffset + item.content.length + 2 + 'Pregunta de reflexión: '.length;
        const activeBoundary = isPlaying ? boundary : null;
        const contentHL = localHighlight(activeBoundary, contentOffset, item.content.length);
        const questionHL = item.reflectionQuestion
            ? localHighlight(activeBoundary, questionOffset, item.reflectionQuestion.length)
            : { start: -1, length: 0 };
        const highlightBg = colors.tint + '33';
        const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';

        const cardStyle = isDesktop
            ? [styles.card, styles.cardDesktop, { backgroundColor: colors.backgroundSecondary }]
            : [styles.card, { height: cardHeight, backgroundColor: colors.backgroundSecondary }];

        return (
            <View style={cardStyle}>

                {/* Imagen */}
                <GeneratedCover
                    type="microlearning"
                    title={item.title}
                    category={item.category}
                    tags={item.tags}
                    style={styles.mlBanner}
                />

                {/* Contenido */}
                <View style={[
                    styles.contentBox,
                    isDesktop && styles.contentBoxDesktop,
                    { backgroundColor: cardBg },
                ]}>

                    {/* Título del capítulo + botones */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.chapterLink}
                            onPress={() => router.push({ pathname: '/chapter-detail', params: { bookId: item.bookId, chapterId: item.chapterId } })}
                            activeOpacity={0.65}
                        >
                            <Text style={[styles.footerChapter, { color: colors.tint }]} numberOfLines={1}>
                                Cap. {item.chapterNumber} — {item.chapterTitle}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.actionBtns}>
                            <TouchableOpacity onPress={() => toggleSave(item.id!)} style={styles.iconBtn}>
                                <Bookmark
                                    size={15}
                                    color={isSaved ? colors.tint : colors.secondaryText}
                                    fill={isSaved ? colors.tint : 'transparent'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handlePlay(item)}
                                style={[styles.playBtn, { backgroundColor: isPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
                            >
                                {isPlaying
                                    ? <Square size={12} color="#FFF" fill="#FFF" />
                                    : <Play size={12} color={colors.tint} fill={colors.tint} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <HighlightedText
                        text={item.content}
                        start={contentHL.start}
                        length={contentHL.length}
                        baseStyle={[styles.mlContent, { color: colors.text }]}
                        highlightBg={highlightBg}
                        numberOfLines={isDesktop ? 4 : 5}
                    />
                    {item.reflectionQuestion ? (
                        <HighlightedText
                            text={item.reflectionQuestion}
                            start={questionHL.start}
                            length={questionHL.length}
                            baseStyle={[styles.mlQuestion, { color: colors.secondaryText }]}
                            highlightBg={highlightBg}
                            numberOfLines={2}
                        />
                    ) : null}

                </View>
            </View>
        );
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.tint} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.center}>
                <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                    No hay microlearnings disponibles todavía.
                </Text>
            </View>
        );
    };

    // ── Desktop: grid con scroll ──────────────────────────────────────────────
    if (isDesktop) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.tint} />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.desktopGrid}
                        showsVerticalScrollIndicator={false}
                    >
                        {items.map(item => (
                            <View key={item.id ?? `${item.bookId}-${item.order}`}>
                                {renderItem({ item })}
                            </View>
                        ))}
                        {items.length === 0 && renderEmpty()}

                        {/* Paginación */}
                        {hasMore && (
                            <View style={styles.desktopLoadMore}>
                                {loadingMore ? (
                                    <ActivityIndicator size="small" color={colors.tint} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={loadMore}
                                        style={[styles.loadMoreBtn, { borderColor: colors.border }]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.loadMoreText, { color: colors.tint }]}>
                                            Cargar más
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        );
    }

    // ── Mobile: paging vertical ───────────────────────────────────────────────
    return (
        <SafeAreaView
            style={[styles.root, { backgroundColor: colors.backgroundSecondary }]}
            edges={['bottom']}
            onLayout={e => {
                const h = e.nativeEvent.layout.height;
                if (h > 0) setCardHeight(h);
            }}
        >
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : cardHeight > 0 ? (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    pagingEnabled
                    snapToInterval={cardHeight}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    refreshing={refreshing}
                    onRefresh={() => loadFeed(true)}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                />
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    card: { overflow: 'hidden' },
    cardDesktop: {
        width: DESKTOP_CARD_WIDTH,
        height: DESKTOP_CARD_HEIGHT,
        borderRadius: 14,
    },

    desktopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        padding: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    // imagen: 55% — texto: 45%
    mlBanner: { width: '100%', flex: 11 },

    contentBox: {
        flex: 9,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        gap: 10,
    },
    contentBoxDesktop: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 10,
        gap: 6,
    },

    mlTitle: { fontSize: 18, fontWeight: '800', lineHeight: 26 },
    mlContent: { fontSize: 14, lineHeight: 22 },
    mlQuestion: { fontSize: 13, lineHeight: 20, fontStyle: 'italic', marginTop: 6 },

    divider: { height: 1 },

    bookRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerBook: { fontSize: 13, fontWeight: '600', flex: 1 },
    footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
    chapterLink: {
        flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    footerChapter: { fontSize: 12, fontWeight: '600', flexShrink: 1 },

    actionBtns: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    iconBtn: {
        width: 28, height: 28, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },
    playBtn: {
        width: 28, height: 28, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },

    footerLoader: { paddingVertical: 20, alignItems: 'center' },

    desktopLoadMore: {
        alignSelf: 'stretch',
        paddingVertical: 24,
        alignItems: 'center',
    },
    loadMoreBtn: {
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 20,
        borderWidth: 1,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
