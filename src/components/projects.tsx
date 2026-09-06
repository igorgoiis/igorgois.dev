"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { projects, type Project } from "@/data/projects";
import { Section } from "./section";
import { SectionTitle } from "./section-title";
import { ProjectGallery } from "./project-gallery";
import { ArrowUpRightIcon } from "./icons";

/** Ordem aleatória fixa para as 144 células da máscara mosaico. */
const MOSAIC_DELAYS = Array.from({ length: 144 }, (_, i) => ((i * 7919) % 144) * 6);

function Mosaic() {
  return (
    <div className="mosaic" aria-hidden="true">
      {MOSAIC_DELAYS.map((d, i) => (
        <i key={i} style={{ "--d": `${d}ms` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee mt-5" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Frame({ p, locale, priority }: { p: Project; locale: Locale; priority: boolean }) {
  if (p.kind === "mobile") {
    const hasShots = Boolean(p.gallery?.length);
    return (
      <div className="flex justify-center">
        <div className="phone">
          <div className="screen">
            {hasShots ? (
              <Image src={p.cover[locale]} alt={p.name} fill sizes="280px" className="object-cover object-top" priority={priority} />
            ) : (
              <div className="brand-gradient flex h-full flex-col justify-between p-6 pt-16 text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">{p.address}</span>
                <div>
                  <p className="display text-4xl font-extrabold leading-none tracking-tight">{p.name}</p>
                  <p className="mt-2 text-sm opacity-85">{p.category[locale]}</p>
                </div>
              </div>
            )}
            <Mosaic />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="frame">
      <div className="frame-chrome">
        <i /><i /><i />
        <span className="url">{p.address}</span>
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={p.cover[locale]} alt={p.name} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover object-top" priority={priority} />
        <Mosaic />
      </div>
    </div>
  );
}

/**
 * Projetos em molduras de navegador e telefone, com um lema gigante
 * intercalado entre eles e uma faixa rolante da stack.
 */
export function Projects({ locale }: { locale: Locale }) {
  const t = useTranslations("Projects");
  const motto = t.raw("motto") as string[];
  const [gallery, setGallery] = useState<string | null>(null);
  const galleryProject = projects.find((p) => p.slug === gallery);

  return (
    <div id="projects">
      <Section id="projects-title" className="px-5 pt-24 md:px-8 md:pt-36">
        <SectionTitle no={t("no")} label={t("label")} title={t("title")} />
      </Section>

      {projects.map((p, i) => (
        <Section key={p.slug} id={`project-${p.slug}`} className="px-5 py-16 md:px-8 md:py-24">
          {motto[i] && (
            <div className="mb-10 overflow-hidden md:mb-16">
              <p className="motto">{motto[i]}</p>
            </div>
          )}

          <article className={`grid items-center gap-10 md:grid-cols-12 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className={`in-view-anim in-view-anim-1 md:col-span-7 ${p.kind === "mobile" ? "md:col-span-5" : ""}`}>
              <Frame p={p} locale={locale} priority={i === 0} />
            </div>

            <div className={`in-view-anim in-view-anim-2 md:col-span-5 ${p.kind === "mobile" ? "md:col-span-7" : ""}`}>
              <p className="mono-label">
                {String(i + 1).padStart(2, "0")} · {p.category[locale]}
              </p>
              <h3 className="display mt-3 text-4xl font-bold tracking-tight md:text-5xl">{p.name}</h3>
              <p className="mt-5 leading-relaxed text-muted-foreground">{p.description[locale]}</p>
              <p className="brand-text mt-4 text-sm font-semibold">{p.result[locale]}</p>

              <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-border pt-6 text-sm">
                <dt className="mono-label pt-1">{t("year")}</dt>
                <dd>{p.period[locale]}</dd>
                <dt className="mono-label pt-1">{t("role")}</dt>
                <dd>{p.role[locale]}</dd>
                <dt className="mono-label pt-1">{t("tech")}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </dd>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                {p.gallery && (
                  <button
                    type="button"
                    onClick={() => setGallery(p.slug)}
                    data-cursor={t("cursorGallery")}
                    className="arrow-link text-foreground"
                  >
                    {t("gallery")} · {t("screens", { count: p.gallery.length })}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>
                )}
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" data-cursor={t("cursorVisit")} className="arrow-link">
                    {t("visit")}
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </article>

          <Marquee items={p.stack} />
        </Section>
      ))}

      {galleryProject && (
        <ProjectGallery project={galleryProject} locale={locale} onClose={() => setGallery(null)} />
      )}
    </div>
  );
}
