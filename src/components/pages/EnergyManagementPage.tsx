import React, { useState } from 'react';
import { Zap, Sun, Battery, Info } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart,
  Area
} from 'recharts';
import { useSystem } from '../../context/SystemContext';
import type { TimeRange } from '../../types';
import { SolarIndicator } from '../common/SolarIndicator';
import { BatteryIndicator } from '../common/BatteryIndicator';

export const EnergyManagementPage: React.FC = () => {
  const { sensorData, history24h, history7d, history30d } = useSystem();
  const [timeframe, setTimeframe] = useState<TimeRange>('24h');

  const getData = () => {
    switch (timeframe) {
      case '7d': return history7d;
      case '30d': return history30d;
      default: return history24h;
    }
  };

  const currentData = getData();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-3d p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Off-Grid Solar & Battery Microgrid</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Energy Management & Power Telemetry
          </h1>
          <p className="text-xs text-amber-100/90 mt-1">
            Real-time monitoring of 50-100W Solar PV Panel Generation, MPPT Controller & 12V Deep Cycle Storage
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 bg-black/20 p-1.5 rounded-xl border border-white/10 shrink-0">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                timeframe === t
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              {t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Solar Power Output</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">{sensorData.solarPower}</span>
            <span className="text-sm font-semibold text-slate-500">W</span>
          </div>
          <span className="mt-2 inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {sensorData.solarVoltage}V / {sensorData.solarCurrent}A
          </span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Battery Storage Charge</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">{sensorData.batteryPercentage}</span>
            <span className="text-sm font-semibold text-slate-500">%</span>
          </div>
          <span className="mt-2 inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {sensorData.batteryVoltage}V DC Nominal
          </span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Primary Power Source</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-blue-600 font-mono">{sensorData.energyMode}</span>
          </div>
          <span className="mt-2 inline-block text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            100% Off-Grid Solar
          </span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Battery Charge Status</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {sensorData.solarPower > 40 ? 'CHARGING' : 'DISCHARGING'}
            </span>
          </div>
          <span className="mt-2 inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            PWM/MPPT Controlled
          </span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Peltier Load Draw</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {sensorData.coolingStatus === 'ON' ? '~48 W' : '0 W'}
            </span>
          </div>
          <span className="mt-2 inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            12V DC TEC1-12706
          </span>
        </div>

      </div>

      {/* Solar & Battery Hardware Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SolarIndicator />
        <BatteryIndicator />
      </div>

      {/* Recharts Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Solar Generation vs Time */}
        <div className="card-3d p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">
                Solar Power Generation (W vs Time)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Peak: 95W
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 120]} stroke="#94a3b8" fontSize={11} unit="W" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Watts`, 'Solar Generation']}
                />
                <Area type="monotone" dataKey="solarPower" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#solarGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battery Voltage vs Time */}
        <div className="card-3d p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Battery className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Battery Voltage Discharge (V vs Time)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Current: {sensorData.batteryVoltage}V
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[10, 14]} stroke="#94a3b8" fontSize={11} unit="V" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Volts`, 'Battery Voltage']}
                />
                <Line type="monotone" dataKey="batteryVoltage" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Use voltage/current readings strictly as prototype hardware simulation telemetry.</span>
        </div>
        <span className="font-semibold text-slate-800">12V System Spec</span>
      </div>

    </div>
  );
};
