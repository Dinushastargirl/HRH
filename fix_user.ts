import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fix() {
  const email = 'erandi.perera@hrpulse.com';
  const password = 'erandi123';

  console.log(`Checking for ${email}...`);
  const { data: authData } = await supabase.auth.admin.listUsers();
  const user = authData.users.find(u => u.email === email);

  if (user) {
    console.log(`User found (ID: ${user.id}). Updating password...`);
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true
    });
    if (error) console.error('Error:', error);
    else console.log('Successfully updated password to erandi123');
  } else {
    console.log('User not found in Auth. Creating...');
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'W.K. Erandi Perera', role: 'employee' }
    });
    if (error) console.error('Error:', error);
    else console.log('Successfully created user.');
  }

  // Also check profile
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
  if (!profile) {
    console.log('Profile missing. Creating...');
    const authId = user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id;
    if (authId) {
      await supabase.from('profiles').insert({
          id: authId,
          name: 'W.K. Erandi Perera',
          email,
          username: 'erandi.perera',
          role: 'employee',
          branch: 'Kiribathgoda',
          join_date: '2026-02-03',
          salary_a: 27000,
          epf: 2400,
          advances: 0,
          cover: 0,
          intensive: 0,
          travelling: 1440,
          net: 26040,
          status: 'Available'
      });
      console.log('Profile created.');
    }
  }
}

fix();
