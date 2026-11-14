-- =====================================================================
-- Dados de EXEMPLO (opcional) para testar o painel de OS.
-- Nomes fictícios. Rode no SQL Editor do Supabase depois da migração.
-- Para apagar depois: delete from public.ordens_servico; delete from public.dentistas;
-- =====================================================================

with d as (
  insert into public.dentistas (nome, cro, clinica, whatsapp, cidade) values
    ('Dra. Ana Exemplo',    '0001', 'Clínica Sorriso Exemplo', '(61) 90000-0001', 'Brasília'),
    ('Dr. Bruno Exemplo',   '0002', 'Odonto Exemplo',          '(61) 90000-0002', 'Brasília'),
    ('Dra. Carla Exemplo',  '0003', 'Instituto Exemplo',       '(62) 90000-0003', 'Goiânia')
  returning id, nome
)
insert into public.ordens_servico
  (dentista_id, paciente_nome, tipo_trabalho, elementos, material, escala_cor, cor, status, prioridade, data_prevista, valor)
select d.id, x.paciente, x.tipo::tipo_trabalho, x.elementos, x.material, x.escala, x.cor, x.status, x.prioridade::prioridade_os,
       current_date + x.dias, x.valor
from (values
  ('Dra. Ana Exemplo',   'Paciente M. S.', 'coroa_zirconia',     '11, 21',          'Zircônia multicamada',  'Vita Classical', 'A2',  'recebido',          'normal',  5, 900.00),
  ('Dr. Bruno Exemplo',  'Paciente J. P.', 'protocolo_implante', 'Arcada inferior', 'Resina + dente Delara', 'Vita Classical', 'A3',  'em_andamento',      'urgente', 2, 1600.00),
  ('Dra. Carla Exemplo', 'Paciente R. A.', 'faceta_lente',       '13 a 23',         'E-max',                 'Vita 3D-Master', '1M1', 'em_andamento',      'normal',  4, 3600.00),
  ('Dra. Ana Exemplo',   'Paciente L. F.', 'ppr',                'Arcada superior', 'Cromo-cobalto',         'Vita Classical', 'A3.5','finalizado',        'normal',  3, 650.00),
  ('Dr. Bruno Exemplo',  'Paciente C. N.', 'protese_total',      'Superior e inferior', 'Resina acrílica',   'Vita Classical', 'A2',  'saindo_entrega',    'normal',  1, 1200.00),
  ('Dra. Carla Exemplo', 'Paciente E. G.', 'coroa_sobre_implante','36',             'Zircônia',              'Vita Classical', 'B2',  'entregue',          'normal',  0, 800.00)
) as x(dentista, paciente, tipo, elementos, material, escala, cor, status, prioridade, dias, valor)
join d on d.nome = x.dentista;
