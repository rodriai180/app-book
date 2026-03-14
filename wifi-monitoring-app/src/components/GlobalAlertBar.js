
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { AlertCircle, AlertTriangle, WifiOff, Bell } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

const GlobalAlertBar = () => {
  const { globalAlert } = useApp();

  if (!globalAlert) return null;

  const getAlertConfig = () => {
    switch (globalAlert) {
      case 'fallo':
        return {
          bg: Colors.alert.fallo,
          text: 'Existe un fallo reciente',
          icon: <AlertCircle color="white" size={18} />
        };
      case 'activo':
        return {
          bg: Colors.alert.activo,
          text: 'Hay una alerta activa',
          icon: <AlertTriangle color="white" size={18} />
        };
      case 'anterior':
        return {
          bg: Colors.alert.anterior,
          text: 'Existe una alerta anterior',
          icon: <Bell color="white" size={18} />
        };
      case 'conexion':
        return {
          bg: Colors.alert.conexion,
          text: 'Sin conexión a internet',
          icon: <WifiOff color="white" size={18} />
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      {config.icon}
      <Text style={styles.text}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default GlobalAlertBar;
