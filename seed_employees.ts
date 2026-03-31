
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const employee = {
    uid: 'user_employee_user_123',
    username: 'employee.user',
    name: 'Employee User',
    email: 'employee.user@hrpulse.com',
    department: 'General',
    branch: 'Main',
    startDate: '2026-03-31',
    role: 'employee',
    salary: 3000,
    salaryB: 2000,
    leaveQuotas: { annual: 14, sick: 7, casual: 7, short: 12 },
    usedLeaves: { annual: 0, sick: 0, casual: 0, short: 0 },
    performanceScore: 0,
    mustResetPassword: true,
    createdAt: new Date(),
  };

  try {
    await setDoc(doc(db, 'users', employee.uid), {
      ...employee,
      createdAt: serverTimestamp(),
    });
    console.log('Employee seeded successfully');

    // Also seed the payroll record
    const payroll = {
      employeeId: employee.uid,
      employeeName: employee.name,
      month: 3,
      year: 2026,
      salaryA: 3000,
      salaryB: 2000,
      epf: 400,
      advances: 0,
      coverDedication: 0,
      intensive: 500,
      travelling: 0,
      netSalary: 5100,
      branch: 'Main',
      cutoffDate: '2026-03-31',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'payroll', `payroll_${employee.uid}_2026_3`), {
      ...payroll,
      createdAt: serverTimestamp(),
    });
    console.log('Payroll record seeded successfully');
  } catch (err) {
    console.error('Error seeding:', err);
  }
}

seed();
