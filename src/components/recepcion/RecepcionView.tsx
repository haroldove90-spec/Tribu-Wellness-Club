import React, { useState, useMemo } from 'react';
import { 
  Member, 
  Area, 
  VisitRecord, 
  AreaId 
} from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Waves, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  User, 
  Clock, 
  Layers, 
  ShieldAlert, 
  UserCheck, 
  ArrowRight,
  RefreshCw,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecepcionViewProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onDataChanged: () => void;
}

export const RecepcionView: React.FC<RecepcionViewProps> = ({
  currentTab,
  onTabChange,
  onDataChanged,
}) => {
  const members = storageService.getMembers();
  const areas = storageService.getAreas();
  const visits = storageService.getVisits();

  // Selected gate/area of entry
  const [selectedGateArea, setSelectedGateArea] = useState<AreaId>('gimnasio');

  // Manual search query
  const [searchQuery, setSearchQuery] = useState('');

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active validation result (🟢 or 🔴)
  const [lastValidation, setLastValidation] = useState<{
    member: Member;
    area: Area;
    isAllowed: boolean;
    reason: string;
    timestamp: Date;
  } | null>(null);

  // Simulated scanning animation state
  const [isScanning, setIsScanning] = useState(false);

  const getAreaIcon = (id: AreaId) => {
    switch (id) {
      case 'natacion': return <Waves className="w-5 h-5 text-sky-500" />;
      case 'yoga': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'gimnasio': return <Dumbbell className="w-5 h-5 text-emerald-600" />;
      case 'cross': return <Flame className="w-5 h-5 text-rose-500" />;
    }
  };

  const currentGate = useMemo(() => {
    return areas.find(a => a.id === selectedGateArea) || areas[0];
  }, [areas, selectedGateArea]);

  // Process access check-in for a member
  const processCheckIn = (member: Member, viaMethod: 'Escáner QR' | 'Registro Manual') => {
    setIsScanning(true);
    if (soundEnabled) audioService.playScanClick();

    setTimeout(() => {
      setIsScanning(false);
      const isMembershipActive = member.status === 'activa';
      const isAreaPermitted = member.allowedAreas.includes(selectedGateArea);

      const isAllowed = isMembershipActive && isAreaPermitted;

      let reason = 'Membresía activa + Área autorizada en su plan.';
      if (!isMembershipActive) {
        reason = `Membresía ${member.status.toUpperCase()} (Expiró el ${member.expirationDate}). Requiere pago/renovación.`;
      } else if (!isAreaPermitted) {
        reason = `Área no permitida: El paquete "${member.planName}" no incluye acceso a ${currentGate.name}.`;
      }

      // Audio feedback
      if (soundEnabled) {
        if (isAllowed) {
          audioService.playAccessGranted();
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#1D3A4C', '#B4901E'],
          });
        } else {
          audioService.playAccessDenied();
        }
      }

      // Record in system visits log
      storageService.recordVisit({
        memberId: member.id,
        memberName: member.name,
        memberNumber: member.memberNumber,
        memberAvatar: member.avatar,
        areaId: selectedGateArea,
        areaName: currentGate.name,
        status: isAllowed ? 'permitido' : 'denegado',
        reason,
        recordedBy: `Recepción - ${viaMethod} (${currentGate.name})`,
      });

      setLastValidation({
        member,
        area: currentGate,
        isAllowed,
        reason,
        timestamp: new Date(),
      });

      onDataChanged();
    }, 450);
  };

  // Filtered members for manual search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return members.filter(
      m => m.name.toLowerCase().includes(q) ||
           m.memberNumber.toLowerCase().includes(q) ||
           m.phone.includes(q) ||
           m.email.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">

      {/* Gate / Turnstile Area Selector Banner */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B4901E] uppercase tracking-wider">
            Punto de Control y Acceso Físico
          </span>
          <h1 className="text-lg sm:text-xl font-black text-[#1D3A4C] flex items-center gap-2">
            <span>Torniquete Activo:</span>
            <span className="text-[#B4901E] underline decoration-2">{currentGate.name}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            El sistema validará que cada socio tenga este acceso autorizado antes de abrir la compuerta.
          </p>
        </div>

        {/* Area selection tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          {(['natacion', 'yoga', 'gimnasio', 'cross'] as const).map((aid) => {
            const isSelected = selectedGateArea === aid;
            const names: Record<AreaId, string> = {
              natacion: 'Natación',
              yoga: 'Yoga',
              gimnasio: 'Gimnasio',
              cross: 'Cross',
            };
            return (
              <button
                key={aid}
                onClick={() => setSelectedGateArea(aid)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1D3A4C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {getAreaIcon(aid)}
                <span>{names[aid]}</span>
              </button>
            );
          })}
        </div>

        {/* Audio feedback toggle */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Activar o silenciar alertas sonoras"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sonido ON' : 'Silencio'}</span>
          </button>
        </div>
      </div>

      {/* MAIN CHECK-IN & SCANNER WORKSPACE */}
      {(currentTab === 'scanner' || !['manual', 'aforo', 'historial_hoy'].includes(currentTab)) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Left Column: Simulated QR Camera Scanner & Rapid Test Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1D3A4C]/10 text-[#1D3A4C] flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4 text-[#B4901E]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Escáner Óptico de Código QR
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Cámara activa orientada al lector del socio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>En Línea</span>
                </div>
              </div>

              {/* Viewfinder simulation box */}
              <div className="relative aspect-video sm:aspect-21/9 bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-slate-800 overflow-hidden shadow-inner">
                {/* Laser Scanning Line Animation */}
                <div
                  className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B4901E] to-transparent shadow-lg shadow-[#B4901E] z-20 ${
                    isScanning ? 'animate-bounce' : 'animate-pulse'
                  }`}
                  style={{ top: isScanning ? '50%' : '35%' }}
                />

                {/* Target Corners */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center p-4">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#B4901E]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#B4901E]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#B4901E]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#B4901E]" />

                  <QrCode className="w-16 h-16 text-white/30" />
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-2 px-2">
                    {isScanning ? 'Procesando lectura...' : 'Coloca el QR del socio aquí'}
                  </span>
                </div>

                <span className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400">
                  FPS: 60 · ISO 400 · Sensor Óptico
                </span>
                <span className="absolute bottom-3 right-4 text-[10px] font-mono text-[#B4901E]">
                  Área: {currentGate.name.toUpperCase()}
                </span>
              </div>

              {/* Quick One-Click QR Emulators (Ideal for CEO Roberto Montes to test all flows) */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Prueba rápida de escaneo con socios muestra:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.slice(0, 4).map((m) => {
                    const hasAccess = m.status === 'activa' && m.allowedAreas.includes(selectedGateArea);
                    return (
                      <button
                        key={m.id}
                        onClick={() => processCheckIn(m, 'Escáner QR')}
                        disabled={isScanning}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1D3A4C] hover:bg-slate-50 transition-all text-left flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={m.avatar}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#1D3A4C] truncate block">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono truncate block">
                              {m.planName}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          hasAccess
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {hasAccess ? 'Esperado: 🟢' : 'Esperado: 🔴'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Validation Screen (🟢 Acceso Permitido / 🔴 Denegado) (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 min-h-[360px] flex flex-col justify-between">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Resultado de Validación en Tiempo Real
                </span>

                {lastValidation ? (
                  <div className={`p-5 rounded-2xl border-2 transition-all mt-3 ${
                    lastValidation.isAllowed
                      ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10'
                      : 'bg-rose-50/90 border-rose-500 text-rose-950 shadow-lg shadow-rose-500/10'
                  }`}>
                    {/* Visual Status Indicator Badge */}
                    <div className="flex items-center gap-3">
                      {lastValidation.isAllowed ? (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                          <XCircle className="w-7 h-7" />
                        </div>
                      )}

                      <div>
                        <span className={`text-base sm:text-lg font-black tracking-tight ${
                          lastValidation.isAllowed ? 'text-emerald-800' : 'text-rose-800'
                        }`}>
                          {lastValidation.isAllowed ? '🟢 ACCESO PERMITIDO' : '🔴 ACCESO DENEGADO'}
                        </span>
                        <p className="text-xs font-medium text-slate-600">
                          Puerta: <strong>{lastValidation.area.name}</strong> · {lastValidation.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                      <img
                        src={lastValidation.member.avatar}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="font-bold text-sm text-slate-900 block truncate">
                          {lastValidation.member.name}
                        </span>
                        <span className="text-xs text-slate-600 font-mono block">
                          ID: {lastValidation.member.memberNumber} · {lastValidation.member.planName}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 p-3 rounded-xl bg-white/80 border border-slate-200 text-xs font-semibold leading-relaxed">
                      {lastValidation.reason}
                    </div>

                    {/* Emergency override or actions */}
                    {!lastValidation.isAllowed && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            // Authorize manual guest pass
                            storageService.recordVisit({
                              memberId: lastValidation.member.id,
                              memberName: lastValidation.member.name,
                              memberNumber: lastValidation.member.memberNumber,
                              memberAvatar: lastValidation.member.avatar,
                              areaId: selectedGateArea,
                              areaName: currentGate.name,
                              status: 'permitido',
                              reason: 'Autorización manual de cortesía por Recepción',
                              recordedBy: 'Recepción - Pase Manual de Cortesía',
                            });
                            if (soundEnabled) audioService.playAccessGranted();
                            setLastValidation({
                              ...lastValidation,
                              isAllowed: true,
                              reason: 'Acceso autorizado manualmente por cortesía de recepción.',
                            });
                            onDataChanged();
                          }}
                          className="w-full py-2 rounded-xl bg-[#1D3A4C] text-white text-xs font-bold hover:bg-[#152a37] transition text-center shadow-xs"
                        >
                          Autorizar Ingreso Excepcional
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-600 text-xs mt-3 flex flex-col items-center justify-center min-h-[240px]">
                    <QrCode className="w-10 h-10 text-slate-300 mb-2" />
                    <span className="font-semibold text-slate-700">Esperando lectura de código</span>
                    <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                      Al escanear el QR o buscar a un socio, aquí se proyectará instantáneamente la luz de estado y el timbre auditivo.
                    </p>
                  </div>
                )}
              </div>

              {/* Real-time Area Occupancy Widget */}
              <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5 text-[#1D3A4C]">
                    <Layers className="w-4 h-4 text-[#B4901E]" />
                    Aforo en {currentGate.name}:
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentGate.currentOccupancy} / {currentGate.maxCapacity} personas
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#1D3A4C] rounded-full transition-all"
                    style={{ width: `${Math.min((currentGate.currentOccupancy / currentGate.maxCapacity) * 100, 100)}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW: REGISTRO MANUAL DE EMERGENCIA */}
      {(currentTab === 'manual') && (
        <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B4901E]">
                Respaldo Operativo
              </span>
              <h2 className="text-lg font-black text-[#1D3A4C]">
                Registro Manual de Emergencia (Sin Celular)
              </h2>
              <p className="text-xs text-slate-500">
                Busca al socio por su nombre completo, número de membresía o teléfono para registrar su entrada directamente.
              </p>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Escribe el nombre del socio, N° de membresía o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] shadow-inner"
              />
            </div>

            {/* Member Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
              {searchQuery.trim().length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-600 bg-slate-50 rounded-2xl">
                  Escribe al menos una letra para buscar en el padrón de socios del club.
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No se encontraron socios que coincidan con "{searchQuery}".
                </div>
              ) : (
                filteredMembers.map((m) => {
                  const hasAccess = m.status === 'activa' && m.allowedAreas.includes(selectedGateArea);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                              m.status === 'activa' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {m.status.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                            ID: {m.memberNumber} · Tel: {m.phone} · Plan: {m.planName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => processCheckIn(m, 'Registro Manual')}
                          className="px-4 py-2 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Validar y Entrar a {currentGate.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW: CONTROL DE AFORO EN VIVO */}
      {currentTab === 'aforo' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Aforo de Áreas en Tiempo Real</h2>
            <p className="text-xs text-slate-500">Monitoreo de afluencia para evitar saturación de cupos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((a) => {
              const pct = Math.round((a.currentOccupancy / a.maxCapacity) * 100);
              return (
                <div key={a.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      {getAreaIcon(a.id)}
                    </div>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      {pct}% Lleno
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{a.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{a.scheduleHours}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600">Ocupantes actuales:</span>
                    <span className="font-mono font-bold text-slate-900">{a.currentOccupancy} / {a.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW: HISTORIAL DE ACCESOS HOY */}
      {(currentTab === 'historial_hoy') && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registro de Entradas del Día</h2>
              <p className="text-xs text-slate-500">Listado cronológico de accesos escaneados en recepción.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1D3A4C] bg-slate-100 px-3 py-1.5 rounded-xl">
              {visits.length} registros
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Socio</th>
                    <th className="px-4 py-3">Área</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Detalle / Motivo</th>
                    <th className="px-4 py-3">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.slice(0, 15).map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                        {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {v.memberName}
                        <span className="block text-[10px] text-slate-600 font-mono font-normal">
                          {v.memberNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {v.areaName}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'permitido' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {v.status === 'permitido' ? '🟢 Permitido' : '🔴 Denegado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                        {v.reason || 'Acceso normal'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                        {v.recordedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
