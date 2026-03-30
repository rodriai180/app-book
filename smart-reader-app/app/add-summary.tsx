import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, ActivityIndicator, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { useTheme } from '../src/services/themeContext';
import { ImageIcon, X } from 'lucide-react-native';

export default function AddSummaryScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [summaryText, setSummaryText] = useState('');
    const [buyLink, setBuyLink] = useState('');
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const pickCover = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*'],
            copyToCacheDirectory: true,
        });
        if (!result.canceled && result.assets?.[0]) {
            setCoverUri(result.assets[0].uri);
            setCoverFile(result.assets[0]);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !summaryText.trim()) {
            setError('El título y el resumen son obligatorios.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            let coverUrl = '';
            if (coverFile) {
                const response = await fetch(coverFile.uri);
                const blob = await response.blob();
                coverUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            await addDoc(collection(db, 'summaries'), {
                title: title.trim(),
                author: author.trim() || null,
                summaryText: summaryText.trim(),
                buyLink: buyLink.trim() || null,
                coverUrl: coverUrl || null,
                createdAt: serverTimestamp(),
            });

            router.back();
        } catch (e: any) {
            setError('Error: ' + (e?.message || String(e)));
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = [styles.input, {
        color: colors.text,
        borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
        backgroundColor: isDark ? '#2C2C2E' : '#F9F9F9',
    }];

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Cover picker */}
                <TouchableOpacity
                    onPress={pickCover}
                    style={[styles.coverPicker, { borderColor: isDark ? '#3A3A3C' : '#D1D1D6', backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
                >
                    {coverUri ? (
                        <>
                            <Image source={{ uri: coverUri }} style={styles.coverPreview} resizeMode="cover" />
                            <TouchableOpacity style={styles.removeCover} onPress={() => { setCoverUri(null); setCoverFile(null); }}>
                                <X size={14} color="#FFF" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.coverPlaceholder}>
                            <ImageIcon size={32} color={colors.secondaryText} />
                            <Text style={[styles.coverHint, { color: colors.secondaryText }]}>Subir portada</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Fields */}
                <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
                <TextInput
                    style={inputStyle}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Nombre del libro"
                    placeholderTextColor={colors.secondaryText}
                />

                <Text style={[styles.label, { color: colors.text }]}>Autor</Text>
                <TextInput
                    style={inputStyle}
                    value={author}
                    onChangeText={setAuthor}
                    placeholder="Nombre del autor"
                    placeholderTextColor={colors.secondaryText}
                />

                <Text style={[styles.label, { color: colors.text }]}>Resumen *</Text>
                <TextInput
                    style={[inputStyle, styles.textArea]}
                    value={summaryText}
                    onChangeText={setSummaryText}
                    placeholder="Escribí el resumen corto del libro..."
                    placeholderTextColor={colors.secondaryText}
                    multiline
                    textAlignVertical="top"
                />

                <Text style={[styles.label, { color: colors.text }]}>Link de compra</Text>
                <TextInput
                    style={inputStyle}
                    value={buyLink}
                    onChangeText={setBuyLink}
                    placeholder="https://..."
                    placeholderTextColor={colors.secondaryText}
                    autoCapitalize="none"
                    keyboardType="url"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: colors.tint, opacity: saving ? 0.7 : 1 }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={styles.saveBtnText}>Guardar resumen</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20, gap: 6 },
    coverPicker: {
        height: 180, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed',
        marginBottom: 20, overflow: 'hidden',
    },
    coverPreview: { width: '100%', height: '100%' },
    coverPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    coverHint: { fontSize: 14 },
    removeCover: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12,
        width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
    },
    label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 4 },
    input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
    textArea: { minHeight: 120 },
    error: { color: '#FF3B30', fontSize: 13, marginTop: 8 },
    saveBtn: { marginTop: 24, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
