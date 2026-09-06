"use client";

import { useEffect, useRef } from "react";

/** Linha vertical no pé do hero que cresce conforme o usuário começa a rolar. */
export function Spine() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.6));
      el.style.setProperty("--spine", p.toFixed(3));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div ref={ref} className="spine" aria-hidden="true" />;
}
