import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusText: string;
  statusType: 'optimal' | 'good' | 'warning' | 'critical' | 'info';
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendText?: string;
  onClick?: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  statusText,
  statusType,
  icon: Icon,
  trend,
  trendText,
  onClick,
}) => {
  const getStatusBadge = () => {
    switch (statusType) {
      case 'optimal':
      case 'good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getDotColor = () => {
    switch (statusType) {
      case 'optimal':
      case 'good':
        return 'led-dot-green';
      case 'warning':
        return 'led-dot-warning';
      case 'critical':
        return 'led-dot-danger';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        card-3d p-5 flex flex-col justify-between relative overflow-hidden group transition-all duration-300
        ${onClick ? 'cursor-pointer card-3d-interactive' : ''}
      `}
    >
      {/* Top row: Title & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Main value display */}
      <div className="my-1 flex items-baseline space-x-1.5">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-lg font-semibold text-slate-500">{unit}</span>}
      </div>

      {/* Bottom row: Status badge & Trend */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${getStatusBadge()}`}>
          <span className={`led-dot ${getDotColor()}`} />
          <span>{statusText}</span>
        </div>

        {trend && (
          <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-500">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-amber-600" />}
            {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            {trendText && <span>{trendText}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
