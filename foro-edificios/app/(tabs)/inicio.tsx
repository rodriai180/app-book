import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { news, NewsItem } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function InicioScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const renderNewsCard = ({ item }: { item: NewsItem }) => (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push({ pathname: '/noticia-detalle', params: { id: item.id } })}>
            <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
                <View style={styles.badgeLine}>
                    <Text style={[styles.neighborhood, { color: theme.primary }]}>{item.neighborhood}</Text>
                    <Text style={[styles.date, { color: theme.muted }]}>{item.date}</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.summary, { color: theme.muted }]} numberOfLines={2}>
                    {item.summary}
                </Text>
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <FlatList
                data={news}
                renderItem={renderNewsCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Información Local</Text>
                        <Text style={[styles.headerSubtitle, { color: theme.muted }]}>Enterate de lo que pasa en los barrios.</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: Theme.spacing.lg,
    },
    headerTitle: {
        ...Theme.typography.h1,
    },
    headerSubtitle: {
        ...Theme.typography.body,
        marginTop: 4,
    },
    listContent: {
        padding: Theme.spacing.md,
    },
    card: {
        flexDirection: 'row',
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        marginBottom: Theme.spacing.md,
        overflow: 'hidden',
        ...Theme.shadows.light,
    },
    thumbnail: {
        width: 100,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: Theme.spacing.md,
    },
    badgeLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    neighborhood: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    date: {
        fontSize: 11,
    },
    title: {
        ...Theme.typography.h3,
        marginBottom: 6,
    },
    summary: {
        fontSize: 13,
        lineHeight: 18,
    },
});
