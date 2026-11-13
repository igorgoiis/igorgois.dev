import Link from "next/link";
import { exigirLogin } from "@/lib/painel-auth";
import { sair } from "../actions";
import { Menu } from "../menu";

export default async function PainelApp({ children }: { children: React.ReactNode }) {
  await exigirLogin();

  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-card px-4 py-3 md:h-screen md:gap-6 md:border-b-0 md:border-r md:px-3 md:py-5">
        <div className="flex items-center justify-between gap-3 md:px-3">
          <Link href="/painel" className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-status text-sm font-bold text-[#06210f]">P</span>
            Placas <span className="font-normal text-muted-foreground">igorgois.dev</span>
          </Link>
          <form action={sair} className="md:hidden">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Sair</button>
          </form>
        </div>
        <Menu />
        <form action={sair} className="mt-auto hidden md:block">
          <button className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Sair</button>
        </form>
      </aside>
      <main className="flex w-full min-w-0 max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
