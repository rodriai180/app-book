import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft, Save, Camera, ChevronDown, ChevronUp,
    Plus, Trash2, BookOpen, Lightbulb, Dumbbell, Brain,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
    getBookFullJSON,
    updateBookFromJSON,
    uploadCoverImage,
} from '../src/services/bookContentService';
import { useTheme } from '../src/services/themeContext';
import { isValidImageUrl } from '../src/utils/imageUtils';

// ─── Tipos internos del formulario ────────────────────────────────────────────

interface ExerciseForm {
    title: string;
    description: string;
    type: 'reflection' | 'action' | 'journaling';
}

interface MicrolearningForm {
    title: string;
    content: string;
    reflectionQuestion: string;
    quickExercise: string;
    tags: string; // comma-separated
    microlearningImageUrl: string;
    localImageUri: string | null; // imagen nueva aún no guardada
    expanded: boolean;
}

interface ChapterForm {
    chapterNumber: number;
    title: string;
    summary: string;
    insights: string[];
    exercises: ExerciseForm[];
    microlearnings: MicrolearningForm[];
    chapterImageUrl: string;
    localImageUri: string | null; // imagen nueva aún no guardada
    expanded: boolean;
}

interface BookForm {
    title: string;
    author: string;
    category: string;
    tags: string;
    purchaseLink: string;
    preface: string;
    shortSummary: string;
    longSummary: string;
    coverImageUrl: string;
}

const EMPTY_BOOK: BookForm = {
    title: '', author: '', category: '', tags: '',
    purchaseLink: '', preface: '', shortSummary: '', longSummary: '',
    coverImageUrl: '',
};

const EMPTY_ML = (): MicrolearningForm => ({
    title: '', content: '', reflectionQuestion: '', quickExercise: '', tags: '', microlearningImageUrl: '', localImageUri: null, expanded: true,
});

const EMPTY_EXERCISE = (): ExerciseForm => ({
    title: '', description: '', type: 'reflection',
});

