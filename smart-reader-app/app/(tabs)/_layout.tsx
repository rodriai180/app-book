import { useState } from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text, Platform, useWindowDimensions } from 'react-native';
import { Book, Menu, Compass, BookOpen, Settings, LogOut } from 'lucide-react-native';
import SideMenu from '../../components/SideMenu';
import { useTheme } from '../../src/services/themeContext';
import { useAuth } from '../../src/services/authContext';

const DESKTOP_BREAKPOINT = 768;

const NAV_ITEMS = [
    { name: 'index', path: '/(tabs)', label: 'Mi Biblioteca', Icon: Book },
    { name: 'summaries', path: '/(tabs)/summaries', label: 'Descubrir', Icon: Compass },
    { name: 'resumenes', path: '/(tabs)/resumenes', label: 'Resúmenes', Icon: BookOpen },
] as const;

export default function TabLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { colors, isDark } = useTheme();
    const { user, logout } = useAuth();
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const router = useRouter();

    const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

    const displayName = user?.displayName || 'Usuario';
    const email = user?.email || '';
    const initials = displayName
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isNavActive = (name: string) => {
        if (name === 'index') return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
        return pathname === `/(tabs)/${name}`;
    };

    // ── Desktop layout ────────────────────────────────────────────────────────
    if (isDesktop) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>

                {/* Sidebar */}
                <View style={{
                    width: 240,
                    backgroundColor: isDark ? '#111113' : '#F5F5F7',
                    borderRightWidth: 1,
                    borderRightColor: colors.border,
                    paddingTop: 28,
                    paddingBottom: 24,
                    paddingHorizontal: 14,
                    justifyContent: 'space-between',
                }}>

                    {/* Top section */}
                    <View>
                        {/* App name */}
                        <View style={{ paddingHorizontal: 10, paddingBottom: 28 }}>
                            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.tint, letterSpacing: -0.5 }}>
                                SmartReader
                            </Text>
                        </View>

                        {/* Nav items */}
                        {NAV_ITEMS.map(({ name, path, label, Icon }) => {
                            const active = isNavActive(name);
                            return (
                                <TouchableOpacity
                                    key={name}
                                    onPress={() => router.push(path as any)}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 11,
                                        paddingVertical: 11,
                                        paddingHorizontal: 10,
                                        borderRadius: 9,
                                        marginBottom: 2,
                                        backgroundColor: active
                                            ? (isDark ? 'rgba(77,159,255,0.14)' : 'rgba(0,122,255,0.09)')
                                            : 'transparent',
                                    }}
                                >
                                    <Icon size={19} color={active ? colors.tint : colors.secondaryText} />
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: active ? '700' : '500',
                                        color: active ? colors.tint : colors.text,
                                    }}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Bottom section */}
                    <View>
                        {/* Settings */}
                        <TouchableOpacity
                            onPress={() => router.push('/settings')}
                            activeOpacity={0.7}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 11,
                                paddingVertical: 11,
                                paddingHorizontal: 10,
                                borderRadius: 9,
                                marginBottom: 8,
                            }}
                        >
                            <Settings size={19} color={colors.secondaryText} />
                            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>Configuración</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 12 }} />

                        {/* User profile + logout */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            paddingHorizontal: 10,
                        }}>
                            <View style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                backgroundColor: colors.tint,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexShrink: 0,
                            }}>
                                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>{initials}</Text>
                            </View>
                            <View style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    style={{ fontSize: 13, fontWeight: '600', color: colors.text }}
                                    numberOfLines={1}
                                >
                                    {displayName}
                                </Text>
                                <Text
                                    style={{ fontSize: 11, color: colors.secondaryText }}
                                    numberOfLines={1}
                                >
                                    {email}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={logout} activeOpacity={0.7}>
                                <LogOut size={17} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Main content area */}
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <Tabs
                        tabBar={() => null}
                        screenOptions={{ headerShown: false }}
                    >
                        <Tabs.Screen name="index" />
                        <Tabs.Screen name="summaries" />
                        <Tabs.Screen name="resumenes" />
                    </Tabs>
                </View>
            </View>
        );
    }

    // ── Mobile layout (unchanged) ─────────────────────────────────────────────
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
            {state.routes.map((route: any, index: number) => {
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
                {...(isMenuOpen && Platform.OS === 'web' ? {
                    'aria-hidden': true,
                    dataSet: { inert: '' },
                } : {})}
            >
                <Tabs
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
                        name="resumenes"
                        options={{
                            title: 'Resúmenes',
                            tabBarIcon: ({ color }) => <BookOpen size={32} color={color} />,
                        }}
                    />
                </Tabs>
            </View>

            {isMenuOpen && <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        </View>
    );
}
