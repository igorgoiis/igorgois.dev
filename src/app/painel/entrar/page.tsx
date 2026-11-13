import { redirect } from "next/navigation";
import { logado, voltarSeguro } from "@/lib/painel-auth";
import { entrar } from "../actions";
import { botao, entrada } from "../ui";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ erro?: string; voltar?: string }> }) {
  const { erro, voltar: pedido } = await searchParams;
  const voltar = voltarSeguro(pedido);
  if (await logado()) redirect(voltar ?? "/painel");
  const configurado = !!process.env.PAINEL_SENHA;

  return (
    <main className="mx-auto grid min-h-screen max-w-sm place-items-center px-4">
      <form action={entrar} className="grid w-full gap-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Painel das placas</h1>
        {voltar && <input type="hidden" name="voltar" value={voltar} />}
        {!configurado && <p className="text-sm text-red-300">Configure a variável PAINEL_SENHA na Vercel.</p>}
        {erro && <p className="text-sm text-red-300">Senha incorreta.</p>}
        <input name="senha" type="password" required autoFocus autoComplete="current-password" placeholder="Senha" className={entrada} />
        <button className={botao}>Entrar</button>
      </form>
    </main>
  );
}
