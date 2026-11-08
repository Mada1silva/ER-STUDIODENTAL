import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/site/logo";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { FormularioLogin } from "./formulario-login";

export const metadata = { title: "Entrar" };

export default function Login() {
  return (
    <div className="grid min-h-dvh place-items-center bg-grafite-800 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center"><Logo /></div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h1 className="font-serif text-3xl font-semibold">Entrar</h1>
          {supabaseConfigurado ? (
            <Suspense>
              <FormularioLogin />
            </Suspense>
          ) : (
            <p className="mt-3 text-sm text-grafite-600">
              O login ainda não está ativo (modo demonstração). <Link href="/painel/os" className="font-medium underline">Abrir o painel de exemplo</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
