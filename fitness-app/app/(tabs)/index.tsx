import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/Themed';
import { Card, Button } from '@/components/SharedComponents';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useWorkout } from '../../context/WorkoutContext';
import { useRouter } from 'expo-router';
import ProgressModal from '../../components/ProgressModal';

export default function InicioScreen() {
  const colorScheme = useColorScheme();
  const { history, progressLogs } = useWorkout();
  const router = useRouter();
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);

  // Get last workout or default
  const lastWorkout = history.length > 0 ? history[0] : null;
  const lastProgress = progressLogs.length > 0 ? progressLogs[0] : null;

  // Get recent exercises
  const recentExercises = history.length > 0
    ? history[0].exercises.map(e => e.name).slice(0, 3).join(', ')
    : 'Ninguno aún';

  const summaries = [
    {
      title: 'Último entrenamiento',
      value: lastWorkout ? 'Completado' : 'Sin sesiones',
      subValue: lastWorkout ? lastWorkout.date : '¡Empieza hoy!',
      icon: 'chevron-right',
      action: () => router.push('/(tabs)/history')
    },
    {
      title: 'Esta semana',
      value: `${history.length} sesiones`,
      subValue: 'Objetivo: 4',
      icon: 'line-chart',
      action: () => router.push('/(tabs)/history')
    },
    {
      title: 'Descanso',
      value: 'Temporizador',
      subValue: 'Acceso rápido',
      icon: 'clock-o',
      action: () => router.push('/(tabs)/rest')
    },
    {
      title: 'Biblioteca',
      value: 'Ejercicios',
      subValue: recentExercises,
      icon: 'list',
      action: () => router.push('/(tabs)/exercises')
    },
    {
      title: 'Progreso',
      value: lastProgress ? `${lastProgress.weight} kg` : 'Registrar',
      subValue: lastProgress ? lastProgress.date : 'Peso y medidas',
      icon: 'dashboard',
      action: () => setIsProgressModalVisible(true)
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.welcomeText}>¡Hola, Guerrero! 👋</Text>

      <View style={styles.grid}>
        {summaries.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.summaryCardWrapper}
            onPress={item.action}
          >
            <Card style={styles.summaryCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <FontAwesome name={item.icon as any} size={16} color={Colors[colorScheme ?? 'light'].tint} />
              </View>
              <Text style={styles.cardValue} numberOfLines={1}>{item.value}</Text>
              <Text style={styles.cardSubValue} numberOfLines={1}>{item.subValue}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => router.push('/(tabs)/train')}>
        <Card style={styles.mainActionCard}>
          <Text style={styles.mainActionTitle}>¿Listo para tu sesión?</Text>
          <Text style={styles.mainActionSub}>Empieza tu entrenamiento de hoy</Text>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>EMPEZAR ENTRENAR</Text>
            <FontAwesome name="play" size={14} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </Card>
      </TouchableOpacity>

      <ProgressModal
        visible={isProgressModalVisible}
        onClose={() => setIsProgressModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  summaryCard: {
    width: '100%',
    minHeight: 100,
    marginBottom: 0, // Reset default card margin
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubValue: {
    fontSize: 11,
    opacity: 0.5,
  },
  mainActionCard: {
    marginTop: 4,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
    padding: 24,
  },
  mainActionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainActionSub: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
