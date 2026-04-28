import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import {
    getMicrolearningsFeed,
    saveMicrolearning, unsaveMicrolearning, getSavedMicrolearnings,
} from '../../src/services/bookContentService';
import { MicrolearningData } from '../../src/models/BookModels';
import { useTheme } from '../../src/services/themeContext';
import { useSettings } from '../../src/services/settingsContext';
import { useAuth } from '../../src/services/authContext';
import GeneratedCover from '../../src/components/GeneratedCover';
import { setFeed } from '../../src/services/microlearningStore';

const FETCH_SIZE = 80;
const GRID_COLS = 3;
const GRID_GAP = 2;

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function SummariesScreen() {
    const { colors } = useTheme();
    const { preferredCategories } = useSettings();
    const { user } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const cellSize = (width - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [savedMlIds, setSavedMlIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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
            return () => {};
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

    // ── Navegación al detalle ─────────────────────────────────────────────────
    const handleTap = (item: MicrolearningData) => {
        const index = items.findIndex(i => i.id === item.id);
        setFeed(items, index < 0 ? 0 : index);
        router.push('/microlearning-detail');
    };

    // ── Celda del grid ────────────────────────────────────────────────────────
    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isSaved = savedMlIds.has(item.id!);

        return (
            <TouchableOpacity
                onPress={() => handleTap(item)}
                activeOpacity={0.85}
                style={{ width: cellSize, height: cellSize * 1.25 }}
            >
                <GeneratedCover
                    type="microlearning"
                    title={item.title}
                    category={item.category}
                    tags={item.tags}
                    style={{ flex: 1 }}
                />

                {/* Badge de guardado */}
                {isSaved && (
                    <TouchableOpacity
                        style={styles.savedBadge}
                        onPress={() => toggleSave(item.id!)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                        <Bookmark size={10} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
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
        <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['bottom']}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                    renderItem={renderItem}
                    numColumns={GRID_COLS}
                    columnWrapperStyle={{ gap: GRID_GAP }}
                    ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    refreshing={refreshing}
                    onRefresh={() => loadFeed(true)}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    savedBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    footerLoader: { paddingVertical: 20, alignItems: 'center' },
});
