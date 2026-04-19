# AGENTS

## Quick Facts

- Single-package Astro 6 site (not a monorepo).
- Runtime/tooling baseline: Node `>=22.12.0` (`package.json` engines).
- Dependency lockfile is `bun.lock`; use Bun commands by default.

## Dev Commands (source of truth: `package.json`)

- Install deps: `bun install`
- Start dev server: `bun run dev`
- Production build: `bun run build`
- Preview build: `bun run preview`

## Verification

- There are currently no `test`, `lint`, or explicit `typecheck` scripts.
- Main verification step after edits is `bun run build`.

## Architecture That Matters

- Main page entry: `src/pages/index.astro`.
- Blog post route: `src/pages/blog/[slug].astro` with `getStaticPaths()` from `getCollection("blog")`.
- Content collection config: `src/content.config.ts`.
- Blog content lives in `src/content/blog/*.{md,mdx}`.

## Content + Routing Gotchas

- Blog schema requires frontmatter: `title`, `description`, `pubDate`.
- Blog URLs come from `post.id` (file-based id), not a frontmatter `slug` field.
- Renaming a file under `src/content/blog/` changes its URL.

## UI/Styling Conventions Already Wired

- Global styles are in `src/style/global.css` and import `@webtui/*` packages.
- Theme is set via `<html data-webtui-theme="catppuccin-mocha">` in `src/layouts/Layout.astro`; keep this when working on theming.
- `Layout.astro` expects a required `filename` prop and renders shared `Navbar` + `Footer`.

## Repo Hygiene

- Do not edit generated output in `.astro/` or `dist/`.
- Astro formatting is configured through Prettier + `prettier-plugin-astro` (`.prettierrc.mjs`).
- Current code only defines pages for `/` and `/blog/[slug]`; links like `/portfolio` and `/now` in `Navbar.astro` are placeholders unless you add matching pages.
