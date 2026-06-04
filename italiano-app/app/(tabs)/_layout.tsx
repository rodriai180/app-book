import SideMenu from '@/components/SideMenu';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Library, Menu, Milestone, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

function Tricolor({ colors }: { colors: typeof Colors['light'] }) {
  return (
    <View style={{ height: 4, flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <View style={{ flex: 1, backgroundColor: colors.triGreen }} />
      <View style={{ flex: 1, backgroundColor: colors.triWhite }} />
      <View style={{ flex: 1, backgroundColor: colors.triRed }} />
    </View>
  );
}

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
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: theme.background }}>
              <Tricolor colors={theme} />
            </View>
          ),
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: theme.background }}>
              <View style={{ height: 3, flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{ flex: 1, backgroundColor: theme.triGreen }} />
                <View style={{ flex: 1, backgroundColor: theme.triWhite }} />
                <View style={{ flex: 1, backgroundColor: theme.triRed }} />
              </View>
            </View>
          ),
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
        <Tabs.Screen
          name="panel"
          options={{
            title: 'Panel',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
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

