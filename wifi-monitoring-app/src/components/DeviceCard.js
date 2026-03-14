
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Battery, Thermometer, Activity, Droplets, Zap, ChevronRight } from 'lucide-react-native';

const DeviceCard = ({ device, onPress }) => {
  const statusColors = Colors.status[device.status] || Colors.status.normal;

  const getIcon = () => {
    const props = { color: statusColors.text, size: 24 };
    switch (device.icon) {
      case 'thermometer': return <Thermometer {...props} />;
      case 'activity': return <Activity {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'zap': return <Zap {...props} />;
      default: return <Activity {...props} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]} 
      onPress={() => onPress(device)}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.sn}>{device.model} • {device.serial}</Text>
        </View>
        <View style={styles.batteryContainer}>
          <Battery size={14} color={device.battery < 20 ? Colors.notification : statusColors.text} />
          <Text style={[styles.batteryText, { color: statusColors.text }]}>{device.battery}%</Text>
        </View>
      </View>
      
      <View style={styles.body}>
        <View style={styles.valueRow}>
          {getIcon()}
          <View style={styles.valueContainer}>
            <Text style={styles.param}>{device.parameter}</Text>
            <Text style={[styles.value, { color: statusColors.text }]}>{device.value}</Text>
          </View>
        </View>
        <ChevronRight color={Colors.border} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sn: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainer: {
    marginLeft: 12,
  },
  param: {
    fontSize: 12,
    color: Colors.textLight,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  }
});

export default DeviceCard;
