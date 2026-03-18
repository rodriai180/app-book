import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, StickyNote } from 'lucide-react-native';
import { NoteBubble } from './NoteBubble';

interface ReaderContentProps {
    pages: string[];
    currentPage: number;
    searchVisible: boolean;
    searchQuery: string;
    matches: any[];
    currentMatchIndex: number;
    favorites: number[];
    notes: Record<string, string>;
    visibleNotes: Record<string, boolean>;
    colors: any;
    isDark: boolean;
    scrollViewRef: React.RefObject<ScrollView>;
    pageLayouts: React.MutableRefObject<{ [key: number]: number }>;
    setViewHeight: (h: number) => void;
    handleParagraphPress: (index: number) => void;
    handleParagraphLongPress: (index: number) => void;
    toggleNoteVisibility: (index: number) => void;
    deleteNote: (index: number) => void;
    openNoteModal: (index: number) => void;
    isPlaying: boolean;
}

export const ReaderContent = ({
    pages,
    currentPage,
    searchVisible,
    searchQuery,
    matches,
    currentMatchIndex,
    favorites,
    notes,
    visibleNotes,
    colors,
    isDark,
    scrollViewRef,
    pageLayouts,
    setViewHeight,
    handleParagraphPress,
    handleParagraphLongPress,
    toggleNoteVisibility,
    deleteNote,
    openNoteModal,
    isPlaying,
}: ReaderContentProps) => {

    const renderHighlightedText = (text: string, paragraphIndex: number) => {
        if (!searchQuery || searchQuery.length < 2) {
            return <Text>{text}</Text>;
        }

        const q = searchQuery.toLowerCase();
        const lower = text.toLowerCase();
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        const paragraphMatches: { start: number; isActive: boolean }[] = [];
        let searchStart = 0;
        while (true) {
            const found = lower.indexOf(q, searchStart);
            if (found === -1) break;
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
            if (match.start > lastIndex) {
                parts.push(
                    <Text key={`t-${paragraphIndex}-${i}`}>
                        {text.substring(lastIndex, match.start)}
                    </Text>
                );
            }
            parts.push(
                <Text
                    key={`h-${paragraphIndex}-${i}`}
                    style={[
                        match.isActive ? styles.activeHighlight : styles.highlight,
                        {
                            backgroundColor: match.isActive ? colors.highlightActive : colors.highlight,
                            color: match.isActive ? '#FFFFFF' : '#1C1C1E'
                        }
                    ]}
                >
                    {text.substring(match.start, match.start + searchQuery.length)}
                </Text>
            );
            lastIndex = match.start + searchQuery.length;
        });

        if (lastIndex < text.length) {
            parts.push(
                <Text key={`e-${paragraphIndex}`}>
                    {text.substring(lastIndex)}
                </Text>
            );
        }

        return <Text>{parts}</Text>;
    };

    return (
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
                    ) : (() => {
                        const isCentered = pageText.startsWith('>## ') || pageText.startsWith('># ') || pageText.startsWith('> ');
                        const isH1 = pageText.startsWith('# ') || pageText.startsWith('># ');
                        const isH2 = pageText.startsWith('## ') || pageText.startsWith('>## ') || pageText.startsWith('> ');
                        const isHeading = isH1 || isH2;
                        const cleanText = pageText.replace(/^>?#+\s+/, '').replace(/^>\s+/, '');
                        return (
                            <Text style={[
                                styles.paragraph,
                                { color: colors.text },
                                isH1 ? styles.headerH1 : null,
                                isH2 ? styles.headerH2 : null,
                                isCentered ? { textAlign: 'center' } : null,
                                !searchVisible ? (
                                    index === currentPage
                                        ? { color: colors.tint, fontWeight: '700' }
                                        : isHeading
                                            ? { color: colors.text, opacity: isDark ? 0.75 : 0.8 }
                                            : { color: colors.text, opacity: isDark ? 0.35 : 0.45 }
                                ) : { color: colors.text, opacity: 0.4 },
                            ]}>
                                {searchVisible
                                    ? renderHighlightedText(cleanText, index)
                                    : cleanText
                                }
                            </Text>
                        );
                    })()}
                    {notes[index.toString()] && visibleNotes[index.toString()] && (
                        <NoteBubble
                            text={notes[index.toString()]}
                            isDark={isDark}
                            colors={colors}
                            onEdit={() => openNoteModal(index)}
                            onDelete={() => deleteNote(index)}
                        />
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 20,
        paddingBottom: 100,
        paddingHorizontal: 24,
    },
    sectionWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    activeSection: {
        borderLeftColor: 'transparent',
    },
    resumeSection: {
        // Just borderLeftColor
    },
    searchActiveSection: {
        borderRadius: 12,
    },
    paragraph: {
        fontSize: 18,
        lineHeight: 28,
        letterSpacing: -0.2,
    },
    headerH1: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
    },
    headerH2: {
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 8,
    },
    highlight: {
        borderRadius: 4,
    },
    activeHighlight: {
        borderRadius: 4,
        fontWeight: 'bold',
    },
    paragraphHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
        marginBottom: 4,
    },
    favIcon: {
        marginRight: 8,
    },
    noteIconBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,122,255,0.1)',
    },
    pageDividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
        opacity: 0.6,
    },
    pageDividerLine: {
        height: 1,
        flex: 1,
    },
    pageDividerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#999',
        marginHorizontal: 15,
    },
});
