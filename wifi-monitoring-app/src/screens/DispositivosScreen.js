
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../theme/colors';
import { Smartphone, PlusCircle, ChevronRight } from 'lucide-react-native';

const DispositivosScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Administración</Text>
      
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('DispositivosLista')}
      >
        <View style={styles.iconCircle}>
          <Smartphone color={Colors.primary} size={28} />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>Dispositivos registrados</Text>
          <Text style={styles.cardSubtitle}>Ver listado técnico de equipos vinculados</Text>
        </View>
        <ChevronRight color={Colors.border} size={24} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('RegistroManual')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
          <PlusCircle color="#10b981" size={28} />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>Registrar dispositivo manualmente</Text>
          <Text style={styles.cardSubtitle}>Configurar equipo mediante número de serie</Text>
        </View>
        <ChevronRight color={Colors.border} size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 24,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  }
});

export default DispositivosScreen;
