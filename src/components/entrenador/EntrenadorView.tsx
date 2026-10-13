import React, { useState } from 'react';
import { Area, ClassSession, ClassReservation } from '../../types';
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
  UserCheck
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

  const [selectedSessionId, setSelectedSessionId] = useState<string>(classes[0]?.id || '');
  const [checkedAttendees, setCheckedAttendees] = useState<Record<string, boolean>>({});

  const activeSession = classes.find(c => c.id === selectedSessionId) || classes[0];

  // Booked attendees for this session
  const attendees = reservations.filter(
    r => r.sessionId === activeSession?.id && r.status === 'confirmada'
  );

  const toggleAttendee = (resId: string) => {
    const isNowChecked = !checkedAttendees[resId];
    setCheckedAttendees({ ...checkedAttendees, [resId]: isNowChecked });
    if (isNowChecked) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    }
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

  return (
    <div className="space-y-6 pb-20 lg:pb-8 animate-in fade-in">
      
      {/* Coach Header */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B4901E] uppercase tracking-wider">
            Staff Deportivo & Entrenadores
          </span>
          <h1 className="text-xl font-black text-[#1D3A4C]">
            Gestión de Clases, Disciplinas y Pase de Lista
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta cupos reservados y valida la asistencia en sala de Natación, Yoga y Cross.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-[#1D3A4C]" />
          <span>Turno en Curso: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scheduled Classes list (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Sesiones Programadas
          </h2>

          <div className="space-y-2.5">
            {classes.map((cls) => {
              const isSelected = cls.id === selectedSessionId;
              const count = reservations.filter(r => r.sessionId === cls.id && r.status === 'confirmada').length;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedSessionId(cls.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1D3A4C] text-white border-[#1D3A4C] shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'
                    }`}>
                      {getAreaIcon(cls.areaId)}
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight">{cls.className}</span>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {cls.schedule} · {cls.instructor}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    isSelected ? 'bg-[#B4901E] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count} / {cls.maxCapacity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Attendance roster (Pase de Lista) (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#B4901E] uppercase tracking-wider">
                  Pase de Lista Oficial
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeSession?.className}
                </h3>
                <p className="text-xs text-slate-500">
                  Horario: {activeSession?.schedule} · Disciplina: {activeSession?.areaId.toUpperCase()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#1D3A4C] block">
                  {attendees.filter(a => checkedAttendees[a.id]).length} de {attendees.length} Presentes
                </span>
                <span className="text-[11px] text-slate-400">En lista de espera: 0</span>
              </div>
            </div>

            {attendees.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No hay socios inscritos previamente a esta sesión.
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
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isChecked ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-400'
                        }`}>
                          {isChecked ? '✓' : '—'}
                        </div>
                        <div>
                          <span className="font-bold text-xs block">{att.memberName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Reservó: {new Date(att.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        isChecked ? 'bg-emerald-200/80 text-emerald-900' : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        {isChecked ? 'Asistió' : 'Pendiente'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
