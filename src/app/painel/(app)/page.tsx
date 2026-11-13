import Link from "next/link";
import { db, faltaColuna, faltaTabela } from "@/lib/db";
import { rotuloDestino } from "@/lib/destinos";
import { exigirLogin } from "@/lib/painel-auth";
import { prepararBanco } from "@/app/painel/actions";
import { Aviso, Cartao, Numero, Titulo, botao, botaoLeve, quando, reais } from "@/app/painel/ui";

type Resumo = { ativas: number; pausadas: number; estoque: number; clientes: number; vendido: number; vendidas: number };
type Leituras = { total: number; hoje: number; mes: number };
type Dia = { dia: string; total: number };
type Top = { codigo: string; nome: string; total: number };
type Venda = { codigo: string; nome: string; valor: number; forma_pagamento: string | null; ativada_em: string | null };
type Destino = { tipo: string; total: number };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  let dados: [Resumo[], Leituras[], Dia[], Top[], Venda[], Destino[]];
  try {
    dados = (await Promise.all([
      sql`select
            count(*) filter (where p.cliente_id is not null and p.ativa)::int as ativas,
            count(*) filter (where p.cliente_id is not null and not p.ativa)::int as pausadas,
            count(*) filter (where p.cliente_id is null)::int as estoque,
            (select count(*) from clientes)::int as clientes,
            coalesce(sum(p.valor_venda) filter (where p.cliente_id is not null), 0)::float8 as vendido,
            count(p.valor_venda) filter (where p.cliente_id is not null)::int as vendidas
          from placas p`,
      sql`select count(*)::int as total,
            count(*) filter (where (criado_em at time zone 'America/Recife')::date = (now() at time zone 'America/Recife')::date)::int as hoje,
            count(*) filter (where criado_em > now() - interval '30 days')::int as mes
          from toques`,
      sql`select to_char(d, 'DD/MM') as dia, count(t.id)::int as total
          from generate_series((now() at time zone 'America/Recife')::date - 13, (now() at time zone 'America/Recife')::date, interval '1 day') as d
          left join toques t on (t.criado_em at time zone 'America/Recife')::date = d::date
          group by d order by d`,
      sql`select p.codigo, coalesce(p.nome, c.nome) as nome, count(t.id)::int as total
          from toques t join placas p on p.codigo = t.codigo join clientes c on c.id = p.cliente_id
          where t.criado_em > now() - interval '30 days'
          group by p.codigo, p.nome, c.nome order by total desc limit 5`,
      sql`select p.codigo, coalesce(p.nome, c.nome) as nome, p.valor_venda::float8 as valor, p.forma_pagamento, p.ativada_em
          from placas p join clientes c on c.id = p.cliente_id
          where p.valor_venda is not null order by p.ativada_em desc nulls last limit 5`,
      sql`select coalesce(destino_tipo, 'avaliacao') as tipo, count(*)::int as total
          from placas where cliente_id is not null group by 1 order by total desc`,
    ])) as typeof dados;
  } catch (e) {
    if (!faltaTabela(e) && !faltaColuna(e)) throw e;
    const novo = faltaTabela(e);
    return (
      <div className="flex max-w-md flex-col gap-4 py-8">
        <h1 className="text-2xl font-semibold">{novo ? "Preparar o banco" : "Atualizar o banco"}</h1>
        <p className="text-sm text-muted-foreground">
          {novo
            ? "O banco está conectado, mas as tabelas ainda não existem. Clique uma vez para criar as tabelas e cadastrar as placas A001 a A020."
            : "O painel ganhou campos novos nas placas (destino, nome e venda). Clique uma vez para criar as colunas. Nenhum dado é apagado e as placas seguem funcionando."}
        </p>
        <form action={prepararBanco}><button className={botao}>{novo ? "Preparar banco" : "Atualizar banco"}</button></form>
      </div>
    );
  }
  const [[resumo], [leituras], dias, top, vendas, destinos] = dados;
  const maior = Math.max(1, ...dias.map((d) => d.total));

  return (
    <>
      <Titulo titulo="Dashboard" texto="Veja como estão suas placas e suas vendas." acao={<Link href="/painel/placas" className={botao}>Ativar placa</Link>} />
      <Aviso ok={ok} erro={erro} />

      {resumo.estoque > 0 && (
        <p className="rounded-xl border border-status/30 bg-status/10 px-4 py-3 text-sm">
          Você tem <b>{resumo.estoque} {resumo.estoque === 1 ? "placa liberada" : "placas liberadas"}</b> para ativar. É só escanear o QR Code de cada uma ou escolher em{" "}
          <Link href="/painel/placas" className="font-semibold text-status hover:underline">Minhas placas</Link>.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero rotulo="Faturamento total" valor={reais(resumo.vendido)} nota={`${resumo.vendidas} ${resumo.vendidas === 1 ? "placa vendida" : "placas vendidas"}`} />
        <Numero rotulo="Ticket médio" valor={reais(resumo.vendidas ? resumo.vendido / resumo.vendidas : 0)} />
        <Numero rotulo="Placas ativas" valor={resumo.ativas} nota={resumo.pausadas ? `${resumo.pausadas} pausada${resumo.pausadas === 1 ? "" : "s"}` : `${resumo.clientes} cliente${resumo.clientes === 1 ? "" : "s"}`} />
        <Numero rotulo="Em estoque (a ativar)" valor={resumo.estoque} nota={<Link href="/painel/lotes" className="hover:underline">Cadastrar placas →</Link>} />
      </div>

      <Cartao titulo="Leituras nos últimos 14 dias">
        <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
          <div><p className="text-muted-foreground">Hoje</p><p className="text-xl font-semibold">{leituras.hoje}</p></div>
          <div><p className="text-muted-foreground">30 dias</p><p className="text-xl font-semibold">{leituras.mes}</p></div>
          <div><p className="text-muted-foreground">Total</p><p className="text-xl font-semibold">{leituras.total}</p></div>
        </div>
        <ol className="flex h-32 items-end gap-1.5">
          {dias.map((d) => (
            <li key={d.dia} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${d.dia}: ${d.total}`}>
              <span className="text-[10px] text-muted-foreground">{d.total || ""}</span>
              <span className="w-full rounded-t bg-status/70" style={{ height: `${Math.max(2, (d.total / maior) * 100)}%` }} />
              <span className="text-[10px] text-muted-foreground">{d.dia.slice(0, 2)}</span>
            </li>
          ))}
        </ol>
      </Cartao>

      <div className="grid gap-6 lg:grid-cols-2">
        <Cartao titulo="Placas mais lidas" acao={<span className="text-xs text-muted-foreground">últimos 30 dias</span>}>
          {top.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma leitura nos últimos 30 dias.</p>
          ) : (
            <ol className="grid gap-2 text-sm">
              {top.map((p, i) => (
                <li key={p.codigo} className="flex items-center gap-3">
                  <span className="w-5 text-muted-foreground">{i + 1}</span>
                  <Link href={`/painel/placas/${p.codigo}`} className="min-w-0 flex-1 truncate font-medium hover:underline">{p.nome}</Link>
                  <span className="text-muted-foreground">{p.total} {p.total === 1 ? "leitura" : "leituras"}</span>
                </li>
              ))}
            </ol>
          )}
        </Cartao>

        <Cartao titulo="Vendas recentes" acao={<Link href="/painel/placas" className={botaoLeve}>Ver placas</Link>}>
          {vendas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma venda registrada. Informe o valor ao ativar uma placa.</p>
          ) : (
            <ul className="grid gap-3 text-sm">
              {vendas.map((v) => (
                <li key={v.codigo} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/painel/placas/${v.codigo}`} className="block truncate font-medium hover:underline">{v.nome}</Link>
                    <p className="truncate text-xs text-muted-foreground">{v.forma_pagamento ?? "Pagamento não informado"} · {quando(v.ativada_em)}</p>
                  </div>
                  <span className="font-semibold">{reais(v.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </Cartao>
      </div>

      {destinos.length > 0 && (
        <Cartao titulo="Destino das placas">
          <ul className="flex flex-wrap gap-2 text-sm">
            {destinos.map((d) => (
              <li key={d.tipo} className="rounded-lg border border-border px-3 py-1.5">{rotuloDestino(d.tipo)} <b>{d.total}</b></li>
            ))}
          </ul>
        </Cartao>
      )}
    </>
  );
}
