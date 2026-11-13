import { redirect } from "next/navigation";
import { faltaColuna, faltaTabela } from "./db";

/** Roda as consultas de uma página; se o banco estiver sem tabelas ou colunas, manda para o Dashboard, que oferece "Atualizar banco". */
export async function comBanco<T>(consultas: () => Promise<T>): Promise<T> {
  try {
    return await consultas();
  } catch (erro) {
    if (!faltaTabela(erro) && !faltaColuna(erro)) throw erro;
    redirect("/painel");
  }
}
