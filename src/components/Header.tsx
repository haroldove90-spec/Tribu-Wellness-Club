import React, { useState } from 'react';
import { 
  LogOut, 
  Download, 
  Trash2, 
  Database, 
  UserCheck, 
  Shield, 
  Dumbbell, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallModal } from './Modals/IOSInstallModal';
import { ClearDataModal } from './Modals/ClearDataModal';
import { SupabaseSettingsModal } from './Modals/SupabaseSettingsModal';

interface HeaderProps {
  activeRole: UserRole | null;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onDataChanged: () => void;
  activeMemberName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onLogout,
  onSwitchRole,
  onDataChanged,
  activeMemberName = 'Roberto Montes',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In desktop chrome/firefox, trigger standard guidance or alert
      setShowIOSModal(true);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'socio':
        return {
          label: `Socio: ${activeMemberName}`,
          icon: <UserCheck className="w-3.5 h-3.5 text-[#B4901E]" />,
          color: 'bg-[#B4901E]/15 text-[#B4901E] border-[#B4901E]/30',
        };
      case 'recepcion':
        return {
          label: 'Control de Acceso / Recepción',
          icon: <QrCode className="w-3.5 h-3.5 text-emerald-400" />,
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'admin':
        return {
          label: 'Administrador / Gerencia',
          icon: <Shield className="w-3.5 h-3.5 text-amber-300" />,
          color: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
        };
      case 'entrenador':
        return {
          label: 'Entrenador / Staff Deportivo',
          icon: <Dumbbell className="w-3.5 h-3.5 text-sky-400" />,
          color: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
        };
    }
  };

  const currentBadge = activeRole ? getRoleBadge(activeRole) : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1D3A4C] text-white border-b border-[#254960] shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand and Logo Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              title="Volver al Selector de Roles"
            >
              {logoLoaded ? (
                <img
                  src="https://appdesignproyectos.com/tribulogo.png"
                  alt="Tribu Wellness Club"
                  onError={() => setLogoLoaded(false)}
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#B4901E] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    T
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold tracking-wider text-sm leading-tight text-white">TRIBU</span>
                    <span className="text-[10px] tracking-widest text-[#B4901E] font-medium leading-none">WELLNESS CLUB</span>
                  </div>
                </div>
              )}
            </button>

            {/* Subtitle / System Tag */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/15">
              <span className="text-[11px] font-medium text-slate-300 tracking-wide">
                Ingeniería Eléctrica CFP
              </span>
            </div>
          </div>

          {/* Active Role Indicator and Quick Switch */}
          {activeRole && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs shadow-xs transition-colors bg-white/10 border-white/20 text-white">
                {currentBadge?.icon}
                <span className="truncate max-w-[190px]">{currentBadge?.label}</span>
              </div>

              {/* Quick Role Switcher Pill */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Cambiar Rol</span>
                  <span className="sm:hidden font-bold">Rol ▾</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-600 tracking-wider border-b border-slate-100">
                    Cambio Rápido de Rol
                  </div>
                  <button
                    onClick={() => onSwitchRole('socio')}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-50 transition ${activeRole === 'socio' ? 'font-bold text-[#1D3A4C] bg-slate-50' : 'text-slate-700'}`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#B4901E]" />
                    Socio / Usuario
                  </button>
                  <button
                    onClick={() => onSwitchRole('recepcion')}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-50 transition ${activeRole === 'recepcion' ? 'font-bold text-[#1D3A4C] bg-slate-50' : 'text-slate-700'}`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    Recepción / Check-In
                  </button>
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-50 transition ${activeRole === 'admin' ? 'font-bold text-[#1D3A4C] bg-slate-50' : 'text-slate-700'}`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    Administrador (CEO)
                  </button>
                  <button
                    onClick={() => onSwitchRole('entrenador')}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-50 transition ${activeRole === 'entrenador' ? 'font-bold text-[#1D3A4C] bg-slate-50' : 'text-slate-700'}`}
                  >
                    <Dumbbell className="w-3.5 h-3.5 text-sky-600" />
                    Entrenador / Clases
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Zone: Install PWA + Clear Data + Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* PWA Quick Install Button */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#B4901E] hover:bg-[#9a7b18] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                title="Instalar como App nativa en tu dispositivo"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Instalar App</span>
                <span className="sm:hidden">Instalar</span>
              </button>
            )}

            {/* Clear Sample Data Button */}
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600/90 text-slate-200 hover:text-white text-xs font-medium border border-white/10 transition-colors"
              title="Borrar datos de muestra del navegador / Limpieza"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Borrar Muestra</span>
            </button>

            {/* Supabase Cloud Connection Indicator */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
              title="Configurar conexión con base de datos Supabase"
            >
              <Database className="w-3.5 h-3.5 text-[#B4901E]" />
              <span className="text-[11px]">Supabase</span>
            </button>

            {/* Logout / Exit Role Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors shadow-xs"
              title="Cerrar Sesión y volver al inicio"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      <ClearDataModal 
        isOpen={showClearModal} 
        onClose={() => setShowClearModal(false)} 
        onDataChanged={onDataChanged} 
      />
      <SupabaseSettingsModal 
        isOpen={showSupabaseModal} 
        onClose={() => setShowSupabaseModal(false)} 
        onDataCleared={onDataChanged} 
      />
    </>
  );
};
