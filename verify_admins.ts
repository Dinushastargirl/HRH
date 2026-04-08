import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function verify() {
  console.log("🔍 Final Verification Check...");

  const emails = ['super@hrpulse.com', 'owner@hrpulse.com', 'hr@hrpulse.com'];
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('email, role, name')
    .in('email', emails);

  if (error) {
    console.error("Error fetching profiles:", error);
    return;
  }

  console.log("Active Admin Profiles:");
  profiles?.forEach(p => console.log(`- ${p.name} (${p.email}) as ${p.role}`));

  if (profiles?.length === 3) {
    console.log("✅ All 3 Administrative accounts are successfully configured and ready.");
  } else {
    console.log(`⚠️ Warning: Only ${profiles?.length || 0}/3 accounts found.`);
  }
}

verify();
