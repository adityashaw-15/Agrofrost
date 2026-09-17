import React from 'react';
import { Thermometer, Droplets, Fan, Zap, Layers, Box, Sparkles, ArrowDown, Snowflake } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const ColdStorageDiagram: React.FC = () => {
  const { sensorData } = useSystem();

  const wallLayers = [
    { id: 1, name: 'Aluminium Foil', color: 'bg-slate-300 border-slate-400 text-slate-800', thickness: '2mm' },
    { id: 2, name: 'Hard Plastic', color: 'bg-blue-900 text-white border-blue-950', thickness: '4mm' },
    { id: 3, name: 'Water Layer (Thermal Buffer)', color: 'bg-cyan-500 text-white border-cyan-600', thickness: '15mm' },
    { id: 4, name: 'Thin Plastic', color: 'bg-sky-200 text-sky-900 border-sky-300', thickness: '1mm' },
    { id: 5, name: 'Thermocol Insulation', color: 'bg-slate-100 text-slate-800 border-slate-300', thickness: '50mm' },
  ];

  return (
    <div className="card-3d p-6 bg-gradient-to-br from-white via-slate-50 to-blue-50/40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Cold Storage Chamber Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            5-Layer Insulated Chamber & Peltier TEC1-12706 Thermo-Electric System
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Peltier TEC1-12706: {sensorData.coolingStatus}
          </span>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Side: Cold Side & Chamber Visual (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Insulated Chamber (Interior)</span>
            <span className="text-blue-600 font-mono font-bold text-sm">{sensorData.temperature}°C • {sensorData.humidity}% RH</span>
          </div>

          {/* Chamber Box Simulation */}
          <div className="relative border-4 border-slate-800 rounded-2xl p-4 bg-gradient-to-b from-blue-50/80 to-teal-50/50 overflow-hidden shadow-inner min-h-[220px] flex flex-col justify-between">
            
            {/* Cold air distribution arrows */}
            <div className="absolute top-2 left-0 right-0 flex justify-around text-blue-500 opacity-60 text-xs font-mono animate-pulse">
              <span>❄ ❄ ❄ Cold Air Flow ❄ ❄ ❄</span>
            </div>

            {/* Microcontroller & Sensors mounted inside */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10 mt-4">
              <div className="bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono font-bold">ESP32 Core</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-blue-200 text-blue-900 text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs">
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                <span>Temp Sensor: <strong className="font-mono">{sensorData.temperature}°C</strong></span>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-teal-200 text-teal-900 text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs">
                <Droplets className="w-3.5 h-3.5 text-teal-600" />
                <span>Humidity: <strong className="font-mono">{sensorData.humidity}%</strong></span>
              </div>
            </div>

            {/* Fresh Vegetables Graphic Representation */}
            <div className="my-6 p-4 rounded-xl bg-white/70 border border-emerald-200 flex items-center justify-around z-10 shadow-xs">
              <div className="text-center">
                <span className="text-2xl">🍅</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">Tomatoes</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🥬</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">Cabbage</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🫛</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">Beans</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🌿</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">Leafy Veg</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🌶️</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">Bhut Jolokia</p>
              </div>
            </div>

            {/* Bottom Cold Plate */}
            <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-slate-900 font-bold text-xs p-2 rounded-lg text-center shadow-md flex items-center justify-center space-x-2">
              <Snowflake className="w-4 h-4 text-white animate-spin" />
              <span className="text-white tracking-wide">Aluminium Cold Plate Thermal Conductor</span>
            </div>

          </div>

          {/* Cold side process flow */}
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">
                Peltier Cold Side ➔ Aluminium Plate ➔ Chamber Cooling
              </span>
            </div>
            <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-300">
              12V TEC1-12706
            </span>
          </div>

        </div>

        {/* Right Side: Thermo-Electric Heat Dissipation & Wall Layers (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Thermo-Electric Heat Exchange Flow */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Fan className="w-4 h-4 text-orange-500" />
              <span>Heat Dissipation Subsystem</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="font-semibold text-blue-900">Cold Side</span>
                <span className="text-blue-700 font-mono">Aluminium Cold Plate</span>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="font-semibold text-amber-900">Peltier Module</span>
                <span className="text-amber-700 font-mono">TEC1-12706 (60W)</span>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between">
                <span className="font-semibold text-red-900">Hot Side + Heatsink</span>
                <span className="text-red-700 font-mono">CPU Fan {sensorData.fanStatus}</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-red-600 bg-red-50/80 p-2 rounded-lg border border-red-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Hot Air Exhausted via 12V CPU Fan</span>
            </div>
          </div>

          {/* Horizontal Multi-Layer Wall Visualization */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>5-Layer Wall Construction</span>
            </h4>

            <div className="space-y-1.5">
              {wallLayers.map((layer) => (
                <div 
                  key={layer.id}
                  className={`p-2 rounded-lg border flex items-center justify-between text-xs transition-all hover:scale-[1.01] ${layer.color}`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-black/20 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {layer.id}
                    </span>
                    <span className="font-semibold truncate">{layer.name}</span>
                  </div>
                  <span className="font-mono text-[11px] opacity-80 shrink-0 ml-2">{layer.thickness}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
