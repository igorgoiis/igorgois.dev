"use client";

import { useState } from "react";
import { DESTINOS, PAGAMENTOS, ehDestino, type DestinoTipo } from "@/lib/destinos";
import { Campo, botaoLeve, entrada } from "../../ui";

type Props = {
  clientes: { id: number; nome: string }[];
  clienteId: number | null;
  nome: string | null;
  destinoTipo: string | null;
  destinoLink: string | null;
  valorVenda: string | null;
  formaPagamento: string | null;
};

/** Campos da placa que mudam conforme a escolha: cliente novo e tipo de destino. */
export function CamposPlaca({ clientes, clienteId, nome, destinoTipo, destinoLink, valorVenda, formaPagamento }: Props) {
  const [cliente, setCliente] = useState(clienteId ? String(clienteId) : clientes.length ? "" : "novo");
  const [tipo, setTipo] = useState<DestinoTipo>(destinoTipo && ehDestino(destinoTipo) ? destinoTipo : "avaliacao");
  const destino = DESTINOS[tipo];

  return (
    <>
      <Campo rotulo="Cliente" dica="Sem cliente, a placa fica em estoque e mostra “Placa ainda não ativada”.">
        <select name="cliente_id" value={cliente} onChange={(e) => setCliente(e.target.value)} className={entrada}>
          <option value="">Em estoque (sem cliente)</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          <option value="novo">+ Novo cliente</option>
        </select>
      </Campo>
      {cliente === "novo" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome do novo cliente *"><input name="novo_nome" required className={entrada} /></Campo>
          <Campo rotulo="WhatsApp do cliente"><input name="novo_whatsapp" inputMode="tel" placeholder="(87) 99999-9999" className={entrada} /></Campo>
        </div>
      )}

      <Campo rotulo="Nome da placa" dica="Opcional. Ajuda quando o cliente tem mais de uma.">
        <input name="nome" defaultValue={nome ?? ""} placeholder="Ex.: Balcão de entrada" maxLength={80} className={entrada} />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Para onde a placa deve levar?">
          <select name="destino_tipo" value={tipo} onChange={(e) => setTipo(e.target.value as DestinoTipo)} className={entrada}>
            {Object.entries(DESTINOS).map(([chave, d]) => <option key={chave} value={chave}>{d.rotulo}</option>)}
          </select>
        </Campo>
        <Campo rotulo={destino.campo} dica={destino.dica || undefined}>
          <input name="destino" defaultValue={destinoLink ?? ""} placeholder={destino.exemplo} required={tipo !== "avaliacao" && cliente !== ""} className={entrada} />
        </Campo>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Valor da venda (R$)">
          <input name="valor_venda" inputMode="decimal" placeholder="0,00" defaultValue={valorVenda ? Number(valorVenda).toFixed(2).replace(".", ",") : ""} className={entrada} />
        </Campo>
        <Campo rotulo="Forma de pagamento">
          <select name="forma_pagamento" defaultValue={formaPagamento ?? ""} className={entrada}>
            <option value="">Não informada</option>
            {PAGAMENTOS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Campo>
      </div>
    </>
  );
}

export function CopiarLink({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      className={botaoLeve}
      onClick={async () => {
        await navigator.clipboard.writeText(link);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }}
    >
      {copiado ? "Link copiado" : "Copiar link (para gravar o NFC)"}
    </button>
  );
}
