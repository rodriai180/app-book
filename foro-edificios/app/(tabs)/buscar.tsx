import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { buildings, Building } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function BuscarScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [searchQuery, setSearchQuery] = useState('');
    const [neighborhoodFilter, setNeighborhoodFilter] = useState('');

    const filteredBuildings = buildings.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        b.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase())
    );

    const renderBuildingCard = ({ item }: { item: Building }) => (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && { opacity: 0.9 }
            ]}
            onPress={() => router.push({ pathname: '/detalle-edificio', params: { id: item.id } })}>
            <Image source={{ uri: item.imageUrl }} style={styles.buildingImage} />
            <View style={styles.cardContent}>
                <Text style={[styles.buildingName, { color: theme.text }]}>{item.name}</Text>
                <View style={styles.infoLine}>
                    <MapPin size={14} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.muted }]}>{item.neighborhood}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.footer}>
                    <View style={styles.sentimentBadge}>
                        <Text style={styles.sentimentText}>{item.summary}</Text>
                    </View>
                    <View style={styles.commentCount}>
                        <MessageCircle size={14} color={theme.muted} />
                        <Text style={styles.commentText}>{item.commentCount}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <View style={styles.searchHeader}>
                <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Search size={18} color={theme.muted} />
                    <TextInput
                        placeholder="Nombre del edificio..."
                        placeholderTextColor={theme.muted}
                        style={[styles.input, { color: theme.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <MapPin size={18} color={theme.muted} />
                    <TextInput
                        placeholder="Barrio..."
                        placeholderTextColor={theme.muted}
                        style={[styles.input, { color: theme.text }]}
                        value={neighborhoodFilter}
                        onChangeText={setNeighborhoodFilter}
                    />
                </View>
            </View>

            <FlatList
                data={filteredBuildings}
                renderItem={renderBuildingCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text style={[styles.resultsTitle, { color: theme.muted }]}>
                        {filteredBuildings.length} edificios encontrados
                    </Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchHeader: {
        padding: Theme.spacing.md,
        gap: Theme.spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        borderRadius: Theme.roundness.md,
        borderWidth: 1,
        gap: Theme.spacing.sm,
    },
    input: {
        flex: 1,
        ...Theme.typography.body,
    },
    listContent: {
        padding: Theme.spacing.md,
    },
    resultsTitle: {
        ...Theme.typography.tiny,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Theme.spacing.md,
    },
    card: {
        borderRadius: Theme.roundness.xl,
        borderWidth: 1,
        marginBottom: Theme.spacing.md,
        overflow: 'hidden',
        ...Theme.shadows.medium,
    },
    buildingImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: Theme.spacing.md,
    },
    buildingName: {
        ...Theme.typography.h3,
        marginBottom: 4,
    },
    infoLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: Theme.spacing.md,
    },
    infoText: {
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: Theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sentimentBadge: {
        backgroundColor: '#F0FDFA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Theme.roundness.full,
        borderWidth: 1,
        borderColor: '#CCFBF1',
    },
    sentimentText: {
        color: '#0F766E',
        fontSize: 12,
        fontWeight: '700',
    },
    commentCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
});
