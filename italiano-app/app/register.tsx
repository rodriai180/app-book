import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/services/authContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail, User as UserIcon, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';



export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const validateEmail = (email: string) => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleRegister = async () => {
        if (!name || !surname || !email || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Por favor, introduce un email válido.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await register(email, password, name, surname, 'es');
            router.replace('/(tabs)');
        } catch (err: any) {
            let errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email ya está en uso.';
            }
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inner}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.primary }]}>Crea una Cuenta</Text>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>Únete a nuestra comunidad y aprende italiano con nosotros.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <UserIcon size={20} color={colors.muted} style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Nombre"
                                placeholderTextColor={colors.muted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <UserIcon size={20} color={colors.muted} style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Apellido"
                                placeholderTextColor={colors.muted}
                                value={surname}
                                onChangeText={setSurname}
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Mail size={20} color={colors.muted} style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Email"
                                placeholderTextColor={colors.muted}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Lock size={20} color={colors.muted} style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Contraseña"
                                placeholderTextColor={colors.muted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Lock size={20} color={colors.muted} style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Confirmar Contraseña"
                                placeholderTextColor={colors.muted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>



                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <View style={styles.buttonInner}>
                                    <Text style={styles.buttonText}>Registrarse</Text>
                                    <UserPlus size={20} color="#FFF" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.footerLink}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={[styles.footerText, { color: colors.muted }]}>
                                ¿Ya tienes cuenta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Inicia Sesión</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        padding: 16,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
    },
    inner: {
        flex: 1,
        padding: 24,
        paddingTop: 0,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        height: 56,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#CD212A',
        fontSize: 14,
        textAlign: 'center',
    },
    footerLink: {
        marginTop: 24,
        alignItems: 'center',
        marginBottom: 32,
    },
    footerText: {
        fontSize: 15,
    },
    languageSelection: {
        marginTop: 8,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    langButton: {
        flex: 1,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    langButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});
