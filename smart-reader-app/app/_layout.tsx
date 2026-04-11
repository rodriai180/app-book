import { useEffect } from 'react';
import { LogBox, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/services/authContext';
import { ThemeProvider } from '../src/services/themeContext';
import { SettingsProvider } from '../src/services/settingsContext';

// NUCLEAR OPTION: Completely disable the red error box (LogBox)
LogBox.ignoreAllLogs(true);
if (typeof window !== 'undefined') {
    (window as any).__expo_log_box_disabled = true;
}


function RootNavigator() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="reader" options={{ headerShown: false }} />
            <Stack.Screen name="admin-books" options={{ headerShown: false }} />
            <Stack.Screen name="edit-book" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <ThemeProvider>
                    <RootNavigator />
                </ThemeProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
