"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { site } from "@/config/site";

type State = "initial" | "idle" | "cover" | "reveal";
type Ctx = { navigate: (href: string, label?: string, replace?: boolean) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const PENDING_KEY = "pt:label";
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const COVER_MS = 550;
const HOLD_MS = 900; // tempo com o rótulo parado na tela antes de revelar
const OUT_MS = 700;

/**
 * Transição entre páginas com a Web Animations API: os painéis sobem cobrindo
 * a tela com o nome do destino, a rota troca por baixo e os painéis saem por
 * cima. Na primeira carga faz o papel de loader. Cada etapa é sequenciada por
 * código, sem depender de trocas de classe CSS.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const [state, setState] = useState<State>("initial");
  const [label, setLabel] = useState<string>(site.name);
  const stateRef = useRef<State>("initial");
  const pendingRef = useRef<string | null>(null);
  const enabledRef = useRef(false);
  const firstRef = useRef(true);
  const inkRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);

  const set = useCallback((s: State) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const panels = () => [primaryRef.current, inkRef.current] as (HTMLDivElement | null)[];

  /** Painéis parados cobrindo a tela. */
  const holdCovered = useCallback(() => {
    for (const p of panels()) {
      if (!p) continue;
      p.getAnimations().forEach((a) => a.cancel());
      p.style.transform = "translateY(0)";
    }
  }, []);

  /** Painéis saem por cima; ao terminar, escondem-se embaixo. */
  const reveal = useCallback(async () => {
    const [primary, ink] = panels();
    if (!primary || !ink) return;
    set("reveal");
    holdCovered();
    await new Promise((r) => setTimeout(r, HOLD_MS));
    const a1 = ink.animate([{ transform: "translateY(0)" }, { transform: "translateY(-102%)" }], { duration: OUT_MS, easing: EASE, fill: "forwards" });
    const a2 = primary.animate([{ transform: "translateY(0)" }, { transform: "translateY(-102%)" }], { duration: OUT_MS, delay: 100, easing: EASE, fill: "forwards" });
    await Promise.allSettled([a1.finished, a2.finished]);
    for (const p of panels()) {
      if (!p) continue;
      p.getAnimations().forEach((a) => a.cancel());
      p.style.transform = "translateY(102%)";
    }
    set("idle");
  }, [set, holdCovered]);

  /** Painéis sobem cobrindo a tela; resolve quando estão cobrindo. */
  const cover = useCallback(async () => {
    const [primary, ink] = panels();
    if (!primary || !ink) return;
    set("cover");
    for (const p of panels()) p?.getAnimations().forEach((a) => a.cancel());
    const a1 = primary.animate([{ transform: "translateY(102%)" }, { transform: "translateY(0)" }], { duration: COVER_MS, easing: EASE, fill: "forwards" });
    const a2 = ink.animate([{ transform: "translateY(102%)" }, { transform: "translateY(0)" }], { duration: COVER_MS, delay: 80, easing: EASE, fill: "forwards" });
    await Promise.allSettled([a1.finished, a2.finished]);
    holdCovered();
  }, [set, holdCovered]);

  // Primeira carga: nasce coberto e revela. Se a página anterior deixou um
  // rótulo pendente (troca de idioma remonta o layout), usa esse rótulo.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    enabledRef.current = !reduce;
    if (reduce) {
      const id = window.setTimeout(() => set("idle"), 0);
      return () => window.clearTimeout(id);
    }
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_KEY);
      if (pending) sessionStorage.removeItem(PENDING_KEY);
    } catch {}
    const id = window.setTimeout(() => {
      if (pending) setLabel(pending);
      void reveal();
    }, 60);
    return () => window.clearTimeout(id);
  }, [reveal, set]);

  // Quando a rota muda depois de um "cover", revela.
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (pendingRef.current) {
      pendingRef.current = null;
      try {
        sessionStorage.removeItem(PENDING_KEY);
      } catch {}
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      void reveal();
    }
  }, [pathname, reveal]);

  const navigate = useCallback(
    (href: string, nextLabel?: string, replace = false) => {
      const go = (target: string) => (replace ? router.replace(target, { scroll: false }) : router.push(target, { scroll: false }));
      if (!enabledRef.current) {
        go(href);
        return;
      }
      if (stateRef.current === "cover") {
        // Já cobrindo: só troca o destino.
        pendingRef.current = href;
        return;
      }
      const finalLabel = nextLabel || site.name;
      setLabel(finalLabel);
      pendingRef.current = href;
      try {
        sessionStorage.setItem(PENDING_KEY, finalLabel); // sobrevive à remontagem do layout
      } catch {}
      void cover().then(() => {
        const target = pendingRef.current ?? href;
        go(target);
      });
    },
    [router, cover],
  );

  // Intercepta cliques em links internos para outra rota.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // âncoras na mesma página
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash, a.dataset.transition || a.textContent?.trim() || undefined);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div className="pt" data-state={state} aria-hidden="true">
        <div ref={primaryRef} className="pt__panel pt__panel--primary" />
        <div ref={inkRef} className="pt__panel pt__panel--ink">
          <span className="pt__label display">
            {label.split("").map((ch, i) => (
              <span key={`${ch}-${i}`} style={{ transitionDelay: `${120 + i * 28}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span className="pt__bar" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
