/**
 * Tabelas do painel de placas. Rodadas pelo botão "Preparar banco" no /painel
 * (os dados do Neon ficam só na Vercel, marcados como secretos). Tudo idempotente.
 */
export const SCHEMA = [
  `create table if not exists clientes (
  id serial primary key,
  nome text not null,
  whatsapp text,
  cidade text,
  link_avaliacao text not null,
  observacoes text,
  criado_em timestamptz not null default now()
)`,
  `create table if not exists placas (
  codigo text primary key,
  cliente_id integer references clientes(id) on delete set null,
  ativa boolean not null default true,
  observacoes text,
  ativada_em timestamptz,
  criado_em timestamptz not null default now()
)`,
  `create table if not exists toques (
  id bigserial primary key,
  codigo text not null references placas(codigo) on delete cascade,
  cliente_id integer references clientes(id) on delete set null,
  criado_em timestamptz not null default now()
)`,
  `create index if not exists toques_codigo_idx on toques (codigo, criado_em)`,
  `create index if not exists toques_cliente_idx on toques (cliente_id, criado_em)`,
  `insert into placas (codigo)
select 'A' || lpad(n::text, 3, '0') from generate_series(1, 20) as n
on conflict (codigo) do nothing`,
];
