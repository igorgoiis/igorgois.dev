import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, servicesPath, type Locale } from "@/i18n/routing";
import { site } from "@/config/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ArrowRightIcon } from "@/components/icons";

type Faq = { q: string; a: string };
type Service = { title: string; text: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
  const t = await getTranslations({ locale: l, namespace: "Services" });
  return {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    alternates: {
      canonical: `${site.url}/${l}${servicesPath[l]}`,
      languages: Object.fromEntries(routing.locales.map((x) => [x, `${site.url}/${x}${servicesPath[x]}`])),
    },
    openGraph: { title: t("meta.title"), description: t("meta.description"), url: `${site.url}/${l}${servicesPath[l]}`, type: "website" },
  };
}

/** Página de serviços: o texto que responde às buscas locais por desenvolvimento em Petrolina. */
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const l = locale as Locale;
  setRequestLocale(l);
  const t = await getTranslations({ locale: l, namespace: "Services" });
  const services = t.raw("services") as Service[];
  const how = t.raw("how") as string[];
  const faq = t.raw("faq") as Faq[];
  const url = `${site.url}/${l}${servicesPath[l]}`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${l}` },
          { "@type": "ListItem", position: 2, name: t("no"), item: url },
        ],
      },
      {
        "@type": "Service",
        name: t("h1"),
        description: t("meta.description"),
        provider: { "@id": `${site.url}/#business` },
        areaServed: [{ "@type": "City", name: "Petrolina" }, { "@type": "City", name: "Juazeiro" }, { "@type": "Country", name: "Brasil" }],
        serviceType: services.map((s) => s.title),
        url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Header />
      <main>
        <Section id="services-hero" className="px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
          <p className="mono-label in-view-anim in-view-anim-1">{t("eyebrow")}</p>
          <h1 className="display in-view-anim in-view-anim-2 mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl" style={{ textWrap: "balance" }}>
            {t("h1")}
          </h1>
          <p className="in-view-anim in-view-anim-3 mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t("lead")}</p>
          <div className="in-view-anim in-view-anim-4 mt-8 flex flex-wrap gap-6">
            <a href={`mailto:${site.email}`} className="hero-cta" data-cursor="E-mail">
              {t("ctaButton")}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
            <a href={`/${l}#projects`} className="hero-cta">
              {t("ctaPortfolio")}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </Section>

        <Section id="services-list" className="px-5 py-16 md:px-8 md:py-24">
          <SectionTitle no="N° 1" label={t("no")} title={t("servicesTitle")} />
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <article key={s.title} className={`in-view-anim in-view-anim-${Math.min(i + 1, 4)} bg-background p-7 md:p-8`}>
                <h2 className="display text-xl font-bold tracking-tight md:text-2xl">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>
              </article>
            ))}
            <article className="in-view-anim in-view-anim-4 bg-background p-7 md:p-8">
              <h2 className="display text-xl font-bold tracking-tight md:text-2xl">{t("areaTitle")}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t("areaText")}</p>
            </article>
          </div>
        </Section>

        <Section id="services-how" className="px-5 py-16 md:px-8 md:py-24">
          <SectionTitle no="N° 2" label={t("no")} title={t("howTitle")} />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {how.map((step, i) => (
              <li key={step} className={`in-view-anim in-view-anim-${Math.min(i + 1, 4)} border-t border-border pt-4`}>
                <span className="mono-label">0{i + 1}</span>
                <p className="mt-3 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="services-faq" className="px-5 py-16 md:px-8 md:py-24">
          <SectionTitle no="N° 3" label={t("no")} title={t("faqTitle")} />
          <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
            {faq.map((f, i) => (
              <details key={f.q} className={`in-view-anim in-view-anim-${Math.min(i + 1, 4)} group py-5`} open={i === 0}>
                <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold tracking-tight">
                  {f.q}
                  <span className="mono-label transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="services-cta" className="px-5 py-20 md:px-8 md:py-28">
          <div className="in-view-anim in-view-anim-1 rounded-2xl border border-border bg-card p-8 md:p-12">
            <h2 className="display text-3xl font-bold tracking-tight md:text-5xl" style={{ textWrap: "balance" }}>{t("ctaTitle")}</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">{t("ctaText")}</p>
            <a href={`mailto:${site.email}`} className="hero-cta mt-8" data-cursor="E-mail">
              {t("ctaButton")}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
