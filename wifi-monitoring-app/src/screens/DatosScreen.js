
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useApp } from '../context/AppContext';
import DeviceCard from '../components/DeviceCard';
import GlobalAlertBar from '../components/GlobalAlertBar';
import { Colors } from '../theme/colors';

const DatosScreen = ({ navigation }) => {
  const { devices } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <GlobalAlertBar />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceCard 
            device={item} 
            onPress={(dev) => navigation.navigate('Grafica', { device: dev })}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Mis Equipos</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
    marginTop: 10,
  }
});

export default DatosScreen;
