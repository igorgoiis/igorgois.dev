"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useMounted } from "@/hooks/use-mounted";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const t = useTranslations("Header");

  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {mounted ? (
        dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}
