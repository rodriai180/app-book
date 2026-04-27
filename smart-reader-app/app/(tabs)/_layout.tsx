import { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Platform, useWindowDimensions } from 'react-native';
import { Book, Menu, Compass, Library, LayoutDashboard } from 'lucide-react-native';
import SideMenu from '../../components/SideMenu';
import { useTheme } from '../../src/services/themeContext';
import { useAuth } from '../../src/services/authContext';

const DESKTOP_BREAKPOINT = 768;

export default function TabLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { colors } = useTheme();
    const { isAdmin } = useAuth();
    const { width } = useWindowDimensions();

    const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

    // ── Desktop: sin tab bar ni header (el sidebar está en _layout.tsx) ───────
    if (isDesktop) {
        return (
            <Tabs
                initialRouteName="summaries"
                tabBar={() => null}
                screenOptions={{ headerShown: false }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="summaries" />
                <Tabs.Screen name="books" />
                <Tabs.Screen name="resumenes" />
            </Tabs>
        );
    }

    // ── Mobile ────────────────────────────────────────────────────────────────
    const CustomTabBar = ({ state, descriptors, navigation }: any) => (
        <View style={{
            flexDirection: 'row',
            height: 60,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {state.routes.filter((route: any) => route.name !== 'resumenes' || isAdmin).map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.7}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
                    >
                        {options.tabBarIcon && options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? colors.tint : colors.secondaryText,
                            size: 32,
                        })}
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const MenuButton = () => (
        <TouchableOpacity onPress={() => setIsMenuOpen(v => !v)} style={{ paddingLeft: 16 }}>
            <Menu size={24} color={colors.text} />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{ flex: 1 }}
                {...(isMenuOpen ? {
                    'aria-hidden': true,
                    dataSet: { inert: '' },
                } : {})}
            >
                <Tabs
                    initialRouteName="summaries"
                    tabBar={(props) => <CustomTabBar {...props} />}
                    screenOptions={{
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
                        name="summaries"
                        options={{
                            title: 'Descubrir',
                            tabBarIcon: ({ color }) => <Compass size={32} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="books"
                        options={{
                            title: 'Libros',
                            tabBarIcon: ({ color }) => <Library size={32} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="resumenes"
                        options={{
                            title: 'Admin',
                            tabBarIcon: ({ color }) => <LayoutDashboard size={32} color={color} />,
                        }}
                    />
                </Tabs>
            </View>

            {isMenuOpen && <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        </View>
    );
}
