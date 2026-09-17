import React from 'react';
import { Snowflake, Flame, ArrowRight } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const CoolingControl: React.FC = () => {
  const { sensorData, toggleCooling, setFanStatus } = useSystem();

  return (
    <div className="card-3d p-6 bg-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Snowflake className={`w-5 h-5 ${sensorData.coolingStatus === 'ON' ? 'text-blue-600 animate-spin' : 'text-slate-400'}`} />
          <h3 className="font-extrabold text-slate-900 text-base">
            Peltier Thermo-Electric Cooling Status
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          sensorData.coolingStatus === 'ON'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-slate-100 text-slate-600 border border-slate-300'
        }`}>
          COOLING: {sensorData.coolingStatus}
        </span>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
          <span className="text-slate-500 font-bold block mb-1">Peltier Module</span>
          <span className="font-mono font-extrabold text-base text-blue-900">
            {sensorData.coolingStatus}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 font-bold block mb-1">12V CPU Fan</span>
          <span className="font-mono font-extrabold text-base text-slate-800">
            {sensorData.fanStatus}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 font-bold block mb-1">Cold Plate</span>
          <span className="font-mono font-extrabold text-base text-cyan-700">
            {sensorData.coldPlateStatus}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 font-bold block mb-1">Current Temp</span>
          <span className="font-mono font-extrabold text-base text-blue-600">
            {sensorData.temperature}°C
          </span>
        </div>
      </div>

      {/* Simple Visual Representation of Cooling Process */}
      <div className="my-4 p-4 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Dual-Side Thermodynamic Flow Process
        </h4>

        {/* Cold Side Flow */}
        <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-700/60 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-blue-300 mb-2">
            <Snowflake className="w-4 h-4 text-blue-400" />
            <span>COLD SIDE HEAT EXTRACTION</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-blue-100">
            <span className="bg-blue-900/90 px-2 py-1 rounded border border-blue-700">Peltier Cold Side</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="bg-blue-900/90 px-2 py-1 rounded border border-blue-700">Aluminium Plate</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="bg-blue-600 font-bold text-white px-2 py-1 rounded">Cold Storage Chamber</span>
          </div>
        </div>

        {/* Hot Side Flow */}
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-700/60 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-red-300 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>HOT SIDE HEAT DISSIPATION</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-red-100">
            <span className="bg-red-900/90 px-2 py-1 rounded border border-red-700">Peltier Hot Side</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="bg-red-900/90 px-2 py-1 rounded border border-red-700">Aluminium Heatsink</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="bg-red-900/90 px-2 py-1 rounded border border-red-700">CPU Fan</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="bg-amber-600 font-bold text-white px-2 py-1 rounded">Hot Air OUT</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={toggleCooling}
          className={`btn-3d w-full sm:w-auto text-xs py-2 px-4 ${
            sensorData.coolingStatus === 'ON' ? 'btn-3d-danger' : 'btn-3d-success'
          }`}
        >
          {sensorData.coolingStatus === 'ON' ? 'Turn Cooling System OFF' : 'Turn Cooling System ON'}
        </button>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
          <span className="text-[11px] font-bold text-slate-500 px-2">Fan:</span>
          {(['AUTO', 'ON', 'OFF'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFanStatus(mode)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                sensorData.fanStatus === mode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
