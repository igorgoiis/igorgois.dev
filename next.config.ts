import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Em desenvolvimento, permite abrir o site pelo IP da rede local (celular).
  allowedDevOrigins: ["192.168.68.50", "192.168.*.*", "10.*.*.*", "*.local"],
};

export default withNextIntl(nextConfig);
