
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';

const CrearCuentaScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de Usuario</Text>
        <TextInput style={styles.input} placeholder="Juan Pérez" />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput style={styles.input} placeholder="juan@correo.com" />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

        <TouchableOpacity 
          style={styles.btn}
          onPress={() => {
            Alert.alert('Éxito', 'Cuenta creada correctamente (Simulado)');
            navigation.goBack();
          }}
        >
          <Text style={styles.btnText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 32 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 32 },
  form: { gap: 4 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  btn: { backgroundColor: Colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 16 }
});

export default CrearCuentaScreen;
