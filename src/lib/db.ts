import { neon } from "@neondatabase/serverless";

/** Conexão com o Neon. A integração da Vercel criou as variáveis com o prefixo "review_". */
export function db() {
  const url = process.env.review_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("review_DATABASE_URL não configurada");
  return neon(url);
}

export type Cliente = {
  id: number;
  nome: string;
  whatsapp: string | null;
  cidade: string | null;
  link_avaliacao: string | null;
  observacoes: string | null;
};

export type Placa = {
  codigo: string;
  cliente_id: number | null;
  ativa: boolean;
  observacoes: string | null;
  nome: string | null;
  destino_tipo: string | null;
  destino_link: string | null;
  valor_venda: string | null;
  forma_pagamento: string | null;
};

export { linkValido } from "./destinos";

const HOSTS_GOOGLE = ["g.page", "search.google.com", "maps.app.goo.gl", "goo.gl", "google.com", "www.google.com", "maps.google.com", "g.co"];
export const pareceGoogle = (valor: string) => {
  try {
    return HOSTS_GOOGLE.includes(new URL(valor).hostname);
  } catch {
    return false;
  }
};

/** Postgres devolve 42P01 quando a tabela ainda não existe. */
export const faltaTabela = (erro: unknown) => (erro as { code?: string })?.code === "42P01";
/** 42703: coluna que ainda não existe, ou seja, o banco é de uma versão anterior do painel. */
export const faltaColuna = (erro: unknown) => (erro as { code?: string })?.code === "42703";
