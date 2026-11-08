"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { criarClienteNavegador } from "@/lib/supabase/client";

export function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(form: FormData) {
    setEnviando(true);
    setErro(null);
    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("senha")),
    });
    setEnviando(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    const voltar = params.get("voltar");
    router.replace(voltar?.startsWith("/") ? voltar : "/painel/os");
    router.refresh();
  }

  return (
    <form action={entrar} className="mt-5 space-y-4">
      <div>
        <label htmlFor="email" className="rotulo">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="campo" />
      </div>
      <div>
        <label htmlFor="senha" className="rotulo">Senha</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" className="campo" />
      </div>
      {erro && <p className="text-sm text-red-700">{erro}</p>}
      <button disabled={enviando} className="w-full rounded-full bg-grafite-800 py-2.5 font-medium text-white hover:bg-grafite-700 disabled:opacity-60">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
