import type { Dentista, EtapaBancada, HistoricoStatus, OrdemComDentista, StatusOS, TipoTrabalho } from "@/types/database";
import { hojeISO, somarDias } from "@/lib/datas";
import { parseElementos } from "./dentes";
import { ITENS_POR_TIPO } from "./itens";

/**
 * Dados FICTÍCIOS usados no "modo demonstração" (quando o Supabase ainda não foi configurado).
 * Servem só para ver o sistema funcionando. Nada aqui é salvo.
 */

export const dentistasDemo: Dentista[] = [
  { id: "d1", nome: "Dra. Ana Exemplo", cro: "0001", cro_uf: "DF", clinica: "Clínica Sorriso Exemplo", telefone: null, whatsapp: "(61) 90000-0001", email: null, cidade: "Brasília", ativo: true },
  { id: "d2", nome: "Dr. Bruno Exemplo", cro: "0002", cro_uf: "DF", clinica: "Odonto Exemplo", telefone: null, whatsapp: "(61) 90000-0002", email: null, cidade: "Brasília", ativo: true },
  { id: "d3", nome: "Dra. Carla Exemplo", cro: "0003", cro_uf: "GO", clinica: "Instituto Exemplo", telefone: null, whatsapp: "(62) 90000-0003", email: null, cidade: "Goiânia", ativo: true },
];

/** No modo demonstração, o Portal do Dentista mostra a visão desta dentista. */
export const DENTISTA_DEMO_PORTAL = "d1";

type Passo = [StatusOS, EtapaBancada | null, number]; // etapa, bancada, horas atrás
type Linha = [dentista: string, paciente: string, tipo: TipoTrabalho, elementos: string, material: string, cor: string, urgente: boolean, diasPrazo: number, valor: number, passos: Passo[]];

const entregue = (dias: number): Passo[] => [
  ["recebido", null, dias * 24 + 150], ["em_andamento", "cad", dias * 24 + 140], ["finalizado", null, dias * 24 + 30],
  ["saindo_entrega", null, dias * 24 + 4], ["entregue", null, dias * 24 + 3],
];

const linhas: Linha[] = [
  // Já entregues (outubro e início de novembro): alimentam o Financeiro
  ["d1", "Paciente F. A.", "coroa_zirconia", "21", "Zircônia", "A2", false, -40, 450, entregue(40)],
  ["d2", "Paciente O. P.", "protocolo_implante", "Arcada superior", "Resina + dente Delara", "A2", false, -37, 1600, entregue(37)],
  ["d3", "Paciente S. M.", "faceta_lente", "11, 21", "E-max", "BL2", false, -33, 900, entregue(33)],
  ["d1", "Paciente D. V.", "coroa_sobre_implante", "36", "Zircônia", "A3", false, -12, 450, entregue(12)],
  ["d2", "Paciente K. T.", "protese_total", "Superior e inferior", "Dentes New Ace", "A2", false, -10, 600, entregue(10)],
  ["d1", "Paciente B. Q.", "faceta_lente", "13 a 23", "E-max", "BL3", false, -8, 2700, entregue(8)],
  ["d3", "Paciente N. J.", "coroa_zirconia", "46", "Zircônia", "A3.5", false, -6, 450, entregue(6)],
  ["d1", "Paciente R. Z.", "ppr", "Arcada inferior", "Cromo-cobalto", "A3", false, -3, 650, entregue(3)],
  // Em produção agora
  ["d1", "Paciente M. S.", "coroa_zirconia", "11, 21", "Zircônia multicamada", "A2", false, 5, 900, [["recebido", null, 1.5]]],
  ["d2", "Paciente J. P.", "protocolo_implante", "Arcada inferior", "Resina + dente Delara", "A3", true, 2, 1600, [["recebido", null, 27], ["em_andamento", "modelagem", 22]]],
  ["d3", "Paciente R. A.", "faceta_lente", "13 a 23", "E-max", "BL2", false, 4, 3600, [["recebido", null, 50], ["em_andamento", "modelagem", 46], ["em_andamento", "cad", 20]]],
  ["d1", "Paciente L. F.", "ppr", "Arcada superior", "Cromo-cobalto", "A3.5", false, 3, 650, [["recebido", null, 74], ["em_andamento", "modelagem", 70], ["em_andamento", "fresagem_ceramica", 6]]],
  ["d2", "Paciente C. N.", "protese_total", "Superior e inferior", "Resina acrílica", "A2", false, -1, 1200, [["recebido", null, 120], ["em_andamento", "modelagem", 98], ["em_andamento", "acabamento", 3]]],
  ["d3", "Paciente E. G.", "coroa_sobre_implante", "36", "Zircônia", "B2", false, 0, 800, [["recebido", null, 125], ["em_andamento", "cad", 100], ["finalizado", null, 2]]],
  ["d1", "Paciente T. V.", "coroa_emax", "14", "E-max", "A1", true, 1, 750, [["recebido", null, 26], ["em_andamento", "cad", 5]]],
  ["d2", "Paciente A. B.", "coroa_zirconia", "46", "Zircônia", "A3", false, 0, 450, [["recebido", null, 140], ["em_andamento", "cad", 120], ["finalizado", null, 20], ["saindo_entrega", null, 0.6]]],
  // Chegou faltando o análogo (mostra o aviso no portal da Dra. Ana)
  ["d1", "Paciente P. C.", "coroa_sobre_implante", "46", "Zircônia", "A3", false, 5, 450, [["recebido", null, 3]]],
];

