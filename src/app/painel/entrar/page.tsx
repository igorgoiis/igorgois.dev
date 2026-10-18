import { redirect } from "next/navigation";
import { logado } from "@/lib/painel-auth";
import { entrar } from "../actions";
import { botao, entrada } from "../ui";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (await logado()) redirect("/painel");
  const { erro } = await searchParams;
  const configurado = !!process.env.PAINEL_SENHA;

  return (
    <main className="mx-auto grid min-h-screen max-w-sm place-items-center px-4">
      <form action={entrar} className="grid w-full gap-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Painel das placas</h1>
        {!configurado && <p className="text-sm text-red-700">Configure a variável PAINEL_SENHA na Vercel.</p>}
        {erro && <p className="text-sm text-red-700">Senha incorreta.</p>}
        <input name="senha" type="password" required autoFocus autoComplete="current-password" placeholder="Senha" className={entrada} />
        <button className={botao}>Entrar</button>
      </form>
    </main>
  );
}
