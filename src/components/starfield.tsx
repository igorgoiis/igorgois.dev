"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  drift: number;
  speed: number;
  tint: string | null;
  glow: HTMLCanvasElement | null;
};

type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

const WARM = "255, 220, 190";
const COOL = "190, 210, 255";

function makeGlow(rgb: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb}, 0.55)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return c;
}

/**
 * Campo de estrelas fixo atrás de todo o site. Profundidade, parallax ligado ao
 * scroll, deriva senoidal, tintas quentes e frias, halos e uma estrela cadente.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const frameGap = mobile ? 1000 / 30 : 0;
    let lastFrame = 0;

    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let scrollY = window.scrollY;
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 4000 + Math.random() * 5000;

    const isDark = () => document.documentElement.classList.contains("dark");
    let base = isDark() ? "210, 205, 255" : "80, 70, 130";
    let alpha = isDark() ? 0.55 : 0.38;
    let baseGlow = makeGlow(base);
    const warmGlow = makeGlow(WARM);
    const coolGlow = makeGlow(COOL);

    const build = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = mobile
        ? Math.round(Math.min(Math.max((W * H) / 6500, 70), 130))
        : Math.round(Math.min(Math.max((W * H) / 5200, 140), 360));
      stars = Array.from({ length: count }, (_, i) => {
        const tint = Math.random() < 0.14 ? (Math.random() < 0.5 ? WARM : COOL) : null;
        const z = 0.25 + ((97 * i) % 100) / 133;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          z,
          drift: Math.random() * Math.PI * 2,
          speed: 0.1 + 0.24 * Math.random(),
          tint,
          glow: mobile ? null : tint === WARM ? warmGlow : tint === COOL ? coolGlow : z > 0.82 ? baseGlow : null,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const wrap = H + 40;
      for (const s of stars) {
        const shift = (scrollY * (0.05 + 0.25 * s.z)) % wrap;
        let y = s.y - shift;
        y = ((y % wrap) + wrap) % wrap - 20;
        const x = s.x + Math.sin(t * 0.0004 + s.drift) * (6 + 10 * s.z);
        const r = 0.4 + 1.3 * s.z;
        const tw = 0.7 + 0.3 * Math.sin(t * 0.0012 + s.drift * 3);
        const rgb = s.tint ?? base;
        if (s.glow) {
          const g = r * 6;
          ctx.globalAlpha = 0.28 * tw;
          ctx.drawImage(s.glow, x - g, y - g, 2 * g, 2 * g);
        }
        ctx.globalAlpha = alpha * tw * (s.tint ? 1.4 : 1);
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduce) return;
      if (!meteor && t > nextMeteor) {
        const fromLeft = Math.random() < 0.5;
        meteor = {
          x: fromLeft ? -40 : W + 40,
          y: Math.random() * H * 0.45,
          vx: (fromLeft ? 1 : -1) * (7 + 5 * Math.random()),
          vy: 2.2 + 1.6 * Math.random(),
          life: 1,
        };
      }
      if (meteor) {
        const m = meteor;
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.012;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - 9 * m.vx, m.y - 9 * m.vy);
        grad.addColorStop(0, `rgba(${base}, ${(0.85 * m.life).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${base}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - 9 * m.vx, m.y - 9 * m.vy);
        ctx.stroke();
        if (m.life <= 0 || m.x < -80 || m.x > W + 80 || m.y > H + 60) {
          meteor = null;
          nextMeteor = t + 5000 + 9000 * Math.random();
        }
      }
    };

    const frame = (t: number) => {
      if (frameGap && t - lastFrame < frameGap) {
        if (running) raf = requestAnimationFrame(frame);
        return;
      }
      lastFrame = t;
      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < -20) s.y += H + 40;
      }
      draw(t);
      if (running) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onResize = () => {
      build();
      draw(performance.now());
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const themeObserver = new MutationObserver(() => {
      base = isDark() ? "210, 205, 255" : "80, 70, 130";
      alpha = isDark() ? 0.55 : 0.38;
      baseGlow = makeGlow(base);
      for (const s of stars) if (!s.tint && s.glow) s.glow = baseGlow;
      if (reduce) draw(performance.now());
    });

    build();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(frame);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}
