-- =====================================================================
-- ER Studio Dental · Diferenciais (rodar DEPOIS da 0001)
--   1. Dentes marcados no odontograma (numeração FDI)
--   2. O que acompanha o trabalho + conferência na chegada
--   3. Foto da saída (Supabase Storage, bucket "fotos-saida")
--   4. Link de acompanhamento sem senha (token por OS)
--   5. Certificado com QR code (usa o mesmo token)
-- =====================================================================

alter table public.ordens_servico
  add column if not exists dentes smallint[] not null default '{}',
  -- [{"c": "analogo", "conf": null | true | false}]  (null = ainda não conferido)
  add column if not exists itens jsonb not null default '[]'::jsonb,
  add column if not exists conferido_em timestamptz,
  add column if not exists foto_saida_url text,
  add column if not exists foto_saida_em timestamptz,
  -- Token aleatório (122 bits) do link público. Ninguém adivinha; dá para trocar se vazar.
  add column if not exists token_publico text not null default replace(gen_random_uuid()::text, '-', '');

create unique index if not exists ordens_servico_token_publico_idx on public.ordens_servico (token_publico);

comment on column public.ordens_servico.dentes is 'Dentes marcados no odontograma (FDI: 11–18, 21–28, 31–38, 41–48).';
comment on column public.ordens_servico.itens is 'O que acompanha o trabalho e a conferência na chegada: [{c, conf}].';
comment on column public.ordens_servico.token_publico is 'Link de acompanhamento sem senha: /acompanhar/<token>.';

-- O dentista que pede pelo portal não pode marcar itens como já conferidos.
drop policy if exists "os: dentista pede trabalho" on public.ordens_servico;
create policy "os: dentista pede trabalho" on public.ordens_servico
  for insert to authenticated
  with check (
    dentista_id = public.meu_dentista_id()
    and status = 'recebido'
    and valor is null
    and conferido_em is null
    and foto_saida_url is null
    and not exists (select 1 from jsonb_array_elements(itens) i where i->>'conf' is not null)
  );

-- ---------------------------------------------------------------------
-- Página pública de acompanhamento e certificado.
-- Não abre a tabela para visitantes: esta função devolve SÓ o necessário
-- (iniciais do paciente, sem valores, sem observações internas).
-- ---------------------------------------------------------------------
create or replace function public.acompanhar_os(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'numero', o.numero,
    'tipo_trabalho', o.tipo_trabalho,
    'elementos', o.elementos,
    'dentes', o.dentes,
    'material', o.material,
    'escala_cor', o.escala_cor,
    'cor', o.cor,
    'status', o.status,
    'status_desde', o.status_desde,
    'data_prevista', o.data_prevista,
    'foto_saida_url', o.foto_saida_url,
    'token_publico', o.token_publico,
    'paciente_iniciais', (
      select string_agg(upper(left(p, 1)) || '.', ' ')
      from regexp_split_to_table(regexp_replace(trim(o.paciente_nome), '^paciente\s+', '', 'i'), '\s+') as p
      where p <> '' and lower(p) not in ('da', 'de', 'do', 'das', 'dos', 'e')
    ),
    'itens_faltando', coalesce((select jsonb_agg(i->>'c') from jsonb_array_elements(o.itens) i where i->>'conf' = 'false'), '[]'::jsonb),
    'dentista', jsonb_build_object('nome', d.nome, 'cro', d.cro, 'cro_uf', d.cro_uf),
    'historico', coalesce((
      select jsonb_agg(jsonb_build_object('status_anterior', h.status_anterior, 'status_novo', h.status_novo, 'alterado_em', h.alterado_em) order by h.alterado_em)
      from public.os_historico_status h
      where h.ordem_id = o.id and h.status_anterior is distinct from h.status_novo
    ), '[]'::jsonb)
  )
  from public.ordens_servico o
  join public.dentistas d on d.id = o.dentista_id
  where o.token_publico = p_token and length(p_token) >= 20;
$$;

revoke all on function public.acompanhar_os(text) from public;
grant execute on function public.acompanhar_os(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage: bucket público só para LEITURA das fotos da saída.
-- O nome do arquivo leva o token aleatório, então não dá para listar ou adivinhar.
-- Só o laboratório envia, troca ou apaga fotos.
-- (No Supabase o schema "storage" já existe; num Postgres local, este bloco é ignorado.)
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public)
    values ('fotos-saida', 'fotos-saida', true)
    on conflict (id) do nothing;

    execute 'drop policy if exists "fotos-saida: laboratorio envia" on storage.objects';
    execute $p$create policy "fotos-saida: laboratorio envia" on storage.objects
      for insert to authenticated with check (bucket_id = 'fotos-saida' and public.eh_laboratorio())$p$;
    execute 'drop policy if exists "fotos-saida: laboratorio troca" on storage.objects';
    execute $p$create policy "fotos-saida: laboratorio troca" on storage.objects
      for update to authenticated using (bucket_id = 'fotos-saida' and public.eh_laboratorio())$p$;
    execute 'drop policy if exists "fotos-saida: laboratorio apaga" on storage.objects';
    execute $p$create policy "fotos-saida: laboratorio apaga" on storage.objects
      for delete to authenticated using (bucket_id = 'fotos-saida' and public.eh_laboratorio())$p$;
  end if;
end
$$;
