import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/config/site";
import { Providers } from "@/components/providers";
import { Starfield } from "@/components/starfield";
import { Cursor } from "@/components/cursor";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const HTML_LANG: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };
const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US", es: "es_ES" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${site.url}/${l}`]),
  );

  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    keywords: [
      "desenvolvedor de software Petrolina", "desenvolvedor de sites Petrolina", "criação de sites Petrolina",
      "desenvolvimento de sistemas Petrolina", "desenvolvedor de aplicativos Petrolina", "programador Petrolina",
      "software house Petrolina", "desenvolvedor React Native", "desenvolvedor Next.js", "Igor Gois",
    ],
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    alternates: {
      canonical: `${site.url}/${locale}`,
      languages: { ...languages, "x-default": `${site.url}/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: site.domain,
      locale: OG_LOCALE[locale as Locale] ?? "pt_BR",
      alternateLocale: Object.entries(OG_LOCALE)
        .filter(([l]) => l !== locale)
        .map(([, v]) => v),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);
  const tMeta = await getTranslations({ locale, namespace: "Meta" });

  return (
    <html
      lang={HTML_LANG[locale as Locale]}
      suppressHydrationWarning
      className={`js ${display.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Sem JavaScript: nada fica escondido à espera de animação e a cortina não existe. */}
        <noscript>
          <style>{`.pt{display:none!important}.in-view-anim{opacity:1!important;transform:none!important}.rise>span{transform:none!important}.hero-anim{opacity:1!important;animation:none!important}.motto{color:var(--foreground)!important;-webkit-text-stroke:0!important}.mosaic{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Google Analytics 4: só entra quando NEXT_PUBLIC_GA_ID estiver definido na Vercel. */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <NextIntlClientProvider>
          <Providers>
            <JsonLd locale={locale as Locale} description={tMeta("description")} />
            <Starfield />
            <Cursor />
            <div className="relative min-h-screen">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
