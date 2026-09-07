"use client";

import { useEffect, useRef } from "react";

type Particle = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  orbit: number;
  orbitR: number;
  orbitSpeed: number;
  jrate: number;
  jphase: number;
  twinkle: number;
  size: number;
  rgb: string;
  vx: number;
  vy: number;
  dx: number;
  dy: number;
};

const smooth = (e: number) => e * e * (3 - 2 * e);
const rnd = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return `rgb(${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)})`;
}

function brandColors(): string[] {
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--paint-h")) || 235;
  return [hslToRgb(h - 61, 84, 62), hslToRgb(h - 29, 91, 62), hslToRgb(h + 30, 81, 62)];
}

type Props = { name: string; words?: string[] };

const WORD_MS = 4200; // tempo com cada palavra formada
const DISPERSE_MS = 900; // tempo dispersando antes de trocar a palavra

/**
 * Palavras gigantes formadas por partículas: começa pelo nome e alterna com
 * os serviços. O h1 real mantém o nome para leitores de tela e buscadores;
 * o span de amostragem troca de texto com opacity-0 e o canvas desenha os pontos.
 */
export function ParticleName({ name, words }: Props) {
  const cycle = words && words.length > 0 ? words : [name];
  const wordsKey = cycle.join("|");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = nameRef.current;
    const host = canvas?.parentElement as HTMLElement | null;
    if (!canvas || !anchor || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const frameGap = mobile ? 1000 / 30 : 0;
    let lastFrame = 0;
    let inView = true;
    const isDark = () => document.documentElement.classList.contains("dark");

    let W = 0, H = 0, cx = 0, cy = 0;
    let pts: Particle[] = [];
    let raf = 0;
    let running = false;
    let progress = 0;
    let last = 0;
    const start = performance.now() + 500;
    const mouse = { x: -9999, y: -9999 };
    let alphaBoost = isDark() ? 1 : 0.92;

    const sample = () => {
      const r = anchor.getBoundingClientRect();
      const st = getComputedStyle(anchor);
      const text = (anchor.textContent ?? "").trim();
      if (!text || r.width < 10) return [] as { x: number; y: number }[];
      const off = document.createElement("canvas");
      const oc = off.getContext("2d");
      if (!oc) return [];
      const scale = 0.92;
      const setFont = (c: CanvasRenderingContext2D) => {
        c.font = `${st.fontWeight} ${parseFloat(st.fontSize) * scale}px ${st.fontFamily}`;
        // Canvas ignora o letter-spacing do CSS; onde a API existe, aplicamos o mesmo valor.
        const withSpacing = c as CanvasRenderingContext2D & { letterSpacing?: string };
        if ("letterSpacing" in withSpacing) {
          withSpacing.letterSpacing = `${parseFloat(st.letterSpacing || "0") * scale || 0}px`;
        }
      };
      // Mede o texto antes de criar o canvas, para nunca cortar as pontas.
      setFont(oc);
      const m = oc.measureText(text);
      const textW = Math.ceil(m.width);
      // Largura da tinta (o S e o I passam do avanço tipográfico); margem folgada.
      const inkW = Math.ceil(Math.max(textW, (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || 0)));
      const textH = Math.ceil((m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0)) || Math.ceil(r.height * scale);
      const pad = 24;
      off.width = inkW + pad * 2;
      off.height = textH + pad * 2;
      setFont(oc);
      oc.textAlign = "center";
      oc.textBaseline = "middle";
      oc.fillStyle = "#fff";
      oc.fillText(text, off.width / 2, off.height / 2);
      const d = oc.getImageData(0, 0, off.width, off.height).data;
      // Mapeia as amostras para a caixa real do nome na página.
      const kx = r.width / textW;
      const ky = (r.height * 0.78) / textH;
      const out: { x: number; y: number }[] = [];
      const step = mobile ? 6 : 5;
      for (let y = 0; y < off.height; y += step)
        for (let x = 0; x < off.width; x += step)
          if (d[(y * off.width + x) * 4 + 3] > 128) out.push({ x: (x - off.width / 2) * kx, y: (y - off.height / 2) * ky });
      return out;
    };

    const cycle = wordsKey.split("|");
    let wordIndex = 0;
    let phase: "form" | "disperse" = "form";
    let phaseAt = performance.now();

    /** Reatribui alvos às partículas existentes para a palavra atual. */
    const retarget = () => {
      const targets = sample();
      if (!targets.length) return;
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      const a = anchor.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      cx = a.left + a.width / 2 - hostRect.left;
      cy = a.top + a.height / 2 - hostRect.top;
      for (let i = 0; i < pts.length; i++) {
        const t = targets[i % targets.length];
        pts[i].tx = t.x;
        pts[i].ty = t.y;
      }
    };

    const build = () => {
      const hostRect = host.getBoundingClientRect();
      W = hostRect.width;
      H = hostRect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const a = anchor.getBoundingClientRect();
      cx = a.left + a.width / 2 - hostRect.left;
      cy = a.top + a.height / 2 - hostRect.top;

      const targets = sample();
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      const max = Math.min(targets.length, mobile ? 320 : 1100);
      const spreadX = Math.min(0.46 * W, 760);
      const spreadY = Math.min(0.5 * H, 380);
      const cols = brandColors();
      pts = [];
      for (let k = 0; k < max; k++) {
        const t = targets[k];
        pts.push({
          tx: t.x,
          ty: t.y,
          sx: rnd() * spreadX * 2,
          sy: rnd() * spreadY * 2,
          orbit: Math.random() * Math.PI * 2,
          orbitR: 8 + Math.random() * 30,
          orbitSpeed: (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1),
          jrate: 0.0006 + Math.random() * 0.0012,
          jphase: Math.random() * Math.PI * 2,
          twinkle: Math.random() * Math.PI * 2,
          size: 1.1 + Math.random() * 1.5,
          rgb: cols[Math.floor(Math.random() * 3)],
          vx: 0, vy: 0, dx: 0, dy: 0,
        });
      }
    };

    const frame = (t: number) => {
      if (frameGap && t - lastFrame < frameGap) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastFrame = t;
      ctx.clearRect(0, 0, W, H);
      const dt = last ? Math.min(t - last, 250) : 16.7;
      last = t;
      // Ciclo de palavras: forma, dispersa, troca o texto e forma de novo.
      if (!reduce && cycle.length > 1 && t > start) {
        if (phase === "form" && t - phaseAt > WORD_MS) {
          phase = "disperse";
          phaseAt = t;
        } else if (phase === "disperse" && t - phaseAt > DISPERSE_MS) {
          wordIndex = (wordIndex + 1) % cycle.length;
          anchor.textContent = cycle[wordIndex];
          retarget();
          phase = "form";
          phaseAt = t;
        }
      }
      const target = t < start ? 0 : reduce ? 1 : phase === "disperse" ? 0.18 : 0.78 + 0.18 * Math.sin(t * 0.00045);
      const rate = target > progress ? 0.05 : 0.03;
      progress += (target - progress) * (1 - Math.pow(1 - rate, dt / 16.7));
      const a = progress;
      const u = smooth(a);
      const f = smooth(u);

      for (const p of pts) {
        p.orbit += p.orbitSpeed * 16;
        const r = 1 - 0.85 * a;
        const ox = cx + p.sx + Math.cos(p.orbit) * p.orbitR * r * 3;
        const oy = cy + p.sy + Math.sin(p.orbit) * p.orbitR * r * 2;
        const s = 0.6 + 0.5 * a;
        const jx = Math.sin(t * p.jrate + p.jphase) * s;
        const jy = Math.cos(t * p.jrate * 1.3 + p.jphase) * s;
        const mx = cx + p.tx + Math.cos(p.orbit) * (1 - a) * 2 + jx;
        const my = cy + p.ty + Math.sin(p.orbit) * (1 - a) * 2 + jy;
        let x = ox + (mx - ox) * f;
        let y = oy + (my - oy) * f;

        if (hover) {
          const ex = x - mouse.x;
          const ey = y - mouse.y;
          const rr = ex * ex + ey * ey;
          if (rr < 14400 && rr > 0.01) {
            const d = Math.sqrt(rr);
            const force = ((120 - d) / 120) * 1.8;
            p.vx += (ex / d) * force;
            p.vy += (ey / d) * force;
          }
          p.vx += -0.014 * p.dx;
          p.vy += -0.014 * p.dy;
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.dx += p.vx;
          p.dy += p.vy;
          x += p.dx;
          y += p.dy;
        }

        ctx.globalAlpha = Math.min(alphaBoost * (0.72 + 0.28 * Math.sin(t * 0.0016 + p.twinkle)) * (0.5 + 0.85 * u), 1);
        ctx.fillStyle = p.rgb;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 + 0.25 * u), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduce && progress > 0.995) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running || !inView) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : play());
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };
    const onPaint = () => {
      const cols = brandColors();
      for (const p of pts) p.rgb = cols[Math.floor(Math.random() * 3)];
    };
    const themeObserver = new MutationObserver(() => {
      alphaBoost = isDark() ? 1 : 0.92;
    });
    // Só anima enquanto o hero está na tela.
    const viewObserver = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) play();
        else stop();
      },
      { threshold: 0.05 },
    );
    viewObserver.observe(host);

    const boot = () => {
      build();
      play();
    };
    if (document.fonts?.ready) document.fonts.ready.then(boot);
    else boot();

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    window.addEventListener("paint-change", onPaint);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("paint-change", onPaint);
      themeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [wordsKey]);

  return (
    <div ref={sectionRef} className="relative py-6 md:py-10">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />
      <h1 className="hero-anim hero-anim-2 relative z-10 text-center">
        <span className="sr-only">{name}</span>
        <span ref={nameRef} aria-hidden="true" className="hero-name inline-block whitespace-nowrap opacity-0">
          {cycle[0]}
        </span>
      </h1>
    </div>
  );
}
