"use client";

import { ARCADA_INFERIOR, ARCADA_SUPERIOR, formatarDentes, larguraDente } from "@/lib/os/dentes";

type Props = {
  selecionados: number[];
  /** Se vier, o desenho fica clicável (formulários). Sem ele, é só leitura (detalhe da OS). */
  aoAlternar?: (dente: number) => void;
  className?: string;
};

const CX = 170;
const A = 128;
const B = 120;

function ponto(t: number, cy: number, sup: boolean, r = 0): [number, number] {
  return [CX + (A + r) * Math.cos(t), sup ? cy - (B + r) * Math.sin(t) : cy + (B + r) * Math.sin(t)];
}

/** Odontograma em forma de arcada, com numeração FDI. Vista de frente (D = direito do paciente). */
export function Odontograma({ selecionados, aoAlternar, className = "" }: Props) {
  const sel = new Set(selecionados);
  const editavel = Boolean(aoAlternar);

  const arco = (dentes: number[], cy: number, sup: boolean) => {
    const pesos = dentes.map(larguraDente);
    const total = pesos.reduce((x, y) => x + y, 0);
    const gengiva: string[] = [];
    for (let g = 6; g <= 174; g += 4) gengiva.push(ponto(Math.PI - (g * Math.PI) / 180, cy, sup).map((v) => v.toFixed(1)).join(","));
    let acc = 0;
    return (
      <g>
        <polyline points={gengiva.join(" ")} className="gengiva" />
        {dentes.map((d, k) => {
          const meio = acc + pesos[k] / 2;
          acc += pesos[k];
          const t = Math.PI - ((8 + (164 * meio) / total) * Math.PI) / 180;
          const [x, y] = ponto(t, cy, sup);
          const [lx, ly] = ponto(t, cy, sup, 25);
          const ang = (Math.atan2(sup ? -B * Math.cos(t) : B * Math.cos(t), -A * Math.sin(t)) * 180) / Math.PI;
          const ligado = sel.has(d);
          const alternar = () => aoAlternar?.(d);
          return (
            <g
              key={d}
              className={`dente${ligado ? " sel" : ""}`}
              aria-label={`Dente ${d}`}
              {...(editavel
                ? {
                    role: "checkbox",
                    tabIndex: 0,
                    "aria-checked": ligado,
                    onClick: alternar,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        alternar();
                      }
                    },
                  }
                : {})}
            >
              <ellipse
                cx={x.toFixed(1)}
                cy={y.toFixed(1)}
                rx={(7.4 * pesos[k]).toFixed(1)}
                ry={pesos[k] > 1 ? 12 : 10.5}
                transform={`rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`}
              />
              <text x={lx.toFixed(1)} y={ly.toFixed(1)}>
                {d}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 340 372"
      className={`odonto mx-auto block w-full max-w-sm ${className}`}
      data-editavel={editavel || undefined}
      role={editavel ? "group" : "img"}
      aria-label={`Odontograma${sel.size ? `: ${formatarDentes([...sel])}` : ""}`}
    >
      {arco(ARCADA_SUPERIOR, 160, true)}
      {arco(ARCADA_INFERIOR, 212, false)}
      <text x="170" y="112" className="rotulo-arco">SUPERIOR</text>
      <text x="170" y="266" className="rotulo-arco">INFERIOR</text>
      <line x1="58" x2="282" y1="186" y2="186" className="linha-media" />
      <text x="30" y="186" className="lado">D</text>
      <text x="310" y="186" className="lado">E</text>
    </svg>
  );
}
