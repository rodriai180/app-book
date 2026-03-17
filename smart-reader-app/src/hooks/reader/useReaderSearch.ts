import { useState, useMemo, useEffect, useRef } from 'react';
import { TextInput, Animated } from 'react-native';

interface SearchMatch {
    paragraphIndex: number;
    startIndex: number;
}

export const useReaderSearch = (pages: string[], isPlaying: boolean, setIsPlaying: (val: boolean) => void, viewHeight: number, pageLayouts: React.MutableRefObject<{ [key: number]: number }>, scrollViewRef: React.RefObject<any>) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const searchInputRef = useRef<TextInput>(null);

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

    useEffect(() => {
        setCurrentMatchIndex(0);
    }, [matches.length, searchQuery]);

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

    useEffect(() => {
        if (searchVisible) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [searchVisible]);

    const toggleSearch = () => {
        if (searchVisible) {
            setSearchVisible(false);
            setSearchQuery('');
            setCurrentMatchIndex(0);
        } else {
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

    return {
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
    };
};
