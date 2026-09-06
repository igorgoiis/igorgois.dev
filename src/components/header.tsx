"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";
import { GithubIcon, LinkedinIcon } from "./icons";

const NAV = [
  { key: "focus", href: "#focus", no: "01" },
  { key: "story", href: "#story", no: "02" },
  { key: "projects", href: "#projects", no: "03" },
  { key: "experience", href: "#experience", no: "04" },
  { key: "stack", href: "#stack", no: "05" },
  { key: "contact", href: "#contact", no: "06" },
] as const;

/** Barra mínima sempre visível e menu em tela cheia com links numerados. */
export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-5 py-4 md:px-8">
          <a href={`${base}#top`} data-transition={site.name} className="flex items-baseline gap-3 no-underline" aria-label={site.name}>
            <span className="display text-base font-bold tracking-tight">{site.name}</span>
            <span className="mono-label hidden sm:inline">{site.domain}</span>
          </a>
          <div className="flex items-center gap-2">
            <LocaleSwitch />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] backdrop-blur transition-colors hover:border-brand-via"
            >
              <span className="relative block h-2.5 w-4">
                <span className={`absolute left-0 top-0 h-px w-4 bg-foreground transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[5px] h-px w-4 bg-foreground transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-2.5 h-px w-4 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
              {open ? t("close") : t("menu")}
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" className="menu-overlay" data-open={open} aria-hidden={!open}>
        <div className="h-14" />
        <nav className="flex flex-col justify-center" aria-label="Principal">
          {NAV.map((item, i) => (
            <a
              key={item.key}
              href={`${base}${item.href}`}
              onClick={() => setOpen(false)}
              className="menu-link"
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <span className="no">N° {item.no}</span>
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>
            {site.location.city}, {site.location.country[locale]} · {site.location.utc}
          </span>
          <div className="flex items-center gap-5">
            <a href={`${base}/cv`} data-transition="CV" onClick={() => setOpen(false)} className="hover:text-foreground">
              {t("cv")}
            </a>
            <a href={site.links.github} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <GithubIcon className="h-3.5 w-3.5" /> {t("github")}
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <LinkedinIcon className="h-3.5 w-3.5" /> {t("linkedin")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
