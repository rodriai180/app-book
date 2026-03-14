
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Music, Check } from 'lucide-react-native';

const TONOS = ['Tono Estándar', 'Eco Digital', 'Alerta Urgente', 'Suave', 'Campanas'];

const SeleccionTonoScreen = ({ navigation }) => {
  const [selected, setSelected] = useState('Tono Estándar');

  return (
    <View style={styles.container}>
      <FlatList
        data={TONOS}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.row}
            onPress={() => setSelected(item)}
          >
            <View style={styles.rowLeft}>
              <Music color={Colors.textLight} size={20} />
              <Text style={[styles.text, selected === item && styles.selectedText]}>{item}</Text>
            </View>
            {selected === item && <Check color={Colors.primary} size={20} />}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 16, color: Colors.text, marginLeft: 12 },
  selectedText: { color: Colors.primary, fontWeight: '700' },
  btn: { backgroundColor: Colors.primary, margin: 24, padding: 18, borderRadius: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '800' }
});

export default SeleccionTonoScreen;
