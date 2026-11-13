-- =====================================================================
-- ER Studio Dental — Esquema inicial do banco (Supabase / PostgreSQL)
-- Módulo 1: Ordens de Serviço (OS), Dentistas e Status de produção
--
-- Como rodar: no painel do Supabase, abra "SQL Editor", cole este
-- arquivo inteiro e clique em "Run". Pode rodar uma única vez.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tipos
-- ---------------------------------------------------------------------

-- Papel de quem acessa o sistema:
--   laboratorio -> Edmar e equipe (veem e editam tudo)
--   dentista    -> dentista parceiro (Portal do Dentista, só vê os próprios trabalhos)
create type papel_usuario as enum ('laboratorio', 'dentista');

create type tipo_trabalho as enum (
  'coroa_zirconia',
  'coroa_emax',
  'faceta_lente',
  'metalo_ceramica',
  'protese_total',
  'ppr',
  'protocolo_implante',
  'coroa_sobre_implante',
  'provisorio',
  'placa_miorrelaxante',
  'outro'
);

create type prioridade_os as enum ('normal', 'urgente');

-- Detalhe interno da bancada, usado só enquanto a OS está "Em andamento".
create type etapa_bancada as enum ('modelagem', 'cad', 'fresagem_ceramica', 'acabamento');

-- ---------------------------------------------------------------------
-- 2. Etapas da OS (tabela de referência, alimenta o Kanban e o Portal)
--    São as 5 etapas que o dentista e a equipe enxergam, cada uma com sua cor.
-- ---------------------------------------------------------------------
create table public.os_status (
  codigo     text primary key,           -- ex.: 'cad'
  nome       text not null,              -- ex.: 'CAD'
  ordem      smallint not null unique,   -- posição da coluna no Kanban
  cor        text not null default '#64748b'
);

insert into public.os_status (codigo, nome, ordem, cor) values
  ('recebido',       'Chegou',              1, '#2563eb'),
  ('em_andamento',   'Em andamento',        2, '#d97706'),
  ('finalizado',     'Finalizado',          3, '#16a34a'),
  ('saindo_entrega', 'Saindo para entrega', 4, '#7c3aed'),
  ('entregue',       'Entregue',            5, '#475569');

-- ---------------------------------------------------------------------
-- 3. Dentistas parceiros (clientes do laboratório)
-- ---------------------------------------------------------------------
create table public.dentistas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  cro         text,                      -- número do CRO
  cro_uf      char(2) default 'DF',
  clinica     text,
  telefone    text,
  whatsapp    text,
  email       text,
  cidade      text default 'Brasília',
  endereco    text,
  observacoes text,
  ativo       boolean not null default true,
  user_id     uuid unique references auth.users (id) on delete set null, -- login do Portal do Dentista
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index dentistas_nome_idx on public.dentistas (nome);

