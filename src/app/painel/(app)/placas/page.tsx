import Link from "next/link";
import { db } from "@/lib/db";
import { rotuloDestino } from "@/lib/destinos";
import { exigirLogin } from "@/lib/painel-auth";
import { comBanco } from "@/lib/painel-banco";
import { alternarPlaca } from "@/app/painel/actions";
import { Aviso, Cartao, Status, Titulo, botao, botaoLeve, linkWhatsapp, quando, reais } from "@/app/painel/ui";

type Linha = {
  codigo: string; ativa: boolean; cliente_id: number | null; nome: string | null; whatsapp: string | null;
  nome_placa: string | null; destino_tipo: string | null; destino: string | null; valor: number | null;
  total: number; mes: number; ultimo: string | null;
};

export default async function Placas({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  const placas = (await comBanco(() => sql`
    select p.codigo, p.ativa, p.cliente_id, c.nome, c.whatsapp,
      p.nome as nome_placa, p.destino_tipo, p.valor_venda::float8 as valor,
      coalesce(p.destino_link, case when coalesce(p.destino_tipo, 'avaliacao') = 'avaliacao' then c.link_avaliacao end) as destino,
      (select count(*) from toques t where t.codigo = p.codigo)::int as total,
      (select count(*) from toques t where t.codigo = p.codigo and t.criado_em > now() - interval '30 days')::int as mes,
      (select max(criado_em) from toques t where t.codigo = p.codigo) as ultimo
    from placas p left join clientes c on c.id = p.cliente_id
    order by p.codigo`)) as Linha[];

  const estoque = placas.filter((p) => !p.cliente_id);
  const emUso = placas.filter((p) => p.cliente_id);

  return (
    <>
      <Titulo titulo="Minhas placas" texto="Escaneie o QR Code da placa física para ativá-la, ou escolha um código do estoque." acao={<Link href="/painel/lotes" className={botao}>Cadastrar placas</Link>} />
      <Aviso ok={ok} erro={erro} />

      {emUso.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Nenhuma placa ativada ainda. Escolha uma do estoque abaixo.</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {emUso.map((p) => {
            const wa = linkWhatsapp(p.whatsapp);
            return (
              <li key={p.codigo} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-sm">
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

                {p.whatsapp && (
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Contato do estabelecimento</p>
                      <p className="truncate font-medium">{p.whatsapp}</p>
                    </div>
                    {wa && <a href={wa} target="_blank" rel="noreferrer" className={botao}>WhatsApp</a>}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <div>
                    <p className="font-medium">{p.ativa ? "Placa ligada" : "Placa pausada"}</p>
                    <p className="text-xs text-muted-foreground">{p.ativa ? (p.destino ? "Redirecionando normalmente" : "Falta informar o destino") : "Mostra “Placa ainda não ativada”"}</p>
                  </div>
                  <form action={alternarPlaca}>
                    <input type="hidden" name="codigo" value={p.codigo} />
                    <button
                      role="switch"
                      aria-checked={p.ativa}
                      aria-label={p.ativa ? `Pausar a placa ${p.codigo}` : `Ligar a placa ${p.codigo}`}
                      className={`relative h-6 w-11 rounded-full transition-colors ${p.ativa ? "bg-status" : "bg-muted-foreground/40"}`}
                    >
                      <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${p.ativa ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/painel/placas/${p.codigo}`} className={botaoLeve}>Editar</Link>
                  <Link href={`/painel/placas/${p.codigo}#qr`} className={botaoLeve}>Ver QR Code</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Cartao titulo={`Em estoque (${estoque.length})`}>
        {estoque.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma placa em estoque. Cadastre um lote novo em <Link href="/painel/lotes" className="text-status hover:underline">Cadastrar placas</Link>.</p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2">
              {estoque.map((p) => (
                <li key={p.codigo}>
                  <Link href={`/painel/placas/${p.codigo}`} className="inline-block rounded-lg border border-border px-3 py-1.5 font-mono text-sm hover:border-status hover:text-status">{p.codigo}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Toque em um código para ativar. Com a placa na mão, escaneie o QR Code dela e toque em “Sou o responsável: ativar esta placa”.</p>
          </>
        )}
      </Cartao>
    </>
  );
}
