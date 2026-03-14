import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { ChevronRight, Volume2, Mic2, Languages, Moon, Sun, Play, Check, X } from 'lucide-react-native';
import { useTheme } from '../../src/services/themeContext';
import { useSettings } from '../../src/services/settingsContext';
import { AudioService } from '../../src/services/AudioService';

const RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const PITCHES = [0.5, 1.0, 1.5];
const LANGUAGES = [
    { label: 'Español (ES)', value: 'es-ES' },
    { label: 'Español (AR/UY)', value: 'es-AR' },
    { label: 'English (US)', value: 'en-US' }
];
const VOICES = ['Pablo', 'Sergio'];

export default function SettingsScreen() {
    const { themeMode, setThemeMode, colors, isDark } = useTheme();
    const { settings, updateSettings } = useSettings();

    const [activeModal, setActiveModal] = useState<string | null>(null);

    const toggleTheme = () => {
        if (themeMode === 'system') setThemeMode('light');
        else if (themeMode === 'light') setThemeMode('dark');
        else setThemeMode('system');
    };

    const getThemeLabel = () => {
        if (themeMode === 'system') return 'Sistema';
        return themeMode === 'light' ? 'Claro' : 'Oscuro';
    };

    const playPreview = async () => {
        let text = "Hola, esta es una muestra de mi voz.";
        if (settings.language === 'en-US') {
            text = "Hello, this is a sample of my voice.";
        } else if (settings.language === 'es-AR') {
            text = "Hola che, esta es una muestra de mi voz con este ajuste.";
        }

        await AudioService.speak(text, {
            rate: settings.rate,
            pitch: settings.pitch,
            language: settings.language,
            voice: settings.voice,
        });
    };

    const ChoiceModal = ({ visible, title, options, currentValue, onSelect, onClose }: any) => (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={colors.secondaryText} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.optionsList}>
                        {options.map((opt: any) => {
                            const label = typeof opt === 'object' ? opt.label : (typeof opt === 'number' ? `${opt}x` : opt);
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const isSelected = val === currentValue;

                            return (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.optionItem, isSelected && { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                                    onPress={() => {
                                        onSelect(val);
                                        onClose();
                                    }}
                                >
                                    <Text style={[styles.optionLabel, { color: isSelected ? colors.tint : colors.text, fontWeight: isSelected ? '600' : '400' }]}>
                                        {label}
                                    </Text>
                                    {isSelected && <Check size={20} color={colors.tint} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    const SettingItem = ({ icon: Icon, label, value, onPress, iconBg, showPreview = true }: any) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.itemLeft}>
                <TouchableOpacity
                    style={[styles.iconContainer, { backgroundColor: iconBg || (isDark ? '#2C2C2E' : '#E6F4FE') }]}
                    onPress={showPreview ? (e) => { e.stopPropagation(); playPreview(); } : undefined}
                    disabled={!showPreview}
                >
                    <Icon size={20} color={colors.tint} />
                    {showPreview && (
                        <View style={styles.previewIndicator}>
                            <Play size={8} color="#FFF" fill="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemValue, { color: colors.secondaryText }]}>{value}</Text>
                <ChevronRight size={18} color={isDark ? '#444' : '#C7C7CC'} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Ajustes</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Apariencia</Text>
                    <View style={[styles.card, { backgroundColor: colors.background }]}>
                        <SettingItem
                            icon={isDark ? Moon : Sun}
                            label="Tema"
                            value={getThemeLabel()}
                            onPress={toggleTheme}
                            showPreview={false}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Preferencias de Lectura</Text>
                    <View style={[styles.card, { backgroundColor: colors.background }]}>
                        <SettingItem
                            icon={Mic2}
                            label="Perfil de Voz"
                            value={settings.voice === 'Predeterminada' ? 'Mujer (Elena)' : settings.voice}
                            onPress={() => setActiveModal('voice')}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <SettingItem
                            icon={Volume2}
                            label="Velocidad"
                            value={`${settings.rate}x`}
                            onPress={() => setActiveModal('rate')}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <SettingItem
                            icon={Languages}
                            label="Idioma"
                            value={LANGUAGES.find(l => l.value === settings.language)?.label || settings.language}
                            onPress={() => setActiveModal('language')}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Avanzado</Text>
                    <View style={[styles.card, { backgroundColor: colors.background }]}>
                        <SettingItem
                            icon={Mic2}
                            label="Tono (Pitch)"
                            value={settings.pitch === 1.0 ? 'Natural' : `${settings.pitch === 0.5 ? 'Bajo' : 'Alto'}`}
                            onPress={() => setActiveModal('pitch')}
                        />
                    </View>
                </View>

                <Text style={[styles.footerText, { color: colors.secondaryText }]}>
                    Toca el icono de cualquier ajuste de voz para escuchar una prueba.
                </Text>
            </ScrollView>

            {/* Modals */}
            <ChoiceModal
                visible={activeModal === 'voice'}
                title="Perfil de Voz"
                options={VOICES}
                currentValue={settings.voice}
                onSelect={(val: string) => updateSettings({ voice: val })}
                onClose={() => setActiveModal(null)}
            />
            <ChoiceModal
                visible={activeModal === 'rate'}
                title="Velocidad de lectura"
                options={RATES}
                currentValue={settings.rate}
                onSelect={(val: number) => updateSettings({ rate: val })}
                onClose={() => setActiveModal(null)}
            />
            <ChoiceModal
                visible={activeModal === 'language'}
                title="Idioma del Texto"
                options={LANGUAGES}
                currentValue={settings.language}
                onSelect={(val: string) => updateSettings({ language: val })}
                onClose={() => setActiveModal(null)}
            />
            <ChoiceModal
                visible={activeModal === 'pitch'}
                title="Tono de Voz"
                options={PITCHES.map(p => ({ label: p === 1.0 ? 'Natural' : (p === 0.5 ? 'Bajo' : 'Alto'), value: p }))}
                currentValue={settings.pitch}
                onSelect={(val: number) => updateSettings({ pitch: val })}
                onClose={() => setActiveModal(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
    },
    content: {
        flex: 1,
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 5,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    previewIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#007AFF',
        borderRadius: 6,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    itemLabel: {
        fontSize: 17,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 17,
        marginRight: 8,
    },
    divider: {
        height: 0.5,
        marginLeft: 60,
    },
    footerText: {
        padding: 30,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    optionsList: {
        paddingHorizontal: 10,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        marginBottom: 4,
    },
    optionLabel: {
        fontSize: 17,
    },
});
