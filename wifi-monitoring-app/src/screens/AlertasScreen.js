
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert as NativeAlert } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, History as HistoryIcon } from 'lucide-react-native';

const AlertasScreen = () => {
  const [activeTab, setActiveTab] = useState('alertas'); // 'alertas' or 'historial'
  const { activeAlerts, history, resolveAlert } = useApp();

  const renderAlertItem = ({ item, isHistory }) => {
    const isError = item.type === 'fallo';
    return (
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          {isError ? <AlertCircle color={Colors.alert.fallo} size={20} /> : <AlertTriangle color={Colors.alert.activo} size={20} />}
          <Text style={[styles.alertTitle, { color: isError ? Colors.alert.fallo : Colors.alert.activo }]}>
            {isError ? 'FALLO DETECTADO' : 'ALERTA ACTIVA'}
          </Text>
        </View>
        
        <View style={styles.alertBody}>
          <Text style={styles.deviceName}>{item.deviceName}</Text>
          <Text style={styles.deviceInfo}>{item.model} • SN: {item.serial}</Text>
          <Text style={styles.alertMsg}>{item.message}</Text>
          
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{item.time} • {item.date}</Text>
            {isHistory && item.resolvedAt && (
              <Text style={styles.resolvedText}>Resuelto: {item.resolvedAt}</Text>
            )}
          </View>
        </View>

        {!isHistory && (
          <TouchableOpacity 
            style={styles.okBtn}
            onPress={() => resolveAlert(item.id)}
          >
            <CheckCircle2 color="white" size={18} />
            <Text style={styles.okBtnText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAlertasTab = () => {
    const fallos = activeAlerts.filter(a => a.type === 'fallo');
    const activas = activeAlerts.filter(a => a.type === 'alerta');
    
    if (activeAlerts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <CheckCircle2 color={Colors.status.normal.text} size={48} />
          <Text style={styles.emptyText}>No hay alertas activas en este momento.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.listPadding}>
        {fallos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Fallos Recientes</Text>
            {fallos.map(item => renderAlertItem({ item, isHistory: false }))}
          </View>
        )}
        
        {activas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Alertas Activas</Text>
            {activas.map(item => renderAlertItem({ item, isHistory: false }))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'alertas' && styles.tabActive]}
          onPress={() => setActiveTab('alertas')}
        >
          <Text style={[styles.tabText, activeTab === 'alertas' && styles.tabTextActive]}>Alertas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'historial' && styles.tabActive]}
          onPress={() => setActiveTab('historial')}
        >
          <Text style={[styles.tabText, activeTab === 'historial' && styles.tabTextActive]}>Historial</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'alertas' ? renderAlertasTab() : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderAlertItem({ item, isHistory: true })}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <HistoryIcon color={Colors.textLight} size={48} />
              <Text style={styles.emptyText}>El historial está vacío.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  listPadding: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  deviceInfo: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  alertMsg: {
    fontSize: 15,
    color: Colors.text,
    marginTop: 12,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  resolvedText: {
    fontSize: 11,
    color: Colors.status.normal.text,
    fontWeight: '600',
  },
  okBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  okBtnText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  }
});

export default AlertasScreen;
