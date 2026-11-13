import { db } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { comBanco } from "@/lib/painel-banco";
import { criarLote } from "@/app/painel/actions";
import { Aviso, Cartao, Titulo, botao, entrada } from "@/app/painel/ui";

type Lote = { prefixo: string; total: number; estoque: number; primeiro: string; ultimo: string };

export default async function Lotes({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  const lotes = (await comBanco(() => sql`
    select regexp_replace(codigo, '[0-9]+$', '') as prefixo, count(*)::int as total,
      count(*) filter (where cliente_id is null)::int as estoque, min(codigo) as primeiro, max(codigo) as ultimo
    from placas group by 1 order by 1`)) as Lote[];

  return (
    <>
      <Titulo titulo="Cadastrar placas" texto="Registre os códigos de um lote novo antes de mandar gravar as placas." />
      <Aviso ok={ok} erro={erro} />

      <Cartao titulo="Novo lote">
        <form action={criarLote} className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm"><span>Prefixo</span><input name="prefixo" defaultValue="A" required maxLength={3} className={`${entrada} w-20 uppercase`} /></label>
          <label className="grid gap-1 text-sm"><span>De</span><input name="de" type="number" min={1} max={999} required className={`${entrada} w-24`} /></label>
          <label className="grid gap-1 text-sm"><span>Até</span><input name="ate" type="number" min={1} max={999} required className={`${entrada} w-24`} /></label>
          <button className={botao}>Criar placas</button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">Exemplo: prefixo A, de 21 até 120 cria A021 a A120. O link de cada placa fica https://igorgois.dev/r/CÓDIGO e nunca muda. Códigos que já existem são mantidos.</p>
      </Cartao>

      <Cartao titulo="Placas cadastradas">
        {lotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma placa cadastrada.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {lotes.map((l) => (
              <li key={l.prefixo} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border px-3 py-2">
                <span className="font-mono font-semibold">{l.primeiro} a {l.ultimo}</span>
                <span className="text-muted-foreground">{l.total} placas</span>
                <span className="ml-auto text-muted-foreground">{l.estoque} em estoque · {l.total - l.estoque} em uso</span>
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </>
  );
}
