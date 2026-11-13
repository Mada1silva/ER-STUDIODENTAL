import Image from "next/image";
import { linkWhatsApp, site } from "@/lib/config/site";
import { IconeEmail, IconeInstagram, IconeLocal, IconeRelogio, IconeWhatsApp } from "@/components/site/icones";

const anosDeExperiencia = new Date().getFullYear() - site.desde;

const diferenciais = [
  {
    titulo: "Fluxo digital CAD/CAM",
    texto: "Recebemos escaneamentos intraorais e planejamos cada peça no computador, com fresagem de alta precisão.",
  },
  {
    titulo: "Estética de alto nível",
    texto: "Lentes de contato, facetas e coroas em E-max e zircônia multicamada, com cerâmica aplicada à mão.",
  },
  {
    titulo: "Reabilitação sobre implantes",
    texto: "Protocolos com barra 100% passiva, coroas sobre implante e próteses totais com dentes de qualidade.",
  },
  {
    titulo: `Prazo de ${site.prazoPadraoDiasUteis} dias úteis`,
    texto: "Cada trabalho é acompanhado etapa por etapa, para você saber exatamente quando vai receber.",
  },
];

const trabalhos = [
  "Coroas em zircônia",
  "Coroas e facetas em E-max",
  "Lentes de contato",
  "Metalocerâmica",
  "Protocolos sobre implante",
  "Coroas sobre implante",
  "Prótese total",
  "PPR",
  "Provisórios",
  "Placas miorrelaxantes",
];

// Fotos herdadas do site antigo. Substituir por casos reais do laboratório.
const galeria = [
  { src: "/img/d1.jpg", alt: "Coroas cerâmicas sobre fundo escuro" },
  { src: "/img/d2.jpg", alt: "Prótese total superior e inferior" },
  { src: "/img/d3.jpg", alt: "Protocolo inferior sobre implantes" },
  { src: "/img/carroussel-3.jpeg", alt: "Coroas sobre implante no modelo" },
  { src: "/img/bgdente3.jpg", alt: "Coroas unitárias" },
  { src: "/img/carroussel-2.jpeg", alt: "Prótese com gengiva artificial" },
];

export default function Inicio() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Image src="/img/d1.jpg" alt="" fill priority className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-grafite-800/40 via-grafite-800/80 to-grafite-800" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-prata-400">
            Laboratório de prótese dentária · desde {site.desde}
          </p>
          <h1 className="texto-prata max-w-3xl font-serif text-5xl leading-[1.05] font-semibold sm:text-7xl">
            Precisão digital, acabamento artesanal.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-prata-300">
            Há {anosDeExperiencia} anos transformando o planejamento do dentista em sorrisos naturais. Atendemos
            clínicas de {site.regiaoAtendida.join(", ")}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={linkWhatsApp("Olá! Sou dentista e gostaria de enviar um trabalho para o laboratório.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-medium text-white transition hover:brightness-110"
            >
              <IconeWhatsApp /> Enviar um trabalho
            </a>
            <a
              href="#diferenciais"
              className="inline-flex items-center justify-center rounded-full border border-prata-500/50 px-6 py-3 font-medium text-prata-100 transition hover:border-prata-200"
            >
              Conheça o laboratório
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-20 border-t border-white/5 bg-grafite-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">O Studio</h2>
            <p className="mt-6 leading-relaxed text-prata-300">
              Com mais de {anosDeExperiencia - 1} anos de dedicação à arte da prótese dentária, {site.responsavelTecnico}{" "}
              fundou seu studio focado na excelência técnica. A trajetória une a precisão do fluxo digital ao
              refinamento do trabalho artesanal, para entregar próteses com naturalidade e exclusividade.
            </p>
            <p className="mt-4 leading-relaxed text-prata-300">
              Ceramista dental e professor de prótese, Edmar acompanha pessoalmente cada caso, do recebimento ao
              acabamento.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                [site.desde, "fundação"],
                [`${anosDeExperiencia}+`, "anos de prática"],
                [`${site.prazoPadraoDiasUteis} dias`, "prazo padrão"],
              ].map(([n, r]) => (
                <div key={r} className="rounded-xl border border-white/5 bg-grafite-800 p-4">
                  <dt className="font-serif text-3xl text-prata-100">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-prata-500">{r}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image src="/img/carroussel-3.jpeg" alt="Trabalho sobre implantes no modelo" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">Diferenciais técnicos</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map((d) => (
              <article key={d.titulo} className="rounded-2xl border border-white/5 bg-grafite-900 p-6">
                <div className="mb-4 h-px w-10 bg-prata-400" />
                <h3 className="font-serif text-2xl text-prata-100">{d.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-prata-400">{d.texto}</p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="text-sm uppercase tracking-[0.3em] text-prata-500">Trabalhos que realizamos</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {trabalhos.map((t) => (
                <li key={t} className="rounded-full border border-prata-500/30 px-4 py-1.5 text-sm text-prata-300">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="scroll-mt-20 border-t border-white/5 bg-grafite-900">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">Galeria de casos</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {galeria.map((f) => (
              <div key={f.src} className="relative aspect-square overflow-hidden rounded-xl bg-grafite-800">
                <Image src={f.src} alt={f.alt} fill className="object-cover transition duration-500 hover:scale-105" sizes="(min-width: 768px) 33vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">Vamos trabalhar juntos?</h2>
            <p className="mt-4 text-prata-300">
              Fale direto com o laboratório para enviar um caso, tirar dúvidas técnicas ou pedir a tabela de preços.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={linkWhatsApp("Olá! Gostaria de receber a tabela de preços do laboratório.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-medium text-white transition hover:brightness-110"
            >
              <IconeWhatsApp /> Chamar no WhatsApp
            </a>
            <a href="/precos" className="inline-flex items-center rounded-full border border-prata-500/50 px-6 py-3 font-medium text-prata-100 transition hover:border-prata-200">
              Ver tabela de preços
            </a>
            </div>
          </div>
          <ul className="space-y-4 text-prata-300">
            <li className="flex gap-3"><IconeWhatsApp className="size-5 shrink-0 text-prata-500" /> {site.telefone}</li>
            <li className="flex gap-3"><IconeEmail className="size-5 shrink-0 text-prata-500" /> <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li className="flex gap-3"><IconeInstagram className="size-5 shrink-0 text-prata-500" /> <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">@{site.instagram}</a></li>
            <li className="flex gap-3"><IconeRelogio className="size-5 shrink-0 text-prata-500" /> {site.horario}</li>
            <li className="flex gap-3"><IconeLocal className="size-5 shrink-0 text-prata-500" /> {site.localizacao} · atendemos {site.regiaoAtendida.join(", ")}</li>
          </ul>
        </div>
      </section>
    </>
  );
}
