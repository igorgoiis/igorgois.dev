import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, privacyPath, type Locale } from "@/i18n/routing";
import { site } from "@/config/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";

type PolicySection = { id: string; title: string; paragraphs?: string[]; items?: string[]; after?: string[] };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
  const t = await getTranslations({ locale: l, namespace: "Privacy" });
  return {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    alternates: {
      canonical: `${site.url}/${l}${privacyPath[l]}`,
      languages: Object.fromEntries(routing.locales.map((x) => [x, `${site.url}/${x}${privacyPath[x]}`])),
    },
  };
}

/** Quem responde pelos dados: razão social e CNPJ quando preenchidos em site.company. */
function companyLabel() {
  const { legalName, cnpj } = site.company;
  if (!legalName) return site.name;
  return cnpj ? `${legalName} (CNPJ ${cnpj})` : legalName;
}

/** Troca {company} e {email}; o texto vem das mensagens, escrito por nós, então pode ter links. */
function fill(text: string) {
  return text
    .replaceAll("{company}", companyLabel())
    .replaceAll("{email}", `<a href="mailto:${site.email}" class="underline underline-offset-4">${site.email}</a>`)
    .replaceAll("<a href=\"https", "<a class=\"underline underline-offset-4\" href=\"https");
}

function Html({ as: Tag = "p", text, className }: { as?: "p" | "li"; text: string; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: fill(text) }} />;
}

/** Política de privacidade do site e do assistente no WhatsApp. É a URL informada à Meta e ao Google. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const l = locale as Locale;
  setRequestLocale(l);
  const t = await getTranslations({ locale: l, namespace: "Privacy" });
  const sections = t.raw("sections") as PolicySection[];
  const text = "leading-relaxed text-muted-foreground";

  return (
    <>
      <Header />
      <main>
        <Section id="privacy" className="px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
          <p className="mono-label in-view-anim in-view-anim-1">{t("eyebrow")}</p>
          <h1 className="display in-view-anim in-view-anim-2 mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl" style={{ textWrap: "balance" }}>
            {t("h1")}
          </h1>
          <p className="in-view-anim in-view-anim-3 mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t("lead")}</p>
          <p className="mono-label in-view-anim in-view-anim-3 mt-4">{t("updated")}</p>

          <div className="in-view-anim in-view-anim-4 mt-12 max-w-3xl divide-y divide-border border-y border-border">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 space-y-3 py-8">
                <h2 className="display text-xl font-bold tracking-tight md:text-2xl">{s.title}</h2>
                {s.paragraphs?.map((p) => <Html key={p} text={p} className={text} />)}
                {s.items && (
                  <ul className={`list-disc space-y-2 pl-5 ${text}`}>
                    {s.items.map((item) => <Html key={item} as="li" text={item} />)}
                  </ul>
                )}
                {s.after?.map((p) => <Html key={p} text={p} className={text} />)}
              </section>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
