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
- Blog posts use Astro 6's `render()` API: `const { Content, remarkPluginFrontmatter } = await render(post)`.
- Content collection config: `src/content.config.ts`.
- Blog content lives in `src/content/blog/*.{md,mdx}`.
- Blog listing (`src/sections/Blog.astro`) sorts posts by `pubDate` descending and paginates client-side with `PAGINATION_SIZE = 7`.
- `src/remark-reading-time.mjs` is a custom remark plugin wired in `astro.config.mjs`. It injects `minutesRead` into frontmatter, consumed in the blog post page.

## Content + Routing Gotchas

- Blog schema requires frontmatter: `title`, `description`, `pubDate`.
- Blog URLs come from `post.id` (file-based id), not a frontmatter `slug` field.
- Renaming a file under `src/content/blog/` changes its URL.

## UI/Styling Conventions

- Global styles are in `src/style/global.css` and import `@webtui/*` packages.
- Theme is set via `<html data-webtui-theme="catppuccin-mocha">` in `src/layouts/Layout.astro`; keep this when working on theming.
- `Layout.astro` expects a required `filename` prop and renders shared `Navbar` + `Footer`.
- **WebTUI uses custom HTML attributes** (`is-="badge"`, `box-="square"`, `variant-="blue"`, `shear-="both"`). These are not standard HTML; they are WebTUI component directives. See `@webtui/css` docs when modifying components.
- Client-side navigation uses Astro View Transitions (`import { navigate } from "astro:transitions/client"`), not `<a>` clicks for keyboard-driven routes.

## Client-Side Interaction

- **Vim-style keyboard navigation** lives in a `<script>` block in `src/layouts/Layout.astro`. Two modes:
  - `NORMAL` — default; `p` → `/portfolio`, `n` → `/now`, `b` → enter BLOG mode, `Escape` → navigate to `/`.
  - `BLOG` — `j`/`k` select entries, `h`/`l` paginate, `Enter` opens selected post, `Escape` returns to NORMAL.
- Pagination state is synchronised via a `MutationObserver` on `data-pagination-index` in `src/sections/Blog.astro`.

## Repo Hygiene

- Do not edit generated output in `.astro/` or `dist/`.
- Astro formatting is configured through Prettier + `prettier-plugin-astro` (`.prettierrc.mjs`).
- Current code only defines pages for `/` and `/blog/[slug]`; links like `/portfolio` and `/now` in `Navbar.astro` are placeholders unless you add matching pages.