import React, { useState } from 'react';
import { Snowflake, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useSystem();
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Operator' | 'Viewer'>('Operator');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== 'demo123') {
      setError('Invalid password. Use demo password: demo123');
      return;
    }
    setError('');
    login(selectedRole);
    onClose();
  };

  const handleQuickDemoAccess = () => {
    login('Operator');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Snowflake className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <h2 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-emerald-300 bg-clip-text text-transparent">
            AGROFROST
          </h2>
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">
            JARVIS Smart Cold Storage System
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Solar-Powered Vegetable Preservation System • SIH 2026 #SIH26005
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Access Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Operator', 'Admin', 'Viewer'] as const).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedRole === role
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-[11px] text-red-600 font-semibold mt-1">{error}</p>}
          </div>

          {/* Demo Credentials Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>SIH Judge Demo Access Credentials</span>
            </div>
            <p className="text-[11px] text-amber-800">
              User: <strong className="font-mono">Demo Operator</strong> | Password: <strong className="font-mono">demo123</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="btn-3d btn-3d-primary w-full text-sm py-2.5 font-bold flex items-center justify-center space-x-2"
            >
              <span>Authenticate & Enter System</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="btn-3d btn-3d-secondary w-full text-xs py-2 font-semibold text-slate-700 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Quick Demo Access (One-Click)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
