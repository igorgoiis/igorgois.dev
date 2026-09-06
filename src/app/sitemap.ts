import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}`]));
  const cvLanguages = Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}/cv`]));
  return routing.locales.flatMap((locale) => [
    {
      url: `${site.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? 1 : 0.8,
      alternates: { languages },
    },
    {
      url: `${site.url}/${locale}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: cvLanguages },
    },
  ]);
}
