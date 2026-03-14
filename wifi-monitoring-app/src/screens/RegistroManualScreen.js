
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const RegistroManualScreen = ({ navigation }) => {
  const { addDevice } = useApp();
  const [sn, setSn] = useState('');
  const [key, setKey] = useState('');

  const handleRegister = () => {
    if (!sn || !key) {
      Alert.alert('Campos Requeridos', 'Por favor ingresa el número de serie y la clave.');
      return;
    }

    addDevice({
      name: 'Equipo Nuevo',
      model: 'GENERIC-H',
      serial: sn,
      parameter: 'Pendiente',
      icon: 'activity',
      value: '--',
      battery: 100,
      status: 'normal',
      channels: 1,
    });

    Alert.alert('Éxito', 'Dispositivo vinculado correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Número de Serie</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ej: SN-8822-K"
          value={sn}
          onChangeText={setSn}
        />

        <Text style={styles.label}>Clave de Vinculación</Text>
        <TextInput 
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={key}
          onChangeText={setKey}
        />

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.confirmBtn}
            onPress={handleRegister}
          >
            <Text style={styles.confirmText}>Vincular</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textLight,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 2,
    padding: 18,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: '800',
  }
});

export default RegistroManualScreen;
