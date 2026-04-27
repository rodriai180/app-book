import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Book, Compass, Library, LayoutDashboard, Settings, LogOut } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../src/services/themeContext';
import { useAuth } from '../src/services/authContext';

const BASE_NAV_ITEMS = [
    { name: 'index', path: '/(tabs)', label: 'Mi Biblioteca', Icon: Book },
    { name: 'summaries', path: '/(tabs)/summaries', label: 'Descubrir', Icon: Compass },
    { name: 'books', path: '/(tabs)/books', label: 'Libros', Icon: Library },
];

const ADMIN_NAV_ITEM = { name: 'resumenes', path: '/(tabs)/resumenes', label: 'Admin', Icon: LayoutDashboard };

export default function WebSidebar() {
    const { colors, isDark } = useTheme();
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const displayName = user?.displayName || 'Usuario';
    const email = user?.email || '';
    const initials = displayName
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isActive = (name: string) => {
        if (name === 'index') return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
        if (name === 'settings') return pathname === '/settings';
        return pathname === `/${name}` || pathname === `/(tabs)/${name}`;
    };

    const navItemStyle = (active: boolean) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 11,
        paddingVertical: 11,
        paddingHorizontal: 10,
        borderRadius: 9,
        marginBottom: 2,
        backgroundColor: active
            ? (isDark ? 'rgba(77,159,255,0.14)' : 'rgba(0,122,255,0.09)')
            : 'transparent',
    });

    const navTextStyle = (active: boolean) => ({
        fontSize: 14,
        fontWeight: active ? ('700' as const) : ('500' as const),
        color: active ? colors.tint : colors.text,
    });

    const settingsActive = isActive('settings');

    return (
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
                <View style={{ paddingHorizontal: 10, paddingBottom: 28 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: colors.tint, letterSpacing: -0.5 }}>
                        SmartReader
                    </Text>
                </View>

                {[...BASE_NAV_ITEMS, ...(isAdmin ? [ADMIN_NAV_ITEM] : [])].map(({ name, path, label, Icon }) => {
                    const active = isActive(name);
                    return (
                        <TouchableOpacity
                            key={name}
                            onPress={() => router.push(path as any)}
                            activeOpacity={0.7}
                            style={navItemStyle(active)}
                        >
                            <Icon size={19} color={active ? colors.tint : colors.secondaryText} />
                            <Text style={navTextStyle(active)}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Bottom section */}
            <View>
                <TouchableOpacity
                    onPress={() => router.push('/settings')}
                    activeOpacity={0.7}
                    style={{ ...navItemStyle(settingsActive), marginBottom: 8 }}
                >
                    <Settings size={19} color={settingsActive ? colors.tint : colors.secondaryText} />
                    <Text style={navTextStyle(settingsActive)}>Configuración</Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 12 }} />

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
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={1}>
                            {displayName}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.secondaryText }} numberOfLines={1}>
                            {email}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={logout} activeOpacity={0.7}>
                        <LogOut size={17} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
