import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { VocabularyItem } from '@/constants/mockData';
import { getVocabulary } from '@/services/firestoreService';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { ChevronRight, Search, Volume2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const categories = ['Todos', 'Comida', 'Transporte', 'Familia', 'Tiempo', 'Casa', 'Salud', 'Trabajo', 'Emociones', 'Viajes', 'Moda'];

export default function VocabularioScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                const data = await getVocabulary();
                setVocabulary(data);
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVocab();
    }, []);

    const speak = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'it-IT', pitch: 1, rate: 0.9 });
    };

    const filteredData = vocabulary.filter((item) => {
        const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const renderVocabItem = ({ item }: { item: VocabularyItem }) => (
        <Pressable
            style={({ pressed }) => [
                styles.vocabCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && { opacity: 0.9 }
            ]}
            onPress={() => router.push({ pathname: '/vocab-detail', params: { id: item.id } })}>
            <View style={styles.vocabInfo}>
                <Text style={[styles.wordText, { color: theme.primary }]}>{item.word}</Text>
                <Text style={[styles.translationText, { color: theme.text }]}>{item.translation}</Text>
                <Text style={[styles.exampleText, { color: theme.muted }]} numberOfLines={1}>
                    {item.example}
                </Text>
            </View>
            <View style={styles.actions}>
                <Pressable
                    style={styles.iconButton}
                    onPress={() => speak(item.word)}
                >
                    <Volume2 size={20} color={theme.primary} />
                </Pressable>
                <ChevronRight size={18} color={theme.muted} />
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                    <Search size={20} color={theme.muted} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Buscar palabras..."
                        placeholderTextColor={theme.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item: cat }) => (
                        <Pressable
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.categoryBadge,
                                { backgroundColor: activeCategory === cat ? theme.primary : theme.surface },
                            ]}>
                            <Text style={[
                                styles.categoryText,
                                { color: activeCategory === cat ? 'white' : theme.text }
                            ]}>
                                {cat}
                            </Text>
                        </Pressable>
                    )}
                    contentContainerStyle={styles.categoryContainer}
                    style={styles.categoryList}
                />
            </View>

            {loading ? (
                <View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={{ color: theme.muted, marginTop: 10 }}>Cargando vocabulario...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderVocabItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={{ color: theme.muted }}>No se encontraron resultados.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingTop: Theme.spacing.md,
        borderBottomWidth: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Theme.spacing.md,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        borderRadius: Theme.roundness.full,
        gap: Theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        height: 40,
        ...Theme.typography.body,
    },
    categoryList: {
        width: '100%',
        marginTop: Theme.spacing.sm,
    },
    categoryContainer: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.md,
        gap: Theme.spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: 8,
        borderRadius: Theme.roundness.full,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        padding: Theme.spacing.md,
        gap: Theme.spacing.sm,
    },
    vocabCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
    },
    vocabInfo: {
        flex: 1,
        gap: 2,
    },
    wordText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    translationText: {
        fontSize: 15,
        fontWeight: '500',
    },
    exampleText: {
        fontSize: 13,
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.sm,
    },
    iconButton: {
        padding: 8,
        borderRadius: Theme.roundness.full,
        backgroundColor: '#F0F9FF',
    },
    emptyState: {
        padding: Theme.spacing.xxl,
        alignItems: 'center',
    },
});