const EMPTY_CHAPTER = (n: number): ChapterForm => ({
    chapterNumber: n, title: '', summary: '',
    insights: [''], exercises: [], microlearnings: [],
    chapterImageUrl: '', localImageUri: null, expanded: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rawToForm(rawChapters: any[]): ChapterForm[] {
    return (rawChapters ?? []).map((ch: any, ci: number) => ({
        chapterNumber: ch.chapterNumber ?? ci + 1,
        title: ch.title ?? '',
        summary: ch.summary ?? '',
        insights: ch.insights?.length ? ch.insights : [''],
        exercises: (ch.exercises ?? []).map((ex: any) => ({
            title: ex.title ?? '',
            description: ex.description ?? '',
            type: ex.type ?? 'reflection',
        })),
        microlearnings: (ch.microlearnings ?? []).map((ml: any) => ({
            title: ml.title ?? '',
            content: ml.content ?? '',
            reflectionQuestion: ml.reflectionQuestion ?? '',
            quickExercise: ml.quickExercise ?? '',
            tags: (ml.tags ?? []).join(', '),
            microlearningImageUrl: ml.microlearningImageUrl ?? '',
            localImageUri: null,
            expanded: false,
        })),
        chapterImageUrl: ch.chapterImageUrl ?? '',
        localImageUri: null,
        expanded: false,
    }));
}

function formToRaw(chapters: ChapterForm[]) {
    return chapters.map((ch, ci) => ({
        chapterNumber: ch.chapterNumber || ci + 1,
        title: ch.title.trim(),
        summary: ch.summary.trim(),
        insights: ch.insights.map(i => i.trim()).filter(Boolean),
        exercises: ch.exercises.map(ex => ({
            title: ex.title.trim(),
            description: ex.description.trim(),
            type: ex.type,
        })),
        chapterImageUrl: ch.chapterImageUrl,
        microlearnings: ch.microlearnings.map((ml, mi) => ({
            title: ml.title.trim(),
            content: ml.content.trim(),
            reflectionQuestion: ml.reflectionQuestion.trim(),
            quickExercise: ml.quickExercise.trim(),
            tags: ml.tags.split(',').map(t => t.trim()).filter(Boolean),
            microlearningImageUrl: ml.microlearningImageUrl.trim(),
            order: mi,
        })),
    }));
}

/**
 * Carga la imagen, la redimensiona a max 800px y la comprime a JPEG 0.75.
 * Firestore tiene límite de 1MB por documento — esto mantiene la imagen ~80-150KB.
 */
async function uriToBase64(uri: string): Promise<string> {
    const MAX_SIZE = 800;
    const QUALITY = 0.75;

    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            let { width, height } = img;
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
                else { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', QUALITY));
        };
        img.onerror = reject;
        img.src = uri;
    });
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EditBookScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { bookId } = useLocalSearchParams<{ bookId: string }>();

    const [form, setForm] = useState<BookForm>(EMPTY_BOOK);
    const [chapters, setChapters] = useState<ChapterForm[]>([]);

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [saveError, setSaveError] = useState('');

    // ── Cargar datos ──────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const data: any = await getBookFullJSON(bookId);
                if (!data) { setLoadError('No se encontró el libro.'); return; }
                setForm({
                    title: data.title ?? '',
                    author: data.author ?? '',
                    category: data.category ?? '',
                    tags: (data.tags ?? []).join(', '),
                    purchaseLink: data.purchaseLink ?? '',
                    preface: data.preface ?? '',
                    shortSummary: data.shortSummary ?? '',
                    longSummary: data.longSummary ?? '',
                    coverImageUrl: data.coverImageUrl ?? '',
                });
                setChapters(rawToForm(data.chapters ?? []));
            } catch (e: any) {
                setLoadError('Error al cargar: ' + (e?.message || String(e)));
            } finally {
                setLoadingData(false);
            }
        })();
    }, [bookId]);

    // ── Imagen ────────────────────────────────────────────────────────────────
    const pickImage = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true });
        if (result.canceled) return;
        setLocalImageUri(result.assets[0].uri);
    };

    // ── Guardar ───────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaveError('');
        if (!form.title.trim() || !form.author.trim()) {
            setSaveError('El título y el autor son obligatorios.');
            return;
        }
        setSaving(true);
        try {
            // Subir portada del libro si hay una nueva
            let coverUrl = form.coverImageUrl;
            if (localImageUri) {
                setUploadingImage(true);
                coverUrl = await uploadCoverImage(localImageUri, bookId);
                setUploadingImage(false);
            }

            // Convertir imágenes de capítulos y microlearnings a base64
            const resolvedChapters = await Promise.all(
                chapters.map(async (ch) => {
                    // Imagen del capítulo
                    let resolved = ch;
                    if (ch.localImageUri) {
                        const base64 = await uriToBase64(ch.localImageUri);
                        resolved = { ...resolved, chapterImageUrl: base64, localImageUri: null };
                    }
                    // Imágenes de microlearnings
                    const resolvedMLs = await Promise.all(
                        resolved.microlearnings.map(async (ml) => {
                            if (!ml.localImageUri) return ml;
                            const base64 = await uriToBase64(ml.localImageUri);
                            return { ...ml, microlearningImageUrl: base64, localImageUri: null };
                        })
                    );
                    return { ...resolved, microlearnings: resolvedMLs };
                })
            );

            const bookJson = {
                title: form.title.trim(),
                author: form.author.trim(),
                category: form.category.trim(),
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                purchaseLink: form.purchaseLink.trim(),
                preface: form.preface.trim(),
                shortSummary: form.shortSummary.trim(),
                longSummary: form.longSummary.trim(),
                chapters: formToRaw(resolvedChapters),
            };
            await updateBookFromJSON(bookId, bookJson, coverUrl);
            router.back();
        } catch (e: any) {
            setSaveError('Error al guardar: ' + (e?.message || String(e)));
            setUploadingImage(false);
        } finally {
            setSaving(false);
        }
    };

    // ── Helpers de mutación de capítulos ──────────────────────────────────────
    const updateChapter = useCallback((ci: number, patch: Partial<ChapterForm>) =>
        setChapters(prev => prev.map((ch, i) => i === ci ? { ...ch, ...patch } : ch)), []);

    const addChapter = () =>
        setChapters(prev => [...prev, EMPTY_CHAPTER(prev.length + 1)]);

    const removeChapter = (ci: number) =>
        setChapters(prev => prev.filter((_, i) => i !== ci));

    // insights
    const updateInsight = (ci: number, ii: number, val: string) =>
        updateChapter(ci, { insights: chapters[ci].insights.map((ins, j) => j === ii ? val : ins) });
    const addInsight = (ci: number) =>
        updateChapter(ci, { insights: [...chapters[ci].insights, ''] });
    const removeInsight = (ci: number, ii: number) =>
        updateChapter(ci, { insights: chapters[ci].insights.filter((_, j) => j !== ii) });

    // exercises
    const updateExercise = (ci: number, ei: number, patch: Partial<ExerciseForm>) =>
        updateChapter(ci, { exercises: chapters[ci].exercises.map((ex, j) => j === ei ? { ...ex, ...patch } : ex) });
    const addExercise = (ci: number) =>
        updateChapter(ci, { exercises: [...chapters[ci].exercises, EMPTY_EXERCISE()] });
    const removeExercise = (ci: number, ei: number) =>
        updateChapter(ci, { exercises: chapters[ci].exercises.filter((_, j) => j !== ei) });

    // microlearnings
    const updateML = (ci: number, mi: number, patch: Partial<MicrolearningForm>) =>
        updateChapter(ci, { microlearnings: chapters[ci].microlearnings.map((ml, j) => j === mi ? { ...ml, ...patch } : ml) });
    const addML = (ci: number) =>
        updateChapter(ci, { microlearnings: [...chapters[ci].microlearnings, EMPTY_ML()] });
    const removeML = (ci: number, mi: number) =>
        updateChapter(ci, { microlearnings: chapters[ci].microlearnings.filter((_, j) => j !== mi) });

    // ── Colores ───────────────────────────────────────────────────────────────
    const inputBg = isDark ? '#1C1C1E' : '#F9F9F9';
    const inputBorder = isDark ? '#3A3A3C' : '#E5E5EA';
    const dividerColor = isDark ? '#2C2C2E' : '#F2F2F7';
    const cardBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const cardBorder = isDark ? '#3A3A3C' : '#E5E5EA';
    const labelColor = colors.secondaryText;
    const displayImage = localImageUri ?? (form.coverImageUrl || null);

    const set = (key: keyof BookForm) => (val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['top', 'bottom']}>
            {/* ── Header ── */}
            <View style={[styles.header, { borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Editar libro</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: colors.tint, opacity: saving ? 0.7 : 1 }]}
                    onPress={handleSave}
                    disabled={saving || loadingData}
                >
                    {saving
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Save size={16} color="#FFF" />}
                    <Text style={styles.saveBtnText}>
                        {uploadingImage ? 'Subiendo...' : saving ? 'Guardando...' : 'Guardar'}
                    </Text>
                </TouchableOpacity>
            </View>

            {loadingData ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                    <Text style={[styles.loadingText, { color: labelColor }]}>Cargando...</Text>
                </View>
            ) : loadError ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{loadError}</Text>
                </View>
            ) : (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps="handled"
                    >
                        {saveError ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{saveError}</Text>
                            </View>
                        ) : null}

                        {/* ── Portada ── */}
                        <View style={styles.coverSection}>
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                                {displayImage ? (
                                    <Image source={{ uri: displayImage }} style={styles.coverImage} resizeMode="cover" />
                                ) : (
                                    <View style={[styles.coverPlaceholder, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                                        <Camera size={32} color={labelColor} />
                                        <Text style={[{ color: labelColor, fontSize: 13 }]}>Sin portada</Text>
                                    </View>
                                )}
                                <View style={[styles.coverOverlay, { backgroundColor: colors.tint }]}>
                                    <Camera size={14} color="#FFF" />
                                    <Text style={styles.coverOverlayText}>Cambiar imagen</Text>
                                </View>
                            </TouchableOpacity>
                            {localImageUri && (
                                <Text style={[styles.imageHint, { color: colors.tint }]}>
                                    Nueva imagen — se subirá al guardar
                                </Text>
                            )}
                        </View>

                        {/* ── Datos del libro ── */}
                        <SectionTitle title="Datos del libro" colors={colors} />

                        <Field label="Título *" value={form.title} onChangeText={set('title')}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Autor *" value={form.author} onChangeText={set('author')}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Categoría" value={form.category} onChangeText={set('category')}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Tags (separados por coma)" value={form.tags} onChangeText={set('tags')}
                            placeholder="liderazgo, hábitos, productividad"
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Link de compra" value={form.purchaseLink} onChangeText={set('purchaseLink')}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Prefacio" value={form.preface} onChangeText={set('preface')}
                            multiline numberOfLines={4}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Resumen corto" value={form.shortSummary} onChangeText={set('shortSummary')}
                            multiline numberOfLines={3}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        <Field label="Resumen largo" value={form.longSummary} onChangeText={set('longSummary')}
                            multiline numberOfLines={6}
                            colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />

                        {/* ── Capítulos ── */}
                        <View style={styles.sectionHeader}>
                            <SectionTitle title={`Capítulos (${chapters.length})`} colors={colors} />
                            <TouchableOpacity
                                style={[styles.addBtn, { backgroundColor: colors.tint }]}
                                onPress={addChapter}
                            >
                                <Plus size={14} color="#FFF" />
                                <Text style={styles.addBtnText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>

                        {chapters.map((ch, ci) => (
                            <ChapterCard
                                key={ci}
                                ch={ch}
                                ci={ci}
                                colors={colors}
                                inputBg={inputBg}
                                inputBorder={inputBorder}
                                cardBg={cardBg}
                                cardBorder={cardBorder}
                                labelColor={labelColor}
                                onToggle={() => updateChapter(ci, { expanded: !ch.expanded })}
                                onRemove={() => removeChapter(ci)}
                                onUpdate={(patch) => updateChapter(ci, patch)}
                                onUpdateInsight={(ii, val) => updateInsight(ci, ii, val)}
                                onAddInsight={() => addInsight(ci)}
                                onRemoveInsight={(ii) => removeInsight(ci, ii)}
                                onUpdateExercise={(ei, patch) => updateExercise(ci, ei, patch)}
                                onAddExercise={() => addExercise(ci)}
                                onRemoveExercise={(ei) => removeExercise(ci, ei)}
                                onUpdateML={(mi, patch) => updateML(ci, mi, patch)}
                                onAddML={() => addML(ci)}
                                onRemoveML={(mi) => removeML(ci, mi)}
                            />
                        ))}

                        {chapters.length === 0 && (
                            <TouchableOpacity
                                style={[styles.emptyChapters, { borderColor: inputBorder }]}
                                onPress={addChapter}
                            >
                                <BookOpen size={24} color={labelColor} />
                                <Text style={[styles.emptyChaptersText, { color: labelColor }]}>
                                    Tocá para agregar el primer capítulo
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

// ─── ChapterImagePicker ───────────────────────────────────────────────────────

function ChapterImagePicker({ imageUrl, localUri, colors, inputBg, inputBorder, labelColor, onPick, onRemove }: {
    imageUrl: string;
    localUri: string | null;
    colors: any;
    inputBg: string;
    inputBorder: string;
    labelColor: string;
    onPick: () => void;
    onRemove: () => void;
}) {
    const [imgError, setImgError] = useState(false);

    // Si cambia la imagen volvemos a intentar cargarla
    React.useEffect(() => { setImgError(false); }, [imageUrl, localUri]);

    const isPollinationsUrl = imageUrl.includes('image.pollinations.ai');
    const isExternalUrl = !isPollinationsUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
    const isBase64 = imageUrl.startsWith('data:');
    // Las URLs de Pollinations se tratan como "sin imagen": sólo mostramos localUri o imágenes válidas
    const validStoredUrl = isValidImageUrl(imageUrl) ? imageUrl : null;
    const display = localUri ?? validStoredUrl;
    const showImage = !!display && !imgError;

    return (
        <View style={styles.chImgWrapper}>
            <Text style={[styles.label, { color: labelColor }]}>Imagen del capítulo</Text>
            <View style={styles.chImgRow}>
                {showImage ? (
                    <TouchableOpacity onPress={onPick} activeOpacity={0.8}>
                        <Image
                            source={{ uri: display! }}
                            style={styles.chImgPreview}
                            resizeMode="cover"
                            onError={() => setImgError(true)}
                        />
                        <View style={[styles.coverOverlay, { backgroundColor: colors.tint }]}>
                            <Camera size={12} color="#FFF" />
                            <Text style={styles.coverOverlayText}>Cambiar</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.chImgPlaceholder, { backgroundColor: inputBg, borderColor: inputBorder }]}
                        onPress={onPick}
                        activeOpacity={0.7}
                    >
                        <Camera size={20} color={labelColor} />
                        <Text style={{ color: labelColor, fontSize: 12 }}>
                            {imgError ? 'No se pudo cargar\nSubir imagen' : 'Agregar imagen'}
                        </Text>
                    </TouchableOpacity>
                )}

                {display && (
                    <TouchableOpacity style={styles.chImgRemove} onPress={onRemove}>
                        <Trash2 size={14} color="#FF3B30" />
                        <Text style={{ color: '#FF3B30', fontSize: 12 }}>Quitar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* URL actual visible cuando es externa */}
            {isExternalUrl && !localUri && (
                <Text
                    style={[styles.imageHint, { color: labelColor }]}
                    numberOfLines={2}
                    selectable
                >
                    {imageUrl}
                </Text>
            )}

            {/* Hint según estado */}
            {localUri ? (
                <Text style={[styles.imageHint, { color: colors.tint }]}>
                    Nueva imagen — se convertirá a base64 al guardar
                </Text>
            ) : isPollinationsUrl ? (
                <Text style={[styles.imageHint, { color: '#FF3B30' }]}>
                    URL de Pollinations (placeholder) — sube una imagen real
                </Text>
            ) : isExternalUrl && !imgError ? (
                <Text style={[styles.imageHint, { color: '#FF9500' }]}>
                    URL externa — sube una nueva imagen para guardarla en base64
                </Text>
            ) : isBase64 ? (
                <Text style={[styles.imageHint, { color: labelColor }]}>
                    Imagen guardada en base64
                </Text>
            ) : null}
        </View>
    );
}

// ─── ChapterCard ──────────────────────────────────────────────────────────────

interface ChapterCardProps {
    ch: ChapterForm;
    ci: number;
    colors: any;
    inputBg: string;
    inputBorder: string;
    cardBg: string;
    cardBorder: string;
    labelColor: string;
    onToggle: () => void;
    onRemove: () => void;
    onUpdate: (patch: Partial<ChapterForm>) => void;
    onUpdateInsight: (ii: number, val: string) => void;
    onAddInsight: () => void;
    onRemoveInsight: (ii: number) => void;
    onUpdateExercise: (ei: number, patch: Partial<ExerciseForm>) => void;
    onAddExercise: () => void;
    onRemoveExercise: (ei: number) => void;
    onUpdateML: (mi: number, patch: Partial<MicrolearningForm>) => void;
    onAddML: () => void;
    onRemoveML: (mi: number) => void;
}

function ChapterCard({
    ch, ci: _ci, colors, inputBg, inputBorder, cardBg, cardBorder, labelColor,
    onToggle, onRemove, onUpdate,
    onUpdateInsight, onAddInsight, onRemoveInsight,
    onUpdateExercise, onAddExercise, onRemoveExercise,
    onUpdateML, onAddML, onRemoveML,
}: ChapterCardProps) {
    return (
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {/* Chapter header */}
            <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.7}>
                <BookOpen size={16} color={colors.tint} />
                <Text style={[styles.cardHeaderText, { color: colors.text }]} numberOfLines={1}>
                    {`Cap. ${ch.chapterNumber}${ch.title ? ` — ${ch.title}` : ''}`}
                </Text>
                <View style={styles.cardHeaderRight}>
                    <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Trash2 size={16} color="#FF3B30" />
                    </TouchableOpacity>
                    {ch.expanded ? <ChevronUp size={18} color={labelColor} /> : <ChevronDown size={18} color={labelColor} />}
                </View>
            </TouchableOpacity>

            {ch.expanded && (
                <View style={[styles.cardBody, { borderTopColor: inputBorder }]}>
                    {/* Número y título */}
                    <View style={styles.row2}>
                        <View style={{ width: 70 }}>
                            <Field label="N°" value={String(ch.chapterNumber)}
                                onChangeText={v => onUpdate({ chapterNumber: parseInt(v) || 1 })}
                                keyboardType="numeric"
                                colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Field label="Título" value={ch.title}
                                onChangeText={v => onUpdate({ title: v })}
                                colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                        </View>
                    </View>

                    <Field label="Resumen del capítulo" value={ch.summary}
                        onChangeText={v => onUpdate({ summary: v })}
                        multiline numberOfLines={3}
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />

                    {/* Imagen del capítulo */}
                    <ChapterImagePicker
                        imageUrl={ch.chapterImageUrl}
                        localUri={ch.localImageUri}
                        colors={colors}
                        inputBg={inputBg}
                        inputBorder={inputBorder}
                        labelColor={labelColor}
                        onPick={async () => {
                            const result = await DocumentPicker.getDocumentAsync({
                                type: 'image/*', copyToCacheDirectory: true,
                            });
                            if (!result.canceled)
                                onUpdate({ localImageUri: result.assets[0].uri });
                        }}
                        onRemove={() => onUpdate({ localImageUri: null, chapterImageUrl: '' })}
                    />

                    {/* Insights */}
                    <SubSectionHeader
                        icon={<Lightbulb size={14} color={colors.tint} />}
                        title="Insights"
                        onAdd={onAddInsight}
                        colors={colors}
                    />
                    {ch.insights.map((ins, ii) => (
                        <View key={ii} style={styles.listRow}>
                            <TextInput
                                style={[styles.listInput, {
                                    color: colors.text, borderColor: inputBorder, backgroundColor: inputBg,
                                }]}
                                value={ins}
                                onChangeText={v => onUpdateInsight(ii, v)}
                                placeholder={`Insight ${ii + 1}`}
                                placeholderTextColor={labelColor}
                                multiline
                            />
                            {ch.insights.length > 1 && (
                                <TouchableOpacity onPress={() => onRemoveInsight(ii)} style={styles.removeRowBtn}>
                                    <Trash2 size={14} color="#FF3B30" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {/* Exercises */}
                    <SubSectionHeader
                        icon={<Dumbbell size={14} color={colors.tint} />}
                        title="Ejercicios"
                        onAdd={onAddExercise}
                        colors={colors}
                    />
                    {ch.exercises.map((ex, ei) => (
                        <View key={ei} style={[styles.nestedCard, { borderColor: inputBorder, backgroundColor: inputBg }]}>
                            <View style={styles.nestedCardHeader}>
                                <Text style={[styles.nestedCardTitle, { color: labelColor }]}>
                                    Ejercicio {ei + 1}
                                </Text>
                                <TouchableOpacity onPress={() => onRemoveExercise(ei)}>
                                    <Trash2 size={14} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                            <Field label="Título" value={ex.title}
                                onChangeText={v => onUpdateExercise(ei, { title: v })}
                                colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                            <Field label="Descripción" value={ex.description}
                                onChangeText={v => onUpdateExercise(ei, { description: v })}
                                multiline numberOfLines={2}
                                colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                            <Text style={[styles.label, { color: labelColor }]}>Tipo</Text>
                            <View style={styles.typeRow}>
                                {(['reflection', 'action', 'journaling'] as const).map(t => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.typeBtn,
                                            {
                                                borderColor: ex.type === t ? colors.tint : inputBorder,
                                                backgroundColor: ex.type === t ? colors.tint + '22' : 'transparent',
                                            },
                                        ]}
                                        onPress={() => onUpdateExercise(ei, { type: t })}
                                    >
                                        <Text style={[styles.typeBtnText, { color: ex.type === t ? colors.tint : labelColor }]}>
                                            {t}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                    {ch.exercises.length === 0 && (
                        <Text style={[styles.emptyHint, { color: labelColor }]}>Sin ejercicios</Text>
                    )}

                    {/* Microlearnings */}
                    <SubSectionHeader
                        icon={<Brain size={14} color={colors.tint} />}
                        title={`Microlearnings (${ch.microlearnings.length})`}
                        onAdd={onAddML}
                        colors={colors}
                    />
                    {ch.microlearnings.map((ml, mi) => (
                        <MLCard
                            key={mi}
                            ml={ml}
                            mi={mi}
                            colors={colors}
                            inputBg={inputBg}
                            inputBorder={inputBorder}
                            labelColor={labelColor}
                            onToggle={() => onUpdateML(mi, { expanded: !ml.expanded })}
                            onRemove={() => onRemoveML(mi)}
                            onUpdate={(patch) => onUpdateML(mi, patch)}
                        />
                    ))}
                    {ch.microlearnings.length === 0 && (
                        <Text style={[styles.emptyHint, { color: labelColor }]}>Sin microlearnings</Text>
                    )}
                </View>
            )}
        </View>
    );
}

// ─── MLCard ───────────────────────────────────────────────────────────────────

interface MLCardProps {
    ml: MicrolearningForm;
    mi: number;
    colors: any;
    inputBg: string;
    inputBorder: string;
    labelColor: string;
    onToggle: () => void;
    onRemove: () => void;
    onUpdate: (patch: Partial<MicrolearningForm>) => void;
}

function MLCard({ ml, mi, colors, inputBg, inputBorder, labelColor, onToggle, onRemove, onUpdate }: MLCardProps) {
    return (
        <View style={[styles.mlCard, { borderColor: inputBorder }]}>
            <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.7}>
                <Brain size={14} color={colors.tint} />
                <Text style={[styles.mlCardTitle, { color: colors.text }]} numberOfLines={1}>
                    {ml.title || `Microlearning ${mi + 1}`}
                </Text>
                <View style={styles.cardHeaderRight}>
                    <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Trash2 size={14} color="#FF3B30" />
                    </TouchableOpacity>
                    {ml.expanded ? <ChevronUp size={16} color={labelColor} /> : <ChevronDown size={16} color={labelColor} />}
                </View>
            </TouchableOpacity>

            {ml.expanded && (
                <View style={[styles.cardBody, { borderTopColor: inputBorder }]}>
                    <Field label="Título" value={ml.title} onChangeText={v => onUpdate({ title: v })}
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                    <Field label="Contenido" value={ml.content} onChangeText={v => onUpdate({ content: v })}
                        multiline numberOfLines={5}
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                    <Field label="Pregunta de reflexión" value={ml.reflectionQuestion}
                        onChangeText={v => onUpdate({ reflectionQuestion: v })}
                        multiline numberOfLines={2}
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                    <Field label="Ejercicio rápido" value={ml.quickExercise}
                        onChangeText={v => onUpdate({ quickExercise: v })}
                        multiline numberOfLines={2}
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                    <Field label="Tags (separados por coma)" value={ml.tags}
                        onChangeText={v => onUpdate({ tags: v })}
                        placeholder="ej: liderazgo, focus"
                        colors={colors} inputBg={inputBg} inputBorder={inputBorder} labelColor={labelColor} />
                    <ChapterImagePicker
                        imageUrl={ml.microlearningImageUrl}
                        localUri={ml.localImageUri}
                        colors={colors}
                        inputBg={inputBg}
                        inputBorder={inputBorder}
                        labelColor={labelColor}
                        onPick={async () => {
                            const result = await DocumentPicker.getDocumentAsync({
                                type: 'image/*', copyToCacheDirectory: true,
                            });
                            if (!result.canceled)
                                onUpdate({ localImageUri: result.assets[0].uri });
                        }}
                        onRemove={() => onUpdate({ localImageUri: null, microlearningImageUrl: '' })}
                    />
                </View>
            )}
        </View>
    );
}

// ─── Componentes de apoyo ─────────────────────────────────────────────────────

function SectionTitle({ title, colors }: { title: string; colors: any }) {
    return <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>;
}

function SubSectionHeader({ icon, title, onAdd, colors }: {
    icon: React.ReactNode; title: string; onAdd: () => void; colors: any;
}) {
    return (
        <View style={styles.subHeader}>
            {icon}
            <Text style={[styles.subHeaderText, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onAdd} style={[styles.smallAddBtn, { borderColor: colors.tint }]}>
                <Plus size={12} color={colors.tint} />
            </TouchableOpacity>
        </View>
    );
}

interface FieldProps {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: any;
    colors: any;
    inputBg: string;
    inputBorder: string;
    labelColor: string;
}

function Field({ label, value, onChangeText, placeholder, multiline, numberOfLines = 1, keyboardType, colors, inputBg, inputBorder, labelColor }: FieldProps) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && { minHeight: numberOfLines * 22 + 20, textAlignVertical: 'top' },
                    { color: colors.text, borderColor: inputBorder, backgroundColor: inputBg },
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={labelColor}
                multiline={multiline}
                numberOfLines={numberOfLines}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, gap: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
    saveBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
    loadingText: { fontSize: 14 },
    errorText: { color: '#FF3B30', fontSize: 13 },
    errorBox: { borderRadius: 8, padding: 12, backgroundColor: 'rgba(255,59,48,0.1)' },

    content: { padding: 16, paddingBottom: 80, gap: 14 },

    // Cover
    coverSection: { alignItems: 'center', gap: 8 },
    coverImage: { width: 130, height: 185, borderRadius: 12 },
    coverPlaceholder: {
        width: 130, height: 185, borderRadius: 12,
        borderWidth: 1, borderStyle: 'dashed',
        justifyContent: 'center', alignItems: 'center', gap: 8,
    },
    coverOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 7,
    },
    coverOverlayText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    imageHint: { fontSize: 12 },

    // Section
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    },
    addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },

    // Fields
    fieldWrapper: { gap: 5 },
    label: { fontSize: 12, fontWeight: '600' },
    input: {
        borderWidth: 1, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 9,
        fontSize: 14,
    },
    row2: { flexDirection: 'row', gap: 10 },

    // Cards
    card: {
        borderRadius: 12, borderWidth: 1, overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    cardHeaderText: { flex: 1, fontSize: 14, fontWeight: '600' },
    cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardBody: { borderTopWidth: 1, padding: 14, gap: 12 },

    // Nested exercise card
    nestedCard: {
        borderRadius: 10, borderWidth: 1,
        padding: 12, gap: 10,
    },
    nestedCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    nestedCardTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Insights list
    listRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
    listInput: {
        flex: 1, borderWidth: 1, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 7,
        fontSize: 14, minHeight: 38,
    },
    removeRowBtn: { paddingTop: 10 },

    // Type buttons
    typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    typeBtn: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1,
    },
    typeBtnText: { fontSize: 12, fontWeight: '600' },

    // ML
    mlCard: { borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
    mlCardTitle: { flex: 1, fontSize: 13, fontWeight: '600' },

    // Sub-section
    subHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    subHeaderText: { flex: 1, fontSize: 13, fontWeight: '700' },
    smallAddBtn: { borderWidth: 1, borderRadius: 6, padding: 4 },

    emptyHint: { fontSize: 12, fontStyle: 'italic', paddingLeft: 4 },
    emptyChapters: {
        borderWidth: 1, borderStyle: 'dashed', borderRadius: 12,
        padding: 32, alignItems: 'center', gap: 10,
    },
    emptyChaptersText: { fontSize: 14 },

    // Chapter image picker
    chImgWrapper: { gap: 6 },
    chImgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
    chImgPreview: { width: 100, height: 140, borderRadius: 8 },
    chImgPlaceholder: {
        width: 100, height: 140, borderRadius: 8,
        borderWidth: 1, borderStyle: 'dashed',
        justifyContent: 'center', alignItems: 'center', gap: 6,
    },
    chImgRemove: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 8 },
    mlImgPreview: { width: '100%', height: 140, borderRadius: 8, marginTop: 4 },
});
