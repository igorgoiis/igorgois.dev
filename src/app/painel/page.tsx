import Link from "next/link";
import { db, faltaTabela } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { criarLote, prepararBanco, sair } from "./actions";
import { Aviso, Cartao, Status, botao, botaoLeve, entrada, linkWhatsapp, quando } from "./ui";

type LinhaPlaca = { codigo: string; ativa: boolean; cliente_id: number | null; nome: string | null; total: number; mes: number; ultimo: string | null };
type LinhaCliente = { id: number; nome: string; cidade: string | null; whatsapp: string | null; placas: string; mes: number };

export default async function Painel({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  let dados: [LinhaPlaca[], LinhaCliente[]];
  try {
    dados = (await Promise.all([
      sql`select p.codigo, p.ativa, p.cliente_id, c.nome,
            (select count(*) from toques t where t.codigo = p.codigo)::int as total,
            (select count(*) from toques t where t.codigo = p.codigo and t.criado_em > now() - interval '30 days')::int as mes,
            (select max(criado_em) from toques t where t.codigo = p.codigo) as ultimo
          from placas p left join clientes c on c.id = p.cliente_id
          order by p.codigo`,
      sql`select c.id, c.nome, c.cidade, c.whatsapp,
            coalesce(string_agg(p.codigo, ', ' order by p.codigo), '') as placas,
            (select count(*) from toques t where t.cliente_id = c.id and t.criado_em > now() - interval '30 days')::int as mes
          from clientes c left join placas p on p.cliente_id = c.id
          group by c.id order by c.nome`,
    ])) as [LinhaPlaca[], LinhaCliente[]];
  } catch (e) {
    if (!faltaTabela(e)) throw e;
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16">
        <h1 className="text-2xl font-semibold">Preparar o banco</h1>
        <p className="text-sm text-muted-foreground">O banco está conectado, mas as tabelas ainda não existem. Clique uma vez para criar as tabelas e cadastrar as placas A001 a A020.</p>
        <form action={prepararBanco}><button className={botao}>Preparar banco</button></form>
      </main>
    );
  }
  const [placas, clientes] = dados;

  const emEstoque = placas.filter((p) => !p.cliente_id).length;
  const ativas = placas.filter((p) => p.cliente_id && p.ativa).length;
  const toquesMes = placas.reduce((soma, p) => soma + p.mes, 0);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Gois.dev</p>
          <h1 className="text-2xl font-semibold">Placas de avaliação</h1>
        </div>
        <form action={sair}><button className={botaoLeve}>Sair</button></form>
      </header>

      <Aviso ok={ok} erro={erro} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Clientes", clientes.length],
          ["Placas ativas", ativas],
          ["Em estoque", emEstoque],
          ["Toques em 30 dias", toquesMes],
        ].map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{rotulo}</p>
            <p className="text-2xl font-semibold">{valor}</p>
          </div>
        ))}
      </div>

      <Cartao titulo="Clientes" acao={<Link href="/painel/clientes/novo" className={botao}>Novo cliente</Link>}>
        {clientes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente ainda. Cadastre o primeiro e ligue uma placa a ele.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 pr-4">Cliente</th><th className="py-2 pr-4">Cidade</th><th className="py-2 pr-4">Placas</th><th className="py-2 pr-4">Toques 30 dias</th><th className="py-2">WhatsApp</th></tr>
              </thead>
              <tbody>
                {clientes.map((c) => {
                  const wa = linkWhatsapp(c.whatsapp);
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="py-2 pr-4"><Link href={`/painel/clientes/${c.id}`} className="font-medium underline-offset-2 hover:underline">{c.nome}</Link></td>
                      <td className="py-2 pr-4">{c.cidade ?? "—"}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{c.placas || "—"}</td>
                      <td className="py-2 pr-4">{c.mes}</td>
                      <td className="py-2">{wa ? <a href={wa} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{c.whatsapp}</a> : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Cartao>

      <Cartao titulo="Placas">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr><th className="py-2 pr-4">Código</th><th className="py-2 pr-4">Situação</th><th className="py-2 pr-4">Cliente</th><th className="py-2 pr-4">Toques (30 dias / total)</th><th className="py-2">Último toque</th></tr>
            </thead>
            <tbody>
              {placas.map((p) => (
                <tr key={p.codigo} className="border-t border-border">
                  <td className="py-2 pr-4"><Link href={`/painel/placas/${p.codigo}`} className="font-mono font-medium underline-offset-2 hover:underline">{p.codigo}</Link></td>
                  <td className="py-2 pr-4"><Status ativa={p.ativa} temCliente={!!p.cliente_id} /></td>
                  <td className="py-2 pr-4">{p.cliente_id ? <Link href={`/painel/clientes/${p.cliente_id}`} className="underline-offset-2 hover:underline">{p.nome}</Link> : "—"}</td>
                  <td className="py-2 pr-4">{p.mes} / {p.total}</td>
                  <td className="py-2">{quando(p.ultimo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Cartao>

      <Cartao titulo="Novo lote de placas">
        <form action={criarLote} className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm"><span>Prefixo</span><input name="prefixo" defaultValue="A" required maxLength={3} className={`${entrada} w-20 uppercase`} /></label>
          <label className="grid gap-1 text-sm"><span>De</span><input name="de" type="number" min={1} max={999} required className={`${entrada} w-24`} /></label>
          <label className="grid gap-1 text-sm"><span>Até</span><input name="ate" type="number" min={1} max={999} required className={`${entrada} w-24`} /></label>
          <button className={botao}>Criar placas</button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">Use quando chegar um lote novo. Exemplo: prefixo A, de 21 até 120 cria A021 a A120. Os links ficam https://igorgois.dev/r/CÓDIGO.</p>
      </Cartao>
    </main>
  );
}
