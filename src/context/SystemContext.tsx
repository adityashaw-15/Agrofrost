import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  SensorData, 
  HistoricalSensorPoint, 
  Produce, 
  Alert, 
  SystemStatus, 
  User, 
  NotificationItem, 
  SettingsState,
  Severity,
  AlertType
} from '../types';
import { 
  initialSensorData, 
  initialProduceList, 
  initialAlerts, 
  initialNotifications, 
  initialSettings, 
  generate24hHistory, 
  generate7dHistory, 
  generate30dHistory 
} from '../utils/demoData';

interface SystemContextType {
  sensorData: SensorData;
  history24h: HistoricalSensorPoint[];
  history7d: HistoricalSensorPoint[];
  history30d: HistoricalSensorPoint[];
  produceList: Produce[];
  alertsList: Alert[];
  notificationsList: NotificationItem[];
  systemStatus: SystemStatus;
  settings: SettingsState;
  user: User;
  
  // Controls
  toggleCooling: () => void;
  setFanStatus: (status: 'AUTO' | 'ON' | 'OFF') => void;
  setEnergyMode: (mode: 'SOLAR' | 'BATTERY' | 'AUTO') => void;
  toggleAlertSystem: () => void;
  setTargetTempRange: (min: number, max: number) => void;
  
  // Produce actions
  addProduce: (produce: Omit<Produce, 'id'>) => void;
  deleteProduce: (id: string) => void;
  
  // Alert actions
  acknowledgeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  
  // Notification actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // System & Simulation actions
  toggleOfflineMode: () => void;
  syncNow: () => void;
  toggleSimulation: () => void;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  
  // Auth actions
  login: (role: 'Admin' | 'Operator' | 'Viewer') => void;
  logout: () => void;
  
  // Refill water trigger
  refillWaterTank: () => void;
}

