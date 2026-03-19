import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { DocumentService } from '../../src/services/DocumentService';
import { BookService, BookMetadata } from '../../src/services/bookService';
import { PdfLocalStorage } from '../../src/services/PdfLocalStorage';
import { useAuth } from '../../src/services/authContext';
import { useTheme } from '../../src/services/themeContext';
import BookCardSkeleton from '../../components/BookCardSkeleton';

export default function LibraryScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { user } = useAuth();
    const [books, setBooks] = useState<BookMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={handlePickDocument} 
                    style={{ marginRight: 16 }}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator size="small" color={colors.tint} />
                    ) : (
                        <Plus size={24} color={colors.tint} />
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, uploading, colors.tint]);

    // Load books from Firestore when screen focuses
    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadBooks();
            }
        }, [user])
    );

    const loadBooks = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const userBooks = await BookService.getUserBooks(user.uid);
            setBooks(userBooks);
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
            if (!newDoc) {
                setUploading(false);
                return;
            }

            const isPdf = newDoc.mimeType === 'application/pdf' ||
                newDoc.uri.toLowerCase().endsWith('.pdf');

            // Extraer texto (para TTS + búsqueda)
            const paragraphs = await DocumentService.extractText(newDoc.uri);

            // Guardar libro en Firestore
            const bookId = await BookService.saveBook(user.uid, {
                title: newDoc.title,
                author: newDoc.author,
                cover: newDoc.cover || '',
                paragraphs,
                currentParagraph: 0,
            });

            // Si es PDF: guardar el archivo localmente (IndexedDB en web, FileSystem en nativo)
            if (isPdf) {
                PdfLocalStorage.save(bookId, newDoc.uri)
                    .then(() => BookService.markHasPdf(user.uid, bookId))
                    .catch(err => console.warn('PDF local save failed:', err));
            }

            // Reload the list
            await loadBooks();
        } catch (error) {
            console.error('Error uploading book:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteBook = async (bookId: string, title: string) => {
        if (!user) return;

        // Simple confirmation (works on web and native)
        const confirmed = typeof window !== 'undefined'
            ? window.confirm(`¿Eliminar "${title}" de tu biblioteca?`)
            : true;

        if (!confirmed) return;

        try {
            await BookService.deleteBook(user.uid, bookId);
            setBooks((prev) => prev.filter((b) => b.id !== bookId));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const renderItem = ({ item }: { item: BookMetadata }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => router.push({
                pathname: '/reader',
                params: { bookId: item.id, title: item.title }
            })}
        >
            <View style={[styles.coverPlaceholder, { backgroundColor: colors.card }]}>
                {item.cover ? (
                    <Image source={{ uri: item.cover }} style={styles.coverImage} />
                ) : (
                    <View style={[styles.emptyCover, { backgroundColor: isDark ? '#2C2C2E' : '#E6F4FE' }]}>
                        <Text style={[styles.emptyCoverText, { color: colors.tint }]}>{item.title.charAt(0)}</Text>
                    </View>
                )}
                {/* Delete button */}
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
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={{ height: 10 }} /> 

            {books.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📚</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Tu biblioteca está vacía</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
                        Pulsa el botón + para añadir tu primer libro
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        marginTop: 15,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    bookCard: {
        flex: 1,
        margin: 8,
        maxWidth: '46%',
    },
    coverPlaceholder: {
        width: '100%',
        aspectRatio: 2 / 3,
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    emptyCover: {
        flex: 1,
        backgroundColor: '#E6F4FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCoverText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#007AFF',
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#8E8E93',
    },
    progressBadge: {
        marginTop: 4,
        backgroundColor: '#E6F4FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#007AFF',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },
});
