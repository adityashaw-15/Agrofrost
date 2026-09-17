import React, { useState } from 'react';
import { Thermometer, Droplets, Info, Calendar } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { useSystem } from '../../context/SystemContext';
import type { TimeRange } from '../../types';
import { WaterLevelIndicator } from '../common/WaterLevelIndicator';

export const StorageMonitoringPage: React.FC = () => {
  const { sensorData, history24h, history7d, history30d, settings } = useSystem();
  const [timeframe, setTimeframe] = useState<TimeRange>('24h');

  const getData = () => {
    switch (timeframe) {
      case '7d': return history7d;
      case '30d': return history30d;
      default: return history24h;
    }
  };

  const currentData = getData();

  // Calculate dynamic statistics
  const temps = currentData.map(d => d.temperature);
  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : '6.9';
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : '10.2';
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '8.3';

  const hums = currentData.map(d => d.humidity);
  const minHum = hums.length ? Math.min(...hums) : 64;
  const maxHum = hums.length ? Math.max(...hums) : 81;
  const avgHum = hums.length ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length) : 73;

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-3d p-5 bg-white">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Thermometer className="w-6 h-6 text-blue-600" />
            <span>Chamber Climate & Storage Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry analytics for Temperature, Relative Humidity, and Water Buffer
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <Calendar className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
                timeframe === t
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Range Note Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-2 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <strong className="font-semibold">Important Thermal Guidance:</strong> Recommended storage conditions vary by produce type. Ideal preset: 4°C – 10°C temperature, 60% – 85% relative humidity.
        </div>
      </div>

      {/* Temperature Monitoring Card */}
      <div className="card-3d p-6 bg-white space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chamber Temperature Telemetry
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-blue-600 font-mono">
                {sensorData.temperature}°C
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Target: {settings.tempMinThreshold}°C – {settings.tempMaxThreshold}°C
              </span>
            </div>
          </div>

          {/* Quick Min / Max / Avg stats */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Current</span>
              <span className="font-mono font-extrabold text-blue-600">{sensorData.temperature}°C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Min</span>
              <span className="font-mono font-bold text-slate-700">{minTemp}°C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Max</span>
              <span className="font-mono font-bold text-slate-700">{maxTemp}°C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Average</span>
              <span className="font-mono font-bold text-slate-700">{avgTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Temperature vs Time Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 16]} stroke="#94a3b8" fontSize={11} unit="°C" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(val: any) => [`${val}°C`, 'Temperature']}
              />
              <ReferenceLine y={settings.tempMaxThreshold} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max Limit (10°C)', fill: '#ef4444', fontSize: 10, position: 'top' }} />
              <ReferenceLine y={settings.tempMinThreshold} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Min Limit (4°C)', fill: '#3b82f6', fontSize: 10, position: 'bottom' }} />
              <Area type="monotone" dataKey="temperature" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Humidity Monitoring Card */}
      <div className="card-3d p-6 bg-white space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-teal-600" />
              <span>Chamber Relative Humidity Telemetry</span>
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-teal-600 font-mono">
                {sensorData.humidity}%
              </span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Safe Zone: 60% – 85%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Current</span>
              <span className="font-mono font-extrabold text-teal-600">{sensorData.humidity}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Min</span>
              <span className="font-mono font-bold text-slate-700">{minHum}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Max</span>
              <span className="font-mono font-bold text-slate-700">{maxHum}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Average</span>
              <span className="font-mono font-bold text-slate-700">{avgHum}%</span>
            </div>
          </div>
        </div>

        {/* Humidity vs Time Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, 'Humidity']}
              />
              <ReferenceLine y={settings.humidityMaxThreshold} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warning High (85%)', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={settings.humidityMinThreshold} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warning Low (60%)', fill: '#f59e0b', fontSize: 10 }} />
              <Area type="monotone" dataKey="humidity" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#humGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Water Level Buffer Component */}
      <WaterLevelIndicator />

    </div>
  );
};
