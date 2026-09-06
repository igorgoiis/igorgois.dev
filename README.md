# igorgois.dev

Portfólio pessoal de Igor Gois, engenheiro de software full-stack. Trilíngue (PT, EN, ES), com nome em partículas, campo de estrelas, seção pinada "Da ideia à loja" e projetos em molduras de navegador e telefone.

Personal portfolio of Igor Gois, full-stack software engineer. Trilingual (PT, EN, ES), with a particle name, starfield, a pinned "From idea to store" section and projects in browser and phone frames.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl, Lenis, next-themes. Animações em canvas 2D puro e CSS, sem GSAP ou Framer Motion.

## Rodar

```bash
npm install
npm run dev            # http://localhost:3000
npm run dev -- -H 0.0.0.0   # acessível pelo celular na mesma rede
npm run build && npm run start
```

## Onde mexer

- `src/config/site.ts` — nome, e-mail, links, localização, caminhos dos CVs
- `messages/{pt,en,es}.json` — todos os textos
- `src/data/projects.ts` — cases e galerias de telas
- `src/data/experience.ts` — linha do tempo e stack
- `public/projects/` — capas e prints; `public/cv/` — currículos

## Rotas

`/pt`, `/en`, `/es`, com `hreflang`, `sitemap.xml`, `robots.txt` e imagem OpenGraph por idioma.
