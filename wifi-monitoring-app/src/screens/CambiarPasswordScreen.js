
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';

const CambiarPasswordScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contraseña Actual</Text>
      <TextInput style={styles.input} secureTextEntry />
      
      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput style={styles.input} secureTextEntry />

      <TouchableOpacity 
        style={styles.btn}
        onPress={() => {
          Alert.alert('Actualizado', 'Tu contraseña ha sido actualizada.');
          navigation.goBack();
        }}
      >
        <Text style={styles.btnText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  btn: { backgroundColor: Colors.primary, padding: 18, borderRadius: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '800' }
});

export default CambiarPasswordScreen;
