import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    useWindowDimensions, Animated, Platform,
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

function splitPhrases(text: string): string[] {
    const re = /[^.!?]+[.!?]+\s*/g;
    const result: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const s = m[0].trim();
        if (s) result.push(s);
    }
    const tail = text.slice(re.lastIndex).trim();
    if (tail) result.push(tail);
    return result;
}

// Habla UNA frase sin llamar cancel() — evita el bug de Chrome que duplica el audio.
// Devuelve una función para cancelar.
function speakOne(
    text: string,
    rate: number,
    lang: string,
    onDone: () => void,
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

        // Elegir la mejor voz disponible
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

        utt.onend = done;
        utt.onerror = (e: any) => {
            if (e.error === 'interrupted' || e.error === 'canceled') return;
            done();
        };
        // NO llamamos synth.cancel() — eso es lo que causa el doble play en Chrome
        synth.speak(utt);
        return () => { cancelled = true; synth.cancel(); };
    } else {
        Speech.speak(text, {
            language: lang,
            rate,
            onDone: done,
            onError: () => done(),
        });
        return () => { cancelled = true; Speech.stop().catch(() => {}); };
    }
}

export default function MicrolearningDetailScreen() {
    const router = useRouter();
    const { settings } = useSettings();
    const { user } = useAuth();
    const { width, height } = useWindowDimensions();

    const { items, startIndex } = getFeed();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [currentPhrase, setCurrentPhrase] = useState<string | null>(null);

    const playingIdRef = useRef<string | null>(null);
    const tokenRef = useRef<{ active: boolean }>({ active: false });
    const cancelSpeakRef = useRef<(() => void) | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const listRef = useRef<FlatList>(null);

    const stopTTS = () => {
        tokenRef.current.active = false;
        if (cancelSpeakRef.current) { cancelSpeakRef.current(); cancelSpeakRef.current = null; }
        playingIdRef.current = null;
        setPlayingId(null);
        setCurrentPhrase(null);
        fadeAnim.setValue(0);
    };

    useEffect(() => {
        if (user) {
            getSavedMicrolearnings(user.uid).then(saved =>
                setSavedIds(new Set(saved.map(m => m.id!)))
            );
        }
        return () => stopTTS();
    }, []);

    const speakPhrase = (
        item: MicrolearningData,
        phrases: string[],
        index: number,
        token: { active: boolean },
        rate: number,
        lang: string,
    ) => {
        if (!token.active) return;

        const isContent = index < phrases.length;
        const isQuestion = index === phrases.length && !!item.reflectionQuestion;

        if (!isContent && !isQuestion) {
            Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
                if (!token.active) return;
                playingIdRef.current = null;
                setPlayingId(null);
                setCurrentPhrase(null);
            });
            return;
        }

        const text = isContent ? phrases[index] : item.reflectionQuestion!;

        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
            if (!token.active) return;
            setCurrentPhrase(text);
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            cancelSpeakRef.current = speakOne(text, rate, lang, () => {
                speakPhrase(item, phrases, index + 1, token, rate, lang);
            });
        });
    };

    const handlePlay = (item: MicrolearningData) => {
        if (playingIdRef.current === item.id) { stopTTS(); return; }
        stopTTS();
        const token = { active: true };
        tokenRef.current = token;
        playingIdRef.current = item.id!;
        setPlayingId(item.id!);
        const phrases = splitPhrases(item.content ?? '');
        speakPhrase(item, phrases, 0, token, settings.rate, settings.language);
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

    // Dimensiones del grupo centrado (estimadas, consistentes con GeneratedCover)
    const ICON_H = 145;   // iconWrapper (130) + gap (10) + margen extra (5)
    const TITLE_H = 46;   // 2 líneas * lineHeight 21 + algo de margen
    const PHRASE_H = 90;
    const REFLECTION_H = 54;
    const GAP = 16;

    const groupHeight = ICON_H + TITLE_H + PHRASE_H + REFLECTION_H + GAP * 3;
    const groupTop = Math.max(32, (height - groupHeight) / 2);
    const phraseTop = groupTop + ICON_H + TITLE_H + GAP;
    const reflectionTop = phraseTop + PHRASE_H + GAP;

    const renderItem = ({ item }: { item: MicrolearningData }) => {
        const isPlaying = playingId === item.id;
        const isSaved = savedIds.has(item.id!);

        return (
            <View style={{ width, height }}>
                <TouchableOpacity onPress={() => handlePlay(item)} activeOpacity={0.9} style={{ flex: 1 }}>
                    <GeneratedCover
                        type="microlearning"
                        title={item.title}
                        category={item.category}
                        tags={item.tags ?? []}
                        topAligned
                        topAlignedPadding={groupTop}
                        style={{ flex: 1 }}
                    />

                    <Animated.View style={[styles.phraseOverlay, { top: phraseTop, opacity: isPlaying ? fadeAnim : 0 }]}>
                        {currentPhrase !== null && (
                            <Text style={styles.phraseText}>{currentPhrase}</Text>
                        )}
                    </Animated.View>

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
        <SafeAreaView style={styles.root} edges={['bottom']}>
            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={item => item.id ?? `${item.bookId}-${item.order}`}
                renderItem={renderItem}
                extraData={{ playingId, currentPhrase, savedIds }}
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
        // top se inyecta dinámicamente
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
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
