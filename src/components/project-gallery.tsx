"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/data/projects";
import { ArrowRightIcon } from "./icons";

type Props = {
  project: Project;
  locale: Locale;
  onClose: () => void;
};

/**
 * Galeria de telas reais de um projeto, em <dialog> nativo: foco preso,
 * Esc fecha, setas navegam, miniaturas embaixo.
 */
export function ProjectGallery({ project, locale, onClose }: Props) {
  const t = useTranslations("Projects");
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const items = project.gallery ?? [];
  const count = items.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    document.documentElement.classList.add("lenis-stopped");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [go]);

  if (count === 0) return null;
  const current = items[index];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={t("galleryTitle", { name: project.name })}
      className="gallery-dialog"
      data-lenis-prevent
    >
      <div className="gallery-panel">
        <header className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="mono-label">{project.category[locale]}</p>
            <h3 className="truncate text-lg font-bold tracking-tight">
              {t("galleryTitle", { name: project.name })}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono-label tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button type="button" onClick={onClose} aria-label={t("close")} className="gallery-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="relative mx-5 overflow-hidden rounded-lg border border-border bg-muted">
          <div className="relative aspect-[16/9]">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt[locale]}
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-contain"
              priority
            />
          </div>
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className="gallery-btn gallery-nav left-3">
                <ArrowRightIcon className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label={t("next")} className="gallery-btn gallery-nav right-3">
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <p className="px-5 pt-3 text-sm text-muted-foreground">{current.alt[locale]}</p>

        <div className="flex gap-2 overflow-x-auto px-5 pb-5 pt-3 [scrollbar-width:thin]">
          {items.map((it, i) => (
            <button
              key={it.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={it.alt[locale]}
              aria-current={i === index}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-md border transition-all ${
                i === index ? "border-brand-via ring-2 ring-brand-via/40" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={it.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
