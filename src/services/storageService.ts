import { Area, Member, VisitRecord, ClassSession, ClassReservation, MembershipPlan, PaymentRecord, NotificationItem, SupabaseConfig, AreaId } from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'tribu_members_data',
  AREAS: 'tribu_areas_data',
  VISITS: 'tribu_visits_data',
  CLASSES: 'tribu_classes_data',
  RESERVATIONS: 'tribu_reservations_data',
  PLANS: 'tribu_plans_data',
  PAYMENTS: 'tribu_payments_data',
  NOTIFICATIONS: 'tribu_notifications_data',
  DEMO_CLEARED: 'tribu_demo_data_cleared',
  SUPABASE_CONFIG: 'tribu_supabase_config',
  ACTIVE_MEMBER_ID: 'tribu_active_member_id',
};

export const INITIAL_AREAS: Area[] = [
  {
    id: 'natacion',
    name: 'Natación',
    discipline: 'Acuática y Nado Libre',
    description: 'Alberca semiolímpica de 25 metros climatizada a 28°C con carriles para nado libre y aqua-fitness.',
    icon: 'Waves',
    maxCapacity: 30,
    currentOccupancy: 12,
    scheduleHours: '06:00 - 22:00',
    instructors: ['Prof. Leonardo Silva', 'Entr. Andrea Cruz'],
  },
  {
    id: 'yoga',
    name: 'Yoga & Mind',
    discipline: 'Flexibilidad y Bienestar',
    description: 'Estudio de duela acústica para Hatha Yoga, Vinyasa Flow, Pilates reformer y meditación guiada.',
    icon: 'Sparkles',
    maxCapacity: 25,
    currentOccupancy: 9,
    scheduleHours: '07:00 - 20:30',
    instructors: ['Mtra. Sofía Villaseñor', 'Yogui Daniel Méndez'],
  },
  {
    id: 'gimnasio',
    name: 'Gimnasio',
    discipline: 'Pesas, Fuerza y Cardio',
    description: 'Piso de entrenamiento integral con máquinas selectorizadas Hammer Strength, mancuernas y zona cardiovascular.',
    icon: 'Dumbbell',
    maxCapacity: 80,
    currentOccupancy: 48,
    scheduleHours: '05:30 - 23:00',
    instructors: ['Coach Rodrigo Macías', 'Coach Karen Orozco'],
  },
  {
    id: 'cross',
    name: 'Cross Training',
    discipline: 'Acondicionamiento Funcional',
    description: 'Box equipado con rigs olímpicos, remadoras Concept2, kettlebells y circuito de alta intensidad (WOD).',
    icon: 'Flame',
    maxCapacity: 35,
    currentOccupancy: 22,
    scheduleHours: '06:30 - 21:30',
    instructors: ['Coach Héctor Bravo', 'Coach Marcela Ríos'],
  },
];

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan_total',
    name: 'Plan Total Wellness',
    price: 1850,
    currency: 'MXN',
    period: 'mensual',
    includedAreas: ['natacion', 'yoga', 'gimnasio', 'cross'],
    features: ['Acceso ilimitado a todas las 4 áreas', 'Alberca semiolímpica incluida', 'Reserva prioritaria de clases', 'Acceso a vestidores VIP y sauna'],
    isPopular: true,
  },
  {
    id: 'plan_fitness',
    name: 'Plan Fitness Básico',
    price: 950,
    currency: 'MXN',
    period: 'mensual',
    includedAreas: ['gimnasio'],
    features: ['Acceso ilimitado al Gimnasio (pesas y cardio)', 'Horario completo de lunes a domingo', 'Evaluación física mensual', 'No incluye alberca ni clases especiales'],
  },
  {
    id: 'plan_aquatics',
    name: 'Plan Aquatics & Fitness',
    price: 1450,
    currency: 'MXN',
    period: 'mensual',
    includedAreas: ['natacion', 'gimnasio'],
    features: ['Acceso a Alberca semiolímpica', 'Acceso completo a Gimnasio', 'Casillero asignado en vestidor húmedo', 'No incluye Yoga ni Cross'],
  },
  {
    id: 'plan_cross_mind',
    name: 'Plan Functional & Mind',
    price: 1400,
    currency: 'MXN',
    period: 'mensual',
    includedAreas: ['cross', 'yoga', 'gimnasio'],
    features: ['Box de Cross Training', 'Salón de Yoga y Pilates', 'Piso de pesas y cardio', 'No incluye Natación'],
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_001',
    memberNumber: 'TRB-8041',
    name: 'Roberto Montes',
    email: 'roberto.montes@tribuclub.mx',
    phone: '+52 55 4912 3088',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_total',
    planName: 'Plan Total Wellness',
    allowedAreas: ['natacion', 'yoga', 'gimnasio', 'cross'],
    status: 'activa',
    expirationDate: '2026-11-20',
    joinedDate: '2025-01-15',
    qrCode: 'TRB-8041-ROBERTO-TOTAL-ACTIVE',
    balanceDue: 0,
    notes: 'Socio Fundador / CEO. Acceso total irrestricto.',
  },
  {
    id: 'mem_002',
    memberNumber: 'TRB-4120',
    name: 'Mariana Gómez',
    email: 'mariana.gomez@gmail.com',
    phone: '+52 55 8190 4421',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_fitness',
    planName: 'Plan Fitness Básico',
    allowedAreas: ['gimnasio'],
    status: 'activa',
    expirationDate: '2026-11-05',
    joinedDate: '2025-06-10',
    qrCode: 'TRB-4120-MARIANA-FITNESS-ACTIVE',
    balanceDue: 0,
    notes: 'Solo incluye Gimnasio. Si intenta ingresar a Natación o Yoga, el sistema denegará acceso.',
  },
  {
    id: 'mem_003',
    memberNumber: 'TRB-5532',
    name: 'Carlos Ruiz Sandoval',
    email: 'carlos.ruiz@hotmail.com',
    phone: '+52 55 3301 7712',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_aquatics',
    planName: 'Plan Aquatics & Fitness',
    allowedAreas: ['natacion', 'gimnasio'],
    status: 'activa',
    expirationDate: '2026-10-28',
    joinedDate: '2025-03-22',
    qrCode: 'TRB-5532-CARLOS-AQUA-ACTIVE',
    balanceDue: 0,
    notes: 'Tiene autorizado Natación y Gimnasio.',
  },
  {
    id: 'mem_004',
    memberNumber: 'TRB-2198',
    name: 'Esteban Morales Peña',
    email: 'esteban.morales@corporativo.com',
    phone: '+52 55 6172 9033',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_total',
    planName: 'Plan Total Wellness',
    allowedAreas: ['natacion', 'yoga', 'gimnasio', 'cross'],
    status: 'vencida',
    expirationDate: '2026-10-02',
    joinedDate: '2024-11-01',
    qrCode: 'TRB-2198-ESTEBAN-EXPIRED',
    balanceDue: 1850,
    notes: 'Membresía vencida el 2 de octubre. Servirá para probar la alerta roja de acceso denegado en recepción.',
  },
  {
    id: 'mem_005',
    memberNumber: 'TRB-6874',
    name: 'Valeria Torres Lara',
    email: 'valeria.torres@estudiocreativo.mx',
    phone: '+52 55 9012 3456',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_cross_mind',
    planName: 'Plan Functional & Mind',
    allowedAreas: ['cross', 'yoga', 'gimnasio'],
    status: 'activa',
    expirationDate: '2026-12-15',
    joinedDate: '2025-08-14',
    qrCode: 'TRB-6874-VALERIA-CROSS-MIND-ACTIVE',
    balanceDue: 0,
    notes: 'Tiene autorizado Cross, Yoga y Gimnasio.',
  },
  {
    id: 'mem_006',
    memberNumber: 'TRB-9430',
    name: 'Dr. Fernando Beltrán',
    email: 'fernando.beltran@clinica.com',
    phone: '+52 55 2290 8110',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    planId: 'plan_total',
    planName: 'Plan Total Wellness',
    allowedAreas: ['natacion', 'yoga', 'gimnasio', 'cross'],
    status: 'suspendida',
    expirationDate: '2026-11-30',
    joinedDate: '2025-02-18',
    qrCode: 'TRB-9430-FERNANDO-SUSPENDED',
    balanceDue: 0,
    notes: 'Membresía en pausa médica por incapacidad temporal.',
  },
];

