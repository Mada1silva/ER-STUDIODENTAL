"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

/** Cliente do Supabase para componentes que rodam no navegador. */
export function criarClienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
