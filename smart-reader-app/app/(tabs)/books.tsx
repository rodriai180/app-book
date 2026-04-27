import React, { useCallback, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
    ActivityIndicator, Platform, useWindowDimensions, TextInput,
} from 'react-native';

const DESKTOP_CARD_WIDTH = 220;
import { Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllBooks } from '../../src/services/bookContentService';
import { BookData } from '../../src/models/BookModels';
import GeneratedCover from '../../src/components/GeneratedCover';
import { useTheme } from '../../src/services/themeContext';

export default function BooksScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = Platform.OS === 'web' && width >= 768;

    const [books, setBooks] = useState<BookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getAllBooks(undefined, 50)
                .then(setBooks)
                .finally(() => setLoading(false));
        }, [])
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return books;
        return books.filter(b =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q)
        );
    }, [books, query]);

    const renderItem = ({ item }: { item: BookData }) => {
        if (isDesktop) {
            return (
                <TouchableOpacity
                    style={[styles.cardGrid, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
                    onPress={() => router.push({ pathname: '/summary-detail', params: { bookId: item.id } })}
                    activeOpacity={0.75}
                >
                    <GeneratedCover
                        title={item.title}
                        author={item.author}
                        type="book"
                        category={item.category}
                        tags={item.tags}
                        large
                        style={{ width: '100%', aspectRatio: 2 / 3, borderRadius: 0 }}
                    />
                    <View style={styles.gridInfo}>
                        <Text style={[styles.title, { color: colors.text, fontSize: 14 }]} numberOfLines={2}>{item.title}</Text>
                        <Text style={[styles.author, { color: colors.secondaryText, fontSize: 12 }]} numberOfLines={1}>{item.author}</Text>
                        {item.category ? (
                            <View style={[styles.badge, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                                <Text style={[styles.badgeText, { color: colors.tint }]} numberOfLines={1}>{item.category}</Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.cardRow, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderBottomColor: colors.border }]}
                onPress={() => router.push({ pathname: '/summary-detail', params: { bookId: item.id } })}
                activeOpacity={0.75}
            >
                <GeneratedCover
                    title={item.title}
                    author={item.author}
                    type="book"
                    category={item.category}
                    tags={item.tags}
                    style={styles.rowCover}
                />
                <View style={styles.rowInfo}>
                    <Text style={[styles.title, { color: colors.text, fontSize: 15 }]} numberOfLines={2}>{item.title}</Text>
                    <Text style={[styles.author, { color: colors.secondaryText, fontSize: 13 }]} numberOfLines={1}>{item.author}</Text>
                    {item.category ? (
                        <View style={[styles.badge, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', marginTop: 6 }]}>
                            <Text style={[styles.badgeText, { color: colors.tint }]} numberOfLines={1}>{item.category}</Text>
                        </View>
                    ) : null}
                    {item.shortSummary ? (
                        <Text style={[styles.summary, { color: colors.secondaryText }]} numberOfLines={2}>{item.shortSummary}</Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
            {/* Header desktop */}
            {isDesktop && (
                <View style={[styles.desktopHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.desktopTitle, { color: colors.text }]}>Libros</Text>
                </View>
            )}

            {/* Buscador */}
            <View style={[styles.searchBar, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Search size={16} color={colors.secondaryText} />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Buscar por título o autor…"
                    placeholderTextColor={colors.secondaryText}
                    style={[styles.searchInput, { color: colors.text }]}
                    clearButtonMode="while-editing"
                />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.center}>
                    <Text style={[styles.empty, { color: colors.secondaryText }]}>
                        {books.length === 0 ? 'No hay libros disponibles.' : 'Sin resultados para tu búsqueda.'}
                    </Text>
                </View>
            ) : isDesktop ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.desktopGrid}>
                    {filtered.map(item => (
                        <TouchableOpacity
                            key={item.id!}
                            style={[styles.cardGrid, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
                            onPress={() => router.push({ pathname: '/summary-detail', params: { bookId: item.id } })}
                            activeOpacity={0.75}
                        >
                            <GeneratedCover
                                title={item.title}
                                author={item.author}
                                type="book"
                                category={item.category}
                                tags={item.tags}
                                large
                                style={{ width: DESKTOP_CARD_WIDTH, aspectRatio: 2 / 3, borderRadius: 0 }}
                            />
                            <View style={styles.gridInfo}>
                                <Text style={[styles.title, { color: colors.text, fontSize: 14 }]} numberOfLines={2}>{item.title}</Text>
                                <Text style={[styles.author, { color: colors.secondaryText, fontSize: 12 }]} numberOfLines={1}>{item.author}</Text>
                                {item.category ? (
                                    <View style={[styles.badge, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                                        <Text style={[styles.badgeText, { color: colors.tint }]} numberOfLines={1}>{item.category}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id!}
                    renderItem={renderItem}
                    numColumns={1}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    empty: { fontSize: 15, textAlign: 'center' },

    desktopHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    desktopTitle: { fontSize: 22, fontWeight: '700' },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginVertical: 10,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
    },

    list: { paddingVertical: 8 },
    listDesktop: { padding: 20 },
    desktopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        padding: 20,
        alignItems: 'flex-start',
    },

    // Mobile: fila horizontal
    cardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        gap: 14,
    },
    rowCover: { width: 100, height: 150, borderRadius: 8, flexShrink: 0 },
    rowInfo: { flex: 1, paddingTop: 2, gap: 3 },
    summary: { fontSize: 12, lineHeight: 17, marginTop: 4 },

    // Desktop: grid vertical
    cardGrid: {
        width: DESKTOP_CARD_WIDTH,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    gridInfo: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 3,
    },

    title: { fontWeight: '600', lineHeight: 18 },
    author: { lineHeight: 16 },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: { fontSize: 10, fontWeight: '600' },
});
