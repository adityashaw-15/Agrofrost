import React from 'react';
import { 
  LayoutDashboard, 
  Thermometer, 
  Zap, 
  Apple, 
  BarChart3, 
  Bell, 
  Sliders, 
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  Snowflake,
  X
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { systemStatus, alertsList } = useSystem();
  const unacknowledgedAlertsCount = alertsList.filter(a => !a.acknowledged).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'storage', label: 'Storage Monitoring', icon: Thermometer },
    { id: 'energy', label: 'Energy Management', icon: Zap },
    { id: 'produce', label: 'Produce Management', icon: Apple },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unacknowledgedAlertsCount },
    { id: 'control', label: 'System Control', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header / Branding */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Snowflake className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                AGROFROST
              </h1>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                JARVIS Smart Cold Storage
              </p>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpenMobile(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SIH Hardware Tag Banner */}
        <div className="mx-4 mt-4 p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-[11px] text-blue-300 flex items-center justify-between">
          <span className="font-semibold text-blue-200">SIH 2026 #SIH26005</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
            NER Cluster
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-white text-blue-700' : 'bg-red-500 text-white'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Status Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={systemStatus.online ? 'led-dot led-dot-green' : 'led-dot led-dot-warning'} />
              <span className="text-xs font-semibold tracking-wide text-slate-200">
                {systemStatus.online ? 'SYSTEM ONLINE' : 'OFFLINE MODE'}
              </span>
            </div>
            {systemStatus.online ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-400" />
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex flex-col space-y-1">
            <div className="flex justify-between">
              <span>Last Sync:</span>
              <span className="font-mono text-slate-300">{systemStatus.lastSync}</span>
            </div>
            {!systemStatus.online && (
              <div className="flex justify-between text-amber-400 font-medium">
                <span>Pending Sync:</span>
                <span className="font-mono">{systemStatus.pendingSync} records</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
