import React from 'react';
import { Tabs } from 'expo-router';
import { Newspaper, Search, MessageSquare } from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
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
      }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Newspaper size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Edificios',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

