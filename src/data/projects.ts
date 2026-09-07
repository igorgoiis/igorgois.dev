import type { Locale } from "@/i18n/routing";

type Localized = Record<Locale, string>;

export type Project = {
  slug: string;
  name: string;
  /** Define a moldura: navegador para web, telefone para mobile. */
  kind: "web" | "mobile";
  /** Endereço mostrado na barra da moldura. */
  address: string;
  category: Localized;
  period: Localized;
  description: Localized;
  result: Localized;
  role: Localized;
  stack: string[];
  cover: Record<Locale, string>;
  /** Chamada grande acima do projeto, um dado que resume o trabalho. */
  kicker: Localized;
  /** Telas reais do produto. Quando existe, o card ganha o botão "Ver telas". */
  gallery?: { src: string; alt: Localized }[];
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "pede-ai",
    name: "Pede.ai",
    kind: "mobile",
    address: "App Store · Google Play",
    kicker: { pt: "1,5 mi+ instalações", en: "1.5M+ installs", es: "1,5 M+ instalaciones" },
    category: { pt: "Mobile · Delivery", en: "Mobile · Delivery", es: "Móvil · Delivery" },
    period: { pt: "2025 – hoje", en: "2025 – today", es: "2025 – hoy" },
    description: {
      pt: "App de delivery em React Native, publicado na App Store e na Google Play em três marcas do grupo: Pede.ai, Aiboo Delivery e QFome. Reestruturação completa: nova interface, animações com Reanimated, mapa com geolocalização, rastreamento do pedido em tempo real e listas longas otimizadas para aparelhos simples.",
      en: "Delivery app built with React Native, live on the App Store and Google Play under three group brands: Pede.ai, Aiboo Delivery and QFome. Full rebuild: new UI, Reanimated animations, map with geolocation, real-time order tracking and long lists tuned for low-end devices.",
      es: "App de delivery en React Native, publicada en la App Store y en Google Play bajo tres marcas del grupo: Pede.ai, Aiboo Delivery y QFome. Reestructuración completa: nueva interfaz, animaciones con Reanimated, mapa con geolocalización, seguimiento del pedido en tiempo real y listas largas optimizadas para dispositivos sencillos.",
    },
    result: {
      pt: "1,5 mi+ instalações · ~300 mil sessões/dia · ANR no Android reduzido em 90% · v6.0 com Pix, Apple Pay e Live Activities",
      en: "1.5M+ installs · ~300K daily sessions · Android ANR cut by 90% · v6.0 with Pix, Apple Pay and Live Activities",
      es: "1,5 M+ de instalaciones · ~300 mil sesiones/día · ANR en Android reducido un 90 % · v6.0 con Pix, Apple Pay y Live Activities",
    },
    role: {
      pt: "Desenvolvedor frontend sênior, responsável pelo app",
      en: "Senior frontend developer, app owner",
      es: "Desarrollador frontend senior, responsable de la app",
    },
    stack: ["React Native", "TypeScript", "Reanimated", "React Query", "Zustand", "Zod"],
    cover: { pt: "/projects/pede-ai.png", en: "/projects/pede-ai-en.png", es: "/projects/pede-ai.png" },
  },
  {
    slug: "licite-nordeste",
    name: "Licite Nordeste",
    kind: "web",
    address: "licitenordeste.com.br",
    kicker: { pt: "IA que lê editais", en: "AI that reads tenders", es: "IA que lee pliegos" },
    category: { pt: "Web · IA", en: "Web · AI", es: "Web · IA" },
    period: { pt: "2024 – 2025", en: "2024 – 2025", es: "2024 – 2025" },
    description: {
      pt: "Plataforma de licitações onde atuo como engenheiro full-stack. Um robô de IA baixa editais em PDF todos os dias, extrai e classifica os dados com a API da OpenAI e devolve orientação para cada usuário conforme o perfil. Frontend em Next.js, backend em NestJS com PostgreSQL.",
      en: "Public-tender platform where I work as a full-stack engineer. An AI robot downloads PDF notices every day, extracts and classifies the data with the OpenAI API and returns guidance to each user based on their profile. Next.js frontend, NestJS backend with PostgreSQL.",
      es: "Plataforma de licitaciones donde trabajo como ingeniero full-stack. Un robot de IA descarga pliegos en PDF todos los días, extrae y clasifica los datos con la API de OpenAI y devuelve orientación a cada usuario según su perfil. Frontend en Next.js, backend en NestJS con PostgreSQL.",
    },
    result: {
      pt: "Robô lê e classifica editais diariamente · saída JSON validada por schema · frontend, backend e integração com IA",
      en: "Robot reads and classifies notices daily · schema-validated JSON output · frontend, backend and AI integration",
      es: "Robot lee y clasifica pliegos a diario · salida JSON validada por esquema · frontend, backend e integración con IA",
    },
    role: {
      pt: "Engenheiro full-stack",
      en: "Full-stack engineer",
      es: "Ingeniero full-stack",
    },
    stack: ["Next.js", "NestJS", "PostgreSQL", "OpenAI API", "TypeScript", "Angular"],
    cover: {
      pt: "/projects/licite-nordeste/03-licitacoes.png",
      en: "/projects/licite-nordeste/03-licitacoes.png",
      es: "/projects/licite-nordeste/03-licitacoes.png",
    },
    gallery: [
      { src: "/projects/licite-nordeste/03-licitacoes.png", alt: { pt: "Lista de licitações abertas com modalidade, objeto, órgão e cidade", en: "Open tenders list with type, object, agency and city", es: "Lista de licitaciones abiertas con modalidad, objeto, organismo y ciudad" } },
      { src: "/projects/licite-nordeste/02-dashboard.png", alt: { pt: "Dashboard com avisos em destaque", en: "Dashboard with highlighted notices", es: "Panel con avisos destacados" } },
      { src: "/projects/licite-nordeste/04-resultados.png", alt: { pt: "Oportunidades com resultados publicados", en: "Tenders with published results", es: "Licitaciones con resultados publicados" } },
      { src: "/projects/licite-nordeste/05-boletins.png", alt: { pt: "Calendário de boletins do usuário", en: "User bulletin calendar", es: "Calendario de boletines del usuario" } },
      { src: "/projects/licite-nordeste/06-assessoria.png", alt: { pt: "Assessoria jurídica com dúvidas respondidas", en: "Legal advisory with answered questions", es: "Asesoría jurídica con dudas respondidas" } },
      { src: "/projects/licite-nordeste/07-planos.png", alt: { pt: "Escolha de plano por estados e período", en: "Plan selection by states and period", es: "Elección de plan por estados y período" } },
      { src: "/projects/licite-nordeste/01-login.png", alt: { pt: "Tela de login", en: "Login screen", es: "Pantalla de inicio de sesión" } },
    ],
  },
  {
    slug: "bankeiro",
    name: "Bankeiro",
    kind: "web",
    address: "bankeiro · white label",
    kicker: { pt: "90+ fintechs", en: "90+ fintechs", es: "90+ fintechs" },
    category: { pt: "Web · Fintech · White label", en: "Web · Fintech · White label", es: "Web · Fintech · White label" },
    period: { pt: "2024 – 2026", en: "2024 – 2026", es: "2024 – 2026" },
    description: {
      pt: "Core banking white label usado por mais de 90 fintechs, via MB Labs. Quase dois anos no time do produto: lançamentos, extratos, contas a pagar e painel do gestor, além de integrações com APIs de parceiros, webhooks de pagamento e conciliação. Apps Banco BMS e Kesh Bank publicados nas lojas sobre a mesma base.",
      en: "White-label core banking used by 90+ fintechs, through MB Labs. Almost two years on the product team: transactions, statements, payables and the manager dashboard, plus partner API integrations, payment webhooks and reconciliation. Banco BMS and Kesh Bank apps shipped to the stores on the same base.",
      es: "Core banking white label usado por más de 90 fintechs, a través de MB Labs. Casi dos años en el equipo de producto: movimientos, extractos, cuentas por pagar y panel del gestor, además de integraciones con APIs de socios, webhooks de pago y conciliación. Apps Banco BMS y Kesh Bank publicadas en las tiendas sobre la misma base.",
    },
    result: {
      pt: "Usado por 90+ fintechs · 2 apps publicados (Banco BMS e Kesh Bank) · quase 2 anos com dados financeiros reais",
      en: "Used by 90+ fintechs · 2 apps shipped (Banco BMS and Kesh Bank) · almost 2 years with real financial data",
      es: "Usado por 90+ fintechs · 2 apps publicadas (Banco BMS y Kesh Bank) · casi 2 años con datos financieros reales",
    },
    role: {
      pt: "Engenheiro full-stack",
      en: "Full-stack engineer",
      es: "Ingeniero full-stack",
    },
    stack: ["React", "Node.js", "React Native", "TypeScript", "PostgreSQL", "Redux"],
    cover: { pt: "/projects/bankeiro.png", en: "/projects/bankeiro-en.png", es: "/projects/bankeiro.png" },
  },
];
