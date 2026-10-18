import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Painel · Placas de avaliação",
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
