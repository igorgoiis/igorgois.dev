"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const d = (caminho: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden>
    <path d={caminho} />
  </svg>
);

const GRUPOS = [
  {
    titulo: "Painel",
    itens: [
      { href: "/painel", rotulo: "Dashboard", icone: d("M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-3H4v3Z") },
      { href: "/painel/placas", rotulo: "Minhas placas", icone: d("M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm4 0h2v2h-2v-2Z") },
      { href: "/painel/clientes", rotulo: "Clientes", icone: d("M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m16 0v-1.5a3.5 3.5 0 0 0-2.5-3.35M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm5.5-6.85a3.5 3.5 0 0 1 0 6.7") },
    ],
  },
  {
    titulo: "Estoque",
    itens: [{ href: "/painel/lotes", rotulo: "Cadastrar placas", icone: d("M12 5v14m-7-7h14") }],
  },
];

export function Menu() {
  const caminho = usePathname();
  const ativo = (href: string) => (href === "/painel" ? caminho === href : caminho.startsWith(href));

  return (
    <nav aria-label="Painel" className="flex gap-1 overflow-x-auto md:flex-col md:gap-5 md:overflow-visible">
      {GRUPOS.map((grupo) => (
        <div key={grupo.titulo} className="flex gap-1 md:flex-col">
          <p className="hidden px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:block">{grupo.titulo}</p>
          {grupo.itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo(item.href) ? "page" : undefined}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                ativo(item.href) ? "bg-status/15 font-semibold text-status" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icone}
              {item.rotulo}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
