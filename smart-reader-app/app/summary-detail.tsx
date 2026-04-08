import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { ShoppingCart, Play, Pause } from 'lucide-react-native';
import { db } from '../constants/firebaseConfig';
import { useTheme } from '../src/services/themeContext';
import { AudioService } from '../src/services/AudioService';
import { useSettings } from '../src/services/settingsContext';

interface Summary {
    title: string;
    author?: string;
    summaryText: string;
    buyLink?: string;
}

export default function SummaryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { settings } = useSettings();
    const navigation = useNavigation();
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [highlightRange, setHighlightRange] = useState<{ start: number; end: number } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerTintColor: '#FFFFFF' });
    }, []);

    useEffect(() => {
        if (!summary) return;
        const truncated = summary.title.length > 30 ? summary.title.slice(0, 30) + '…' : summary.title;
        navigation.setOptions({ title: truncated });
    }, [summary]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'summaries', id));
                if (snap.exists()) setSummary(snap.data() as Summary);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const startReading = (text: string) => {
        AudioService.speak(text, {
            rate: settings.rate,
            language: settings.language,
            onBoundary: ({ charIndex, charLength }) => {
                setHighlightRange({ start: charIndex, end: charIndex + charLength });
            },
            onDone: () => { setHighlightRange(null); setIsPlaying(false); },
            onError: () => { setHighlightRange(null); setIsPlaying(false); },
        });
        setIsPlaying(true);
    };

    const togglePlayback = () => {
        if (!summary) return;
        if (isPlaying) {
            AudioService.stop();
            setIsPlaying(false);
            setHighlightRange(null);
        } else {
            startReading(summary.summaryText);
        }
    };

    // Auto-play once summary is loaded
    useEffect(() => {
        if (!summary) return;
        startReading(summary.summaryText);
        return () => { AudioService.stop(); };
    }, [summary]);

    const renderHighlightedText = (text: string) => {
        if (!highlightRange) {
            return <Text style={[styles.body, { color: colors.text }]}>{text}</Text>;
        }
        const { start, end } = highlightRange;
        const before = text.slice(0, start);
        const highlighted = text.slice(start, end);
        const after = text.slice(end);
        return (
            <Text style={[styles.body, { color: colors.text }]}>
                {before}
                <Text style={styles.highlight}>{highlighted}</Text>
                {after}
            </Text>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.center}>
                    <ActivityIndicator color={colors.tint} />
                </View>
            </SafeAreaView>
        );
    }

    if (!summary) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            {/* FAB play/pause */}
            <TouchableOpacity
                onPress={togglePlayback}
                style={[styles.fab, { backgroundColor: colors.tint }]}
            >
                {isPlaying
                    ? <Pause size={22} color="#FFF" fill="#FFF" />
                    : <Play size={22} color="#FFF" fill="#FFF" />
                }
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scroll}>
                {renderHighlightedText(summary.summaryText)}
            </ScrollView>

            {summary.buyLink ? (
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={[styles.buyBtn, { backgroundColor: colors.tint }]}
                        onPress={() => Linking.openURL(summary.buyLink!)}
                    >
                        <ShoppingCart size={18} color="#FFF" />
                        <Text style={styles.buyLabel}>Comprar libro</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: 24, gap: 12 },
    title: { fontSize: 24, fontWeight: '800', lineHeight: 30 },
    author: { fontSize: 15, fontWeight: '500' },
    body: { fontSize: 15, lineHeight: 26 },
    highlight: {
        backgroundColor: '#FFE066',
        color: '#000',
        borderRadius: 3,
    },
    footer: { padding: 16, borderTopWidth: 1 },
    buyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        borderRadius: 14,
    },
    buyLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
