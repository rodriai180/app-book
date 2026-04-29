import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    useWindowDimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bookmark, ChevronLeft } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useSettings } from '../src/services/settingsContext';
import { useAuth } from '../src/services/authContext';
import {
    saveMicrolearning, unsaveMicrolearning, getSavedMicrolearnings,
} from '../src/services/bookContentService';
import GeneratedCover from '../src/components/GeneratedCover';
import { getFeed } from '../src/services/microlearningStore';
import { MicrolearningData } from '../src/models/BookModels';


function speakOne(
    text: string,
    rate: number,
    lang: string,
    onDone: () => void,
    onBoundary?: (charIndex: number, charLength: number) => void,
): () => void {
    let cancelled = false;
    let fired = false;
    const done = () => { if (!fired && !cancelled) { fired = true; onDone(); } };

    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).speechSynthesis) {
        const synth = (window as any).speechSynthesis as SpeechSynthesis;
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;
        utt.rate = rate;
        utt.pitch = 1.0;

        const voices: SpeechSynthesisVoice[] = synth.getVoices();
        const prefix = lang.split('-')[0].toLowerCase();
        const candidates = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
        if (candidates.length > 0) {
            const scored = candidates.map(v => {
                const n = v.name.toLowerCase();
                let s = 0;
                if (n.includes('google')) s += 40;
                if (!v.localService) s += 20;
                if (n.includes('natural') || n.includes('neural')) s += 25;
                if (v.lang.toLowerCase() === lang.toLowerCase()) s += 10;
                return { v, s };
            });
            scored.sort((a, b) => b.s - a.s);
            utt.voice = scored[0].v;
        }

        let wordTimer: ReturnType<typeof setTimeout> | null = null;
        let usedRealEvents = false;

        if (onBoundary) {
            // Pre-compute word positions for timer fallback
            const words = text.split(/\s+/).filter(w => w.length > 0);
            const offsets: number[] = [];
            let sp = 0;
            for (const w of words) {
                const idx = text.indexOf(w, sp);
                offsets.push(idx >= 0 ? idx : sp);
                sp = (idx >= 0 ? idx : sp) + w.length;
            }
            const msPerChar = 58 / rate;
            const LEAD_MS = 100;

            utt.onstart = () => {
                const wordMs: number[] = [];
                let cum = 0;
                for (let i = 0; i < words.length; i++) {
                    wordMs.push(cum);
                    let ms = Math.max(60, words[i].length * msPerChar);
                    const last = words[i][words[i].length - 1];
                    if (/[.!?]/.test(last)) ms += 600 / rate;
                    else if (/[,;:]/.test(last)) ms += 300 / rate;
                    cum += ms;
                }
                let wIdx = 0;
                const startTime = Date.now();
                const schedule = () => {
                    if (usedRealEvents || wIdx >= words.length) return;
                    onBoundary!(offsets[wIdx], words[wIdx].length);
                    wIdx++;
                    if (wIdx >= words.length) return;
                    const elapsed = Date.now() - startTime;
                    wordTimer = setTimeout(schedule, Math.max(10, wordMs[wIdx] - elapsed - LEAD_MS));
                };
                schedule();
            };

            utt.onboundary = (event: SpeechSynthesisEvent) => {
                if (event.name !== 'word') return;
                if (!usedRealEvents) { usedRealEvents = true; if (wordTimer) clearTimeout(wordTimer); }
                onBoundary!(event.charIndex, (event as any).charLength ?? 0);
            };
        }

        utt.onend = () => { if (wordTimer) clearTimeout(wordTimer); done(); };
        utt.onerror = (e: any) => {
            if (wordTimer) clearTimeout(wordTimer);
            if (e.error === 'interrupted' || e.error === 'canceled') return;
            done();
        };
        synth.speak(utt);
        return () => { cancelled = true; if (wordTimer) clearTimeout(wordTimer); synth.cancel(); };
    } else {
        Speech.speak(text, {
            language: lang,
            rate,
            onDone: done,
            onError: () => done(),
            onBoundary: onBoundary
                ? (e: any) => onBoundary(e.charIndex, e.charLength ?? 0)
                : undefined,
        });
        return () => { cancelled = true; Speech.stop().catch(() => {}); };
    }
}

