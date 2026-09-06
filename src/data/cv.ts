import type { Locale } from "@/i18n/routing";

export type CvJob = {
  role: string;
  company: string;
  period: string;
  place: string;
  about?: string;
  bullets: string[];
  stack: string;
};

export type CvContent = {
  title: string;
  headline: string;
  availability: string;
  summary: string;
  skills: { label: string; value: string }[];
  jobs: CvJob[];
  earlier: string;
  education: { label: string; value: string }[];
  ui: {
    pageTitle: string;
    back: string;
    print: string;
    download: string;
    summary: string;
    skills: string;
    experience: string;
    earlier: string;
    education: string;
    updated: string;
  };
};

const pt: CvContent = {
  title: "Engenheiro Full-Stack",
  headline: "React Native / React / Node.js / TypeScript",
  availability: "Aberto a vagas remotas",
  summary:
    "Engenheiro Full-Stack com 6 anos de experiência no desenvolvimento de produtos web e mobile com React, React Native, Node.js e TypeScript. Atualmente lidera a reconstrução completa de três aplicativos de delivery (1,5 mi+ instalações na Google Play, ~300 mil sessões/dia), reduzindo a taxa de ANR no Android em ~90%. Já liderou squads de até 6 engenheiros e publica apps na App Store e Google Play. Em processo de mudança para a Espanha (autorização de trabalho na UE em tramitação); aberto a vagas remotas.",
  skills: [
    { label: "Mobile", value: "React Native, Expo, Reanimated, publicação na App Store e Google Play, performance (ANR / crashes)" },
    { label: "Frontend", value: "React, Next.js, TypeScript, React Query, Zustand, Zod, Redux / Saga, Styled Components, MUI, Ant Design, Sass" },
    { label: "Backend e Dados", value: "Node.js, NestJS, PostgreSQL, APIs REST, PHP, WordPress" },
    { label: "Práticas e Ferramentas", value: "Padrões de projeto, arquitetura modular, Agile / Scrum, code review, Azure DevOps, Git" },
  ],
  jobs: [
    {
      role: "Desenvolvedor Frontend Sênior",
      company: "Pede.ai",
      period: "Nov 2025 – Atual",
      place: "Remoto",
      about: "Marketplace de delivery focado em cidades de pequeno e médio porte em todo o Brasil.",
      bullets: [
        "Lidera a reconstrução completa dos três aplicativos da empresa (Pede.ai, Aiboo Delivery e QFome): 1,5 mi+ instalações na Google Play (Pede.ai 1 mi+, Aiboo 500 mil+), avaliações de 4,7 a 5,0 e ~300 mil sessões/dia em iOS e Android; responsável pelos releases nas lojas.",
        "Reduziu a taxa de ANR no Android em ~90% nos três apps (Pede.ai 4,2% → 0,44%; Aiboo 4,6% → 0,46%; QFome 6,72% → 0,59%) por meio de refatoração de arquitetura, modularização e otimização de renderização.",
        "Redesenhou a UI de ponta a ponta; introduziu padrões de projeto, módulos por feature e animações com Reanimated, substituindo o gerenciamento de estado legado por React Query, Zustand e Zod.",
        "Entregou a versão 6.0, a maior release da história dos apps: nova home e busca, recomendações personalizadas, checkout com endereço e cartão no fluxo, Pix com QR code e Apple Pay, acompanhamento do pedido via Live Activities e chat no app.",
      ],
      stack: "React Native, TypeScript, Reanimated, React Query, Zustand, Zod",
    },
    {
      role: "Engenheiro Full-Stack",
      company: "MB Labs",
      period: "Ago 2024 – Mar 2026",
      place: "Remoto",
      about: "Empresa de alocação de squads; alocado no Bankeiro, core banking white label usado por 90+ fintechs. Concomitante à Pede.ai desde Nov 2025.",
      bullets: [
        "Desenvolveu e entregou funcionalidades web e mobile para duas fintechs baseadas no Bankeiro, Banco BMS (app Meu BMS) e Kesh Bank, em bases de código React, React Native e Node.js.",
        "Atuou com gerentes de produto e stakeholders dos clientes na definição de funcionalidades e nas decisões técnicas do roadmap.",
        "Desenvolveu serviços Node.js com PostgreSQL e interfaces com design systems (Material UI, Ant Design, Styled Components).",
      ],
      stack: "React, Node.js, React Native, TypeScript, PostgreSQL, Redux, Styled Components, Material UI, Ant Design",
    },
    {
      role: "Engenheiro Full-Stack",
      company: "Mesha Technology",
      period: "Jan 2023 – Ago 2024",
      place: "Remoto",
      about: "Empresa de alocação de times para o desenvolvimento de soluções digitais.",
      bullets: [
        "Liderou um squad de 6 engenheiros (2 front-end, 3 back-end, 1 full-stack) em planejamento, code review e decisões técnicas, em produtos internos e em dois projetos para o SENAI Alagoas (Hub Digital e Soluções Digitais).",
        "Reconstruiu do zero o Bluedental, SaaS de gestão para clínicas odontológicas, com Next.js, NestJS e React Native (Expo), entregando a plataforma web e os apps iOS/Android.",
      ],
      stack: "Next.js, NestJS, React Native, Expo, TypeScript, PostgreSQL, Azure DevOps, Styled Components, Ionic",
    },
    {
      role: "Engenheiro Front-end",
      company: "Foursales Company",
      period: "Jan 2022 – Jan 2023",
      place: "Remoto",
      about: "Empresa de recrutamento e seleção especializada em vendas e marketing.",
      bullets: ["Desenvolveu funcionalidades e melhorias de UX para a plataforma de R&S em React, Redux Saga e Sass, junto ao time de produto."],
      stack: "React, Redux Saga, Sass",
    },
    {
      role: "Desenvolvedor de Software",
      company: "Otimize IT",
      period: "Ago 2020 – Dez 2021",
      place: "Petrolina, PE",
      about: "Empresa de tecnologia para pequenos negócios. Promovido de Desenvolvedor Interno de Software em Jan 2021.",
      bullets: ["Geriu uma equipe de 4 devs web (metodologias ágeis), entregando e-commerces, websites e apps em WordPress/PHP e JavaScript."],
      stack: "WordPress, PHP, JavaScript, jQuery, CSS",
    },
  ],
  earlier: "Técnico de informática em escritório de advocacia em Petrolina (2016 – 2020), durante a graduação.",
  education: [
    { label: "Formação", value: "Bacharelado em Ciência da Computação, Faculdade de Ciências Aplicadas e Sociais de Petrolina (FACAPE), 2026" },
    { label: "Idiomas", value: "Português (nativo) · Inglês (B1 leitura/escrita, A2 conversação; em estudo) · Espanhol (A1, iniciante)" },
    { label: "Autorização", value: "Visto de trabalho na Espanha em tramitação (cônjuge de cidadã espanhola); aberto a relocação e a remoto." },
  ],
  ui: {
    pageTitle: "Currículo",
    back: "Voltar ao portfólio",
    print: "Imprimir",
    download: "Baixar PDF",
    summary: "Resumo profissional",
    skills: "Competências técnicas",
    experience: "Experiência profissional",
    earlier: "Experiência anterior",
    education: "Formação, idiomas e autorização de trabalho",
    updated: "Atualizado em setembro de 2026",
  },
};

