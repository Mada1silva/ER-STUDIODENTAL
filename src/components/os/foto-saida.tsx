"use client";

/* eslint-disable @next/next/no-img-element -- fotos vêm do Storage do Supabase (ou da memória, na demonstração) */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { salvarFotoSaida } from "@/lib/os/acoes";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { IconeCamera } from "./icones-trabalho";

type Props = {
  id: string;
  token: string;
  fotoInicial: string | null;
  /** A foto só é tirada quando o trabalho fica pronto. */
  pronto: boolean;
  demo: boolean;
};

/** Reduz a foto no próprio celular antes de enviar (fotos de celular são enormes). */
function reduzir(arquivo: File, maximo = 1600): Promise<Blob> {
  return new Promise((ok, falha) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, maximo / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * k);
      canvas.height = Math.round(img.height * k);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      canvas.toBlob((b) => (b ? ok(b) : falha(new Error("imagem"))), "image/jpeg", 0.85);
    };
    img.onerror = falha;
    img.src = URL.createObjectURL(arquivo);
  });
}

/** Foto da saída: o laboratório fotografa o trabalho antes de embalar; o dentista vê no portal. */
export function FotoSaida({ id, token, fotoInicial, pronto, demo }: Props) {
  const [foto, setFoto] = useState(fotoInicial);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();
  const router = useRouter();

  function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    iniciar(async () => {
      try {
        const blob = await reduzir(arquivo);
        if (demo) {
          setFoto(URL.createObjectURL(blob));
          setAviso("Demonstração: a foto aparece aqui, mas não é salva.");
          return;
        }
        const supabase = criarClienteNavegador();
        const caminho = `${token}/${Date.now()}.jpg`;
        const { error } = await supabase.storage.from("fotos-saida").upload(caminho, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        const url = supabase.storage.from("fotos-saida").getPublicUrl(caminho).data.publicUrl;
        const r = await salvarFotoSaida(id, url);
        if (!r.ok) throw new Error(r.erro);
        setFoto(url);
        setAviso("Foto salva. O dentista já vê no portal.");
        router.refresh();
      } catch {
        setAviso("Não foi possível enviar a foto. Tente de novo.");
      }
    });
  }

  return (
    <section className="rounded-2xl border border-prata-200 bg-white p-6">
      <h2 className="font-serif text-2xl">Foto da saída</h2>
      <p className="text-sm text-grafite-600">Registro de como o trabalho saiu do laboratório. O dentista vê no portal e no link de acompanhamento.</p>
      {foto ? (
        <img src={foto} alt="Foto do trabalho na saída" className="mt-4 aspect-[4/3] w-full rounded-xl object-cover" />
      ) : (
        <div className="mt-4 grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-prata-300 bg-prata-50 p-4 text-center text-sm text-prata-500">
          <div>
            <IconeCamera className="mx-auto mb-2 size-8" />
            {pronto ? "Ainda sem foto. Tire uma antes de embalar." : "A foto é tirada quando o trabalho fica pronto."}
          </div>
        </div>
      )}
      {pronto && (
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-grafite-800 px-4 py-2 text-sm font-medium text-white hover:bg-grafite-700 has-focus-visible:ring-2 has-focus-visible:ring-prata-400">
          <IconeCamera className="size-4" />
          {enviando ? "Enviando…" : foto ? "Trocar foto" : "Tirar ou escolher foto"}
          <input type="file" accept="image/*" capture="environment" className="sr-only" disabled={enviando} onChange={(e) => escolher(e.target.files?.[0])} />
        </label>
      )}
      {aviso && <p role="status" className="mt-2 text-sm text-grafite-600">{aviso}</p>}
    </section>
  );
}
