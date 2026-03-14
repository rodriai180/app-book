import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Card, Button } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useWorkout, ProgressEntry } from '@/context/WorkoutContext';

interface ProgressModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ProgressModal({ visible, onClose }: ProgressModalProps) {
    const { addProgressEntry, progressLogs } = useWorkout();

    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [chest, setChest] = useState('');
    const [hips, setHips] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'registro' | 'historial'>('registro');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!weight) {
            Alert.alert('Error', 'El peso es obligatorio.');
            return;
        }

        const newEntry: ProgressEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
            weight,
            waist,
            chest,
            hips,
            photoUri
        };

        addProgressEntry(newEntry);

        // Reset and notify
        setWeight('');
        setWaist('');
        setChest('');
        setHips('');
        setPhotoUri(undefined);
        Alert.alert('¡Guardado!', 'Tu progreso ha sido registrado correctamente.');
        setActiveTab('historial');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Progreso Corporal</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome name="times" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'registro' && styles.activeTab]}
                            onPress={() => setActiveTab('registro')}
                        >
                            <Text style={[styles.tabText, activeTab === 'registro' && styles.activeTabText]}>REGISTRAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'historial' && styles.activeTab]}
                            onPress={() => setActiveTab('historial')}
                        >
                            <Text style={[styles.tabText, activeTab === 'historial' && styles.activeTabText]}>EVOLUCIÓN</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'registro' ? (
                        <ScrollView style={styles.body}>
                            <Card style={styles.formCard}>
                                <Text style={styles.formLabel}>Peso (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: 75.5"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />

                                <View style={styles.measurementsRow}>
                                    <View style={styles.measurementCol}>
                                        <Text style={styles.formLabel}>Cintura (cm)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="80"
                                            keyboardType="numeric"
                                            value={waist}
                                            onChangeText={setWaist}
                                        />
                                    </View>
                                    <View style={styles.measurementCol}>
                                        <Text style={styles.formLabel}>Pecho (cm)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="100"
                                            keyboardType="numeric"
                                            value={chest}
                                            onChangeText={setChest}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.formLabel}>Cadera (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="95"
                                    keyboardType="numeric"
                                    value={hips}
                                    onChangeText={setHips}
                                />
                            </Card>

                            <Card style={styles.photoCard}>
                                <Text style={styles.formLabel}>Foto de Progreso</Text>
                                {photoUri ? (
                                    <View style={styles.photoPreviewContainer}>
                                        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                                        <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(undefined)}>
                                            <FontAwesome name="trash" size={20} color="#ff4444" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                        <FontAwesome name="camera" size={30} color="#2f95dc" />
                                        <Text style={styles.photoButtonText}>Añadir Foto</Text>
                                    </TouchableOpacity>
                                )}
                            </Card>

                            <Button title="GUARDAR REGISTRO" onPress={handleSave} style={styles.saveBtn} />
                        </ScrollView>
                    ) : (
                        <ScrollView style={styles.body}>
                            {progressLogs.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <FontAwesome name="line-chart" size={50} color="#ddd" />
                                    <Text style={styles.emptyText}>No hay registros aún.</Text>
                                </View>
                            ) : (
                                progressLogs.map((log) => (
                                    <Card key={log.id} style={styles.logCard}>
                                        <View style={styles.logHeader}>
                                            <Text style={styles.logDate}>{log.date}</Text>
                                            <Text style={styles.logWeight}>{log.weight} kg</Text>
                                        </View>
                                        <View style={styles.logStats}>
                                            <View style={styles.logStatItem}>
                                                <Text style={styles.logStatLabel}>Cintura</Text>
                                                <Text style={styles.logStatValue}>{log.waist || '--'} cm</Text>
                                            </View>
                                            <View style={styles.logStatItem}>
                                                <Text style={styles.logStatLabel}>Pecho</Text>
                                                <Text style={styles.logStatValue}>{log.chest || '--'} cm</Text>
                                            </View>
                                            <View style={styles.logStatItem}>
                                                <Text style={styles.logStatLabel}>Cadera</Text>
                                                <Text style={styles.logStatValue}>{log.hips || '--'} cm</Text>
                                            </View>
                                        </View>
                                        {log.photoUri && (
                                            <Image source={{ uri: log.photoUri }} style={styles.logPhoto} />
                                        )}
                                    </Card>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
    },
    activeTabText: {
        color: '#2f95dc',
    },
    body: {
        flex: 1,
    },
    formCard: {
        padding: 16,
        marginBottom: 16,
    },
    formLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    measurementsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    measurementCol: {
        width: '48%',
    },
    photoCard: {
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    photoButton: {
        width: '100%',
        height: 120,
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoButtonText: {
        marginTop: 8,
        color: '#2f95dc',
        fontWeight: 'bold',
    },
    photoPreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removePhoto: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    saveBtn: {
        marginBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
        opacity: 0.3,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
    logCard: {
        padding: 16,
        marginBottom: 12,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    logDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2f95dc',
    },
    logWeight: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logStatItem: {
        alignItems: 'center',
    },
    logStatLabel: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
    },
    logStatValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    logPhoto: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginTop: 16,
        resizeMode: 'cover',
    }
});
