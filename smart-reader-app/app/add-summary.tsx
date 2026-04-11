import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, ActivityIndicator, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../src/services/themeContext';
import { uploadBookFromJSON } from '../src/services/bookContentService';
import { ImageIcon, X, BookOpen, Layers, ChevronRight, Library } from 'lucide-react-native';

interface ParsedPreview {
    title: string;
    author: string;
    category: string;
    coverImageUrl: string;
    chapterCount: number;
    microlearningCount: number;
}

export default function AddSummaryScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const [jsonText, setJsonText] = useState('');
    const [preview, setPreview] = useState<ParsedPreview | null>(null);
    const [parseError, setParseError] = useState('');
    const [coverUri, setCoverUri] = useState<string | null>(null);   // portada custom local
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // ── Previsualizar ──────────────────────────────────────────────────────────
    const handlePreview = () => {
        setParseError('');
        setPreview(null);
        if (!jsonText.trim()) {
            setParseError('Pegá el JSON del libro antes de previsualizar.');
            return;
        }
        try {
            const parsed = JSON.parse(jsonText);
            const data = parsed.book ?? parsed;
            if (!data.title || !data.author) {
                setParseError('El JSON debe tener al menos "title" y "author".');
                return;
            }
            const chapters: any[] = data.chapters ?? [];
            const microlearningCount = chapters.reduce(
                (acc: number, ch: any) => acc + (ch.microlearnings?.length ?? 0), 0
            );
            setPreview({
                title: data.title,
                author: data.author,
                category: data.category ?? '—',
                coverImageUrl: data.coverImageUrl ?? '',
                chapterCount: chapters.length,
                microlearningCount,
            });
        } catch {
            setParseError('JSON inválido. Revisá la sintaxis.');
        }
    };

    // ── Portada custom ────────────────────────────────────────────────────────
    const pickCover = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*'],
            copyToCacheDirectory: true,
        });
        if (!result.canceled && result.assets?.[0]) {
            const uri = result.assets[0].uri;
            setCoverUri(uri);
        }
    };

    const removeCover = () => setCoverUri(null);

    // ── Subir ─────────────────────────────────────────────────────────────────
    const handleUpload = async () => {
        if (!preview) {
            setUploadError('Primero previsualizá el libro.');
            return;
        }
        setUploading(true);
        setUploadError('');
        try {
            let finalCover = preview.coverImageUrl ?? '';
            if (coverUri) {
                const response = await fetch(coverUri);
                const blob = await response.blob();
                finalCover = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }
            await uploadBookFromJSON(jsonText, finalCover);
            router.replace('/(tabs)/summaries');
        } catch (e: any) {
            setUploadError('Error al subir: ' + (e?.message || String(e)));
        } finally {
            setUploading(false);
        }
    };

    // ── Estilos dinámicos ─────────────────────────────────────────────────────
    const inputBg = isDark ? '#2C2C2E' : '#F9F9F9';
    const inputBorder = isDark ? '#3A3A3C' : '#E5E5EA';

    const inputStyle = [styles.input, {
        color: colors.text,
        borderColor: inputBorder,
        backgroundColor: inputBg,
    }];

    const coverSource = coverUri
        ? { uri: coverUri }
        : preview?.coverImageUrl
            ? { uri: preview.coverImageUrl }
            : null;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Botón ver/editar libros existentes ── */}
                <TouchableOpacity
                    style={[styles.libBtn, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? '#3A3A3C' : '#E5E5EA' }]}
                    onPress={() => router.push('/admin-books')}
                >
                    <Library size={16} color={colors.tint} />
                    <Text style={[styles.libBtnText, { color: colors.tint }]}>Ver / editar libros subidos</Text>
                    <ChevronRight size={15} color={colors.tint} />
                </TouchableOpacity>

                {/* ── JSON input ── */}
                <Text style={[styles.label, { color: colors.text }]}>JSON del libro *</Text>
                <TextInput
                    style={[inputStyle, styles.jsonArea]}
                    value={jsonText}
                    onChangeText={text => { setJsonText(text); setPreview(null); setParseError(''); }}
                    placeholder={'{\n  "title": "...",\n  "author": "...",\n  "chapters": [...]\n}'}
                    placeholderTextColor={colors.secondaryText}
                    multiline
                    textAlignVertical="top"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {parseError ? <Text style={styles.error}>{parseError}</Text> : null}

                {/* ── Botón previsualizar ── */}
                <TouchableOpacity
                    style={[styles.previewBtn, { borderColor: colors.tint }]}
                    onPress={handlePreview}
                >
                    <Text style={[styles.previewBtnText, { color: colors.tint }]}>Previsualizar</Text>
                    <ChevronRight size={16} color={colors.tint} />
                </TouchableOpacity>

                {/* ── Preview card ── */}
                {preview && (
                    <View style={[styles.previewCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: inputBorder }]}>
                        <View style={styles.previewRow}>
                            {/* Portada */}
                            <View style={[styles.coverThumb, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                                {coverSource ? (
                                    <Image source={coverSource} style={styles.coverThumbImg} resizeMode="cover" />
                                ) : (
                                    <BookOpen size={28} color={colors.secondaryText} />
                                )}
                            </View>

                            {/* Info */}
                            <View style={styles.previewInfo}>
                                <Text style={[styles.previewTitle, { color: colors.text }]} numberOfLines={2}>
                                    {preview.title}
                                </Text>
                                <Text style={[styles.previewAuthor, { color: colors.secondaryText }]}>
                                    {preview.author}
                                </Text>
                                <Text style={[styles.previewCategory, { color: colors.tint }]}>
                                    {preview.category}
                                </Text>
                            </View>
                        </View>

                        {/* Estadísticas */}
                        <View style={[styles.statsRow, { borderTopColor: inputBorder }]}>
                            <View style={styles.statItem}>
                                <Layers size={14} color={colors.secondaryText} />
                                <Text style={[styles.statText, { color: colors.secondaryText }]}>
                                    {preview.chapterCount} {preview.chapterCount === 1 ? 'capítulo' : 'capítulos'}
                                </Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: inputBorder }]} />
                            <View style={styles.statItem}>
                                <BookOpen size={14} color={colors.secondaryText} />
                                <Text style={[styles.statText, { color: colors.secondaryText }]}>
                                    {preview.microlearningCount} microlearnings
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* ── Portada custom ── */}
                {preview && (
                    <>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Portada custom{' '}
                            <Text style={{ color: colors.secondaryText, fontWeight: '400' }}>
                                (opcional, reemplaza la del JSON)
                            </Text>
                        </Text>
                        <TouchableOpacity
                            onPress={pickCover}
                            style={[styles.coverPicker, { borderColor: inputBorder, backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
                        >
                            {coverUri ? (
                                <>
                                    <Image source={{ uri: coverUri }} style={styles.coverPreview} resizeMode="cover" />
                                    <TouchableOpacity style={styles.removeCover} onPress={removeCover}>
                                        <X size={14} color="#FFF" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.coverPlaceholder}>
                                    <ImageIcon size={28} color={colors.secondaryText} />
                                    <Text style={[styles.coverHint, { color: colors.secondaryText }]}>
                                        Subir imagen
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {uploadError ? <Text style={styles.error}>{uploadError}</Text> : null}

                {/* ── Botón subir ── */}
                {preview && (
                    <TouchableOpacity
                        style={[styles.uploadBtn, { backgroundColor: colors.tint, opacity: uploading ? 0.7 : 1 }]}
                        onPress={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <View style={styles.uploadingRow}>
                                <ActivityIndicator color="#FFF" size="small" />
                                <Text style={styles.uploadBtnText}>Subiendo...</Text>
                            </View>
                        ) : (
                            <Text style={styles.uploadBtnText}>Subir libro</Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20, gap: 6, paddingBottom: 40 },
    label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 4 },
    input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
    jsonArea: { minHeight: 200, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 12 },
    error: { color: '#FF3B30', fontSize: 13, marginTop: 6 },

    // Lib btn
    libBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        borderWidth: 1, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 14,
    },
    libBtnText: { flex: 1, fontWeight: '600', fontSize: 14 },

    // Previsualizar btn
    previewBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderRadius: 10, paddingVertical: 11, marginTop: 8, gap: 4,
    },
    previewBtnText: { fontWeight: '600', fontSize: 15 },

    // Preview card
    previewCard: {
        borderWidth: 1, borderRadius: 12, marginTop: 12, overflow: 'hidden',
    },
    previewRow: { flexDirection: 'row', gap: 12, padding: 14 },
    coverThumb: {
        width: 64, height: 88, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    },
    coverThumbImg: { width: '100%', height: '100%' },
    previewInfo: { flex: 1, justifyContent: 'center', gap: 4 },
    previewTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
    previewAuthor: { fontSize: 13 },
    previewCategory: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    statsRow: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 10, paddingHorizontal: 14 },
    statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    statText: { fontSize: 13 },
    statDivider: { width: 1, marginVertical: 2 },

    // Portada custom
    coverPicker: {
        height: 140, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed',
        marginTop: 4, overflow: 'hidden',
    },
    coverPreview: { width: '100%', height: '100%' },
    coverPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    coverHint: { fontSize: 13 },
    removeCover: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12,
        width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
    },

    // Upload btn
    uploadBtn: { marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    uploadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    uploadBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
