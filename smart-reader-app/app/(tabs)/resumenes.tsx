import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, Plus } from 'lucide-react-native';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
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
}

export default function ResumenesScreen() {
    const { colors, isDark } = useTheme();
    const { settings } = useSettings();
    const router = useRouter();
    const navigation = useNavigation();
    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/add-summary')} style={{ marginRight: 16 }}>
                    <Plus size={24} color={colors.tint} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, colors.tint]);

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
        return (
            <View style={[styles.row, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                {item.coverUrl ? (
                    <Image source={{ uri: item.coverUrl }} style={styles.cover} resizeMode="cover" />
                ) : (
                    <View style={[styles.coverPlaceholder, { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                        <Text style={[styles.coverInitial, { color: colors.secondaryText }]}>
                            {item.title.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                    {item.author ? (
                        <Text style={[styles.author, { color: colors.secondaryText }]} numberOfLines={1}>{item.author}</Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    onPress={() => handlePlay(item)}
                    style={[styles.playBtn, { backgroundColor: isPlaying ? colors.tint : (isDark ? '#2C2C2E' : '#F2F2F7') }]}
                >
                    {isPlaying
                        ? <Square size={16} color="#FFF" fill="#FFF" />
                        : <Play size={16} color={colors.tint} fill={colors.tint} />
                    }
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : summaries.length === 0 ? (
                <View style={styles.center}>
                    <Text style={[styles.empty, { color: colors.secondaryText }]}>
                        Todavía no hay resúmenes.{'\n'}Agregá el primero con el botón +
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={summaries}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    empty: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    list: { paddingVertical: 8 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        gap: 12,
    },
    cover: { width: 52, height: 72, borderRadius: 6 },
    coverPlaceholder: {
        width: 52, height: 72, borderRadius: 6,
        justifyContent: 'center', alignItems: 'center',
    },
    coverInitial: { fontSize: 22, fontWeight: '700' },
    info: { flex: 1 },
    title: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
    author: { fontSize: 13 },
    playBtn: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
    },
});
