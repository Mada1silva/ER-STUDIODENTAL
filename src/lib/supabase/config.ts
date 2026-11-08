/** O Supabase só é usado quando as variáveis de ambiente estão preenchidas. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigurado =
  supabaseUrl.startsWith("https://") && !supabaseUrl.includes("SEU-PROJETO") && supabaseAnonKey.length > 20;