/** Fotos ilustrativas da saída na demonstração (do site antigo). */
const FOTO_DEMO: Partial<Record<TipoTrabalho, string>> = {
  coroa_zirconia: "/img/bgdente3.jpg", coroa_emax: "/img/bgdente3.jpg", metalo_ceramica: "/img/bgdente3.jpg", faceta_lente: "/img/d1.jpg",
  protese_total: "/img/d2.jpg", protocolo_implante: "/img/d3.jpg", coroa_sobre_implante: "/img/carroussel-3.jpeg", ppr: "/img/carroussel-2.jpeg",
};
/** Token fixo por OS na demonstração (no banco ele é aleatório). */
const tokenDemo = (n: number) => `demo${String(n).padStart(4, "0")}acompanhamento`;

const horasAtras = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

export function ordensDemo(): (OrdemComDentista & { historico: HistoricoStatus[] })[] {
  const hoje = hojeISO();
  return linhas.map(([dentistaId, paciente, tipo, elementos, material, cor, urgente, dias, valor, passos], k) => {
    const numero = k + 1;
    const id = `demo-${numero}`;
    const dentista = dentistasDemo.find((d) => d.id === dentistaId)!;
    const historico: HistoricoStatus[] = passos.map(([s, etapa, h], i) => ({
      id: i + 1, ordem_id: id, status_anterior: i ? passos[i - 1][0] : null, status_novo: s, etapa_bancada: etapa, alterado_em: horasAtras(h),
    }));
    const ultimo = historico[historico.length - 1];
    const chegou = ultimo.status_novo === "recebido";
    const pronto = ["finalizado", "saindo_entrega", "entregue"].includes(ultimo.status_novo);
    return {
      id, numero, dentista_id: dentistaId,
      dentista: { id: dentista.id, nome: dentista.nome, clinica: dentista.clinica, whatsapp: dentista.whatsapp, cro: dentista.cro, cro_uf: dentista.cro_uf },
      paciente_nome: paciente, tipo_trabalho: tipo, descricao: null, elementos, material, escala_cor: "Vita Classical", cor,
      status: ultimo.status_novo, etapa_bancada: ultimo.status_novo === "em_andamento" ? ultimo.etapa_bancada : null,
      status_desde: ultimo.alterado_em, prioridade: urgente ? "urgente" : "normal",
      data_entrada: historico[0].alterado_em.slice(0, 10), data_prevista: somarDias(hoje, dias),
      data_entrega: ultimo.status_novo === "entregue" ? ultimo.alterado_em : null,
      valor, observacoes: null, created_at: historico[0].alterado_em, updated_at: ultimo.alterado_em, historico,
      dentes: parseElementos(elementos),
      itens: ITENS_POR_TIPO[tipo].map((c) => ({ c, conf: chegou ? (paciente === "Paciente P. C." ? c !== "analogo" : null) : true })),
      conferido_em: chegou && paciente !== "Paciente P. C." ? null : horasAtras(chegou ? 2.5 : passos[0][2] - 0.5),
      foto_saida_url: pronto ? (FOTO_DEMO[tipo] ?? null) : null,
      foto_saida_em: pronto ? ultimo.alterado_em : null,
      token_publico: tokenDemo(numero),
    };
  });
}
