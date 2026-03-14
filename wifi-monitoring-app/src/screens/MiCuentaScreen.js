
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

const MiCuentaScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales para administrar tus dispositivos.</Text>
        
        <View style={styles.form}>
            <Text style={styles.label}>Usuario / Email</Text>
            <TextInput style={styles.input} placeholder="ejemplo@gmail.com" />
            
            <Text style={styles.label}>Contraseña</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />
            
            <TouchableOpacity style={styles.forgot}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}>Ingresar</Text>
            </TouchableOpacity>
            
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.or}>o bien</Text>
                <View style={styles.line} />
            </View>
            
            <TouchableOpacity 
                style={styles.registerBtn}
                onPress={() => navigation.navigate('CrearCuenta')}
            >
                <Text style={styles.registerText}>Crear nueva cuenta</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 32 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textLight, marginTop: 8, lineHeight: 22 },
  form: { marginTop: 32 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  forgot: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: Colors.primary, fontWeight: '700' },
  loginBtn: { backgroundColor: Colors.text, padding: 18, borderRadius: 16, alignItems: 'center' },
  loginText: { color: 'white', fontWeight: '800', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  or: { marginHorizontal: 16, color: Colors.textLight, fontSize: 14 },
  registerBtn: { padding: 18, borderRadius: 16, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center' },
  registerText: { color: Colors.primary, fontWeight: '800', fontSize: 16 }
});

export default MiCuentaScreen;
