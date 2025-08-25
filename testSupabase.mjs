import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL Supabase:", supabaseUrl);
console.log("Service Role Key length:", supabaseServiceRoleKey?.length); // útil para depurar

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function testSupabase() {
  console.log("\n🔍 Iniciando test de conexión Supabase con Service Role Key...\n");

  const { data, error } = await supabase.from('usuarios').select('*');

  if (error) {
    console.error("❌ Error en Supabase:", error.message);
  } else {
    console.log("✅ Datos recibidos:");
    console.table(data);
  }

  console.log("\n🧪 Test de conexión Supabase finalizado.\n");
}

testSupabase();
