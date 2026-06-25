import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView,
    useWindowDimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useSettings } from '../src/services/settingsContext';
import { useAuth } from '../src/services/authContext';
import {
    saveMicrolearning, unsaveMicrolearning, getSavedMicrolearnings,
    getMlSocialData, toggleMlLike,
} from '../src/services/bookContentService';
import GeneratedCover from '../src/components/GeneratedCover';
import MlCommentsModal from '../src/components/MlCommentsModal';
import { getFeed, updateFeedIndex } from '../src/services/microlearningStore';
import { MicrolearningData } from '../src/models/BookModels';
import { PrerecordedAudioService } from '../src/services/PrerecordedAudioService';


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
            const msPerChar = 70 / rate;

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
                    wordTimer = setTimeout(schedule, Math.max(10, wordMs[wIdx] - elapsed));
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

type SlideData =
    | { type: 'title' }
    | { type: 'hook'; text: string }
    | { type: 'content'; text: string }
    | { type: 'reflection'; text: string }
    | { type: 'cta' };

const CTA_TEXT = 'Dejá que el conocimiento te encuentre.';

function buildSlides(item: MicrolearningData, showCta = false): SlideData[] {
    const slides: SlideData[] = [];
    if (item.hookText?.trim()) slides.push({ type: 'hook', text: item.hookText.trim() });
    slides.push({ type: 'title' });
    const content = (item.content ?? '').trim();
    if (content) {
        const sentences = (content.match(/[^.!?]+[.!?]+/g) ?? [content])
            .map(s => s.trim())
            .filter(s => s.length > 0);
        for (const sentence of sentences) {
            slides.push({ type: 'content', text: sentence });
        }
    }
    if (item.reflectionQuestion?.trim()) {
        slides.push({ type: 'reflection', text: item.reflectionQuestion.trim() });
    }
    if (showCta) slides.push({ type: 'cta' });
    return slides;
}

function slideText(item: MicrolearningData, slide: SlideData): string {
    if (slide.type === 'title') return `${item.title}. ${item.bookTitle}, por ${item.bookAuthor}`;
    if (slide.type === 'cta') return `Nuggeto. ${CTA_TEXT}`;
    return slide.text;
}


