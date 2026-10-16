"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";
import { StoryVisual, type VisualText } from "./story-visuals";

type Step = { title: string; text: string; tag: string };

/**
 * Seção pinada: a cena fica presa na tela e troca de conteúdo
 * enquanto os quatro passos passam com o scroll. No mobile vira lista.
 */
export function Story() {
  const t = useTranslations("Story");
  const steps = t.raw("steps") as Step[];
  const visual = t.raw("visual") as VisualText;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const count = steps.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPinned(mq.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.inView = "true";
    if (!pinned) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -rect.top / total));
        setActive(Math.min(count - 1, Math.floor(p * count)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pinned, count]);

  return (
    <section
      ref={ref}
      id="story"
      className="relative px-5 md:px-8"
      style={pinned ? { height: `${count * 90 + 40}vh` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen items-center" : "py-24"}>
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-12 md:grid-cols-2">
          <div>
            <SectionTitle no={t("no")} label={t("label")} title={t("title")} />
            <p className="in-view-anim in-view-anim-2 mt-4 max-w-md text-muted-foreground">{t("lead")}</p>

            <ol className="mt-10 flex flex-col gap-4">
              {steps.map((s, i) => {
                const on = !pinned || i === active;
                return (
                  <li
                    key={s.title}
                    className={`story-step ${on ? "on" : ""}`}
                    onClick={() => !pinned && setActive(i)}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <span className="mono-label tabular-nums">0{i + 1}</span>
                      <h3 className="display text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                      <span className="chip md:ml-auto">{s.tag}</span>
                    </div>
                    <div className="story-step-text"><p>{s.text}</p></div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="hidden justify-center md:flex md:justify-end">
            {/* uma cena animada por etapa; a key reinicia a animação quando a etapa muda */}
            <div className="sv-stage">
              <StoryVisual key={active} step={active} v={visual} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
