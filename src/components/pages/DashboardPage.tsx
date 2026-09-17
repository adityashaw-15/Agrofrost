import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Battery, 
  Sun, 
  Snowflake, 
  MapPin, 
  Apple,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { StatusCard } from '../common/StatusCard';
import { ColdStorageDiagram } from '../common/ColdStorageDiagram';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { sensorData, produceList, alertsList, settings } = useSystem();

  const unackAlerts = alertsList.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="card-3d p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="led-dot led-dot-green" />
                SYSTEM NORMAL
              </span>
              <span className="text-xs font-mono text-slate-300">ID: {settings.storageId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Smart Cold Storage
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{settings.location}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('control')}
              className="btn-3d btn-3d-primary text-xs py-2 px-4 flex items-center space-x-2"
            >
              <Snowflake className="w-4 h-4" />
              <span>System Control</span>
            </button>
            <button
              onClick={() => onNavigate('storage')}
              className="btn-3d btn-3d-secondary text-xs py-2 px-4 flex items-center space-x-2 text-slate-900"
            >
              <span>Detailed Telemetry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <StatusCard
          title="Temperature"
          value={sensorData.temperature}
          unit="°C"
          statusText="Optimal"
          statusType="optimal"
          icon={Thermometer}
          trend="stable"
          trendText="Target 4-10°C"
          onClick={() => onNavigate('storage')}
        />

        <StatusCard
          title="Humidity"
          value={sensorData.humidity}
          unit="%"
          statusText="Optimal"
          statusType="optimal"
          icon={Droplets}
          trend="up"
          trendText="Safe range"
          onClick={() => onNavigate('storage')}
        />

        <StatusCard
          title="Battery"
          value={sensorData.batteryPercentage}
          unit="%"
          statusText={sensorData.batteryPercentage > 50 ? 'Good' : 'Moderate'}
          statusType={sensorData.batteryPercentage > 50 ? 'good' : 'warning'}
          icon={Battery}
          trend="up"
          trendText={`${sensorData.batteryVoltage}V DC`}
          onClick={() => onNavigate('energy')}
        />

        <StatusCard
          title="Water Level"
          value={sensorData.waterLevel >= 80 ? 'Normal' : sensorData.waterLevel >= 40 ? 'Low' : 'Critical'}
          unit={`(${sensorData.waterLevel}%)`}
          statusText={sensorData.waterLevel >= 80 ? 'Sufficient' : 'Refill Alert'}
          statusType={sensorData.waterLevel >= 80 ? 'good' : 'warning'}
          icon={Droplets}
          onClick={() => onNavigate('storage')}
        />

        <StatusCard
          title="Solar Power"
          value={sensorData.solarPower}
          unit="W"
          statusText="Charging"
          statusType="optimal"
          icon={Sun}
          trend="up"
          trendText={`${sensorData.solarVoltage}V / ${sensorData.solarCurrent}A`}
          onClick={() => onNavigate('energy')}
        />

        <StatusCard
          title="Cooling System"
          value={sensorData.coolingStatus}
          statusText="Peltier Active"
          statusType={sensorData.coolingStatus === 'ON' ? 'optimal' : 'warning'}
          icon={Snowflake}
          onClick={() => onNavigate('control')}
        />

      </div>

      {/* Main Storage Chamber Architecture Diagram */}
      <ColdStorageDiagram />

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Produce Summary (7 cols) */}
        <div className="lg:col-span-7 card-3d p-6 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Active Vegetable Registry
              </h3>
            </div>
            <button
              onClick={() => onNavigate('produce')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Manage All ({produceList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 my-2">
            {produceList.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500">
                    Stored: {item.storageDate} • Ideal: {item.expectedTempRange}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-slate-800 text-sm">{item.quantity} kg</span>
                  <span className="block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
            <strong>Storage Note:</strong> Recommended storage conditions vary by produce type. Leafy greens require lower temperatures and higher humidity than solanaceous crops.
          </div>
        </div>

        {/* Right Column: Active Hardware Health & Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Alerts Box */}
          <div className="card-3d p-6 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900">Active Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {unackAlerts.length} Pending
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {alertsList.slice(0, 3).map((alt) => (
                <div 
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs ${
                    alt.severity === 'CRITICAL'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : alt.severity === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>[{alt.severity}] {alt.type.toUpperCase()}</span>
                    <span className="text-[10px] font-normal opacity-80">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{alt.message}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('alerts')}
              className="btn-3d btn-3d-secondary w-full text-xs py-2 mt-4 text-slate-700"
            >
              View All Alerts ({alertsList.length})
            </button>
          </div>

          {/* Quick Hardware Component Health */}
          <div className="card-3d p-5 bg-slate-900 text-white space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Hardware Telemetry Ping</span>
              <span className="text-emerald-400 font-mono">100% ONLINE</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>ESP32 MCU</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>DS18B20 Temp</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>DHT22 Humidity</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Peltier TEC1</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
