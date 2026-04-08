import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, Eye } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { AudioService } from '../../src/services/AudioService';
import { useTheme } from '../../src/services/themeContext';
import { useSettings } from '../../src/services/settingsContext';

interface Summary {
    id: string;
    title: string;
    author?: string;
    coverUrl?: string;
    summaryText: string;
    buyLink?: string;
}

export default function SummariesScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { settings } = useSettings();
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const { width, height } = containerSize;
    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadSummaries();
            return () => { AudioService.stop(); setPlayingId(null); };
        }, [])
    );

    const loadSummaries = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'summaries'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setSummaries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Summary)));
        } catch {
            const snap = await getDocs(collection(db, 'summaries'));
            setSummaries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Summary)));
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (item: Summary) => {
        if (playingId === item.id) {
            AudioService.stop();
            setPlayingId(null);
            return;
        }
        AudioService.stop();
        setPlayingId(item.id);
        AudioService.speak(item.summaryText, {
            rate: settings.rate,
            language: settings.language,
            onDone: () => setPlayingId(null),
            onError: () => setPlayingId(null),
        });
    };

    const renderItem = ({ item }: { item: Summary }) => {
        const isPlaying = playingId === item.id;
        const preview = item.summaryText.length > 120
            ? item.summaryText.slice(0, 120) + '...'
            : item.summaryText;

        return (
            <View style={[styles.slide, { width, height, backgroundColor: colors.background }]}>
                {/* Cover — 55% of slide */}
                <View style={styles.coverContainer}>
                    {item.coverUrl ? (
                        <Image
                            source={{ uri: item.coverUrl }}
                            style={styles.cover}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={[styles.cover, { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[styles.coverInitial, { color: colors.secondaryText }]}>
                                {item.title.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info — bottom half */}
                <View style={[styles.infoContainer, { backgroundColor: colors.background }]}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    {item.author ? (
                        <Text style={[styles.author, { color: colors.secondaryText }]}>
                            {item.author}
                        </Text>
                    ) : null}

                    <Text style={[styles.preview, { color: colors.text }]} numberOfLines={3}>
                        {preview}
                    </Text>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => handlePlay(item)}
                            style={[styles.playBtn, { backgroundColor: isPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
                        >
                            {isPlaying
                                ? <Square size={18} color="#FFF" fill="#FFF" />
                                : <Play size={18} color={colors.tint} fill={colors.tint} />
                            }
                            <Text style={[styles.btnLabel, { color: isPlaying ? '#FFF' : colors.tint }]}>
                                {isPlaying ? 'Detener' : 'Escuchar'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/summary-detail', params: { id: item.id } })}
                            style={[styles.buyBtn, { borderColor: colors.tint }]}
                        >
                            <Eye size={16} color={colors.tint} />
                            <Text style={[styles.btnLabel, { color: colors.tint }]}>Ver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </SafeAreaView>
        );
    }

    if (summaries.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <Text style={[styles.empty, { color: colors.secondaryText }]}>
                        No hay resúmenes disponibles todavía.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <FlatList
            data={summaries}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height || undefined}
            snapToAlignment="start"
            decelerationRate="fast"
            onLayout={e => setContainerSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
            style={[{ backgroundColor: colors.background, flex: 1 }, { scrollSnapType: 'y mandatory' } as any]}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    empty: { fontSize: 15, textAlign: 'center' },
    slide: {
        flexDirection: 'column',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
    } as any,
    coverContainer: {
        flex: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 12,
        paddingBottom: 8,
    },
    cover: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
    },
    coverInitial: { fontSize: 64, fontWeight: '700' },
    infoContainer: {
        flex: 55,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 16,
        gap: 6,
        overflow: 'hidden',
    },
    title: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
    author: { fontSize: 15, fontWeight: '500' },
    preview: { fontSize: 14, lineHeight: 22, marginTop: 4 },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    playBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    buyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1.5,
    },
    btnLabel: { fontSize: 14, fontWeight: '600' },
});
