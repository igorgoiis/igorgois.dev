import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export const alt = "Igor Gois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  const markSvg = await readFile(join(process.cwd(), "public/brand/g-mark-app.svg"), "utf8");
  const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0b1020",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 200,
            top: -160,
            width: 800,
            height: 420,
            borderRadius: 999,
            background: "linear-gradient(90deg, rgba(45,212,191,.35), rgba(59,130,246,.3), rgba(139,92,246,.35))",
            filter: "blur(90px)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.9 }}>
          <span>{t("role")}</span>
          <img src={mark} alt="" width={96} height={96} style={{ borderRadius: 22 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 148, fontWeight: 800, letterSpacing: -8, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", gap: 48, marginTop: 28, fontSize: 30 }}>
            <span>{t("qualityLeft")}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{t("qualityRight")}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.8 }}>
          <span>{t("located")}</span>
          <span>{t("worldwide")}</span>
        </div>
      </div>
    ),
    size,
  );
}
