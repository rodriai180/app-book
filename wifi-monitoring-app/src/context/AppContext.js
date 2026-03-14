
import React, { createContext, useState, useContext } from 'react';
import { INITIAL_DEVICES, INITIAL_ALERTS, HISTORIAL_DATA } from '../mocks/data';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [activeAlerts, setActiveAlerts] = useState(INITIAL_ALERTS);
  const [history, setHistory] = useState(HISTORIAL_DATA);
  const [globalAlert, setGlobalAlert] = useState('fallo'); // 'fallo', 'activo', 'anterior', 'conexion', null

  const resolveAlert = (alertId) => {
    const alertToResolve = activeAlerts.find(a => a.id === alertId);
    if (alertToResolve) {
      setActiveAlerts(activeAlerts.filter(a => a.id !== alertId));
      setHistory([{ ...alertToResolve, active: false, resolvedAt: new Date().toLocaleString() }, ...history]);
    }
  };

  const addDevice = (newDevice) => {
    setDevices([...devices, { ...newDevice, id: Date.now().toString() }]);
  };

  const removeDevice = (deviceId) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  return (
    <AppContext.Provider value={{
      devices,
      activeAlerts,
      history,
      globalAlert,
      resolveAlert,
      addDevice,
      removeDevice,
      setGlobalAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
