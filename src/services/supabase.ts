import { createClient } from '@supabase/supabase-js';
//! diz para o código que garante que a variável será preenchida
const supabaseUrl =process.env.EXPO_PUBLIC_SUPABASE_URL! ;
const supabaseKey =process.env.EXPO_PUBLIC_SUPABASE_KEY!;

console.log("URL EXPO:", supabaseUrl);
//criando a conexão e exportando
export const supabase = createClient(supabaseUrl, supabaseKey);
