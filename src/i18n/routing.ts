import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
  pathnames: {
    "/": "/",
    "/cv": "/cv",
    "/services": { pt: "/servicos", en: "/services", es: "/servicios" },
    "/privacy": { pt: "/privacidade", en: "/privacy", es: "/privacidad" },
  },
});

export type Locale = (typeof routing.locales)[number];

/** Caminho público da página de serviços em cada idioma. */
export const servicesPath: Record<Locale, string> = { pt: "/servicos", en: "/services", es: "/servicios" };

/** Caminho público da política de privacidade em cada idioma. */
export const privacyPath: Record<Locale, string> = { pt: "/privacidade", en: "/privacy", es: "/privacidad" };
