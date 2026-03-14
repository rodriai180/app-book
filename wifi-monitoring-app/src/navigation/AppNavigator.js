
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Database, Bell, LayoutGrid, Settings as SettingsIcon } from 'lucide-react-native';

import DatosScreen from '../screens/DatosScreen';
import GraficaScreen from '../screens/GraficaScreen';
import ConfigGraficaScreen from '../screens/ConfigGraficaScreen';

import AlertasScreen from '../screens/AlertasScreen';

import DispositivosScreen from '../screens/DispositivosScreen';
import DispositivosListaScreen from '../screens/DispositivosListaScreen';
import DetalleDispositivoScreen from '../screens/DetalleDispositivoScreen';
import RegistroManualScreen from '../screens/RegistroManualScreen';

import ConfigScreen from '../screens/ConfigScreen';
import MiCuentaScreen from '../screens/MiCuentaScreen';
import CrearCuentaScreen from '../screens/CrearCuentaScreen';
import CambiarCorreoScreen from '../screens/CambiarCorreoScreen';
import CambiarPasswordScreen from '../screens/CambiarPasswordScreen';
import SeleccionTonoScreen from '../screens/SeleccionTonoScreen';

import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DatosStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DatosMain" component={DatosScreen} options={{ title: 'Monitoreo' }} />
    <Stack.Screen name="Grafica" component={GraficaScreen} options={{ title: 'Gráfica' }} />
    <Stack.Screen name="ConfigGrafica" component={ConfigGraficaScreen} options={{ title: 'Ajustes de Gráfica' }} />
  </Stack.Navigator>
);

const AlertasStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AlertasMain" component={AlertasScreen} options={{ title: 'Alertas' }} />
  </Stack.Navigator>
);

const DispositivosStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DispositivosMain" component={DispositivosScreen} options={{ title: 'Dispositivos' }} />
    <Stack.Screen name="DispositivosLista" component={DispositivosListaScreen} options={{ title: 'Registrados' }} />
    <Stack.Screen name="DetalleDispositivo" component={DetalleDispositivoScreen} options={{ title: 'Detalle' }} />
    <Stack.Screen name="RegistroManual" component={RegistroManualScreen} options={{ title: 'Vinculación Manual' }} />
  </Stack.Navigator>
);

const ConfigStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ConfigMain" component={ConfigScreen} options={{ title: 'Configuración' }} />
    <Stack.Screen name="MiCuenta" component={MiCuentaScreen} options={{ title: 'Mi Cuenta' }} />
    <Stack.Screen name="CrearCuenta" component={CrearCuentaScreen} options={{ title: 'Registro' }} />
    <Stack.Screen name="CambiarCorreo" component={CambiarCorreoScreen} options={{ title: 'Email' }} />
    <Stack.Screen name="CambiarPassword" component={CambiarPasswordScreen} options={{ title: 'Contraseña' }} />
    <Stack.Screen name="SeleccionTono" component={SeleccionTonoScreen} options={{ title: 'Tonos' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Datos') return <Database color={color} size={size} />;
          if (route.name === 'Alertas') return <Bell color={color} size={size} />;
          if (route.name === 'Dispositivos') return <LayoutGrid color={color} size={size} />;
          if (route.name === 'Config') return <SettingsIcon color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Datos" component={DatosStack} />
      <Tab.Screen name="Alertas" component={AlertasStack} />
      <Tab.Screen name="Dispositivos" component={DispositivosStack} />
      <Tab.Screen name="Config" component={ConfigStack} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
