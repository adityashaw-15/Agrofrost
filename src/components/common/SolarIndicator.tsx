import React from 'react';
import { Sun, Zap, Info } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SolarIndicator: React.FC = () => {
  const { sensorData } = useSystem();

  return (
    <div className="card-3d p-6 bg-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
          <h3 className="font-extrabold text-slate-900 text-base">
            Solar PV Generation Subsystem
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          CHARGING
        </span>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-3 gap-3 my-2 text-center">
        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800 uppercase block">Solar Power</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">
            {sensorData.solarPower}W
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Solar Voltage</span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {sensorData.solarVoltage}V
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Solar Current</span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {sensorData.solarCurrent}A
          </span>
        </div>
      </div>

      {/* Recommended range note & Prototype demo note */}
      <div className="mt-4 space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start space-x-2">
          <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Solar Panel Specs:</strong> 50–100W recommended range with PWM/MPPT Charge Controller.
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="italic text-[11px]">
            Values reflect real-time prototype telemetry simulation for SIH demonstration.
          </span>
        </div>
      </div>
    </div>
  );
};
