import React, { useState, useCallback, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
    ActivityIndicator, ScrollView, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, BookMarked, Zap } from 'lucide-react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { DocumentService } from '../../src/services/DocumentService';
import { BookService, BookMetadata } from '../../src/services/bookService';
import { PdfLocalStorage } from '../../src/services/PdfLocalStorage';
import { getSavedBooks, getSavedMicrolearnings } from '../../src/services/bookContentService';
import { BookData, MicrolearningData } from '../../src/models/BookModels';
import { useAuth } from '../../src/services/authContext';
import { useTheme } from '../../src/services/themeContext';
import BookCardSkeleton from '../../components/BookCardSkeleton';
import GeneratedCover from '../../src/components/GeneratedCover';

export default function LibraryScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { user } = useAuth();
    const navigation = useNavigation();

    const [books, setBooks] = useState<BookMetadata[]>([]);
    const [savedBooks, setSavedBooks] = useState<BookData[]>([]);
    const [savedMicrolearnings, setSavedMicrolearnings] = useState<MicrolearningData[]>([]);
    const [savedMlIndex, setSavedMlIndex] = useState(0);
    const [savedMlViewportWidth, setSavedMlViewportWidth] = useState(0);
    const [savedMlContentWidth, setSavedMlContentWidth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const ITEM_WIDTH = 110;
    const ITEM_SPACING = 12;

    const savedMlItemsPerPage = useMemo(() => {
        if (!savedMlViewportWidth) return 1;
        return Math.max(1, Math.floor((savedMlViewportWidth + ITEM_SPACING) / (ITEM_WIDTH + ITEM_SPACING)));
    }, [savedMlViewportWidth]);

    const savedMlPageWidth = useMemo(() => {
        return savedMlItemsPerPage * (ITEM_WIDTH + ITEM_SPACING);
    }, [savedMlItemsPerPage]);

    const savedMlPageCount = useMemo(() => {
        if (savedMicrolearnings.length === 0) return 0;
        return Math.max(1, Math.ceil(savedMicrolearnings.length / savedMlItemsPerPage));
    }, [savedMicrolearnings.length, savedMlItemsPerPage]);

    const handleSavedMlScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!savedMlPageWidth || savedMlPageCount < 1) return;
        const offsetX = event.nativeEvent.contentOffset.x;
        const atEnd = savedMlContentWidth > 0 && savedMlViewportWidth > 0
            && offsetX + savedMlViewportWidth >= savedMlContentWidth - 4;
        if (atEnd) {
            setSavedMlIndex(savedMlPageCount - 1);
            return;
        }
        const nextPage = Math.min(savedMlPageCount - 1, Math.max(0, Math.round(offsetX / savedMlPageWidth)));
        setSavedMlIndex(nextPage);
    }, [savedMlPageCount, savedMlPageWidth, savedMlContentWidth, savedMlViewportWidth]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handlePickDocument}
                    style={{ marginRight: 16 }}
                    disabled={uploading}
                >
                    {uploading
                        ? <ActivityIndicator size="small" color={colors.tint} />
                        : <Plus size={24} color={colors.tint} />
                    }
                </TouchableOpacity>
            ),
        });
    }, [navigation, uploading, colors.tint]);

    useFocusEffect(
        useCallback(() => {
            if (user) loadAll();
        }, [user])
    );

    const loadAll = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [userBooks, saved, savedMls] = await Promise.all([
                BookService.getUserBooks(user.uid),
                getSavedBooks(user.uid),
                getSavedMicrolearnings(user.uid),
            ]);
            setBooks(userBooks);
            setSavedBooks(saved);
            setSavedMicrolearnings(savedMls);
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickDocument = async () => {
        if (!user) return;
        try {
            setUploading(true);
            const newDoc = await DocumentService.pickDocument();
            if (!newDoc) return;

            const isPdf = newDoc.mimeType === 'application/pdf' ||
                newDoc.uri.toLowerCase().endsWith('.pdf');

            const paragraphs = await DocumentService.extractText(newDoc.uri);
            const bookId = await BookService.saveBook(user.uid, {
                title: newDoc.title,
                author: newDoc.author,
                cover: newDoc.cover || '',
                paragraphs,
                currentParagraph: 0,
            });

            if (isPdf) {
                PdfLocalStorage.save(bookId, newDoc.uri)
                    .then(() => BookService.markHasPdf(user.uid, bookId))
                    .catch(err => console.warn('PDF local save failed:', err));
            }

            await loadAll();
        } catch (error) {
            console.error('Error uploading book:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteBook = async (bookId: string, title: string) => {
        if (!user) return;
        const confirmed = typeof window !== 'undefined'
            ? window.confirm(`¿Eliminar "${title}" de tu biblioteca?`)
            : true;
        if (!confirmed) return;
        try {
            await BookService.deleteBook(user.uid, bookId);
            setBooks(prev => prev.filter(b => b.id !== bookId));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    // ── Render saved book card (horizontal) ───────────────────────────────────
    const renderSavedBook = ({ item }: { item: BookData }) => (
        <TouchableOpacity
            style={[styles.savedCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
            onPress={() => router.push({ pathname: '/summary-detail', params: { bookId: item.id } })}
            activeOpacity={0.75}
        >
            {item.coverImageUrl ? (
                <Image source={{ uri: item.coverImageUrl }} style={styles.savedCover} resizeMode="cover" />
            ) : (
                <View style={[styles.savedCover, styles.savedCoverFallback, { backgroundColor: isDark ? '#2C2C2E' : '#E6F4FE' }]}>
                    <Text style={[styles.savedCoverInitial, { color: colors.tint }]}>
                        {item.title.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}
            <Text style={[styles.savedTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
            <Text style={[styles.savedAuthor, { color: colors.secondaryText }]} numberOfLines={1}>{item.author}</Text>
        </TouchableOpacity>
    );

    // ── Render saved microlearning card (horizontal) ──────────────────────────
    const renderSavedMicrolearning = ({ item }: { item: MicrolearningData }) => {
        return (
            <TouchableOpacity
                style={[styles.savedCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
                onPress={() => router.push({ pathname: '/chapter-detail', params: { bookId: item.bookId, chapterId: item.chapterId } })}
                activeOpacity={0.75}
            >
                <GeneratedCover
                    type="microlearning"
                    title={item.title}
                    category={item.category}
                    tags={item.tags}
                    hideTags
                    hideText
                    style={styles.savedCover}
                />
                <Text style={[styles.savedTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.savedAuthor, { color: colors.secondaryText }]} numberOfLines={1}>
                    Cap. {item.chapterNumber} — {item.chapterTitle}
                </Text>
            </TouchableOpacity>
        );
    };

    // ── Render uploaded book card (grid) ──────────────────────────────────────
    const renderBook = ({ item }: { item: BookMetadata }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => router.push({ pathname: '/reader', params: { bookId: item.id, title: item.title } })}
        >
            <View style={[styles.coverPlaceholder, { backgroundColor: colors.card }]}>
                {item.cover ? (
                    <Image source={{ uri: item.cover }} style={styles.coverImage} />
                ) : (
                    <View style={[styles.emptyCover, { backgroundColor: isDark ? '#2C2C2E' : '#E6F4FE' }]}>
                        <Text style={[styles.emptyCoverText, { color: colors.tint }]}>{item.title.charAt(0)}</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: isDark ? 'rgba(44,44,46,0.9)' : 'rgba(255,255,255,0.9)' }]}
                    onPress={() => handleDeleteBook(item.id, item.title)}
                >
                    <Trash2 size={14} color="#FF3B30" />
                </TouchableOpacity>
            </View>
            <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.bookAuthor, { color: colors.secondaryText }]} numberOfLines={1}>{item.author}</Text>
            {item.currentParagraph > 0 && (
                <View style={[styles.progressBadge, { backgroundColor: isDark ? '#2C2C2E' : '#E6F4FE' }]}>
                    <Text style={[styles.progressText, { color: colors.tint }]}>
                        {Math.round((item.currentParagraph / item.totalParagraphs) * 100)}%
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.skeletonGrid}>
                    {[1, 2, 3, 4, 5, 6].map(i => <BookCardSkeleton key={i} />)}
                </View>
            </SafeAreaView>
        );
    }

    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

                {/* ── Libros guardados ── */}
                {savedBooks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <BookMarked size={16} color={colors.tint} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Guardados</Text>
                        </View>
                        <FlatList
                            data={savedBooks}
                            keyExtractor={item => item.id!}
                            renderItem={renderSavedBook}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.savedList}
                            scrollEnabled
                        />
                    </View>
                )}

                {/* ── Microlearnings guardados ── */}
                {savedMicrolearnings.length > 0 && (
                    <>
                        {savedBooks.length > 0 && (
                            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                        )}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Zap size={16} color={colors.tint} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Microlearnings guardados</Text>
                            </View>
                            <FlatList
                                data={savedMicrolearnings}
                                keyExtractor={item => item.id!}
                                renderItem={renderSavedMicrolearning}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.savedList}
                                scrollEnabled
                                decelerationRate="fast"
                                snapToInterval={savedMlPageWidth}
                                snapToAlignment="start"
                                onLayout={(event) => setSavedMlViewportWidth(event.nativeEvent.layout.width)}
                                onContentSizeChange={(w) => setSavedMlContentWidth(w)}
                                onScroll={handleSavedMlScroll}
                                scrollEventThrottle={50}
                            />
                            {savedMlPageCount > 1 && (
                                <View style={styles.paginationDots}>
                                    {Array.from({ length: savedMlPageCount }, (_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.paginationDot,
                                                {
                                                    backgroundColor: 'transparent',
                                                    borderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.16)',
                                                },
                                                index === savedMlIndex && {
                                                    backgroundColor: colors.tint,
                                                    borderColor: colors.tint,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 6,
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    </>
                )}

                {/* Divider entre secciones */}
                {(savedBooks.length > 0 || savedMicrolearnings.length > 0) && books.length > 0 && (
                    <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                )}

                {/* ── Mis libros (subidos) ── */}
                {books.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mis libros</Text>
                        </View>
                        <FlatList
                            data={books}
                            renderItem={renderBook}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {/* ── Empty state ── */}
                {savedBooks.length === 0 && savedMicrolearnings.length === 0 && books.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📚</Text>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>Tu biblioteca está vacía</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
                            Guardá libros desde Descubrir o subí tu propio archivo con +
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Sections
    section: { paddingTop: 12 },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingBottom: 10,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700' },
    divider: { height: 1, marginHorizontal: 16, marginVertical: 4 },

    // Saved books (horizontal)
    savedList: { paddingHorizontal: 16, gap: 12 },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        marginBottom: 4,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
    },
    paginationDotActive: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    savedCard: {
        width: 110, borderRadius: 12, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    },
    savedCover: { width: 110, height: 150 },
    savedCoverFallback: { justifyContent: 'center', alignItems: 'center' },
    savedCoverInitial: { fontSize: 36, fontWeight: '700' },
    savedTitle: { fontSize: 12, fontWeight: '600', padding: 8, paddingBottom: 2, lineHeight: 16 },
    savedAuthor: { fontSize: 11, paddingHorizontal: 8, paddingBottom: 8 },

    // Uploaded books (grid)
    skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginTop: 15 },
    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
    bookCard: { flex: 1, margin: 8, maxWidth: '46%' },
    coverPlaceholder: {
        width: '100%', aspectRatio: 2 / 3,
        backgroundColor: '#F2F2F7', borderRadius: 12, overflow: 'hidden', marginBottom: 8,
    },
    coverImage: { width: '100%', height: '100%' },
    emptyCover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyCoverText: { fontSize: 40, fontWeight: '700' },
    deleteButton: {
        position: 'absolute', top: 8, right: 8,
        width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
    },
    bookTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    bookAuthor: { fontSize: 14 },
    progressBadge: {
        marginTop: 4, paddingHorizontal: 8, paddingVertical: 2,
        borderRadius: 8, alignSelf: 'flex-start',
    },
    progressText: { fontSize: 12, fontWeight: '600' },

    // Empty
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 80 },
    emptyIcon: { fontSize: 60, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
});