export default function MicrolearningDetailScreen() {
    const router = useRouter();
    const { settings } = useSettings();
    const { user, isAdmin } = useAuth();
    const { width: winWidth, height: winHeight } = useWindowDimensions();
    const [containerSize, setContainerSize] = useState({ width: winWidth, height: winHeight });
    const { width, height } = containerSize;

    const { items, startIndex } = getFeed();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [highlightRange, setHighlightRange] = useState<{ start: number; length: number } | null>(null);

    type SocialEntry = { likesCount: number; commentsCount: number; liked: boolean };
    const [socialData, setSocialData] = useState<Map<string, SocialEntry>>(new Map());
    const [commentsOpenId, setCommentsOpenId] = useState<string | null>(null);

    const [slideIndexMap, setSlideIndexMap] = useState<Map<string, number>>(new Map());

    const playingIdRef = useRef<string | null>(null);
    const tokenRef = useRef<{ active: boolean }>({ active: false });
    const cancelSpeakRef = useRef<(() => void) | null>(null);
    const handlePlayRef = useRef<(item: MicrolearningData, slideIdx?: number, charOffset?: number) => void>(() => {});
    const highlightRangeRef = useRef<{ start: number; length: number } | null>(null);
    const pausedRef = useRef<{ itemId: string; slideIdx: number; charOffset: number } | null>(null);
    const isAutoScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const slideListRefs = useRef<Map<string, ScrollView>>(new Map());
    const slideTimerMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const listRef = useRef<FlatList>(null);
    const itemViewRefs = useRef<Map<string, any>>(new Map());
    const [visibleItemId, setVisibleItemId] = useState<string | null>(items[startIndex]?.id ?? null);
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            updateFeedIndex(viewableItems[0].index ?? 0);
            setVisibleItemId(viewableItems[0].item?.id ?? null);
        }
    }).current;
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const stopTTS = () => {
        tokenRef.current.active = false;
        if (cancelSpeakRef.current) { cancelSpeakRef.current(); cancelSpeakRef.current = null; }
        PrerecordedAudioService.stop();
        playingIdRef.current = null;
        setPlayingId(null);
        setHighlightRange(null);
        highlightRangeRef.current = null;
    };

    useEffect(() => {
        if (user) {
            getSavedMicrolearnings(user.uid).then(saved =>
                setSavedIds(new Set(saved.map(m => m.id!)))
            );
            Promise.all(items.map(item => getMlSocialData(user.uid, item.id!))).then(results => {
                const map = new Map<string, SocialEntry>();
                results.forEach((r, i) => map.set(items[i].id!, r));
                setSocialData(map);
            });
        }
        const item = items[startIndex] ?? items[0];
        if (item) {
            const t = setTimeout(() => {
                if (!playingIdRef.current) handlePlayRef.current(item, 0);
            }, 400);
            return () => { clearTimeout(t); stopTTS(); };
        }
        return () => stopTTS();
    }, []);

    const handleScroll = (e: any) => {
        if (isAutoScrollingRef.current) return;
        if (playingIdRef.current) stopTTS();
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        const y = e.nativeEvent.contentOffset.y;
        scrollTimerRef.current = setTimeout(() => {
            const idx = Math.round(y / height);
            const item = items[idx];
            if (item) {
                // Reset slide horizontal al 0 para el nuevo item
                const existing = slideTimerMap.current.get(item.id!);
                if (existing) clearTimeout(existing);
                slideTimerMap.current.delete(item.id!);
                setSlideIndexMap(prev => new Map(prev).set(item.id!, 0));
                slideListRefs.current.get(item.id!)?.scrollTo({ x: 0, animated: false });
                if (item.id !== playingIdRef.current) {
                    handlePlayRef.current(item, 0);
                }
            }
        }, 200);
    };

    useFocusEffect(useCallback(() => {
        return () => { stopTTS(); };
    }, []));

    const handlePlay = (item: MicrolearningData, forceSlideIdx?: number, charOffset?: number) => {
        const isForcedCall = forceSlideIdx !== undefined || charOffset !== undefined;

        // Tap on playing item → PAUSE: save position and stop
        if (playingIdRef.current === item.id && !isForcedCall) {
            const curSlide = slideIndexMap.get(item.id!) ?? 0;
            pausedRef.current = { itemId: item.id!, slideIdx: curSlide, charOffset: highlightRangeRef.current?.start ?? 0 };
            stopTTS();
            return;
        }

        // Tap on paused item → RESUME from saved position
        const paused = pausedRef.current;
        if (!isForcedCall && paused && paused.itemId === item.id) {
            pausedRef.current = null;
            handlePlayRef.current(item, paused.slideIdx, paused.charOffset);
            return;
        }

        // Swipe / auto-start → fresh start, clear any saved pause
        if (!charOffset) pausedRef.current = null;

        tokenRef.current.active = false;
        if (cancelSpeakRef.current) { cancelSpeakRef.current(); cancelSpeakRef.current = null; }

        const token = { active: true };
        tokenRef.current = token;
        playingIdRef.current = item.id!;
        setPlayingId(item.id!);
        setHighlightRange(null);
        highlightRangeRef.current = null;

        const slides = buildSlides(item, isAdmin);
        const slideIdx = forceSlideIdx ?? (slideIndexMap.get(item.id!) ?? 0);
        const slide = slides[slideIdx] ?? slides[0];
        const fullText = slideText(item, slide);
        const offset = charOffset ?? 0;
        const text = offset > 0 ? fullText.slice(offset) : fullText;

        const onDone = () => {
            if (!token.active) return;
            setHighlightRange(null);
            highlightRangeRef.current = null;
            playingIdRef.current = null;
            setPlayingId(null);
        };

        const onBoundaryLegacy = (charIndex: number, charLength: number) => {
            if (token.active) {
                const range = { start: offset + charIndex, length: charLength };
                setHighlightRange(range);
                highlightRangeRef.current = range;
            }
        };

        const audioSlide = item.audioSlides?.[slideIdx];

        if (PrerecordedAudioService.isAvailable() && audioSlide) {
            cancelSpeakRef.current = () => PrerecordedAudioService.stop();
            PrerecordedAudioService.play(
                audioSlide,
                (charIndex, charLength) => {
                    if (token.active) {
                        const range = { start: charIndex, length: charLength };
                        setHighlightRange(range);
                        highlightRangeRef.current = range;
                    }
                },
                onDone,
                offset,
            ).catch(() => {
                // Si falla la carga del audio, fallback al TTS del navegador
                if (token.active) {
                    cancelSpeakRef.current = speakOne(text, settings.rate, settings.language, onDone, onBoundaryLegacy);
                }
            });
        } else {
            cancelSpeakRef.current = speakOne(text, settings.rate, settings.language, onDone, onBoundaryLegacy);
        }
    };

    handlePlayRef.current = handlePlay;

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

    const handleLike = async (mlId: string) => {
        if (!user) return;
        const current = socialData.get(mlId);
        const wasLiked = current?.liked ?? false;
        setSocialData(prev => {
            const next = new Map(prev);
            next.set(mlId, {
                likesCount: Math.max(0, (current?.likesCount ?? 0) + (wasLiked ? -1 : 1)),
                commentsCount: current?.commentsCount ?? 0,
                liked: !wasLiked,
            });
            return next;
        });
        await toggleMlLike(user.uid, mlId, !wasLiked);
    };

    const goToSlide = (item: MicrolearningData, idx: number) => {
        pausedRef.current = null;
        slideListRefs.current.get(item.id!)?.scrollTo({ x: idx * width, animated: true });
        setSlideIndexMap(prev => new Map(prev).set(item.id!, idx));
        const existing = slideTimerMap.current.get(item.id!);
        if (existing) clearTimeout(existing);
        const t = setTimeout(() => {
            slideTimerMap.current.delete(item.id!);
            handlePlayRef.current(item, idx);
        }, 250);
        slideTimerMap.current.set(item.id!, t);
    };

    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isPlaying = playingId === item.id;
        const isSaved = savedIds.has(item.id!);
        const social = socialData.get(item.id!) ?? { likesCount: 0, commentsCount: 0, liked: false };
        const slides = buildSlides(item, isAdmin);
        const currentSlideIdx = slideIndexMap.get(item.id!) ?? 0;
        const hlStart = isPlaying && highlightRange ? highlightRange.start : -1;
        const hlLen = isPlaying && highlightRange ? highlightRange.length : 0;
        const isDesktop = width >= 768;

        const bleedX = Math.max(5, Math.ceil(width * 0.01));
        const bleedY = Math.max(5, Math.ceil(height * 0.01));

        return (
            <View
                style={{ width, height, overflow: 'hidden' }}
                ref={(r) => { if (r) itemViewRefs.current.set(item.id!, r); else itemViewRefs.current.delete(item.id!); }}
            >
                {/* Fondo fijo — bleed proporcional (~1%) para cubrir gaps de subpíxel en cualquier pantalla */}
                <GeneratedCover
                    type="microlearning"
                    title={item.title}
                    category={item.category}
                    tags={item.tags ?? []}
                    imageUrl={item.microlearningImageUrl}
                    hideIcon
                    hideText
                    width={width + bleedX * 2}
                    height={height + bleedY * 2}
                    style={{ position: 'absolute', top: -bleedY, left: -bleedX }}
                />

                {/* Carrusel horizontal de slides */}
                <ScrollView
                    ref={ref => { if (ref) slideListRefs.current.set(item.id!, ref as any); }}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={50}
                    onScroll={e => {
                        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                        setSlideIndexMap(prev => new Map(prev).set(item.id!, idx));
                        const existing = slideTimerMap.current.get(item.id!);
                        if (existing) clearTimeout(existing);
                        const t = setTimeout(() => {
                            slideTimerMap.current.delete(item.id!);
                            handlePlayRef.current(item, idx);
                        }, 200);
                        slideTimerMap.current.set(item.id!, t);
                    }}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                >
                    {slides.map((slide, i) => {
                        const isCurrentSlide = i === currentSlideIdx;
                        const text = 'text' in slide ? slide.text : '';
                        const isHl = isCurrentSlide && hlStart >= 0;

                        // Title slide: full GeneratedCover (icon + title) + book info overlay
                        if (slide.type === 'title') {
                            const bookOff = (item.title?.length ?? 0) + 2;
                            const authorOff = bookOff + (item.bookTitle?.length ?? 0) + 6;
                            return (
                                <View key={i} style={{ width, height, overflow: 'hidden' }}>
                                    <GeneratedCover
                                        type="microlearning"
                                        title={item.title}
                                        category={item.category}
                                        tags={item.tags ?? []}
                                        imageUrl={item.microlearningImageUrl}
                                        width={width + bleedX * 2}
                                        height={height + bleedY * 2}
                                        style={{ position: 'absolute', top: -bleedY, left: -bleedX }}
                                        titleHighlight={isHl ? { start: hlStart, length: hlLen } : undefined}
                                        content={item.bookTitle ?? undefined}
                                        reflectionQuestion={item.bookAuthor ?? undefined}
                                        centerContent
                                        contentHighlight={isHl ? { start: hlStart - bookOff, length: hlLen } : undefined}
                                        questionHighlight={isHl ? { start: hlStart - authorOff, length: hlLen } : undefined}
                                    />
                                    <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => handlePlay(item)} activeOpacity={1} />
                                    {isDesktop && i < slides.length - 1 && (
                                        <TouchableOpacity style={styles.slideArrowRight} onPress={() => goToSlide(item, i + 1)} activeOpacity={0.7}>
                                            <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        }

                        if (slide.type === 'cta') {
                            const showHl = isCurrentSlide && hlStart >= 0 && hlStart < CTA_TEXT.length;
                            return (
                                <View key={i} style={[styles.slide, { width, height }]}>
                                    <View style={styles.slideOverlay} />
                                    <View style={{ alignItems: 'center', gap: 24 }}>
                                        <Text style={styles.ctaBrandText}>Nuggeto</Text>
                                        <View style={styles.slideTextBackdrop}>
                                            <Text style={styles.ctaBodyText}>
                                                {showHl
                                                    ? <>{CTA_TEXT.slice(0, hlStart)}<Text style={styles.highlightWord}>{CTA_TEXT.slice(hlStart, hlStart + hlLen)}</Text>{CTA_TEXT.slice(hlStart + hlLen)}</>
                                                    : CTA_TEXT}
                                            </Text>
                                        </View>
                                        <View style={styles.ctaLinkPill}>
                                            <Text style={styles.ctaLinkText}>link en bio</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => handlePlay(item)} activeOpacity={1} />
                                    {isDesktop && i > 0 && (
                                        <TouchableOpacity style={styles.slideArrowLeft} onPress={() => goToSlide(item, i - 1)} activeOpacity={0.7}>
                                            <ChevronLeft size={22} color="rgba(255,255,255,0.7)" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        }

                        const slideContent = (() => {
                            const showHl = isCurrentSlide && hlStart >= 0 && hlStart < text.length;
                            const isHook = slide.type === 'hook';
                            const baseStyle = slide.type === 'reflection' ? styles.slideReflectionText
                                : isHook ? styles.slideHookText
                                : styles.slideContentText;
                            return <>
                                {slide.type === 'reflection' && <Text style={styles.reflectionIcon}>💭</Text>}
                                <View style={styles.slideTextBackdrop}>
                                    <Text style={baseStyle}>
                                        {showHl ? <>{text.slice(0, hlStart)}<Text style={styles.highlightWord}>{text.slice(hlStart, hlStart + hlLen)}</Text>{text.slice(hlStart + hlLen)}</> : text}
                                    </Text>
                                </View>
                            </>;
                        })();

                        return (
                            <View key={i} style={[styles.slide, { width, height }]}>
                                <View style={styles.slideOverlay} />
                                {slideContent}
                                <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => handlePlay(item)} activeOpacity={1} />
                                {isDesktop && i > 0 && (
                                    <TouchableOpacity style={styles.slideArrowLeft} onPress={() => goToSlide(item, i - 1)} activeOpacity={0.7}>
                                        <ChevronLeft size={22} color="rgba(255,255,255,0.7)" />
                                    </TouchableOpacity>
                                )}
                                {isDesktop && i < slides.length - 1 && (
                                    <TouchableOpacity style={styles.slideArrowRight} onPress={() => goToSlide(item, i + 1)} activeOpacity={0.7}>
                                        <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Dots indicadores de slide */}
                <View style={styles.slideDots}>
                    {slides.map((_, i) => (
                        <View key={i} style={[styles.slideDot, i === currentSlideIdx && styles.slideDotActive]} />
                    ))}
                </View>

                {/* Footer */}
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
                </View>

                {/* Barra de acciones derecha */}
                <View style={styles.actionBar} pointerEvents="box-none">
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id!)} activeOpacity={0.7}>
                        <Heart size={28} color={social.liked ? '#FF3B30' : '#FFF'} fill={social.liked ? '#FF3B30' : 'transparent'} />
                        {social.likesCount > 0 && <Text style={styles.actionCount}>{social.likesCount}</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setCommentsOpenId(item.id!)} activeOpacity={0.7}>
                        <MessageCircle size={28} color="#FFF" />
                        {social.commentsCount > 0 && <Text style={styles.actionCount}>{social.commentsCount}</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => toggleSave(item.id!)} activeOpacity={0.7}>
                        <Bookmark size={26} color={isSaved ? '#FFD60A' : '#FFF'} fill={isSaved ? '#FFD60A' : 'transparent'} />
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
                extraData={{ playingId, highlightRange, savedIds, slideIndexMap, socialData }}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: '#000' }}
                initialScrollIndex={startIndex}
                getItemLayout={(_data, index) => ({ length: height, offset: height * index, index })}
                onScroll={handleScroll}
                scrollEventThrottle={50}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                removeClippedSubviews
            />

            <TouchableOpacity style={styles.backBtn} onPress={() => { stopTTS(); router.back(); }}>
                <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>

            {commentsOpenId && user && (
                <MlCommentsModal
                    mlId={commentsOpenId}
                    userId={user.uid}
                    userName={user.displayName ?? user.email?.split('@')[0] ?? 'Usuario'}
                    onClose={() => setCommentsOpenId(null)}
                    onCountChange={(delta) => setSocialData(prev => {
                        const next = new Map(prev);
                        const cur = next.get(commentsOpenId);
                        if (cur) next.set(commentsOpenId, { ...cur, commentsCount: Math.max(0, cur.commentsCount + delta) });
                        return next;
                    })}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },

    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 80,
        backgroundColor: 'transparent',
    },
    slideTitleText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 34,
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    slideBookText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    slideAuthorText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginTop: 6,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    slideOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    slideHookText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 34,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    slideContentText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 30,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    slideReflectionText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 28,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        marginTop: 12,
    },
    reflectionIcon: {
        fontSize: 36,
        marginBottom: 16,
    },
    slideDots: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    slideDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.35)',
    },
    slideDotActive: {
        backgroundColor: '#FFFFFF',
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    highlightWord: {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        borderRadius: 4,
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 18,
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    chapterLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerChapter: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', flexShrink: 1 },

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
    actionBar: {
        position: 'absolute',
        right: 12,
        bottom: 86,
        alignItems: 'center',
        gap: 18,
    },
    actionBtn: {
        alignItems: 'center',
        gap: 3,
    },
    actionCount: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    titleSlideBookInfo: {
        position: 'absolute',
        bottom: 100,
        left: 32,
        right: 32,
        alignItems: 'center',
        gap: 4,
    },
    slideTextBackdrop: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        alignSelf: 'center',
    },
    ctaBrandText: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FF9500',
        letterSpacing: -1,
    },
    ctaBodyText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.92)',
        textAlign: 'center',
        lineHeight: 28,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    ctaLinkPill: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 40,
        paddingHorizontal: 28,
        paddingVertical: 14,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    ctaLinkText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    slideArrowLeft: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.28)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideArrowRight: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.28)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
