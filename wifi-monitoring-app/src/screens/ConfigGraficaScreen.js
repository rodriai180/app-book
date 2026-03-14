
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../theme/colors';

const ConfigGraficaScreen = ({ route, navigation }) => {
  const { device } = route.params;
  const [name, setName] = useState(device.name);
  const [ch1, setCh1] = useState(true);
  const [ch2, setCh2] = useState(false);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Personalización</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre del Dispositivo</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre ej: Sala"
        />
      </View>

      <Text style={styles.sectionTitle}>Canales Visibles</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Canal Principal ({device.parameter})</Text>
          <Switch value={ch1} onValueChange={setCh1} trackColor={{ true: Colors.primary }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Canal Secundario (Batería)</Text>
          <Switch value={ch2} onValueChange={setCh2} trackColor={{ true: Colors.primary }} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Límites de Ejes (Simulado)</Text>
      <View style={styles.grid}>
        <View style={[styles.card, { width: '48%' }]}>
          <Text style={styles.label}>Superior</Text>
          <TextInput style={styles.smallInput} placeholder="100" keyboardType="numeric" />
        </View>
        <View style={[styles.card, { width: '48%' }]}>
          <Text style={styles.label}>Inferior</Text>
          <TextInput style={styles.smallInput} placeholder="0" keyboardType="numeric" />
        </View>
        <View style={[styles.card, { width: '48%' }]}>
          <Text style={styles.label}>Izquierdo</Text>
          <TextInput style={styles.smallInput} placeholder="Auto" keyboardType="numeric" />
        </View>
        <View style={[styles.card, { width: '48%' }]}>
          <Text style={styles.label}>Derecho</Text>
          <TextInput style={styles.smallInput} placeholder="Auto" keyboardType="numeric" />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.saveBtn}
        onPress={() => {
          Alert.alert('Guardado', 'Los cambios se han guardado localmente.');
          navigation.goBack();
        }}
      >
        <Text style={styles.saveText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallInput: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  }
});

export default ConfigGraficaScreen;
