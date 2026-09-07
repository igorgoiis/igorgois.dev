import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
  pathnames: {
    "/": "/",
    "/cv": "/cv",
    "/services": { pt: "/servicos", en: "/services", es: "/servicios" },
  },
});

export type Locale = (typeof routing.locales)[number];

/** Caminho público da página de serviços em cada idioma. */
export const servicesPath: Record<Locale, string> = { pt: "/servicos", en: "/services", es: "/servicios" };
