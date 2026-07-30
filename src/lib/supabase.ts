import { createBrowserClient } from "@supabase/ssr";

function assertEnv(val: string | undefined, name: string): asserts val is string {
  if (!val) throw new Error(`Missing ${name} — add it to .env.local`);
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  assertEnv(url, "NEXT_PUBLIC_SUPABASE_URL");
  assertEnv(key, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createBrowserClient(url, key);
}
