import Link from "next/link";
import { notFound } from "next/navigation";
import { db, type Placa } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { salvarPlaca } from "../../actions";
import { Aviso, Campo, Cartao, Status, botao, botaoLeve, entrada, quando } from "../../ui";

type Detalhe = Placa & { ativada_em: string | null; total: number; mes: number; ultimo: string | null };

export default async function PlacaPage({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirLogin();
  const codigo = (await params).codigo.toUpperCase();
  const { ok, erro } = await searchParams;
  const sql = db();

  const [[placa], clientes] = (await Promise.all([
    sql`select p.*, 
          (select count(*) from toques t where t.codigo = p.codigo)::int as total,
          (select count(*) from toques t where t.codigo = p.codigo and t.criado_em > now() - interval '30 days')::int as mes,
          (select max(criado_em) from toques t where t.codigo = p.codigo) as ultimo
        from placas p where p.codigo = ${codigo}`,
    sql`select id, nome from clientes order by nome`,
  ])) as [Detalhe[], { id: number; nome: string }[]];
  if (!placa) notFound();

  const link = `https://igorgois.dev/r/${placa.codigo}`;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <Link href="/painel" className="w-fit text-sm text-muted-foreground hover:underline">← Voltar ao painel</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-semibold">{placa.codigo}</h1>
        <Status ativa={placa.ativa} temCliente={!!placa.cliente_id} />
      </div>
      <Aviso ok={ok} erro={erro} />

      <Cartao titulo="Configuração">
        <form action={salvarPlaca} className="grid gap-4">
          <input type="hidden" name="codigo" value={placa.codigo} />
          <Campo rotulo="Cliente" dica="Sem cliente, a placa fica em estoque e mostra “Placa ainda não ativada”.">
            <select name="cliente_id" defaultValue={placa.cliente_id ?? ""} className={entrada}>
              <option value="">Em estoque (sem cliente)</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Campo>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="ativa" defaultChecked={placa.ativa} />
            Ativa (desmarque para pausar sem tirar do cliente, por exemplo se ele parar de pagar)
          </label>
          <Campo rotulo="Observações"><textarea name="observacoes" rows={2} defaultValue={placa.observacoes ?? ""} className={entrada} /></Campo>
          <div className="flex flex-wrap gap-3">
            <button className={botao}>Salvar</button>
            <a href={link} target="_blank" rel="noreferrer" className={botaoLeve}>Testar {link.replace("https://", "")}</a>
          </div>
        </form>
      </Cartao>

      <Cartao titulo="Números">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div><dt className="text-muted-foreground">Ligada em</dt><dd>{quando(placa.ativada_em)}</dd></div>
          <div><dt className="text-muted-foreground">Toques em 30 dias</dt><dd>{placa.mes}</dd></div>
          <div><dt className="text-muted-foreground">Toques no total</dt><dd>{placa.total}</dd></div>
          <div><dt className="text-muted-foreground">Último toque</dt><dd>{quando(placa.ultimo)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">Atenção: o botão “Testar” também conta um toque.</p>
      </Cartao>
    </main>
  );
}
