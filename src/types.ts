import { Timestamp } from 'firebase/firestore';

export type UserRole = 'owner' | 'hr' | 'employee' | 'super';

export interface UserProfile {
  uid: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  branch?: string; // Added branch
  startDate?: Timestamp; // Added start date
  profilePic?: string;
  mustResetPassword?: boolean;
  salary: number;
  salaryB?: number; // Added Salary-B
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
  performanceScore: number;
  createdAt: Timestamp;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Short';

export interface LeaveRequest {
  id?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  leaveType: LeaveType;
  reason: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: LeaveStatus;
  isUrgent?: boolean;
  approvedBy?: string; // UID of the approver
  createdAt: Timestamp;
}

export interface AttendanceRecord {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn: Timestamp;
  checkOut?: Timestamp;
  isLate: boolean;
  isEarlyOut: boolean;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Timestamp;
}

export interface Holiday {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'public' | 'company';
}

export interface PayrollRecord {
  id?: string;
  userId: string;
  userName: string;
  branch: string;
  startDate: Timestamp;
  month: number; // 1-12
  year: number;
  salaryA: number;
  salaryB: number;
  epf: number;
  advances: number;
  coverDedication: number;
  intensive: number;
  travelling: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  createdAt: Timestamp;
}

export interface PerformanceRecord {
  id?: string;
  userId: string;
  userName: string;
  evaluatorId: string;
  evaluatorName: string;
  score: number; // 1-100
  feedback: string;
  goals: string[];
  selfEvaluation?: string;
  createdAt: Timestamp;
}
