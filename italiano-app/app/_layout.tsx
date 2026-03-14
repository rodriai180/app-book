import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/services/authContext';
import { ActivityIndicator, View } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.warn("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();



  useEffect(() => {
    if (loading || !navigationState?.key) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, navigationState?.key]);

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#FFFFFF',
      text: '#FFFFFF',
      card: Colors.dark.background,
      background: Colors.dark.background,
      border: Colors.dark.border,
    },
  };

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      text: Colors.light.text,
      card: Colors.light.background,
      background: Colors.light.background,
      border: Colors.light.border,
    },
  };

  if (loading || !navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      <Stack
        screenOptions={{
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : Colors.light.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFFFFF' : Colors.light.text,
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="clase" options={{ title: 'Clase' }} />
        <Stack.Screen name="pratica-saluti" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-sopravvivenza" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-articoli" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-verbi" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-espressioni" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-domande" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-connettori" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-passato" options={{ title: 'Pratica' }} />
        <Stack.Screen name="pratica-partitivi" options={{ title: 'Pratica' }} />
        <Stack.Screen name="reto-rapido" options={{ title: 'Reto Rápido' }} />
        <Stack.Screen name="vocab-detail" options={{ title: 'Detalle' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
