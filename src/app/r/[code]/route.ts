import { after } from "next/server";
import { db, faltaColuna } from "@/lib/db";

// O destino muda quando uma placa é ativada ou trocada de cliente: nunca guardar em cache.
export const dynamic = "force-dynamic";

const pagina = (titulo: string, texto: string, extra = "") => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${titulo}</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f5f2; color: #1d1d1f;
    font: 17px/1.5 system-ui, -apple-system, sans-serif; padding: 24px; box-sizing: border-box; text-align: center; }
  @media (prefers-color-scheme: dark) { body { background: #141414; color: #f2f2f2; } }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p { margin: 0 auto; opacity: .75; max-width: 32ch; }
  a { display: inline-block; margin-top: 28px; font-size: 14px; color: inherit; opacity: .6; }
</style></head>
<body><main><h1>${titulo}</h1><p>${texto}</p>${extra}</main></body></html>`;

const semCache = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const html = (status: number, titulo: string, texto: string, extra = "") =>
  new Response(pagina(titulo, texto, extra), { status, headers: { ...semCache, "Content-Type": "text/html; charset=utf-8" } });

type Linha = { codigo: string; ativa: boolean; cliente_id: number | null; destino: string | null };

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase();

  if (!/^[A-Z0-9]{1,12}$/.test(code)) return html(404, "Código não encontrado", "Confira o endereço ou aproxime o celular da placa de novo.");

  let placa: Linha | undefined;
  try {
    const sql = db();
    try {
      // O destino próprio da placa vale primeiro; a de avaliação sem link usa o do cadastro do cliente.
      [placa] = (await sql`
        select p.codigo, p.ativa, p.cliente_id,
          coalesce(p.destino_link, case when coalesce(p.destino_tipo, 'avaliacao') = 'avaliacao' then c.link_avaliacao end) as destino
        from placas p left join clientes c on c.id = p.cliente_id
        where p.codigo = ${code}
      `) as Linha[];
    } catch (erro) {
      if (!faltaColuna(erro)) throw erro;
      // Banco ainda sem as colunas de destino (falta "Atualizar banco" no painel): as placas seguem funcionando.
      [placa] = (await sql`
        select p.codigo, p.ativa, p.cliente_id, c.link_avaliacao as destino
        from placas p left join clientes c on c.id = p.cliente_id
        where p.codigo = ${code}
      `) as Linha[];
    }
  } catch (erro) {
    console.error("[avaliacao] banco indisponível", erro);
    return html(503, "Tente de novo em instantes", "Não conseguimos abrir a página agora.");
  }

  if (!placa) return html(404, "Código não encontrado", "Confira o endereço ou aproxime o celular da placa de novo.");

  if (!placa.ativa || !placa.cliente_id || !placa.destino) {
    // Placa em estoque: quem cuida do painel ativa por aqui (o painel pede a senha).
    const ativar = placa.cliente_id ? "" : `<a href="/painel/placas/${code}">Sou o responsável: ativar esta placa</a>`;
    return html(200, "Placa ainda não ativada", "Esta placa ainda não foi ligada a uma empresa. Fale com o estabelecimento.", ativar);
  }

  const clienteId = placa.cliente_id;
  // Conta o toque depois de responder, para o redirecionamento não esperar o banco.
  after(async () => {
    try {
      await db()`insert into toques (codigo, cliente_id) values (${code}, ${clienteId})`;
    } catch (erro) {
      console.error("[avaliacao] falha ao contar toque", erro);
    }
  });

  return new Response(null, { status: 302, headers: { ...semCache, Location: placa.destino } });
}
