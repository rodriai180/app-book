import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bookmark, ChevronLeft } from 'lucide-react-native';
import { AudioService } from '../src/services/AudioService';
import { useSettings } from '../src/services/settingsContext';
import { useAuth } from '../src/services/authContext';
import {
    saveMicrolearning, unsaveMicrolearning, getSavedMicrolearnings,
} from '../src/services/bookContentService';
import GeneratedCover from '../src/components/GeneratedCover';
import { getFeed } from '../src/services/microlearningStore';
import { MicrolearningData } from '../src/models/BookModels';

type Boundary = { charIndex: number; charLength: number };

export default function MicrolearningDetailScreen() {
    const router = useRouter();
    const { settings } = useSettings();
    const { user } = useAuth();
    const { width, height } = useWindowDimensions();

    const { items, startIndex } = getFeed();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [boundary, setBoundary] = useState<Boundary | null>(null);
    const playingIdRef = useRef<string | null>(null);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        if (user) {
            getSavedMicrolearnings(user.uid).then(saved =>
                setSavedIds(new Set(saved.map(m => m.id!)))
            );
        }
        return () => AudioService.stop();
    }, []);

    const stopTTS = () => {
        AudioService.stop();
        playingIdRef.current = null;
        setPlayingId(null);
        setBoundary(null);
    };

    const handlePlay = (item: MicrolearningData) => {
        if (playingIdRef.current === item.id) {
            stopTTS();
            return;
        }
        stopTTS();
        playingIdRef.current = item.id!;
        setPlayingId(item.id!);
        const text = [
            item.title,
            item.content,
            item.reflectionQuestion ? `Pregunta de reflexión: ${item.reflectionQuestion}` : '',
        ].filter(Boolean).join('. ');
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onBoundary: setBoundary,
            onDone: () => { playingIdRef.current = null; setPlayingId(null); setBoundary(null); },
            onError: () => { playingIdRef.current = null; setPlayingId(null); setBoundary(null); },
        });
    };

    const toggleSave = async (mlId: string) => {
        if (!user) return;
        const isSaved = savedIds.has(mlId);
        setSavedIds(prev => {
            const next = new Set(prev);
            isSaved ? next.delete(mlId) : next.add(mlId);
            return next;
        });
        try {
            isSaved
                ? await unsaveMicrolearning(user.uid, mlId)
                : await saveMicrolearning(user.uid, mlId);
        } catch {
            setSavedIds(prev => {
                const next = new Set(prev);
                isSaved ? next.add(mlId) : next.delete(mlId);
                return next;
            });
        }
    };

    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isPlaying = playingId === item.id;
        const isSaved = savedIds.has(item.id!);

        const b = isPlaying ? boundary : null;
        const contentOffset = item.title.length + 2;
        const questionOffset = contentOffset + (item.content?.length ?? 0) + 2 + 'Pregunta de reflexión: '.length;
        const titleHL = b && b.charIndex < item.title.length
            ? { start: b.charIndex, length: b.charLength }
            : { start: -1, length: 0 };
        const contentHL = b && b.charIndex >= contentOffset && b.charIndex < contentOffset + (item.content?.length ?? 0)
            ? { start: b.charIndex - contentOffset, length: b.charLength }
            : { start: -1, length: 0 };
        const questionHL = b && item.reflectionQuestion && b.charIndex >= questionOffset
            ? { start: b.charIndex - questionOffset, length: b.charLength }
            : { start: -1, length: 0 };

        return (
            <View style={{ width, height }}>
                <TouchableOpacity onPress={() => handlePlay(item)} activeOpacity={0.9} style={{ flex: 1 }}>
                    <GeneratedCover
                        type="microlearning"
                        title={item.title}
                        category={item.category}
                        tags={item.tags ?? []}
                        content={item.content}
                        reflectionQuestion={item.reflectionQuestion}
                        titleHighlight={titleHL}
                        contentHighlight={contentHL}
                        questionHighlight={questionHL}
                        style={{ flex: 1 }}
                    />
                </TouchableOpacity>

                <View style={styles.footer} pointerEvents="box-none">
                    <TouchableOpacity
                        style={styles.chapterLink}
                        onPress={() => router.push({
                            pathname: '/chapter-detail',
                            params: { bookId: item.bookId, chapterId: item.chapterId },
                        })}
                        activeOpacity={0.65}
                    >
                        <Text style={styles.footerChapter} numberOfLines={1}>
                            Cap. {item.chapterNumber} — {item.chapterTitle}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleSave(item.id!)} style={styles.iconBtn}>
                        <Bookmark
                            size={16}
                            color={isSaved ? '#FFF' : 'rgba(255,255,255,0.6)'}
                            fill={isSaved ? '#FFF' : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (items.length === 0) return null;

    return (
        <SafeAreaView style={styles.root} edges={['bottom']}>
            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                renderItem={renderItem}
                extraData={{ playingId, boundary, savedIds }}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                initialScrollIndex={startIndex}
                getItemLayout={(_data, index) => ({ length: height, offset: height * index, index })}
                onMomentumScrollBegin={stopTTS}
                removeClippedSubviews
            />

            <TouchableOpacity style={styles.backBtn} onPress={() => { stopTTS(); router.back(); }}>
                <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    chapterLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
    footerChapter: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)', flexShrink: 1 },
    iconBtn: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    },

    backBtn: {
        position: 'absolute',
        top: 14,
        left: 14,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
