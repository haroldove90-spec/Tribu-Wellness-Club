import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { storageService } from './services/storageService';
import { RoleSelectorHome } from './components/RoleSelectorHome';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { SocioView } from './components/socio/SocioView';
import { RecepcionView } from './components/recepcion/RecepcionView';
import { AdminView } from './components/admin/AdminView';
import { EntrenadorView } from './components/entrenador/EntrenadorView';
import { WifiOff } from 'lucide-react';

export default function App() {
  // Active Role state: starts null to show clean RoleSelectorHome on initial load
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  // Current tab within the active role
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Sidebar collapse toggle state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Trigger state for data updates
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Offline status tracking for PWA compliance
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    // Reset to default tab for that role
    switch (role) {
      case 'socio':
        setCurrentTab('dashboard');
        break;
      case 'recepcion':
        setCurrentTab('scanner');
        break;
      case 'admin':
        setCurrentTab('analytics');
        break;
      case 'entrenador':
        setCurrentTab('clases');
        break;
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
  };

  const handleDataChanged = () => {
    setDataVersion(prev => prev + 1);
  };

  // Get active member name for header
  const members = storageService.getMembers();
  const activeMemberId = storageService.getActiveMemberId();
  const activeMember = members.find(m => m.id === activeMemberId) || members[0];
  const activeMemberName = activeMember ? activeMember.name : 'Roberto Montes';

  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  // View: If no role is selected, show pure, clean Role Selector Home Grid
  if (!activeRole) {
    return <RoleSelectorHome onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-[#B4901E]/20 selection:text-[#1D3A4C]">
      
      {/* Offline Connectivity Notification Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-sm z-50">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Modo Sin Conexión activo — Operando con datos locales en memoria segura (PWA).</span>
        </div>
      )}

      {/* Unified Institutional Header */}
      <Header
        activeRole={activeRole}
        onLogout={handleLogout}
        onSwitchRole={handleSelectRole}
        onDataChanged={handleDataChanged}
        activeMemberName={activeMemberName}
      />

      {/* Main Container with Sidebar + Dynamic Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          activeRole={activeRole}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
          activeMemberName={activeMemberName}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-7xl mx-auto w-full">
          {activeRole === 'socio' && (
            <SocioView
              key={`socio-${dataVersion}`}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              onDataChanged={handleDataChanged}
            />
          )}

          {activeRole === 'recepcion' && (
            <RecepcionView
              key={`recepcion-${dataVersion}`}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              onDataChanged={handleDataChanged}
            />
          )}

          {activeRole === 'admin' && (
            <AdminView
              key={`admin-${dataVersion}`}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              onDataChanged={handleDataChanged}
            />
          )}

          {activeRole === 'entrenador' && (
            <EntrenadorView
              key={`entrenador-${dataVersion}`}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              onDataChanged={handleDataChanged}
            />
          )}
        </main>
      </div>

      {/* Mobile & Tablet Quick Thumb Navigation Bar */}
      <BottomBar
        activeRole={activeRole}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        unreadNotificationsCount={unreadCount}
      />

    </div>
  );
}
