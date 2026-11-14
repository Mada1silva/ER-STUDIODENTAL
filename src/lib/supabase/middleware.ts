import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from "./config";

/** Renova a sessão do Supabase e protege as áreas restritas (/painel, /portal e /tv). */
export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseConfigurado) return response; // modo demonstração: sem login

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const areaRestrita = pathname.startsWith("/painel") || pathname.startsWith("/portal") || pathname === "/tv";
  if (!user && areaRestrita) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("voltar", pathname);
    return NextResponse.redirect(url);
  }
  return response;
}
