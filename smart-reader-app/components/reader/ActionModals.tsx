import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Heart, StickyNote, Share2, X } from 'lucide-react-native';

interface ActionModalsProps {
    colors: any;
    isDark: boolean;
    showActions: boolean;
    setShowActions: (v: boolean) => void;
    showNoteModal: boolean;
    setShowNoteModal: (v: boolean) => void;
    selectedParagraph: number | null;
    favorites: number[];
    notes: Record<string, string>;
    tempNote: string;
    setTempNote: (t: string) => void;
    toggleFavorite: () => void;
    handleShare: () => void;
    openNoteModal: () => void;
    saveNote: () => void;
}

export const ActionModals = ({
    colors,
    isDark,
    showActions,
    setShowActions,
    showNoteModal,
    setShowNoteModal,
    selectedParagraph,
    favorites,
    notes,
    tempNote,
    setTempNote,
    toggleFavorite,
    handleShare,
    openNoteModal,
    saveNote,
}: ActionModalsProps) => {
    return (
        <>
            <Modal
                visible={showActions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowActions(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowActions(false)}
                >
                    <View style={[styles.actionsMenu, { backgroundColor: colors.background }]}>
                        <Text style={[styles.actionsTitle, { color: colors.secondaryText }]}>Opciones de párrafo</Text>

                        <TouchableOpacity style={styles.actionItem} onPress={toggleFavorite}>
                            <Heart
                                size={22}
                                color={selectedParagraph !== null && favorites.includes(selectedParagraph) ? "#FF3B30" : colors.secondaryText}
                                fill={selectedParagraph !== null && favorites.includes(selectedParagraph) ? "#FF3B30" : "transparent"}
                            />
                            <Text style={[styles.actionLabel, { color: colors.text }]}>
                                {selectedParagraph !== null && favorites.includes(selectedParagraph) ? 'Quitar favorito' : 'Marcar favorito'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={openNoteModal}>
                            <StickyNote size={22} color={colors.secondaryText} />
                            <Text style={[styles.actionLabel, { color: colors.text }]}>
                                {selectedParagraph !== null && notes[selectedParagraph.toString()] ? 'Editar nota' : 'Añadir nota'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
                            <Share2 size={22} color={colors.secondaryText} />
                            <Text style={[styles.actionLabel, { color: colors.text }]}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showNoteModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowNoteModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.noteModalContainer, { backgroundColor: colors.background }]}>
                        <View style={styles.noteModalHeader}>
                            <Text style={[styles.noteModalTitle, { color: colors.text }]}>Nota</Text>
                            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                                <X size={24} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.noteInput, { color: colors.text, backgroundColor: colors.card }]}
                            multiline
                            placeholder="Escribe tu nota aquí..."
                            placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                            value={tempNote}
                            onChangeText={setTempNote}
                            autoFocus
                        />
                        <TouchableOpacity
                            style={[styles.saveNoteButton, { backgroundColor: colors.tint }]}
                            onPress={saveNote}
                        >
                            <Text style={styles.saveNoteText}>Guardar Nota</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsMenu: {
        width: '80%',
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    actionsTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 20,
        textAlign: 'center',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    actionLabel: {
        fontSize: 17,
        marginLeft: 15,
        fontWeight: '500',
    },
    noteModalContainer: {
        width: '90%',
        maxHeight: '70%',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    noteModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    noteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    noteInput: {
        height: 150,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    saveNoteButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveNoteText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
