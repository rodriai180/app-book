import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, Modal, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { X, Send, Trash2 } from 'lucide-react-native';
import { getMlComments, addMlComment, deleteMlComment, MlComment } from '../services/bookContentService';
import { useTheme } from '../services/themeContext';

interface Props {
    mlId: string;
    userId: string;
    userName: string;
    onClose: () => void;
    onCountChange: (delta: number) => void;
}

function timeAgo(ts: any): string {
    if (!ts) return '';
    const ms = typeof ts.toDate === 'function' ? ts.toDate().getTime() : Date.now();
    const diff = Math.floor((Date.now() - ms) / 1000);
    if (diff < 60) return 'ahora';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export default function MlCommentsModal({ mlId, userId, userName, onClose, onCountChange }: Props) {
    const { colors, isDark } = useTheme();
    const [comments, setComments] = useState<MlComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const listRef = useRef<FlatList>(null);

    const bg = isDark ? '#1C1C1E' : '#FFFFFF';
    const inputBg = isDark ? '#2C2C2E' : '#F2F2F7';

    useEffect(() => {
        getMlComments(mlId)
            .then(setComments)
            .finally(() => setLoading(false));
    }, [mlId]);

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;
        setSending(true);
        try {
            const newComment = await addMlComment(userId, userName, mlId, trimmed);
            setComments(prev => [...prev, newComment]);
            onCountChange(1);
            setText('');
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (comment: MlComment) => {
        setComments(prev => prev.filter(c => c.id !== comment.id));
        onCountChange(-1);
        await deleteMlComment(mlId, comment.id!);
    };

    const renderComment = ({ item }: { item: MlComment }) => (
        <View style={styles.commentRow}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.avatarText}>
                    {item.userName.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.commentBody}>
                <View style={styles.commentHeader}>
                    <Text style={[styles.commentUser, { color: colors.text }]}>{item.userName}</Text>
                    <Text style={[styles.commentTime, { color: colors.secondaryText }]}>{timeAgo(item.createdAt)}</Text>
                </View>
                <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
            </View>
            {item.userId === userId && (
                <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={8}>
                    <Trash2 size={14} color={colors.secondaryText} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <Modal visible animationType="slide" transparent onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.sheetWrapper}
            >
                <View style={[styles.sheet, { backgroundColor: bg }]}>
                    {/* Handle */}
                    <View style={[styles.handle, { backgroundColor: isDark ? '#3C3C3E' : '#D1D1D6' }]} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Comentarios</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={8}>
                            <X size={20} color={colors.secondaryText} />
                        </TouchableOpacity>
                    </View>

                    {/* List */}
                    {loading ? (
                        <ActivityIndicator style={{ marginVertical: 32 }} color={colors.tint} />
                    ) : comments.length === 0 ? (
                        <Text style={[styles.empty, { color: colors.secondaryText }]}>
                            Sé el primero en comentar
                        </Text>
                    ) : (
                        <FlatList
                            ref={listRef}
                            data={comments}
                            keyExtractor={item => item.id!}
                            renderItem={renderComment}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {/* Input */}
                    <View style={[styles.inputRow, { backgroundColor: inputBg, borderTopColor: isDark ? '#3C3C3E' : '#E5E5EA' }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Agregá un comentario..."
                            placeholderTextColor={colors.secondaryText}
                            value={text}
                            onChangeText={setText}
                            multiline
                            maxLength={300}
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!text.trim() || sending}
                            style={[styles.sendBtn, { opacity: text.trim() ? 1 : 0.4 }]}
                        >
                            {sending
                                ? <ActivityIndicator size="small" color={colors.tint} />
                                : <Send size={20} color={colors.tint} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheetWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '75%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    handle: {
        width: 36, height: 4, borderRadius: 2,
        alignSelf: 'center', marginTop: 10, marginBottom: 4,
    },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    title: { fontSize: 16, fontWeight: '700' },
    empty: { textAlign: 'center', paddingVertical: 40, fontSize: 14 },
    list: { paddingHorizontal: 16, paddingBottom: 8 },
    commentRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        gap: 10, paddingVertical: 10,
    },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    commentBody: { flex: 1, gap: 2 },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    commentUser: { fontSize: 13, fontWeight: '700' },
    commentTime: { fontSize: 11 },
    commentText: { fontSize: 14, lineHeight: 20 },
    inputRow: {
        flexDirection: 'row', alignItems: 'flex-end',
        paddingHorizontal: 12, paddingVertical: 10,
        borderTopWidth: 1, gap: 8,
    },
    input: { flex: 1, fontSize: 15, maxHeight: 80, paddingTop: 0 },
    sendBtn: { paddingBottom: 2 },
});
