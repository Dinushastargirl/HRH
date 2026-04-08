import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const adminAccounts = [
  { email: 'super@hrpulse.com', password: 'super@1234', role: 'super', name: 'Super Admin' },
  { email: 'owner@hrpulse.com', password: 'owner@4321', role: 'owner', name: 'Executive Owner' },
  { email: 'hr@hrpulse.com', password: 'hrpulse@4321', role: 'hr', name: 'HR Manager' }
];

async function setupAdmins() {
  console.log("🚀 Starting Administrative Setup...");

  // 1. Remove jayaminda.dev@vork.global
  const oldEmail = 'jayaminda.dev@vork.global';
  const { data: { users: currentUsers } } = await supabase.auth.admin.listUsers();
  const oldUser = currentUsers.find(u => u.email === oldEmail);
  
  if (oldUser) {
    console.log(`🧹 Removing ${oldEmail}...`);
    await supabase.from('profiles').delete().eq('id', oldUser.id);
    await supabase.auth.admin.deleteUser(oldUser.id);
  }

  // 2. Setup 3 Admin Accounts
  for (const adm of adminAccounts) {
    console.log(`🏗️ Setting up ${adm.email}...`);
    let userId: string;
    const existing = currentUsers.find(u => u.email === adm.email);

    if (existing) {
      userId = existing.id;
      await supabase.auth.admin.updateUserById(userId, { password: adm.password });
    } else {
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: adm.email,
        password: adm.password,
        email_confirm: true,
        user_metadata: { name: adm.name, role: adm.role }
      });
      if (error) {
        console.error(`Failed to create ${adm.email}:`, error);
        continue;
      }
      userId = newUser.user.id;
    }

    // Upsert Profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      name: adm.name,
      email: adm.email,
      username: adm.role,
      role: adm.role,
      branch: 'SUPER',
      status: 'Available'
    });

    if (profileError) {
      console.error(`Failed to update profile for ${adm.email}:`, profileError);
    } else {
      console.log(`✅ ${adm.name} configured.`);
    }

    // Ensure they have a March 2026 Payroll Record (0 values but visible)
    await supabase.from('payroll').upsert({
      user_id: userId,
      month: 3,
      year: 2026,
      salary_a: 0,
      salary_b: 0,
      epf: 0,
      advances: 0,
      cover: 0,
      intensive: 0,
      travelling: 0,
      net_salary: 0,
      status: 'Pending',
      branch: 'Office'
    }, { onConflict: 'user_id, month, year' });
  }

  console.log("✨ Administrative Setup Complete!");
}

setupAdmins();
