import { site } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { servicesPath } from "@/i18n/routing";

const LANG: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };

/**
 * Dados estruturados para o Google: pessoa, negócio local de serviços de
 * software em Petrolina e site. Renderizado uma vez por página.
 */
export function JsonLd({ locale, description }: { locale: Locale; description: string }) {
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: locale === "pt" ? "Engenheiro de Software Full-Stack" : locale === "es" ? "Ingeniero de Software Full-Stack" : "Full-Stack Software Engineer",
    address: { "@type": "PostalAddress", addressLocality: site.location.city, addressRegion: site.location.state, addressCountry: "BR" },
    sameAs: [site.links.github, site.links.linkedin],
    knowsAbout: ["React Native", "React", "Next.js", "Node.js", "NestJS", "TypeScript", "PostgreSQL", "OpenAI API"],
  };
  const business = {
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: "Gois.dev · Igor Gois",
    alternateName: "Igor Gois · Desenvolvimento de Software",
    url: `${site.url}/${locale}${servicesPath[locale]}`,
    image: `${site.url}/${locale}/opengraph-image`,
    logo: `${site.url}/brand/g-mark-app.svg`,
    email: site.email,
    description,
    founder: { "@id": `${site.url}/#person` },
    address: { "@type": "PostalAddress", addressLocality: site.location.city, addressRegion: site.location.state, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -9.3891, longitude: -40.5031 },
    areaServed: [
      { "@type": "City", name: "Petrolina" },
      { "@type": "City", name: "Juazeiro" },
      { "@type": "Country", name: "Brasil" },
    ],
    priceRange: "$$",
    knowsLanguage: ["pt-BR", "en", "es"],
    makesOffer: [
      "Desenvolvimento de sites e landing pages",
      "Desenvolvimento de sistemas web",
      "Desenvolvimento de aplicativos Android e iOS",
      "Integrações com inteligência artificial",
      "Manutenção e evolução de sistemas",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, areaServed: "BR" } })),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.domain,
    inLanguage: LANG[locale],
    publisher: { "@id": `${site.url}/#person` },
  };
  const data = { "@context": "https://schema.org", "@graph": [person, business, website] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
