/**
 * Tabela de preços do laboratório (fonte: tabela-precos-edmar-reis, conferida com a Mada).
 * valor null = "sob consulta" (itens ainda não confirmados: Trilux, Vita, Premium).
 */
export type ItemPreco = { nome: string; valor: number | null };
export type GrupoPreco = { grupo: string; itens: ItemPreco[] };

export const condicoesPagamento = {
  prazo: "5 dias úteis ou a combinar",
  aposAs19h: "Atendimento após as 19h: 70% acima do valor de tabela",
  pagamento: ["À vista com 5% de desconto", "A prazo, parcelado em 3x", "Fechamento da fatura todo fim de mês, pagamento até o dia 10"],
};

export const tabelaPrecos: GrupoPreco[] = [
  {
    "grupo": "Provisórios e placas",
    "itens": [
      {
        "nome": "Coroa provisória",
        "valor": 100
      },
      {
        "nome": "Coroa provisória com gengiva ou aletas",
        "valor": 150
      },
      {
        "nome": "Placa miorrelaxante de acrílico",
        "valor": 295
      },
      {
        "nome": "Placa miorrelaxante de silicone",
        "valor": 100
      },
      {
        "nome": "Placa de acetato",
        "valor": 100
      },
      {
        "nome": "Placa de clareamento (superior/inferior), o par",
        "valor": 120
      },
      {
        "nome": "Guia cirúrgico / multifuncional",
        "valor": 150
      },
      {
        "nome": "Mock-up",
        "valor": 250
      },
      {
        "nome": "Enceramento para diagnóstico",
        "valor": 50
      },
      {
        "nome": "Restauração metálica fundida (liga de prata)",
        "valor": 350
      },
      {
        "nome": "Núcleo metálico fundido (Duracast)",
        "valor": 150
      }
    ]
  },
  {
    "grupo": "Coroa metalocerâmica / implante",
    "itens": [
      {
        "nome": "Copping metálico",
        "valor": 225
      },
      {
        "nome": "Estratificação porcelana",
        "valor": 225
      },
      {
        "nome": "Total",
        "valor": 450
      },
      {
        "nome": "Pilar personalizado (munhão)",
        "valor": 200
      }
    ]
  },
  {
    "grupo": "Zircônia e cerâmicas",
    "itens": [
      {
        "nome": "Coroa sobre implante (zircônia)",
        "valor": 450
      },
      {
        "nome": "Barra de protocolo (somente barra)",
        "valor": 2500
      },
      {
        "nome": "Protocolo de zircônia",
        "valor": 5500
      },
      {
        "nome": "E-max / porcelana prensada",
        "valor": 420
      },
      {
        "nome": "Lente de contato dental",
        "valor": 450
      },
      {
        "nome": "Resina fotopolimerizável (cerômero / art glass)",
        "valor": 150
      }
    ]
  },
  {
    "grupo": "Prótese parcial provisória acrílica",
    "itens": [
      {
        "nome": "Montagem / acrilização",
        "valor": 400
      }
    ]
  },
  {
    "grupo": "Consertos",
    "itens": [
      {
        "nome": "Conserto de próteses (a partir de)",
        "valor": 200
      },
      {
        "nome": "Reembasamento",
        "valor": 250
      }
    ]
  },
  {
    "grupo": "Prótese total caracterizada (STG)",
    "itens": [
      {
        "nome": "Moldeira individual",
        "valor": 100
      },
      {
        "nome": "Plano de orientação / cera",
        "valor": 100
      },
      {
        "nome": "Montagem de dentes Trilux",
        "valor": null
      },
      {
        "nome": "Montagem de dentes New Ace",
        "valor": 200
      },
      {
        "nome": "Acrilização",
        "valor": 200
      },
      {
        "nome": "Total com dentes Trilux",
        "valor": null
      },
      {
        "nome": "Total com dentes New Ace",
        "valor": 600
      },
      {
        "nome": "Total com dentes Vita ou Premium",
        "valor": null
      }
    ]
  },
  {
    "grupo": "Protocolo dento-gengival (estratificado)",
    "itens": [
      {
        "nome": "Barra metálica",
        "valor": 1500
      },
      {
        "nome": "Planejamento e montagem de dentes",
        "valor": 500
      },
      {
        "nome": "Estratificação",
        "valor": 1800
      },
      {
        "nome": "Total",
        "valor": 3800
      }
    ]
  },
  {
    "grupo": "Protocolo em resina, barra 100% passiva + gengiva STG",
    "itens": [
      {
        "nome": "Plano de cera",
        "valor": 200
      },
      {
        "nome": "Montagem de dentes",
        "valor": 300
      },
      {
        "nome": "Acrilização",
        "valor": 600
      },
      {
        "nome": "Barra (estrutura metálica)",
        "valor": 800
      },
      {
        "nome": "Ponto de solda",
        "valor": 40
      },
      {
        "nome": "Troca de dentes, limpeza e acrilização em protocolo antigo",
        "valor": 900
      },
      {
        "nome": "Total com dentes Delara",
        "valor": 1600
      },
      {
        "nome": "Total com dentes Vita",
        "valor": null
      },
      {
        "nome": "Total com dentes Premium",
        "valor": null
      }
    ]
  },
  {
    "grupo": "Implantes e outros",
    "itens": [
      {
        "nome": "Overdenture barra clip",
        "valor": 1100
      },
      {
        "nome": "Protocolo provisório",
        "valor": 850
      },
      {
        "nome": "Prótese total provisória",
        "valor": 450
      },
      {
        "nome": "Carga imediata",
        "valor": 3150
      },
      {
        "nome": "Modelo de protocolo para apresentação",
        "valor": 950
      }
    ]
  }
];
