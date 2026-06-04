import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { Moon, Sun, SunMoon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
  { label: 'Claro',   value: 'light'  as const, Icon: Sun },
  { label: 'Oscuro',  value: 'dark'   as const, Icon: Moon },
  { label: 'Sistema', value: 'system' as const, Icon: SunMoon },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { preference, setPreference } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Configuración' }} />
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>APARIENCIA</Text>
          <Text style={[styles.label, { color: theme.text }]}>Tema de la aplicación</Text>

          <View style={styles.optionsRow}>
            {OPTIONS.map(({ label, value, Icon }) => {
              const active = preference === value;
              return (
                <TouchableOpacity
                  key={value}
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: active ? theme.primary : theme.border,
                      backgroundColor: active ? theme.primary + '18' : theme.surface,
                    },
                  ]}
                  onPress={() => setPreference(value)}
                >
                  <Icon size={22} color={active ? theme.primary : theme.muted} />
                  <Text style={[styles.optionLabel, { color: active ? theme.primary : theme.muted, fontWeight: active ? '700' : '500' }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  section: { borderRadius: 16, borderWidth: 1, padding: 20, gap: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  label: { fontSize: 16, fontWeight: '600' },
  optionsRow: { flexDirection: 'row', gap: 12 },
  optionCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 12, borderWidth: 2, gap: 8,
  },
  optionLabel: { fontSize: 13 },
});
