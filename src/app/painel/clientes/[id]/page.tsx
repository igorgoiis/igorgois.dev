import Link from "next/link";
import { notFound } from "next/navigation";
import { db, pareceGoogle, type Cliente } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { desligarPlaca, excluirCliente, ligarPlaca, salvarCliente } from "../../actions";
import { Aviso, Campo, Cartao, Status, botao, botaoLeve, entrada, linkWhatsapp, quando } from "../../ui";

type PlacaDoCliente = { codigo: string; ativa: boolean; ativada_em: string | null; total: number; mes: number };
type Dia = { dia: string; total: number };

export default async function ClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirLogin();
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const novo = id === "novo";
  const sql = db();

  let cliente: Cliente | undefined;
  let placas: PlacaDoCliente[] = [];
  let livres: { codigo: string }[] = [];
  let dias: Dia[] = [];

  if (!novo) {
    const numero = Number(id);
    if (!Number.isInteger(numero)) notFound();
    [cliente] = (await sql`select * from clientes where id = ${numero}`) as Cliente[];
    if (!cliente) notFound();
    [placas, livres, dias] = (await Promise.all([
      sql`select p.codigo, p.ativa, p.ativada_em,
            (select count(*) from toques t where t.codigo = p.codigo)::int as total,
            (select count(*) from toques t where t.codigo = p.codigo and t.criado_em > now() - interval '30 days')::int as mes
          from placas p where p.cliente_id = ${numero} order by p.codigo`,
      sql`select codigo from placas where cliente_id is null order by codigo`,
      sql`select to_char(date_trunc('day', criado_em at time zone 'America/Recife'), 'DD/MM') as dia, count(*)::int as total
          from toques where cliente_id = ${numero} and criado_em > now() - interval '30 days'
          group by 1, date_trunc('day', criado_em at time zone 'America/Recife')
          order by date_trunc('day', criado_em at time zone 'America/Recife')`,
    ])) as [PlacaDoCliente[], { codigo: string }[], Dia[]];
  }

  const maior = Math.max(1, ...dias.map((d) => d.total));
  const wa = linkWhatsapp(cliente?.whatsapp ?? null);
  const voltar = `/painel/clientes/${id}`;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <Link href="/painel" className="w-fit text-sm text-muted-foreground hover:underline">← Voltar ao painel</Link>
      <h1 className="text-2xl font-semibold">{novo ? "Novo cliente" : cliente!.nome}</h1>
      <Aviso ok={ok} erro={erro} />

      <Cartao titulo="Dados do cliente">
        <form action={salvarCliente} className="grid gap-4">
          <input type="hidden" name="id" value={novo ? "" : id} />
          <Campo rotulo="Nome da empresa *"><input name="nome" required defaultValue={cliente?.nome} className={entrada} /></Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="WhatsApp"><input name="whatsapp" inputMode="tel" placeholder="(87) 99999-9999" defaultValue={cliente?.whatsapp ?? ""} className={entrada} /></Campo>
            <Campo rotulo="Cidade"><input name="cidade" placeholder="Petrolina" defaultValue={cliente?.cidade ?? ""} className={entrada} /></Campo>
          </div>
          <Campo
            rotulo="Link de avaliação no Google *"
            dica={<>No Perfil da Empresa no Google: <b>Pedir avaliações</b> → copiar o link (começa com https://g.page/r/…).</>}
          >
            <input name="link_avaliacao" type="url" required placeholder="https://g.page/r/..." defaultValue={cliente?.link_avaliacao} className={entrada} />
          </Campo>
          {cliente && !pareceGoogle(cliente.link_avaliacao) && (
            <p className="text-sm text-amber-700">Atenção: este link não parece ser do Google. Confira antes de entregar a placa.</p>
          )}
          <Campo rotulo="Observações"><textarea name="observacoes" rows={3} defaultValue={cliente?.observacoes ?? ""} className={entrada} /></Campo>
          <div className="flex flex-wrap gap-3">
            <button className={botao}>Salvar</button>
            {cliente && <a href={cliente.link_avaliacao} target="_blank" rel="noreferrer" className={botaoLeve}>Testar link</a>}
            {wa && <a href={wa} target="_blank" rel="noreferrer" className={botaoLeve}>Abrir WhatsApp</a>}
          </div>
        </form>
      </Cartao>

      {cliente && (
        <>
          <Cartao titulo="Placas do cliente">
            {placas.length === 0 ? (
              <p className="mb-4 text-sm text-muted-foreground">Nenhuma placa ligada ainda.</p>
            ) : (
              <ul className="mb-4 grid gap-2">
                {placas.map((p) => (
                  <li key={p.codigo} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                    <Link href={`/painel/placas/${p.codigo}`} className="font-mono font-semibold hover:underline">{p.codigo}</Link>
                    <Status ativa={p.ativa} temCliente />
                    <span className="text-muted-foreground">desde {quando(p.ativada_em)}</span>
                    <span className="text-muted-foreground">{p.mes} toques em 30 dias · {p.total} no total</span>
                    <form action={desligarPlaca} className="ml-auto">
                      <input type="hidden" name="codigo" value={p.codigo} />
                      <input type="hidden" name="voltar" value={voltar} />
                      <button className={botaoLeve}>Devolver ao estoque</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            {livres.length > 0 ? (
              <form action={ligarPlaca} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="cliente_id" value={cliente.id} />
                <Campo rotulo="Ligar placa do estoque">
                  <select name="codigo" required className={`${entrada} w-40`}>
                    {livres.map((l) => <option key={l.codigo}>{l.codigo}</option>)}
                  </select>
                </Campo>
                <button className={botao}>Ligar placa</button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">Não há placas em estoque. Crie um lote novo no painel.</p>
            )}
          </Cartao>

          <Cartao titulo="Toques nos últimos 30 dias">
            {dias.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum toque registrado ainda.</p>
            ) : (
              <ul className="grid gap-1.5">
                {dias.map((d) => (
                  <li key={d.dia} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-mono text-xs text-muted-foreground">{d.dia}</span>
                    <span className="h-3 rounded bg-foreground/70" style={{ width: `${(d.total / maior) * 100}%`, minWidth: 6 }} />
                    <span className="w-8 text-right">{d.total}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Cada toque no NFC ou leitura do QR conta uma vez. Nenhum dado do visitante é guardado.</p>
          </Cartao>

          <Cartao titulo="Excluir cliente">
            <form action={excluirCliente} className="grid gap-3">
              <input type="hidden" name="id" value={cliente.id} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="confirmo" value="sim" />
                Confirmo: excluir este cliente. As placas voltam para o estoque.
              </label>
              <button className="w-fit rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Excluir cliente</button>
            </form>
          </Cartao>
        </>
      )}
    </main>
  );
}
