"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { site } from "@/config/site";

type State = "idle" | "cover" | "reveal";
type Ctx = { navigate: (href: string, label?: string, replace?: boolean) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const COVER_MS = 620;

/**
 * Transição entre páginas: dois painéis sobem cobrindo a tela com o nome do
 * destino, a rota troca por baixo e os painéis saem por cima. Na primeira
 * carga faz o papel de loader. Sem JS ou com reduced-motion, nada disso roda.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const [state, setState] = useState<State>("idle");
  const [label, setLabel] = useState<string>(site.name);
  const pendingRef = useRef<string | null>(null);
  const enabledRef = useRef(false);
  const firstRef = useRef(true);

  // Loader inicial: começa coberto e revela.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    enabledRef.current = !reduce;
    if (reduce) return;
    const id = window.setTimeout(() => setState("reveal"), 60);
    return () => window.clearTimeout(id);
  }, []);

  // Rede de segurança: se o animationend não vier (aba oculta), volta a idle.
  useEffect(() => {
    if (state !== "reveal") return;
    const id = window.setTimeout(() => setState("idle"), 1600);
    return () => window.clearTimeout(id);
  }, [state]);

  // Quando a rota muda depois de um "cover", revela.
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (pendingRef.current) {
      pendingRef.current = null;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setState("reveal");
    }
  }, [pathname]);

  const navigate = useCallback(
    (href: string, nextLabel?: string, replace = false) => {
      const go = () => (replace ? router.replace(href, { scroll: false }) : router.push(href, { scroll: false }));
      if (!enabledRef.current || state !== "idle") {
        go();
        return;
      }
      setLabel(nextLabel || site.name);
      pendingRef.current = href;
      setState("cover");
      window.setTimeout(go, COVER_MS);
    },
    [router, state],
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
      <div
        className="pt"
        data-state={state}
        aria-hidden="true"
        onAnimationEnd={(e) => {
          // O painel primário é o último a sair na revelação.
          const el = e.target as HTMLElement;
          if (state === "reveal" && el.classList.contains("pt__panel--primary")) setState("idle");
        }}
      >
        <div className="pt__panel pt__panel--primary" />
        <div className="pt__panel pt__panel--ink">
          <span className="pt__label display">
            {label.split("").map((ch, i) => (
              <span key={`${ch}-${i}`} style={{ transitionDelay: `${120 + i * 28}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span className="pt__bar" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