export default function MicrolearningDetailScreen() {
    const router = useRouter();
    const { settings } = useSettings();
    const { user } = useAuth();
    const { width: winWidth, height: winHeight } = useWindowDimensions();
    const [containerSize, setContainerSize] = useState({ width: winWidth, height: winHeight });
    const { width, height } = containerSize;

    const { items, startIndex } = getFeed();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [highlightRange, setHighlightRange] = useState<{ start: number; length: number } | null>(null);

    const playingIdRef = useRef<string | null>(null);
    const tokenRef = useRef<{ active: boolean }>({ active: false });
    const cancelSpeakRef = useRef<(() => void) | null>(null);
    const listRef = useRef<FlatList>(null);

    // Layout dinámico
    const HEADER_CLEARANCE = 70;
    const FOOTER_CLEARANCE = 58;
    const ICON_H = 145;
    const TITLE_H = 46;
    const REFLECTION_H = 60;
    const GAP = 16;
    const PHRASE_LINE_H = 26;

    const topAlignedPadding = HEADER_CLEARANCE;
    const phraseTop = HEADER_CLEARANCE + ICON_H + TITLE_H + GAP;

    const stopTTS = () => {
        tokenRef.current.active = false;
        if (cancelSpeakRef.current) { cancelSpeakRef.current(); cancelSpeakRef.current = null; }
        playingIdRef.current = null;
        setPlayingId(null);
        setHighlightRange(null);
    };

    useEffect(() => {
        if (user) {
            getSavedMicrolearnings(user.uid).then(saved =>
                setSavedIds(new Set(saved.map(m => m.id!)))
            );
        }
        return () => stopTTS();
    }, []);

    const handlePlay = (item: MicrolearningData) => {
        if (playingIdRef.current === item.id) { stopTTS(); return; }
        stopTTS();
        const token = { active: true };
        tokenRef.current = token;
        playingIdRef.current = item.id!;
        setPlayingId(item.id!);
        setHighlightRange(null);

        const speakContent = () => {
            cancelSpeakRef.current = speakOne(
                item.content ?? '',
                settings.rate,
                settings.language,
                () => {
                    if (!token.active) return;
                    setHighlightRange(null);
                    if (item.reflectionQuestion) {
                        cancelSpeakRef.current = speakOne(
                            item.reflectionQuestion,
                            settings.rate,
                            settings.language,
                            () => { if (token.active) { playingIdRef.current = null; setPlayingId(null); } },
                        );
                    } else {
                        playingIdRef.current = null;
                        setPlayingId(null);
                    }
                },
                (charIndex, charLength) => {
                    if (token.active) setHighlightRange({ start: charIndex, length: charLength });
                },
            );
        };
        speakContent();
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

        const content = item.content ?? '';
        const charsPerLine = Math.floor((width - 56) / 10);
        const contentLines = Math.ceil(content.length / charsPerLine);
        const neededH = Math.max(PHRASE_LINE_H * 3, contentLines * PHRASE_LINE_H);

        const reflectionReserve = item.reflectionQuestion ? REFLECTION_H + GAP : 0;
        const itemPhraseBottom = FOOTER_CLEARANCE + GAP + reflectionReserve;
        const availableH = height - phraseTop - itemPhraseBottom;

        const fits = neededH <= availableH;
        const phraseAreaH = fits ? neededH : availableH;
        const displayLines = fits ? 0 : Math.max(3, Math.floor(availableH / PHRASE_LINE_H));
        const reflectionTop = phraseTop + phraseAreaH + GAP;

        return (
            <View style={{ width, height }}>
                <TouchableOpacity onPress={() => handlePlay(item)} activeOpacity={0.9} style={{ flex: 1 }}>
                    <GeneratedCover
                        type="microlearning"
                        title={item.title}
                        category={item.category}
                        tags={item.tags ?? []}
                        topAligned
                        topAlignedPadding={topAlignedPadding}
                        style={{ flex: 1 }}
                    />

                    <View style={[styles.phraseOverlay, { top: phraseTop, height: phraseAreaH }]}>
                        <Text style={styles.phraseText} numberOfLines={displayLines || undefined} ellipsizeMode={displayLines ? 'tail' : undefined}>
                            {isPlaying && highlightRange && highlightRange.start >= 0
                                ? <>
                                    {content.slice(0, highlightRange.start)}
                                    <Text style={styles.highlightWord}>
                                        {content.slice(highlightRange.start, highlightRange.start + highlightRange.length)}
                                    </Text>
                                    {content.slice(highlightRange.start + highlightRange.length)}
                                </>
                                : content
                            }
                        </Text>
                    </View>

                    {item.reflectionQuestion ? (
                        <View style={[styles.reflectionOverlay, { top: reflectionTop }]} pointerEvents="none">
                            <Text style={styles.reflectionText} numberOfLines={3}>
                                {item.reflectionQuestion}
                            </Text>
                        </View>
                    ) : null}
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
        <SafeAreaView
            style={styles.root}
            edges={['bottom']}
            onLayout={e => setContainerSize({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
            })}
        >
            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                renderItem={renderItem}
                extraData={{ playingId, highlightRange, savedIds }}
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

    phraseOverlay: {
        position: 'absolute',
        left: 28,
        right: 28,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    phraseText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 26,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8,
    },
    highlightWord: {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        borderRadius: 4,
    },

    reflectionOverlay: {
        position: 'absolute',
        left: 28,
        right: 28,
        // top se inyecta dinámicamente
    },
    reflectionText: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        lineHeight: 19,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

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

    topBar: {
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
    bookTitleBtn: {
        flex: 1,
        height: 36,
        justifyContent: 'center',
    },
    bookTitleText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});
