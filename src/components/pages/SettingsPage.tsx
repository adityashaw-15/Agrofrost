import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Globe, 
  Bell, 
  Thermometer, 
  Droplets, 
  Battery, 
  Sun,
  Activity,
  Layers
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSystem();

  const [storageId, setStorageId] = useState(settings.storageId);
  const [location, setLocation] = useState(settings.location);
  const [tempMin, setTempMin] = useState(settings.tempMinThreshold);
  const [tempMax, setTempMax] = useState(settings.tempMaxThreshold);
  const [humidityMin, setHumidityMin] = useState(settings.humidityMinThreshold);
  const [humidityMax, setHumidityMax] = useState(settings.humidityMaxThreshold);
  const [waterLow, setWaterLow] = useState(settings.waterLevelLowThreshold);
  const [batteryLow, setBatteryLow] = useState(settings.batteryLowThreshold);
  const [language, setLanguage] = useState(settings.language);
  const [deviceProtocol, setDeviceProtocol] = useState(settings.deviceProtocol);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storageId,
      location,
      tempMinThreshold: tempMin,
      tempMaxThreshold: tempMax,
      humidityMinThreshold: humidityMin,
      humidityMaxThreshold: humidityMax,
      waterLevelLowThreshold: waterLow,
      batteryLowThreshold: batteryLow,
      language,
      deviceProtocol,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const deviceHealth = [
    { name: 'ESP32 Microcontroller', status: 'Healthy', details: 'Dual-Core Tensilica Xtensa @ 240MHz', icon: Cpu, color: 'text-emerald-500' },
    { name: 'DS18B20 Temp Sensor', status: 'Connected', details: '1-Wire Digital Thermal Probe', icon: Thermometer, color: 'text-emerald-500' },
    { name: 'DHT22 Humidity Sensor', status: 'Connected', details: 'Capacitive Relative Humidity Sensor', icon: Droplets, color: 'text-emerald-500' },
    { name: 'Water-Level Sensor', status: 'Connected', details: 'Analog Submerged Probe Layer', icon: Droplets, color: 'text-emerald-500' },
    { name: 'Battery Monitor IC', status: 'Connected', details: 'ADC Voltage Divider Circuit', icon: Battery, color: 'text-emerald-500' },
    { name: 'Solar Monitor Sensor', status: 'Connected', details: 'ACS712 Current + Voltage Divider', icon: Sun, color: 'text-emerald-500' },
    { name: 'Peltier TEC1-12706', status: 'Active', details: 'High-Power Thermoelectric Cooler', icon: Layers, color: 'text-blue-500' },
    { name: '12V CPU Heat Fan', status: 'Active', details: 'Pulse-Width Modulated Heat Dissipation', icon: Activity, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-3d p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4 text-blue-400" />
            <span>Hardware Architecture & Threshold Configuration</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            System Settings & Device Connection
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Configure safety thresholds, regional location details, and ESP32 REST API/WebSocket/MQTT communication placeholders
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-3d btn-3d-success text-xs py-2.5 px-4 font-bold flex items-center space-x-2 shrink-0"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Thresholds & Info Form */}
          <form onSubmit={handleSave} className="card-3d p-6 bg-white space-y-6">
            
            {/* Storage Identity */}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Storage System Identity</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Storage Unit ID</label>
                  <input
                    type="text"
                    value={storageId}
                    onChange={(e) => setStorageId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location / Cluster</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Threshold Configurations */}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safety Threshold Configurations</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min Temp (°C)</label>
                  <input
                    type="number"
                    value={tempMin}
                    onChange={(e) => setTempMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Max Temp (°C)</label>
                  <input
                    type="number"
                    value={tempMax}
                    onChange={(e) => setTempMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min Humid (%)</label>
                  <input
                    type="number"
                    value={humidityMin}
                    onChange={(e) => setHumidityMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Max Humid (%)</label>
                  <input
                    type="number"
                    value={humidityMax}
                    onChange={(e) => setHumidityMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Low Water Level Threshold (%)</label>
                  <input
                    type="number"
                    value={waterLow}
                    onChange={(e) => setWaterLow(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Low Battery Threshold (%)</label>
                  <input
                    type="number"
                    value={batteryLow}
                    onChange={(e) => setBatteryLow(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Regional & UI Settings */}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Regional & Interface Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Language / Regional Preset</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="English (NER Regional preset)">English (NER Regional preset)</option>
                    <option value="Assamese">Assamese (অসমীয়া)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Theme</label>
                  <div className="p-2 rounded-xl bg-slate-100 font-bold text-slate-700 text-center border border-slate-200">
                    Light Theme (IoT Industrial Standard)
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-3d btn-3d-primary w-full text-xs py-3 font-bold flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save System Settings</span>
            </button>

          </form>

        </div>

        {/* Right Column: SECTION 17 ESP32 Connection & SECTION 18 Device Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION 17: ESP32 Connection Placeholder */}
          <div className="card-3d p-6 bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base">ESP32 Hardware Connection</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🟢 CONNECTED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-800">
                <span className="text-slate-400">Target Device:</span>
                <span className="text-white font-bold">ESP32 Microcontroller</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-800">
                <span className="text-slate-400">Device ID:</span>
                <span className="text-blue-300 font-bold">{settings.deviceId}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-800">
                <span className="text-slate-400">Active Protocol:</span>
                <span className="text-amber-300 font-bold">{deviceProtocol}</span>
              </div>
            </div>

            {/* Future Protocols Architecture Selector */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Future Integration Protocols:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Simulation', 'REST API', 'WebSocket', 'MQTT'] as const).map((proto) => (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setDeviceProtocol(proto as any)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-all ${
                      deviceProtocol === proto
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>

            {/* Architecture Explanatory Box */}
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/60 text-[11px] text-blue-200 leading-relaxed">
              <strong className="text-white block mb-0.5">Clean Modular Architecture:</strong>
              System context and telemetry services are designed so real ESP32 REST endpoints (`/api/v1/sensors`), WebSocket streams, or MQTT topics can be plugged directly without refactoring UI components.
            </div>
          </div>

          {/* SECTION 18: System Device Health Grid */}
          <div className="card-3d p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Device Diagnostic Health
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                8/8 Systems Normal
              </span>
            </div>

            <div className="space-y-2">
              {deviceHealth.map((dev, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <dev.icon className="w-4 h-4 text-slate-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{dev.name}</span>
                      <span className="text-[10px] text-slate-500 block">{dev.details}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 ${dev.color}`}>
                    🟢 {dev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
