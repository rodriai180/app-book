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
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, BookOpen } from 'lucide-react-native';
import { useAuth } from '../src/services/authContext';
import { useTheme } from '../src/services/themeContext';
import { Checkbox } from '../src/components/Checkbox';
import { TermsModal } from '../src/components/TermsModal';

export default function RegisterScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsRead, setTermsRead] = useState(false);

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const getErrorMessage = (code: string) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Este email ya está registrado.';
            case 'auth/invalid-email':
                return 'El formato del email no es válido.';
            case 'auth/weak-password':
                return 'La contraseña es demasiado débil.';
            default:
                return 'Ha ocurrido un error. Inténtalo de nuevo.';
        }
    };

    const handleRegister = async () => {
        // Client-side validation
        if (!name.trim() || !surname.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Completa todos los campos.');
            return;
        }
        if (!isValidEmail(email.trim())) {
            setError('El formato del email no es válido.');
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

        setError('');
        setIsLoading(true);
        try {
            await register(email.trim(), password, name.trim(), surname.trim());
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(getErrorMessage(err.code));
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
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={[styles.logoCircle, { backgroundColor: colors.tint }]}>
                            <BookOpen size={32} color="#FFFFFF" />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Únete a Smart Reader</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {error ? (
                            <View style={[styles.errorContainer, { backgroundColor: isDark ? 'rgba(255, 59, 48, 0.15)' : '#FFF2F2', borderColor: isDark ? 'rgba(255, 59, 48, 0.3)' : '#FFD6D6' }]}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.row}>
                            <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: colors.card }]}>
                                <User size={20} color={colors.secondaryText} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Nombre"
                                    placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: colors.card }]}>
                                <User size={20} color={colors.secondaryText} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Apellido"
                                    placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                    value={surname}
                                    onChangeText={setSurname}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

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
                                placeholder="Contraseña (mín. 6 caracteres)"
                                placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
                            <Lock size={20} color={colors.secondaryText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Confirmar Contraseña"
                                placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={[styles.termsContainer, !termsRead && { opacity: 0.6 }]}>
                            <Checkbox
                                checked={acceptedTerms}
                                onToggle={() => termsRead && setAcceptedTerms(!acceptedTerms)}
                                label={
                                    <Text style={[styles.termsText, { color: colors.secondaryText }]}>
                                        {!termsRead ? '(Lee los términos para activar) ' : ''}
                                        Acepto los{' '}
                                        <Text
                                            style={[styles.termsLink, { color: colors.tint }]}
                                            onPress={() => setShowTermsModal(true)}
                                        >
                                            Términos y Condiciones
                                        </Text>
                                        {' '}y asumo la responsabilidad legal del contenido que subo.
                                    </Text>
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                (isLoading || !acceptedTerms) && styles.registerButtonDisabled
                            ]}
                            onPress={handleRegister}
                            disabled={isLoading || !acceptedTerms}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TermsModal
                        visible={showTermsModal}
                        onClose={() => setShowTermsModal(false)}
                        onAccept={() => {
                            setTermsRead(true);
                            setAcceptedTerms(true);
                        }}
                    />

                    {/* Footer */}
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.loginText, { color: colors.secondaryText }]}>
                            ¿Ya tienes cuenta?{' '}
                            <Text style={[styles.loginTextBold, { color: colors.tint }]}>Inicia Sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 70,
        height: 70,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 28,
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
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    halfInput: {
        flex: 1,
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
    registerButton: {
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
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    loginLink: {
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        fontSize: 15,
        color: '#8E8E93',
    },
    loginTextBold: {
        color: '#007AFF',
        fontWeight: '600',
    },
    termsContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    termsText: {
        fontSize: 13,
        lineHeight: 18,
    },
    termsLink: {
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
