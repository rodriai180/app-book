import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, BookOpen, ChevronRight, Bookmark } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import {
    getMicrolearningsFeed, saveBook, unsaveBook, getSavedBooks,
} from '../../src/services/bookContentService';
import { MicrolearningData } from '../../src/models/BookModels';
import { AudioService } from '../../src/services/AudioService';
import { useTheme } from '../../src/services/themeContext';
import { useSettings } from '../../src/services/settingsContext';
import { useAuth } from '../../src/services/authContext';

const PAGE_SIZE = 10;

export default function SummariesScreen() {
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const { user } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());
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
                user ? getSavedBooks(user.uid) : Promise.resolve([]),
            ]);
            lastDocRef.current = lastDoc;
            setItems(fetched);
            setSavedBookIds(new Set(saved.map(b => b.id!)));
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
    const toggleSave = async (bookId: string) => {
        if (!user) return;
        const isSaved = savedBookIds.has(bookId);
        setSavedBookIds(prev => {
            const next = new Set(prev);
            isSaved ? next.delete(bookId) : next.add(bookId);
            return next;
        });
        try {
            isSaved ? await unsaveBook(user.uid, bookId) : await saveBook(user.uid, bookId);
        } catch {
            setSavedBookIds(prev => {
                const next = new Set(prev);
                isSaved ? next.add(bookId) : next.delete(bookId);
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
        const isSaved = savedBookIds.has(item.bookId);
        const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
        const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';

        return (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
                {/* Banner imagen */}
                {item.microlearningImageUrl ? (
                    <View style={styles.mlBannerWrap}>
                        <Image
                            source={{ uri: item.microlearningImageUrl }}
                            style={styles.mlBanner}
                            resizeMode="cover"
                        />
                    </View>
                ) : null}
                {/* Título */}
                <Text style={[styles.mlTitle, { color: colors.text }]}>{item.title}</Text>

                {/* Contenido */}
                <Text style={[styles.mlContent, { color: colors.text }]}>{item.content}</Text>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                {/* Fila: libro */}
                <TouchableOpacity
                    style={styles.bookRow}
                    onPress={() => router.push({ pathname: '/summary-detail', params: { bookId: item.bookId } })}
                >
                    <BookOpen size={13} color={colors.secondaryText} />
                    <Text style={[styles.footerBook, { color: colors.tint }]} numberOfLines={1}>
                        {item.bookTitle}
                    </Text>
                </TouchableOpacity>

                {/* Fila: capítulo + acciones */}
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={styles.chapterLink}
                        onPress={() => router.push({ pathname: '/chapter-detail', params: { bookId: item.bookId, chapterId: item.chapterId } })}
                    >
                        <ChevronRight size={12} color={colors.secondaryText} />
                        <Text style={[styles.footerChapter, { color: colors.secondaryText }]} numberOfLines={1}>
                            Cap. {item.chapterNumber} — {item.chapterTitle}
                        </Text>
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity onPress={() => toggleSave(item.bookId)} style={styles.iconBtn}>
                        <Bookmark
                            size={16}
                            color={isSaved ? colors.tint : colors.secondaryText}
                            fill={isSaved ? colors.tint : 'transparent'}
                        />
                    </TouchableOpacity>

                    {/* Botón audio */}
                    <TouchableOpacity
                        onPress={() => handlePlay(item)}
                        style={[
                            styles.playBtn,
                            { backgroundColor: isPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') },
                        ]}
                    >
                        {isPlaying
                            ? <Square size={14} color="#FFF" fill="#FFF" />
                            : <Play size={14} color={colors.tint} fill={colors.tint} />
                        }
                    </TouchableOpacity>
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

    if (loading) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
            <FlatList
                data={items}
                keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                refreshing={refreshing}
                onRefresh={() => loadFeed(true)}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    // Card
    card: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        gap: 8,
    },

    // Content
    mlTitle: { fontSize: 17, fontWeight: '800', lineHeight: 24 },
    mlContent: { fontSize: 14, lineHeight: 22 },

    // Divider
    divider: { height: 1, marginVertical: 2 },

    // Footer rows
    bookRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerBook: { fontSize: 13, fontWeight: '600', flex: 1 },
    footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    chapterLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
    footerChapter: { fontSize: 12, flexShrink: 1 },

    iconBtn: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },
    playBtn: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },

    footerLoader: { paddingVertical: 20, alignItems: 'center' },
    mlBannerWrap: {
        marginHorizontal: -16, marginTop: -16,
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    mlBanner: { width: '100%', height: 150 },
});
