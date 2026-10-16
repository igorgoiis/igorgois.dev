import type { Locale } from "@/i18n/routing";

type Localized = Record<Locale, string>;

/**
 * Projetos conceituais: sites completos para empresas fictícias, criados para portfólio.
 * Ficam separados dos projetos reais e sempre identificados como conceito.
 */
export type Concept = {
  slug: string;
  name: string;
  url: string;
  cover: string;
  category: Localized;
  description: Localized;
  stack: string[];
};

export const concepts: Concept[] = [
  {
    slug: "solenne",
    name: "Solenne Saúde Integrada",
    url: "https://solenne.igorgois.dev",
    cover: "/projects/conceitos/solenne.webp",
    category: { pt: "Clínica de saúde integrada", en: "Integrated health clinic", es: "Clínica de salud integrada" },
    description: {
      pt: "26 especialidades e 10 exames com página própria, convênios com o que cada plano cobre e agendamento pelo WhatsApp com a mensagem pronta.",
      en: "26 specialties and 10 exams with their own pages, insurance plans with what each one covers and WhatsApp booking with a pre-filled message.",
      es: "26 especialidades y 10 exámenes con página propia, convenios con lo que cubre cada plan y cita por WhatsApp con el mensaje listo.",
    },
    stack: ["Next.js", "Tailwind CSS", "GSAP"],
  },
  {
    slug: "nacar",
    name: "Nácar Odontologia",
    url: "https://nacar.igorgois.dev",
    cover: "/projects/conceitos/nacar.webp",
    category: { pt: "Odontologia estética", en: "Cosmetic dentistry", es: "Odontología estética" },
    description: {
      pt: "Site premium com 13 tratamentos, antes e depois interativo, uma página para cada dentista e transições suaves entre páginas.",
      en: "Premium website with 13 treatments, an interactive before-and-after slider, a page for each dentist and smooth page transitions.",
      es: "Sitio premium con 13 tratamientos, antes y después interactivo, una página para cada dentista y transiciones suaves entre páginas.",
    },
    stack: ["Next.js", "Tailwind CSS", "View Transitions"],
  },
  {
    slug: "cuspide",
    name: "Cúspide Academia de Odontologia",
    url: "https://cuspide.igorgois.dev",
    cover: "/projects/conceitos/cuspide.webp",
    category: { pt: "Escola de cursos", en: "Course school", es: "Escuela de cursos" },
    description: {
      pt: "Calendário de turmas com rolagem animada, página para cada curso e professor, galeria de bastidores e inscrição pelo WhatsApp.",
      en: "Class calendar with animated scrolling, a page for each course and teacher, a behind-the-scenes gallery and WhatsApp sign-up.",
      es: "Calendario de turmas con desplazamiento animado, página para cada curso y profesor, galería de bastidores e inscripción por WhatsApp.",
    },
    stack: ["Next.js", "GSAP", "Lenis"],
  },
  {
    slug: "alento",
    name: "Alento Saúde Integrada",
    url: "https://alento.igorgois.dev",
    cover: "/projects/conceitos/alento.webp",
    category: { pt: "Clínica popular", en: "Community clinic", es: "Clínica popular" },
    description: {
      pt: "Especialidades com filtro por dia da semana, cartão de desconto, pacotes de terapias e botão para agendar com cada profissional.",
      en: "Specialties filtered by weekday, a discount card, therapy packages and a booking button for each professional.",
      es: "Especialidades con filtro por día de la semana, tarjeta de descuento, paquetes de terapias y botón para agendar con cada profesional.",
    },
    stack: ["Next.js", "Tailwind CSS", "Cloudflare Pages"],
  },
];