const en: CvContent = {
  title: "Full-Stack Engineer",
  headline: "React Native / React / Node.js / TypeScript",
  availability: "Open to remote roles",
  summary:
    "Full-Stack Engineer with 6 years of experience building web and mobile products with React, React Native, Node.js and TypeScript. Currently leading the ground-up rebuild of three consumer delivery apps (1.5M+ Google Play installs, ~300K daily sessions), cutting Android ANR rates by ~90%. Has led squads of up to 6 engineers and ships to the App Store and Google Play. Relocating to Spain (EU work authorization in progress); open to remote roles.",
  skills: [
    { label: "Mobile", value: "React Native, Expo, Reanimated, App Store & Google Play publishing, performance tuning (ANR / crashes)" },
    { label: "Frontend", value: "React, Next.js, TypeScript, React Query, Zustand, Zod, Redux / Redux Saga, Styled Components, MUI, Ant Design, Sass" },
    { label: "Backend & Data", value: "Node.js, NestJS, PostgreSQL, REST APIs, PHP, WordPress" },
    { label: "Practices & Tools", value: "Design patterns, modular architecture, Agile / Scrum, code review, Azure DevOps, Git" },
  ],
  jobs: [
    {
      role: "Senior Frontend Developer",
      company: "Pede.ai",
      period: "Nov 2025 – Present",
      place: "Remote",
      about: "Delivery marketplace focused on small and mid-size cities across Brazil.",
      bullets: [
        "Lead the ground-up rebuild of the company's three consumer apps (Pede.ai, Aiboo Delivery and QFome): 1.5M+ Google Play installs (Pede.ai 1M+, Aiboo 500K+), 4.7 to 5.0 store ratings and ~300K daily sessions across iOS and Android; own store releases.",
        "Cut Android ANR rates by ~90% across all three apps (Pede.ai 4.2% → 0.44%; Aiboo 4.6% → 0.46%; QFome 6.72% → 0.59%) through architectural refactoring, modularization and render-performance work.",
        "Redesigned the UI end to end; introduced design patterns, feature-based modules and Reanimated animations, replacing legacy state handling with React Query, Zustand and Zod.",
        "Shipped v6.0, the apps' largest release to date: new home and search, personalized recommendations, in-flow address and card checkout, Pix QR code and Apple Pay, Live Activities order tracking and in-app chat.",
      ],
      stack: "React Native, TypeScript, Reanimated, React Query, Zustand, Zod",
    },
    {
      role: "Full-Stack Engineer",
      company: "MB Labs",
      period: "Aug 2024 – Mar 2026",
      place: "Remote",
      about: "Squad-allocation company; allocated to Bankeiro, a white-label core-banking platform used by 90+ fintechs. Overlapped with Pede.ai from Nov 2025.",
      bullets: [
        "Built and shipped web and mobile features for two Bankeiro-based fintechs, Banco BMS (Meu BMS app) and Kesh Bank, across React, React Native and Node.js codebases.",
        "Partnered with product managers and client stakeholders to scope new functionality and drive technical decisions on the roadmap.",
        "Developed PostgreSQL-backed Node.js services and design-system UIs with Material UI, Ant Design and Styled Components.",
      ],
      stack: "React, Node.js, React Native, TypeScript, PostgreSQL, Redux, Styled Components, Material UI, Ant Design",
    },
    {
      role: "Full-Stack Engineer",
      company: "Mesha Technology",
      period: "Jan 2023 – Aug 2024",
      place: "Remote",
      about: "Tech team-allocation company building digital products for clients.",
      bullets: [
        "Led a 6-engineer squad (2 frontend, 3 backend, 1 full-stack) in planning, code review and technical decisions across Mesha's internal products and two client projects for SENAI Alagoas (Hub Digital and Soluções Digitais), delivered in an Azure DevOps pipeline.",
        "Rebuilt Bluedental, a clinic-management SaaS for dentists, from the ground up with Next.js, NestJS and React Native (Expo), delivering the web platform and the iOS/Android apps.",
      ],
      stack: "Next.js, NestJS, React Native, Expo, TypeScript, PostgreSQL, Azure DevOps, Styled Components, Ionic",
    },
    {
      role: "Front-end Engineer",
      company: "Foursales Company",
      period: "Jan 2022 – Jan 2023",
      place: "Remote",
      about: "Recruitment & selection company specialized in sales and marketing roles.",
      bullets: ["Built new features and UX improvements for the recruitment platform in React, Redux Saga and Sass, alongside product stakeholders."],
      stack: "React, Redux Saga, Sass",
    },
    {
      role: "Software Developer",
      company: "Otimize IT",
      period: "Aug 2020 – Dec 2021",
      place: "Petrolina, Brazil",
      about: "Technology company for small businesses. Promoted from Internal Software Developer in Jan 2021.",
      bullets: ["Managed a team of 4 web developers (agile), delivering WordPress/PHP and JavaScript e-commerce stores, websites and apps for clients."],
      stack: "WordPress, PHP, JavaScript, jQuery, CSS",
    },
  ],
  earlier: "IT Support Technician at a law office in Petrolina (2016 – 2020), while pursuing a B.Sc. in Computer Science.",
  education: [
    { label: "Education", value: "B.Sc. in Computer Science, Faculdade de Ciências Aplicadas e Sociais de Petrolina (FACAPE), Brazil, 2026" },
    { label: "Languages", value: "Portuguese (native) · English (B1 reading & writing, A2 speaking; in active study) · Spanish (A1, beginner)" },
    { label: "Authorization", value: "Spanish work permit in progress (spouse of a Spanish citizen); open to relocation to Spain/EU and to remote roles." },
  ],
  ui: {
    pageTitle: "Resume",
    back: "Back to portfolio",
    print: "Print",
    download: "Download PDF",
    summary: "Professional summary",
    skills: "Technical skills",
    experience: "Professional experience",
    earlier: "Earlier experience",
    education: "Education, languages & work authorization",
    updated: "Updated September 2026",
  },
};

