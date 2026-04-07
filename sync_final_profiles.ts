import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const employeeData = [
  {"name":"Dahami Divyanjali","branch":"Borella","joinDate":"2024-06-05","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":1000,"travelling":4550},
  {"name":"Achini Vindya","branch":"Borella","joinDate":"2024-02-22","salaryA":30000,"epf":2400,"advances":0,"cover":0,"intensive":2000,"travelling":3180},
  {"name":"Dilini Sanarathna","branch":"Dehiwela","joinDate":"2026-03-04","salaryA":35000,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":2880},
  {"name":"Chamilka Botheju","branch":"Dematagoda","joinDate":"2002-08-02","salaryA":32000,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0},
  {"name":"A.V.Chamika Sonali","branch":"Dematagoda","joinDate":"2026-01-12","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":3360},
  {"name":"D.A.Dilupa Thamari","branch":"Homagama","joinDate":"2002-09-01","salaryA":29000,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0},
  {"name":"Harsha Thamali","branch":"Homagama","joinDate":"2017-09-01","salaryA":27000,"epf":2400,"advances":28100,"cover":0,"intensive":3500,"travelling":0},
  {"name":"Sachini Nirasha","branch":"Kadawatha","joinDate":"2022-07-01","salaryA":30000,"epf":2400,"advances":0,"cover":0,"intensive":1500,"travelling":0},
  {"name":"Chaseera Sulani","branch":"Kadawatha","joinDate":"2024-03-12","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":500,"travelling":0},
  {"name":"Geethangani Pieris","branch":"Kirbathgoda","joinDate":"2019-01-09","salaryA":30000,"epf":2400,"advances":0,"cover":10000,"intensive":3000,"travelling":3900},
  {"name":"W.K.Eranclathi Perera","branch":"Kirbathgoda","joinDate":"2026-02-03","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":1440},
  {"name":"W.A.Chandima Dilrukishi","branch":"Kottawa","joinDate":"2015-01-06","salaryA":28000,"epf":2400,"advances":0,"cover":0,"intensive":5000,"travelling":0},
  {"name":"Rasika Priyangani","branch":"Kottawa","joinDate":"2017-02-07","salaryA":34000,"epf":2400,"advances":0,"cover":0,"intensive":4000,"travelling":1000},
  {"name":"A.M.N.Sanjana","branch":"Office","joinDate":"1997-03-01","salaryA":29750,"epf":2400,"advances":0,"cover":0,"intensive":8000,"travelling":0},
  {"name":"R.P.Ratnayake","branch":"Office","joinDate":"1992-01-01","salaryA":27500,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":0},
  {"name":"D.M.Nilukshi Kawshalya","branch":"Office","joinDate":"2023-01-13","salaryA":29000,"epf":2400,"advances":0,"cover":0,"intensive":5500,"travelling":4650},
  {"name":"I.S.M.L.W.S.Udumulla","branch":"Office","joinDate":"2023-01-20","salaryA":27000,"epf":0,"advances":0,"cover":0,"intensive":1500,"travelling":2990},
  {"name":"Nadeesha Dilhara","branch":"Office","joinDate":"2022-11-10","salaryA":38000,"epf":2400,"advances":0,"cover":0,"intensive":1500,"travelling":1875},
  {"name":"Nihal Malawana","branch":"Office","joinDate":"2018-05-02","salaryA":33200,"epf":0,"advances":0,"cover":0,"intensive":8000,"travelling":2000},
  {"name":"Syamalie Udumulla","branch":"Office","joinDate":"2023-01-20","salaryA":11000,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":0},
  {"name":"Dulki Isanka","branch":"Office","joinDate":"2024-03-01","salaryA":34500,"epf":0,"advances":0,"cover":0,"intensive":0,"travelling":10780},
  {"name":"R.P.C.S.Rasadini","branch":"Office","joinDate":"2020-03-31","salaryA":30000,"epf":2400,"advances":0,"cover":0,"intensive":2500,"travelling":2210},
  {"name":"Malith Bandaranayake","branch":"Piliyandala","joinDate":"2024-01-01","salaryA":45000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":14400},
  {"name":"K.D.C.Priyangani","branch":"Piliyandala","joinDate":"2017-09-01","salaryA":27000,"epf":2400,"advances":0,"cover":1500,"intensive":1500,"travelling":0},
  {"name":"B.D.A.N.Subodha","branch":"Ragama","joinDate":"2022-04-10","salaryA":31000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":3180},
  {"name":"M.A.Niroshini","branch":"Ragama","joinDate":"2022-11-20","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":1440},
  {"name":"G.D.J.T.Wijendra","branch":"Wattala","joinDate":"2022-11-20","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":0,"travelling":2500},
  {"name":"B.M.M.D.Manikrama","branch":"Wattala","joinDate":"2024-03-31","salaryA":27000,"epf":2400,"advances":0,"cover":0,"intensive":1000,"travelling":2300}
];

async function sync() {
  console.log('Final Profile Sync starting...');
  const { data: profiles } = await supabase.from('profiles').select('id, name');
  
  if (!profiles) return;

  for (const row of employeeData) {
    // Fuzzy match name
    const matches = profiles.filter(p => p.name.toLowerCase().includes(row.name.toLowerCase()) || row.name.toLowerCase().includes(p.name.toLowerCase()));
    
    if (matches.length > 0) {
      const p = matches[0];
      const net = row.salaryA + row.intensive + row.travelling - row.epf - row.advances - row.cover;
      
      const { error } = await supabase.from('profiles').update({
        branch: row.branch,
        join_date: row.joinDate,
        salary_a: row.salaryA,
        epf: row.epf,
        advances: row.advances,
        cover: row.cover,
        intensive: row.intensive,
        travelling: row.travelling,
        net: net,
        salary_b: 0
      }).eq('id', p.id);
      
      if (error) console.error(`Error updating ${row.name}:`, error);
      else console.log(`✅ Fully synced profile for ${p.name}`);
    } else {
      console.warn(`⚠️ No profile found for ${row.name}`);
    }
  }
  console.log('Sync complete!');
}

sync();
