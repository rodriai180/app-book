import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Animated, Share, Modal, Alert, KeyboardAvoidingView, Platform, PanResponder } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Search, X, ChevronUp, ChevronDown, Heart, Share2, StickyNote, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AudioService } from '../src/services/AudioService';
import { BookService } from '../src/services/bookService';
import { useAuth } from '../src/services/authContext';
import { useTheme } from '../src/services/themeContext';
import { useSettings } from '../src/services/settingsContext';
import ReaderSkeleton from '../components/ReaderSkeleton';

interface SearchMatch {
    paragraphIndex: number;
    startIndex: number;
}

// Note Bubble component with Swipe-to-Delete
const NoteBubble = ({ text, isDark, colors, onEdit, onDelete }: any) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only take control if swiping horizontally
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                // Only allow swiping left (negative dx)
                if (gestureState.dx < 0) {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -80) {
                    // Stay open if swiped far enough
                    Animated.spring(translateX, {
                        toValue: -70,
                        useNativeDriver: true,
                    }).start();
                } else {
                    // Snap back
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.noteWrapper}>
            <TouchableOpacity
                style={styles.deleteNoteAction}
                onPress={onDelete}
            >
                <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.noteContainer,
                    {
                        backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                        borderLeftColor: colors.tint,
                        transform: [{ translateX }]
                    }
                ]}
            >
                <TouchableOpacity onPress={onEdit} activeOpacity={0.8} style={styles.noteContentArea}>
                    <Text style={[styles.noteTextDisplay, { color: isDark ? '#E5E5EA' : '#3A3A3C' }]}>
                        {text}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default function ReaderScreen() {
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const router = useRouter();
    const { user } = useAuth();
    const { bookId, title } = useLocalSearchParams<{ bookId: string; title: string }>();
    const [pages, setPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [viewHeight, setViewHeight] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const pageLayouts = useRef<{ [key: number]: number }>({});
    const savedBookId = useRef<string>(bookId || '');

    // Search state
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const searchInputRef = useRef<TextInput>(null);
    const headerAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Favorites & Notes state
    const [favorites, setFavorites] = useState<number[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [tempNote, setTempNote] = useState('');
    const [visibleNotes, setVisibleNotes] = useState<Record<string, boolean>>({});

    // Compute all matches whenever query or pages change
    const matches = useMemo<SearchMatch[]>(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const q = searchQuery.toLowerCase();
        const result: SearchMatch[] = [];
        pages.forEach((text, paragraphIndex) => {
            const lower = text.toLowerCase();
            let startIndex = 0;
            while (true) {
                const found = lower.indexOf(q, startIndex);
                if (found === -1) break;
                result.push({ paragraphIndex, startIndex: found });
                startIndex = found + 1;
            }
        });
        return result;
    }, [searchQuery, pages]);

    // Reset current match when matches change
    useEffect(() => {
        setCurrentMatchIndex(0);
    }, [matches.length, searchQuery]);

    // Auto-scroll to current match paragraph
    useEffect(() => {
        if (matches.length === 0 || !searchVisible) return;
        const match = matches[currentMatchIndex];
        if (!match) return;
        const y = pageLayouts.current[match.paragraphIndex];
        if (y !== undefined && viewHeight > 0) {
            const targetScroll = Math.max(0, y - (viewHeight * 0.3));
            scrollViewRef.current?.scrollTo({ y: targetScroll, animated: true });
        }
    }, [currentMatchIndex, matches, searchVisible, viewHeight]);

    // Focus search input when search becomes visible
    useEffect(() => {
        if (searchVisible) {
            // Small delay to let the component mount
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [searchVisible]);

    // Smooth header hide/show on playback
    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: isPlaying ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isPlaying]);

    // Animate progress bar
    useEffect(() => {
        if (pages.length > 0) {
            const progress = (currentPage + 1) / pages.length;
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 400,
                useNativeDriver: false, // width/flex don't support native driver mostly
            }).start();
        }
    }, [currentPage, pages.length]);

    const toggleSearch = () => {
        if (searchVisible) {
            setSearchVisible(false);
            setSearchQuery('');
            setCurrentMatchIndex(0);
        } else {
            // Pause playback when searching
            if (isPlaying) setIsPlaying(false);
            setSearchVisible(true);
        }
    };

    const goToNextMatch = () => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    };

    const goToPrevMatch = () => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    // Render text with highlighted matches
    const renderHighlightedText = (text: string, paragraphIndex: number) => {
        if (!searchQuery || searchQuery.length < 2) {
            return <Text>{text}</Text>;
        }

        const q = searchQuery.toLowerCase();
        const lower = text.toLowerCase();
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Find all occurrences of the query in this paragraph
        const paragraphMatches: { start: number; isActive: boolean }[] = [];
        let searchStart = 0;
        while (true) {
            const found = lower.indexOf(q, searchStart);
            if (found === -1) break;
            // Find what global match index this corresponds to
            const globalIndex = matches.findIndex(
                (m) => m.paragraphIndex === paragraphIndex && m.startIndex === found
            );
            paragraphMatches.push({
                start: found,
                isActive: globalIndex === currentMatchIndex,
            });
            searchStart = found + 1;
        }

        if (paragraphMatches.length === 0) {
            return <Text>{text}</Text>;
        }

        paragraphMatches.forEach((match, i) => {
            // Add text before this match
            if (match.start > lastIndex) {
                parts.push(
                    <Text key={`t-${paragraphIndex}-${i}`}>
                        {text.substring(lastIndex, match.start)}
                    </Text>
                );
            }
            // Add highlighted match
            parts.push(
                <Text
                    key={`h-${paragraphIndex}-${i}`}
                    style={[
                        match.isActive ? styles.activeHighlight : styles.highlight,
                        {
                            backgroundColor: match.isActive ? colors.highlightActive : colors.highlight,
                            color: match.isActive ? '#FFFFFF' : '#1C1C1E' // Keep text dark for yellow highlight, white for orange
                        }
                    ]}
                >
                    {text.substring(match.start, match.start + searchQuery.length)}
                </Text>
            );
            lastIndex = match.start + searchQuery.length;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(
                <Text key={`e-${paragraphIndex}`}>
                    {text.substring(lastIndex)}
                </Text>
            );
        }

        return <Text>{parts}</Text>;
    };

    // Load book content from Firestore
    useEffect(() => {
        const loadContent = async () => {
            if (bookId && user) {
                setLoading(true);
                try {
                    const book = await BookService.getBook(user.uid, bookId);
                    if (book) {
                        setPages(book.paragraphs);
                        setCurrentPage(book.currentParagraph || 0);
                        setFavorites(book.favorites || []);
                        setNotes(book.notes || {});
                    } else {
                        setPages(['No se encontró el libro.']);
                    }
                } catch (error) {
                    console.error('Error loading book:', error);
                    setPages(['Error al cargar el libro.']);
                }
                setLoading(false);
            } else {
                // Fallback demo content
                setPages([
                    `Este es un ejemplo del contenido de un libro o documento procesado. En esta vista, el texto fluye de manera natural con márgenes generosos para una lectura cómoda.`,
                    `Esta frase en particular está resaltada en un color suave para simular que el asistente de voz la está leyendo en este preciso instante.`,
                    `El diseño busca ser minimalista y "premium", eliminando distracciones y permitiendo que te enfoques únicamente en el conocimiento. Los controles en la parte inferior te permiten manejar la velocidad y el progreso de la lectura de forma intuitiva.`
                ]);
                setLoading(false);
            }
        };

        loadContent();

        return () => {
            AudioService.stop();
        };
    }, [bookId, user]);

    // Save reading progress when currentPage changes
    useEffect(() => {
        if (user && savedBookId.current && pages.length > 0 && currentPage > 0) {
            BookService.updateReadingProgress(user.uid, savedBookId.current, currentPage)
                .catch((err) => console.warn('Could not save progress:', err));
        }
    }, [currentPage, user, pages]);

    // Auto-scroll to current paragraph (on load and during playback)
    useEffect(() => {
        if (searchVisible) return; // Don't fight with search scroll
        if (pageLayouts.current[currentPage] !== undefined && viewHeight > 0) {
            const targetScroll = Math.max(0, pageLayouts.current[currentPage] - 10); // Small 10px breathing room
            scrollViewRef.current?.scrollTo({
                y: targetScroll,
                animated: true,
            });
        }
    }, [currentPage, isPlaying, viewHeight]);

    // Initial scroll when book loads with saved progress
    useEffect(() => {
        if (!loading && currentPage > 0 && viewHeight > 0) {
            // Small delay to ensure paragraph layouts are measured
            const timer = setTimeout(() => {
                if (pageLayouts.current[currentPage] !== undefined) {
                    const targetScroll = Math.max(0, pageLayouts.current[currentPage] - 10);
                    scrollViewRef.current?.scrollTo({
                        y: targetScroll,
                        animated: true,
                    });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [loading, viewHeight]);

    // Playback engine
    useEffect(() => {
        if (!isPlaying || pages.length === 0) {
            AudioService.stop();
            return;
        }

        let isMounted = true;

        const playCurrentPage = async () => {
            await AudioService.speak(pages[currentPage], {
                rate: settings.rate,
                pitch: settings.pitch,
                language: settings.language,
                voice: settings.voice,
                onDone: () => {
                    if (isMounted) {
                        if (currentPage < pages.length - 1) {
                            // Add a small natural pause between paragraphs
                            setTimeout(() => {
                                if (isMounted) setCurrentPage(prev => prev + 1);
                            }, 500);
                        } else {
                            setIsPlaying(false);
                        }
                    }
                },
                onError: () => {
                    if (isMounted) setIsPlaying(false);
                }
            });
        };

        playCurrentPage();

        return () => {
            isMounted = false;
            AudioService.stop();
        };
    }, [isPlaying, currentPage, settings.rate, settings.pitch, settings.voice, settings.language, pages]);

    const handleTogglePlayback = useCallback(() => {
        if (pages.length === 0) return;
        // Close search when starting playback
        if (searchVisible) {
            setSearchVisible(false);
            setSearchQuery('');
        }
        setIsPlaying(prev => !prev);
    }, [pages, searchVisible]);

    const handleNextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleParagraphLongPress = (index: number) => {
        setSelectedParagraph(index);
        setShowActions(true);
    };

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
    const handleParagraphPress = (index: number) => {
        if (searchVisible) return; // Don't start playback while searching
        setCurrentPage(index);
        setIsPlaying(true);
    };

    if (loading) {
        return <ReaderSkeleton />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            {/* Inline Header Row — smooth hide during playback */}
            <Animated.View style={[
                styles.headerRow,
                {
                    backgroundColor: isDark ? 'rgba(28,28,30,0.95)' : 'rgba(253,253,253,0.95)',
                    borderBottomColor: colors.border,
                    opacity: headerAnim,
                    maxHeight: headerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 60],
                    }),
                    overflow: 'hidden' as const,
                },
            ]}>
                <TouchableOpacity
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }}
                    style={[styles.headerButton, { backgroundColor: colors.card }]}
                >
                    <ArrowLeft size={24} color={colors.secondaryText} />
                </TouchableOpacity>

                {/* Search bar appears inline between back and search icon */}
                {searchVisible && (
                    <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                        <Search size={16} color={colors.secondaryText} />
                        <TextInput
                            ref={searchInputRef}
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Buscar en el libro..."
                            placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCorrect={false}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <View style={styles.searchActions}>
                                <Text style={[styles.matchCounter, { color: colors.secondaryText }]}>
                                    {matches.length > 0
                                        ? `${currentMatchIndex + 1}/${matches.length}`
                                        : '0/0'}
                                </Text>
                                <TouchableOpacity
                                    onPress={goToPrevMatch}
                                    style={[styles.navButton, matches.length === 0 && styles.navButtonDisabled]}
                                    disabled={matches.length === 0}
                                >
                                    <ChevronUp size={18} color={matches.length > 0 ? colors.tint : (isDark ? '#444' : '#C7C7CC')} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={goToNextMatch}
                                    style={[styles.navButton, matches.length === 0 && styles.navButtonDisabled]}
                                    disabled={matches.length === 0}
                                >
                                    <ChevronDown size={18} color={matches.length > 0 ? colors.tint : (isDark ? '#444' : '#C7C7CC')} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    onPress={toggleSearch}
                    style={[styles.headerButton, { backgroundColor: colors.card }]}
                >
                    {searchVisible ? (
                        <X size={22} color={colors.tint} />
                    ) : (
                        <Search size={22} color={colors.secondaryText} />
                    )}
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}
            >
                {pages.map((pageText, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onLayout={(event) => {
                            pageLayouts.current[index] = event.nativeEvent.layout.y;
                        }}
                        onPress={() => handleParagraphPress(index)}
                        onLongPress={() => handleParagraphLongPress(index)}
                        style={[
                            styles.sectionWrapper,
                            !searchVisible && index === currentPage && (
                                isPlaying
                                    ? [styles.activeSection, { backgroundColor: isDark ? 'rgba(77, 159, 255, 0.12)' : 'rgba(0, 122, 255, 0.06)' }]
                                    : [styles.resumeSection, { backgroundColor: isDark ? 'rgba(77, 159, 255, 0.12)' : 'rgba(0, 122, 255, 0.06)', borderLeftColor: colors.tint }]
                            ),
                            // Highlight paragraph that contains the active match
                            searchVisible && matches.length > 0 && matches[currentMatchIndex]?.paragraphIndex === index && [styles.searchActiveSection, { backgroundColor: isDark ? 'rgba(255, 235, 59, 0.1)' : '#FFFDE7' }],
                        ]}
                    >
                        <View style={styles.paragraphHeader}>
                            {favorites.includes(index) && (
                                <Heart size={14} color="#FF3B30" fill="#FF3B30" style={styles.favIcon} />
                            )}
                            {notes[index.toString()] && (
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        toggleNoteVisibility(index);
                                    }}
                                >
                                    <View style={[styles.noteIconBadge, visibleNotes[index.toString()] && { backgroundColor: colors.tint }]}>
                                        <StickyNote size={14} color={visibleNotes[index.toString()] ? "#FFFFFF" : colors.tint} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        {pageText.startsWith('--- ') ? (
                            <View style={styles.pageDividerContainer}>
                                <View style={[styles.pageDividerLine, { backgroundColor: isDark ? '#444' : '#DDD' }]} />
                                <View style={styles.pageDividerDot} />
                                <View style={[styles.pageDividerLine, { backgroundColor: isDark ? '#444' : '#DDD' }]} />
                            </View>
                        ) : (
                            <Text style={[
                                styles.paragraph,
                                { color: colors.text },
                                pageText.startsWith('# ') ? [styles.headerH1, { color: colors.tint }] : null,
                                pageText.startsWith('## ') ? styles.headerH2 : null,
                                !searchVisible ? (
                                    index === currentPage
                                        ? { color: colors.tint, fontWeight: '700' }
                                        : { color: colors.text, opacity: isDark ? 0.35 : 0.45 }
                                ) : { color: colors.text, opacity: 0.4 },
                            ]}>
                                {searchVisible
                                    ? renderHighlightedText(pageText.replace(/^#+\s+/g, ''), index)
                                    : pageText.replace(/^#+\s+/g, '')
                                }
                            </Text>
                        )}
                        {notes[index.toString()] && visibleNotes[index.toString()] && (
                            <NoteBubble
                                text={notes[index.toString()]}
                                isDark={isDark}
                                colors={colors}
                                onEdit={() => {
                                    setSelectedParagraph(index);
                                    setTempNote(notes[index.toString()]);
                                    setShowNoteModal(true);
                                }}
                                onDelete={() => deleteNote(index)}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Visual Progress Bar */}
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

            <View style={[styles.controlsContainer, {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
            }]}>
                <View style={styles.mainControls}>
                    <TouchableOpacity
                        style={[styles.controlButton, currentPage === 0 && styles.disabledButton]}
                        onPress={handlePrevPage}
                        disabled={currentPage === 0}
                    >
                        <SkipBack
                            size={28}
                            color={currentPage === 0 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                            fill={currentPage === 0 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                        />
                    </TouchableOpacity>

                    <View style={styles.centerGroup}>
                        <TouchableOpacity
                            style={[styles.playButton, { backgroundColor: colors.tint }]}
                            onPress={handleTogglePlayback}
                        >
                            {isPlaying ? (
                                <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
                            ) : (
                                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                            )}
                        </TouchableOpacity>

                        <View style={[styles.speedBadge, { backgroundColor: colors.card }]}>
                            <Text style={[styles.speedText, { color: colors.secondaryText }]}>{settings.rate}x</Text>
                        </View>
                    </View>

                    <View style={styles.rightGroup}>
                        <View style={[styles.progressBadge, { backgroundColor: colors.card }]}>
                            <Text style={[styles.progressText, { color: colors.secondaryText }]}>
                                {pages.length > 0 ? Math.round(((currentPage + 1) / pages.length) * 100) : 0}%
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.controlButton, currentPage === pages.length - 1 && styles.disabledButton]}
                            onPress={handleNextPage}
                            disabled={currentPage === pages.length - 1}
                        >
                            <SkipForward
                                size={28}
                                color={currentPage === pages.length - 1 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                                fill={currentPage === pages.length - 1 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Actions Modal */}
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

            {/* Note Modal */}
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
                            placeholder="Escribe tu nota aquí..."
                            placeholderTextColor={isDark ? '#555' : '#8E8E93'}
                            multiline
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#8E8E93',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 8,
        zIndex: 10,
        borderBottomWidth: 0.5,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
        height: 40,
    },
    searchActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    matchCounter: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        marginRight: 4,
        minWidth: 32,
        textAlign: 'center',
    },
    navButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    // Highlights
    highlight: {
        borderRadius: 2,
    },
    activeHighlight: {
        fontWeight: '600',
        borderRadius: 2,
    },
    searchActiveSection: {
    },
    // Progress bar styles
    progressBarTrack: {
        height: 4,
        backgroundColor: '#E5E5EA',
        width: '100%',
        position: 'absolute',
        bottom: 72, // Just above controlsContainer
        left: 0,
        zIndex: 5,
    },
    progressBarFill: {
        height: '100%',
    },
    // Content
    contentContainer: {
        padding: 20,
        paddingTop: 5,
        paddingBottom: 150,
    },
    sectionWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 8,
    },
    activeSection: {
        backgroundColor: 'rgba(0,122,255,0.08)',
    },
    resumeSection: {
        backgroundColor: 'rgba(0,122,255,0.08)',
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    paragraph: {
        fontSize: 19,
        lineHeight: 28,
        fontFamily: 'System',
    },
    headerH1: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 40,
        marginTop: 30,
        marginBottom: 20,
        textAlign: 'center',
    },
    headerH2: {
        fontSize: 26,
        fontWeight: '800',
        lineHeight: 34,
        marginTop: 25,
        marginBottom: 12,
    },
    pageDividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        gap: 15,
    },
    pageDividerLine: {
        height: 1,
        flex: 1,
        maxWidth: 100,
        opacity: 0.3,
    },
    pageDividerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8E8E93',
        opacity: 0.5,
    },
    activeText: {
        fontWeight: '600',
    },
    resumeText: {
        fontWeight: '600',
    },
    inactiveText: {
    },
    controlsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    speedBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    speedText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8E8E93',
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    centerGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    playButton: {
        backgroundColor: '#007AFF',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBadge: {
        backgroundColor: '#E6F4FE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#007AFF',
    },
    controlButton: {
        padding: 10,
    },
    disabledButton: {
        opacity: 0.2,
    },
    // Annotations
    paragraphHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 6,
        marginBottom: 4,
    },
    favIcon: {
        marginLeft: 4,
    },
    noteIcon: {
        marginLeft: 4,
    },
    noteIconBadge: {
        padding: 4,
        borderRadius: 8,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    actionsMenu: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    actionsTitle: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    actionLabel: {
        fontSize: 17,
        fontWeight: '500',
    },
    noteModalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '70%',
    },
    noteModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    noteModalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    noteInput: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    saveNoteButton: {
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveNoteText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    noteTextDisplay: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    noteWrapper: {
        marginTop: 10,
        position: 'relative',
        justifyContent: 'center',
    },
    deleteNoteAction: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 70,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteContainer: {
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 3,
    },
    noteContentArea: {
        width: '100%',
    },
});
