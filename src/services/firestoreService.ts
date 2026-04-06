import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, AttendanceRecord, LeaveRequest, Task, PayrollRecord, PerformanceRecord } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

// ─── Employees / Users ───────────────────────────────────────────────────────

export async function getEmployees(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
}

export async function getEmployee(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserProfile) : null;
}

export async function saveEmployee(emp: UserProfile): Promise<void> {
  const { uid, ...data } = emp;
  await setDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteEmployee(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}

export async function addIncentiveDeduction(
  uid: string, amount: number, type: 'incentive' | 'deduction'
): Promise<boolean> {
  const emp = await getEmployee(uid);
  if (!emp) return false;

  const field = type === 'incentive' ? 'intensive' : 'advances';
  const updated = {
    ...emp,
    [field]: (emp[field] || 0) + amount,
  };
  updated.net = updated.salaryA + updated.salaryB + updated.intensive + updated.travelling
    - updated.epf - updated.advances - updated.cover;

  await saveEmployee(updated);
  return true;
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export async function getAttendance(uid?: string): Promise<AttendanceRecord[]> {
  let q;
  if (uid) {
    q = query(collection(db, 'attendance'), where('userId', '==', uid), orderBy('date', 'desc'));
  } else {
    q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as AttendanceRecord));
}

export async function saveAttendance(record: Omit<AttendanceRecord, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'attendance'), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<void> {
  await updateDoc(doc(db, 'attendance', id), updates as any);
}

function getLocalToday(): string {
  // Always use Sri Lanka time for the "Today" marker
  return new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Colombo', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(new Date());
}

export async function checkIn(uid: string): Promise<boolean> {
  const today = getLocalToday();
  const existing = await getAttendance(uid);
  // Check if already checked in today in SL time
  if (existing.find(a => a.date === today)) return false;

  const now = new Date();
  const slTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).format(now);
  
  const [hours, minutes] = slTime.split(':').map(Number);
  const isLate = hours > 9 || (hours === 9 && minutes > 0);
  
  await saveAttendance({ 
    userId: uid, 
    date: today, 
    checkIn: now.toISOString(), 
    isLate, 
    isEarlyOut: false 
  });
  return true;
}

export async function checkOut(uid: string): Promise<boolean> {
  const today = getLocalToday();
  const all = await getAttendance(uid);
  // Find an open shift for TODAY in SL time
  const existing = all.find(a => a.date === today && !a.checkOut);
  if (!existing?.id) return false;

  const now = new Date();
  const slTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).format(now);
  
  const [hours] = slTime.split(':').map(Number);
  const isEarlyOut = hours < 17;
  
  await updateAttendance(existing.id, { 
    checkOut: now.toISOString(), 
    isEarlyOut 
  });
  return true;
}

// ─── Leave Requests ──────────────────────────────────────────────────────────

export async function getLeaves(uid?: string): Promise<LeaveRequest[]> {
  let q;
  if (uid) {
    q = query(collection(db, 'leaveRequests'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'leaveRequests'), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as LeaveRequest));
}

export async function saveLeave(req: Omit<LeaveRequest, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'leaveRequests'), {
    ...req,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLeave(
  id: string, status: 'Approved' | 'Rejected', approvedBy: string
): Promise<void> {
  await updateDoc(doc(db, 'leaveRequests', id), { status, approvedBy, updatedAt: serverTimestamp() });
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks(uid: string): Promise<Task[]> {
  const q = query(collection(db, 'tasks'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as Task));
}

export async function saveTask(task: Omit<Task, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'tasks'), { ...task, createdAt: serverTimestamp() });
  return ref.id;
}

export async function toggleTask(id: string): Promise<void> {
  const snap = await getDoc(doc(db, 'tasks', id));
  if (snap.exists()) {
    await updateDoc(doc(db, 'tasks', id), { completed: !snap.data().completed });
  }
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', id));
}

// ─── Payroll ─────────────────────────────────────────────────────────────────

export async function getPayroll(uid?: string): Promise<PayrollRecord[]> {
  let q;
  if (uid) {
    q = query(collection(db, 'payroll'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'payroll'), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as PayrollRecord));
}

export async function generatePayroll(month: number, year: number): Promise<void> {
  const employees = await getEmployees();
  const existing = await getPayroll();

  for (const emp of employees) {
    const exists = existing.find(p => p.userId === emp.uid && p.month === month && p.year === year);
    if (!exists) {
      const id = `pay-${emp.uid}-${month}-${year}`;
      await setDoc(doc(db, 'payroll', id), {
        userId: emp.uid,
        userName: emp.name,
        month,
        year,
        salaryA: emp.salaryA,
        salaryB: emp.salaryB,
        epf: emp.epf,
        advances: emp.advances,
        cover: emp.cover,
        intensive: emp.intensive,
        travelling: emp.travelling,
        netSalary: emp.net,
        status: 'Pending',
        branch: emp.branch,
        createdAt: serverTimestamp(),
      });
    }
  }
}

export async function updatePayroll(id: string, updates: Partial<PayrollRecord>): Promise<void> {
  await updateDoc(doc(db, 'payroll', id), { ...updates, updatedAt: serverTimestamp() } as any);
}

// ─── Performance ─────────────────────────────────────────────────────────────

export async function getPerformance(uid?: string): Promise<PerformanceRecord[]> {
  let q;
  if (uid) {
    q = query(collection(db, 'performance'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'performance'), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as PerformanceRecord));
}

export async function savePerformance(record: Omit<PerformanceRecord, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'performance'), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePerformance(id: string, updates: Partial<PerformanceRecord>): Promise<void> {
  await updateDoc(doc(db, 'performance', id), { ...updates, updatedAt: serverTimestamp() } as any);
}
