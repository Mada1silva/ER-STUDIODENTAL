# ER Studio Dental — Sistema de gestão e site

Sistema do **Edmar Reis Studio Dental** (laboratório de prótese dentária, desde 1985).
Feito com **Next.js + Tailwind CSS + Supabase**, tudo em ferramentas gratuitas (Supabase Free e Vercel Hobby).

## Os 4 pilares

| Pilar | Onde fica | Situação |
|---|---|---|
| 1. Ordens de Serviço (Kanban de produção) | `/painel/os` | ✅ primeira versão |
| 2. Portal do Dentista | `/portal` | ✅ trabalhos do dentista com linha do tempo, avisos e pedido de trabalho |
| 3. Site institucional | `/` | ✅ primeira versão. A tabela de preços fica no portal (`/portal/precos`); para publicá-la no site, troque `TABELA_PRECOS_PUBLICA` em `src/lib/config/tabela-precos.ts` |
| 4. Financeiro básico | `/painel/financeiro` | ✅ fatura do mês por dentista/clínica, com resumo para WhatsApp |

### Diferenciais

| Diferencial | Onde fica |
|---|---|
| Odontograma (marcar os dentes no desenho da boca) e biblioteca visual de trabalhos, materiais e cores | Nova OS (`/painel/os/nova`) e pedido do portal (`/portal/pedido`) |
| O que acompanha o trabalho (moldagem, mordida, análogo, componentes…) com conferência item por item na chegada; se faltar algo, o dentista vê o aviso no portal | Página da OS (`/painel/os/[id]`) e portal |
| Foto do trabalho na saída (tirada pelo celular, guardada no Supabase Storage) | Página da OS; o dentista vê no portal e no link de acompanhamento |
| Aviso no WhatsApp com mensagem pronta e link de acompanhamento **sem senha** | Página da OS → "Avisar o dentista"; o link abre `/acompanhar/[token]` |
| Certificado de autenticidade com QR code (imprime ou salva em PDF) | `/acompanhar/[token]/certificado` |
| Casos realizados e depoimentos no site (os depoimentos só aparecem quando houver depoimentos reais, com autorização) | `/` |
| Modo TV da produção (atualiza sozinho a cada 30 s) | `/tv` |

## Como rodar no seu computador

Precisa ter o [Node.js](https://nodejs.org) 20 ou mais novo instalado.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 (site) e http://localhost:3000/painel (painel do laboratório).

Sem configurar nada, o sistema abre em **modo demonstração**, com dados fictícios: dá para ver e mexer
no quadro, mas nada é salvo.

## Ligando o Supabase (banco de dados de verdade)

1. Crie uma conta grátis em https://supabase.com e um projeto novo (região: São Paulo).
2. No projeto, abra **SQL Editor**, cole todo o arquivo `supabase/migrations/0001_schema_inicial.sql` e clique em **Run**.
   Depois faça o mesmo com `supabase/migrations/0002_diferenciais.sql` (odontograma, conferência, foto da saída, link de acompanhamento).
   Ele também cria no **Storage** o bucket `fotos-saida`, onde ficam as fotos da saída.
3. (Opcional) Rode também `supabase/seed.sql` para ter dados de exemplo.
4. Em **Authentication → Users**, crie o usuário do laboratório (e-mail e senha).
5. No **SQL Editor**, dê a esse usuário o papel de laboratório (dentistas parceiros ficam como `dentista`
   e precisam ter `dentista_id` ligado ao cadastro deles em `perfis` para ver o portal):
   ```sql
   update public.perfis set papel = 'laboratorio'
   where id = (select id from auth.users where email = 'edmarreis.studio@gmail.com');
   ```
6. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*.
7. Copie `.env.example` para `.env.local` e cole os dois valores. **Nunca** envie o `.env.local` para o GitHub.
   Quando o site estiver no ar, preencha também `NEXT_PUBLIC_SITE_URL` com o endereço do site (é o endereço que vai nos links do WhatsApp e no QR code).
8. Rode `npm run dev` de novo. Agora o painel pede login e salva tudo no banco.

## Estrutura de pastas

```
src/
  app/
    (site)/            Site institucional (layout público: cabeçalho, rodapé, WhatsApp)
    painel/            Área do laboratório (layout com menu lateral)
      os/              Kanban de produção, nova OS e detalhe da OS
      dentistas/       Dentistas parceiros
      financeiro/      (em breve)
    portal/            Portal do Dentista (em breve)
    login/             Entrada com e-mail e senha (Supabase Auth)
  components/
    site/              Peças do site (logo, cabeçalho, rodapé, ícones)
    painel/            Peças do painel (menu, avisos)
    os/                Quadro Kanban, cartão e formulário de OS
  lib/
    config/site.ts     Contatos, horário e dados do laboratório (mude aqui)
    os/                Regras das OS: etapas, tipos de trabalho, leitura e gravação
    supabase/          Conexão com o Supabase (navegador, servidor e middleware)
    datas.ts           Datas, prazos em dias úteis e moeda
  types/database.ts    Tipos das tabelas
  middleware.ts        Exige login em /painel e /portal
supabase/
  migrations/          Esquema do banco (rodar no SQL Editor)
  seed.sql             Dados de exemplo
site-antigo/           Site estático anterior (HTML/Materialize), guardado como referência
```

## Banco de dados (resumo)

- `os_status`: as 5 etapas, cada uma com sua cor: Chegou (azul) → Em andamento (âmbar) → Finalizado (verde) → Saindo para entrega (roxo) → Entregue (grafite). Dentro de "Em andamento" a equipe marca a bancada (Modelagem, CAD, Fresagem/Cerâmica, Acabamento), que o dentista não vê.
- `dentistas`: clientes do laboratório (CRO, clínica, contato). O campo `user_id` liga o dentista ao login do portal.
- `ordens_servico`: cada trabalho, com dentista, paciente, tipo, dentes, material, escala/cor, prazo, prioridade e valor. `status_desde` guarda quando entrou na etapa atual e `data_entrega` é preenchida sozinha ao virar "Entregue" (é a data usada na fatura).
- `os_historico_status`: registro automático de cada mudança de etapa (quem e quando): é a linha do tempo do painel e do portal.
- Em cada OS também ficam: `dentes` (odontograma, numeração FDI), `itens` (o que acompanha o trabalho e se chegou ou faltou), `foto_saida_url` e `token_publico` (o código aleatório do link de acompanhamento sem senha).
- `acompanhar_os(token)`: função do banco que a página pública usa. Ela devolve só o necessário (iniciais do paciente, etapa, foto, linha do tempo), sem valores nem observações internas.
- `perfis`: diz se quem entrou é do **laboratório** (vê tudo) ou **dentista** (vê só os próprios trabalhos).

A segurança fica no próprio banco (Row Level Security): um dentista nunca consegue ver trabalhos de outro.

## Publicar (grátis)

Importe o repositório na [Vercel](https://vercel.com/new), adicione as duas variáveis do `.env.example`
em *Environment Variables* e clique em Deploy.
