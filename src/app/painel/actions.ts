"use server";

import { redirect } from "next/navigation";
import { db, linkValido } from "@/lib/db";
import { SCHEMA } from "@/lib/schema";
import { PAGAMENTOS, ehDestino, montarDestino } from "@/lib/destinos";
import { abrirSessao, exigirLogin, fecharSessao, senhaConfere, voltarSeguro } from "@/lib/painel-auth";

const texto = (f: FormData, campo: string) => String(f.get(campo) ?? "").trim();
const opcional = (f: FormData, campo: string) => texto(f, campo) || null;
const comErro = (caminho: string, msg: string) => redirect(`${caminho}?erro=${encodeURIComponent(msg)}`);

export async function entrar(f: FormData) {
  const voltar = voltarSeguro(texto(f, "voltar"));
  if (!senhaConfere(texto(f, "senha"))) {
    // Atraso simples contra tentativas em sequência.
    await new Promise((r) => setTimeout(r, 1000));
    redirect(`/painel/entrar?erro=1${voltar ? `&voltar=${encodeURIComponent(voltar)}` : ""}`);
  }
  await abrirSessao();
  redirect(voltar ?? "/painel");
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
  const digitado = texto(f, "link_avaliacao");
  const link = digitado ? linkValido(digitado) : null;
  if (!nome) comErro(voltar, "Informe o nome do cliente.");
  if (digitado && !link) comErro(voltar, "O link de avaliação precisa começar com https://");

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
  redirect("/painel/clientes?ok=excluido");
}

export async function ligarPlaca(f: FormData) {
  await exigirLogin();
  const clienteId = Number(texto(f, "cliente_id"));
  const codigo = texto(f, "codigo").toUpperCase();
  if (!codigo) comErro(`/painel/clientes/${clienteId}`, "Escolha uma placa do estoque.");
  // A placa entra sem herdar nome, destino nem venda de um dono anterior.
  await db()`update placas set cliente_id = ${clienteId}, ativa = true, ativada_em = now(),
      nome = null, destino_tipo = null, destino_link = null, valor_venda = null, forma_pagamento = null
    where codigo = ${codigo} and cliente_id is null`;
  redirect(`/painel/clientes/${clienteId}?ok=placa`);
}

export async function desligarPlaca(f: FormData) {
  await exigirLogin();
  const codigo = texto(f, "codigo");
  await db()`update placas set cliente_id = null, ativada_em = null,
      nome = null, destino_tipo = null, destino_link = null, valor_venda = null, forma_pagamento = null
    where codigo = ${codigo}`;
  redirect(`${texto(f, "voltar") || "/painel/placas"}?ok=placa`);
}

export async function salvarPlaca(f: FormData) {
  await exigirLogin();
  const codigo = texto(f, "codigo").toUpperCase();
  const voltar = `/painel/placas/${codigo}`;
  const escolha = texto(f, "cliente_id");
  const novoNome = texto(f, "novo_nome");
  const tipo = texto(f, "destino_tipo") || "avaliacao";
  const digitado = texto(f, "destino");
  const valorTexto = texto(f, "valor_venda").replace(/\./g, "").replace(",", ".");
  const valor = valorTexto ? Number(valorTexto) : null;
  const pagamento = opcional(f, "forma_pagamento");

  if (!ehDestino(tipo)) return comErro(voltar, "Escolha para onde a placa deve levar.");
  if (escolha === "novo" && !novoNome) comErro(voltar, "Informe o nome do novo cliente.");
  if (valor !== null && (!Number.isFinite(valor) || valor < 0 || valor > 99999999)) comErro(voltar, "O valor da venda não é um número válido.");
  if (pagamento && !(PAGAMENTOS as readonly string[]).includes(pagamento)) comErro(voltar, "Forma de pagamento inválida.");
  const link = montarDestino(tipo, digitado);
  if (digitado && !link) comErro(voltar, "Não consegui montar o link de destino. Confira o que foi digitado (só links https).");

  const sql = db();
  let clienteId: number | null = null;
  if (escolha === "novo") {
    const [novo] = await sql`insert into clientes (nome, whatsapp) values (${novoNome}, ${opcional(f, "novo_whatsapp")}) returning id`;
    clienteId = novo.id;
  } else if (escolha) {
    clienteId = Number(escolha);
    if (!Number.isInteger(clienteId)) comErro(voltar, "Cliente inválido.");
  }

  await sql`update placas set
      ativada_em = case when cliente_id is distinct from ${clienteId} then (case when ${clienteId}::int is null then null else now() end) else ativada_em end,
      cliente_id = ${clienteId}, ativa = ${f.get("ativa") === "on"}, observacoes = ${opcional(f, "observacoes")},
      nome = ${opcional(f, "nome")}, destino_tipo = ${tipo}, destino_link = ${link},
      valor_venda = ${valor}, forma_pagamento = ${pagamento}
    where codigo = ${codigo}`;
  redirect(`${voltar}?ok=salvo`);
}

export async function alternarPlaca(f: FormData) {
  await exigirLogin();
  await db()`update placas set ativa = not ativa where codigo = ${texto(f, "codigo")}`;
  redirect("/painel/placas?ok=placa");
}

export async function limparPlaca(f: FormData) {
  await exigirLogin();
  const codigo = texto(f, "codigo");
  if (texto(f, "confirmo") !== "sim") comErro(`/painel/placas/${codigo}`, "Marque a confirmação para limpar a placa.");
  const sql = db();
  // O código impresso continua valendo: a placa volta ao estoque em branco.
  await sql.transaction([
    sql`delete from toques where codigo = ${codigo}`,
    sql`update placas set cliente_id = null, ativa = true, ativada_em = null, observacoes = null,
          nome = null, destino_tipo = null, destino_link = null, valor_venda = null, forma_pagamento = null
        where codigo = ${codigo}`,
  ]);
  redirect(`/painel/placas/${codigo}?ok=limpa`);
}

export async function criarLote(f: FormData) {
  await exigirLogin();
  const prefixo = texto(f, "prefixo").toUpperCase();
  const de = Number(texto(f, "de"));
  const ate = Number(texto(f, "ate"));
  if (!/^[A-Z]{1,3}$/.test(prefixo)) comErro("/painel/lotes", "O prefixo deve ter de 1 a 3 letras.");
  if (!Number.isInteger(de) || !Number.isInteger(ate) || de < 1 || ate > 999 || ate < de || ate - de > 499) {
    comErro("/painel/lotes", "Use números de 1 a 999, no máximo 500 placas por lote.");
  }
  await db()`insert into placas (codigo)
    select ${prefixo} || lpad(n::text, 3, '0') from generate_series(${de}::int, ${ate}::int) as n
    on conflict (codigo) do nothing`;
  redirect("/painel/lotes?ok=lote");
}

export async function prepararBanco() {
  await exigirLogin();
  const sql = db();
  for (const comando of SCHEMA) await sql.query(comando);
  redirect("/painel?ok=banco");
}
