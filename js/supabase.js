/***********************
 * SUPABASE CONFIG
 ***********************/
const SUPABASE_URL = "https://wakcvzomkmhfzoowogha.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_a9rXEvTaAAnpuaVg_FafMQ_b4EDvmOQ";

export const supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
