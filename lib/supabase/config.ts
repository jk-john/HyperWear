const nodeEnv = process.env.NODE_ENV;

export const SUPABASE_PROJECT_REF = "jhxxuhisdypknlvhaklm";
export const SUPABASE_PROJECT_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

export function getSupabaseAuthUrl(): string {
  const customAuthUrl = process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL;
  if (customAuthUrl) {
    return customAuthUrl;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return supabaseUrl;
  }
  if (nodeEnv === "development") {
    return SUPABASE_PROJECT_URL;
  }
  throw new Error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_AUTH_URL is not set");
}

export function getSupabaseStorageUrl(): string {
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
  if (storageUrl) {
    return storageUrl;
  }
  return SUPABASE_PROJECT_URL;
}

export function getSupabaseAnonKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  return anonKey;
}

export function getSupabaseServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return serviceRoleKey;
}
