import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function confirmAllUsers() {
  console.log('Fetching users to confirm...');
  
  // 1. List all users from Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  console.log(`Found ${users.length} users. Confirming...`);

  for (const user of users) {
    if (user.email_confirmed_at) {
      console.log(`- ${user.email} is already confirmed.`);
      continue;
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error(`- Error confirming ${user.email}:`, updateError.message);
    } else {
      console.log(`✅ ${user.email} confirmed successfully!`);
    }
  }

  console.log('Task complete!');
}

confirmAllUsers();
