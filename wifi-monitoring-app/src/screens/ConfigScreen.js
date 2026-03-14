
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Colors } from '../theme/colors';
import { User, Mail, Lock, Trash2, Smartphone, Volume2, Bell, Zap, Music, ChevronRight } from 'lucide-react-native';

const ConfigScreen = ({ navigation }) => {
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [notif, setNotif] = useState(true);
  const [auto, setAuto] = useState(true);
  const [email, setEmail] = useState(false);

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const Row = ({ icon: Icon, label, onPress, rightContent, noBorder }) => (
    <TouchableOpacity 
      style={[styles.row, noBorder && { borderBottomWidth: 0 }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Icon color={Colors.primary} size={20} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {rightContent}
        {onPress && <ChevronRight color={Colors.border} size={20} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ajustes</Text>

      <Section title="Cuenta">
        <Row icon={User} label="Mi cuenta" onPress={() => navigation.navigate('MiCuenta')} />
        <Row icon={Mail} label="Cambiar correo" onPress={() => navigation.navigate('CambiarCorreo')} />
        <Row icon={Lock} label="Cambiar contraseña" onPress={() => navigation.navigate('CambiarPassword')} />
        <Row icon={Trash2} label="Eliminar cuenta" onPress={() => navigation.navigate('MiCuenta')} noBorder />
      </Section>

      <Section title="Alertas">
        <Row 
          icon={Smartphone} 
          label="Vibración" 
          rightContent={<Switch value={vibration} onValueChange={setVibration} trackColor={{ true: Colors.primary }} />} 
        />
        <Row 
          icon={Volume2} 
          label="Sonido" 
          onPress={() => navigation.navigate('SeleccionTono')}
          rightContent={<Switch value={sound} onValueChange={setSound} trackColor={{ true: Colors.primary }} />} 
        />
        <Row 
          icon={Bell} 
          label="Notificación" 
          rightContent={<Switch value={notif} onValueChange={setNotif} trackColor={{ true: Colors.primary }} />} 
        />
        <Row 
          icon={Zap} 
          label="Verificación automática" 
          rightContent={<Switch value={auto} onValueChange={setAuto} trackColor={{ true: Colors.primary }} />} 
        />
        <Row 
          icon={Mail} 
          label="Enviar correo" 
          rightContent={<Switch value={email} onValueChange={setEmail} trackColor={{ true: Colors.primary }} />} 
          noBorder 
        />
      </Section>

      <View style={styles.footer}>
          <Text style={styles.version}>Monitoring App v1.0.0 (Demo)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
    marginTop: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 60,
  },
  version: {
      fontSize: 12,
      color: Colors.textLight,
  }
});

export default ConfigScreen;
