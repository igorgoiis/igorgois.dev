import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals, static files and
  // client proposals (static HTML under /public/propostas, no locale prefix) and
  // review plate redirects (/r/<code>, printed on NFC plates) and their admin panel.
  matcher: "/((?!api|_next|_vercel|propostas|painel|r/|.*\\..*).*)",
};
