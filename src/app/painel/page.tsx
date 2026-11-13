import Link from "next/link";
import { db, faltaColuna, faltaTabela } from "@/lib/db";
import { rotuloDestino } from "@/lib/destinos";
import { exigirLogin } from "@/lib/painel-auth";
import { alternarPlaca, criarLote, prepararBanco, sair } from "./actions";
import { Aviso, Cartao, Status, botao, botaoLeve, entrada, linkWhatsapp, quando, reais } from "./ui";

type LinhaPlaca = {
  codigo: string; ativa: boolean; cliente_id: number | null; nome: string | null; whatsapp: string | null;
  nome_placa: string | null; destino_tipo: string | null; destino: string | null; valor: number | null;
  total: number; mes: number; ultimo: string | null;
};
type LinhaCliente = { id: number; nome: string; cidade: string | null; whatsapp: string | null; placas: string; mes: number };

export default async function Painel({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  let dados: [LinhaPlaca[], LinhaCliente[]];
  try {
    dados = (await Promise.all([
      sql`select p.codigo, p.ativa, p.cliente_id, c.nome, c.whatsapp,
            p.nome as nome_placa, p.destino_tipo, p.valor_venda::float8 as valor,
            coalesce(p.destino_link, case when coalesce(p.destino_tipo, 'avaliacao') = 'avaliacao' then c.link_avaliacao end) as destino,
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
    if (!faltaTabela(e) && !faltaColuna(e)) throw e;
    const novo = faltaTabela(e);
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16">
        <h1 className="text-2xl font-semibold">{novo ? "Preparar o banco" : "Atualizar o banco"}</h1>
        <p className="text-sm text-muted-foreground">
          {novo
            ? "O banco está conectado, mas as tabelas ainda não existem. Clique uma vez para criar as tabelas e cadastrar as placas A001 a A020."
            : "O painel ganhou campos novos nas placas (destino, nome e venda). Clique uma vez para criar as colunas. Nenhum dado é apagado e as placas seguem funcionando."}
        </p>
        <form action={prepararBanco}><button className={botao}>{novo ? "Preparar banco" : "Atualizar banco"}</button></form>
      </main>
    );
  }
  const [placas, clientes] = dados;

  const estoque = placas.filter((p) => !p.cliente_id);
  const emUso = placas.filter((p) => p.cliente_id);
  const ativas = emUso.filter((p) => p.ativa && p.destino).length;
  const vendido = emUso.reduce((soma, p) => soma + (p.valor ?? 0), 0);
  const toquesMes = placas.reduce((soma, p) => soma + p.mes, 0);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">igorgois.dev</p>
          <h1 className="text-2xl font-semibold">Placas de avaliação</h1>
        </div>
        <form action={sair}><button className={botaoLeve}>Sair</button></form>
      </header>

      <Aviso ok={ok} erro={erro} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Placas ativas", ativas],
          ["Em estoque", estoque.length],
          ["Leituras em 30 dias", toquesMes],
          ["Total vendido", reais(vendido)],
        ].map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{rotulo}</p>
            <p className="text-2xl font-semibold">{valor}</p>
          </div>
        ))}
      </div>

      <Cartao titulo="Minhas placas">
        {emUso.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma placa ativada ainda. Escolha uma do estoque abaixo ou escaneie o QR Code da placa física.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {emUso.map((p) => {
              const wa = linkWhatsapp(p.whatsapp);
              return (
                <li key={p.codigo} className="flex flex-col gap-3 rounded-xl border border-border p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">{p.nome_placa ?? p.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        <span className="font-mono">{p.codigo}</span>
                        {p.nome_placa && <> · <Link href={`/painel/clientes/${p.cliente_id}`} className="hover:underline">{p.nome}</Link></>}
                      </p>
                    </div>
                    <Status ativa={p.ativa} temCliente temDestino={!!p.destino} />
                  </div>
                  <dl className="grid gap-1">
                    <div><dt className="inline text-muted-foreground">Destino: </dt><dd className="inline font-medium">{rotuloDestino(p.destino_tipo)}</dd></div>
                    <div><dt className="inline text-muted-foreground">Leituras: </dt><dd className="inline">{p.total} no total · {p.mes} em 30 dias</dd></div>
                    <div><dt className="inline text-muted-foreground">Última: </dt><dd className="inline">{quando(p.ultimo)}</dd></div>
                    {p.valor !== null && <div><dt className="inline text-muted-foreground">Venda: </dt><dd className="inline">{reais(p.valor)}</dd></div>}
                  </dl>
                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <Link href={`/painel/placas/${p.codigo}`} className={botaoLeve}>Editar</Link>
                    <Link href={`/painel/placas/${p.codigo}#qr`} className={botaoLeve}>Ver QR Code</Link>
                    {wa && <a href={wa} target="_blank" rel="noreferrer" className={botaoLeve}>WhatsApp</a>}
                    <form action={alternarPlaca} className="ml-auto">
                      <input type="hidden" name="codigo" value={p.codigo} />
                      <button className={botaoLeve}>{p.ativa ? "Pausar" : "Ligar"}</button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Cartao>

      <Cartao titulo={`Em estoque (${estoque.length})`}>
        {estoque.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma placa em estoque. Cadastre um lote novo abaixo.</p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2">
              {estoque.map((p) => (
                <li key={p.codigo}>
                  <Link href={`/painel/placas/${p.codigo}`} className="inline-block rounded-lg border border-border px-3 py-1.5 font-mono text-sm hover:bg-muted">{p.codigo}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Toque em um código para ativar. Com a placa na mão, escaneie o QR Code dela e toque em “Sou o responsável: ativar esta placa”.</p>
          </>
        )}
      </Cartao>

      <Cartao titulo="Clientes" acao={<Link href="/painel/clientes/novo" className={botao}>Novo cliente</Link>}>
        {clientes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente ainda. Cadastre o primeiro e ligue uma placa a ele.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 pr-4">Cliente</th><th className="py-2 pr-4">Cidade</th><th className="py-2 pr-4">Placas</th><th className="py-2 pr-4">Leituras 30 dias</th><th className="py-2">WhatsApp</th></tr>
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

      <Cartao titulo="Cadastrar lote de placas">
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
