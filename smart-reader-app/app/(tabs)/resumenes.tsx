import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, Plus, Zap } from 'lucide-react-native';
import { useTheme } from '../../src/services/themeContext';

export default function AdminDashboard() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = Platform.OS === 'web' && width >= 768;

    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const borderColor = isDark ? '#3A3A3C' : '#E5E5EA';

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: colors.backgroundSecondary }]} edges={['bottom']}>
            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                <Text style={[styles.heading, { color: colors.text }]}>Admin</Text>
                <Text style={[styles.sub, { color: colors.secondaryText }]}>
                    Gestioná el contenido de la app
                </Text>

                <View style={styles.cards}>
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/admin-books')}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: colors.tint + '18' }]}>
                            <BookOpen size={26} color={colors.tint} />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Ver / editar libros</Text>
                            <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
                                Buscá, editá o eliminá libros subidos
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/add-summary')}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: colors.tint + '18' }]}>
                            <Plus size={26} color={colors.tint} />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Agregar libro</Text>
                            <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
                                Subí un nuevo libro desde un JSON
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/admin-microlearnings')}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: colors.tint + '18' }]}>
                            <Zap size={26} color={colors.tint} />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Ver microlearnings</Text>
                            <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
                                Explorá y buscá todos los microlearnings de la app
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { flex: 1, padding: 24 },
    contentDesktop: {},
    heading: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
    sub: { fontSize: 14, marginBottom: 32 },
    cards: { gap: 14 },
    card: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        borderWidth: 1, borderRadius: 14,
        padding: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    iconWrap: {
        width: 52, height: 52, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
    },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
    cardDesc: { fontSize: 13, lineHeight: 18 },
});
