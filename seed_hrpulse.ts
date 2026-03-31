import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const employees = [
  // Borella
  { branch: 'Borella', name: 'Dahami Divyanjali', startDate: '2024-06-05', salary: 27000 },
  { branch: 'Borella', name: 'Achini Vindya', startDate: '2024-02-22', salary: 30000 },
  // Dehiwela
  { branch: 'Dehiwela', name: 'Dilini Sanarathna', startDate: '2026-03-04', salary: 35000 },
  // Dematagoda
  { branch: 'Dematagoda', name: 'Chamilka Botheju', startDate: '2002-08-02', salary: 32000 },
  { branch: 'Dematagoda', name: 'A.V. Chamika Sonali', startDate: '2026-01-12', salary: 27000 },
  // Homagama
  { branch: 'Homagama', name: 'D.A. Dilupa Thamari', startDate: '2002-09-01', salary: 29000 },
  { branch: 'Homagama', name: 'Harsha Thamali', startDate: '2017-09-01', salary: 27000 },
  // Kadawatha
  { branch: 'Kadawatha', name: 'Sachini Nirasha', startDate: '2022-07-01', salary: 30000 },
  { branch: 'Kadawatha', name: 'Chaseera Sulani', startDate: '2024-03-12', salary: 27000 },
  // Kiribathgoda
  { branch: 'Kiribathgoda', name: 'Geethangani Pieris', startDate: '2019-01-09', salary: 30000 },
  { branch: 'Kiribathgoda', name: 'W.k. Eranclathi Perera', startDate: '2026-02-03', salary: 27000 },
  // Kottawa
  { branch: 'Kottawa', name: 'W.A. Chandima Dilrukishi', startDate: '2015-01-06', salary: 28000 },
  { branch: 'Kottawa', name: 'Rasika Priyangani', startDate: '2017-02-07', salary: 34000 },
  // Office
  { branch: 'Office', name: 'A.M.N. Sanjana', startDate: '2024-01-01', salary: 29700 },
  { branch: 'Office', name: 'R.P. Ratnayake', startDate: '2024-01-01', salary: 27500 },
  { branch: 'Office', name: 'Nihal Malawana', startDate: '2024-01-01', salary: 34500 },
  { branch: 'Office', name: 'Syamalie Udumulla', startDate: '2024-01-01', salary: 11000 },
  { branch: 'Office', name: 'Nishanthi Kuruppu', startDate: '2024-01-01', salary: 33200 },
  { branch: 'Office', name: 'Nadeesha Dilhara', startDate: '2024-01-01', salary: 38000 },
  { branch: 'Office', name: 'Chathurika Madushani', startDate: '2024-01-01', salary: 27000 },
  // Panadura
  { branch: 'Panadura', name: 'Maneesha H. Dias', startDate: '2024-01-01', salary: 35000 },
  { branch: 'Panadura', name: 'Imashi Pramodaya', startDate: '2024-01-01', salary: 27000 },
  // W2/W3/W4
  { branch: 'W2', name: 'Aruni Indrachapa', startDate: '2024-01-01', salary: 27000 },
  { branch: 'W3', name: 'Tharushi Sadurnin', startDate: '2024-01-01', salary: 28000 },
  { branch: 'W4', name: 'Lakshika Perera', startDate: '2024-01-01', salary: 29000 },
  { branch: 'W2', name: 'Tharushi Apsara', startDate: '2024-01-01', salary: 27000 },
  { branch: 'W3', name: 'D.M. Nilukshi Kawshalya', startDate: '2024-01-01', salary: 28000 },
  { branch: 'W4', name: 'Dulki Isanka', startDate: '2024-01-01', salary: 29000 },
];

async function seed() {
  console.log('Seeding employees...');
  const batchSize = 5;
  for (let i = 0; i < employees.length; i += batchSize) {
    const batch = employees.slice(i, i + batchSize);
    await Promise.all(batch.map(async (emp) => {
      const username = emp.name.toLowerCase().replace(/\s+/g, '.');
      const uid = `emp_${username}`;
      const docRef = doc(db, 'users', uid);
      
      const userData = {
        uid,
        username,
        name: emp.name,
        email: `${username}@hrpulse.com`,
        role: 'employee',
        branch: emp.branch,
        startDate: Timestamp.fromDate(new Date(emp.startDate)),
        salary: emp.salary,
        salaryB: 0,
        leaveQuotas: { annual: 14, sick: 7, casual: 7, short: 4 },
        usedLeaves: { annual: 0, sick: 0, casual: 0, short: 0 },
        performanceScore: 100,
        mustResetPassword: true,
        createdAt: Timestamp.now()
      };
      
      await setDoc(docRef, userData);
      console.log(`Added ${emp.name}`);
    }));
    console.log(`Finished employee batch ${i/batchSize + 1}`);
  }

  console.log('Seeding February 2026 Payroll...');
  for (let i = 0; i < employees.length; i += batchSize) {
    const batch = employees.slice(i, i + batchSize);
    await Promise.all(batch.map(async (emp) => {
      const username = emp.name.toLowerCase().replace(/\s+/g, '.');
      const uid = `emp_${username}`;
      const payrollId = `pay_2026_2_${uid}`;
      
      const payrollData = {
        userId: uid,
        userName: emp.name,
        branch: emp.branch,
        startDate: Timestamp.fromDate(new Date(emp.startDate)),
        month: 2,
        year: 2026,
        salaryA: emp.salary,
        salaryB: 0,
        epf: emp.salary * 0.08,
        advances: 0,
        coverDedication: 0,
        intensive: 0,
        travelling: 0,
        netSalary: emp.salary - (emp.salary * 0.08),
        status: 'Paid',
        createdAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'payroll', payrollId), payrollData);
    }));
    console.log(`Finished payroll batch ${i/batchSize + 1}`);
  }
  console.log('Done!');
}

seed().catch(console.error);
