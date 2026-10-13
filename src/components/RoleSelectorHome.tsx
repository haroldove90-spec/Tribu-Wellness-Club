import React, { useState } from 'react';
import { UserRole } from '../types';
import { UserCheck, QrCode, Shield, Dumbbell } from 'lucide-react';

interface RoleSelectorHomeProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorHome: React.FC<RoleSelectorHomeProps> = ({ onSelectRole }) => {
  const [logoFailed, setLogoFailed] = useState(false);

  const roles = [
    {
      id: 'socio' as UserRole,
      title: 'Socio / Usuario',
      icon: <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#B4901E]" strokeWidth={1.75} />,
      badge: 'App Móvil',
    },
    {
      id: 'recepcion' as UserRole,
      title: 'Recepción / Control de Acceso',
      icon: <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D3A4C]" strokeWidth={1.75} />,
      badge: 'Caja / Entrada',
    },
    {
      id: 'entrenador' as UserRole,
      title: 'Entrenador / Staff Deportivo',
      icon: <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D3A4C]" strokeWidth={1.75} />,
      badge: 'Clases / Áreas',
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrador / Gerencia',
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#B4901E]" strokeWidth={1.75} />,
      badge: 'Panel Web',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 select-none">
      
      {/* Centered Institutional Logo as requested */}
      <div className="mb-8 sm:mb-12 flex flex-col items-center text-center">
        {!logoFailed ? (
          <img
            src="https://appdesignproyectos.com/tribulogo.png"
            alt="Tribu Wellness Club"
            onError={() => setLogoFailed(true)}
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#1D3A4C] text-[#B4901E] flex items-center justify-center text-2xl font-black shadow-md border-2 border-[#B4901E]">
              T
            </div>
            <div className="text-left">
              <span className="block font-black text-2xl tracking-widest text-[#1D3A4C] leading-none">TRIBU</span>
              <span className="block text-xs font-bold tracking-widest text-[#B4901E] mt-1">WELLNESS CLUB</span>
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
              className="group relative flex flex-col items-center justify-center p-5 sm:p-8 bg-white rounded-2xl border border-slate-200 hover:border-[#B4901E] shadow-sm hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-97 cursor-pointer text-center overflow-hidden aspect-square sm:aspect-auto sm:min-h-[220px]"
            >
              {/* Subtle top indicator bar on hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-transparent group-hover:bg-[#B4901E] transition-all" />

              {/* Logo / Emblema de la Tarjeta */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 group-hover:bg-[#1D3A4C]/5 border border-slate-100 group-hover:border-[#B4901E]/30 flex items-center justify-center transition-colors mb-4 shadow-inner">
                {r.icon}
              </div>

              {/* Solo Nombre del Rol */}
              <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1D3A4C] transition-colors leading-tight px-1">
                {r.title}
              </h2>
            </button>
          ))}
        </div>
      </div>

      {/* Quiet footer branding */}
      <div className="mt-10 sm:mt-14 text-center">
        <p className="text-[11px] text-slate-600 font-medium tracking-wide">
          Ingeniería Eléctrica CFP · Tribu Wellness Club
        </p>
      </div>
    </div>
  );
};
