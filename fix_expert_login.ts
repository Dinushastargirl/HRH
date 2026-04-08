import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function fixLogin() {
  const email = 'jayaminda.dev@vork.global';
  const password = 'admin123';

  console.log(`🚀 Fixing login for ${email}...`);

  // 1. Get/Create Auth User
  const { data: { users } } = await supabase.auth.admin.listUsers();
  let user = (users as any[]).find(u => u.email === email);

  if (!user) {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Jayaminda', role: 'super' }
    });
    if (createError) throw createError;
    user = newUser.user;
    console.log("✅ Auth user created.");
  } else {
    // Ensure password matches the provided one
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password });
    if (updateError) throw updateError;
    console.log("✅ Auth password synchronized.");
  }

  // 2. Upsert Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user!.id,
    name: 'Jayaminda',
    email: email,
    username: 'jayaminda',
    role: 'super',
    branch: 'SUPER',
    department: 'DevOps',
    status: 'Available'
  });

  if (profileError) {
    console.error("❌ Profile Error:", profileError);
  } else {
    console.log("✅ Super Admin Profile created.");
  }

  console.log("✨ Done! You should be able to log in now.");
}

fixLogin();
