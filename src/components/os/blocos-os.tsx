import Link from "next/link";
import type { OrdemComDentista } from "@/types/database";
import { indiceStatus } from "@/lib/os/constantes";
import { formatarDentes } from "@/lib/os/dentes";
import { caminhoAcompanhar, caminhoCertificado, linkWhatsAppDentista, mensagemAvisoDentista } from "@/lib/os/acompanhamento";
import { IconeWhatsApp } from "@/components/site/icones";
import { Odontograma } from "./odontograma";
import { AmostraCor } from "./icones-trabalho";
import { BotaoCopiar } from "./botao-copiar";

/** Cartão "Dentes" com o odontograma só de leitura e a cor. */
export function BlocoDentes({ ordem }: { ordem: Pick<OrdemComDentista, "dentes" | "elementos" | "cor" | "escala_cor"> }) {
  return (
    <section className="rounded-2xl border border-prata-200 bg-white p-6">
      <h2 className="font-serif text-2xl">Dentes</h2>
      <p className="text-sm text-grafite-600">{ordem.dentes.length ? formatarDentes(ordem.dentes) : (ordem.elementos ?? "Não informado")}</p>
      <div className="mt-3">
        <Odontograma selecionados={ordem.dentes} />
      </div>
      {ordem.cor && (
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-grafite-700">
          <AmostraCor cor={ordem.cor} /> Cor {ordem.cor}
          {ordem.escala_cor && <span className="text-prata-500">({ordem.escala_cor})</span>}
        </p>
      )}
    </section>
  );
}

/** Painel: mensagem pronta para o WhatsApp do dentista, com o link de acompanhamento sem senha. */
export function AvisoDentista({ ordem, urlSite }: { ordem: OrdemComDentista; urlSite: string }) {
  const link = urlSite + caminhoAcompanhar(ordem.token_publico);
  const mensagem = mensagemAvisoDentista(ordem, link);
  const wpp = linkWhatsAppDentista(ordem.dentista?.whatsapp, mensagem);
  const pronto = indiceStatus(ordem.status) >= indiceStatus("finalizado");
  const botao = "rounded-full border border-prata-300 px-4 py-2 text-sm text-grafite-700 hover:bg-prata-50";
  return (
    <section className="rounded-2xl border border-prata-200 bg-white p-6">
      <h2 className="font-serif text-2xl">Avisar o dentista</h2>
      <p className="text-sm text-grafite-600">
        Mensagem pronta para o WhatsApp{ordem.dentista ? ` de ${ordem.dentista.nome}` : ""}, com o link de acompanhamento (abre sem senha).
      </p>
      <p className="mt-3 rounded-xl bg-prata-50 p-3 text-sm whitespace-pre-line text-grafite-700 [overflow-wrap:anywhere]">{mensagem}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {wpp ? (
          <a href={wpp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-medium text-white hover:brightness-110">
            <IconeWhatsApp className="size-4" /> Enviar no WhatsApp
          </a>
        ) : (
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-900">Cadastre o WhatsApp do dentista para enviar direto.</span>
        )}
        <BotaoCopiar texto={link} />
        <Link href={caminhoAcompanhar(ordem.token_publico)} target="_blank" className={botao}>Ver como o dentista vê</Link>
        {pronto && <Link href={caminhoCertificado(ordem.token_publico)} target="_blank" className={botao}>Certificado</Link>}
      </div>
    </section>
  );
}
