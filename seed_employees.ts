/**
 * Seed script — run once to populate Firebase Auth + Firestore
 * Usage:  npx tsx seed_employees.ts
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// ─── Init Admin SDK ──────────────────────────────────────────────────────────
const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: firebaseConfig.projectId,
  });
}

const auth = admin.auth();
const db = admin.firestore();

// ─── Admin accounts ─────────────────────────────────────────────────────────
const ADMINS = [
  { email: 'super@hrpulse.com',        password: 'super@1234', role: 'super', name: 'Super Admin',      branch: 'Office' },
  { email: 'owner@hrpulse.com',        password: 'owner@4321', role: 'owner', name: 'Owner',            branch: 'Office' },
  { email: 'hr@hrpulse.com',           password: 'hrpulse@4321', role: 'hr',    name: 'HR Manager',       branch: 'Office' },
  { email: 'dinudinu4927@gmail.com',  password: 'Dinu@4927',    role: 'owner', name: 'Dinusha (Owner)',   branch: 'Office' },
];

async function createOrGetUser(email: string, password: string): Promise<string> {
  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`  ↳ Already exists: ${email} (${existing.uid})`);
    return existing.uid;
  } catch {
    const user = await auth.createUser({ email, password, displayName: email.split('@')[0] });
    console.log(`  ↳ Created: ${email} (${user.uid})`);
    return user.uid;
  }
}

async function seed() {
  console.log('\n🔥 HR Pulse — Firebase Seed Script\n');
  console.log('━'.repeat(50));

  console.log('\n📋 Seeding admin accounts...');
  for (const admin_ of ADMINS) {
    const uid = await createOrGetUser(admin_.email, admin_.password);
    await db.collection('users').doc(uid).set({
      uid,
      name: admin_.name,
      email: admin_.email,
      username: admin_.email.split('@')[0],
      role: admin_.role,
      branch: admin_.branch,
      joinDate: new Date().toISOString().split('T')[0],
      salaryA: 0, salaryB: 0, epf: 0,
      advances: 0, cover: 0, intensive: 0, travelling: 0, net: 0,
      performanceScore: 100,
      leaveQuotas: { annual: 20, sick: 10, casual: 7, short: 2 },
      usedLeaves: { annual: 0, sick: 0, casual: 0, short: 0 },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  console.log('\n👥 Seeding company employees...');
  const employeeData = [
    { name: 'Dahami Divyanjali', email: 'dahami.divyanjali@hrpulse.com', password: 'dahami123', branch: 'Borella', salaryA: 27000, salaryB: 30000, net: 30150 },
    { name: 'Achini Vindya', email: 'achini.vindya@hrpulse.com', password: 'achini123', branch: 'Borella', salaryA: 30000, salaryB: 30000, net: 32780 },
    { name: 'Dilini Sanarathna', email: 'dilini.sanarathna@hrpulse.com', password: 'dilini123', branch: 'Dehiwela', salaryA: 35000, salaryB: 0, net: 37880 },
    { name: 'Chamilka Botheju', email: 'chamilka.botheju@hrpulse.com', password: 'chamilka123', branch: 'Dematagoda', salaryA: 32000, salaryB: 30000, net: 37600 },
    { name: 'A.V. Chamika Sonali', email: 'chamika.sonali@hrpulse.com', password: 'chamika123', branch: 'Dematagoda', salaryA: 27000, salaryB: 30000, net: 27960 },
    { name: 'D.A. Dilupa Thamari', email: 'dilupa.thamari@hrpulse.com', password: 'dilupa123', branch: 'Homagama', salaryA: 29000, salaryB: 30000, net: 34600 },
    { name: 'Harsha Thamali', email: 'harsha.thamali@hrpulse.com', password: 'harsha123', branch: 'Homagama', salaryA: 27000, salaryB: 30000, net: 0 },
    { name: 'Sachini Nirasha', email: 'sachini.nirasha@hrpulse.com', password: 'sachini123', branch: 'Kadawatha', salaryA: 30000, salaryB: 30000, net: 29100 },
    { name: 'Chaseera Sulani', email: 'chaseera.sulani@hrpulse.com', password: 'chaseera123', branch: 'Kadawatha', salaryA: 27000, salaryB: 30000, net: 25100 },
    { name: 'Geethangani Pieris', email: 'geethangani.pieris@hrpulse.com', password: 'geethangani123', branch: 'Kiribathgoda', salaryA: 30000, salaryB: 30000, net: 24500 },
    { name: 'W.K. Erandi Perera', email: 'erandi.perera@hrpulse.com', password: 'erandi123', branch: 'Kiribathgoda', salaryA: 27000, salaryB: 30000, net: 26040 },
    { name: 'W.A. Chandima Dilrukishi', email: 'chandima.dilrukishi@hrpulse.com', password: 'chandima123', branch: 'Kottawa', salaryA: 28000, salaryB: 30000, net: 30600 },
    { name: 'Rasika Priyangani', email: 'rasika.priyangani@hrpulse.com', password: 'rasika123', branch: 'Kottawa', salaryA: 34000, salaryB: 30000, net: 36600 },
    { name: 'A.M.N. Sanjana', email: 'am.n.sanjana@hrpulse.com', password: 'amn123', branch: 'Office', salaryA: 29750, salaryB: 30000, net: 35350 },
    { name: 'R.P. Ratnayake', email: 'rp.ratnayake@hrpulse.com', password: 'rp123', branch: 'Office', salaryA: 27500, salaryB: 0, net: 27500 },
    { name: 'Nihal Malawana', email: 'nihal.malawana@hrpulse.com', password: 'nihal123', branch: 'Office', salaryA: 34500, salaryB: 0, net: 45280 },
    { name: 'Syamalie Udumulla', email: 'syamalie.udumulla@hrpulse.com', password: 'syamalie123', branch: 'Office', salaryA: 11000, salaryB: 0, net: 11000 },
    { name: 'Nishanthi Kuruppu', email: 'nishanthi.kuruppu@hrpulse.com', password: 'nishanthi123', branch: 'Office', salaryA: 33200, salaryB: 30000, net: 40800 },
    { name: 'Nadeesha Dilhara', email: 'nadeesha.dilhara@hrpulse.com', password: 'nadeesha123', branch: 'Office', salaryA: 38000, salaryB: 30000, net: 38975 },
    { name: 'Chathurika Madushani', email: 'chathurika.madushani@hrpulse.com', password: 'chathurika123', branch: 'Office', salaryA: 27000, salaryB: 30000, net: 27590 },
    { name: 'Maneesha H. Dias', email: 'maneesha.dias@hrpulse.com', password: 'maneesha123', branch: 'Panadura', salaryA: 35000, salaryB: 30000, net: 38720 },
    { name: 'Imashi Pramodaya', email: 'imashi.pramodaya@hrpulse.com', password: 'imashi123', branch: 'Panadura', salaryA: 27000, salaryB: 30000, net: 26625 },
    { name: 'Aruni Indrachapa', email: 'aruni.indrachapa@hrpulse.com', password: 'aruni123', branch: 'W2', salaryA: 27000, salaryB: 30000, net: 25600 },
    { name: 'Tharushi Sadurnin', email: 'tharushi.sadurnin@hrpulse.com', password: 'tharushi123', branch: 'W2', salaryA: 27000, salaryB: 30000, net: 27600 },
    { name: 'Lakshika Perera', email: 'lakshika.perera@hrpulse.com', password: 'lakshika123', branch: 'W3', salaryA: 27000, salaryB: 30000, net: 30100 },
    { name: 'Tharushi Apsara', email: 'tharushi.apsara@hrpulse.com', password: 'tharushi123', branch: 'W3', salaryA: 27000, salaryB: 30000, net: 24600 },
    { name: 'D.M. Nilukshi Kawshalya', email: 'nilukshi.kawshalya@hrpulse.com', password: 'nilukshi123', branch: 'W4', salaryA: 29000, salaryB: 30000, net: 36750 },
    { name: 'Dulki Isanka', email: 'dulki.isanka@hrpulse.com', password: 'dulki123', branch: 'W4', salaryA: 27000, salaryB: 30000, net: 26100 },
  ];

  console.log('\n👥 Seeding company employees...');
  for (const emp of employeeData) {
    try {
      const uid = await createOrGetUser(emp.email, emp.password);
      
      await db.collection('users').doc(uid).set({
        uid,
        name: emp.name,
        email: emp.email,
        username: emp.email.split('@')[0],
        role: 'employee',
        branch: emp.branch,
        joinDate: new Date().toISOString().split('T')[0],
        salaryA: emp.salaryA,
        salaryB: emp.salaryB,
        epf: Math.round(emp.salaryA * 0.08),
        advances: 0,
        cover: 0,
        intensive: 0,
        travelling: 0,
        net: emp.net,
        performanceScore: 85,
        leaveQuotas: { annual: 20, sick: 10, casual: 7, short: 2 },
        usedLeaves: { annual: 0, sick: 0, casual: 0, short: 0 },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (err: any) {
      console.error(`  ❌ Failed for ${emp.email}: ${err.message}`);
    }
  }

  console.log('\n✅ Seed process finished.\n');
  console.log('Admins:');
  ADMINS.forEach(a => console.log(`   ${a.email}  →  ${a.password}`));
  console.log('\nEmployees:');
  console.log(`   Added ${employeeData.length} employees with specific passwords.`);
}

seed().catch(console.error);
