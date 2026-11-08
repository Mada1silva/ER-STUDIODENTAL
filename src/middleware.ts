import type { NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  // Roda só nas áreas que precisam de login (o site público fica mais leve).
  matcher: ["/painel/:path*", "/portal/:path*", "/login"],
};
