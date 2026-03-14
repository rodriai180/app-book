import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/services/authContext';
import { ChevronRight, LogOut, Mail, User, X } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}



export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const { user, logout, userData } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [isVisible, setIsVisible] = React.useState(isOpen);
    const slideAnim = React.useRef(new Animated.Value(-MENU_WIDTH)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
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
            ]).start(({ finished }) => {
                if (finished) setIsVisible(false);
            });
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
            {/* Backdrop */}
            <Animated.View
                style={[
                    styles.backdrop,
                    { opacity: fadeAnim }
                ]}
            >
                <Pressable style={styles.flex1} onPress={onClose} />
            </Animated.View>

            {/* Menu Content */}
            <Animated.View
                style={[
                    styles.menuContainer,
                    {
                        backgroundColor: colors.background,
                        transform: [{ translateX: slideAnim }],
                        borderRightColor: colors.border
                    }
                ]}
            >
                <SafeAreaView style={styles.flex1}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
                            <User size={40} color={colors.primary} />
                        </View>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {userData?.name || user?.displayName || 'Studente'}
                        </Text>
                        <View style={styles.emailContainer}>
                            <Mail size={14} color={colors.muted} style={styles.mailIcon} />
                            <Text style={[styles.userEmail, { color: colors.muted }]}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.content}>
                        <Text style={[styles.sectionTitle, { color: colors.muted }]}>CUENTA</Text>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <User size={20} color={colors.primary} />
                                <Text style={[styles.menuItemText, { color: colors.text }]}>Perfil</Text>
                            </View>
                            <ChevronRight size={18} color={colors.muted} />
                        </TouchableOpacity>


                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.logoutButton, { borderColor: colors.error }]}
                            onPress={() => {
                                onClose();
                                logout();
                            }}
                        >
                            <LogOut size={20} color={colors.error} />
                            <Text style={[styles.logoutText, { color: colors.error }]}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                        <Text style={[styles.versionText, { color: colors.muted }]}>v1.0.0</Text>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        borderRightWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        padding: 24,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-start',
        marginBottom: 8,
        padding: 4,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mailIcon: {
        opacity: 0.7,
    },
    userEmail: {
        fontSize: 14,
    },
    divider: {
        height: 1,
        marginHorizontal: 24,
    },
    content: {
        flex: 1,
        padding: 24,
        gap: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        padding: 24,
        gap: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.5,
    },
});
