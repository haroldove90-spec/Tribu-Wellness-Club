export type UserRole = 'socio' | 'recepcion' | 'admin' | 'entrenador';

export type AreaId = 'natacion' | 'yoga' | 'gimnasio' | 'cross';

export type MembershipStatus = 'activa' | 'vencida' | 'suspendida';

export interface Area {
  id: AreaId;
  name: string;
  discipline: string;
  description: string;
  icon: string;
  maxCapacity: number;
  currentOccupancy: number;
  scheduleHours: string;
  instructors: string[];
}

export interface Member {
  id: string;
  memberNumber: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  planId: string;
  planName: string;
  allowedAreas: AreaId[];
  status: MembershipStatus;
  expirationDate: string; // YYYY-MM-DD
  joinedDate: string;
  qrCode: string;
  balanceDue: number;
  emergencyContact?: string;
  notes?: string;
}

export interface VisitRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberNumber: string;
  memberAvatar: string;
  areaId: AreaId;
  areaName: string;
  timestamp: string; // ISO string
  status: 'permitido' | 'denegado';
  reason?: string;
  recordedBy: string; // 'Recepción - Escáner QR' | 'Registro Manual' | etc.
}

export interface ClassSession {
  id: string;
  areaId: AreaId;
  className: string;
  instructor: string;
  schedule: string; // e.g. "07:00 - 08:00"
  date: string; // YYYY-MM-DD
  maxCapacity: number;
  reservedCount: number;
  level: string;
}

export interface ClassReservation {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  areaId: AreaId;
  className: string;
  instructor: string;
  schedule: string;
  date: string;
  bookedAt: string;
  status: 'confirmada' | 'cancelada';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string; // 'mensual' | 'anual' | etc.
  includedAreas: AreaId[];
  features: string[];
  isPopular?: boolean;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: 'Tarjeta de Crédito' | 'Transferencia SPEI' | 'Efectivo';
  date: string; // YYYY-MM-DD
  status: 'completado' | 'pendiente';
  receiptNumber: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  memberId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'aviso' | 'vencimiento' | 'evento';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
