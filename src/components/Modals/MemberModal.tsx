import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { Member, AreaId, MembershipStatus } from '../../types';
import { INITIAL_PLANS } from '../../services/storageService';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<Member, 'id' | 'qrCode'> | Member) => void;
  initialMember?: Member | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
}) => {
  const [name, setName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState('plan_total');
  const [allowedAreas, setAllowedAreas] = useState<AreaId[]>(['natacion', 'yoga', 'gimnasio', 'cross']);
  const [status, setStatus] = useState<MembershipStatus>('activa');
  const [expirationDate, setExpirationDate] = useState('2026-11-20');
  const [notes, setNotes] = useState('');
  const [balanceDue, setBalanceDue] = useState(0);

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setMemberNumber(initialMember.memberNumber);
      setEmail(initialMember.email);
      setPhone(initialMember.phone);
      setPlanId(initialMember.planId);
      setAllowedAreas(initialMember.allowedAreas);
      setStatus(initialMember.status);
      setExpirationDate(initialMember.expirationDate);
      setNotes(initialMember.notes || '');
      setBalanceDue(initialMember.balanceDue || 0);
    } else {
      // New member defaults
      setName('');
      setMemberNumber(`TRB-${Math.floor(1000 + Math.random() * 9000)}`);
      setEmail('');
      setPhone('');
      setPlanId('plan_total');
      setAllowedAreas(['natacion', 'yoga', 'gimnasio', 'cross']);
      setStatus('activa');
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setExpirationDate(nextMonth.toISOString().split('T')[0]);
      setNotes('');
      setBalanceDue(0);
    }
  }, [initialMember, isOpen]);

  // When plan changes, sync default allowed areas
  const handlePlanChange = (selectedPlanId: string) => {
    setPlanId(selectedPlanId);
    const plan = INITIAL_PLANS.find(p => p.id === selectedPlanId);
    if (plan) {
      setAllowedAreas(plan.includedAreas);
    }
  };

  const toggleArea = (area: AreaId) => {
    if (allowedAreas.includes(area)) {
      setAllowedAreas(allowedAreas.filter(a => a !== area));
    } else {
      setAllowedAreas([...allowedAreas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPlan = INITIAL_PLANS.find(p => p.id === planId);
    const planName = currentPlan ? currentPlan.name : 'Personalizado';

    if (initialMember) {
      onSave({
        ...initialMember,
        name: name.trim(),
        memberNumber: memberNumber.trim(),
        email: email.trim(),
        phone: phone.trim(),
        planId,
        planName,
        allowedAreas,
        status,
        expirationDate,
        notes: notes.trim(),
        balanceDue,
      });
    } else {
      onSave({
        name: name.trim(),
        memberNumber: memberNumber.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        planId,
        planName,
        allowedAreas,
        status,
        expirationDate,
        joinedDate: new Date().toISOString().split('T')[0],
        balanceDue,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3A4C] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B4901E]/20 text-[#B4901E] flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {initialMember ? 'Editar Socio de Tribu' : 'Alta de Nuevo Socio'}
              </h3>
              <p className="text-xs text-slate-300">Asignación de plan, áreas de acceso y vigencia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Montes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Socio / ID *</label>
              <input
                type="text"
                required
                placeholder="TRB-8041"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="socio@tribuclub.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Móvil *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+52 55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plan de Membresía</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] bg-white"
                >
                  {INITIAL_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (${plan.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MembershipStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] bg-white font-medium"
              >
                <option value="activa">Activa (Vigente)</option>
                <option value="vencida">Vencida (Bloqueo)</option>
                <option value="suspendida">Suspendida</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha Vencimiento *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
                />
              </div>
            </div>
          </div>

          {/* Allowed areas checkboxes */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B4901E]" />
              Reglas de Acceso a Áreas Físicas:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'natacion', label: 'Natación (Alberca)' },
                  { id: 'yoga', label: 'Yoga & Mind' },
                  { id: 'gimnasio', label: 'Gimnasio' },
                  { id: 'cross', label: 'Cross Training' },
                ] as const
              ).map((area) => {
                const checked = allowedAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all flex items-center gap-2 ${
                      checked
                        ? 'bg-[#1D3A4C] text-white border-[#1D3A4C] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[10px] font-bold ${
                      checked ? 'bg-[#B4901E] text-white' : 'border border-slate-300'
                    }`}>
                      {checked ? '✓' : ''}
                    </span>
                    <span className="truncate">{area.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * El escáner de recepción validará si el socio tiene permiso antes de abrir el acceso.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notas u Observaciones</label>
            <textarea
              rows={2}
              placeholder="Detalles médicos, preferencias o notas del socio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1D3A4C] text-white text-xs font-semibold hover:bg-[#152a37] shadow-sm"
            >
              {initialMember ? 'Guardar Cambios' : 'Registrar Socio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
