import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, BookOpen } from 'lucide-react-native';
import { useAuth } from '../src/services/authContext';
import { useTheme } from '../src/services/themeContext';

export default function LoginScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { login, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getErrorMessage = (code: string) => {
        switch (code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'Email o contraseña incorrectos.';
            case 'auth/wrong-password':
                return 'La contraseña es incorrecta.';
            case 'auth/invalid-email':
                return 'El formato del email no es válido.';
            case 'auth/too-many-requests':
                return 'Demasiados intentos. Inténtalo más tarde.';
            default:
                return 'Ha ocurrido un error. Inténtalo de nuevo.';
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Completa todos los campos.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await login(email.trim(), password);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(getErrorMessage(err.code));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError('Introduce tu email para recuperar la contraseña.');
            return;
        }
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await resetPassword(email.trim());
            setSuccess('Se ha enviado un correo para restablecer tu contraseña.');
            Alert.alert(
                'Correo enviado',
                'Revisa tu bandeja de entrada para restablecer tu contraseña.',
                [{ text: 'OK' }]
            );
        } catch (err: any) {
            setError('No se pudo enviar el correo. Verifica que el email sea correcto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={[styles.logoCircle, { backgroundColor: colors.tint }]}>
                            <BookOpen size={36} color="#FFFFFF" />
                        </View>
                        <Text style={[styles.appName, { color: colors.text }]}>Smart Reader</Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Tu asistente de lectura inteligente</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {error ? (
                            <View style={[styles.errorContainer, { backgroundColor: isDark ? 'rgba(255, 59, 48, 0.15)' : '#FFF2F2', borderColor: isDark ? 'rgba(255, 59, 48, 0.3)' : '#FFD6D6' }]}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {success ? (
                            <View style={[styles.errorContainer, { backgroundColor: isDark ? 'rgba(52, 199, 89, 0.15)' : '#F2FFF5', borderColor: isDark ? 'rgba(52, 199, 89, 0.3)' : '#D6FFDF' }]}>
                                <Text style={[styles.errorText, { color: isDark ? '#34C759' : '#248A3D' }]}>{success}</Text>
                            </View>
                        ) : null}

                        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
                            <Mail size={20} color={colors.secondaryText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Email"
                                placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
                            <Lock size={20} color={colors.secondaryText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Contraseña"
                                placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                            <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => router.push('/register')}
                    >
                        <Text style={[styles.registerText, { color: colors.secondaryText }]}>
                            ¿No tienes cuenta?{' '}
                            <Text style={[styles.registerTextBold, { color: colors.tint }]}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 4,
    },
    form: {
        gap: 14,
    },
    errorContainer: {
        backgroundColor: '#FFF2F2',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#FFD6D6',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 52,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 17,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        paddingVertical: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    registerLink: {
        alignItems: 'center',
        marginTop: 30,
    },
    registerText: {
        fontSize: 15,
        color: '#8E8E93',
    },
    registerTextBold: {
        color: '#007AFF',
        fontWeight: '600',
    },
});
