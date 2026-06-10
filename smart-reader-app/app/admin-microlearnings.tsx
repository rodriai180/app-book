import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, TextInput, Platform, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Search, BookOpen, Layers, ChevronRight, ChevronDown, Check, Copy } from 'lucide-react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { MicrolearningData } from '../src/models/BookModels';
import { useTheme } from '../src/services/themeContext';
import { setFeed } from '../src/services/microlearningStore';

type Book = { id: string; title: string };

function BookSelect({
    books,
    value,
    onChange,
    colors,
    isDark,
}: {
    books: Book[];
    value: string;
    onChange: (v: string) => void;
    colors: any;
    isDark: boolean;
}) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<View>(null);
    const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const selected = books.find(b => b.id === value);
    const label = selected ? selected.title : 'Todos los libros';

    const borderColor = isDark ? '#3A3A3C' : '#E5E5EA';
    const bg = isDark ? '#1C1C1E' : '#F2F2F7';
    const dropdownBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const hoverBg = isDark ? '#3A3A3C' : '#F2F2F7';

    const handleOpen = () => {
        triggerRef.current?.measure((_fx, _fy, width, height, px, py) => {
            setTriggerLayout({ x: px, y: py, width, height });
            setOpen(true);
        });
    };

    const options = [{ id: '', title: 'Todos los libros' }, ...books];

    return (
        <>
            <TouchableOpacity
                ref={triggerRef}
                onPress={handleOpen}
                activeOpacity={0.8}
                style={[styles.selectTrigger, { backgroundColor: bg, borderColor }]}
            >
                <Text
                    style={{ fontSize: 14, color: value ? colors.text : colors.secondaryText, flex: 1 }}
                    numberOfLines={1}
                >
                    {label}
                </Text>
                <ChevronDown size={15} color={colors.secondaryText} />
            </TouchableOpacity>

            {open && (
                <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                    {/* Overlay to close */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setOpen(false)}
                    />
                    {/* Dropdown panel */}
                    <View style={[
                        styles.dropdown,
                        {
                            top: triggerLayout.y + triggerLayout.height + 4,
                            left: triggerLayout.x,
                            width: Math.max(triggerLayout.width, 220),
                            backgroundColor: dropdownBg,
                            borderColor,
                            shadowColor: isDark ? '#000' : '#00000030',
                        },
                    ]}>
                        <ScrollView
                            style={{ maxHeight: 280 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {options.map(opt => {
                                const isSelected = opt.id === value;
                                return (
                                    <TouchableOpacity
                                        key={opt.id || '__all__'}
                                        onPress={() => { onChange(opt.id); setOpen(false); }}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.dropdownItem,
                                            isSelected && { backgroundColor: hoverBg },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                flex: 1,
                                                color: isSelected ? colors.tint : colors.text,
                                                fontWeight: isSelected ? '600' : '400',
                                            }}
                                            numberOfLines={2}
                                        >
                                            {opt.title}
                                        </Text>
                                        {isSelected && <Check size={15} color={colors.tint} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </Modal>
            )}
        </>
    );
}

export default function AdminMicrolearningsScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const snap = await getDocs(query(collection(db, 'microlearnings'), orderBy('bookTitle')));
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MicrolearningData)));
        } catch {
            const snap = await getDocs(collection(db, 'microlearnings'));
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MicrolearningData)));
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadAll(); }, []));

    const books = useMemo(() => {
        const seen = new Map<string, string>();
        for (const m of items) {
            if (m.bookId && m.bookTitle && !seen.has(m.bookId)) {
                seen.set(m.bookId, m.bookTitle);
            }
        }
        return Array.from(seen.entries())
            .map(([id, title]) => ({ id, title }))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [items]);

    const filtered = useMemo(() => {
        let result = items;
        if (selectedBook) result = result.filter(m => m.bookId === selectedBook);
        const q = search.trim().toLowerCase();
        if (q) result = result.filter(m =>
            m.title.toLowerCase().includes(q) ||
            (m.bookTitle ?? '').toLowerCase().includes(q) ||
            (m.chapterTitle ?? '').toLowerCase().includes(q) ||
            (m.category ?? '').toLowerCase().includes(q)
        );
        return result;
    }, [items, selectedBook, search]);

    const handleCopyId = (id: string) => {
        if (Platform.OS === 'web' && navigator?.clipboard) {
            navigator.clipboard.writeText(id);
        }
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleOpen = (item: MicrolearningData) => {
        const idx = filtered.findIndex(m => m.id === item.id);
        setFeed(filtered, idx >= 0 ? idx : 0);
        router.push('/microlearning-detail');
    };

    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';
    const inputBg = isDark ? '#1C1C1E' : '#F2F2F7';
    const inputBorder = isDark ? '#3A3A3C' : '#E5E5EA';

    const renderItem = ({ item }: { item: MicrolearningData }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: cardBg }]}
            activeOpacity={0.7}
            onPress={() => handleOpen(item)}
        >
            <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                    <Text style={[styles.mlTitle, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <View style={styles.meta}>
                        {!selectedBook && (
                            <View style={styles.metaRow}>
                                <BookOpen size={13} color={colors.tint} />
                                <Text style={[styles.metaText, { color: colors.secondaryText }]} numberOfLines={1}>
                                    {item.bookTitle}
                                </Text>
                            </View>
                        )}
                        <View style={styles.metaRow}>
                            <Layers size={13} color={colors.secondaryText} />
                            <Text style={[styles.metaText, { color: colors.secondaryText }]} numberOfLines={1}>
                                Cap. {item.chapterNumber} — {item.chapterTitle}
                            </Text>
                        </View>
                    </View>

                    {item.category ? (
                        <View style={[styles.tag, { backgroundColor: colors.tint + '18' }]}>
                            <Text style={[styles.tagText, { color: colors.tint }]}>{item.category}</Text>
                        </View>
                    ) : null}
                </View>

                <TouchableOpacity
                    onPress={(e) => { e.stopPropagation?.(); handleCopyId(item.id!); }}
                    activeOpacity={0.6}
                    style={[styles.copyBtn, { backgroundColor: copiedId === item.id ? colors.tint + '20' : 'transparent' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {copiedId === item.id
                        ? <Check size={15} color={colors.tint} />
                        : <Copy size={15} color={colors.secondaryText} />
                    }
                </TouchableOpacity>

                <ChevronRight size={18} color={colors.secondaryText} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Microlearnings</Text>
                {!loading && (
                    <Text style={[styles.count, { color: colors.secondaryText }]}>
                        {filtered.length}
                    </Text>
                )}
            </View>

            {/* Filtros */}
            <View style={styles.filtersRow}>
                <View style={[styles.searchRow, { backgroundColor: inputBg, borderColor: inputBorder, flex: 1 }]}>
                    <Search size={16} color={colors.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Buscar título, capítulo, categoría..."
                        placeholderTextColor={colors.secondaryText}
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                    />
                </View>

                {books.length > 0 && (
                    <BookSelect
                        books={books}
                        value={selectedBook}
                        onChange={setSelectedBook}
                        colors={colors}
                        isDark={isDark}
                    />
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id ?? item.title}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                                {search.trim() || selectedBook
                                    ? 'No se encontraron microlearnings con ese filtro.'
                                    : 'No hay microlearnings todavía.'}
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
    count: { fontSize: 14, fontWeight: '500' },

    filtersRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
    },
    searchRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        borderWidth: 1, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 8,
    },
    searchInput: { flex: 1, fontSize: 14 },

    selectTrigger: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderWidth: 1, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 8,
        flex: 1,
    },

    dropdown: {
        position: 'absolute',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 9999,
    },
    dropdownItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 11, gap: 8,
    },

    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    card: {
        borderRadius: 12, padding: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    cardInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    copyBtn: { padding: 6, borderRadius: 6 },
    cardContent: { flex: 1, gap: 6 },
    mlTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
    meta: { gap: 3 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 13, flex: 1 },
    tag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 6,
    },
    tagText: { fontSize: 12, fontWeight: '600' },
});
