import { useTranslations, useLocale } from "next-intl";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { Section } from "./section";
import { SectionTitle } from "./section-title";
import { LocalClock } from "./local-clock";
import { ArrowUpRightIcon } from "./icons";

export function Contact() {
  const t = useTranslations("Contact");
  const locale = useLocale() as Locale;
  const links: { label: string; href: string; external: boolean; transition?: string }[] = [
    { label: "LinkedIn", href: site.links.linkedin, external: true },
    { label: "GitHub", href: site.links.github, external: true },
    { label: t("resume"), href: `/${locale}/cv`, external: false, transition: "CV" },
  ];

  return (
    <Section id="contact" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <SectionTitle no={t("no")} label={t("label")} title={t("title")} />
      <p className="in-view-anim in-view-anim-2 mt-4 max-w-lg text-muted-foreground">{t("subtitle")}</p>

      <a
        href={`mailto:${site.email}`}
        data-cursor={t("cursorEmail")}
        className="in-view-anim in-view-anim-2 email-link mt-10 inline-flex max-w-full items-center gap-2 md:mt-12 md:gap-3"
      >
        <span className="email-text">{site.email}</span>
        <ArrowUpRightIcon className="email-arrow h-[0.8em] w-[0.8em] shrink-0" />
      </a>

      <div className="in-view-anim in-view-anim-3 mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
        <dl className="mono-label grid gap-y-3 sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:gap-y-2 [&>dd]:mb-1 sm:[&>dd]:mb-0">
          <dt>{t("location")}</dt>
          <dd className="text-foreground">
            {site.location.city}, {site.location.state}, {site.location.country[locale]} · {site.location.utc}
          </dd>
          <dt>{t("localTime")}</dt>
          <dd className="text-foreground tabular-nums">
            <LocalClock timeZone={site.location.timeZone} />
          </dd>
          <dt>{t("status")}</dt>
          <dd className="flex items-center gap-2 text-foreground">
            <span className="status-dot" aria-hidden="true" />
            {t("statusValue")}
          </dd>
          <dt>{t("mobility")}</dt>
          <dd className="text-foreground">{t("mobilityValue")}</dd>
        </dl>
        <ul className="flex flex-col items-start gap-2 md:items-end">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener" : undefined} data-transition={l.transition} className="arrow-link display text-2xl">
                {l.label}
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
