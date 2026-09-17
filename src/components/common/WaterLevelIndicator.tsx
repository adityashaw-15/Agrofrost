import React from 'react';
import { Droplets, AlertTriangle, RefreshCw } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const WaterLevelIndicator: React.FC = () => {
  const { sensorData, refillWaterTank } = useSystem();
  const level = sensorData.waterLevel;

  let stateText = 'NORMAL';
  let isLow = false;
  let isCritical = false;

  if (level < 40) {
    stateText = 'CRITICAL';
    isCritical = true;
  } else if (level < 80) {
    stateText = 'LOW';
    isLow = true;
  }

  return (
    <div className="card-3d p-6 bg-white flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-cyan-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            Thermal Buffer Water Level
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          isCritical 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : isLow 
            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        }`}>
          {stateText}
        </span>
      </div>

      {/* Visual Tank Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        
        {/* Tank Graphic (5 cols) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-32 h-44 rounded-2xl border-4 border-slate-700 bg-slate-100 overflow-hidden shadow-inner flex flex-col justify-end">
            
            {/* Measurement Graduations */}
            <div className="absolute inset-y-0 left-1 flex flex-col justify-between text-[9px] font-mono font-bold text-slate-400 z-20 py-2 pointer-events-none">
              <span>100%</span>
              <span>80%</span>
              <span>40%</span>
              <span>0%</span>
            </div>

            {/* Liquid Fill Level */}
            <div 
              className={`w-full transition-all duration-700 relative overflow-hidden ${
                isCritical 
                  ? 'bg-gradient-to-t from-red-600 to-red-400' 
                  : isLow 
                  ? 'bg-gradient-to-t from-amber-500 to-amber-300' 
                  : 'bg-gradient-to-t from-cyan-600 via-sky-400 to-teal-300'
              }`}
              style={{ height: `${level}%` }}
            >
              {/* Wave animation effect */}
              <div className="absolute -top-3 left-0 right-0 h-6 bg-white/30 rounded-[40%] animate-wave" />
            </div>

            {/* Centered Percentage Badge inside Tank */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="bg-slate-900/80 text-white font-mono font-extrabold text-lg px-3 py-1 rounded-xl shadow-lg border border-slate-700">
                {level}%
              </span>
            </div>

          </div>
        </div>

        {/* Info & Refill Details (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Function of Water Layer
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides thermal capacitance to absorb rapid ambient temperature spikes and preserve cooling stability during solar interruptions.
            </p>
          </div>

          {/* Threshold Legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              <span>80% – 100% Range</span>
              <span className="font-bold">NORMAL (Optimal)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              <span>40% – 79% Range</span>
              <span className="font-bold">LOW (Attention Needed)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 text-red-900 border border-red-200">
              <span>Below 40% Range</span>
              <span className="font-bold">CRITICAL (Refill Required)</span>
            </div>
          </div>

          {/* Refill Prompt / Action */}
          {(isLow || isCritical) && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠ Water level is low ({level}%). Please inspect/refill thermal buffering layer.</span>
              </div>
              <button
                onClick={refillWaterTank}
                className="btn-3d btn-3d-success text-xs py-1.5 px-3 w-full flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white" />
                <span>Simulate Water Refill</span>
              </button>
            </div>
          )}

          {!isLow && !isCritical && (
            <button
              onClick={refillWaterTank}
              className="btn-3d btn-3d-secondary text-xs py-1.5 px-3 w-full flex items-center justify-center space-x-1.5 text-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Top Up Buffer Water (98%)</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