export const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'vis_101',
    memberId: 'mem_001',
    memberName: 'Roberto Montes',
    memberNumber: 'TRB-8041',
    memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'gimnasio',
    areaName: 'Gimnasio',
    timestamp: '2026-10-13T08:15:00.000Z',
    status: 'permitido',
    recordedBy: 'Torniquete Principal - QR',
  },
  {
    id: 'vis_102',
    memberId: 'mem_003',
    memberName: 'Carlos Ruiz Sandoval',
    memberNumber: 'TRB-5532',
    memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'natacion',
    areaName: 'Natación',
    timestamp: '2026-10-13T07:45:00.000Z',
    status: 'permitido',
    recordedBy: 'Módulo Alberca - Escáner QR',
  },
  {
    id: 'vis_103',
    memberId: 'mem_002',
    memberName: 'Mariana Gómez',
    memberNumber: 'TRB-4120',
    memberAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'natacion',
    areaName: 'Natación',
    timestamp: '2026-10-13T07:30:00.000Z',
    status: 'denegado',
    reason: 'Área no autorizada: Plan Fitness Básico no incluye alberca.',
    recordedBy: 'Módulo Alberca - Escáner QR',
  },
  {
    id: 'vis_104',
    memberId: 'mem_004',
    memberName: 'Esteban Morales Peña',
    memberNumber: 'TRB-2198',
    memberAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'cross',
    areaName: 'Cross Training',
    timestamp: '2026-10-13T07:05:00.000Z',
    status: 'denegado',
    reason: 'Membresía vencida el 02/10/2026. Requiere renovación.',
    recordedBy: 'Recepción Central - Escáner QR',
  },
  {
    id: 'vis_105',
    memberId: 'mem_005',
    memberName: 'Valeria Torres Lara',
    memberNumber: 'TRB-6874',
    memberAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'yoga',
    areaName: 'Yoga & Mind',
    timestamp: '2026-10-12T18:40:00.000Z',
    status: 'permitido',
    recordedBy: 'Estudio Yoga - Escáner QR',
  },
  {
    id: 'vis_106',
    memberId: 'mem_001',
    memberName: 'Roberto Montes',
    memberNumber: 'TRB-8041',
    memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    areaId: 'natacion',
    areaName: 'Natación',
    timestamp: '2026-10-12T06:50:00.000Z',
    status: 'permitido',
    recordedBy: 'Módulo Alberca - Escáner QR',
  },
];

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: 'cls_01',
    areaId: 'natacion',
    className: 'Nado Máster & Técnica de Crol',
    instructor: 'Prof. Leonardo Silva',
    schedule: '07:00 - 08:00',
    date: '2026-10-13',
    maxCapacity: 12,
    reservedCount: 9,
    level: 'Intermedio - Avanzado',
  },
  {
    id: 'cls_02',
    areaId: 'yoga',
    className: 'Vinyasa Flow Matutino',
    instructor: 'Mtra. Sofía Villaseñor',
    schedule: '08:30 - 09:30',
    date: '2026-10-13',
    maxCapacity: 18,
    reservedCount: 15,
    level: 'Todos los niveles',
  },
  {
    id: 'cls_03',
    areaId: 'cross',
    className: 'WOD: Fuerza & Condición Metabólica',
    instructor: 'Coach Héctor Bravo',
    schedule: '18:00 - 19:00',
    date: '2026-10-13',
    maxCapacity: 20,
    reservedCount: 17,
    level: 'Avanzado',
  },
  {
    id: 'cls_04',
    areaId: 'natacion',
    className: 'Aqua-Fitness y Resistencia',
    instructor: 'Entr. Andrea Cruz',
    schedule: '19:00 - 20:00',
    date: '2026-10-13',
    maxCapacity: 16,
    reservedCount: 8,
    level: 'Principiantes - Intermedios',
  },
  {
    id: 'cls_05',
    areaId: 'yoga',
    className: 'Restorative Yoga & Meditación',
    instructor: 'Yogui Daniel Méndez',
    schedule: '19:30 - 20:30',
    date: '2026-10-13',
    maxCapacity: 18,
    reservedCount: 11,
    level: 'Relajación y Movilidad',
  },
  {
    id: 'cls_06',
    areaId: 'cross',
    className: 'Gymnastics & Levantamiento Olímpico',
    instructor: 'Coach Marcela Ríos',
    schedule: '07:00 - 08:00',
    date: '2026-10-14',
    maxCapacity: 20,
    reservedCount: 6,
    level: 'Intermedio',
  },
];

