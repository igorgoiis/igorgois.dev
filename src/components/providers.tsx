"use client";

import { ThemeProvider } from "next-themes";
import { LenisProvider } from "./lenis-provider";
import { PageTransition } from "./page-transition";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LenisProvider>
        <PageTransition>{children}</PageTransition>
      </LenisProvider>
    </ThemeProvider>
  );
}
