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
        className="in-view-anim in-view-anim-2 email-link mt-12 inline-flex items-center gap-3 text-3xl sm:text-5xl md:text-7xl"
      >
        <span className="email-text break-all">{site.email}</span>
        <ArrowUpRightIcon className="email-arrow h-8 w-8 shrink-0 md:h-14 md:w-14" />
      </a>

      <div className="in-view-anim in-view-anim-3 mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
        <dl className="mono-label grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
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
