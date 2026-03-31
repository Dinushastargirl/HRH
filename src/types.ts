export type UserRole = 'super' | 'owner' | 'hr' | 'employee';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  department?: string;
  joinDate: string;
  basic: number;
  epf: number;
  etf: number;
  allowances: number;
  deductions: number;
  net: number;
  performanceScore?: number;
  leaveQuotas: {
    annual: number;
    sick: number;
    casual: number;
    short: number;
  };
  usedLeaves: {
    annual: number;
    sick: number;
    casual: number;
    short: number;
  };
}

export interface AttendanceRecord {
  id?: string;
  userId: string;
  date: string;
  checkIn: any; // Timestamp or Date
  checkOut?: any;
  isLate: boolean;
  isEarlyOut: boolean;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Short';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  leaveType: LeaveType;
  startDate: any;
  endDate: any;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  createdAt: any;
  isUrgent?: boolean;
}

export interface Holiday {
  id: string;
  date: string;
  title: string;
  type: 'Public' | 'Bank' | 'Mercantile';
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: any;
}

export interface PayrollRecord {
  id?: string;
  userId: string;
  userName: string;
  month: number;
  year: number;
  basic: number;
  allowances: number;
  deductions: number;
  epf: number;
  etf: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  createdAt: any;
  branch: string;
  // Additional fields for management
  incentives?: number;
  bonus?: number;
}

export interface PerformanceRecord {
  id: string;
  userId: string;
  userName: string;
  evaluatorId: string;
  evaluatorName: string;
  score: number;
  rating: number;
  feedback: string;
  hrFeedback?: string;
  selfEvaluation?: string;
  goals: string[];
  status: 'Draft' | 'Completed' | 'Self-Evaluated';
  createdAt: any;
}
