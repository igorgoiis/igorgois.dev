import type { ReactNode } from "react";

export const quando = (d: string | Date | null) =>
  d
    ? new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Recife", dateStyle: "short", timeStyle: "short" }).format(new Date(d))
    : "—";

export const linkWhatsapp = (numero: string | null) => {
  const digitos = (numero ?? "").replace(/\D/g, "");
  if (!digitos) return null;
  return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
};

const MENSAGENS: Record<string, string> = {
  salvo: "Salvo.",
  placa: "Placa atualizada.",
  lote: "Lote de placas criado.",
  excluido: "Cliente excluído. As placas dele voltaram para o estoque.",
  banco: "Banco preparado: tabelas criadas e placas A001 a A020 cadastradas.",
};

export function Aviso({ ok, erro }: { ok?: string; erro?: string }) {
  if (erro) return <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</p>;
  if (ok && MENSAGENS[ok]) return <p className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{MENSAGENS[ok]}</p>;
  return null;
}

export function Cartao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

export function Campo({ rotulo, dica, children }: { rotulo: string; dica?: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{rotulo}</span>
      {children}
      {dica && <span className="text-xs text-muted-foreground">{dica}</span>}
    </label>
  );
}

export const entrada = "w-full rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-foreground";
export const botao = "inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90";
export const botaoLeve = "inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted";

export function Status({ ativa, temCliente }: { ativa: boolean; temCliente: boolean }) {
  const [rotulo, cor] = !temCliente
    ? ["Em estoque", "bg-muted text-muted-foreground"]
    : ativa
      ? ["Ativa", "bg-green-100 text-green-800"]
      : ["Pausada", "bg-amber-100 text-amber-800"];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cor}`}>{rotulo}</span>;
}
