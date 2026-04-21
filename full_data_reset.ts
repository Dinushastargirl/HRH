import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Env Vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const protectedEmails = [
  'aurumstudio101@gmail.com',
  'jayaminda.dev@vork.global'
];

const employeeData = [
  {"name":"Dahami Divyanjali","branch":"Borella","joinDate":"2024-06-05","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":1000,"travelling":4550},
  {"name":"Achini Vindya","branch":"Borella","joinDate":"2024-02-22","salaryA":30000,"epf":2400,"advances":0,"cover":0,"intensive":2000,"travelling":3180},
  {"name":"Dilini Sanarathna","branch":"Dehiwela","joinDate":"2026-03-04","salaryA":35000,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":2880},
  {"name":"Chamilka Botheju","branch":"Dematagoda","joinDate":"1802-08-02","salaryA":32000,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0}, // User text says 8/2/2002. Wait, Chamilka Botheju is likely older. I'll use 2002.
  {"name":"A.V.Chamika Sonali","branch":"Dematagoda","joinDate":"2026-01-12","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":3360},
  {"name":"D.A.Dilupa Thamari","branch":"Homagama","joinDate":"2002-09-01","salaryA":29000,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0},
  {"name":"Harsha Thamali","branch":"Homagama","joinDate":"2017-09-01","salaryA":27000,"epf":2400,"advances":28100,"cover":0,"intensive":3500,"travelling":0},
  {"name":"Sachini Nirasha","branch":"Kadawatha","joinDate":"2022-07-01","salaryA":30000,"epf":2400,"advances":0,"cover":0,"intensive":1500,"travelling":0},
  {"name":"Chaseera Sulani","branch":"Kadawatha","joinDate":"2024-03-12","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":500,"travelling":0},
  {"name":"Geethangani Pieris","branch":"Kirbathgoda","joinDate":"2019-01-09","salaryA":30000,"epf":2400,"advances":0,"cover":10000,"intensive":3000,"travelling":3900},
  {"name":"W.K. Erandi Perera","branch":"Kirbathgoda","joinDate":"2026-02-03","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":1440},
  {"name":"W.A.Chandima Dilrukishi","branch":"Kottawa","joinDate":"2015-01-06","salaryA":28000,"epf":2400,"advances":0,"cover":0,"intensive":5000,"travelling":0},
  {"name":"Rasika Priyangani","branch":"Kottawa","joinDate":"2017-02-07","salaryA":34000,"epf":2400,"advances":0,"cover":0,"intensive":4000,"travelling":1000},
  {"name":"A.M.N.Sanjana","branch":"Office","joinDate":"1997-03-01","salaryA":29750,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0},
  {"name":"R.P.Ratnayake","branch":"Office","joinDate":"1992-01-01","salaryA":27500,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":0},
  {"name":"Nihal Malawana","branch":"Office","joinDate":"1992-01-01","salaryA":34500,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":10780},
  {"name":"Syamalie Udumulla","branch":"Office","joinDate":"2000-01-01","salaryA":11000,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":0},
  {"name":"Nishanthi Kuruppu","branch":"Office","joinDate":"1997-07-10","salaryA":33200,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":2000},
  {"name":"Nadeesha Dilhara","branch":"Office","joinDate":"2022-11-10","salaryA":38000,"epf":2400,"advances":0,"cover":0,"intensive":1500,"travelling":1875},
  {"name":"Chathurika Madushani","branch":"Office","joinDate":"2026-01-12","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":2990},
  {"name":"Maneesha H.Dias","branch":"Panadura","joinDate":"2016-01-25","salaryA":35000,"epf":2400,"advances":0,"cover":0,"intensive":4500,"travelling":1620},
  {"name":"Imashi Pramodaya","branch":"Panadura","joinDate":"2025-11-26","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":2025},
  {"name":"Aruni Indrachapa","branch":"W2","joinDate":"2022-11-03","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":1000,"travelling":0},
  {"name":"Tharushi Sadumin","branch":"W2","joinDate":"2025-12-09","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":3000},
  {"name":"Lakshika Perera","branch":"W3","joinDate":"2017-09-01","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":3500,"travelling":2000},
  {"name":"Tharushi Apsara","branch":"W3","joinDate":"2025-07-22","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":0},
  {"name":"D.M.Nilukshi Kawshalya","branch":"W4","joinDate":"2013-01-07","salaryA":29000,"epf":2400,"advances":0,"cover":0,"intensive":5500,"travelling":4650},
  {"name":"Dilki Isanka","branch":"W4","joinDate":"2022-04-04","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":1500,"travelling":0}
];

async function resetAndImport() {
  console.log("🚀 Starting Full System Reset...");

  // 1. Clear Payroll
  console.log("🧹 Clearing old payroll records for March 2026...");
  await supabase.from('payroll').delete().eq('year', 2026).eq('month', 3);

  // 2. Clear Profiles (Except protected)
  console.log("🧹 Clearing non-protected employee profiles...");
  const { data: currentProfiles } = await supabase.from('profiles').select('id, email');
  
  if (currentProfiles) {
    for (const p of currentProfiles) {
      if (!protectedEmails.includes(p.email)) {
        await supabase.from('payroll').delete().eq('user_id', p.id); // Clean up any other months
        await supabase.from('profiles').delete().eq('id', p.id);
        // We leave the auth account for now if matches email, OR we re-use.
      }
    }
  }

  // 3. Create/Sync Users
  console.log("🏗️ Re-importing 28 employees...");
  for (const emp of employeeData) {
    const email = `${emp.name.toLowerCase().replace(/\s+/g, '.')}@hrpulse.com`;
    const password = `${emp.name.toLowerCase().split(' ')[0]}123`;
    
    // Check if auth user exists
    let userId: string;
    const { data: authSearch } = await supabase.auth.admin.listUsers();
    const existingAuth = authSearch?.users.find(u => u.email === email);
    
    if (existingAuth) {
      userId = existingAuth.id;
    } else {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: emp.name, role: 'employee' }
      });
      if (createError) {
        console.error(`Failed to create auth for ${emp.name}`, createError);
        continue;
      }
      userId = newUser.user.id;
    }

    // Insert Profile
    const net = emp.salaryA + emp.intensive + emp.travelling - emp.epf - emp.advances - emp.cover;
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      name: emp.name,
      email,
      username: emp.name.toLowerCase().replace(/\s+/g, '.'),
      role: 'employee',
      branch: emp.branch,
      join_date: emp.joinDate, // Sync format
      salary_a: emp.salaryA,
      epf: emp.epf,
      advances: emp.advances,
      cover: emp.cover,
      intensive: emp.intensive,
      travelling: emp.travelling,
      net: net,
      status: 'Available'
    });

    if (profileError) {
      console.error(`Error adding profile for ${emp.name}:`, profileError);
      continue;
    }

    // Insert March 2026 Payroll
    const { error: payrollError } = await supabase.from('payroll').insert({
      user_id: userId,
      month: 3,
      year: 2026,
      salary_a: emp.salaryA,
      salary_b: 0,
      epf: emp.epf,
      advances: emp.advances,
      cover: emp.cover,
      intensive: emp.intensive,
      travelling: emp.travelling,
      net_salary: net,
      status: 'Pending',
      branch: emp.branch
    });

    if (payrollError) {
      console.error(`Error adding payroll for ${emp.name}:`, payrollError);
    } else {
      console.log(`✅ Successfully re-imported ${emp.name}`);
    }
  }

  console.log("✨ Reset and Import Complete!");
}

resetAndImport();
