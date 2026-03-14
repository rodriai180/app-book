import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { conversations, ChatMessage } from '@/constants/mockData';
import { useColorScheme } from '@/components/useColorScheme';

export default function SalaChatScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const conversation = conversations.find(c => c.id === id);
    const [messages, setMessages] = useState<ChatMessage[]>(conversation?.messages || []);
    const [inputText, setInputText] = useState('');

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[
            styles.messageWrapper,
            item.isMe ? styles.myMessageWrapper : styles.theirMessageWrapper
        ]}>
            {!item.isMe && <Text style={[styles.senderName, { color: theme.muted }]}>{item.sender}</Text>}
            <View style={[
                styles.bubble,
                item.isMe ? { backgroundColor: theme.primary } : { backgroundColor: theme.border }
            ]}>
                <Text style={[styles.messageText, { color: item.isMe ? 'white' : theme.text }]}>
                    {item.text}
                </Text>
            </View>
            <Text style={[styles.timestamp, { color: theme.muted }]}>{item.timestamp}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <Stack.Screen options={{ title: title || 'Chat' }} />
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <TextInput
                    style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor={theme.muted}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <Pressable
                    style={[styles.sendButton, { backgroundColor: theme.primary }]}
                    onPress={() => setInputText('')}
                >
                    <Send size={20} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: Theme.spacing.md,
        gap: Theme.spacing.md,
    },
    messageWrapper: {
        maxWidth: '80%',
        marginBottom: Theme.spacing.xs,
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
        marginLeft: 4,
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 2,
        marginHorizontal: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: Theme.spacing.sm,
        borderTopWidth: 1,
        alignItems: 'flex-end',
        gap: Theme.spacing.sm,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 15,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
});
