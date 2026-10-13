import React from 'react';
import { 
  UserRole 
} from '../types';
import { 
  LayoutDashboard, 
  QrCode, 
  CalendarCheck, 
  Clock, 
  Bell, 
  Users, 
  Layers, 
  CreditCard, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Search,
  Sparkles,
  Dumbbell
} from 'lucide-react';

interface SidebarProps {
  activeRole: UserRole;
  currentTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  activeMemberName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  currentTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  activeMemberName = 'Roberto Montes',
}) => {
  // Navigation items depending on the role
  const getNavItems = () => {
    switch (activeRole) {
      case 'socio':
        return [
          { id: 'dashboard', label: 'Mi Dashboard', icon: LayoutDashboard },
          { id: 'pase', label: 'Mi Pase Digital QR', icon: QrCode, highlight: true },
          { id: 'reservas', label: 'Reserva de Clases', icon: CalendarCheck },
          { id: 'visitas', label: 'Historial de Visitas', icon: Clock },
          { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
        ];
      case 'recepcion':
        return [
          { id: 'scanner', label: 'Escáner Check-In', icon: QrCode, highlight: true },
          { id: 'manual', label: 'Registro de Emergencia', icon: Search },
          { id: 'aforo', label: 'Control de Aforo', icon: Layers },
          { id: 'historial_hoy', label: 'Accesos Recientes', icon: Clock },
        ];
      case 'admin':
        return [
          { id: 'analytics', label: 'Métricas y Analíticas', icon: LayoutDashboard },
          { id: 'socios', label: 'Gestión de Socios (CRUD)', icon: Users },
          { id: 'areas', label: 'Áreas y Disciplinas', icon: Layers },
          { id: 'visitas_global', label: 'Historial de Visitas', icon: FileText },
          { id: 'pagos', label: 'Membresías y Pagos', icon: CreditCard },
        ];
      case 'entrenador':
        return [
          { id: 'clases', label: 'Clases y Reservas', icon: CalendarCheck },
          { id: 'asistencia', label: 'Pase de Lista', icon: Users },
          { id: 'aforo', label: 'Aforo por Disciplina', icon: Layers },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 shadow-xs transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Sidebar Header with Collapse Button */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Módulos del Sistema
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mx-auto lg:mr-0"
          title={isCollapsed ? 'Expandir panel' : 'Colapsar panel'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#1D3A4C] text-white shadow-xs'
                  : item.highlight
                  ? 'bg-[#B4901E]/10 text-[#1D3A4C] hover:bg-[#B4901E]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#B4901E]'
                    : item.highlight
                    ? 'text-[#B4901E]'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate text-left whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Card & Quick Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 mb-2">
            <div className="text-[11px] font-bold text-[#1D3A4C] truncate">
              {activeRole === 'socio' ? activeMemberName : activeRole === 'admin' ? 'Roberto Montes (CEO)' : activeRole === 'recepcion' ? 'Caseta Recepción' : 'Coach Staff'}
            </div>
            <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Sesión Activa
            </div>
          </div>
        ) : null}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Salir de este rol</span>}
        </button>
      </div>
    </aside>
  );
};