const STORAGE_KEY = 'agrofrost_prototype_state_v1';

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if present
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state from localStorage, using defaults', e);
    }
    return null;
  };

  const savedState = loadSavedState();

  const [sensorData, setSensorData] = useState<SensorData>(savedState?.sensorData || initialSensorData);
  const [produceList, setProduceList] = useState<Produce[]>(savedState?.produceList || initialProduceList);
  const [alertsList, setAlertsList] = useState<Alert[]>(savedState?.alertsList || initialAlerts);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(savedState?.notificationsList || initialNotifications);
  const [settings, setSettings] = useState<SettingsState>(savedState?.settings || initialSettings);
  
  const [history24h, setHistory24h] = useState<HistoricalSensorPoint[]>(generate24hHistory());
  const [history7d] = useState<HistoricalSensorPoint[]>(generate7dHistory());
  const [history30d] = useState<HistoricalSensorPoint[]>(generate30dHistory());

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    online: savedState?.systemStatus?.online ?? true,
    esp32Connected: true,
    lastSync: savedState?.systemStatus?.lastSync || 'Today, 10:42 AM',
    pendingSync: savedState?.systemStatus?.pendingSync || 0,
    simulationRunning: true,
    demoMode: true,
  });

  const [user, setUser] = useState<User>({
    username: savedState?.user?.username || 'Demo Operator',
    role: savedState?.user?.role || 'Operator',
    isAuthenticated: savedState?.user?.isAuthenticated ?? true,
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      const stateToSave = {
        sensorData,
        produceList,
        alertsList,
        notificationsList,
        settings,
        systemStatus: {
          online: systemStatus.online,
          lastSync: systemStatus.lastSync,
          pendingSync: systemStatus.pendingSync,
        },
        user,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [sensorData, produceList, alertsList, notificationsList, settings, systemStatus.online, systemStatus.lastSync, systemStatus.pendingSync, user]);

  // Helper to add internal notification
  const addNotification = (message: string, type: 'info' | 'warning' | 'alert' | 'success') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotificationsList(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  // Helper to add alert
  const triggerAlert = (type: AlertType, severity: Severity, message: string) => {
    if (!sensorData.alertSystemEnabled) return;

    // Check duplicate unresolved alert of same message
    const exists = alertsList.some(a => !a.acknowledged && a.message === message);
    if (!exists) {
      const newAlert: Alert = {
        id: `alt-${Date.now()}`,
        type,
        severity,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        acknowledged: false,
      };
      setAlertsList(prev => [newAlert, ...prev]);
      addNotification(message, severity === 'CRITICAL' ? 'alert' : 'warning');
    }
  };

  // Live Hardware Simulation Loop
  useEffect(() => {
    if (!systemStatus.simulationRunning) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        let newTemp = prev.temperature;
        let newColdPlate = prev.coldPlateStatus;
        let newHumidity = prev.humidity;
        let newWater = prev.waterLevel;
        let newBatteryPerc = prev.batteryPercentage;
        let newSolarPower = prev.solarPower;
        let newSolarVoltage = prev.solarVoltage;
        let newSolarCurrent = prev.solarCurrent;

        // 1. Peltier & Cooling Logic simulation
        if (prev.coolingStatus === 'ON') {
          const targetMid = (prev.targetTempMin + prev.targetTempMax) / 2; // e.g. 7°C
          if (newTemp > targetMid) {
            newTemp = Number((newTemp - 0.08 - Math.random() * 0.04).toFixed(1));
            if (newTemp < prev.targetTempMin) newTemp = prev.targetTempMin;
            newColdPlate = 'COOLING';
          } else if (newTemp < prev.targetTempMin) {
            newTemp = Number((newTemp + 0.05).toFixed(1));
            newColdPlate = 'IDLE';
          } else {
            newTemp = Number((newTemp + (Math.random() * 0.08 - 0.04)).toFixed(1));
            newColdPlate = 'COOLING';
          }
        } else {
          // Cooling OFF -> Temperature rises toward ambient ~28°C
          newTemp = Number(Math.min(28.0, newTemp + 0.15 + Math.random() * 0.1).toFixed(1));
          newColdPlate = 'OFF';
        }

        // 2. Humidity fluctuation
        const humDelta = (Math.random() * 0.4 - 0.2);
        newHumidity = Math.min(95, Math.max(50, Math.round(newHumidity + humDelta)));

        // 3. Water level thermal buffer slow decrease
        if (prev.coolingStatus === 'ON' && newWater > 15) {
          newWater = Number((newWater - 0.02).toFixed(1));
        }

        // 4. Solar Generation simulation (simulating day cycle fluctuation)
        const timeNow = new Date();
        const minuteFactor = Math.sin((timeNow.getMinutes() / 60) * Math.PI);
        const basePower = 55 + Math.floor(minuteFactor * 30) + Math.floor(Math.random() * 6 - 3);
        newSolarPower = Math.max(35, Math.min(98, basePower));
        newSolarVoltage = Number((17.5 + (newSolarPower / 100) * 2.2).toFixed(1));
        newSolarCurrent = Number((newSolarPower / newSolarVoltage).toFixed(1));

        // 5. Battery State simulation
        let battVoltage = prev.batteryVoltage;
        if (prev.energyMode === 'SOLAR' || (prev.energyMode === 'AUTO' && newSolarPower > 45)) {
          // Solar is powering system and charging battery
          if (newBatteryPerc < 100) {
            newBatteryPerc = Math.min(100, Number((newBatteryPerc + 0.05).toFixed(1)));
          }
          battVoltage = Number((12.0 + (newBatteryPerc / 100) * 1.2).toFixed(1));
        } else {
          // Operating primarily on Battery
          if (prev.coolingStatus === 'ON') {
            newBatteryPerc = Math.max(5, Number((newBatteryPerc - 0.08).toFixed(1)));
          }
          battVoltage = Number((11.2 + (newBatteryPerc / 100) * 1.4).toFixed(1));
        }

        // Check threshold alerts
        if (newTemp > settings.tempMaxThreshold) {
          triggerAlert('temperature', 'WARNING', `Temperature reached ${newTemp}°C, exceeding maximum target (${settings.tempMaxThreshold}°C).`);
        }
        if (newWater < settings.waterLevelLowThreshold) {
          triggerAlert('water', 'WARNING', `Water level is low (${newWater}%). Please inspect/refill thermal buffering layer.`);
        }
        if (newBatteryPerc < settings.batteryLowThreshold) {
          triggerAlert('battery', 'CRITICAL', `Battery voltage low (${battVoltage}V - ${newBatteryPerc}%). Connect solar charger or grid input.`);
        }

        const updatedTimeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
          ...prev,
          temperature: newTemp,
          coldPlateStatus: newColdPlate,
          humidity: newHumidity,
          waterLevel: newWater,
          solarPower: newSolarPower,
          solarVoltage: newSolarVoltage,
          solarCurrent: newSolarCurrent,
          batteryVoltage: battVoltage,
          batteryPercentage: Math.round(newBatteryPerc),
          timestamp: updatedTimeStamp,
        };
      });

      // Update 24h graph real-time tail point
      setHistory24h(prev => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...last,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          solarPower: sensorData.solarPower,
          batteryVoltage: sensorData.batteryVoltage,
          waterLevel: sensorData.waterLevel,
        };
        return copy;
      });

      // If offline mode, increment pending sync records
      setSystemStatus(prev => {
        if (!prev.online) {
          return { ...prev, pendingSync: prev.pendingSync + 1 };
        }
        return prev;
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [systemStatus.simulationRunning, systemStatus.online, settings, sensorData.temperature, sensorData.humidity, sensorData.solarPower, sensorData.batteryVoltage, sensorData.waterLevel]);

  // Actions
  const toggleCooling = () => {
    setSensorData(prev => {
      const nextStatus = prev.coolingStatus === 'ON' ? 'OFF' : 'ON';
      addNotification(`Cooling system turned ${nextStatus}`, nextStatus === 'ON' ? 'success' : 'warning');
      return {
        ...prev,
        coolingStatus: nextStatus,
        coldPlateStatus: nextStatus === 'ON' ? 'COOLING' : 'OFF',
      };
    });
  };

  const setFanStatus = (status: 'AUTO' | 'ON' | 'OFF') => {
    setSensorData(prev => {
      addNotification(`CPU Heat Dissipation Fan set to ${status}`, 'info');
      return { ...prev, fanStatus: status };
    });
  };

  const setEnergyMode = (mode: 'SOLAR' | 'BATTERY' | 'AUTO') => {
    setSensorData(prev => {
      addNotification(`System energy mode switched to ${mode}`, 'info');
      return { ...prev, energyMode: mode };
    });
  };

  const toggleAlertSystem = () => {
    setSensorData(prev => {
      const nextState = !prev.alertSystemEnabled;
      addNotification(`Smart alert monitoring ${nextState ? 'Enabled' : 'Disabled'}`, nextState ? 'info' : 'warning');
      return { ...prev, alertSystemEnabled: nextState };
    });
  };

  const setTargetTempRange = (min: number, max: number) => {
    setSensorData(prev => {
      addNotification(`Target cooling temperature configured to ${min}°C - ${max}°C`, 'info');
      return { ...prev, targetTempMin: min, targetTempMax: max };
    });
  };

  const addProduce = (newProd: Omit<Produce, 'id'>) => {
    const item: Produce = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProduceList(prev => [item, ...prev]);
    addNotification(`Added new produce batch: ${item.name} (${item.quantity} kg)`, 'success');
  };

  const deleteProduce = (id: string) => {
    setProduceList(prev => prev.filter(p => p.id !== id));
    addNotification('Produce item removed from storage registry', 'info');
  };

  const acknowledgeAlert = (id: string) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const clearAllAlerts = () => {
    setAlertsList([]);
    addNotification('Cleared all alerts history', 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotificationsList([]);
  };

  const toggleOfflineMode = () => {
    setSystemStatus(prev => {
      const isNowOffline = prev.online;
      const nextOnline = !isNowOffline;
      addNotification(
        nextOnline 
          ? 'Network re-connected. Operating in Online Mode.' 
          : 'Internet connection unavailable. Operating in Offline Mode.', 
        nextOnline ? 'success' : 'warning'
      );
      return {
        ...prev,
        online: nextOnline,
      };
    });
  };

  const syncNow = () => {
    setSystemStatus(prev => ({
      ...prev,
      online: true,
      pendingSync: 0,
      lastSync: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    }));
    addNotification('Local data synchronized with AGROFROST cloud registry.', 'success');
  };

  const toggleSimulation = () => {
    setSystemStatus(prev => {
      const nextSim = !prev.simulationRunning;
      addNotification(nextSim ? 'Live simulation resumed.' : 'Live simulation paused.', 'info');
      return { ...prev, simulationRunning: nextSim };
    });
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      addNotification('System settings updated successfully', 'success');
      return updated;
    });
  };

  const login = (role: 'Admin' | 'Operator' | 'Viewer') => {
    setUser({
      username: `${role} User`,
      role,
      isAuthenticated: true,
    });
    addNotification(`Logged in as ${role}`, 'success');
  };

  const logout = () => {
    setUser({
      username: '',
      role: 'Viewer',
      isAuthenticated: false,
    });
    addNotification('Logged out of system', 'info');
  };

  const refillWaterTank = () => {
    setSensorData(prev => ({
      ...prev,
      waterLevel: 98.0,
    }));
    addNotification('Thermal buffering water tank refilled to 98%', 'success');
  };

  return (
    <SystemContext.Provider value={{
      sensorData,
      history24h,
      history7d,
      history30d,
      produceList,
      alertsList,
      notificationsList,
      systemStatus,
      settings,
      user,
      toggleCooling,
      setFanStatus,
      setEnergyMode,
      toggleAlertSystem,
      setTargetTempRange,
      addProduce,
      deleteProduce,
      acknowledgeAlert,
      clearAllAlerts,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      toggleOfflineMode,
      syncNow,
      toggleSimulation,
      updateSettings,
      login,
      logout,
      refillWaterTank,
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
