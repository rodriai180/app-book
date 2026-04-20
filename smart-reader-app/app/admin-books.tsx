import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react-native';
import { getAllBooks, deleteBook } from '../src/services/bookContentService';
import { BookData } from '../src/models/BookModels';
import { useTheme } from '../src/services/themeContext';
import GeneratedCover from '../src/components/GeneratedCover';

export default function AdminBooksScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const [books, setBooks] = useState<BookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAllBooks(undefined, 100);
            setBooks(result);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadBooks(); }, []));

    const handleDelete = (book: BookData) => {
        Alert.alert(
            'Eliminar libro',
            `¿Eliminar "${book.title}"? Esto borrará todos sus capítulos y microlearnings.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        setDeletingId(book.id!);
                        try {
                            await deleteBook(book.id!);
                            setBooks(prev => prev.filter(b => b.id !== book.id));
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ]
        );
    };

    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';

    const renderItem = ({ item }: { item: BookData }) => (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardMain}>
                <GeneratedCover
                    title={item.title}
                    author={item.author}
                    type="book"
                    category={item.category}
                    tags={item.tags}
                    width={130}
                    height={195}
                    style={styles.cover}
                />
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={[styles.cardAuthor, { color: colors.secondaryText }]}>
                        {item.author}
                    </Text>
                    {item.category ? (
                        <Text style={[styles.cardCategory, { color: colors.tint }]}>
                            {item.category}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.tint + '18' }]}
                    onPress={() => router.push({ pathname: '/edit-book', params: { bookId: item.id } })}
                >
                    <Pencil size={15} color={colors.tint} />
                    <Text style={[styles.actionText, { color: colors.tint }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#FF3B3018' }]}
                    onPress={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                >
                    {deletingId === item.id
                        ? <ActivityIndicator size="small" color="#FF3B30" />
                        : <Trash2 size={15} color="#FF3B30" />
                    }
                    <Text style={[styles.actionText, { color: '#FF3B30' }]}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Mis libros</Text>
                <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: colors.tint }]}
                    onPress={() => router.push('/add-summary')}
                >
                    <Plus size={18} color="#FFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={item => item.id!}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                                No hay libros subidos todavía.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, gap: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
    addBtn: {
        width: 34, height: 34, borderRadius: 17,
        justifyContent: 'center', alignItems: 'center',
    },
    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    card: {
        borderRadius: 14, padding: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        gap: 10,
    },
    cardMain: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    cover: { borderRadius: 12, overflow: 'hidden' },
    cardInfo: { flex: 1, gap: 4 },
    cardTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
    cardAuthor: { fontSize: 13 },
    cardCategory: { fontSize: 12, fontWeight: '600' },

    divider: { height: 1 },

    actions: { flexDirection: 'row', gap: 10 },
    actionBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 6,
        paddingVertical: 9, borderRadius: 10,
    },
    actionText: { fontSize: 14, fontWeight: '600' },
});
