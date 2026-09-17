import React, { useState } from 'react';
import { Sliders, Zap, Thermometer, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { CoolingControl } from '../common/CoolingControl';

export const SystemControlPage: React.FC = () => {
  const { 
    sensorData, 
    setFanStatus, 
    setEnergyMode, 
    toggleAlertSystem, 
    setTargetTempRange 
  } = useSystem();

  const [minTemp, setMinTemp] = useState<number>(sensorData.targetTempMin);
  const [maxTemp, setMaxTemp] = useState<number>(sensorData.targetTempMax);
  const [isSaved, setIsSaved] = useState(false);

  const handleApplyTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (minTemp >= maxTemp) return;
    setTargetTempRange(minTemp, maxTemp);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-3d p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>ESP32 Hardware Relay & Closed-Loop Control</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            System Control & Actuator Interface
          </h1>
          <p className="text-xs text-blue-100/80 mt-1">
            Directly manipulate Peltier relay states, fan duty modes, and temperature setpoints with instant simulation feedback
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-700 text-xs">
          <span className="led-dot led-dot-green" />
          <span className="font-mono text-blue-200">ESP32 GPIO Command Bus Active</span>
        </div>
      </div>

      {/* Peltier Cooling Control Subsystem Visual */}
      <CoolingControl />

      {/* Interactive Control Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Energy & Fan Modes Panel */}
        <div className="card-3d p-6 bg-white space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">
              Power & Heat Dissipation Actuators
            </h3>
          </div>

          {/* Energy Mode Control */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Energy Source Selection
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['SOLAR', 'BATTERY', 'AUTO'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setEnergyMode(mode)}
                  className={`btn-3d text-xs py-2 px-3 font-bold ${
                    sensorData.energyMode === mode
                      ? 'btn-3d-primary'
                      : 'btn-3d-secondary text-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              AUTO automatically prioritizes solar input when generation &gt; 45W, falling back to 12V battery.
            </p>
          </div>

          {/* CPU Fan Mode Control */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              CPU Fan Duty Cycle Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['AUTO', 'ON', 'OFF'] as const).map((fMode) => (
                <button
                  key={fMode}
                  onClick={() => setFanStatus(fMode)}
                  className={`btn-3d text-xs py-2 px-3 font-bold ${
                    sensorData.fanStatus === fMode
                      ? 'btn-3d-success'
                      : 'btn-3d-secondary text-slate-700'
                  }`}
                >
                  {fMode}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              AUTO regulates fan speed based on heatsink thermal sensor readings.
            </p>
          </div>

          {/* Alert System Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Smart Alert Monitoring System
                </label>
                <span className="text-[11px] text-slate-500">Autonomous threshold detection</span>
              </div>
              <button
                onClick={toggleAlertSystem}
                className={`btn-3d text-xs py-1.5 px-4 font-bold ${
                  sensorData.alertSystemEnabled ? 'btn-3d-success' : 'btn-3d-danger'
                }`}
              >
                {sensorData.alertSystemEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

        </div>

        {/* Temperature Setpoint Calibration Panel */}
        <div className="card-3d p-6 bg-white space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Target Temperature Setpoint Control
            </h3>
          </div>

          <form onSubmit={handleApplyTarget} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Min Target Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="15"
                  value={minTemp}
                  onChange={(e) => setMinTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Max Target Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  max="20"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong className="font-bold">Real-time Closed-Loop Feedback:</strong>
              <p className="text-[11px] leading-relaxed">
                When set, Peltier cooling will cycle ON until chamber reaches <strong>{minTemp}°C</strong> and idle when within safe range. If setpoint is raised, temperature will drift upward in live simulation.
              </p>
            </div>

            <button
              type="submit"
              className="btn-3d btn-3d-primary w-full text-xs py-2.5 font-bold flex items-center justify-center space-x-2"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Configuration Applied!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>Update Target Setpoints</span>
                </>
              )}
            </button>
          </form>

          {/* Live System Feedback Status Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Feedback Telemetry:</span>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Cooling System State:</span>
              <span>{sensorData.coolingStatus}</span>
            </div>
            <div className="flex justify-between text-blue-300">
              <span>Chamber Drift Direction:</span>
              <span>{sensorData.coolingStatus === 'ON' ? '▼ Cooling toward target' : '▲ Warming toward ambient'}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
