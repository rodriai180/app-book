// v2
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useAuth } from '../src/services/authContext';
import { useTheme } from '../src/services/themeContext';
import { useSettings } from '../src/services/settingsContext';
import ReaderSkeleton from '../components/ReaderSkeleton';

// Hooks
import { useReaderSearch } from '../src/hooks/reader/useReaderSearch';
import { useReaderPlayback } from '../src/hooks/reader/useReaderPlayback';
import { useReaderAnnotations } from '../src/hooks/reader/useReaderAnnotations';
import { useReaderContent } from '../src/hooks/reader/useReaderContent';
import { BookService } from '../src/services/bookService';

// Components
import { ReaderHeader } from '../components/reader/ReaderHeader';
import { ReaderContent } from '../components/reader/ReaderContent';
import { ReaderPdfContent } from '../components/reader/ReaderPdfContent';
import { ReaderControls } from '../components/reader/ReaderControls';
import { ActionModals } from '../components/reader/ActionModals';

export default function ReaderScreen() {
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const router = useRouter();
    const { user } = useAuth();
    const { bookId } = useLocalSearchParams<{ bookId: string; title: string }>();

    // Hooks Logic
    const {
        pages,
        currentPage,
        setCurrentPage,
        favorites,
        setFavorites,
        notes,
        setNotes,
        pageNotes,
        setPageNotes,
        localPdfUri,
        loading
    } = useReaderContent(user, bookId);

    // Page notes state
    const [showPageNoteModal, setShowPageNoteModal] = useState(false);
    const [tempPageNote, setTempPageNote] = useState('');
    const [selectedPdfPage, setSelectedPdfPage] = useState<number | null>(null);

    const openPageNoteModal = (pdfPage: number) => {
        setSelectedPdfPage(pdfPage);
        setTempPageNote(pageNotes[pdfPage.toString()] || '');
        setShowPageNoteModal(true);
    };

    const savePageNote = async () => {
        if (selectedPdfPage === null) return;
        const updated = { ...pageNotes };
        if (tempPageNote.trim()) {
            updated[selectedPdfPage.toString()] = tempPageNote.trim();
        } else {
            delete updated[selectedPdfPage.toString()];
        }
        setPageNotes(updated);
        setShowPageNoteModal(false);
        if (user && bookId) {
            BookService.savePageNote(user.uid, bookId, selectedPdfPage, tempPageNote).catch(() => {});
        }
    };

    const deletePageNote = (pdfPage: number) => {
        const updated = { ...pageNotes };
        delete updated[pdfPage.toString()];
        setPageNotes(updated);
        if (user && bookId) {
            BookService.savePageNote(user.uid, bookId, pdfPage, '').catch(() => {});
        }
    };
    
    // Playback Logic
    const playback = useReaderPlayback(pages, currentPage, setCurrentPage, settings);
    const { isPlaying, setIsPlaying, currentWordInfo, headerAnim, handleTogglePlayback, stopPlayback } = playback;

    // Common Refs/State needed by multiple hooks
    const [viewHeight, setViewHeight] = useState<number>(0);
    const scrollViewRef = useRef<any>(null);
    const pageLayouts = useRef<{ [key: number]: number }>({});
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Search Logic
    const search = useReaderSearch(pages, isPlaying, setIsPlaying, viewHeight, pageLayouts, scrollViewRef);
    const {
        searchVisible,
        searchQuery,
        setSearchQuery,
        currentMatchIndex,
        matches,
        searchInputRef,
        toggleSearch,
        goToNextMatch,
        goToPrevMatch,
        setSearchVisible
    } = search;

    // Annotations Logic
    const annotations = useReaderAnnotations(user, bookId, pages, favorites, setFavorites, notes, setNotes);
    const {
        selectedParagraph,
        setSelectedParagraph,
        showActions,
        setShowActions,
        showNoteModal,
        setShowNoteModal,
        tempNote,
        setTempNote,
        visibleNotes,
        toggleFavorite,
        handleShare,
        openNoteModal,
        toggleNoteVisibility,
        saveNote,
        deleteNote
    } = annotations;

    // Progress Bar Animation
    useEffect(() => {
        if (pages.length > 0) {
            const progress = (currentPage + 1) / pages.length;
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 400,
                useNativeDriver: false,
            }).start();
        }
    }, [currentPage, pages.length]);

    // Cleanup search when starting playback
    useEffect(() => {
        if (isPlaying && searchVisible) {
            setSearchVisible(false);
            setSearchQuery('');
        }
    }, [isPlaying]);

    // Paragraph Handlers
    const onParagraphPress = (index: number) => {
        if (searchVisible) return;
        setCurrentPage(index);
        setIsPlaying(true);
    };

    const onParagraphLongPress = (index: number) => {
        setSelectedParagraph(index);
        setShowActions(true);
    };

    if (loading) {
        return <ReaderSkeleton />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            {!localPdfUri && (
                <ReaderHeader
                    colors={colors}
                    isDark={isDark}
                    headerAnim={headerAnim}
                    searchVisible={searchVisible}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    matches={matches}
                    currentMatchIndex={currentMatchIndex}
                    searchInputRef={searchInputRef}
                    toggleSearch={toggleSearch}
                    goToPrevMatch={goToPrevMatch}
                    goToNextMatch={goToNextMatch}
                    onBack={() => {
                        stopPlayback();
                        if (router.canGoBack()) router.back();
                        else router.replace('/(tabs)');
                    }}
                />
            )}

            {localPdfUri ? (
                // ── Modo PDF ──────────────────────────────────────────────────
                <ReaderPdfContent
                    pdfUrl={localPdfUri}
                    pages={pages}
                    currentPage={currentPage}
                    pageNotes={pageNotes}
                    colors={colors}
                    isDark={isDark}
                    showPageNoteModal={showPageNoteModal}
                    tempPageNote={tempPageNote}
                    selectedPdfPage={selectedPdfPage}
                    setTempPageNote={setTempPageNote}
                    setShowPageNoteModal={setShowPageNoteModal}
                    openPageNoteModal={openPageNoteModal}
                    savePageNote={savePageNote}
                    deletePageNote={deletePageNote}
                    onBack={() => {
                        stopPlayback();
                        if (router.canGoBack()) router.back();
                        else router.replace('/(tabs)');
                    }}
                    isPlaying={isPlaying}
                    currentWordInfo={currentWordInfo}
                    currentPageText={pages[currentPage]}
                />
            ) : (
                // ── Modo texto: párrafos extraídos + word highlight ────────────
                <ReaderContent
                    pages={pages}
                    currentPage={currentPage}
                    searchVisible={searchVisible}
                    searchQuery={searchQuery}
                    matches={matches}
                    currentMatchIndex={currentMatchIndex}
                    favorites={favorites}
                    notes={notes}
                    visibleNotes={visibleNotes}
                    colors={colors}
                    isDark={isDark}
                    scrollViewRef={scrollViewRef}
                    pageLayouts={pageLayouts}
                    setViewHeight={setViewHeight}
                    handleParagraphPress={onParagraphPress}
                    handleParagraphLongPress={onParagraphLongPress}
                    toggleNoteVisibility={toggleNoteVisibility}
                    deleteNote={deleteNote}
                    openNoteModal={(idx) => {
                        setSelectedParagraph(idx);
                        openNoteModal();
                    }}
                    isPlaying={isPlaying}
                    currentWordInfo={currentWordInfo}
                />
            )}

            <View style={[styles.progressBarTrack, { backgroundColor: isDark ? '#333' : '#E5E5EA' }]}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            backgroundColor: colors.tint,
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]}
                />
            </View>

            <ReaderControls
                colors={colors}
                isDark={isDark}
                isPlaying={isPlaying}
                currentPage={currentPage}
                pages={pages}
                settings={settings}
                handleTogglePlayback={handleTogglePlayback}
                handlePrevPage={() => setCurrentPage(prev => Math.max(0, (prev as number) - 1))}
                handleNextPage={() => setCurrentPage(prev => Math.min(pages.length - 1, (prev as number) + 1))}
            />

            <ActionModals
                colors={colors}
                isDark={isDark}
                showActions={showActions}
                setShowActions={setShowActions}
                showNoteModal={showNoteModal}
                setShowNoteModal={setShowNoteModal}
                selectedParagraph={selectedParagraph}
                favorites={favorites}
                notes={notes}
                tempNote={tempNote}
                setTempNote={setTempNote}
                toggleFavorite={toggleFavorite}
                handleShare={handleShare}
                openNoteModal={openNoteModal}
                saveNote={saveNote}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressBarTrack: {
        height: 3,
        width: '100%',
    },
    progressBarFill: {
        height: '100%',
    },
});
