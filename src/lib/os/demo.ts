import type { Dentista, HistoricoStatus, OrdemComDentista, StatusOS, TipoTrabalho } from "@/types/database";
import { hojeISO, somarDias } from "@/lib/datas";

/**
 * Dados FICTÍCIOS usados no "modo demonstração" (quando o Supabase ainda não foi configurado).
 * Servem só para ver o painel funcionando. Nada aqui é salvo.
 */

export const dentistasDemo: Dentista[] = [
  { id: "d1", nome: "Dra. Ana Exemplo", cro: "0001", cro_uf: "DF", clinica: "Clínica Sorriso Exemplo", telefone: null, whatsapp: "(61) 90000-0001", email: null, cidade: "Brasília", ativo: true },
  { id: "d2", nome: "Dr. Bruno Exemplo", cro: "0002", cro_uf: "DF", clinica: "Odonto Exemplo", telefone: null, whatsapp: "(61) 90000-0002", email: null, cidade: "Brasília", ativo: true },
  { id: "d3", nome: "Dra. Carla Exemplo", cro: "0003", cro_uf: "GO", clinica: "Instituto Exemplo", telefone: null, whatsapp: "(62) 90000-0003", email: null, cidade: "Goiânia", ativo: true },
];

type Linha = [numero: number, dentista: string, paciente: string, tipo: TipoTrabalho, elementos: string, material: string, cor: string, status: StatusOS, urgente: boolean, diasPrazo: number, valor: number];

const linhas: Linha[] = [
  [1, "d1", "Paciente M. S.", "coroa_zirconia", "11, 21", "Zircônia multicamada", "A2", "recebido", false, 5, 900],
  [2, "d2", "Paciente J. P.", "protocolo_implante", "Arcada inferior", "Resina + dente Delara", "A3", "modelagem", true, 2, 1600],
  [3, "d3", "Paciente R. A.", "faceta_lente", "13 a 23", "E-max", "BL2", "cad", false, 4, 3600],
  [4, "d1", "Paciente L. F.", "ppr", "Arcada superior", "Cromo-cobalto", "A3.5", "fresagem_ceramica", false, 3, 650],
  [5, "d2", "Paciente C. N.", "protese_total", "Superior e inferior", "Resina acrílica", "A2", "acabamento", false, -1, 1200],
  [6, "d3", "Paciente E. G.", "coroa_sobre_implante", "36", "Zircônia", "B2", "pronto", false, 0, 800],
  [7, "d1", "Paciente T. V.", "coroa_emax", "14", "E-max", "A1", "cad", true, 1, 750],
];

export function ordensDemo(): OrdemComDentista[] {
  const hoje = hojeISO();
  return linhas.map(([numero, dentistaId, paciente, tipo, elementos, material, cor, status, urgente, dias, valor]) => {
    const dentista = dentistasDemo.find((d) => d.id === dentistaId)!;
    return {
      id: `demo-${numero}`,
      numero,
      dentista_id: dentistaId,
      dentista: { id: dentista.id, nome: dentista.nome, clinica: dentista.clinica },
      paciente_nome: paciente,
      tipo_trabalho: tipo,
      descricao: null,
      elementos,
      material,
      escala_cor: "Vita Classical",
      cor,
      status,
      prioridade: urgente ? "urgente" : "normal",
      data_entrada: somarDias(hoje, -3),
      data_prevista: somarDias(hoje, dias),
      data_entrega: null,
      valor,
      observacoes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

export function historicoDemo(ordem: OrdemComDentista): HistoricoStatus[] {
  return [{ id: 1, ordem_id: ordem.id, status_anterior: null, status_novo: "recebido", alterado_em: `${ordem.data_entrada}T11:00:00Z` }];
}
