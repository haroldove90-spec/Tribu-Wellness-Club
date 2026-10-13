import React, { useState, useMemo } from 'react';
import { Area, ClassSession, ClassReservation, Member, AreaId } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  CalendarCheck, 
  Users, 
  Layers, 
  Waves, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Check, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  UserPlus, 
  RotateCcw,
  AlertTriangle,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EntrenadorViewProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onDataChanged: () => void;
}

export const EntrenadorView: React.FC<EntrenadorViewProps> = ({
  currentTab,
  onTabChange,
  onDataChanged,
}) => {
  const classes = storageService.getClasses();
  const reservations = storageService.getReservations();
  const areas = storageService.getAreas();
  const members = storageService.getMembers();

  // State for active class session selected for Pase de Lista
  const [selectedSessionId, setSelectedSessionId] = useState<string>(classes[0]?.id || '');
  
  // Checked attendance state (record of reservationId -> boolean)
  const [checkedAttendees, setCheckedAttendees] = useState<Record<string, boolean>>({});

  // Filters for Module 1: Clases
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');
  const [classSearch, setClassSearch] = useState<string>('');

  // Walk-in attendee modal state in Pase de Lista
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);
  const [walkInMemberId, setWalkInMemberId] = useState<string>(members[0]?.id || '');

  // New Class Modal State
  const [showNewClassModal, setShowNewClassModal] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassArea, setNewClassArea] = useState<AreaId>('cross');
  const [newClassSchedule, setNewClassSchedule] = useState<string>('09:00 - 10:00');
  const [newClassInstructor, setNewClassInstructor] = useState<string>('Coach Staff');
  const [newClassCapacity, setNewClassCapacity] = useState<number>(20);
  const [newClassLevel, setNewClassLevel] = useState<string>('Todos los niveles');

  const activeSession = useMemo(() => {
    return classes.find(c => c.id === selectedSessionId) || classes[0];
  }, [classes, selectedSessionId]);

  // Booked attendees for currently selected session in Pase de Lista
  const attendees = useMemo(() => {
    if (!activeSession) return [];
    return reservations.filter(
      r => r.sessionId === activeSession.id && r.status === 'confirmada'
    );
  }, [reservations, activeSession]);

  const toggleAttendee = (resId: string) => {
    const isNowChecked = !checkedAttendees[resId];
    setCheckedAttendees(prev => ({ ...prev, [resId]: isNowChecked }));
    if (isNowChecked) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#1D3A4C', '#B4901E', '#10B981'],
      });
    }
  };

  const handleMarkAllPresent = () => {
    const allChecked: Record<string, boolean> = {};
    attendees.forEach(a => {
      allChecked[a.id] = true;
    });
    setCheckedAttendees(prev => ({ ...prev, ...allChecked }));
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#B4901E'],
    });
  };

  const handleResetAttendance = () => {
    const cleared: Record<string, boolean> = {};
    attendees.forEach(a => {
      cleared[a.id] = false;
    });
    setCheckedAttendees(prev => ({ ...prev, ...cleared }));
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === walkInMemberId);
    if (!mem || !activeSession) return;

    // Create reservation record
    const newRes = storageService.createReservation({
      sessionId: activeSession.id,
      memberId: mem.id,
      memberName: mem.name,
      areaId: activeSession.areaId,
      className: activeSession.className,
      instructor: activeSession.instructor,
      schedule: activeSession.schedule,
      date: activeSession.date,
    });

    // Mark as checked immediately
    setCheckedAttendees(prev => ({ ...prev, [newRes.id]: true }));
    setShowWalkInModal(false);
    onDataChanged();
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const currentClasses = storageService.getClasses();
    const newClass: ClassSession = {
      id: `cls_${Date.now()}`,
      areaId: newClassArea,
      className: newClassName.trim(),
      instructor: newClassInstructor.trim(),
      schedule: newClassSchedule.trim(),
      date: new Date().toISOString().split('T')[0],
      maxCapacity: newClassCapacity,
      reservedCount: 0,
      level: newClassLevel,
    };

    const updated = [...currentClasses, newClass];
    if (typeof window !== 'undefined') {
      localStorage.setItem('tribu_classes_data', JSON.stringify(updated));
    }
    setShowNewClassModal(false);
    setNewClassName('');
    onDataChanged();
  };

  // Adjust area occupancy on the floor (+1 / -1)
  const handleAdjustOccupancy = (areaId: AreaId, delta: number) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;
    const newOccupancy = Math.max(0, Math.min(area.maxCapacity, area.currentOccupancy + delta));
    storageService.updateArea(areaId, { currentOccupancy: newOccupancy });
    onDataChanged();
  };

  const getAreaIcon = (id: string) => {
    switch (id) {
      case 'natacion': return <Waves className="w-5 h-5 text-sky-500" />;
      case 'yoga': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'gimnasio': return <Dumbbell className="w-5 h-5 text-emerald-600" />;
      case 'cross': return <Flame className="w-5 h-5 text-rose-500" />;
      default: return <Dumbbell className="w-5 h-5" />;
    }
  };

  // Filtered classes for Module 1
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchDiscipline = disciplineFilter === 'all' || c.areaId === disciplineFilter;
      const matchSearch = c.className.toLowerCase().includes(classSearch.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(classSearch.toLowerCase());
      return matchDiscipline && matchSearch;
    });
  }, [classes, disciplineFilter, classSearch]);

  return (
    <div className="space-y-6 pb-24 lg:pb-8 animate-in fade-in">
      
      {/* Institutional Top Header */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B4901E] uppercase tracking-wider">
            Staff Deportivo & Entrenadores
          </span>
          <h1 className="text-lg sm:text-2xl font-black text-[#1D3A4C]">
            Centro de Control de Clases y Disciplinas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Módulos activos: Programación de Clases, Pase de Lista y Aforo de Salas en Tiempo Real.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => onTabChange('clases')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'clases'
                ? 'bg-[#1D3A4C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Clases y Reservas</span>
          </button>

          <button
            onClick={() => onTabChange('asistencia')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'asistencia'
                ? 'bg-[#1D3A4C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Pase de Lista</span>
          </button>

          <button
            onClick={() => onTabChange('aforo')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'aforo'
                ? 'bg-[#1D3A4C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Aforo por Disciplina</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MÓDULO 1: CLASES Y RESERVAS (currentTab === 'clases')     */}
      {/* ========================================================= */}
      {(currentTab === 'clases' || (!['asistencia', 'aforo'].includes(currentTab))) && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Controls: Search, Filter & Add Class Button */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar clase o instructor..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
                />
              </div>

              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
              >
                <option value="all">Todas las Disciplinas</option>
                <option value="natacion">Natación (Alberca)</option>
                <option value="yoga">Yoga & Mind</option>
                <option value="gimnasio">Gimnasio</option>
                <option value="cross">Cross Training</option>
              </select>
            </div>

            <button
              onClick={() => setShowNewClassModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition shadow-xs self-start md:self-auto"
            >
              <Plus className="w-4 h-4 text-[#B4901E]" />
              <span>Programar Nueva Clase</span>
            </button>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((cls) => {
              const classAttendees = reservations.filter(
                r => r.sessionId === cls.id && r.status === 'confirmada'
              );
              const spotsLeft = cls.maxCapacity - classAttendees.length;
              const fillPercentage = Math.round((classAttendees.length / cls.maxCapacity) * 100);

              return (
                <div
                  key={cls.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          {getAreaIcon(cls.areaId)}
                        </div>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {cls.areaId}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-[#1D3A4C]/10 text-[#1D3A4C] px-2.5 py-0.5 rounded-lg">
                        {cls.schedule}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cls.className}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Instructor: <strong className="text-slate-800">{cls.instructor}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Nivel: {cls.level} · Fecha: {cls.date}
                    </p>

                    {/* Progress Bar & Capacity */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Inscritos:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {classAttendees.length} / {cls.maxCapacity} ({fillPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            fillPercentage > 85 ? 'bg-rose-500' : fillPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Attendees Avatars Preview */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {spotsLeft > 0 ? `${spotsLeft} lugares disponibles` : 'Cupo lleno'}
                      </span>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {classAttendees.slice(0, 4).map((att) => (
                          <div
                            key={att.id}
                            className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-700"
                            title={att.memberName}
                          >
                            {att.memberName.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const newCap = prompt(`Ajustar cupo para "${cls.className}":`, cls.maxCapacity.toString());
                        if (newCap && !isNaN(Number(newCap))) {
                          const allCls = storageService.getClasses();
                          const updated = allCls.map(c => c.id === cls.id ? { ...c, maxCapacity: Number(newCap) } : c);
                          localStorage.setItem('tribu_classes_data', JSON.stringify(updated));
                          onDataChanged();
                        }
                      }}
                      className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold hover:underline"
                    >
                      Ajustar Cupo
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSessionId(cls.id);
                        onTabChange('asistencia');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Pase de Lista</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B4901E]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MÓDULO 2: PASE DE LISTA OFICIAL (currentTab === 'asistencia') */}
      {/* ========================================================= */}
      {currentTab === 'asistencia' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Class Session Selector Strip */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              1. Selecciona la Clase a Evaluar Asistencia:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {classes.map((cls) => {
                const isSelected = cls.id === selectedSessionId;
                const count = reservations.filter(r => r.sessionId === cls.id && r.status === 'confirmada').length;
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedSessionId(cls.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1D3A4C] text-white border-[#1D3A4C] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase truncate">
                        {cls.areaId}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 rounded-sm ${
                        isSelected ? 'bg-[#B4901E] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}/{cls.maxCapacity}
                      </span>
                    </div>
                    <span className="text-xs font-bold truncate block">{cls.className}</span>
                    <span className={`text-[10px] block font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {cls.schedule}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Roster Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1D3A4C]/10 text-[#1D3A4C] flex items-center justify-center font-bold">
                  {getAreaIcon(activeSession?.areaId || 'gimnasio')}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4901E]">
                    Pase de Lista Oficial
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    {activeSession?.className}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instructor: <strong className="text-slate-700">{activeSession?.instructor}</strong> · Horario: {activeSession?.schedule}
                  </p>
                </div>
              </div>

              {/* Roster Controls & Stats */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  disabled={attendees.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Marcar Todos Presentes</span>
                </button>

                <button
                  onClick={handleResetAttendance}
                  disabled={attendees.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 disabled:opacity-50"
                  title="Reiniciar lista"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>

                <button
                  onClick={() => setShowWalkInModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#B4901E] hover:bg-[#967615] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Agregar Alumno en Sala</span>
                </button>
              </div>
            </div>

            {/* Attendance Counter strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Presentes en Sala</span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {attendees.filter(a => checkedAttendees[a.id]).length}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-500 text-[11px] block">Pendientes / Ausentes</span>
                <span className="text-xl font-black text-slate-700 font-mono">
                  {attendees.filter(a => !checkedAttendees[a.id]).length}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Total Inscritos</span>
                <span className="text-xl font-black text-[#1D3A4C] font-mono">
                  {attendees.length} / {activeSession?.maxCapacity}
                </span>
              </div>
            </div>

            {/* Attendees list */}
            {attendees.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p>No hay socios inscritos previamente a esta sesión.</p>
                <button
                  onClick={() => setShowWalkInModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#1D3A4C] text-white font-bold text-xs hover:bg-[#152a37]"
                >
                  Agregar a un socio que está en la sala →
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {attendees.map((att) => {
                  const isChecked = checkedAttendees[att.id] || false;
                  return (
                    <div
                      key={att.id}
                      onClick={() => toggleAttendee(att.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                          isChecked ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {isChecked ? '✓' : '—'}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block leading-tight">
                            {att.memberName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Reservó: {new Date(att.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Disciplina: {att.areaId.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                        isChecked
                          ? 'bg-emerald-200 text-emerald-900 font-black'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isChecked ? '🟢 ASISTIÓ' : '⚪ PENDIENTE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MÓDULO 3: AFORO POR DISCIPLINA (currentTab === 'aforo')   */}
      {/* ========================================================= */}
      {currentTab === 'aforo' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">
              Control de Aforo y Ocupación por Disciplina
            </h2>
            <p className="text-xs text-slate-500">
              Monitorea el cupo en sala y ajusta el conteo de alumnos para Natación, Yoga, Gimnasio y Cross Training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map((area) => {
              const pct = Math.round((area.currentOccupancy / area.maxCapacity) * 100);
              const isHigh = pct >= 85;
              const isMedium = pct >= 60 && pct < 85;

              return (
                <div
                  key={area.id}
                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {getAreaIcon(area.id)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{area.name}</h3>
                        <span className="text-xs text-[#B4901E] font-semibold">{area.discipline}</span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {isHigh ? '🔴 Aforo Límite' : isMedium ? '🟡 Moderado' : '🟢 Aforo Óptimo'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Big Occupancy Gauge */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Ocupantes actuales en sala:</span>
                      <span className="font-mono font-bold text-base text-[#1D3A4C]">
                        {area.currentOccupancy} / {area.maxCapacity} ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Real-time Physical Counter Buttons for Coaches */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      Ajuste rápido en puerta:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjustOccupancy(area.id, -1)}
                        disabled={area.currentOccupancy <= 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition disabled:opacity-40"
                        title="Restar 1 socio que salió de sala"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>-1 Salió</span>
                      </button>

                      <button
                        onClick={() => handleAdjustOccupancy(area.id, 1)}
                        disabled={area.currentOccupancy >= area.maxCapacity}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition disabled:opacity-40 shadow-xs"
                        title="Sumar 1 socio que entró a sala"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#B4901E]" />
                        <span>+1 Entró</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Horario: {area.scheduleHours}</span>
                    <span>Staff: {area.instructors[0] || 'Coach'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR ALUMNO EN SALA SIN RESERVA              */}
      {/* ========================================================= */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#1D3A4C] text-white">
              <h3 className="text-sm font-semibold">Agregar Alumno en Sala (Pase Rápido)</h3>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Selecciona al socio que asistió directamente a la clase <strong className="text-slate-900">{activeSession?.className}</strong>:
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Socio de Tribu</label>
                <select
                  value={walkInMemberId}
                  onChange={(e) => setWalkInMemberId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberNumber}) - {m.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1D3A4C] text-white font-bold hover:bg-[#152a37]"
                >
                  Confirmar y Marcar Presente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PROGRAMAR NUEVA CLASE                             */}
      {/* ========================================================= */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1D3A4C] text-white">
              <h3 className="text-sm font-semibold">Programar Nueva Clase o Sesión</h3>
              <button
                onClick={() => setShowNewClassModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewClass} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre de la Clase *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cross WOD Avanzado / Yoga Restaurativo"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disciplina / Área</label>
                  <select
                    value={newClassArea}
                    onChange={(e) => setNewClassArea(e.target.value as AreaId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="natacion">Natación (Alberca)</option>
                    <option value="yoga">Yoga & Mind</option>
                    <option value="gimnasio">Gimnasio</option>
                    <option value="cross">Cross Training</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:00"
                    value={newClassSchedule}
                    onChange={(e) => setNewClassSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructor Asignado</label>
                  <input
                    type="text"
                    required
                    placeholder="Coach Nombre"
                    value={newClassInstructor}
                    onChange={(e) => setNewClassInstructor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cupo Máximo</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newClassCapacity}
                    onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nivel Recomendado</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Todos los niveles">Todos los niveles</option>
                  <option value="Principiantes">Principiantes</option>
                  <option value="Intermedios">Intermedios</option>
                  <option value="Avanzados">Avanzados</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewClassModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1D3A4C] text-white font-bold hover:bg-[#152a37]"
                >
                  Guardar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
