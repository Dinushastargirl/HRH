import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fix() {
  console.log('Synchronizing profile Net Salary values...');
  const { data: profiles } = await supabase.from('profiles').select('*');
  
  if (!profiles) return;

  for (const p of profiles) {
    const salaryA = Number(p.salary_a) || 0;
    const epf = Number(p.name === 'Dilini Sanarathna' || p.name === 'R.P. Ratnayake' || p.name === 'Nihal Malawana' || p.name === 'Syamalie Udumulla' ? 0 : 2400); 
    const advances = Number(p.advances) || 0;
    const cover = Number(p.cover) || 0;
    const intensive = Number(p.intensive) || 0;
    const travelling = Number(p.travelling) || 0;

    const net = salaryA - epf - advances - cover + intensive + travelling;

    await supabase.from('profiles').update({
      net: net,
      epf: epf,
      salary_b: 0
    }).eq('id', p.id);
    
    console.log(`✅ Updated ${p.name}: Net = ${net}`);
  }
  console.log('Update complete!');
}

fix();
