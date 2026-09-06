"use client";

import { useEffect, useState } from "react";

/** Uma frase escondida por visita, e outra no console para quem inspeciona. */
export function Humor({ lines }: { lines: string[] }) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const i = Math.floor(Math.random() * lines.length);
    const id = window.setTimeout(() => setLine(lines[i]), 0);
    console.log(`%c${lines[(i + 1) % lines.length]}`, "font-family: monospace; color: #6b7cff");
    return () => window.clearTimeout(id);
  }, [lines]);

  return (
    <p className="max-w-xs font-mono text-[11px] leading-relaxed text-muted-foreground md:text-right" aria-hidden={line === null}>
      {line ?? " "}
    </p>
  );
}
