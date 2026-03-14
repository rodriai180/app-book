import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MapPin, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { buildings, Comment } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function DetalleEdificioScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const building = buildings.find(b => b.id === id);

    if (!building) return null;

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={[styles.commentItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.commentHeader}>
                <View>
                    <Text style={[styles.userAlias, { color: theme.text }]}>{item.userAlias}</Text>
                    <View style={styles.residenceLine}>
                        <Calendar size={12} color={theme.muted} />
                        <Text style={[styles.residenceText, { color: theme.muted }]}>Vivió aquí: {item.residencePeriod}</Text>
                    </View>
                </View>
                <View style={[styles.voteIcon, { backgroundColor: item.recommended ? '#F0FDFA' : '#FFF1F2' }]}>
                    {item.recommended ? (
                        <ThumbsUp size={16} color="#0D9488" />
                    ) : (
                        <ThumbsDown size={16} color="#E11D48" />
                    )}
                </View>
            </View>
            <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{ title: 'Detalle del Edificio' }} />
            <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
                <Image source={{ uri: building.imageUrl }} style={styles.image} />
                <View style={styles.infoSection}>
                    <Text style={[styles.name, { color: theme.text }]}>{building.name}</Text>
                    <View style={styles.locationLine}>
                        <MapPin size={16} color={theme.primary} />
                        <Text style={[styles.location, { color: theme.muted }]}>{building.neighborhood}</Text>
                    </View>
                </View>

                <View style={styles.reviewsHeader}>
                    <Text style={[styles.reviewsTitle, { color: theme.text }]}>Comentarios de residentes</Text>
                    <Text style={[styles.reviewCount, { color: theme.muted }]}>{building.commentCount} reseñas</Text>
                </View>

                <View style={styles.commentsList}>
                    {building.comments.map((comment) => (
                        <View key={comment.id}>
                            {renderComment({ item: comment })}
                        </View>
                    ))}
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
        height: 300,
    },
    infoSection: {
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    name: {
        ...Theme.typography.h1,
        marginBottom: 4,
    },
    locationLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    location: {
        fontSize: 16,
    },
    reviewsHeader: {
        padding: Theme.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    reviewsTitle: {
        ...Theme.typography.h3,
    },
    reviewCount: {
        fontSize: 14,
    },
    commentsList: {
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: Theme.spacing.xxl,
        gap: Theme.spacing.md,
    },
    commentItem: {
        padding: Theme.spacing.md,
        borderRadius: Theme.roundness.lg,
        borderWidth: 1,
        ...Theme.shadows.light,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Theme.spacing.sm,
    },
    userAlias: {
        fontWeight: '700',
        fontSize: 15,
    },
    residenceLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    residenceText: {
        fontSize: 12,
    },
    voteIcon: {
        padding: 8,
        borderRadius: Theme.roundness.full,
    },
    commentText: {
        ...Theme.typography.body,
        fontSize: 14,
        lineHeight: 20,
    },
});
