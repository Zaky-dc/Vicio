import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached:
  | ReturnType<typeof createBrowserClient>
  | null
  | undefined = undefined;

export function getMissingSupabaseEnv() {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return missing;
}

export function getSupabaseClient() {
  if (cached !== undefined) return cached;
  if (!supabaseUrl || !supabaseAnonKey) {
    cached = null;
    return cached;
  }

  cached = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return cached;
}

