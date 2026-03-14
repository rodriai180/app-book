import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { conversations, Conversation } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function ChatListScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const renderConversation = ({ item }: { item: Conversation }) => (
        <Pressable
            style={({ pressed }) => [
                styles.chatItem,
                { borderBottomColor: theme.border },
                pressed && { backgroundColor: theme.surface },
            ]}
            onPress={() => router.push({ pathname: '/sala-chat', params: { id: item.id, title: item.title } })}>
            <View style={[styles.avatar, { backgroundColor: theme.border }]}>
                <Users size={24} color={theme.muted} />
            </View>
            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <Text style={[styles.chatTitle, { color: theme.text }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.chatTime, { color: theme.muted }]}>{item.lastMessageTime}</Text>
                </View>
                <View style={styles.chatFooter}>
                    <Text style={[styles.lastMessage, { color: theme.muted }]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    <ChevronRight size={16} color={theme.border} />
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={conversations}
                renderItem={renderConversation}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatItem: {
        flexDirection: 'row',
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        alignItems: 'center',
        gap: Theme.spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatContent: {
        flex: 1,
        gap: 4,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatTitle: {
        ...Theme.typography.h3,
        fontSize: 16,
        flex: 1,
    },
    chatTime: {
        fontSize: 12,
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        flex: 1,
    },
});
