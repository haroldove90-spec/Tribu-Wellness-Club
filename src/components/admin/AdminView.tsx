import React, { useState, useMemo } from 'react';
import { 
  Member, 
  Area, 
  VisitRecord, 
  MembershipPlan, 
  PaymentRecord, 
  AreaId, 
  MembershipStatus 
} from '../../types';
import { storageService, INITIAL_PLANS } from '../../services/storageService';
import { MemberModal } from '../Modals/MemberModal';
import { 
  Users, 
  Layers, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  UserPlus, 
  Download, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Waves, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Check, 
  X, 
  Calendar,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface AdminViewProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onDataChanged: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentTab,
  onTabChange,
  onDataChanged,
}) => {
  const members = storageService.getMembers();
  const areas = storageService.getAreas();
  const visits = storageService.getVisits();
  const payments = storageService.getPayments();
  const plans = storageService.getPlans();

  // Member CRUD modal state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Search & Filters for Socios CRUD
  const [memberSearch, setMemberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MembershipStatus>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Search & Filters for Visits
  const [visitSearch, setVisitSearch] = useState('');
  const [visitAreaFilter, setVisitAreaFilter] = useState<string>('all');
  const [visitStatusFilter, setVisitStatusFilter] = useState<string>('all');

  // New Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMemberId, setPaymentMemberId] = useState(members[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState(1850);
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito' | 'Transferencia SPEI' | 'Efectivo'>('Tarjeta de Crédito');

  // Area edit modal state
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  const getAreaIcon = (id: AreaId) => {
    switch (id) {
      case 'natacion': return <Waves className="w-4 h-4 text-sky-500" />;
      case 'yoga': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'gimnasio': return <Dumbbell className="w-4 h-4 text-emerald-600" />;
      case 'cross': return <Flame className="w-4 h-4 text-rose-500" />;
    }
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = 
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.memberNumber.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(memberSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchPlan = planFilter === 'all' || m.planId === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [members, memberSearch, statusFilter, planFilter]);

  // Filtered visits list
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchSearch = 
        v.memberName.toLowerCase().includes(visitSearch.toLowerCase()) ||
        v.memberNumber.toLowerCase().includes(visitSearch.toLowerCase());
      const matchArea = visitAreaFilter === 'all' || v.areaId === visitAreaFilter;
      const matchStatus = visitStatusFilter === 'all' || v.status === visitStatusFilter;
      return matchSearch && matchArea && matchStatus;
    });
  }, [visits, visitSearch, visitAreaFilter, visitStatusFilter]);

  // Analytics Metrics Calculations
  const activeMembersCount = members.filter(m => m.status === 'activa').length;
  const expiredMembersCount = members.filter(m => m.status === 'vencida').length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalVisitsCount = visits.length;

  // Breakdown of visits by area
  const visitsByArea = useMemo(() => {
    const counts: Record<AreaId, number> = { natacion: 0, yoga: 0, gimnasio: 0, cross: 0 };
    visits.forEach((v) => {
      if (counts[v.areaId] !== undefined) counts[v.areaId]++;
    });
    return counts;
  }, [visits]);

  // Peak Hours distribution mockup based on recorded visits
  const peakHours = [
    { hour: '06:00', count: 14 },
    { hour: '07:00', count: 38 },
    { hour: '08:00', count: 26 },
    { hour: '12:00', count: 18 },
    { hour: '17:00', count: 29 },
    { hour: '18:30', count: 48 }, // Peak
    { hour: '20:00', count: 32 },
  ];

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['ID Visita', 'Fecha', 'Hora', 'Socio', 'Numero Socio', 'Area', 'Estado', 'Motivo', 'Registrado Por'];
    const rows = filteredVisits.map(v => [
      v.id,
      new Date(v.timestamp).toLocaleDateString(),
      new Date(v.timestamp).toLocaleTimeString(),
      `"${v.memberName}"`,
      v.memberNumber,
      `"${v.areaName}"`,
      v.status,
      `"${v.reason || ''}"`,
      `"${v.recordedBy}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_accesos_tribu_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save new or edited member
  const handleSaveMember = (data: Omit<Member, 'id' | 'qrCode'> | Member) => {
    if ('id' in data) {
      storageService.updateMember(data.id, data);
    } else {
      storageService.addMember(data);
    }
    onDataChanged();
  };

  // Delete member
  const handleDeleteMember = (id: string) => {
    if (confirm('¿Estás seguro de que deseas dar de baja definitiva a este socio?')) {
      storageService.deleteMember(id);
      onDataChanged();
    }
  };

  // Toggle member status (e.g. Activa <-> Suspendida)
  const handleToggleMemberStatus = (m: Member) => {
    const newStatus: MembershipStatus = m.status === 'activa' ? 'suspendida' : 'activa';
    storageService.updateMember(m.id, { status: newStatus });
    onDataChanged();
  };

  // Register payment
  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === paymentMemberId);
    if (!member) return;

    storageService.addPayment({
      memberId: member.id,
      memberName: member.name,
      planName: member.planName,
      amount: paymentAmount,
      currency: 'MXN',
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: 'completado',
    });

    // Also update member expiration by +1 month and status to activa
    const expDate = new Date(member.expirationDate);
    expDate.setMonth(expDate.getMonth() + 1);
    storageService.updateMember(member.id, {
      status: 'activa',
      expirationDate: expDate.toISOString().split('T')[0],
      balanceDue: 0,
    });

    setShowPaymentModal(false);
    onDataChanged();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 animate-in fade-in">

      {/* Admin Executive Header */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B4901E] uppercase tracking-wider">
            Panel de Control Gerencial
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#1D3A4C]">
            Roberto Montes · CEO Tribu Wellness Club
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión integral de socios, aforos, estados de membresía y reportes financieros.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-[#B4901E]" />
            <span>Dar de Alta Socio</span>
          </button>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#B4901E] hover:bg-[#967615] text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>Registrar Pago</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: MÉTRICAS Y ANALÍTICAS */}
      {(currentTab === 'analytics' || !['socios', 'areas', 'visitas_global', 'pagos'].includes(currentTab)) && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-wider block">
                Socios Activos
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#1D3A4C] font-mono tabular-nums">
                  {activeMembersCount}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  {members.length > 0 ? Math.round((activeMembersCount / members.length) * 100) : 0}% al día
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {expiredMembersCount} con membresía vencida
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-wider block">
                Afluencia Registrada
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#1D3A4C] font-mono tabular-nums">
                  {totalVisitsCount}
                </span>
                <span className="text-xs font-semibold text-[#B4901E]">Check-ins</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Accesos procesados por QR y manual
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-wider block">
                Área Más Concurrida
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 truncate">
                  Gimnasio & Pesas
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                48% de la afluencia total del club
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-wider block">
                Ingresos Mensuales
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#B4901E] font-mono tabular-nums">
                  ${totalRevenue.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500">MXN</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {payments.length} mensualidades cobradas
              </p>
            </div>
          </div>

          {/* Charts Row: Afluencia por Área + Horas Pico */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Afluencia por Disciplina */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Distribución de Afluencia por Área</h3>
                  <p className="text-xs text-slate-500">Volumen de socios por disciplina deportiva</p>
                </div>
                <Layers className="w-4 h-4 text-[#B4901E]" />
              </div>

              <div className="space-y-3 pt-2">
                {areas.map((area) => {
                  const areaCount = visitsByArea[area.id] || 0;
                  const pct = totalVisitsCount > 0 ? Math.round((areaCount / totalVisitsCount) * 100) : 25;
                  return (
                    <div key={area.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2 text-slate-800">
                          {getAreaIcon(area.id)}
                          <span>{area.name}</span>
                        </span>
                        <span className="font-mono text-slate-600">{areaCount} visitas ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-[#1D3A4C] rounded-full"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Horas Pico del Club */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Horas Pico de Asistencia</h3>
                  <p className="text-xs text-slate-500">Flujo de socios a lo largo del día</p>
                </div>
                <Clock className="w-4 h-4 text-[#1D3A4C]" />
              </div>

              <div className="flex items-end justify-between gap-2 pt-6 h-48 border-b border-slate-200 pb-2">
                {peakHours.map((ph, idx) => {
                  const heightPct = (ph.count / 48) * 100;
                  const isTop = ph.count === 48;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {ph.count}
                      </span>
                      <div
                        className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                          isTop ? 'bg-[#B4901E]' : 'bg-[#1D3A4C]/80 hover:bg-[#1D3A4C]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 mt-1 whitespace-nowrap">
                        {ph.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                * Pico máximo registrado a las <strong className="text-slate-800">18:30 hrs</strong> (Salida de oficinas y horario vespertino de alberca/cross).
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 2: GESTIÓN DE SOCIOS (CRUD) */}
      {currentTab === 'socios' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Padrón de Socios (CRUD)</h2>
              <p className="text-xs text-slate-500">Administra altas, bajas, asignación de paquetes y estados.</p>
            </div>

            <button
              onClick={() => {
                setEditingMember(null);
                setIsMemberModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-[#B4901E]" />
              <span>Nuevo Socio</span>
            </button>
          </div>

          {/* Search and filters toolbar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, ID o email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | MembershipStatus)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Todos los Estados</option>
              <option value="activa">Solo Activas</option>
              <option value="vencida">Solo Vencidas</option>
              <option value="suspendida">Solo Suspendidas</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Todos los Planes</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No se encontraron socios con los filtros seleccionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Socio</th>
                      <th className="px-4 py-3.5">Membresía / Plan</th>
                      <th className="px-4 py-3.5">Áreas Autorizadas</th>
                      <th className="px-4 py-3.5">Estado</th>
                      <th className="px-4 py-3.5">Vencimiento</th>
                      <th className="px-4 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.avatar}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{m.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {m.memberNumber} · {m.phone}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">{m.planName}</span>
                          <span className="text-[10px] text-slate-600">{m.email}</span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {m.allowedAreas.map((aid) => (
                              <span
                                key={aid}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase"
                              >
                                {aid}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleMemberStatus(m)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                              m.status === 'activa'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : m.status === 'vencida'
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Haz clic para cambiar estado"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {m.status.toUpperCase()}
                          </button>
                        </td>

                        <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                          {m.expirationDate}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setIsMemberModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-[#1D3A4C] hover:bg-slate-100 transition"
                              title="Editar socio"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Dar de baja socio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* SUB-VIEW 3: CONFIGURACIÓN DE ÁREAS Y DISCIPLINAS */}
      {currentTab === 'areas' && (
        <div className="space-y-5 animate-in fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">
              Configuración de Zonas del Club
            </h2>
            <p className="text-xs text-slate-500">
              Administra los cupos máximos, horarios y reglas de entrada para las 4 áreas (Natación, Yoga, Gimnasio, Cross).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map((area) => (
              <div
                key={area.id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4"
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
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                    Cupo: {area.maxCapacity} pers.
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {area.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Horario</span>
                    <span className="font-semibold text-slate-800">{area.scheduleHours}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Ocupación Actual</span>
                    <span className="font-semibold text-slate-800 font-mono">{area.currentOccupancy} socios en sala</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Instructores / Responsables:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {area.instructors.map((inst, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#1D3A4C]/10 text-[#1D3A4C] font-medium">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Regla: Requiere autorización en Membresía</span>
                  <button
                    onClick={() => {
                      const newCap = prompt(`Ajustar cupo máximo para ${area.name}:`, area.maxCapacity.toString());
                      if (newCap && !isNaN(Number(newCap))) {
                        storageService.updateArea(area.id, { maxCapacity: Number(newCap) });
                        onDataChanged();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Modificar Cupo
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-VIEW 4: HISTORIAL GLOBAL DE VISITAS & REPORTES */}
      {currentTab === 'visitas_global' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Historial Global de Visitas y Accesos</h2>
              <p className="text-xs text-slate-500">Bitácora completa con exportación para auditoría y control de afluencia.</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D3A4C] hover:bg-[#152a37] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#B4901E]" />
              <span>Exportar Reporte a CSV</span>
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar por nombre de socio o ID..."
                value={visitSearch}
                onChange={(e) => setVisitSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C]"
              />
            </div>

            <select
              value={visitAreaFilter}
              onChange={(e) => setVisitAreaFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Todas las Áreas</option>
              <option value="natacion">Natación</option>
              <option value="yoga">Yoga & Mind</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="cross">Cross Training</option>
            </select>

            <select
              value={visitStatusFilter}
              onChange={(e) => setVisitStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Todos los Resultados</option>
              <option value="permitido">🟢 Permitidos</option>
              <option value="denegado">🔴 Denegados</option>
            </select>
          </div>

          {/* Visits Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">Fecha y Hora</th>
                    <th className="px-4 py-3.5">Socio</th>
                    <th className="px-4 py-3.5">Área / Zona</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5">Motivo / Validación</th>
                    <th className="px-4 py-3.5">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                        {new Date(v.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {v.memberName}
                        <span className="block text-[10px] text-slate-500 font-mono font-normal">
                          {v.memberNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {v.areaName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'permitido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === 'permitido' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`} />
                          {v.status === 'permitido' ? 'Permitido' : 'Denegado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-sm truncate">
                        {v.reason || 'Regla de acceso cumplida'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
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

      {/* SUB-VIEW 5: MEMBRESÍAS Y CONTROL DE PAGOS */}
      {currentTab === 'pagos' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Control de Membresías y Pagos</h2>
              <p className="text-xs text-slate-500">Registro de cobranza, renovaciones de socios y recibos.</p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B4901E] hover:bg-[#967615] text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Pago Manual</span>
            </button>
          </div>

          {/* Membership Packages Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Paquete Tribu
                    </span>
                    {p.isPopular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B4901E]/15 text-[#B4901E]">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                  <div className="mt-2 text-2xl font-black text-[#1D3A4C] font-mono">
                    ${p.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN/mes</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Historial de Cobros y Renovaciones</span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                Total recaudado: ${totalRevenue.toLocaleString()} MXN
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Folio Recibo</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Socio</th>
                    <th className="px-4 py-3">Plan Renovado</th>
                    <th className="px-4 py-3">Método de Pago</th>
                    <th className="px-4 py-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono font-semibold text-[#1D3A4C]">
                        {pay.receiptNumber}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {pay.date}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {pay.memberName}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {pay.planName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {pay.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        ${pay.amount.toLocaleString()} {pay.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Member CRUD Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        initialMember={editingMember}
      />

      {/* Payment Manual Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#1D3A4C] text-white">
              <h3 className="text-sm font-semibold">Registrar Cobro de Membresía</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seleccionar Socio</label>
                <select
                  value={paymentMemberId}
                  onChange={(e) => {
                    setPaymentMemberId(e.target.value);
                    const mem = members.find(m => m.id === e.target.value);
                    if (mem) {
                      const pl = plans.find(p => p.id === mem.planId);
                      if (pl) setPaymentAmount(pl.price);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberNumber}) - {m.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto a Cobrar ($ MXN)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito</option>
                  <option value="Transferencia SPEI">Transferencia Bancaria SPEI</option>
                  <option value="Efectivo">Efectivo en Caja</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1D3A4C] text-white font-bold hover:bg-[#152a37]"
                >
                  Confirmar Cobro y Renovar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
