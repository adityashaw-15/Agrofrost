import type { SensorData, HistoricalSensorPoint, Produce, Alert, SettingsState, NotificationItem } from '../types';

export const initialSensorData: SensorData = {
  temperature: 8.4,
  humidity: 72,
  waterLevel: 78,
  solarVoltage: 18.6,
  solarCurrent: 3.4,
  solarPower: 63,
  batteryVoltage: 12.2,
  batteryPercentage: 82,
  coolingStatus: 'ON',
  fanStatus: 'AUTO',
  coldPlateStatus: 'COOLING',
  energyMode: 'SOLAR',
  alertSystemEnabled: true,
  targetTempMin: 4.0,
  targetTempMax: 10.0,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
};

export const initialProduceList: Produce[] = [
  {
    id: 'prod-1',
    name: 'Tomatoes (Assamese Native)',
    category: 'Nightshades',
    quantity: 25,
    storageDate: '08 Sep 2026',
    expectedTempRange: '7°C - 10°C',
    expectedHumidityRange: '85% - 90%',
    status: 'Good',
    notes: 'Harvested from Sonitpur cluster. High moisture content.',
  },
  {
    id: 'prod-2',
    name: 'Cabbage (Green)',
    category: 'Brassica',
    quantity: 40,
    storageDate: '07 Sep 2026',
    expectedTempRange: '0°C - 4°C',
    expectedHumidityRange: '90% - 95%',
    status: 'Good',
    notes: 'Wrapped in porous perforated film for airflow.',
  },
  {
    id: 'prod-3',
    name: 'French Beans',
    category: 'Legumes',
    quantity: 15,
    storageDate: '08 Sep 2026',
    expectedTempRange: '4°C - 7°C',
    expectedHumidityRange: '85% - 90%',
    status: 'Good',
    notes: 'Sensitive to dehydration. Keep near thermal buffer layer.',
  },
  {
    id: 'prod-4',
    name: 'Mustard Greens & Spinach',
    category: 'Leafy Vegetables',
    quantity: 18,
    storageDate: '08 Sep 2026',
    expectedTempRange: '2°C - 5°C',
    expectedHumidityRange: '90% - 95%',
    status: 'Attention Needed',
    notes: 'High respiration rate. Recommended storage conditions vary by produce type.',
  },
  {
    id: 'prod-5',
    name: 'King Chilli (Bhut Jolokia)',
    category: 'Spices / Peppers',
    quantity: 12,
    storageDate: '06 Sep 2026',
    expectedTempRange: '8°C - 12°C',
    expectedHumidityRange: '80% - 85%',
    status: 'Good',
    notes: 'Geographical Indication (GI) crop of NER. Value preservation critical.',
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'alt-1',
    type: 'water',
    severity: 'WARNING',
    message: 'Water level is approaching low threshold (78%). Please monitor thermal buffering layer.',
    timestamp: 'Today, 09:15 AM',
    acknowledged: false,
  },
  {
    id: 'alt-2',
    type: 'temperature',
    severity: 'INFO',
    message: 'Target storage temperature stabilized at 8.4°C.',
    timestamp: 'Today, 08:30 AM',
    acknowledged: true,
  },
  {
    id: 'alt-3',
    type: 'solar',
    severity: 'INFO',
    message: 'Solar panel input peak generation reached 67W.',
    timestamp: 'Today, 11:45 AM',
    acknowledged: true,
  },
  {
    id: 'alt-4',
    type: 'battery',
    severity: 'WARNING',
    message: 'Battery voltage dropped to 11.9V during early morning cooling boost.',
    timestamp: 'Yesterday, 05:20 AM',
    acknowledged: true,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    message: 'Temperature stable at 8.4°C',
    timestamp: '10 mins ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    message: 'Battery reached 82%',
    timestamp: '25 mins ago',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-3',
    message: 'Solar generation increased to 63W',
    timestamp: '1 hour ago',
    read: true,
    type: 'info',
  },
  {
    id: 'notif-4',
    message: 'Water level normal (78%)',
    timestamp: '2 hours ago',
    read: true,
    type: 'info',
  },
  {
    id: 'notif-5',
    message: 'Temperature warning threshold updated in Settings',
    timestamp: 'Yesterday',
    read: true,
    type: 'warning',
  },
];

