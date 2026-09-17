import React from 'react';
import { Battery, BatteryCharging, ShieldAlert } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const BatteryIndicator: React.FC = () => {
  const { sensorData } = useSystem();
  const perc = sensorData.batteryPercentage;
  const volt = sensorData.batteryVoltage;
  const isCharging = sensorData.solarPower > 40;

  let colorClass = 'bg-emerald-500';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let statusText = 'Good';

  if (perc < 20) {
    colorClass = 'bg-red-500';
    badgeClass = 'bg-red-100 text-red-800 border-red-300';
    statusText = 'Low Battery';
  } else if (perc < 50) {
    colorClass = 'bg-amber-500';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    statusText = 'Moderate';
  }

  return (
    <div className="card-3d p-6 bg-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isCharging ? (
            <BatteryCharging className="w-5 h-5 text-emerald-600 animate-pulse" />
          ) : (
            <Battery className="w-5 h-5 text-slate-700" />
          )}
          <h3 className="font-extrabold text-slate-900 text-base">
            12V Energy Storage Battery
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
          {statusText}
        </span>
      </div>

      {/* Main Gauge */}
      <div className="space-y-4 my-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {perc}%
            </span>
            <span className="ml-3 text-sm font-semibold text-slate-500 font-mono">
              ({volt}V DC)
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            {isCharging ? '⚡ CHARGING VIA SOLAR' : '🔋 DISCHARGING'}
          </span>
        </div>

        {/* Battery Bar Visual */}
        <div className="h-6 w-full bg-slate-100 rounded-xl p-1 border border-slate-200 shadow-inner flex items-center">
          <div 
            className={`h-full rounded-lg transition-all duration-500 ${colorClass}`}
            style={{ width: `${perc}%` }}
          />
        </div>
      </div>

      {/* Bottom Info Grid */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Nominal Spec</span>
          <span className="font-bold text-slate-800">12V Deep-Cycle Lead Acid / LiFePO4</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium block">Power Mode</span>
          <span className="font-bold text-blue-700">{sensorData.energyMode}</span>
        </div>
      </div>

      {perc < 20 && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>Battery voltage approaching minimum threshold (11.2V).</span>
        </div>
      )}
    </div>
  );
};
