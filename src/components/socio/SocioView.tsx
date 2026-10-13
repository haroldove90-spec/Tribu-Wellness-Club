import React, { useState, useMemo } from 'react';
import { 
  Member, 
  Area, 
  VisitRecord, 
  ClassSession, 
  ClassReservation, 
  NotificationItem, 
  AreaId 
} from '../../types';
import { storageService } from '../../services/storageService';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { 
  QrCode, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Waves, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  User, 
  CreditCard, 
  Calendar, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  X, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SocioViewProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onDataChanged: () => void;
}

export const SocioView: React.FC<SocioViewProps> = ({
  currentTab,
  onTabChange,
  onDataChanged,
}) => {
  const members = storageService.getMembers();
  const activeMemberId = storageService.getActiveMemberId();
  const currentMember = useMemo(() => {
    return members.find(m => m.id === activeMemberId) || members[0] || null;
  }, [members, activeMemberId]);

  const areas = storageService.getAreas();
  const visits = storageService.getVisits();
  const classes = storageService.getClasses();
  const reservations = storageService.getReservations();
  const notifications = storageService.getNotifications();

  // State for QR digital pass modal
  const [selectedPassArea, setSelectedPassArea] = useState<AreaId>('gimnasio');
  const [showFullQRModal, setShowFullQRModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Filter member's specific visits
  const memberVisits = useMemo(() => {
    if (!currentMember) return [];
    return visits.filter(v => v.memberId === currentMember.id);
  }, [visits, currentMember]);

  // Filter member's reservations
  const memberReservations = useMemo(() => {
    if (!currentMember) return [];
    return reservations.filter(r => r.memberId === currentMember.id && r.status === 'confirmada');
  }, [reservations, currentMember]);

  // Area icons map
  const getAreaIcon = (id: AreaId) => {
    switch (id) {
      case 'natacion': return <Waves className="w-5 h-5 text-sky-500" />;
      case 'yoga': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'gimnasio': return <Dumbbell className="w-5 h-5 text-emerald-600" />;
      case 'cross': return <Flame className="w-5 h-5 text-rose-500" />;
    }
  };

  const handleBookClass = (session: ClassSession) => {
    if (!currentMember) return;
    
    // Check if class already booked
    const alreadyBooked = reservations.some(
      r => r.memberId === currentMember.id && r.sessionId === session.id && r.status === 'confirmada'
    );
    if (alreadyBooked) return;

    storageService.createReservation({
      sessionId: session.id,
      memberId: currentMember.id,
      memberName: currentMember.name,
      areaId: session.areaId,
      className: session.className,
      instructor: session.instructor,
      schedule: session.schedule,
      date: session.date,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1D3A4C', '#B4901E', '#10B981'],
    });

    setBookingSuccess(session.id);
    onDataChanged();
    setTimeout(() => setBookingSuccess(null), 3000);
  };

  const handleCancelBooking = (reservationId: string) => {
    storageService.cancelReservation(reservationId);
    onDataChanged();
  };

  const handleSwitchMember = (id: string) => {
    storageService.setActiveMemberId(id);
    onDataChanged();
  };

  if (!currentMember) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No hay socios registrados en el sistema</h3>
        <p className="text-xs text-slate-500 mt-1">Los datos de muestra fueron vaciados. Registra un nuevo socio desde el Panel de Administrador.</p>
        <button
          onClick={() => {
            storageService.restoreDemoData();
            onDataChanged();
          }}
          className="mt-4 px-4 py-2 rounded-xl bg-[#1D3A4C] text-white text-xs font-semibold"
        >
          Restaurar Socios de Muestra
        </button>
      </div>
    );
  }

  // Value for dynamic QR pass
  const qrPassPayload = JSON.stringify({
    memberId: currentMember.id,
    memberNumber: currentMember.memberNumber,
    name: currentMember.name,
    plan: currentMember.planName,
    status: currentMember.status,
    targetArea: selectedPassArea,
    validUntil: currentMember.expirationDate,
    t: Date.now(),
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">

      {/* Switch member testing strip (for demo convenience to test Roberto Montes vs Mariana vs Esteban) */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Simular Socio Activo:</span>
          <div className="flex flex-wrap gap-1.5">
            {members.slice(0, 4).map((m) => {
              const isSelected = m.id === currentMember.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSwitchMember(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1D3A4C] text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    m.status === 'activa' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`} />
                  {m.name.split(' ')[0]} ({m.planName.split(' ')[1] || m.status})
                </button>
              );
            })}
          </div>
        </div>
        <span className="text-[11px] text-slate-600 font-medium">
          Membresía: <strong className={currentMember.status === 'activa' ? 'text-emerald-600' : 'text-rose-600'}>
            {currentMember.status.toUpperCase()}
          </strong>
        </span>
      </div>

      {/* SUB-VIEW: DASHBOARD / INICIO */}
      {(currentTab === 'dashboard' || !['pase', 'reservas', 'visitas', 'notificaciones'].includes(currentTab)) && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Hero Digital Membership Card */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1D3A4C] via-[#162e3d] to-black text-white p-6 sm:p-8 shadow-xl border border-slate-700">
            {/* Background texture watermark */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
              <img 
                src="https://appdesignproyectos.com/tribuicono.png" 
                alt="" 
                className="w-64 h-64 object-contain" 
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#B4901E] shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B4901E] bg-[#B4901E]/15 px-2 py-0.5 rounded-md border border-[#B4901E]/30">
                      {currentMember.planName}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      currentMember.status === 'activa'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {currentMember.status === 'activa' ? '● Activa Vigente' : '● Vencida'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                    {currentMember.name}
                  </h1>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Socio N°: <span className="text-white font-semibold">{currentMember.memberNumber}</span> · Vence: <span className="text-[#B4901E] font-semibold">{currentMember.expirationDate}</span>
                  </p>
                </div>
              </div>

              {/* Destacado Botón "Mi Pase de Entrada" */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onTabChange('pase')}
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#B4901E] to-[#967615] hover:from-[#967615] hover:to-[#B4901E] text-white font-bold text-sm shadow-lg shadow-[#B4901E]/30 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <QrCode className="w-5 h-5 text-white animate-pulse" />
                  <span>Mi Pase de Entrada</span>
                </button>
              </div>
            </div>

            {/* Quick Permissions Pills */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#B4901E]" />
                <span>Áreas Autorizadas en tu Plan:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['natacion', 'yoga', 'gimnasio', 'cross'] as const).map((aid) => {
                  const hasAccess = currentMember.allowedAreas.includes(aid);
                  const names: Record<AreaId, string> = {
                    natacion: 'Natación',
                    yoga: 'Yoga & Mind',
                    gimnasio: 'Gimnasio',
                    cross: 'Cross',
                  };
                  return (
                    <span
                      key={aid}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        hasAccess
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 line-through'
                      }`}
                    >
                      {hasAccess ? '✓ ' : '✕ '} {names[aid]}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4 Disciplinas / Áreas Quick Status Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Disciplinas y Aforo en Tiempo Real
              </h2>
              <button
                onClick={() => onTabChange('reservas')}
                className="text-xs font-semibold text-[#1D3A4C] hover:text-[#B4901E] transition flex items-center gap-1"
              >
                Ver Horarios de Clases <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {areas.map((area) => {
                const hasPerm = currentMember.allowedAreas.includes(area.id);
                const occupancyPercent = Math.round((area.currentOccupancy / area.maxCapacity) * 100);

                return (
                  <div
                    key={area.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          {getAreaIcon(area.id)}
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          hasPerm 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {hasPerm ? 'Incluido' : 'No en tu plan'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{area.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {area.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span>Aforo actual</span>
                        <span className="font-mono font-bold text-slate-900">
                          {area.currentOccupancy} / {area.maxCapacity} ({occupancyPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            occupancyPercent > 85 ? 'bg-rose-500' : occupancyPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats & Next Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Próximas reservas activas */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#B4901E]" />
                  <h3 className="text-sm font-bold text-slate-900">Mis Próximas Reservas</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {memberReservations.length} agendadas
                </span>
              </div>

              {memberReservations.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
                  No tienes clases reservadas para hoy.
                  <button
                    onClick={() => onTabChange('reservas')}
                    className="block mx-auto mt-2 text-[#1D3A4C] font-bold hover:underline"
                  >
                    Explorar clases disponibles →
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memberReservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{res.className}</span>
                        <span className="text-slate-500 text-[11px]">
                          {res.schedule} · {res.instructor}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(res.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Últimas visitas registradas */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1D3A4C]" />
                  <h3 className="text-sm font-bold text-slate-900">Últimos Accesos</h3>
                </div>
                <button
                  onClick={() => onTabChange('visitas')}
                  className="text-xs font-semibold text-[#1D3A4C] hover:text-[#B4901E]"
                >
                  Ver todo
                </button>
              </div>

              {memberVisits.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
                  Aún no registras asistencias recientes.
                </div>
              ) : (
                <div className="space-y-2">
                  {memberVisits.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          v.status === 'permitido' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <div>
                          <span className="font-semibold text-slate-900 block">{v.areaName}</span>
                          <span className="text-slate-500 text-[11px]">
                            {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(v.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        v.status === 'permitido' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {v.status === 'permitido' ? 'Acceso OK' : 'Denegado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW: MI PASE DIGITAL QR */}
      {currentTab === 'pase' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
          
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B4901E]">
                Pase de Entrada Móvil · Tribu Wellness Club
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1D3A4C]">
                {currentMember.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Membresía: <strong className="text-slate-800">{currentMember.planName}</strong> · ID: {currentMember.memberNumber}
              </p>
            </div>

            {/* Target Area Selector for the QR Pass */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Selecciona el Área que vas a ingresar:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['natacion', 'yoga', 'gimnasio', 'cross'] as const).map((aid) => {
                  const isSelected = selectedPassArea === aid;
                  const hasPerm = currentMember.allowedAreas.includes(aid);
                  const names: Record<AreaId, string> = {
                    natacion: 'Natación',
                    yoga: 'Yoga & Mind',
                    gimnasio: 'Gimnasio',
                    cross: 'Cross',
                  };
                  return (
                    <button
                      key={aid}
                      onClick={() => setSelectedPassArea(aid)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all ${
                        isSelected
                          ? 'bg-[#1D3A4C] text-white border-[#1D3A4C] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="shrink-0">{getAreaIcon(aid)}</div>
                      <span className="text-[11px] truncate">{names[aid]}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-sm ${
                        hasPerm ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {hasPerm ? 'Incluido' : 'Sin Acceso'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/60 rounded-3xl border border-slate-200">
              <QRCodeDisplay
                value={qrPassPayload}
                size={220}
                fgColor="#1D3A4C"
              />

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>QR Activo para escaneo en Recepción / Torniquete</span>
              </div>
            </div>

            {/* Status explanation */}
            <div className={`p-4 rounded-2xl text-xs text-left border ${
              currentMember.status === 'activa' && currentMember.allowedAreas.includes(selectedPassArea)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {currentMember.status === 'activa' && currentMember.allowedAreas.includes(selectedPassArea) ? (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">🟢 Acceso Permitido al Presentar este QR</span>
                    Tu plan incluye esta área y tu membresía está al corriente. Acerca este código al lector óptico o cámara en recepción.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">🔴 Advertencia de Acceso</span>
                    {currentMember.status !== 'activa'
                      ? 'Tu membresía se encuentra vencida. Recepción emitirá alerta de cobro pendiente.'
                      : 'Tu plan contratado no incluye esta área deportiva. El escáner emitirá sonido de advertencia.'}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
              <button
                onClick={() => onTabChange('dashboard')}
                className="text-[#1D3A4C] font-semibold hover:underline"
              >
                ← Volver al Dashboard
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW: RESERVA DE CLASES / DISCIPLINAS */}
      {currentTab === 'reservas' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Reserva de Clases y Disciplinas con Cupo Limitado
              </h2>
              <p className="text-xs text-slate-500">
                Horarios programados para Natación, Yoga, Gimnasio y Cross Training.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Fecha: Hoy ({new Date().toLocaleDateString()})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const hasAreaAccess = currentMember.allowedAreas.includes(cls.areaId);
              const isAlreadyBooked = reservations.some(
                r => r.memberId === currentMember.id && r.sessionId === cls.id && r.status === 'confirmada'
              );
              const spotsLeft = cls.maxCapacity - cls.reservedCount;
              const isFull = spotsLeft <= 0;

              return (
                <div
                  key={cls.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          {getAreaIcon(cls.areaId)}
                        </div>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {cls.areaId}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-[#1D3A4C]/10 text-[#1D3A4C] px-2 py-0.5 rounded-md">
                        {cls.schedule}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {cls.className}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Instructor: <strong className="text-slate-700">{cls.instructor}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Nivel: {cls.level}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs font-medium">
                      <span className={`font-mono font-bold ${spotsLeft <= 3 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {spotsLeft} lugares disponibles
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Cupo máx: {cls.maxCapacity}
                      </span>
                    </div>

                    {isAlreadyBooked ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Reservado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBookClass(cls)}
                        disabled={isFull || !hasAreaAccess}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                          !hasAreaAccess
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : isFull
                            ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                            : bookingSuccess === cls.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1D3A4C] hover:bg-[#152a37] text-white active:scale-95'
                        }`}
                      >
                        {!hasAreaAccess
                          ? 'No en tu plan'
                          : isFull
                          ? 'Cupo Lleno'
                          : bookingSuccess === cls.id
                          ? '¡Agendado!'
                          : 'Reservar Cupo'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-VIEW: HISTORIAL PERSONAL DE VISITAS */}
      {currentTab === 'visitas' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Historial Personal de Visitas y Asistencias
              </h2>
              <p className="text-xs text-slate-500">
                Registro cronológico de tus entradas a las instalaciones de Tribu Wellness Club.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1D3A4C] bg-slate-100 px-3 py-1.5 rounded-xl">
              Total asistencias: {memberVisits.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {memberVisits.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No hay registros de visitas asociadas a este socio aún.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Fecha y Hora</th>
                      <th className="px-4 py-3.5">Área / Disciplina</th>
                      <th className="px-4 py-3.5">Estado de Entrada</th>
                      <th className="px-4 py-3.5">Punto de Control</th>
                      <th className="px-4 py-3.5">Motivo / Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {memberVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                          {new Date(v.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                          {getAreaIcon(v.areaId)}
                          <span>{v.areaName}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            v.status === 'permitido'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              v.status === 'permitido' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`} />
                            {v.status === 'permitido' ? 'Acceso Autorizado' : 'Acceso Denegado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {v.recordedBy}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                          {v.reason || 'Membresía vigente + área autorizada'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-VIEW: NOTIFICACIONES */}
      {currentTab === 'notificaciones' && (
        <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Centro de Notificaciones</h2>
              <p className="text-xs text-slate-500">Avisos importantes sobre tu membresía y eventos del club.</p>
            </div>
            <Bell className="w-5 h-5 text-[#B4901E]" />
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read ? 'bg-white border-slate-200' : 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1D3A4C]/10 text-[#1D3A4C] flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-[#B4901E]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-600 font-mono mt-2 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => {
                        storageService.markNotificationAsRead(notif.id);
                        onDataChanged();
                      }}
                      className="text-[11px] font-semibold text-[#1D3A4C] hover:underline shrink-0"
                    >
                      Marcar leída
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