export const INITIAL_RESERVATIONS: ClassReservation[] = [
  {
    id: 'res_01',
    sessionId: 'cls_01',
    memberId: 'mem_001',
    memberName: 'Roberto Montes',
    areaId: 'natacion',
    className: 'Nado Máster & Técnica de Crol',
    instructor: 'Prof. Leonardo Silva',
    schedule: '07:00 - 08:00',
    date: '2026-10-13',
    bookedAt: '2026-10-12T19:00:00.000Z',
    status: 'confirmada',
  },
  {
    id: 'res_02',
    sessionId: 'cls_02',
    memberId: 'mem_005',
    memberName: 'Valeria Torres Lara',
    areaId: 'yoga',
    className: 'Vinyasa Flow Matutino',
    instructor: 'Mtra. Sofía Villaseñor',
    schedule: '08:30 - 09:30',
    date: '2026-10-13',
    bookedAt: '2026-10-12T21:10:00.000Z',
    status: 'confirmada',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_01',
    memberId: 'mem_001',
    memberName: 'Roberto Montes',
    planName: 'Plan Total Wellness',
    amount: 1850,
    currency: 'MXN',
    paymentMethod: 'Tarjeta de Crédito',
    date: '2026-10-12',
    status: 'completado',
    receiptNumber: 'REC-2026-1092',
  },
  {
    id: 'pay_02',
    memberId: 'mem_002',
    memberName: 'Mariana Gómez',
    planName: 'Plan Fitness Básico',
    amount: 950,
    currency: 'MXN',
    paymentMethod: 'Transferencia SPEI',
    date: '2026-10-05',
    status: 'completado',
    receiptNumber: 'REC-2026-1055',
  },
  {
    id: 'pay_03',
    memberId: 'mem_003',
    memberName: 'Carlos Ruiz Sandoval',
    planName: 'Plan Aquatics & Fitness',
    amount: 1450,
    currency: 'MXN',
    paymentMethod: 'Tarjeta de Crédito',
    date: '2026-09-28',
    status: 'completado',
    receiptNumber: 'REC-2026-0988',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    targetRole: 'socio',
    memberId: 'mem_001',
    title: 'Mantenimiento Preventivo de Alberca',
    message: 'El carril olímpico 1 tendrá sesión de ajuste de temperatura hoy de 14:00 a 15:30. El resto de carriles operará normal.',
    timestamp: 'Hace 2 horas',
    read: false,
    type: 'aviso',
  },
  {
    id: 'notif_02',
    targetRole: 'socio',
    memberId: 'mem_001',
    title: 'Confirmación de Reserva',
    message: 'Tu lugar para la clase "Nado Máster & Técnica de Crol" está confirmado para hoy a las 07:00.',
    timestamp: 'Ayer',
    read: true,
    type: 'evento',
  },
  {
    id: 'notif_03',
    targetRole: 'all',
    title: 'Taller de Respiración y Recuperación',
    message: 'Este sábado a las 10:00 AM tendremos sesión especial en el estudio de Yoga & Mind.',
    timestamp: 'Hace 1 día',
    read: false,
    type: 'evento',
  },
];

