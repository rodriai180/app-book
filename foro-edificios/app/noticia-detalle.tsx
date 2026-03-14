import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { news } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function NoticiaDetalleScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const item = news.find(n => n.id === id);

    if (!item) return null;

    return (
        <>
            <Stack.Screen options={{ title: 'Noticia' }} />
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.content}>
                    <View style={styles.badgeLine}>
                        <Text style={[styles.neighborhood, { color: theme.primary }]}>{item.neighborhood}</Text>
                        <Text style={[styles.date, { color: theme.muted }]}>{item.date}</Text>
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    <View style={styles.divider} />
                    <Text style={[styles.contentText, { color: theme.text }]}>{item.content}</Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: Theme.spacing.lg,
    },
    badgeLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.md,
    },
    neighborhood: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    date: {
        fontSize: 13,
    },
    title: {
        ...Theme.typography.h1,
        marginBottom: Theme.spacing.lg,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: Theme.spacing.lg,
    },
    contentText: {
        ...Theme.typography.body,
        lineHeight: 26,
    },
});
