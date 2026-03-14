import SideMenu from '@/components/SideMenu';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Library, Menu, Milestone, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.text,
          },
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setIsMenuOpen(true)}
              style={{ marginLeft: 16 }}
            >
              <Menu size={24} color={theme.primary} />
            </TouchableOpacity>
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Lecciones',
            tabBarIcon: ({ color }) => <Milestone size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="practica"
          options={{
            title: 'Práctica Rápida',
            tabBarIcon: ({ color }) => <Zap size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="vocabulario"
          options={{
            title: 'Vocabulario',
            tabBarIcon: ({ color }) => <Library size={24} color={color} />,
          }}
        />
      </Tabs>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </View>
  );
}