-- ---------------------------------------------------------------------
-- 4. Perfis (liga o login do Supabase ao papel no sistema)
-- ---------------------------------------------------------------------
create table public.perfis (
  id          uuid primary key references auth.users (id) on delete cascade,
  nome        text,
  papel       papel_usuario not null default 'dentista',
  dentista_id uuid references public.dentistas (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se cadastra.
-- Todo cadastro novo entra como 'dentista' (sem acesso a nada até ser ligado).
-- Para tornar alguém do laboratório, rode:
--   update public.perfis set papel = 'laboratorio' where id = (select id from auth.users where email = 'edmarreis.studio@gmail.com');
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', new.email));
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- ---------------------------------------------------------------------
-- 5. Ordens de Serviço
-- ---------------------------------------------------------------------
create table public.ordens_servico (
  id             uuid primary key default gen_random_uuid(),
  numero         integer generated always as identity (start with 1) unique, -- exibido como OS-0001
  dentista_id    uuid not null references public.dentistas (id) on delete restrict,
  paciente_nome  text not null,
  tipo_trabalho  tipo_trabalho not null,
  descricao      text,                  -- detalhes do trabalho
  elementos      text,                  -- dentes envolvidos, ex.: '11, 21' ou 'arcada superior'
  material       text,                  -- ex.: 'Zircônia multicamada', 'E-max', 'Resina + dente Delara'
  escala_cor     text,                  -- sistema da escala, ex.: 'Vita Classical', 'Vita 3D-Master'
  cor            text,                  -- cor escolhida, ex.: 'A2', '2M2'
  status         text not null default 'recebido' references public.os_status (codigo),
  etapa_bancada  etapa_bancada,         -- só quando status = 'em_andamento'
  status_desde   timestamptz not null default now(), -- quando entrou na etapa atual
  prioridade     prioridade_os not null default 'normal',
  data_entrada   date not null default current_date,
  data_prevista  date,                  -- prazo combinado (padrão do lab: 5 dias úteis)
  data_entrega   timestamptz,           -- preenchida sozinha quando a OS vira "Entregue" (base da fatura)
  valor          numeric(10, 2),        -- usado depois pelo módulo Financeiro
  observacoes    text,
  criado_por     uuid references auth.users (id) default auth.uid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index ordens_servico_status_idx   on public.ordens_servico (status);
create index ordens_servico_dentista_idx on public.ordens_servico (dentista_id);
create index ordens_servico_prazo_idx    on public.ordens_servico (data_prevista);
create index ordens_servico_entrega_idx  on public.ordens_servico (data_entrega);

-- ---------------------------------------------------------------------
-- 6. Histórico de etapas (quem moveu o trabalho e quando: vira a linha do tempo)
-- ---------------------------------------------------------------------
create table public.os_historico_status (
  id              bigint generated always as identity primary key,
  ordem_id        uuid not null references public.ordens_servico (id) on delete cascade,
  status_anterior text references public.os_status (codigo),
  status_novo     text not null references public.os_status (codigo),
  etapa_bancada   etapa_bancada,
  alterado_por    uuid references auth.users (id) default auth.uid(),
  alterado_em     timestamptz not null default now()
);

create index os_historico_ordem_idx on public.os_historico_status (ordem_id, alterado_em);

-- ---------------------------------------------------------------------
-- 7. Gatilhos: updated_at automático e registro do histórico
-- ---------------------------------------------------------------------
create or replace function public.atualizar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger dentistas_updated_at
  before update on public.dentistas
  for each row execute function public.atualizar_updated_at();

create trigger ordens_servico_updated_at
  before update on public.ordens_servico
  for each row execute function public.atualizar_updated_at();

-- Ao mudar de etapa: guarda o horário, preenche a data de entrega e
-- só mantém a etapa da bancada enquanto estiver "Em andamento".
create or replace function public.ajustar_etapa_os()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.status_desde = now();
    if new.status = 'em_andamento' and new.etapa_bancada is null then
      new.etapa_bancada = 'modelagem';
    end if;
  end if;
  if new.status <> 'em_andamento' then
    new.etapa_bancada = null;
  end if;
  if new.status = 'entregue' then
    new.data_entrega = coalesce(new.data_entrega, now());
  else
    new.data_entrega = null;
  end if;
  return new;
end;
$$;

create trigger ordens_servico_etapa
  before insert or update of status, etapa_bancada on public.ordens_servico
  for each row execute function public.ajustar_etapa_os();

create or replace function public.registrar_historico_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.os_historico_status (ordem_id, status_anterior, status_novo, etapa_bancada)
    values (new.id, null, new.status, new.etapa_bancada);
  elsif new.status is distinct from old.status or new.etapa_bancada is distinct from old.etapa_bancada then
    insert into public.os_historico_status (ordem_id, status_anterior, status_novo, etapa_bancada)
    values (new.id, old.status, new.status, new.etapa_bancada);
  end if;
  return new;
end;
$$;

create trigger ordens_servico_historico
  after insert or update of status, etapa_bancada on public.ordens_servico
  for each row execute function public.registrar_historico_status();

-- ---------------------------------------------------------------------
-- 8. Segurança (Row Level Security)
-- ---------------------------------------------------------------------
create or replace function public.eh_laboratorio()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and papel = 'laboratorio'
  );
$$;

create or replace function public.meu_dentista_id()
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select dentista_id from public.perfis where id = auth.uid();
$$;

alter table public.os_status            enable row level security;
alter table public.dentistas            enable row level security;
alter table public.perfis               enable row level security;
alter table public.ordens_servico       enable row level security;
alter table public.os_historico_status  enable row level security;

-- Status: qualquer pessoa logada pode ler.
create policy "status: leitura para logados"
  on public.os_status for select to authenticated using (true);

-- Perfis: cada um vê o próprio; o laboratório vê e edita todos.
create policy "perfis: ver o próprio"
  on public.perfis for select to authenticated using (id = auth.uid() or public.eh_laboratorio());
create policy "perfis: laboratório edita"
  on public.perfis for update to authenticated using (public.eh_laboratorio()) with check (public.eh_laboratorio());

-- Dentistas: laboratório tem acesso total; dentista vê o próprio cadastro.
create policy "dentistas: laboratório total"
  on public.dentistas for all to authenticated using (public.eh_laboratorio()) with check (public.eh_laboratorio());
create policy "dentistas: ver o próprio"
  on public.dentistas for select to authenticated using (id = public.meu_dentista_id());

-- Ordens de Serviço: laboratório tem acesso total; dentista vê só as suas.
create policy "os: laboratório total"
  on public.ordens_servico for all to authenticated using (public.eh_laboratorio()) with check (public.eh_laboratorio());
create policy "os: dentista vê as suas"
  on public.ordens_servico for select to authenticated using (dentista_id = public.meu_dentista_id());
-- Pedido pelo Portal: o dentista só cria OS em nome dele e sempre na primeira etapa.
create policy "os: dentista pede trabalho"
  on public.ordens_servico for insert to authenticated
  with check (dentista_id = public.meu_dentista_id() and status = 'recebido' and valor is null);

-- Histórico: laboratório vê tudo; dentista vê o histórico das suas OS.
create policy "historico: laboratório"
  on public.os_historico_status for select to authenticated using (public.eh_laboratorio());
create policy "historico: dentista vê das suas OS"
  on public.os_historico_status for select to authenticated using (
    exists (
      select 1 from public.ordens_servico o
      where o.id = ordem_id and o.dentista_id = public.meu_dentista_id()
    )
  );
