
export const INITIAL_DEVICES = [
  {
    id: '1',
    name: 'Sensor Recámara',
    model: 'HT-200',
    serial: 'SN-00123A',
    parameter: 'Temperatura',
    icon: 'thermometer',
    value: '22.5 °C',
    battery: 85,
    status: 'normal',
    channels: 1,
    description: 'Sensor de alta precisión para interiores.'
  },
  {
    id: '2',
    name: 'Bomba de Agua',
    model: 'WP-500',
    serial: 'SN-00456B',
    parameter: 'Presión',
    icon: 'activity',
    value: '45.2 PSI',
    battery: 40,
    status: 'warning',
    channels: 2,
    description: 'Monitoreo de presión en línea principal.'
  },
  {
    id: '3',
    name: 'Caldera Central',
    model: 'CH-900',
    serial: 'SN-00789C',
    parameter: 'Flujo',
    icon: 'droplets',
    value: '0.0 L/min',
    battery: 15,
    status: 'error',
    channels: 3,
    description: 'Control de flujo de calefacción.'
  },
  {
    id: '4',
    name: 'Aire Acondicionado',
    model: 'AC-3000',
    serial: 'SN-00999D',
    parameter: 'Energía',
    icon: 'zap',
    value: '--',
    battery: 0,
    status: 'offline',
    channels: 1,
    description: 'Unidad exterior de climatización.'
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'a1',
    type: 'fallo',
    deviceName: 'Caldera Central',
    model: 'CH-900',
    serial: 'SN-00789C',
    time: '14:30',
    date: '13/03/2026',
    message: 'Fallo crítico en motor de ignición.',
    active: true,
  },
  {
    id: 'a2',
    type: 'alerta',
    deviceName: 'Bomba de Agua',
    model: 'WP-500',
    serial: 'SN-00456B',
    time: '12:15',
    date: '13/03/2026',
    message: 'Presión superior al límite configurado.',
    active: true,
  }
];

export const HISTORIAL_DATA = [
  {
    id: 'h1',
    type: 'alerta',
    deviceName: 'Sensor Recámara',
    model: 'HT-200',
    serial: 'SN-00123A',
    time: '09:00',
    date: '12/03/2026',
    message: 'Batería baja detectada.',
    resolvedAt: '12/03/2026 10:30',
  }
];
