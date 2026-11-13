import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { db, type Placa } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { limparPlaca, salvarPlaca } from "../../actions";
import { Aviso, Campo, Cartao, Status, botao, botaoLeve, entrada, quando } from "../../ui";
import { CamposPlaca, CopiarLink } from "./campos";

type Detalhe = Placa & { ativada_em: string | null; destino: string | null; total: number; mes: number; ultimo: string | null };

export default async function PlacaPage({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const codigo = (await params).codigo.toUpperCase();
  // Quem chega pelo scan de uma placa em estoque volta para cá depois da senha.
  await exigirLogin(/^[A-Z0-9]{1,12}$/.test(codigo) ? `/painel/placas/${codigo}` : undefined);
  const { ok, erro } = await searchParams;
  const sql = db();

  const [[placa], clientes] = (await Promise.all([
    sql`select p.*,
          coalesce(p.destino_link, case when coalesce(p.destino_tipo, 'avaliacao') = 'avaliacao' then c.link_avaliacao end) as destino,
          (select count(*) from toques t where t.codigo = p.codigo)::int as total,
          (select count(*) from toques t where t.codigo = p.codigo and t.criado_em > now() - interval '30 days')::int as mes,
          (select max(criado_em) from toques t where t.codigo = p.codigo) as ultimo
        from placas p left join clientes c on c.id = p.cliente_id where p.codigo = ${codigo}`,
    sql`select id, nome from clientes order by nome`,
  ])) as [Detalhe[], { id: number; nome: string }[]];
  if (!placa) notFound();

  const link = `https://igorgois.dev/r/${placa.codigo}`;
  const qr = await QRCode.toString(link, { type: "svg", margin: 2, errorCorrectionLevel: "M" });

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <Link href="/painel" className="w-fit text-sm text-muted-foreground hover:underline">← Voltar ao painel</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-semibold">{placa.codigo}</h1>
        <Status ativa={placa.ativa} temCliente={!!placa.cliente_id} temDestino={!!placa.destino} />
      </div>
      <Aviso ok={ok} erro={erro} />
      {placa.cliente_id && !placa.destino && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Esta placa tem cliente, mas não tem destino. Preencha o link abaixo ou o link de avaliação no cadastro do cliente.
        </p>
      )}

      <Cartao titulo={placa.cliente_id ? "Editar placa" : "Ativar placa"}>
        <form action={salvarPlaca} className="grid gap-4">
          <input type="hidden" name="codigo" value={placa.codigo} />
          <CamposPlaca
            clientes={clientes}
            clienteId={placa.cliente_id}
            nome={placa.nome}
            destinoTipo={placa.destino_tipo}
            destinoLink={placa.destino_link}
            valorVenda={placa.valor_venda}
            formaPagamento={placa.forma_pagamento}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="ativa" defaultChecked={placa.ativa} />
            Placa ligada (desmarque para pausar sem tirar do cliente, por exemplo se ele parar de pagar)
          </label>
          <Campo rotulo="Observações"><textarea name="observacoes" rows={2} defaultValue={placa.observacoes ?? ""} className={entrada} /></Campo>
          <div className="flex flex-wrap gap-3">
            <button className={botao}>Salvar</button>
            {placa.cliente_id && <Link href={`/painel/clientes/${placa.cliente_id}`} className={botaoLeve}>Abrir cliente</Link>}
          </div>
        </form>
      </Cartao>

      <section id="qr" className="scroll-mt-6">
        <Cartao titulo="QR Code e link">
          <div className="flex flex-wrap items-center gap-5">
            <div className="w-40 shrink-0 overflow-hidden rounded-lg bg-white" dangerouslySetInnerHTML={{ __html: qr }} />
            <div className="grid min-w-0 gap-3">
              <p className="break-all font-mono text-sm">{link}</p>
              <div className="flex flex-wrap gap-2">
                <CopiarLink link={link} />
                <a href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr)}`} download={`${placa.codigo}.svg`} className={botaoLeve}>Baixar QR (SVG)</a>
                <a href={link} target="_blank" rel="noreferrer" className={botaoLeve}>Testar</a>
              </div>
              <p className="text-xs text-muted-foreground">O link nunca muda: é o que está gravado no NFC e impresso na placa. O botão “Testar” também conta uma leitura.</p>
            </div>
          </div>
        </Cartao>
      </section>

      <Cartao titulo="Números">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div><dt className="text-muted-foreground">Ligada em</dt><dd>{quando(placa.ativada_em)}</dd></div>
          <div><dt className="text-muted-foreground">Leituras em 30 dias</dt><dd>{placa.mes}</dd></div>
          <div><dt className="text-muted-foreground">Leituras no total</dt><dd>{placa.total}</dd></div>
          <div><dt className="text-muted-foreground">Última leitura</dt><dd>{quando(placa.ultimo)}</dd></div>
        </dl>
      </Cartao>

      {(placa.cliente_id || placa.total > 0) && (
        <Cartao titulo="Limpar dados da placa">
          <form action={limparPlaca} className="grid gap-3">
            <input type="hidden" name="codigo" value={placa.codigo} />
            <p className="text-sm text-muted-foreground">
              A placa volta ao estoque em branco: cliente, nome, destino, valor da venda e todo o histórico de leituras são apagados e não dá para desfazer. O cadastro do cliente continua. O link impresso continua valendo: é só ativar de novo.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="confirmo" value="sim" />
              Confirmo: limpar a placa {placa.codigo}.
            </label>
            <button className="w-fit rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Limpar placa</button>
          </form>
        </Cartao>
      )}
    </main>
  );
}
