import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, ScrollView, Image, Modal,
    TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StickyNote, Trash2, X, ArrowLeft } from 'lucide-react-native';
import * as pdfjsLib from 'pdfjs-dist';

interface WordPosition {
    x: number; y: number; w: number; h: number; // viewport pixels (scale 1.8)
}

interface ReaderPdfContentProps {
    pdfUrl: string;
    pages: string[];
    currentPage: number;
    pageNotes: Record<string, string>;
    colors: any;
    isDark: boolean;
    showPageNoteModal: boolean;
    tempPageNote: string;
    selectedPdfPage: number | null;
    setTempPageNote: (t: string) => void;
    setShowPageNoteModal: (v: boolean) => void;
    openPageNoteModal: (pdfPage: number) => void;
    savePageNote: () => void;
    deletePageNote: (pdfPage: number) => void;
    onBack: () => void;
    // Word highlight
    isPlaying?: boolean;
    currentWordInfo?: { charIndex: number; charLength: number } | null;
    currentPageText?: string;
}

/** Calcula en qué página PDF cae el párrafo `paragraphIndex` */
export function paragraphToPdfPage(pages: string[], paragraphIndex: number): number {
    let pdfPage = 1;
    for (let i = 0; i < paragraphIndex && i < pages.length; i++) {
        if (pages[i] === '---') pdfPage++;
    }
    return pdfPage;
}

