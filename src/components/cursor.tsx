"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor customizado: um ponto que segue o mouse com atraso, vira anel sobre
 * links e vira um rótulo quando o alvo tem data-cursor="texto".
 * Só existe em dispositivos com mouse fino.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("has-cursor");
    let x = -100, y = -100, tx = x, ty = y, raf = 0;

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.dataset.visible = "true";
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role='button']");
      const text = target?.dataset.cursor;
      if (text) {
        label.textContent = text;
        el.dataset.mode = "label";
      } else if (target) {
        el.dataset.mode = "link";
      } else {
        el.dataset.mode = "dot";
      }
    };
    const onLeave = () => {
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-mode="dot" data-visible="false" aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
