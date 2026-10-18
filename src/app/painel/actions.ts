"use server";

import { redirect } from "next/navigation";
import { db, linkValido } from "@/lib/db";
import { SCHEMA } from "@/lib/schema";
import { abrirSessao, exigirLogin, fecharSessao, senhaConfere } from "@/lib/painel-auth";

const texto = (f: FormData, campo: string) => String(f.get(campo) ?? "").trim();
const opcional = (f: FormData, campo: string) => texto(f, campo) || null;
const comErro = (caminho: string, msg: string) => redirect(`${caminho}?erro=${encodeURIComponent(msg)}`);

export async function entrar(f: FormData) {
  if (!senhaConfere(texto(f, "senha"))) {
    // Atraso simples contra tentativas em sequência.
    await new Promise((r) => setTimeout(r, 1000));
    redirect("/painel/entrar?erro=1");
  }
  await abrirSessao();
  redirect("/painel");
}

export async function sair() {
  await fecharSessao();
  redirect("/painel/entrar");
}

export async function salvarCliente(f: FormData) {
  await exigirLogin();
  const id = texto(f, "id");
  const voltar = `/painel/clientes/${id || "novo"}`;
  const nome = texto(f, "nome");
  const link = linkValido(texto(f, "link_avaliacao"));
  if (!nome) comErro(voltar, "Informe o nome do cliente.");
  if (!link) comErro(voltar, "O link de avaliação precisa começar com https://");

  const sql = db();
  const dados = [nome, opcional(f, "whatsapp"), opcional(f, "cidade"), link, opcional(f, "observacoes")] as const;
  let clienteId = Number(id);
  if (id && id !== "novo") {
    await sql`update clientes set nome = ${dados[0]}, whatsapp = ${dados[1]}, cidade = ${dados[2]},
      link_avaliacao = ${dados[3]}, observacoes = ${dados[4]} where id = ${clienteId}`;
  } else {
    const [novo] = await sql`insert into clientes (nome, whatsapp, cidade, link_avaliacao, observacoes)
      values (${dados[0]}, ${dados[1]}, ${dados[2]}, ${dados[3]}, ${dados[4]}) returning id`;
    clienteId = novo.id;
  }
  redirect(`/painel/clientes/${clienteId}?ok=salvo`);
}

export async function excluirCliente(f: FormData) {
  await exigirLogin();
  const id = Number(texto(f, "id"));
  if (texto(f, "confirmo") !== "sim") comErro(`/painel/clientes/${id}`, "Marque a confirmação para excluir.");
  // As placas do cliente voltam para o estoque (on delete set null).
  await db()`delete from clientes where id = ${id}`;
  redirect("/painel?ok=excluido");
}

export async function ligarPlaca(f: FormData) {
  await exigirLogin();
  const clienteId = Number(texto(f, "cliente_id"));
  const codigo = texto(f, "codigo").toUpperCase();
  if (!codigo) comErro(`/painel/clientes/${clienteId}`, "Escolha uma placa do estoque.");
  await db()`update placas set cliente_id = ${clienteId}, ativa = true, ativada_em = now()
    where codigo = ${codigo} and cliente_id is null`;
  redirect(`/painel/clientes/${clienteId}?ok=placa`);
}

export async function desligarPlaca(f: FormData) {
  await exigirLogin();
  const codigo = texto(f, "codigo");
  await db()`update placas set cliente_id = null, ativada_em = null where codigo = ${codigo}`;
  redirect(`${texto(f, "voltar") || "/painel"}?ok=placa`);
}

export async function salvarPlaca(f: FormData) {
  await exigirLogin();
  const codigo = texto(f, "codigo");
  const clienteId = texto(f, "cliente_id") ? Number(texto(f, "cliente_id")) : null;
  const ativa = f.get("ativa") === "on";
  await db()`update placas set
      ativada_em = case when cliente_id is distinct from ${clienteId} then (case when ${clienteId}::int is null then null else now() end) else ativada_em end,
      cliente_id = ${clienteId}, ativa = ${ativa}, observacoes = ${opcional(f, "observacoes")}
    where codigo = ${codigo}`;
  redirect(`/painel/placas/${codigo}?ok=salvo`);
}

export async function criarLote(f: FormData) {
  await exigirLogin();
  const prefixo = texto(f, "prefixo").toUpperCase();
  const de = Number(texto(f, "de"));
  const ate = Number(texto(f, "ate"));
  if (!/^[A-Z]{1,3}$/.test(prefixo)) comErro("/painel", "O prefixo deve ter de 1 a 3 letras.");
  if (!Number.isInteger(de) || !Number.isInteger(ate) || de < 1 || ate > 999 || ate < de || ate - de > 499) {
    comErro("/painel", "Use números de 1 a 999, no máximo 500 placas por lote.");
  }
  await db()`insert into placas (codigo)
    select ${prefixo} || lpad(n::text, 3, '0') from generate_series(${de}::int, ${ate}::int) as n
    on conflict (codigo) do nothing`;
  redirect("/painel?ok=lote");
}

export async function prepararBanco() {
  await exigirLogin();
  const sql = db();
  for (const comando of SCHEMA) await sql.query(comando);
  redirect("/painel?ok=banco");
}
