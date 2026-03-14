
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { ChevronRight, Cpu } from 'lucide-react-native';

const DispositivosListaScreen = ({ navigation }) => {
  const { devices } = useApp();

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.row}
            onPress={() => navigation.navigate('DetalleDispositivo', { device: item })}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Cpu color={Colors.primary} size={20} />
              </View>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>{item.model} • SN: {item.serial}</Text>
              </View>
            </View>
            <ChevronRight color={Colors.border} size={20} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  info: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  }
});

export default DispositivosListaScreen;
