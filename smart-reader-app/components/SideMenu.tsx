import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { LogOut, X, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/services/authContext';
import { useTheme } from '../src/services/themeContext';

const MENU_WIDTH = 300;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const { user, logout } = useAuth();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 280,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 280,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -MENU_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen]);

    // Blur background focus on web when menu opens
    useEffect(() => {
        if (isOpen && Platform.OS === 'web') {
            if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [isOpen]);

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    const displayName = user?.displayName || 'Usuario';
    const email = user?.email || '';
    const initials = displayName
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    if (!isOpen && (fadeAnim as any)._value === 0) {
        // Return minimal view when fully closed to avoid blocking touches
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Overlay */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            {/* Menu Panel */}
            <Animated.View
                style={[
                    styles.menuPanel,
                    {
                        backgroundColor: colors.background,
                        transform: [{ translateX: slideAnim }]
                    },
                ]}
            >
                {/* Close button */}
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.card }]}
                    onPress={onClose}
                >
                    <X size={22} color={colors.secondaryText} />
                </TouchableOpacity>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>{displayName}</Text>
                    <Text style={[styles.userEmail, { color: colors.secondaryText }]} numberOfLines={1}>{email}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Menu Items */}
                <View style={styles.menuItems}>
                    {/* Settings */}
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
                        onPress={() => { onClose(); router.push('/settings'); }}
                    >
                        <Settings size={20} color={colors.text} />
                        <Text style={[styles.menuItemText, { color: colors.text }]}>Configuración</Text>
                    </TouchableOpacity>

                    {/* Spacer to push logout to bottom */}
                    <View style={{ flex: 1 }} />

                    {/* Logout */}
                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: isDark ? 'rgba(255, 59, 48, 0.15)' : '#FFF2F2' }]}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color="#FF3B30" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        elevation: 100,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: MENU_WIDTH,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#8E8E93',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginVertical: 8,
    },
    menuItems: {
        flex: 1,
        gap: 8,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#FFF2F2',
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
});
