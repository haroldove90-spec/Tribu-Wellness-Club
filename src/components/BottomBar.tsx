import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  QrCode, 
  CalendarCheck, 
  Clock, 
  Bell, 
  Users, 
  Layers, 
  FileText, 
  CreditCard,
  Search,
  Dumbbell
} from 'lucide-react';

interface BottomBarProps {
  activeRole: UserRole;
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadNotificationsCount?: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeRole,
  currentTab,
  onTabChange,
  unreadNotificationsCount = 0,
}) => {
  const getNavItems = () => {
    switch (activeRole) {
      case 'socio':
        return [
          { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
          { id: 'pase', label: 'Mi Pase', icon: QrCode, isPrimaryAction: true },
          { id: 'reservas', label: 'Reservas', icon: CalendarCheck },
          { id: 'visitas', label: 'Mis Visitas', icon: Clock },
          { id: 'notificaciones', label: 'Avisos', icon: Bell, badge: unreadNotificationsCount },
        ];
      case 'recepcion':
        return [
          { id: 'scanner', label: 'Escáner QR', icon: QrCode, isPrimaryAction: true },
          { id: 'manual', label: 'Manual', icon: Search },
          { id: 'aforo', label: 'Aforo', icon: Layers },
          { id: 'historial_hoy', label: 'Accesos', icon: Clock },
        ];
      case 'admin':
        return [
          { id: 'analytics', label: 'Métricas', icon: LayoutDashboard },
          { id: 'socios', label: 'Socios', icon: Users },
          { id: 'areas', label: 'Áreas', icon: Layers },
          { id: 'visitas_global', label: 'Reportes', icon: FileText },
          { id: 'pagos', label: 'Pagos', icon: CreditCard },
        ];
      case 'entrenador':
        return [
          { id: 'clases', label: 'Clases', icon: CalendarCheck },
          { id: 'asistencia', label: 'Pase Lista', icon: Users },
          { id: 'aforo', label: 'Aforo Áreas', icon: Layers },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 select-none safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isPrimaryAction) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative -top-3 flex flex-col items-center justify-center group focus:outline-hidden"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-[#B4901E] text-white ring-4 ring-[#1D3A4C]/10'
                      : 'bg-[#1D3A4C] text-[#B4901E] hover:bg-[#152a37]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                    isActive ? 'text-[#B4901E]' : 'text-[#1D3A4C]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors relative ${
                isActive ? 'text-[#1D3A4C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1D3A4C] stroke-[2.4]' : 'text-slate-400'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 text-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-[#1D3A4C]' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
