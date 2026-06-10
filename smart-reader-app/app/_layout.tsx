import { useEffect, useRef } from 'react';
import { LogBox, View, ActivityIndicator, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { AuthProvider, useAuth } from '../src/services/authContext';
import { ThemeProvider, useTheme } from '../src/services/themeContext';
import { SettingsProvider } from '../src/services/settingsContext';
import WebSidebar from '../components/WebSidebar';

// NUCLEAR OPTION: Completely disable the red error box (LogBox)
LogBox.ignoreAllLogs(true);
if (typeof window !== 'undefined') {
    (window as any).__expo_log_box_disabled = true;
}

const DESKTOP_BREAKPOINT = 768;
const FULL_SCREEN_ROUTES = ['/reader', '/login', '/register'];

function RootNavigator() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const didInitialRedirect = useRef(false);

    const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
    const isFullScreen = FULL_SCREEN_ROUTES.some(r => pathname.startsWith(r));
    const showSidebar = isDesktop && !!user && !loading && !isFullScreen;

    useEffect(() => {
        if (loading) return;

        const segs = segments as string[];
        const inAuthGroup = segs[0] === 'login' || segs[0] === 'register';
        const atTabsIndex = segs[0] === '(tabs)' && (!segs[1] || segs[1] === 'index');
        const atRoot = segs.length === 0;

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)/summaries');
        } else if (user && !didInitialRedirect.current && (atRoot || atTabsIndex)) {
            didInitialRedirect.current = true;
            router.replace('/(tabs)/summaries');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const stack = (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="reader" options={{ headerShown: false }} />
            <Stack.Screen name="admin-books" options={{ headerShown: false }} />
            <Stack.Screen name="edit-book" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="microlearning-detail" options={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }} />
            <Stack.Screen name="admin-microlearnings" options={{ headerShown: false }} />
            <Stack.Screen
                name="add-summary"
                options={{
                    title: 'add-summary',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.text,
                    headerTitleStyle: { color: colors.text, fontWeight: '700' },
                }}
            />
        </Stack>
    );

    if (showSidebar) {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <WebSidebar />
                <View style={{ flex: 1 }}>{stack}</View>
            </View>
        );
    }

    return stack;
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
