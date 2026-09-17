import React from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notificationsList, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications 
  } = useSystem();

  if (!isOpen) return null;

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm">System Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
        <button 
          onClick={markAllNotificationsAsRead}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
        <button 
          onClick={clearNotifications}
          className="text-slate-500 hover:text-red-600 font-medium flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear all</span>
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notificationsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No notifications available
          </div>
        ) : (
          notificationsList.map((notif) => {
            const getIcon = () => {
              switch (notif.type) {
                case 'alert':
                  return <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />;
                case 'warning':
                  return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
                case 'success':
                  return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
                default:
                  return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
              }
            };

            return (
              <div 
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/60 hover:bg-blue-50'
                }`}
              >
                {getIcon()}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${notif.read ? 'text-slate-700 font-normal' : 'text-slate-900 font-semibold'}`}>
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
