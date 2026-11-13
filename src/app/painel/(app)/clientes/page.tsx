import Link from "next/link";
import { db } from "@/lib/db";
import { exigirLogin } from "@/lib/painel-auth";
import { comBanco } from "@/lib/painel-banco";
import { Aviso, Titulo, botao, linkWhatsapp } from "@/app/painel/ui";

type Linha = { id: number; nome: string; cidade: string | null; whatsapp: string | null; placas: string; mes: number };

export default async function Clientes({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await exigirLogin();
  const { ok, erro } = await searchParams;
  const sql = db();

  const clientes = (await comBanco(() => sql`
    select c.id, c.nome, c.cidade, c.whatsapp,
      coalesce(string_agg(p.codigo, ', ' order by p.codigo), '') as placas,
      (select count(*) from toques t where t.cliente_id = c.id and t.criado_em > now() - interval '30 days')::int as mes
    from clientes c left join placas p on p.cliente_id = c.id
    group by c.id order by c.nome`)) as Linha[];

  return (
    <>
      <Titulo titulo="Clientes" texto="Os estabelecimentos que usam suas placas." acao={<Link href="/painel/clientes/novo" className={botao}>Novo cliente</Link>} />
      <Aviso ok={ok} erro={erro} />

      {clientes.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Nenhum cliente ainda. Cadastre o primeiro aqui ou direto ao ativar uma placa.</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {clientes.map((c) => {
            const wa = linkWhatsapp(c.whatsapp);
            return (
              <li key={c.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-sm">
                <div className="min-w-0 flex-1">
                  <Link href={`/painel/clientes/${c.id}`} className="block truncate text-base font-semibold hover:underline">{c.nome}</Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.cidade ?? "Cidade não informada"} · {c.placas ? <>placas <span className="font-mono">{c.placas}</span></> : "sem placa"} · {c.mes} leituras em 30 dias
                  </p>
                </div>
                {wa && <a href={wa} target="_blank" rel="noreferrer" className={botao}>WhatsApp</a>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
