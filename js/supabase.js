/***********************
 * SUPABASE CONFIG
 ***********************/
const SUPABASE_URL = "https://hdbexurspbzsjdkgwsof.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TlzrDNsl4k-et9cRq4MrTA_HaK1q_eL";

export const supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
