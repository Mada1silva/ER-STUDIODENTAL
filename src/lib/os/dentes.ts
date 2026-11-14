import { normalizar } from "./constantes";

/**
 * Odontograma com a numeração FDI.
 * Vista de frente: o lado direito do paciente fica à esquerda de quem olha.
 */
export const ARCADA_SUPERIOR = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const ARCADA_INFERIOR = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const TODOS = new Set([...ARCADA_SUPERIOR, ...ARCADA_INFERIOR]);

/** Largura relativa do dente no desenho (molares maiores, incisivos laterais menores). */
export function larguraDente(dente: number) {
  const u = dente % 10;
  return u >= 6 ? 1.3 : u >= 4 ? 1 : u === 3 ? 0.95 : u === 2 ? 0.8 : 0.9;
}

/** "11, 21", "13 a 23", "Arcada superior", "Superior e inferior" -> lista de dentes. */
export function parseElementos(texto: string | null | undefined): number[] {
  const t = normalizar(texto ?? "").trim();
  if (!t) return [];
  if (t.includes("superior e inferior") || t.includes("ambas")) return [...ARCADA_SUPERIOR, ...ARCADA_INFERIOR];
  if (t.includes("arcada superior") || t === "superior") return [...ARCADA_SUPERIOR];
  if (t.includes("arcada inferior") || t === "inferior") return [...ARCADA_INFERIOR];

  const lista: number[] = [];
  for (const parte of t.split(/,|;|\se\s/)) {
    const faixa = parte.match(/(\d{2})\s*(?:a|-|ate)\s*(\d{2})/);
    if (faixa) {
      const a = Number(faixa[1]);
      const b = Number(faixa[2]);
      const arco = ARCADA_SUPERIOR.includes(a) ? ARCADA_SUPERIOR : ARCADA_INFERIOR;
      let i = arco.indexOf(a);
      let j = arco.indexOf(b);
      if (i > j) [i, j] = [j, i];
      if (i >= 0 && j >= 0) lista.push(...arco.slice(i, j + 1));
    } else {
      for (const n of parte.match(/\d{2}/g) ?? []) if (TODOS.has(Number(n))) lista.push(Number(n));
    }
  }
  return [...new Set(lista)];
}

/** Lista de dentes -> texto curto ("11, 21", "13 a 23", "Arcada superior"). */
export function formatarDentes(lista: number[]): string {
  const s = new Set(lista);
  const completo = (arco: number[]) => arco.every((d) => s.has(d));
  if (completo(ARCADA_SUPERIOR) && completo(ARCADA_INFERIOR)) return "Superior e inferior";

  const partes: string[] = [];
  for (const arco of [ARCADA_SUPERIOR, ARCADA_INFERIOR]) {
    if (completo(arco)) {
      partes.push(arco === ARCADA_SUPERIOR ? "Arcada superior" : "Arcada inferior");
      continue;
    }
    let seq: number[] = [];
    const fecha = () => {
      if (seq.length >= 3) partes.push(`${seq[0]} a ${seq[seq.length - 1]}`);
      else partes.push(...seq.map(String));
      seq = [];
    };
    for (const d of arco) {
      if (s.has(d)) seq.push(d);
      else if (seq.length) fecha();
    }
    if (seq.length) fecha();
  }
  return partes.join(", ");
}

/** Só aceita números de dente válidos (para dados vindos de formulário). */
export function dentesValidos(lista: unknown[]): number[] {
  return [...new Set(lista.map(Number).filter((n) => TODOS.has(n)))];
}
