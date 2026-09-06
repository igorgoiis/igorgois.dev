import { useLocale, useTranslations } from "next-intl";
import { site } from "@/config/site";
import { Humor } from "./humor";
import { Logo } from "./logo";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const humor = t.raw("humor") as string[];

  return (
    <footer className="border-t border-border px-5 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <a href={`/${locale}#top`} aria-label="Gois.dev" className="mb-5 inline-block text-foreground">
            <Logo className="h-7 w-auto" />
          </a>
          <p className="display text-2xl font-bold tracking-tight">{t("tagline")}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {year} © {site.name} · {t("builtWith")}
          </p>
        </div>
        <Humor lines={humor} />
      </div>
    </footer>
  );
}
