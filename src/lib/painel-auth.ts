import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "painel";

/** O valor do cookie deriva da senha: trocar PAINEL_SENHA derruba todas as sessões. */
function token() {
  const senha = process.env.PAINEL_SENHA;
  if (!senha) return null;
  return createHmac("sha256", senha).update("gois-painel-v1").digest("hex");
}

function iguais(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function logado() {
  const esperado = token();
  const atual = (await cookies()).get(COOKIE)?.value;
  return !!esperado && !!atual && iguais(atual, esperado);
}

/** Chamar no começo de toda página e de toda server action do painel. */
export async function exigirLogin() {
  if (!(await logado())) redirect("/painel/entrar");
}

export function senhaConfere(senha: string) {
  const certa = process.env.PAINEL_SENHA;
  return !!certa && iguais(senha, certa);
}

export async function abrirSessao() {
  (await cookies()).set(COOKIE, token()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/painel",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function fecharSessao() {
  (await cookies()).delete({ name: COOKIE, path: "/painel" });
}
