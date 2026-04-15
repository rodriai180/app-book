import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, ChevronRight, Bookmark } from 'lucide-react-native';
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

const PAGE_SIZE = 10;

export default function SummariesScreen() {
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const { user } = useAuth();
    const router = useRouter();

    // Altura real del contenedor medida con onLayout
    const [cardHeight, setCardHeight] = useState(0);

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [savedMlIds, setSavedMlIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);

    // ── Carga inicial / refresh ───────────────────────────────────────────────
    const loadFeed = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        lastDocRef.current = null;
        try {
            const [{ items: fetched, lastDoc }, saved] = await Promise.all([
                getMicrolearningsFeed(undefined, undefined, PAGE_SIZE),
                user ? getSavedMicrolearnings(user.uid) : Promise.resolve([]),
            ]);
            lastDocRef.current = lastDoc;
            setItems(fetched);
            setSavedMlIds(new Set(saved.map(ml => ml.id!)));
            setHasMore(fetched.length === PAGE_SIZE);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFeed();
            return () => { AudioService.stop(); setPlayingId(null); };
        }, [])
    );

    // ── Paginación ────────────────────────────────────────────────────────────
    const loadMore = async () => {
        if (loadingMore || !hasMore || !lastDocRef.current) return;
        setLoadingMore(true);
        try {
            const { items: more, lastDoc } = await getMicrolearningsFeed(
                undefined, lastDocRef.current, PAGE_SIZE
            );
            lastDocRef.current = lastDoc;
            setItems(prev => [...prev, ...more]);
            setHasMore(more.length === PAGE_SIZE);
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
            return;
        }
        AudioService.stop();
        setPlayingId(item.id!);
        const text = [
            item.title,
            item.content,
            item.reflectionQuestion ? `Pregunta de reflexión: ${item.reflectionQuestion}` : '',
        ].filter(Boolean).join('. ');
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onDone: () => setPlayingId(null),
            onError: () => setPlayingId(null),
        });
    };

    // ── Render card ───────────────────────────────────────────────────────────
    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isPlaying = playingId === item.id;
        const isSaved = savedMlIds.has(item.id!);
        const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
        const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';
        return (
            <View style={[styles.card, { height: cardHeight, backgroundColor: colors.backgroundSecondary }]}>

                {/* Imagen — ocupa todo el espacio que sobra sobre el contenido */}
                <GeneratedCover
                    type="microlearning"
                    title={item.title}
                    category={item.category}
                    tags={item.tags}
                    style={styles.mlBanner}
                />

                {/* Contenido */}
                <View style={[styles.contentBox, { backgroundColor: cardBg }]}>

                    <View style={{ flex: 1, overflow: 'hidden' }}>
                        <Text style={[styles.mlContent, { color: colors.text }]}>
                            {item.content}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                    <View style={styles.footerRow}>
                        <TouchableOpacity
                            style={[styles.chapterLink, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                            onPress={() => router.push({ pathname: '/chapter-detail', params: { bookId: item.bookId, chapterId: item.chapterId } })}
                            activeOpacity={0.65}
                        >
                            <ChevronRight size={12} color={colors.tint} />
                            <Text style={[styles.footerChapter, { color: colors.tint }]} numberOfLines={1}>
                                Cap. {item.chapterNumber} — {item.chapterTitle}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.actionBtns}>
                            <TouchableOpacity onPress={() => toggleSave(item.id!)} style={styles.iconBtn}>
                                <Bookmark
                                    size={19}
                                    color={isSaved ? colors.tint : colors.secondaryText}
                                    fill={isSaved ? colors.tint : 'transparent'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handlePlay(item)}
                                style={[styles.playBtn, { backgroundColor: isPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
                            >
                                {isPlaying
                                    ? <Square size={16} color="#FFF" fill="#FFF" />
                                    : <Play size={16} color={colors.tint} fill={colors.tint} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

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

    // imagen: 55% — texto: 45%
    mlBanner: { width: '100%', flex: 11 },

    contentBox: {
        flex: 9,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        gap: 10,
    },

    mlTitle: { fontSize: 18, fontWeight: '800', lineHeight: 26 },
    mlContent: { fontSize: 14, lineHeight: 22 },

    divider: { height: 1 },

    bookRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerBook: { fontSize: 13, fontWeight: '600', flex: 1 },
    footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
    chapterLink: {
        flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20, alignSelf: 'center',
    },
    footerChapter: { fontSize: 12, fontWeight: '600', flexShrink: 1 },

    actionBtns: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    iconBtn: {
        width: 38, height: 38, borderRadius: 19,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },
    playBtn: {
        width: 38, height: 38, borderRadius: 19,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },

    footerLoader: { paddingVertical: 20, alignItems: 'center' },
});
