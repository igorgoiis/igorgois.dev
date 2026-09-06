import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { experience } from "@/data/experience";
import { Section } from "./section";
import { SectionTitle } from "./section-title";

export function Experience() {
  const t = useTranslations("Experience");
  const locale = useLocale() as Locale;

  return (
    <Section id="experience" className="px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        <SectionTitle no={t("no")} label={t("label")} title={t("title")} className="md:sticky md:top-28 md:self-start" />
        <ol className="timeline flex flex-col gap-12">
          {experience.map((e, i) => (
            <li key={e.company} className={`timeline-item in-view-anim in-view-anim-${Math.min(i + 1, 4)} ${e.current ? "current" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="display text-xl font-bold tracking-tight md:text-2xl">{e.company}</h3>
                <span className="mono-label">
                  {e.period[locale]}
                  {e.current && <span className="ml-2 text-brand-via">· {t("current")}</span>}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{e.role[locale]}</p>
              <p className="mt-3 max-w-2xl leading-relaxed">{e.summary[locale]}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.stack.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
