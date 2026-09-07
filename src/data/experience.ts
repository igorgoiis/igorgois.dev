import type { Locale } from "@/i18n/routing";

type L = Record<Locale, string>;

export type Experience = {
  company: string;
  role: L;
  period: L;
  current?: boolean;
  summary: L;
  stack: string[];
};

/** Histórico do currículo, do mais recente ao mais antigo. */
export const experience: Experience[] = [
  {
    company: "Pede.ai",
    role: { pt: "Desenvolvedor Frontend Sênior", en: "Senior Frontend Developer", es: "Desarrollador Frontend Senior" },
    period: { pt: "nov 2025 – hoje", en: "Nov 2025 – today", es: "nov 2025 – hoy" },
    current: true,
    summary: {
      pt: "Lidero a reconstrução dos três apps de delivery (Pede.ai, Aiboo Delivery e QFome): 1,5 mi+ instalações, ~300 mil sessões/dia, ANR no Android reduzido em 90%. Nova UI, Reanimated, React Query, Zustand e Zod. Responsável pelos releases nas lojas.",
      en: "Leading the rebuild of the three delivery apps (Pede.ai, Aiboo Delivery and QFome): 1.5M+ installs, ~300K daily sessions, Android ANR cut by 90%. New UI, Reanimated, React Query, Zustand and Zod. Own the store releases.",
      es: "Lidero la reconstrucción de las tres apps de delivery (Pede.ai, Aiboo Delivery y QFome): 1,5 M+ de instalaciones, ~300 mil sesiones/día, ANR en Android reducido un 90 %. Nueva UI, Reanimated, React Query, Zustand y Zod. Responsable de las releases en las tiendas.",
    },
    stack: ["React Native", "TypeScript", "Reanimated"],
  },
  {
    company: "MB Labs · Bankeiro",
    role: { pt: "Engenheiro Full-Stack", en: "Full-Stack Engineer", es: "Ingeniero Full-Stack" },
    period: { pt: "ago 2024 – mar 2026", en: "Aug 2024 – Mar 2026", es: "ago 2024 – mar 2026" },
    summary: {
      pt: "Alocado no Bankeiro, core banking white label usado por 90+ fintechs. Funcionalidades web e mobile para Banco BMS e Kesh Bank, serviços Node.js com PostgreSQL e interfaces com design systems, junto a gerentes de produto e stakeholders.",
      en: "Placed on Bankeiro, a white-label core banking used by 90+ fintechs. Web and mobile features for Banco BMS and Kesh Bank, PostgreSQL-backed Node.js services and design-system UIs, alongside product managers and stakeholders.",
      es: "Asignado a Bankeiro, core banking white label usado por 90+ fintechs. Funcionalidades web y móviles para Banco BMS y Kesh Bank, servicios Node.js con PostgreSQL e interfaces con design systems, junto a product managers y stakeholders.",
    },
    stack: ["React", "Node.js", "React Native", "PostgreSQL"],
  },
  {
    company: "Mesha Technology · Senai Alagoas",
    role: { pt: "Engenheiro Full-Stack", en: "Full-Stack Engineer", es: "Ingeniero Full-Stack" },
    period: { pt: "jan 2023 – ago 2024", en: "Jan 2023 – Aug 2024", es: "ene 2023 – ago 2024" },
    summary: {
      pt: "Liderei um squad de 6 engenheiros em produtos internos e em dois projetos para o Senai Alagoas, com pipeline no Azure DevOps. Reconstruí do zero o Bluedental, SaaS de gestão para clínicas odontológicas, com Next.js, NestJS e React Native.",
      en: "Led a 6-engineer squad across internal products and two Senai Alagoas projects, with an Azure DevOps pipeline. Rebuilt Bluedental, a clinic-management SaaS for dentists, from the ground up with Next.js, NestJS and React Native.",
      es: "Lideré un equipo de 6 ingenieros en productos internos y en dos proyectos para Senai Alagoas, con pipeline en Azure DevOps. Reconstruí desde cero Bluedental, SaaS de gestión para clínicas dentales, con Next.js, NestJS y React Native.",
    },
    stack: ["Next.js", "NestJS", "Expo", "Azure DevOps"],
  },
  {
    company: "Foursales",
    role: { pt: "Engenheiro Front-end", en: "Front-end Engineer", es: "Ingeniero Front-end" },
    period: { pt: "jan 2022 – jan 2023", en: "Jan 2022 – Jan 2023", es: "ene 2022 – ene 2023" },
    summary: {
      pt: "Evolução da plataforma de recrutamento e seleção: novas funcionalidades, interface e performance junto ao time de produto.",
      en: "Evolved the recruitment platform: new features, interface and performance work with the product team.",
      es: "Evolución de la plataforma de reclutamiento: nuevas funcionalidades, interfaz y rendimiento junto al equipo de producto.",
    },
    stack: ["React", "Redux Saga", "Sass"],
  },
  {
    company: "Otimize IT",
    role: { pt: "Desenvolvedor de Software", en: "Software Developer", es: "Desarrollador de Software" },
    period: { pt: "ago 2020 – dez 2021", en: "Aug 2020 – Dec 2021", es: "ago 2020 – dic 2021" },
    summary: {
      pt: "E-commerces, sites e apps para pequenos negócios, com gestão de uma pequena equipe e entregas em metodologia ágil.",
      en: "E-commerce, websites and apps for small businesses, leading a small team with agile delivery.",
      es: "E-commerces, sitios y apps para pequeños negocios, gestionando un equipo pequeño con entregas ágiles.",
    },
    stack: ["JavaScript", "PHP", "WordPress"],
  },
];

export type StackItem = {
  name: string;
  category: "mobile" | "web" | "backend" | "data" | "ai" | "infra";
  /** Arquivo em /public/stack. Sem ícone, o tile mostra as iniciais. */
  icon?: string;
};

export const stack: StackItem[] = [
  { name: "React Native", category: "mobile", icon: "react-native" },
  { name: "Expo", category: "mobile", icon: "expo" },
  { name: "Reanimated", category: "mobile" },
  { name: "Next.js", category: "web", icon: "nextjs" },
  { name: "React", category: "web", icon: "react" },
  { name: "TypeScript", category: "web", icon: "typescript" },
  { name: "Tailwind", category: "web", icon: "tailwind" },
  { name: "NestJS", category: "backend", icon: "nestjs" },
  { name: "Node.js", category: "backend", icon: "nodejs" },
  { name: "Hono", category: "backend", icon: "hono" },
  { name: "PostgreSQL", category: "data", icon: "postgresql" },
  { name: "Prisma", category: "data", icon: "prisma" },
  { name: "Drizzle", category: "data", icon: "drizzle" },
  { name: "OpenAI API", category: "ai", icon: "openai" },
  { name: "Claude API", category: "ai", icon: "claude" },
  { name: "n8n", category: "ai", icon: "n8n" },
  { name: "Vercel", category: "infra", icon: "vercel" },
  { name: "Cloudflare", category: "infra", icon: "cloudflare" },
  { name: "Docker", category: "infra", icon: "docker" },
  { name: "GitHub Actions", category: "infra", icon: "github-actions" },
];
