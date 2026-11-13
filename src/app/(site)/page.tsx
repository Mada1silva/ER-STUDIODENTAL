import Image from "next/image";
import Link from "next/link";
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
  { src: "/img/d1.jpg", alt: "Coroas cerâmicas", detalhe: "E-max estratificado" },
  { src: "/img/d2.jpg", alt: "Prótese total", detalhe: "Gengiva caracterizada" },
  { src: "/img/d3.jpg", alt: "Protocolo inferior", detalhe: "Sobre implantes" },
  { src: "/img/carroussel-3.jpeg", alt: "Coroas sobre implante", detalhe: "Conferidas no modelo" },
  { src: "/img/bgdente3.jpg", alt: "Coroas unitárias", detalhe: "Zircônia multicamada" },
  { src: "/img/carroussel-2.jpeg", alt: "Prótese com gengiva artificial", detalhe: "Acabamento artesanal" },
];

/** Recursos do Portal do Dentista (o que nenhum laboratório da região oferece junto). */
const recursos: { titulo: string; texto: string; icone: React.ReactNode }[] = [
  {
    titulo: "Acompanhamento por cores",
    texto: "Do “Chegou” ao “Entregue”, você vê em que etapa está cada trabalho, com data e hora. Sem precisar ligar.",
    icone: <><circle cx="6" cy="12" r="2.5" /><circle cx="12" cy="12" r="2.5" /><circle cx="18" cy="12" r="2.5" /></>,
  },
  {
    titulo: "Aviso no WhatsApp",
    texto: "Quando fica pronto e quando sai para entrega, você recebe uma mensagem com um link de acompanhamento. Sem senha.",
    icone: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 10h8" /></>,
  },
  {
    titulo: "Foto do trabalho na saída",
    texto: "Cada peça é fotografada antes de sair do laboratório. Você vê a foto no portal, antes mesmo de receber.",
    icone: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  },
  {
    titulo: "Conferência na chegada",
    texto: "Moldagem, mordida, análogo, componentes: conferimos item por item e avisamos na hora se faltar algo.",
    icone: <><path d="M9 5h10M9 12h10M9 19h10" /><path d="m3.5 5 1.5 1.5L7.5 4M3.5 12l1.5 1.5 2.5-2.5" /><path d="M4 18l3 3M7 18l-3 3" /></>,
  },
  {
    titulo: "Pedido com odontograma",
    texto: "No portal, você marca os dentes no desenho da boca e escolhe o trabalho, o material e a cor.",
    icone: <path d="M7 4c2-1.5 3.5-1 5 0 1.5-1 3-1.5 5 0 2 2 1.5 5 .5 8-.7 2-1 5-2 7.5-.6 1.2-2 1.2-2.3-.2L13 15c-.3-1-1.7-1-2 0l-1.2 4.3c-.3 1.4-1.7 1.4-2.3.2C6.5 17 6.2 14 5.5 12c-1-3-1.5-6 1.5-8z" />,
  },
  {
    titulo: "Certificado com QR code",
    texto: "Cada trabalho acompanha um certificado de autenticidade assinado, com o histórico completo.",
    icone: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>,
  },
];

/**
 * Depoimentos: SÓ entram depoimentos reais, com nome e autorização de cada dentista.
 * Enquanto a lista estiver vazia, a seção não aparece no site.
 * Exemplo: { texto: "…", nome: "Dra. Fulana", clinica: "Clínica X · Brasília" }
 */
const depoimentos: { texto: string; nome: string; clinica: string }[] = [];

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

      {/* PARA O DENTISTA */}
      <section id="tecnologia" className="scroll-mt-20 border-t border-white/5 bg-grafite-950">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-xs tracking-[0.4em] text-prata-500 uppercase">Exclusivo para dentistas parceiros</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">Você sabe onde está o seu trabalho. Sempre.</h2>
          <p className="mt-4 max-w-2xl text-prata-300">Um portal feito para o consultório: menos ligações, nenhum trabalho perdido e tudo registrado do recebimento à entrega.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recursos.map((r) => (
              <article key={r.titulo} className="rounded-2xl border border-white/5 bg-grafite-900 p-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7 text-prata-300" aria-hidden="true">
                  {r.icone}
                </svg>
                <h3 className="mt-4 font-serif text-2xl text-prata-100">{r.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-prata-400">{r.texto}</p>
              </article>
            ))}
          </div>
          <Link href="/portal" className="mt-8 inline-flex items-center rounded-full bg-prata-100 px-6 py-3 font-medium text-grafite-900 transition hover:bg-white">
            Entrar no Portal do Dentista
          </Link>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="scroll-mt-20 border-t border-white/5 bg-grafite-900">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">Casos realizados</h2>
          <p className="mt-3 text-prata-400">Trabalhos feitos aqui no laboratório.</p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {galeria.map((f) => (
              <figure key={f.src} className="group relative aspect-square overflow-hidden rounded-xl bg-grafite-800">
                <Image src={f.src} alt={f.alt} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 50vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                  <p className="font-serif text-lg leading-tight text-white">{f.alt}</p>
                  <p className="text-xs text-prata-300">{f.detalhe}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS (só aparece quando houver depoimentos reais) */}
      {depoimentos.length > 0 && (
        <section id="depoimentos" className="scroll-mt-20 border-t border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="font-serif text-4xl font-semibold text-prata-100 sm:text-5xl">O que dizem os dentistas parceiros</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {depoimentos.map((d) => (
                <figure key={d.nome} className="flex flex-col rounded-2xl border border-white/5 bg-grafite-900 p-6">
                  <span className="font-serif text-6xl leading-none text-prata-500" aria-hidden="true">“</span>
                  <blockquote className="-mt-4 flex-1 font-serif text-xl leading-snug text-prata-300 italic">{d.texto}</blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="block text-prata-200">{d.nome}</span>
                    <span className="text-prata-500">{d.clinica}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

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
