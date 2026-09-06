import { useLocale, useTranslations } from "next-intl";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { ParticleName } from "./particle-name";
import { Spine } from "./spine";
import { ArrowRightIcon } from "./icons";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale() as Locale;

  return (
    <section id="top" className="relative overflow-hidden px-5 pb-10 pt-28 md:px-8 md:pt-32">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="hero-blob absolute -inset-x-16 top-[10%] m-auto h-[46%] rounded-full" />
      </div>
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 md:min-h-[calc(100svh-9.5rem)] md:justify-between md:gap-0">

      {/* Linha superior: cargo + status */}
      <div className="hero-anim hero-anim-1 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>{t("role")}</span>
        <span className="inline-flex items-center gap-2">
          <span className="status-dot" aria-hidden="true" />
          {t("status")}
        </span>
      </div>

      {/* Nome gigante em partículas */}
      <ParticleName name={site.name} />

      {/* Qualidades nas bordas, como no Lannino */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-8">
        <div className="hero-anim hero-anim-3 max-w-xs">
          <p className="display text-2xl font-bold tracking-tight md:text-3xl">{t("qualityLeft")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("qualityLeftSub")}</p>
        </div>
        <div className="hero-anim hero-anim-4 flex flex-col items-start gap-3 md:items-center">
          <a href="#projects" className="hero-cta down">
            {t("ctaProjects")}
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-90" />
          </a>
          <a href="#contact" className="hero-cta">
            {t("ctaContact")}
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
          <a href={`/${locale}/cv`} className="hero-cta" data-transition="CV">
            {t("ctaCv")}
            <ArrowRightIcon className="h-3.5 w-3.5 -rotate-45" />
          </a>
        </div>
        <div className="hero-anim hero-anim-3 max-w-xs md:ml-auto md:text-right">
          <p className="display text-2xl font-bold tracking-tight md:text-3xl">{t("qualityRight")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("qualityRightSub")}</p>
        </div>
      </div>

      <div className="hero-anim hero-anim-5 mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground md:mt-10">
        <span>{t("located")}</span>
        <span>{t("worldwide")}</span>
      </div>

      </div>
      <Spine />
    </section>
  );
}
