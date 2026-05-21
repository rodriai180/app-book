import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function PraticaLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        title: 'Pratica',
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : Colors.light.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colorScheme === 'dark' ? '#FFFFFF' : Colors.light.text,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        },
      }}
    />
  );
}