class StorageService {
  isDemoCleared(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.DEMO_CLEARED) === 'true';
  }

  // Clear demo data permanently from the browser
  clearAllDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DEMO_CLEARED, 'true');
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    // Keep areas and plans structure available for operational use, but occupancy 0
    const emptyAreas = INITIAL_AREAS.map(a => ({ ...a, currentOccupancy: 0 }));
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(emptyAreas));
  }

  // Restore initial demo data for demonstration purposes
  restoreDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.DEMO_CLEARED);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(INITIAL_AREAS));
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(INITIAL_VISITS));
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_PLANS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  // Members
  getMembers(): Member[] {
    if (typeof window === 'undefined') return INITIAL_MEMBERS;
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      if (this.isDemoCleared()) return [];
      this.restoreDemoData();
      return INITIAL_MEMBERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveMembers(members: Member[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }

  addMember(member: Omit<Member, 'id' | 'qrCode'>): Member {
    const members = this.getMembers();
    const newId = `mem_${Date.now()}`;
    const newMember: Member = {
      ...member,
      id: newId,
      qrCode: `${member.memberNumber}-${member.name.replace(/\s+/g, '-').toUpperCase()}-${newId}`,
    };
    const updated = [newMember, ...members];
    this.saveMembers(updated);
    return newMember;
  }

  updateMember(id: string, updates: Partial<Member>): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const updated = { ...members[idx], ...updates };
    members[idx] = updated;
    this.saveMembers(members);
    return updated;
  }

  deleteMember(id: string): void {
    const members = this.getMembers().filter(m => m.id !== id);
    this.saveMembers(members);
  }

  // Active Member in Session (defaults to Roberto Montes)
  getActiveMemberId(): string {
    if (typeof window === 'undefined') return 'mem_001';
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
    if (stored) return stored;
    const members = this.getMembers();
    return members.length > 0 ? members[0].id : 'mem_001';
  }

  setActiveMemberId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, id);
  }

  // Areas
  getAreas(): Area[] {
    if (typeof window === 'undefined') return INITIAL_AREAS;
    const raw = localStorage.getItem(STORAGE_KEYS.AREAS);
    if (!raw) {
      if (this.isDemoCleared()) return INITIAL_AREAS.map(a => ({ ...a, currentOccupancy: 0 }));
      return INITIAL_AREAS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AREAS;
    }
  }

  saveAreas(areas: Area[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
  }

  updateArea(id: AreaId, updates: Partial<Area>): void {
    const areas = this.getAreas();
    const idx = areas.findIndex(a => a.id === id);
    if (idx !== -1) {
      areas[idx] = { ...areas[idx], ...updates };
      this.saveAreas(areas);
    }
  }

  // Visits
  getVisits(): VisitRecord[] {
    if (typeof window === 'undefined') return INITIAL_VISITS;
    const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
    if (!raw) {
      if (this.isDemoCleared()) return [];
      return INITIAL_VISITS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveVisits(visits: VisitRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  }

  recordVisit(visit: Omit<VisitRecord, 'id' | 'timestamp'>): VisitRecord {
    const visits = this.getVisits();
    const newVisit: VisitRecord = {
      ...visit,
      id: `vis_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newVisit, ...visits];
    this.saveVisits(updated);

    // If allowed, increment occupancy if below capacity
    if (newVisit.status === 'permitido') {
      const areas = this.getAreas();
      const area = areas.find(a => a.id === newVisit.areaId);
      if (area && area.currentOccupancy < area.maxCapacity) {
        this.updateArea(newVisit.areaId, { currentOccupancy: area.currentOccupancy + 1 });
      }
    }

    return newVisit;
  }

  // Classes & Reservations
  getClasses(): ClassSession[] {
    if (typeof window === 'undefined') return INITIAL_CLASSES;
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (!raw) return INITIAL_CLASSES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CLASSES;
    }
  }

  getReservations(): ClassReservation[] {
    if (typeof window === 'undefined') return INITIAL_RESERVATIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      if (this.isDemoCleared()) return [];
      return INITIAL_RESERVATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveReservations(reservations: ClassReservation[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }

  createReservation(reservation: Omit<ClassReservation, 'id' | 'bookedAt' | 'status'>): ClassReservation {
    const reservations = this.getReservations();
    const newRes: ClassReservation = {
      ...reservation,
      id: `res_${Date.now()}`,
      bookedAt: new Date().toISOString(),
      status: 'confirmada',
    };
    this.saveReservations([newRes, ...reservations]);
    return newRes;
  }

  cancelReservation(id: string): void {
    const reservations = this.getReservations().map(r => 
      r.id === id ? { ...r, status: 'cancelada' as const } : r
    );
    this.saveReservations(reservations);
  }

  // Plans
  getPlans(): MembershipPlan[] {
    if (typeof window === 'undefined') return INITIAL_PLANS;
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!raw) return INITIAL_PLANS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PLANS;
    }
  }

  // Payments
  getPayments(): PaymentRecord[] {
    if (typeof window === 'undefined') return INITIAL_PAYMENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      if (this.isDemoCleared()) return [];
      return INITIAL_PAYMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  savePayments(payments: PaymentRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }

  addPayment(payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>): PaymentRecord {
    const payments = this.getPayments();
    const newPay: PaymentRecord = {
      ...payment,
      id: `pay_${Date.now()}`,
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    this.savePayments([newPay, ...payments]);
    return newPay;
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      if (this.isDemoCleared()) return [];
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // Supabase Configuration
  getSupabaseConfig(): SupabaseConfig {
    if (typeof window === 'undefined') {
      return { url: '', anonKey: '', isConnected: false };
    }
    const raw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (!raw) return { url: '', anonKey: '', isConnected: false };
    try {
      return JSON.parse(raw);
    } catch {
      return { url: '', anonKey: '', isConnected: false };
    }
  }

  saveSupabaseConfig(config: SupabaseConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  }
}

export const storageService = new StorageService();
