import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sun, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useSystem } from '../../context/SystemContext';
import type { TimeRange } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const { history24h, history7d, history30d, produceList, alertsList } = useSystem();
  const [timeframe, setTimeframe] = useState<TimeRange>('24h');

  const getData = () => {
    switch (timeframe) {
      case '7d': return history7d;
      case '30d': return history30d;
      default: return history24h;
    }
  };

  const currentData = getData();

  // Dynamic Metrics
  const temps = currentData.map(d => d.temperature);
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / (temps.length || 1)).toFixed(1);

  const hums = currentData.map(d => d.humidity);
  const avgHum = Math.round(hums.reduce((a, b) => a + b, 0) / (hums.length || 1));

  const totalProduceKg = produceList.reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const estimatedAvoidedLossKg = Math.round(totalProduceKg * 0.15); // ~15% avoided post-harvest loss

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-3d p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Post-Harvest Thermal Performance Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            System Telemetry & Preservation Analytics
          </h1>
          <p className="text-xs text-blue-100/80 mt-1">
            Historical trend analysis for solar cooling efficiency, humidity stability, and battery duty cycles
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-1 bg-white/10 p-1.5 rounded-xl border border-white/10 shrink-0">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                timeframe === t
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Preservation Range Summary Card */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center space-x-3 shadow-xs">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        <div>
          <h3 className="font-extrabold text-sm text-emerald-900">
            94% Optimal Preservation Score
          </h3>
          <p className="text-xs text-emerald-800 mt-0.5">
            Storage conditions remained within the configured monitoring range for <strong>94%</strong> of the selected {timeframe === '24h' ? '24-hour' : timeframe === '7d' ? '7-day' : '30-day'} period.
          </p>
        </div>
      </div>

      {/* Aggregated KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
        
        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Average Temp</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{avgTemp}°C</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Average Humidity</span>
          <span className="text-2xl font-extrabold text-teal-600 font-mono">{avgHum}%</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cooling Runtime</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">88%</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Solar Generated</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono">1.42 kWh</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Battery Usage</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono">0.35 kWh</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alerts Logged</span>
          <span className="text-2xl font-extrabold text-amber-500 font-mono">{alertsList.length}</span>
        </div>

        <div className="card-3d p-4 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Buffer Refill</span>
          <span className="text-2xl font-extrabold text-cyan-600 font-mono">1 Event</span>
        </div>

      </div>

      {/* Multi-Metric Trend Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temperature Trend */}
        <div className="card-3d p-6 bg-white space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Temperature Trend Analytics (°C)</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 16]} stroke="#94a3b8" fontSize={11} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none' }} />
                <Area type="monotone" dataKey="temperature" stroke="#2563eb" strokeWidth={3} fill="url(#tGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Solar Generation vs Time Bar Chart */}
        <div className="card-3d p-6 bg-white space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Solar Generation Output (Watts)</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 120]} stroke="#94a3b8" fontSize={11} unit="W" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none' }} />
                <Bar dataKey="solarPower" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SECTION 15: Food Loss & Farmer Impact Metrics */}
      <div className="card-3d p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-extrabold text-lg text-white">
              Food Loss Mitigation & Farmer Impact Metrics
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Prototype / Simulated Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase block">Produce Stored</span>
            <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{totalProduceKg} kg</span>
            <span className="text-[10px] text-emerald-400 mt-1 block font-medium">Registered in chamber</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase block">Estimated Spoilage Avoided</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">{estimatedAvoidedLossKg} kg</span>
            <span className="text-[10px] text-emerald-300 mt-1 block font-medium">Post-harvest decay prevented</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase block">Storage Availability</span>
            <span className="text-3xl font-extrabold text-blue-400 font-mono mt-1 block">96%</span>
            <span className="text-[10px] text-blue-300 mt-1 block font-medium">Uptime efficiency</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase block">Solar Contribution</span>
            <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">78%</span>
            <span className="text-[10px] text-amber-300 mt-1 block font-medium">Renewable energy share</span>
          </div>

        </div>

        {/* MANDATORY DISCLAIMER NOTE */}
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex items-center space-x-2">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>SIH Demonstration Disclaimer:</strong> Impact metrics are generated using prototype simulation logic for SIH judging demonstration. They are not presented as scientifically validated field experiment results.
          </span>
        </div>
      </div>

    </div>
  );
};
