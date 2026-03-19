import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, ScrollView, Image, Modal,
    TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StickyNote, Trash2, X, ArrowLeft } from 'lucide-react-native';
import * as pdfjsLib from 'pdfjs-dist';

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
}

/** Calcula en qué página PDF cae el párrafo `paragraphIndex` */
export function paragraphToPdfPage(pages: string[], paragraphIndex: number): number {
    let pdfPage = 1;
    for (let i = 0; i < paragraphIndex && i < pages.length; i++) {
        if (pages[i] === '---') pdfPage++;
    }
    return pdfPage;
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
}: ReaderPdfContentProps) => {
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState(0.707);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const pdfRef = useRef<any>(null);
    const currentPdfPage = paragraphToPdfPage(pages, currentPage);

    // Cargar el PDF una sola vez
    useEffect(() => {
        if (!pdfUrl) return;
        pdfjsLib.getDocument(pdfUrl).promise
            .then(pdf => {
                pdfRef.current = pdf;
                setTotalPages(pdf.numPages);
            })
            .catch(console.error);
    }, [pdfUrl]);

    // Renderizar cuando cambia la página o se carga el PDF
    useEffect(() => {
        if (pdfRef.current && totalPages > 0) {
            renderPage(currentPdfPage);
        }
    }, [currentPdfPage, totalPages]);

    const renderPage = async (pageNum: number) => {
        if (!pdfRef.current) return;
        setLoading(true);
        try {
            const page = await pdfRef.current.getPage(pageNum);
            const scale = 1.8;
            const viewport = page.getViewport({ scale });
            setAspectRatio(viewport.width / viewport.height);

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            await page.render({ canvasContext: ctx, viewport }).promise;
            setPageImage(canvas.toDataURL('image/jpeg', 0.92));
        } catch (e) {
            console.error('Error rendering PDF page:', e);
        } finally {
            setLoading(false);
        }
    };

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

            {/* Página renderizada */}
            <ScrollView
                contentContainerStyle={[styles.canvasArea, { backgroundColor: isDark ? '#000' : '#888' }]}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator size="large" color={colors.tint} />
                    </View>
                ) : pageImage ? (
                    <Image
                        source={{ uri: pageImage }}
                        style={[styles.pageImage, { aspectRatio }]}
                        resizeMode="contain"
                    />
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
    pageImage: { width: '100%', borderRadius: 4 },
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
