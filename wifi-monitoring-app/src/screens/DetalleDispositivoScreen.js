
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Trash2, Info, Activity, Battery, Hash } from 'lucide-react-native';

const DetalleDispositivoScreen = ({ route, navigation }) => {
  const { device } = route.params;
  const { removeDevice } = useApp();

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este dispositivo de la red?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            removeDevice(device.id);
            navigation.popToTop();
          } 
        },
      ]
    );
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.rowLabel}>
        <Icon color={Colors.textLight} size={18} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{device.name}</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>ID: {device.id}X99</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos Técnicos</Text>
        <View style={styles.card}>
          <InfoRow icon={Hash} label="Número de Serie" value={device.serial} />
          <InfoRow icon={Info} label="Modelo" value={device.model} />
          <InfoRow icon={Activity} label="Parámetro" value={device.parameter} />
          <InfoRow icon={Info} label="Canales" value={device.channels} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <View style={styles.card}>
          <InfoRow icon={Battery} label="Batería" value={`${device.battery}%`} />
          <View style={styles.statusRow}>
              <Text style={styles.labelText}>Estado de Red</Text>
              <View style={[styles.statusDot, { backgroundColor: device.status === 'normal' ? '#10b981' : '#f59e0b' }]} />
              <Text style={styles.valueText}>{device.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
        <Trash2 color="#ef4444" size={20} />
        <Text style={styles.deleteText}>Eliminar Dispositivo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  idBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    color: Colors.textLight,
    marginLeft: 10,
    flex: 1,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 32,
    marginBottom: 48,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
  }
});

export default DetalleDispositivoScreen;
