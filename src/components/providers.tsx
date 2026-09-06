"use client";

import { ThemeProvider } from "next-themes";
import { LenisProvider } from "./lenis-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  );
}
