"use client";

import { useEffect, useRef } from "react";

type Props = React.HTMLAttributes<HTMLElement> & { id: string };

/**
 * <section> que ganha data-in-view="true" quando entra na tela.
 * Os filhos com .in-view-anim fazem o reveal via CSS.
 */
export function Section({ id, children, className = "", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.inView = "true";
      return;
    }
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.dataset.inView = "true";
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
    // Revela quando o topo da seção passa de 85% da altura da tela,
    // ou quando qualquer parte dela já está visível.
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) reveal();
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) reveal();
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className} {...rest}>
      <div className="mx-auto w-full max-w-[1680px]">{children}</div>
    </section>
  );
}
