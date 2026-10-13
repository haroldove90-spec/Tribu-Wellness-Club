import React, { useState } from 'react';
import { UserRole } from '../types';
import { UserCheck, QrCode, Shield, Dumbbell, Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallModal } from './Modals/IOSInstallModal';

interface RoleSelectorHomeProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorHome: React.FC<RoleSelectorHomeProps> = ({ onSelectRole }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  const roles = [
    {
      id: 'socio' as UserRole,
      title: 'Socio / Usuario',
      icon: <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#B4901E]" strokeWidth={1.75} />,
    },
    {
      id: 'recepcion' as UserRole,
      title: 'Recepción / Control de Acceso',
      icon: <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D3A4C]" strokeWidth={1.75} />,
    },
    {
      id: 'entrenador' as UserRole,
      title: 'Entrenador / Staff Deportivo',
      icon: <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D3A4C]" strokeWidth={1.75} />,
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrador / Gerencia',
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#B4901E]" strokeWidth={1.75} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 select-none">
      
      {/* Centered Institutional Logo */}
      <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
        {!logoFailed ? (
          <img
            src="https://appdesignproyectos.com/tribulogo.png"
            alt="Tribu Wellness Club"
            onError={() => setLogoFailed(true)}
            className="h-14 sm:h-20 w-auto object-contain drop-shadow-xs"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1D3A4C] text-[#B4901E] flex items-center justify-center text-2xl font-black shadow-md border-2 border-[#B4901E]">
              T
            </div>
            <div className="text-left">
              <span className="block font-black text-xl sm:text-2xl tracking-widest text-[#1D3A4C] leading-none">TRIBU</span>
              <span className="block text-[10px] sm:text-xs font-bold tracking-widest text-[#B4901E] mt-1">WELLNESS CLUB</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: 2 columns mobile / 4 columns desktop */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className="group relative flex flex-col items-center justify-center p-4 sm:p-8 bg-white rounded-2xl border border-slate-200 hover:border-[#B4901E] shadow-xs hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-97 cursor-pointer text-center overflow-hidden aspect-square sm:aspect-auto sm:min-h-[220px]"
            >
              {/* Subtle top indicator bar on hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-transparent group-hover:bg-[#B4901E] transition-all" />

              {/* Logo / Emblema de la Tarjeta */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 group-hover:bg-[#1D3A4C]/5 border border-slate-100 group-hover:border-[#B4901E]/30 flex items-center justify-center transition-colors mb-3 sm:mb-4 shadow-inner">
                {r.icon}
              </div>

              {/* Solo Nombre del Rol */}
              <h2 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-[#1D3A4C] transition-colors leading-tight px-1">
                {r.title}
              </h2>
            </button>
          ))}
        </div>

        {/* Botón para instalar la app debajo de los iconos de los roles (en el home) */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#B4901E] via-[#a38018] to-[#1D3A4C] hover:from-[#967615] hover:to-[#152a37] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#B4901E]/25 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
            title="Instalar aplicación en tu dispositivo"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 animate-bounce" />
            <span>Instalar Aplicación (PWA)</span>
          </button>
          <p className="text-[11px] text-slate-500 mt-2 font-medium text-center">
            Instalable en Android, iOS (iPhone/iPad) y computadoras
          </p>
        </div>
      </div>

      {/* Quiet footer branding */}
      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-[11px] text-slate-500 font-medium tracking-wide">
          Ingeniería Eléctrica CFP · Tribu Wellness Club
        </p>
      </div>

      {/* iOS Safari Guide Modal */}
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </div>
  );
};
