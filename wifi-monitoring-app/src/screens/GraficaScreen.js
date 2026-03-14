
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../theme/colors';
import { Settings, Download, AlertCircle } from 'lucide-react-native';

const GraficaScreen = ({ route, navigation }) => {
  const { device } = route.params;
  const [range, setRange] = useState('1h');
  
  const chartData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        data: [
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20
        ],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: [device.parameter]
  };

  const statusColors = Colors.status[device.status] || Colors.status.normal;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.val}>{device.value}</Text>
        </View>
        <TouchableOpacity 
          style={styles.circleBtn}
          onPress={() => navigation.navigate('ConfigGrafica', { device })}
        >
          <Settings color={Colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      {device.status !== 'normal' && (
        <View style={[styles.alertBox, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
          <AlertCircle color={statusColors.text} size={20} />
          <Text style={[styles.alertText, { color: statusColors.text }]}>
            {device.status === 'error' ? 'Fallo detectado en el equipo' : 'Valor fuera de rango permitido'}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563eb" }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        <View style={styles.rangeToolbar}>
          {['1h', '3h', '12h', '1d', '7d'].map((r) => (
            <TouchableOpacity 
              key={r} 
              style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
              onPress={() => setRange(r)}
            >
              <Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.downloadBtn}
        onPress={() => Alert.alert('Descarga', 'Función disponible próximamente')}
      >
        <Download color="white" size={20} />
        <Text style={styles.downloadText}>Descargar Reporte</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  val: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 4,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  alertText: {
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  rangeToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rangeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  rangeBtnActive: {
    backgroundColor: Colors.primary,
  },
  rangeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textLight,
  },
  rangeTextActive: {
    color: 'white',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text,
    padding: 18,
    borderRadius: 16,
    marginBottom: 40,
  },
  downloadText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  }
});

export default GraficaScreen;
