import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Play, 
  Pause, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ChevronDown,
  LogOut,
  Cpu
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { NotificationPanel } from './NotificationPanel';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  onOpenLoginModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar, onOpenLoginModal }) => {
  const { 
    systemStatus, 
    toggleOfflineMode, 
    syncNow, 
    toggleSimulation, 
    notificationsList,
    user,
    login,
    logout
  } = useSystem();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadNotifCount = notificationsList.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Mobile Menu Button & System Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Smart Cold Storage
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <Cpu className="w-3 h-3 mr-1 text-blue-600" />
                Demo Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Solar-Powered Vegetable Preservation System • NER Agricultural Cluster
            </p>
          </div>
        </div>

        {/* Right Side Controls & Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Simulation Toggle Button */}
          <button
            onClick={toggleSimulation}
            className={`btn-3d text-xs px-3 py-1.5 font-medium flex items-center space-x-1.5 ${
              systemStatus.simulationRunning
                ? 'btn-3d-secondary text-slate-700'
                : 'btn-3d-primary'
            }`}
            title={systemStatus.simulationRunning ? "Pause live simulation engine" : "Start live simulation engine"}
          >
            {systemStatus.simulationRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-white" />
                <span className="hidden md:inline">Start Simulation</span>
              </>
            )}
          </button>

          {/* Offline Simulation Toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`btn-3d text-xs px-3 py-1.5 font-medium flex items-center space-x-1.5 ${
              systemStatus.online
                ? 'btn-3d-secondary text-slate-700'
                : 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
            }`}
          >
            {systemStatus.online ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">Simulate Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>OFFLINE MODE</span>
              </>
            )}
          </button>

          {/* Sync Button (if pending sync or offline) */}
          {(!systemStatus.online || systemStatus.pendingSync > 0) && (
            <button
              onClick={syncNow}
              className="btn-3d btn-3d-success text-xs px-3 py-1.5 font-medium flex items-center space-x-1.5 animate-bounce"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>Sync Now ({systemStatus.pendingSync})</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {user.username.charAt(0)}
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user.username}</p>
                <span className="text-[10px] text-slate-500 leading-none">{user.role}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden xl:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{user.username}</p>
                  <p className="text-slate-500 text-[10px]">Role: {user.role}</p>
                </div>
                <div className="py-1">
                  <p className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase">Switch Role</p>
                  <button 
                    onClick={() => { login('Admin'); setIsProfileOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 ${user.role === 'Admin' ? 'font-bold text-blue-600' : ''}`}
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => { login('Operator'); setIsProfileOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 ${user.role === 'Operator' ? 'font-bold text-blue-600' : ''}`}
                  >
                    Operator
                  </button>
                  <button 
                    onClick={() => { login('Viewer'); setIsProfileOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 ${user.role === 'Viewer' ? 'font-bold text-blue-600' : ''}`}
                  >
                    Viewer
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button 
                    onClick={() => { logout(); setIsProfileOpen(false); onOpenLoginModal(); }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center space-x-1.5 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Login Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
