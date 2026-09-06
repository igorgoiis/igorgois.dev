import { useTranslations } from "next-intl";
import { stack } from "@/data/experience";
import { Section } from "./section";
import { SectionTitle } from "./section-title";

export function Stack() {
  const t = useTranslations("Stack");
  return (
    <Section id="stack" className="px-5 py-24 md:px-8 md:py-36">
      <SectionTitle no={t("no")} label={t("label")} title={t("title")} />
      <div className="in-view-anim in-view-anim-2 mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
        {stack.map((s) => (
          <div key={s.name} className="tile">
            <span className="mono-label">{t(`cat.${s.category}`)}</span>
            {s.icon ? (
              <span
                className="tile-icon"
                style={{ WebkitMaskImage: `url(/stack/${s.icon}.svg)`, maskImage: `url(/stack/${s.icon}.svg)` }}
                role="img"
                aria-label={s.name}
              />
            ) : (
              <span className="tile-initials display" aria-hidden="true">
                {s.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
              </span>
            )}
            <span className="display text-sm font-bold leading-tight tracking-tight">{s.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
