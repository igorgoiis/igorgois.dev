"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABEL: Record<Locale, string> = { pt: "PT", en: "EN", es: "ES" };
const NAME: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" };

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Header");

  return (
    <div className="flex items-center rounded-full border border-border bg-card/70 p-0.5" role="group" aria-label="Idioma">
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            aria-label={active ? NAME[l] : t("switchTo", { locale: NAME[l] })}
            onClick={() => {
              if (!active) router.replace(pathname, { locale: l, scroll: false });
            }}
            className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-wider transition-all ${
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
