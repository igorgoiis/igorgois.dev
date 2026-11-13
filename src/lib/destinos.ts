/** Tipos de destino de uma placa. Sem dependências: é usado no servidor e no navegador. */
export const DESTINOS = {
  avaliacao: {
    rotulo: "Avaliações do Google",
    campo: "Link de avaliação no Google",
    exemplo: "https://g.page/r/...",
    dica: "No Perfil da Empresa no Google: Pedir avaliações → copiar o link. Em branco, usa o link do cadastro do cliente.",
  },
  instagram: { rotulo: "Instagram", campo: "Usuário ou link do perfil", exemplo: "@empresa", dica: "" },
  whatsapp: { rotulo: "WhatsApp", campo: "Número com DDD", exemplo: "(87) 99999-9999", dica: "" },
  site: { rotulo: "Site", campo: "Endereço do site", exemplo: "https://empresa.com.br", dica: "" },
  outro: { rotulo: "Outro link", campo: "Link", exemplo: "https://...", dica: "" },
} as const;

export type DestinoTipo = keyof typeof DESTINOS;

export const ehDestino = (valor: string): valor is DestinoTipo => valor in DESTINOS;
export const rotuloDestino = (tipo: string | null) => DESTINOS[tipo && ehDestino(tipo) ? tipo : "avaliacao"].rotulo;

export const PAGAMENTOS = ["Pix", "Dinheiro", "Cartão de crédito", "Cartão de débito", "Boleto", "Outro"] as const;

/** Aceita só https; o destino de uma placa nunca pode ser outra coisa. */
export function linkValido(valor: string) {
  try {
    const url = new URL(valor.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const temEsquema = (valor: string) => /^[a-z][a-z0-9+.-]*:/i.test(valor);

/** Transforma o que foi digitado no link final da placa. Devolve null quando não dá para montar um link https. */
export function montarDestino(tipo: DestinoTipo, digitado: string) {
  const valor = digitado.trim();
  if (!valor) return null;

  if (tipo === "instagram" && !temEsquema(valor) && !valor.includes("/")) {
    const usuario = valor.replace(/^@/, "");
    return /^[A-Za-z0-9._]{1,30}$/.test(usuario) ? `https://instagram.com/${usuario}` : null;
  }

  if (tipo === "whatsapp" && !temEsquema(valor) && !valor.includes(".")) {
    const digitos = valor.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 13) return null;
    return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
  }

  return linkValido(temEsquema(valor) ? valor : `https://${valor}`);
}
