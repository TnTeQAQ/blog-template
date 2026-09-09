# Minimal Blog Template

[![CI](https://github.com/TnTeQAQ/blog-template/actions/workflows/ci.yml/badge.svg)](https://github.com/TnTeQAQ/blog-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)

English · [简体中文](README.zh-CN.md)

A minimalist black-and-white personal blog template powered by **React 19 + Vite 8 + TypeScript**, with a self-written Markdown engine, a Three.js hero and carefully tuned motion design. Writing a post is just dropping in a Markdown file. **No backend, no database — the build emits static files you can host free on GitHub Pages / Vercel / Cloudflare Pages.**

- Live demo: **https://tnteqaq.com**

## Features

- **Self-written Markdown → React renderer** — no react-markdown / remark; headings, lists, tables, quotes, fenced code and raw HTML all supported
- **Content as files** — posts live in `content/posts/`; co-located sibling folders hold images and relative paths are resolved and bundled automatically
- **Three.js particle hero** with scroll-driven fly-through (respects the OS "reduce motion" setting)
- **Black-and-white minimal design** with a unified interaction layer: custom cursor, magnetic / tilt / parallax / flip effects (anime.js)
- **Dark mode** with no flash of unstyled content
- **Clean-URL router** on History state — deep links use real paths (`/archive`, `/posts/slug`, `/tags/tag`) that fold back to the root after open, with back/forward and scroll restoration
- **Fully static** — `npm run build` emits a `dist/` folder deployable to any static host

## Quick Start

1. Click **Use this template** → **Create a new repository**:

   [![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=blog-template&template_owner=TnTeQAQ)

2. Install and run (Node.js ≥ 20):

   ```bash
   npm install
   npm run dev      # http://localhost:5173
   ```

3. Edit `.env` with your site name, delete the demo posts, then deploy (see below).

## Daily writing workflow (Hexo-style)

```bash
npm install                        # once
npm run new -- "My first post"     # scaffolds the post + image folder
# edit content/posts/My-first-post.md, drop images into its sibling folder
npm run deploy                     # build locally + push the site to <user>.github.io
```

- `npm run new -- "Title" --tags notes,web` adds tags; `--slug my-post` overrides the file name
- `npm run deploy -- "fix css"` sets a custom commit message (a timestamped one is the default)
- Posts and branding stay in this working copy only (gitignored) — `deploy` publishes just the built pages, so nothing personal is committed to the public template

## Writing Posts

Use `npm run new`, or manually create `content/posts/my-first-post.md`:

```markdown
---
title: My First Post
date: 2026-01-15
tags: [notes, frontend]
excerpt: A short summary shown on the post card
cover: ./my-first-post/cover.png
---

Markdown body…

![screenshot](./my-first-post/screenshot.png)
```

Conventions:

- **Images**: place them in the sibling folder `content/posts/my-first-post/`; both `./my-first-post/x.png` and the shorthand `./x.png` resolve automatically
- The **file name is the slug** (non-ASCII names are fine)
- `tags` generate tag pages automatically
- Tag a post with `hidden` to keep it out of the archive (still reachable via tag pages)
- The About page is `content/about.md`, rendered through the same engine
- Raw `.html` files are also passed through

Posts are sorted by `date` descending; the home page shows the two newest.

## Configuration

Brand strings live in `.env` (Vite env vars, baked into the bundle — **never put secrets here**):

| Var | Purpose | Default |
| --- | --- | --- |
| `VITE_SITE_NAME` | Hero title and document-title suffix | `My Blog` |
| `VITE_SITE_SUBTITLE` | Hero tagline | `A minimalist blog template` |
| `VITE_SITE_ABOUT` | Home-page About teaser | built-in English text |
| `VITE_BASE` | Sub-path hosting, e.g. `/blog/`; `/` for root or custom domain | `/` |

Use `.env.local` (gitignored) for local overrides. See `.env.example`.

## Routing & deep links

In-app navigation keeps the address bar at the root (page state lives in
`history.state`), but every page is also reachable through a real path:

| Page | Path |
| --- | --- |
| Home | `/` |
| Archive | `/archive` |
| About | `/about` |
| Lab | `/lab` |
| A post | `/posts/<slug>` |
| A tag | `/tags/<tag>` |

Opening such a link renders the page immediately, then folds the address bar
back to the root, so shared links and refreshes work while the bar stays
clean; browser Back returns to Home. Unknown paths show the branded 404 page.

On static hosts the server must serve `index.html` for these paths (SPA
fallback). `npm run deploy` copies `index.html` → `404.html` for GitHub Pages;
Vercel / Netlify / Cloudflare Pages handle it automatically.

## Deployment

### GitHub Pages via `<user>.github.io` (recommended, free)

Push the built site straight to your user-pages repo — no Actions, no CI:

1. Add the deploy remote once:

   ```bash
   git remote add pages git@github.com:<user>/<user>.github.io.git
   ```

2. **Settings → Pages → Build and deployment → Source** → **Deploy from a branch** → branch `main`, folder `/ (root)`;
3. Publish any time with `npm run deploy` — it builds `dist/` and force-pushes it to `pages`'s `main`.

> Custom domain: after the first deploy, add your domain under Settings → Pages; GitHub reads the `CNAME` the build already emitted into `dist/`.

### Custom domain (GitHub Pages)

1. Put your domain in `public/CNAME` (local only — the build copies it into `dist/`, and `npm run deploy` ships it);
2. Point DNS at GitHub Pages: root `A` records to `185.199.108.153` / `.109.` / `.110.` / `.111.153`, and a `www` `CNAME` to `<user>.github.io`;
3. Add the domain under Settings → Pages and enable **Enforce HTTPS** once the certificate is ready.

### Other platforms

Every platform uses build command `npm run build` and output dir `dist`:

- **Vercel** — import the repo, pick the Vite preset, zero other config; sub-paths just work.
- **Cloudflare Pages** — command `npm run build`, output `dist`.
- **Netlify** — same settings; you can add `netlify.toml` for SPA behavior (rarely needed with the single-root router).
- **Any static server / object storage** — upload the contents of `dist/`.

## Pulling template updates later

Your repo evolves independently, but you can still merge future template updates:

```bash
git remote add template https://github.com/TnTeQAQ/blog-template.git
git fetch template
git merge template/main --allow-unrelated-histories
# content/ and .env never conflict; if config files clash, keep your site config
```

## Project structure

```
├── content/
│   ├── about.md              # About page
│   └── posts/                # posts (.md/.html) + co-located asset folders
├── public/                   # favicon, robots.txt, CNAME (for custom domains)
├── src/
│   ├── components/           # UI and interaction components (Fx/Reveal/ThreeHero…)
│   ├── lib/markdown/         # self-written Markdown tokenizer and renderer
│   ├── pages/                # Home / Archive / Lab / Post views
│   ├── router/               # single-root History router
│   └── config.ts             # reads VITE_SITE_* config
├── .github/workflows/        # ci.yml (lint + type-check + build)
├── scripts/                  # new-post.mjs (scaffold) and deploy.mjs (one-push deploy)
└── .env                      # site configuration
```

## Development

```bash
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the build
npm run lint     # ESLint
npm run new      # scaffold a post (npm run new -- "Title")
npm run deploy   # build + push dist/ to the `pages` remote
```

## License

[MIT](LICENSE) © TnTeQAQ
