function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseUrl() {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export function getSupabaseSecretKey() {
  return required("SUPABASE_SECRET_KEY");
}
