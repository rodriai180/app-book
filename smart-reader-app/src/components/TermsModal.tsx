import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { X, ShieldCheck, Info, Scale, Lock, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../services/themeContext';

interface TermsModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, onAccept }) => {
    const { colors, isDark } = useTheme();
    const [hasReachedBottom, setHasReachedBottom] = React.useState(false);

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

        if (isCloseToBottom && !hasReachedBottom) {
            setHasReachedBottom(true);
        }
    };

    const handleAccept = () => {
        onAccept();
        onClose();
    };

    const Section = ({ icon: Icon, title, content }: any) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F7' }]}>
                    <Icon size={18} color={colors.tint} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <Text style={[styles.sectionContent, { color: colors.secondaryText }]}>{content}</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, { borderBottomColor: isDark ? '#38383A' : '#E5E5EA' }]}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Términos y Condiciones</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.secondaryText} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <View style={styles.introContainer}>
                            <View style={[styles.mainIconContainer, { backgroundColor: colors.tint + '15' }]}>
                                <ShieldCheck size={40} color={colors.tint} />
                            </View>
                            <Text style={[styles.introText, { color: colors.text }]}>
                                Al usar Smart Reader, aceptas cumplir con las siguientes normas para garantizar una experiencia segura y legal para todos.
                            </Text>
                        </View>

                        <View style={styles.sectionsContainer}>
                            <Section
                                icon={Info}
                                title="1. Aceptación de los Términos"
                                content="Al crear una cuenta, aceptas quedar vinculado por estos términos. Si no estás de acuerdo con alguna parte, no podrás utilizar los servicios de Smart Reader."
                            />

                            <Section
                                icon={Scale}
                                title="2. Responsabilidad de Contenido (Crítico)"
                                content="Smart Reader es una herramienta de procesamiento de documentos. Usted declara y garantiza que posee los derechos legales o el permiso explícito del autor para subir cualquier PDF a esta plataforma. El usuario asume toda la responsabilidad legal por infracciones de propiedad intelectual."
                            />

                            <Section
                                icon={Lock}
                                title="3. Privacidad y Seguridad"
                                content="Tus documentos son privados y solo tú puedes acceder a ellos. Tus datos de cuenta se gestionan a través de Firebase con altos estándares de seguridad. No compartimos tu información con terceros."
                            />

                            <Section
                                icon={RefreshCw}
                                title="4. Uso del Servicio"
                                content="Nos reservamos el derecho de modificar o retirar el servicio en cualquier momento. El uso indebido de la plataforma (intento de hackeo, distribución de malware, etc.) resultará en la cancelación inmediata de la cuenta."
                            />

                            <Section
                                icon={ShieldCheck}
                                title="5. Limitación de Responsabilidad"
                                content="Smart Reader no será responsable de daños indirectos, incidentales o consecuentes derivados del uso de la herramienta. El procesamiento de texto por IA se ofrece 'tal cual' sin garantías de exactitud absoluta."
                            />
                        </View>

                        {!hasReachedBottom && (
                            <View style={[styles.scrollNotice, { backgroundColor: isDark ? '#1C1C1E' : '#F9F9FB' }]}>
                                <Text style={[styles.scrollNoticeText, { color: colors.secondaryText }]}>
                                    Por favor, desplázate hasta el final para poder aceptar.
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.acceptButton,
                                { backgroundColor: hasReachedBottom ? colors.tint : (isDark ? '#38383A' : '#E5E5EA') }
                            ]}
                            onPress={handleAccept}
                            disabled={!hasReachedBottom}
                        >
                            <Text style={[
                                styles.acceptButtonText,
                                !hasReachedBottom && { color: colors.secondaryText }
                            ]}>
                                {hasReachedBottom ? 'He leído y acepto' : 'Lee hasta el final'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footerSpacer} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: '92%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    introContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mainIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    introText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    sectionsContainer: {
        gap: 24,
        marginBottom: 32,
    },
    section: {
        gap: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 20,
    },
    acceptButton: {
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    scrollNotice: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    scrollNoticeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    footerSpacer: {
        height: 40,
    },
});