export const initialSettings: SettingsState = {
  storageId: 'JARVIS-CS-001',
  location: 'NER Rural Agricultural Cluster (Sonitpur, Assam)',
  tempMinThreshold: 4.0,
  tempMaxThreshold: 10.0,
  humidityMinThreshold: 60.0,
  humidityMaxThreshold: 85.0,
  waterLevelLowThreshold: 40.0,
  batteryLowThreshold: 20.0,
  alertPreferences: {
    email: true,
    sound: true,
    push: true,
  },
  language: 'English (NER Regional preset)',
  theme: 'light',
  deviceProtocol: 'Simulation',
  deviceId: 'ESP32-CS-001',
};

// Generator for historical demo graph points
export const generate24hHistory = (): HistoricalSensorPoint[] => {
  const points: HistoricalSensorPoint[] = [];
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'
  ];
  
  const tempBase = [9.2, 9.4, 9.8, 9.1, 8.2, 7.8, 8.1, 8.4, 8.6, 8.5, 8.7, 9.0, 8.4];
  const humBase  = [78, 80, 81, 79, 74, 71, 68, 72, 70, 73, 76, 77, 72];
  const solarBase= [0,  0,  0,  12, 35, 64, 88, 95, 78, 30, 0,  0,  0];
  const battBase = [75, 72, 69, 70, 76, 81, 89, 94, 92, 88, 84, 82, 82];
  const waterBase= [82, 82, 81, 81, 80, 80, 79, 79, 78, 78, 78, 78, 78];

  hours.forEach((h, i) => {
    points.push({
      timestamp: h,
      temperature: tempBase[i],
      humidity: humBase[i],
      solarPower: solarBase[i],
      batteryVoltage: Number((11.5 + (battBase[i] / 100) * 1.5).toFixed(1)),
      waterLevel: waterBase[i],
    });
  });

  return points;
};

export const generate7dHistory = (): HistoricalSensorPoint[] => {
  const points: HistoricalSensorPoint[] = [];
  const days = ['Sep 02', 'Sep 03', 'Sep 04', 'Sep 05', 'Sep 06', 'Sep 07', 'Sep 08'];
  
  const temps = [8.1, 8.6, 8.3, 7.9, 8.5, 8.2, 8.4];
  const hums  = [70, 75, 73, 76, 71, 74, 72];
  const solars= [68, 74, 52, 81, 79, 65, 72];
  const batts = [80, 84, 78, 88, 85, 81, 82];
  const waters= [88, 86, 84, 82, 81, 79, 78];

  days.forEach((d, i) => {
    points.push({
      timestamp: d,
      temperature: temps[i],
      humidity: hums[i],
      solarPower: solars[i],
      batteryVoltage: Number((11.5 + (batts[i] / 100) * 1.5).toFixed(1)),
      waterLevel: waters[i],
    });
  });

  return points;
};

export const generate30dHistory = (): HistoricalSensorPoint[] => {
  const points: HistoricalSensorPoint[] = [];
  for (let i = 1; i <= 30; i += 3) {
    const dayStr = `Aug ${i < 10 ? '0' + i : i}`;
    const randTemp = Number((7.8 + (i % 5) * 0.3 + (i % 2) * 0.2).toFixed(1));
    const randHum = Math.round(68 + (i % 7) * 1.5);
    const randSolar = Math.round(55 + (i % 9) * 4);
    const randBatt = Math.round(75 + (i % 6) * 3);
    const randWater = Math.max(40, Math.round(95 - i * 0.6));

    points.push({
      timestamp: dayStr,
      temperature: randTemp,
      humidity: randHum,
      solarPower: randSolar,
      batteryVoltage: Number((11.6 + (randBatt / 100) * 1.4).toFixed(1)),
      waterLevel: randWater,
    });
  }
  return points;
};