const es: CvContent = {
  title: "Ingeniero Full-Stack",
  headline: "React Native / React / Node.js / TypeScript",
  availability: "Abierto a puestos remotos",
  summary:
    "Ingeniero Full-Stack con 6 años de experiencia en el desarrollo de productos web y móviles con React, React Native, Node.js y TypeScript. Actualmente lidero la reconstrucción completa de tres aplicaciones de delivery (más de 1,5 M de instalaciones en Google Play, ~300.000 sesiones diarias), reduciendo la tasa de ANR en Android en torno a un 90 %. He liderado equipos de hasta 6 ingenieros y publico aplicaciones en App Store y Google Play. En proceso de traslado a España (permiso de trabajo en la UE en tramitación); disponibilidad para trabajo presencial o en remoto.",
  skills: [
    { label: "Móvil", value: "React Native, Expo, Reanimated, publicación en App Store y Google Play, rendimiento (ANR / crashes)" },
    { label: "Frontend", value: "React, Next.js, TypeScript, React Query, Zustand, Zod, Redux / Saga, Styled Components, MUI, Ant Design, Sass" },
    { label: "Backend y Datos", value: "Node.js, NestJS, PostgreSQL, APIs REST, PHP, WordPress" },
    { label: "Prácticas y Herramientas", value: "Patrones de diseño, arquitectura modular, Agile / Scrum, code review, Azure DevOps, Git" },
  ],
  jobs: [
    {
      role: "Desarrollador Frontend Senior",
      company: "Pede.ai",
      period: "Nov 2025 – Actualidad",
      place: "Remoto",
      about: "Marketplace de delivery centrado en ciudades pequeñas y medianas de Brasil.",
      bullets: [
        "Lidero la reconstrucción completa de las tres aplicaciones de consumo de la empresa (Pede.ai, Aiboo Delivery y QFome): más de 1,5 M de instalaciones en Google Play (Pede.ai 1 M+, Aiboo 500 K+), valoraciones de 4,7 a 5,0 y ~300.000 sesiones diarias en iOS y Android; responsable de las releases en las tiendas.",
        "Reduje la tasa de ANR en Android en torno a un 90 % en las tres apps (Pede.ai 4,2 % → 0,44 %; Aiboo 4,6 % → 0,46 %; QFome 6,72 % → 0,59 %) mediante refactorización de la arquitectura, modularización y optimización del renderizado.",
        "Rediseñé la interfaz de principio a fin; introduje patrones de diseño, módulos por funcionalidad y animaciones con Reanimated, sustituyendo la gestión de estado heredada por React Query, Zustand y Zod.",
        "Publiqué la versión 6.0, la mayor release de la historia de las apps: nueva home y buscador, recomendaciones personalizadas, checkout con alta de dirección y tarjeta en el propio flujo, Pix con código QR y Apple Pay, seguimiento del pedido en tiempo real (Live Activities) y chat en la app.",
      ],
      stack: "React Native, TypeScript, Reanimated, React Query, Zustand, Zod",
    },
    {
      role: "Ingeniero Full-Stack",
      company: "MB Labs",
      period: "Ago 2024 – Mar 2026",
      place: "Remoto",
      about: "Empresa de asignación de squads tecnológicos; asignado al equipo de Bankeiro, plataforma de core banking white label utilizada por más de 90 fintechs. Actividad simultánea con Pede.ai desde nov 2025.",
      bullets: [
        "Desarrollé y entregué funcionalidades web y móviles para dos fintechs basadas en Bankeiro, Banco BMS (app Meu BMS) y Kesh Bank, sobre bases de código React, React Native y Node.js.",
        "Colaboré con product managers y stakeholders de los clientes en la definición de nuevas funcionalidades y en las decisiones técnicas del roadmap.",
        "Desarrollé servicios Node.js con PostgreSQL e interfaces basadas en design systems (Material UI, Ant Design, Styled Components).",
      ],
      stack: "React, Node.js, React Native, TypeScript, PostgreSQL, Redux, Styled Components, Material UI, Ant Design",
    },
    {
      role: "Ingeniero Full-Stack",
      company: "Mesha Technology",
      period: "Ene 2023 – Ago 2024",
      place: "Remoto",
      about: "Empresa de asignación de equipos para el desarrollo de soluciones digitales.",
      bullets: [
        "Lideré un squad de 6 ingenieros (2 frontend, 3 backend, 1 full-stack) en planificación, revisión de código y decisiones técnicas, en productos internos de Mesha y en dos proyectos para SENAI Alagoas (Hub Digital y Soluções Digitais), con pipeline en Azure DevOps.",
        "Reconstruí desde cero Bluedental, SaaS de gestión para clínicas dentales, con Next.js, NestJS y React Native (Expo), entregando la plataforma web y las apps iOS/Android.",
      ],
      stack: "Next.js, NestJS, React Native, Expo, TypeScript, PostgreSQL, Azure DevOps, Styled Components, Ionic",
    },
    {
      role: "Ingeniero Front-end",
      company: "Foursales Company",
      period: "Ene 2022 – Ene 2023",
      place: "Remoto",
      about: "Empresa de reclutamiento y selección especializada en ventas y marketing.",
      bullets: ["Desarrollé funcionalidades y mejoras de UX para la plataforma de reclutamiento en React, Redux Saga y Sass, junto al equipo de producto."],
      stack: "React, Redux Saga, Sass",
    },
    {
      role: "Desarrollador de Software",
      company: "Otimize IT",
      period: "Ago 2020 – Dic 2021",
      place: "Petrolina, Brasil",
      about: "Empresa de tecnología para pequeños negocios. Promovido desde Desarrollador Interno de Software en ene 2021.",
      bullets: ["Gestioné un equipo de 4 desarrolladores web (metodologías ágiles), entregando e-commerces, sitios y apps en WordPress/PHP y JavaScript."],
      stack: "WordPress, PHP, JavaScript, jQuery, CSS",
    },
  ],
  earlier: "Técnico informático en un despacho de abogados en Petrolina (2016 – 2020), durante la carrera.",
  education: [
    { label: "Formación", value: "Grado en Ciencias de la Computación, Faculdade de Ciências Aplicadas e Sociais de Petrolina (FACAPE), Brasil, 2026" },
    { label: "Idiomas", value: "Portugués (nativo) · Inglés (B1 lectura/escritura, A2 conversación; en estudio) · Español (A1, principiante)" },
    { label: "Autorización", value: "Permiso de trabajo en España en tramitación (cónyuge de ciudadana española); disponible para traslado a España/UE y para trabajo remoto." },
  ],
  ui: {
    pageTitle: "Currículum",
    back: "Volver al portfolio",
    print: "Imprimir",
    download: "Descargar PDF",
    summary: "Perfil profesional",
    skills: "Competencias técnicas",
    experience: "Experiencia profesional",
    earlier: "Experiencia anterior",
    education: "Formación, idiomas y autorización de trabajo",
    updated: "Actualizado en septiembre de 2026",
  },
};

export const cv: Record<Locale, CvContent> = { pt, en, es };
