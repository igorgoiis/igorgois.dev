/**
 * Dados pessoais e links do site. Tudo que muda de pessoa para pessoa fica aqui.
 * E-mail e links conferidos com os currículos de 2026-09-05.
 */
export const site = {
  name: "Igor Gois",
  shortName: "Igor",
  domain: "igorgois.dev",
  url: "https://igorgois.dev",
  email: "contato@igorgois.dev",
  location: {
    city: "Petrolina",
    state: "PE",
    country: { pt: "Brasil", en: "Brazil", es: "Brasil" },
    timeZone: "America/Recife",
    utc: "UTC-3",
  },
  links: {
    github: "https://github.com/igorgoiis",
    linkedin: "https://www.linkedin.com/in/igor-gois",
  },
  /** Caminhos dos currículos em /public. Vazio esconde o botão de download. */
  cv: {
    pt: "/cv/igor-gois-cv-pt.pdf",
    en: "/cv/igor-gois-cv-en.pdf",
    es: "/cv/igor-gois-cv-es.pdf",
  },
  /** ID de métricas do Google Analytics 4 (público). Uma variável de ambiente sobrepõe. */
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-2MWS3B406R",
  /** Hue base da marca. 235 gera teal -> azul -> violeta. */
  paintHue: 235,
} as const;
