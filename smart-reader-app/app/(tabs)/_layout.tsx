import { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Book, Settings, Menu } from 'lucide-react-native';
import SideMenu from '../../components/SideMenu';
import { useTheme } from '../../src/services/themeContext';

export default function TabLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const { colors, isDark } = useTheme();

    const MenuButton = () => (
        <TouchableOpacity onPress={toggleMenu} style={{ paddingLeft: 16 }}>
            <Menu size={24} color={colors.text} />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.tint,
                    tabBarInactiveTintColor: colors.secondaryText,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        height: 55,
                    },

                    headerStyle: {
                        backgroundColor: colors.background,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: '700',
                        fontSize: 20,
                        color: colors.text,
                    },
                    headerLeft: () => <MenuButton />,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Mi Biblioteca',
                        tabBarIcon: ({ color }) => <Book size={32} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Ajustes',
                        tabBarIcon: ({ color }) => <Settings size={32} color={color} />,
                    }}
                />
            </Tabs>

            {/* Side Menu overlay */}
            {isMenuOpen && <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        </View>
    );
}
