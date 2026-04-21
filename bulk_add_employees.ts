import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

// Create Admin Client (Service Role Key bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const employees = [
  { name: "Dahami Divyanjali", email: "dahami.divyanjali@hrpulse.com" },
  { name: "Achini Vindya", email: "achini.vindya@hrpulse.com" },
  // ... (omitting lines for clarity in chunk, wait I should use AllowMultiple or specific lines)

  { name: "Dilini Sanarathna", email: "dilini.sanarathna@hrpulse.com", password: "dilini123" },
  { name: "Chamilka Botheju", email: "chamilka.botheju@hrpulse.com", password: "chamilka123" },
  { name: "A.V. Chamika Sonali", email: "chamika.sonali@hrpulse.com", password: "chamika123" },
  { name: "D.A. Dilupa Thamari", email: "dilupa.thamari@hrpulse.com", password: "dilupa123" },
  { name: "Harsha Thamali", email: "harsha.thamali@hrpulse.com", password: "harsha123" },
  { name: "Sachini Nirasha", email: "sachini.nirasha@hrpulse.com", password: "sachini123" },
  { name: "Chaseera Sulani", email: "chaseera.sulani@hrpulse.com", password: "chaseera123" },
  { name: "Geethangani Pieris", email: "geethangani.pieris@hrpulse.com", password: "geethangani123" },
  { name: "W.K. Erandi Perera", email: "erandi.perera@hrpulse.com", password: "erandi123" },
  { name: "W.A. Chandima Dilrukishi", email: "chandima.dilrukishi@hrpulse.com", password: "chandima123" },
  { name: "Rasika Priyangani", email: "rasika.priyangani@hrpulse.com", password: "rasika123" },
  { name: "A.M.N. Sanjana", email: "am n.sanjana@hrpulse.com", password: "amn123" },
  { name: "R.P. Ratnayake", email: "rp.ratnayake@hrpulse.com", password: "rp123" },
  { name: "Nihal Malawana", email: "nihal.malawana@hrpulse.com", password: "nihal123" },
  { name: "Syamalie Udumulla", email: "syamalie.udumulla@hrpulse.com", password: "syamalie123" },
  { name: "Nishanthi Kuruppu", email: "nishanthi.kuruppu@hrpulse.com", password: "nishanthi123" },
  { name: "Nadeesha Dilhara", email: "nadeesha.dilhara@hrpulse.com", password: "nadeesha123" },
  { name: "Chathurika Madushani", email: "chathurika.madushani@hrpulse.com", password: "chathurika123" },
  { name: "Maneesha H. Dias", email: "maneesha.dias@hrpulse.com", password: "maneesha123" },
  { name: "Imashi Pramodaya", email: "imashi.pramodaya@hrpulse.com", password: "imashi123" },
  { name: "Aruni Indrachapa", email: "aruni.indrachapa@hrpulse.com", password: "aruni123" },
  { name: "Tharushi Sadurnin", email: "tharushi.sadurnin@hrpulse.com", password: "tharushi123" },
  { name: "Lakshika Perera", email: "lakshika.perera@hrpulse.com", password: "lakshika123" },
  { name: "Tharushi Apsara", email: "tharushi.apsara@hrpulse.com", password: "tharushi123" },
  { name: "D.M. Nilukshi Kawshalya", email: "nilukshi.kawshalya@hrpulse.com", password: "nilukshi123" },
  { name: "Dulki Isanka", email: "dulki.isanka@hrpulse.com", password: "dulki123" }
];

async function seed() {
  console.log(`Starting bulk upload for ${employees.length} employees...`);

  for (const emp of employees) {
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: emp.email,
        password: emp.password,
        email_confirm: true,
        user_metadata: { name: emp.name }
      });

      if (authError) {
        console.error(`- Error creating auth for ${emp.name}:`, authError.message);
        continue;
      }

      const uid = authData.user.id;
      const username = emp.email.split('@')[0].replace(/\./g, '_');

      // 2. Create Profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: uid,
        name: emp.name,
        email: emp.email,
        username: username,
        role: 'employee',
        status: 'Available',
        must_reset_password: false // We provided their initial passwords
      });

      if (profileError) {
        console.error(`- Error creating profile for ${emp.name}:`, profileError.message);
      } else {
        console.log(`✅ Created: ${emp.name} (${emp.email})`);
      }
    } catch (err) {
      console.error(`- Unexpected error for ${emp.name}:`, err);
    }
  }

  console.log('Bulk upload complete!');
}

seed();