/** Replica el preprocesado de AudioService para obtener el texto hablado */
function preprocessSpokenText(text: string): string {
    if (!text) return '';
    let t = text.replace(/^#+\s+/g, '');
    t = t.replace(/[*_~`]/g, '');
    t = t.replace(/([.?!,;:])\s*/g, '$1 ');
    return t.trim();
}

/** Dado el texto y un charIndex, devuelve el índice de la palabra */
function wordIndexFromCharIndex(text: string, charIndex: number): number {
    let wordIdx = 0;
    let inWord = false;
    for (let i = 0; i < charIndex && i < text.length; i++) {
        if (/\s/.test(text[i])) {
            if (inWord) { wordIdx++; inWord = false; }
        } else {
            inWord = true;
        }
    }
    return wordIdx;
}

/** Extrae palabras con posiciones de la página PDF usando PDF.js */
async function extractPageWordPositions(page: any, scale: number): Promise<Array<{ text: string; pos: WordPosition }>> {
    const viewport = page.getViewport({ scale });
    const textContent = await page.getTextContent();
    const result: Array<{ text: string; pos: WordPosition }> = [];

    for (const item of (textContent.items as any[])) {
        if (!item.str?.trim()) continue;

        // Convertir posición PDF a coordenadas de viewport
        const [vx, vy] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
        const itemH = Math.abs(item.transform[3]) * scale;
        const itemW = (item.width || 0) * scale;

        const parts = item.str.split(/(\s+)/);
        let curX = vx;
        const charWidth = itemW / (item.str.length || 1);

        for (const part of parts) {
            const partW = part.length * charWidth;
            if (part.trim()) {
                result.push({
                    text: part.replace(/[.,!?;:"'()]/g, '').toLowerCase(),
                    pos: { x: curX, y: vy - itemH, w: partW, h: itemH },
                });
            }
            curX += partW;
        }
    }

    return result;
}

/** Mapea palabras del texto hablado a posiciones del PDF (matching secuencial) */
function mapSpokenWordsToPositions(
    spokenText: string,
    pdfWords: Array<{ text: string; pos: WordPosition }>
): Array<WordPosition | null> {
    const spoken = spokenText
        .split(/\s+/)
        .filter(w => w.length > 0)
        .map(w => w.replace(/[.,!?;:"'()]/g, '').toLowerCase());

    const positions: Array<WordPosition | null> = [];
    let pdfIdx = 0;

    for (const word of spoken) {
        if (!word) { positions.push(null); continue; }

        let found = false;
        // Buscar hacia adelante en las palabras del PDF
        for (let i = pdfIdx; i < Math.min(pdfIdx + 40, pdfWords.length); i++) {
            const pdfWord = pdfWords[i].text;
            if (pdfWord === word || pdfWord.includes(word) || word.includes(pdfWord)) {
                positions.push(pdfWords[i].pos);
                pdfIdx = i + 1;
                found = true;
                break;
            }
        }
        if (!found) positions.push(null);
    }

    return positions;
}

export const ReaderPdfContent = ({
    pdfUrl,
    pages,
    currentPage,
    pageNotes,
    colors,
    isDark,
    showPageNoteModal,
    tempPageNote,
    selectedPdfPage,
    setTempPageNote,
    setShowPageNoteModal,
    openPageNoteModal,
    savePageNote,
    deletePageNote,
    onBack,
    isPlaying,
    currentWordInfo,
    currentPageText,
}: ReaderPdfContentProps) => {
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState(0.707);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [spokenWordPositions, setSpokenWordPositions] = useState<Array<WordPosition | null>>([]);
    const [highlightBox, setHighlightBox] = useState<WordPosition | null>(null);

    const pdfRef = useRef<any>(null);
    // Cache de palabras PDF por número de página para evitar race conditions
    const pdfWordsCache = useRef<Map<number, Array<{ text: string; pos: WordPosition }>>>(new Map());
    const currentPdfPage = paragraphToPdfPage(pages, currentPage);
    const SCALE = 1.8;

    // Cargar PDF
    useEffect(() => {
        if (!pdfUrl) return;
        pdfjsLib.getDocument(pdfUrl).promise
            .then(pdf => {
                pdfRef.current = pdf;
                setTotalPages(pdf.numPages);
                console.log('[HL] PDF cargado, páginas:', pdf.numPages);
            })
            .catch(console.error);
    }, [pdfUrl]);

    // Renderizar imagen del PDF cuando cambia la página + precachear páginas adyacentes
    useEffect(() => {
        if (!pdfRef.current || totalPages === 0) return;
        renderPage(currentPdfPage);

        // Precachear posiciones de páginas adyacentes en background
        const prewarm = async (pageNum: number) => {
            if (pageNum < 1 || pageNum > totalPages) return;
            if (pdfWordsCache.current.has(pageNum)) return;
            try {
                const page = await pdfRef.current.getPage(pageNum);
                const pdfWords = await extractPageWordPositions(page, SCALE);
                pdfWordsCache.current.set(pageNum, pdfWords);
            } catch (_) {}
        };
        prewarm(currentPdfPage - 1);
        prewarm(currentPdfPage + 1);
    }, [currentPdfPage, totalPages]);

    // Re-extraer posiciones cuando cambia el párrafo hablado (sin re-renderizar imagen)
    useEffect(() => {
        if (!pdfRef.current || !currentPageText || totalPages === 0) {
            setSpokenWordPositions([]);
            setHighlightBox(null);
            return;
        }

        const spoken = preprocessSpokenText(currentPageText);

        // Usar caché si ya está disponible (evita race condition con TTS corto)
        const cached = pdfWordsCache.current.get(currentPdfPage);
        if (cached) {
            console.log('[HL] Usando caché para página', currentPdfPage, '| palabras:', cached.length);
            const mapped = mapSpokenWordsToPositions(spoken, cached);
            const valid = mapped.filter(Boolean).length;
            console.log('[HL] Palabras mapeadas (caché):', mapped.length, '/ con posición:', valid);
            setSpokenWordPositions(mapped);
            return;
        }

        // Fallback: extraer async si la caché aún no está lista
        const extractPositions = async () => {
            try {
                const page = await pdfRef.current.getPage(currentPdfPage);
                const pdfWords = await extractPageWordPositions(page, SCALE);
                pdfWordsCache.current.set(currentPdfPage, pdfWords);
                console.log('[HL] Spoken text:', spoken.slice(0, 60));
                console.log('[HL] PDF words en página:', pdfWords.length);
                const mapped = mapSpokenWordsToPositions(spoken, pdfWords);
                const valid = mapped.filter(Boolean).length;
                console.log('[HL] Palabras mapeadas (async):', mapped.length, '/ con posición:', valid);
                setSpokenWordPositions(mapped);
            } catch (e) {
                console.error('[HL] Error extrayendo posiciones:', e);
            }
        };
        extractPositions();
    }, [currentPageText, currentPdfPage, totalPages]);

    const renderPage = async (pageNum: number) => {
        if (!pdfRef.current) return;
        setLoading(true);
        try {
            const page = await pdfRef.current.getPage(pageNum);
            const viewport = page.getViewport({ scale: SCALE });
            setAspectRatio(viewport.width / viewport.height);
            setViewportWidth(viewport.width);

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Pre-extraer posiciones de palabras en paralelo con el render
            const [, pdfWords] = await Promise.all([
                page.render({ canvasContext: ctx, viewport }).promise,
                extractPageWordPositions(page, SCALE),
            ]);
            pdfWordsCache.current.set(pageNum, pdfWords);
            console.log('[HL] Página renderizada. viewportWidth:', viewport.width, '| palabras cacheadas:', pdfWords.length);

            setPageImage(canvas.toDataURL('image/jpeg', 0.92));
        } catch (e) {
            console.error('Error rendering PDF page:', e);
        } finally {
            setLoading(false);
        }
    };

    // Actualizar highlight box cuando cambia la palabra activa
    useEffect(() => {
        console.log('[HL] wordInfo:', currentWordInfo, '| isPlaying:', isPlaying, '| positions:', spokenWordPositions.length, '| containerW:', containerWidth);
        if (!isPlaying || !currentWordInfo || spokenWordPositions.length === 0) {
            setHighlightBox(null);
            return;
        }
        const spoken = preprocessSpokenText(currentPageText || '');
        const wordIdx = wordIndexFromCharIndex(spoken, currentWordInfo.charIndex);
        const pos = spokenWordPositions[wordIdx] ?? null;
        console.log('[HL] wordIdx:', wordIdx, '| pos:', pos);
        setHighlightBox(pos);
    }, [currentWordInfo, isPlaying, spokenWordPositions, currentPageText]);

    const scale = containerWidth > 0 ? containerWidth / viewportWidth : 1;
    const hasNote = !!pageNotes[currentPdfPage.toString()];

    return (
        <View style={styles.container}>
            {/* Barra: número de página + botón nota */}
            <View style={[styles.topBar, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                <View style={styles.topBarLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                        <ArrowLeft size={20} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.pageLabel, { color: colors.secondaryText }]}>
                        Página {currentPdfPage}{totalPages > 0 ? ` / ${totalPages}` : ''}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => openPageNoteModal(currentPdfPage)}
                    style={[styles.noteBtn, { backgroundColor: hasNote ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
                >
                    <StickyNote size={14} color={hasNote ? '#FFF' : colors.tint} />
                    <Text style={[styles.noteBtnText, { color: hasNote ? '#FFF' : colors.tint }]}>
                        {hasNote ? 'Ver nota' : 'Agregar nota'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Página renderizada + overlay */}
            <ScrollView
                contentContainerStyle={[styles.canvasArea, { backgroundColor: isDark ? '#000' : '#888' }]}
                showsVerticalScrollIndicator={false}
                onLayout={(e) => {
                    // padding: 12 a cada lado → ancho real de la imagen
                    const w = e.nativeEvent.layout.width - 24;
                    console.log('[HL] ScrollView layout width:', w);
                    setContainerWidth(w);
                }}
            >
                {loading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator size="large" color={colors.tint} />
                    </View>
                ) : pageImage ? (
                    <View style={[styles.imageWrapper, { aspectRatio }]}>
                        <Image
                            source={{ uri: pageImage }}
                            style={StyleSheet.absoluteFill}
                            resizeMode="contain"
                        />
                        {/* Rectángulo de highlight sobre la palabra actual */}
                        {highlightBox && containerWidth > 0 && (
                            <View
                                pointerEvents="none"
                                style={[
                                    styles.wordOverlay,
                                    {
                                        left: highlightBox.x * scale - 3,
                                        top: highlightBox.y * scale - 2,
                                        width: highlightBox.w * scale + 6,
                                        height: highlightBox.h * scale + 4,
                                    }
                                ]}
                            />
                        )}
                    </View>
                ) : null}
            </ScrollView>

            {/* Modal de nota por página */}
            <Modal
                visible={showPageNoteModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPageNoteModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalBox, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Nota — Página {selectedPdfPage}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPageNoteModal(false)}>
                                <X size={20} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.noteInput, {
                                color: colors.text,
                                borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
                                backgroundColor: isDark ? '#2C2C2E' : '#F9F9F9',
                            }]}
                            multiline
                            placeholder="Escribí tu nota aquí..."
                            placeholderTextColor={colors.secondaryText}
                            value={tempPageNote}
                            onChangeText={setTempPageNote}
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            {selectedPdfPage !== null && pageNotes[selectedPdfPage.toString()] && (
                                <TouchableOpacity
                                    onPress={() => { if (selectedPdfPage !== null) deletePageNote(selectedPdfPage); setShowPageNoteModal(false); }}
                                    style={styles.deleteBtn}
                                >
                                    <Trash2 size={16} color="#FF3B30" />
                                    <Text style={styles.deleteBtnText}>Eliminar</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={savePageNote}
                                style={[styles.saveBtn, { backgroundColor: colors.tint }]}
                            >
                                <Text style={styles.saveBtnText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    },
    topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    backBtn: { padding: 4 },
    pageLabel: { fontSize: 13 },
    noteBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    },
    noteBtnText: { fontSize: 13, fontWeight: '600' },
    canvasArea: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 12 },
    loaderWrap: { paddingVertical: 80 },
    imageWrapper: {
        alignSelf: 'stretch',
        position: 'relative',
    },
    wordOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 214, 0, 0.45)',
        borderRadius: 3,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 180, 0, 0.7)',
    },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 16, fontWeight: '700' },
    noteInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 120, textAlignVertical: 'top', marginBottom: 16 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FF3B30' },
    deleteBtnText: { color: '#FF3B30', fontWeight: '600' },
    saveBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
