"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";

type Step = { title: string; text: string; tag: string };

/** Telas ilustrativas do telefone, uma por etapa, só com CSS. */
function Screen({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="story-screen">
        <div className="story-note">?</div>
        <div className="story-line w-3/4" />
        <div className="story-line w-1/2" />
        <div className="mt-6 grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => <div key={i} className="story-box h-14" />)}
        </div>
        <div className="mt-auto story-line w-2/3" />
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="story-screen story-proto">
        <div className="story-line w-2/5" />
        <div className="story-box mt-3 h-24 border-dashed" />
        <div className="mt-3 flex gap-2">
          <div className="story-box h-10 flex-1 border-dashed" />
          <div className="story-box h-10 flex-1 border-dashed" />
        </div>
        <div className="story-box mt-3 h-8 w-1/2 border-dashed" />
        <div className="story-btn mt-auto">CTA</div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="story-screen story-code">
        <pre>
{`const app = expo({
  router: "expo-router",
  data: reactQuery(),
  state: zustand(),
  schema: zod(),
});

await ci.run("lint", "test");
// ✓ 48 passed`}
        </pre>
      </div>
    );
  }
  return (
    <div className="story-screen story-store">
      <div className="story-app-icon">IG</div>
      <p className="mt-4 display text-lg font-bold">v6.0</p>
      <p className="text-[11px] opacity-80">4.7 ★ · 1.5M+</p>
      <div className="mt-6 flex flex-col gap-2">
        <div className="story-badge">App Store</div>
        <div className="story-badge">Google Play</div>
      </div>
    </div>
  );
}

/**
 * Seção pinada: o telefone fica preso na tela e troca de conteúdo
 * enquanto os quatro passos passam com o scroll. No mobile vira lista.
 */
export function Story() {
  const t = useTranslations("Story");
  const steps = t.raw("steps") as Step[];
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
                    <div className="flex items-baseline gap-4">
                      <span className="mono-label tabular-nums">0{i + 1}</span>
                      <h3 className="display text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                      <span className="chip ml-auto hidden md:inline-flex">{s.tag}</span>
                    </div>
                    <div className="story-step-text"><p>{s.text}</p></div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="phone">
              <div className="screen">
                <Screen step={pinned ? active : active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
