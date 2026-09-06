import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/config/site";
import { cv } from "@/data/cv";
import { Header } from "@/components/header";
import { PrintButton } from "@/components/print-button";
import { ArrowRightIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = cv[(hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale];
  return {
    title: `${c.ui.pageTitle} · ${site.name}`,
    description: c.summary.slice(0, 160),
    alternates: {
      canonical: `${site.url}/${locale}/cv`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}/cv`])),
    },
  };
}

/** Currículo renderizado em HTML, com impressão e download do PDF. */
export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);
  const c = cv[locale as Locale];
  const pdf = site.cv[locale as Locale];
  const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <>
      <Header />
      <main className="cv-page px-5 pb-16 pt-28 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
            <a href={`/${locale}`} className="hero-cta" data-transition={site.name}>
              <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
              {c.ui.back}
            </a>
            <div className="flex items-center gap-2">
              <PrintButton label={c.ui.print} />
              {pdf && (
                <a href={pdf} target="_blank" rel="noopener" download className="cv-btn cv-btn-primary" data-cursor="PDF">
                  {c.ui.download}
                </a>
              )}
            </div>
          </div>

          <article className="cv-document">
            <header className="cv-header">
              <div className="mb-4 text-foreground"><Logo className="h-5 w-auto" /></div>
              <h1 className="display text-4xl font-bold tracking-tight print:text-3xl">{site.name}</h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {c.title} · {c.headline}
              </p>
              <ul className="cv-contacts">
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  {site.location.city}, {site.location.state}, {site.location.country[locale as Locale]} ({site.location.utc}) · {c.availability}
                </li>
                <li>
                  <a href={site.url}>{site.domain}</a>
                </li>
                <li>
                  <a href={site.links.github} target="_blank" rel="noopener">
                    <GithubIcon className="h-3.5 w-3.5" /> {host(site.links.github)}
                  </a>
                </li>
                <li>
                  <a href={site.links.linkedin} target="_blank" rel="noopener">
                    <LinkedinIcon className="h-3.5 w-3.5" /> {host(site.links.linkedin)}
                  </a>
                </li>
              </ul>
            </header>

            <section className="cv-section">
              <h2 className="cv-h2">{c.ui.summary}</h2>
              <p className="cv-text">{c.summary}</p>
            </section>

            <section className="cv-section">
              <h2 className="cv-h2">{c.ui.skills}</h2>
              <dl className="cv-grid">
                {c.skills.map((s) => (
                  <div key={s.label} className="contents">
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="cv-section">
              <h2 className="cv-h2">{c.ui.experience}</h2>
              <div className="space-y-6">
                {c.jobs.map((j) => (
                  <div key={`${j.company}-${j.period}`} className="cv-job">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h3 className="text-base font-semibold">
                        {j.role} <span className="font-normal text-muted-foreground">· {j.company}</span>
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {j.period} · {j.place}
                      </span>
                    </div>
                    {j.about && <p className="mt-0.5 text-xs italic text-muted-foreground">{j.about}</p>}
                    <ul className="cv-bullets">
                      {j.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Stack:</span> {j.stack}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{c.ui.earlier}:</span> {c.earlier}
              </p>
            </section>

            <section className="cv-section">
              <h2 className="cv-h2">{c.ui.education}</h2>
              <dl className="cv-grid">
                {c.education.map((e) => (
                  <div key={e.label} className="contents">
                    <dt>{e.label}</dt>
                    <dd>{e.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground print:mt-4">{c.ui.updated}</p>
          </article>
        </div>
      </main>
    </>
  );
}
