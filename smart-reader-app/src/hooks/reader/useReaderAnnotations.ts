import { useState } from 'react';
import { Share } from 'react-native';
import { BookService } from '../../services/bookService';

export const useReaderAnnotations = (user: any, bookId: string | undefined, pages: string[]) => {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [tempNote, setTempNote] = useState('');
    const [visibleNotes, setVisibleNotes] = useState<Record<string, boolean>>({});

    const toggleFavorite = async () => {
        if (selectedParagraph === null || !user || !bookId) return;
        const isFav = favorites.includes(selectedParagraph);
        try {
            await BookService.toggleFavorite(user.uid, bookId, selectedParagraph, !isFav);
            setFavorites(prev =>
                !isFav ? [...prev, selectedParagraph] : prev.filter(i => i !== selectedParagraph)
            );
            setShowActions(false);
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const handleShare = async () => {
        if (selectedParagraph === null) return;
        try {
            const textToShare = pages[selectedParagraph];
            await Share.share({
                message: textToShare,
                title: 'Compartido desde Smart Reader',
            });
            setShowActions(false);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const openNoteModal = () => {
        if (selectedParagraph === null) return;
        setTempNote(notes[selectedParagraph.toString()] || '');
        setShowActions(false);
        setShowNoteModal(true);
    };

    const toggleNoteVisibility = (index: number) => {
        setVisibleNotes(prev => ({
            ...prev,
            [index.toString()]: !prev[index.toString()]
        }));
    };

    const saveNote = async () => {
        if (selectedParagraph === null || !user || !bookId) return;
        try {
            await BookService.saveNote(user.uid, bookId, selectedParagraph, tempNote);
            setNotes(prev => ({
                ...prev,
                [selectedParagraph.toString()]: tempNote
            }));
            setShowNoteModal(false);
        } catch (err) {
            console.error('Error saving note:', err);
        }
    };

    const deleteNote = async (index: number) => {
        if (!user || !bookId) return;
        try {
            await BookService.saveNote(user.uid, bookId, index, '');
            setNotes(prev => {
                const newNotes = { ...prev };
                delete newNotes[index.toString()];
                return newNotes;
            });
            setVisibleNotes(prev => ({
                ...prev,
                [index.toString()]: false
            }));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    return {
        favorites,
        setFavorites,
        notes,
        setNotes,
        selectedParagraph,
        setSelectedParagraph,
        showActions,
        setShowActions,
        showNoteModal,
        setShowNoteModal,
        tempNote,
        setTempNote,
        visibleNotes,
        setVisibleNotes,
        toggleFavorite,
        handleShare,
        openNoteModal,
        toggleNoteVisibility,
        saveNote,
        deleteNote
    };
};
