import type { TipoTrabalho } from "@/types/database";
import { TOM_COR } from "@/lib/os/itens";

const DENTE = "M14 10c4-3 8-3 10-1 2-2 6-2 10 1 4 3 4 10 2 15-1.5 4-2 9-3.5 13-1 2.5-3.5 2.5-4-.5l-1.2-6c-.5-2.4-3.1-2.4-3.6 0l-1.2 6c-.5 3-3 3-4 .5C17 34 16.5 29 15 25c-2-5-2-12-1-15z";
const COROA_IMPLANTE = "M15 7c3-2 6-2 9 0 3-2 6-2 9 0 2.5 3 2.5 8 0 11H15c-2.5-3-2.5-8 0-11z";

const DESENHOS: Record<TipoTrabalho, React.ReactNode> = {
  coroa_zirconia: (
    <>
      <path d={DENTE} />
      <path d="M16.5 17h15M16 21h16" opacity=".45" />
    </>
  ),
  coroa_emax: (
    <>
      <path d={DENTE} />
      <path d="M19 14.5c1.6-1.2 3.6-1.3 5-.4" strokeWidth="2" />
    </>
  ),
  faceta_lente: (
    <>
      <path d="M16 8h16c1.2 8 1 18-2 29-.8 2.4-3 3-6 3s-5.2-.6-6-3c-3-11-3.2-21-2-29z" />
      <path d="M19.5 11c-.4 8 0 17 2.5 25" opacity=".45" />
    </>
  ),
  metalo_ceramica: (
    <>
      <path d={DENTE} />
      <path d="M19 13.5h10l-1.2 11.5h-7.6z" strokeDasharray="2 1.6" />
    </>
  ),
  protese_total: (
    <>
      <path d="M6 33c0-13 8-23 18-23s18 10 18 23" />
      <path d="M12.5 33c0-9 5-16 11.5-16s11.5 7 11.5 16" />
      <g opacity=".55">
        {[[9, 27], [12, 20.5], [16.5, 15.5], [24, 13.3], [31.5, 15.5], [36, 20.5], [39, 27]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
        ))}
      </g>
    </>
  ),
  ppr: (
    <>
      <path d="M8 34c0-12 7-21 16-21s16 9 16 21" />
      <path d="M13 32c3 3.5 19 3.5 22 0" strokeWidth="2.2" />
      <path d="M9.5 24.5c2-.4 3.6.8 3.8 3M38.5 24.5c-2-.4-3.6.8-3.8 3" />
    </>
  ),
  protocolo_implante: (
    <>
      <path d="M7 29c0-12 8-20 17-20s17 8 17 20" />
      <path d="M13 29c0-8 5-14 11-14s11 6 11 14" />
      <path d="M12 32v8M20 31v9M28 31v9M36 32v8" />
      <path d="M10.5 35h3M18.5 35h3M26.5 35h3M34.5 35h3" opacity=".5" />
    </>
  ),
  coroa_sobre_implante: (
    <>
      <path d={COROA_IMPLANTE} />
      <path d="M21 18h6v4h-6z" />
      <path d="M22 22h4v15l-2 3-2-3z" />
      <path d="M20.5 26h7M20.5 30h7M20.5 34h7" opacity=".55" />
    </>
  ),
  provisorio: <path d={DENTE} strokeDasharray="3 2.2" />,
  placa_miorrelaxante: (
    <>
      <path d="M7 33c0-14 7.5-23 17-23s17 9 17 23h-6.5c0-9.5-4.4-16-10.5-16s-10.5 6.5-10.5 16z" />
      <path d="M13 30c0-6 2-10 4-12" opacity=".4" />
    </>
  ),
  outro: (
    <>
      <circle cx="24" cy="24" r="14" />
      <path d="M24 17v14M17 24h14" />
    </>
  ),
};

/** Ícone de linha de cada tipo de trabalho (biblioteca visual). */
export function IconeTrabalho({ tipo, className }: { tipo: TipoTrabalho; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {DESENHOS[tipo] ?? DESENHOS.outro}
    </svg>
  );
}

const DENTE_PEQUENO =
  "M3 3c2-2 5-2 7 0 2-2 5-2 7 0 2 3 1 7 0 10-.8 3-1 6-2.2 9-.6 1.5-2 1.5-2.4-.2L11.6 17c-.4-1.4-2.8-1.4-3.2 0l-.8 4.8c-.4 1.7-1.8 1.7-2.4.2C4 19 3.8 16 3 13 2 10 1 6 3 3z";

/** Dentinho pintado no tom aproximado da cor (Vita Classical). */
export function AmostraCor({ cor, className = "h-7 w-6" }: { cor: string; className?: string }) {
  return (
    <svg viewBox="0 0 20 24" className={className} aria-hidden="true">
      <path d={DENTE_PEQUENO} fill={TOM_COR[cor] ?? "#eeeeec"} stroke="#00000030" />
    </svg>
  );
}

export const IconeCamera = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
