import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, TextInput, ScrollView, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Search, BookOpen, Layers, ChevronRight, Check, Copy, ChevronDown, Pencil, Save, X } from 'lucide-react-native';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { MicrolearningData } from '../src/models/BookModels';
import { useTheme } from '../src/services/themeContext';
import { setFeed } from '../src/services/microlearningStore';
import { ALL_CATEGORIES, CATEGORY_COLORS } from '../src/services/settingsContext';

// ─── Book dropdown ────────────────────────────────────────────────────────────

type Book = { id: string; title: string };

function BookSelect({ books, value, onChange, colors, isDark }: {
    books: Book[]; value: string; onChange: (v: string) => void;
    colors: any; isDark: boolean;
}) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<View>(null);
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const label = books.find(b => b.id === value)?.title ?? 'Todos los libros';
    const border = isDark ? '#3A3A3C' : '#E5E5EA';
    const bg = isDark ? '#1C1C1E' : '#F2F2F7';
    const dropBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const hoverBg = isDark ? '#3A3A3C' : '#F2F2F7';

    const handleOpen = () => {
        triggerRef.current?.measure((_fx, _fy, w, h, px, py) => {
            setLayout({ x: px, y: py, width: w, height: h });
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
                style={[styles.selectTrigger, { backgroundColor: bg, borderColor: border }]}
            >
                <Text style={{ fontSize: 14, flex: 1, color: value ? colors.text : colors.secondaryText }} numberOfLines={1}>
                    {label}
                </Text>
                <ChevronDown size={15} color={colors.secondaryText} />
            </TouchableOpacity>

            {open && (
                <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setOpen(false)} />
                    <View style={[styles.dropdown, {
                        top: layout.y + layout.height + 4,
                        left: layout.x,
                        width: Math.max(layout.width, 220),
                        backgroundColor: dropBg,
                        borderColor: border,
                    }]}>
                        <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            {options.map(opt => {
                                const active = opt.id === value;
                                return (
                                    <TouchableOpacity
                                        key={opt.id || '__all__'}
                                        onPress={() => { onChange(opt.id); setOpen(false); }}
                                        activeOpacity={0.7}
                                        style={[styles.dropdownItem, active && { backgroundColor: hoverBg }]}
                                    >
                                        <Text style={{ fontSize: 14, flex: 1, color: active ? colors.tint : colors.text, fontWeight: active ? '600' : '400' }} numberOfLines={2}>
                                            {opt.title}
                                        </Text>
                                        {active && <Check size={15} color={colors.tint} />}
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

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AdminMicrolearningsScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const [items, setItems] = useState<MicrolearningData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<MicrolearningData | null>(null);
    const [editFields, setEditFields] = useState<Partial<MicrolearningData>>({});
    const [saving, setSaving] = useState(false);

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
            if (m.bookId && m.bookTitle && !seen.has(m.bookId)) seen.set(m.bookId, m.bookTitle);
        }
        return Array.from(seen.entries()).map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
    }, [items]);

    const availableCategories = useMemo(() => {
        const keys = new Set(items.map(m => m.category).filter(Boolean));
        return ALL_CATEGORIES.filter(c => keys.has(c.key));
    }, [items]);

    const filtered = useMemo(() => {
        let result = items;
        if (selectedBook) result = result.filter(m => m.bookId === selectedBook);
        if (selectedCategory) result = result.filter(m => m.category === selectedCategory);
        const q = search.trim().toLowerCase();
        if (q) result = result.filter(m =>
            m.title.toLowerCase().includes(q) ||
            (m.bookTitle ?? '').toLowerCase().includes(q) ||
            (m.chapterTitle ?? '').toLowerCase().includes(q) ||
            (m.category ?? '').toLowerCase().includes(q) ||
            (m.content ?? '').toLowerCase().includes(q) ||
            (m.reflectionQuestion ?? '').toLowerCase().includes(q) ||
            (m.quickExercise ?? '').toLowerCase().includes(q) ||
            (m.tags ?? []).some(t => t.toLowerCase().includes(q))
        );
        return result;
    }, [items, selectedBook, selectedCategory, search]);

    const handleCopyId = (id: string) => {
        if (typeof navigator !== 'undefined' && navigator?.clipboard) {
            navigator.clipboard.writeText(id);
        }
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleEdit = (item: MicrolearningData) => {
        setEditFields({
            hookText: item.hookText ?? '',
            title: item.title ?? '',
            content: item.content ?? '',
            reflectionQuestion: item.reflectionQuestion ?? '',
            quickExercise: item.quickExercise ?? '',
        });
        setEditingItem(item);
    };

    const handleSave = async () => {
        if (!editingItem?.id) return;
        setSaving(true);
        try {
            const updates: Record<string, any> = {};
            for (const [k, v] of Object.entries(editFields)) {
                if (v !== undefined) updates[k] = v;
            }
            await updateDoc(doc(db, 'microlearnings', editingItem.id), updates);
            setItems(prev => prev.map(m => m.id === editingItem.id ? { ...m, ...updates } : m));
            setEditingItem(null);
        } catch (e: any) {
            Alert.alert('Error al guardar', e.message);
        } finally {
            setSaving(false);
        }
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
                        <View style={styles.metaRow}>
                            <BookOpen size={13} color={colors.tint} />
                            <Text style={[styles.metaText, { color: colors.secondaryText }]} numberOfLines={1}>
                                {item.bookTitle}
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Layers size={13} color={colors.secondaryText} />
                            <Text style={[styles.metaText, { color: colors.secondaryText }]} numberOfLines={1}>
                                Cap. {item.chapterNumber} — {item.chapterTitle}
                            </Text>
                        </View>
                    </View>
                    {item.category ? (
                        <View style={[styles.tag, { backgroundColor: (CATEGORY_COLORS[item.category] ?? colors.tint) + '22' }]}>
                            <Text style={[styles.tagText, { color: CATEGORY_COLORS[item.category] ?? colors.tint }]}>
                                {item.category}
                            </Text>
                        </View>
                    ) : null}
                </View>

                <TouchableOpacity
                    onPress={(e) => { (e as any).stopPropagation?.(); handleCopyId(item.id!); }}
                    activeOpacity={0.6}
                    style={[styles.copyBtn, { backgroundColor: copiedId === item.id ? colors.tint + '20' : 'transparent' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {copiedId === item.id
                        ? <Check size={15} color={colors.tint} />
                        : <Copy size={15} color={colors.secondaryText} />}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={(e) => { (e as any).stopPropagation?.(); handleEdit(item); }}
                    activeOpacity={0.6}
                    style={[styles.copyBtn, { backgroundColor: 'transparent' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Pencil size={15} color={colors.tint} />
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
                    <Text style={[styles.count, { color: colors.secondaryText }]}>{filtered.length}</Text>
                )}
            </View>

            {/* Fila: búsqueda + libro */}
            <View style={styles.filtersRow}>
                <View style={[styles.searchRow, { backgroundColor: inputBg, borderColor: inputBorder, flex: 1 }]}>
                    <Search size={16} color={colors.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Buscar en título, contenido, tags..."
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

            {/* Chips de categoría */}
            {availableCategories.length > 0 && (
                <View style={styles.chipsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chips}
                    >
                        <TouchableOpacity
                            style={[styles.chip, selectedCategory === ''
                                ? { backgroundColor: colors.text, borderColor: colors.text }
                                : { backgroundColor: isDark ? '#3A3A3C' : '#E5E5EA', borderColor: 'transparent' }]}
                            onPress={() => setSelectedCategory('')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.chipText, { color: selectedCategory === '' ? colors.background : colors.secondaryText }]}>
                                Todos
                            </Text>
                        </TouchableOpacity>

                        {availableCategories.map(({ key, label }) => {
                            const color = CATEGORY_COLORS[key] ?? colors.tint;
                            const active = selectedCategory === key;
                            return (
                                <TouchableOpacity
                                    key={key}
                                    style={[styles.chip, {
                                        backgroundColor: active ? color : color + '28',
                                        borderColor: active ? color : color + '60',
                                    }]}
                                    onPress={() => setSelectedCategory(prev => prev === key ? '' : key)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.chipText, { color: active ? '#FFF' : color }]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* ── Edit Modal ─────────────────────────────────────────────── */}
            <Modal
                visible={!!editingItem}
                animationType="slide"
                transparent
                onRequestClose={() => setEditingItem(null)}
            >
                <View style={styles.editOverlay}>
                    <View style={[styles.editSheet, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                        {/* Header */}
                        <View style={[styles.editHeader, { borderBottomColor: isDark ? '#3A3A3C' : '#E5E5EA' }]}>
                            <TouchableOpacity onPress={() => setEditingItem(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <X size={20} color={colors.secondaryText} />
                            </TouchableOpacity>
                            <Text style={[styles.editTitle, { color: colors.text }]} numberOfLines={1}>
                                {editingItem?.title}
                            </Text>
                            <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                {saving
                                    ? <ActivityIndicator size="small" color={colors.tint} />
                                    : <Save size={20} color={colors.tint} />}
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
                            {([
                                { key: 'hookText', label: 'Hook', lines: 3 },
                                { key: 'title', label: 'Título', lines: 2 },
                                { key: 'content', label: 'Contenido', lines: 6 },
                                { key: 'reflectionQuestion', label: 'Pregunta de reflexión', lines: 2 },
                                { key: 'quickExercise', label: 'Ejercicio rápido', lines: 3 },
                            ] as { key: keyof typeof editFields; label: string; lines: number }[]).map(({ key, label, lines }) => (
                                <View key={key} style={{ gap: 6 }}>
                                    <Text style={[styles.editLabel, { color: colors.secondaryText }]}>{label}</Text>
                                    <TextInput
                                        value={(editFields[key] as string) ?? ''}
                                        onChangeText={v => setEditFields(prev => ({ ...prev, [key]: v }))}
                                        multiline
                                        numberOfLines={lines}
                                        style={[styles.editInput, {
                                            color: colors.text,
                                            backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                                            borderColor: key === 'hookText' ? colors.tint + '80' : (isDark ? '#3A3A3C' : '#E5E5EA'),
                                            minHeight: lines * 22,
                                        }]}
                                        placeholderTextColor={colors.secondaryText}
                                        placeholder={`Sin ${label.toLowerCase()}`}
                                        textAlignVertical="top"
                                    />
                                </View>
                            ))}
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
                                {search.trim() || selectedBook || selectedCategory
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
        paddingHorizontal: 16, paddingTop: 12,
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
        borderWidth: 1, borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
        elevation: 8, zIndex: 9999,
    },
    dropdownItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 11, gap: 8,
    },

    chipsWrapper: { height: 50 },
    chips: {
        paddingHorizontal: 16, paddingVertical: 8,
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    chip: {
        paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, borderWidth: 1, flexShrink: 0,
    },
    chipText: { fontSize: 13, fontWeight: '600' },

    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 15, textAlign: 'center' },

    card: {
        borderRadius: 12, padding: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    cardInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
    copyBtn: { padding: 6, borderRadius: 6 },

    editOverlay: {
        flex: 1, justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    editSheet: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: '88%',
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15, shadowRadius: 20, elevation: 20,
    },
    editHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1,
    },
    editTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
    editLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    editInput: {
        borderWidth: 1, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        fontSize: 14, lineHeight: 20,
    },
});
