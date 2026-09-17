export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';

export type AlertType = 
  | 'temperature' 
  | 'water' 
  | 'battery' 
  | 'power' 
  | 'solar' 
  | 'humidity' 
  | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface SensorData {
  temperature: number; // °C
  humidity: number; // %
  waterLevel: number; // % (0-100)
  solarVoltage: number; // V
  solarCurrent: number; // A
  solarPower: number; // W
  batteryVoltage: number; // V
  batteryPercentage: number; // %
  coolingStatus: 'ON' | 'OFF';
  fanStatus: 'AUTO' | 'ON' | 'OFF';
  coldPlateStatus: 'COOLING' | 'IDLE' | 'OFF';
  energyMode: 'SOLAR' | 'BATTERY' | 'AUTO';
  alertSystemEnabled: boolean;
  targetTempMin: number; // default 4.0 °C
  targetTempMax: number; // default 10.0 °C
  timestamp: string;
}

export interface HistoricalSensorPoint {
  timestamp: string; // e.g. "10:00 AM" or "Sep 08"
  temperature: number;
  humidity: number;
  solarPower: number;
  batteryVoltage: number;
  waterLevel: number;
}

export interface Produce {
  id: string;
  name: string;
  category: string;
  quantity: number; // kg
  storageDate: string; // e.g. "08 Sep 2026"
  expectedTempRange: string; // e.g. "7°C - 10°C"
  expectedHumidityRange: string; // e.g. "85% - 90%"
  status: 'Good' | 'Attention Needed' | 'Critical';
  notes: string;
}

export interface SystemStatus {
  online: boolean;
  esp32Connected: boolean;
  lastSync: string;
  pendingSync: number;
  simulationRunning: boolean;
  demoMode: boolean;
}

export interface User {
  username: string;
  role: 'Admin' | 'Operator' | 'Viewer';
  isAuthenticated: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface SettingsState {
  storageId: string;
  location: string;
  tempMinThreshold: number;
  tempMaxThreshold: number;
  humidityMinThreshold: number;
  humidityMaxThreshold: number;
  waterLevelLowThreshold: number;
  batteryLowThreshold: number;
  alertPreferences: {
    email: boolean;
    sound: boolean;
    push: boolean;
  };
  language: string;
  theme: 'light' | 'dark';
  deviceProtocol: 'Simulation' | 'REST API' | 'WebSocket' | 'MQTT';
  deviceId: string;
}

export type TimeRange = '24h' | '7d' | '30d';
