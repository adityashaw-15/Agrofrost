import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Info, Check, Trash2, Filter } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import type { Severity } from '../../types';

export const AlertsPage: React.FC = () => {
  const { alertsList, acknowledgeAlert, clearAllAlerts } = useSystem();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | Severity>('ALL');

  const filteredAlerts = alertsList.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const unacknowledgedCount = alertsList.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-3d p-6 bg-gradient-to-r from-red-900 via-slate-900 to-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-red-400" />
            <span>Autonomous Safety & Hardware Diagnostics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Smart Alert & Safety Monitoring
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time threshold breaches for Temperature, Thermal Buffer Water Level, and Battery Voltage
          </p>
        </div>

        {alertsList.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="btn-3d btn-3d-secondary text-xs py-2 px-3.5 font-bold flex items-center space-x-1.5 text-slate-900 shrink-0"
          >
            <Trash2 className="w-4 h-4 text-slate-600" />
            <span>Clear Alert Log</span>
          </button>
        )}
      </div>

      {/* Filter and Count Bar */}
      <div className="card-3d p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <span>Active Pending Alerts:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-mono">
            {unacknowledgedCount} Unacknowledged
          </span>
        </div>

        <div className="flex items-center space-x-1 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Items List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="card-3d p-12 text-center bg-white text-slate-400 space-y-2">
            <Check className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">No active alerts matching filter criteria</p>
            <p className="text-xs">All cold storage parameters remain within optimal operating limits.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isCrit = alt.severity === 'CRITICAL';
            const isWarn = alt.severity === 'WARNING';

            return (
              <div 
                key={alt.id}
                className={`card-3d p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${
                  isCrit 
                    ? 'border-l-red-500 bg-red-50/20' 
                    : isWarn 
                    ? 'border-l-amber-500 bg-amber-50/20' 
                    : 'border-l-blue-500 bg-blue-50/20'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isCrit ? 'bg-red-100 text-red-600' : isWarn ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {isCrit ? <ShieldAlert className="w-5 h-5" /> : isWarn ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        isCrit ? 'bg-red-500 text-white' : isWarn ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        {alt.type} ALERT
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">• {alt.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium mt-1.5 leading-relaxed">
                      {alt.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {alt.acknowledged ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="btn-3d btn-3d-primary text-xs py-1.5 px-3 font-bold flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
