/** Dados públicos do laboratório, usados no site e no painel. */
export const site = {
  nome: "Edmar Reis Studio Dental",
  nomeCurto: "ER Studio Dental",
  desde: 1985,
  responsavelTecnico: "Edmar Reis",
  cro: "CRO/DF 252",
  // Endereço completo ainda a confirmar com a Mada; por enquanto só a cidade.
  localizacao: "Brasília - DF",
  regiaoAtendida: ["Brasília", "Anápolis", "Goiânia e região"],
  horario: "Segunda a sábado, das 8h às 18h",
  telefone: "(61) 98593-6407",
  whatsapp: "5561985936407",
  email: "edmarreis.studio@gmail.com",
  instagram: "edmareistudiodental",
  prazoPadraoDiasUteis: 5,
} as const;

export function linkWhatsApp(mensagem = "Olá! Vim pelo site e gostaria de falar com o laboratório.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
