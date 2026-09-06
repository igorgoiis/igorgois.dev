import { useTranslations } from "next-intl";
import { Section } from "./section";
import { SectionTitle } from "./section-title";

const BLOCKS = ["mobile", "web", "ai"] as const;

/** "Construo produtos que são: Publicados, Rápidos, Medidos" e três blocos. */
export function Focus() {
  const t = useTranslations("Focus");
  const words = t.raw("words") as string[];

  return (
    <Section id="focus" className="relative px-5 py-24 md:px-8 md:py-36">
      <SectionTitle no={t("no")} label={t("label")} />
      <p className="in-view-anim in-view-anim-2 mt-10 max-w-xl text-xl text-muted-foreground md:text-2xl">{t("lead")}</p>

      <div className="mt-6 flex flex-col">
        {words.map((w) => (
          <span key={w} className="rise">
            <span className="focus-word">
              <span className="initial">{w.charAt(0)}</span>
              {w.slice(1)}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <article key={b} className={`in-view-anim in-view-anim-${i + 2} flex flex-col justify-between gap-10 bg-background p-7 md:p-9`}>
            <div>
              <h3 className="display text-2xl font-bold tracking-tight">{t(`blocks.${b}.title`)}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t(`blocks.${b}.text`)}</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="display brand-text text-5xl font-extrabold tracking-tight">{t(`blocks.${b}.stat`)}</span>
              <span className="mono-label">{t(`blocks.${b}.statLabel`)}</span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
