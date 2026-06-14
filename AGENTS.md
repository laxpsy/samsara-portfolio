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
- Routes:
  - `/` — `src/pages/index.astro`
  - `/blog/[slug]` — `src/pages/blog/[slug].astro` (collection: `blog`)
  - `/notes/[slug]` — `src/pages/notes/[slug].astro` (collection: `notes`)
  - `/portfolio` — `src/pages/portfolio.astro` (placeholder)
  - `/now` — `src/pages/now.astro` (sourced from `src/content/now.mdx`)
- Blog and notes use Astro 6's `render()` API: `const { Content, remarkPluginFrontmatter } = await render(post)`.
- Content collection config: `src/content.config.ts`. Two collections: `blog` and `notes`. `now.mdx` is a standalone MDX import in `now.astro` (not a collection).
- Blog listing (`src/sections/Blog.astro`) sorts by `pubDate` descending, renders both blog and notes entries (tagged with `data-collection`), paginates client-side with `PAGINATION_SIZE = 7`, and swaps the active collection on mode change.
- `src/remark-reading-time.mjs` is a custom remark plugin wired in `astro.config.mjs`. It injects `minutesRead` into frontmatter, consumed in the blog/notes post page.

## Content + Routing Gotchas

- Blog schema requires frontmatter: `title`, `description`, `pubDate`. URLs come from `post.id` (file-based id), not a frontmatter `slug` field.
- Notes schema requires: `title`, `description`, `pubDate`. Optional: `source: z.array(z.string()).default([])` — rendered as a "References" section in `/notes/[slug].astro` (URLs become `<a>`, other strings render as text).
- Renaming a file under `src/content/blog/` or `src/content/notes/` changes its URL.
- `src/content/now.mdx` is imported as `import { Content } from "../content/now.mdx"` in `now.astro` (Astro MDX import syntax, not a content collection).
- Local test files use `_test*.md` prefix; the `_*.md` gitignore rule prevents them from being committed.

## UI/Styling Conventions

- Global styles are in `src/style/global.css` and import `@webtui/*` packages.
- Theme is set via `<html data-webtui-theme="catppuccin-mocha">` in `src/layouts/Layout.astro`; keep this when working on theming.
- `Layout.astro` expects a required `filename` prop and renders shared `Navbar` + `Footer` + `KeyBindings`.
- **WebTUI uses custom HTML attributes** (`is-="badge"`, `box-="square"`, `variant-="blue"`, `shear-="both"`). Not standard HTML; see `@webtui/css` docs.
- Client-side navigation uses Astro View Transitions (`import { navigate } from "astro:transitions/client"`), not `<a>` clicks for keyboard-driven routes.
- `.prose .references` and `.prose .footnotes` share the same `background-color` + `border` treatment in `global.css` — dimmed Catppuccin box style.

## Client-Side Interaction

- **Vim-style keyboard navigation** lives in a `<script>` block in `src/layouts/Layout.astro`. Three modes:
  - `NORMAL` — default. `p` → `/portfolio`, `n` → `/now`, `b` → enter BLOG mode, `o` followed by `*` within 1s → enter NOTES mode (secret), `Escape` → navigate to `/`.
  - `BLOG` — `j`/`k` select entries, `h`/`l` paginate, `Enter` opens selected post, `Escape` returns to NORMAL, `b` switches to BLOG.
  - `NOTES` — same `j`/`k`/`h`/`l`/`Enter` behaviour as BLOG, `b` switches to BLOG, `Escape` returns to NORMAL.
- Pagination state is synchronised via a `MutationObserver` on `data-pagination-index` in `src/sections/Blog.astro`. Pagination also updates `data-collection` and resets `currentPage` on mode swap.
- **Swipe pagination** is wired with `touchstart`/`touchend` on `#blog-box` in `src/sections/Blog.astro`. A diagonal guard (`Math.abs(dy) > Math.abs(dx)`) prevents vertical scrolls from triggering pagination.
- **Clickable pagination** (`<`/`>`) in the Blog.astro footer. Mauve-coloured, font-weight 600. Hidden at first/last page.
- **Keybindings overlay** is a `<KeyBindings />` component in `src/components/KeyBindings.astro`. Toggled by `?`, closed by `q`/`Esc`. Reads `AGNOSTIC_BINDINGS` + per-route `bindingsByPageAndMode` and renders them as a two-column overlay. NOTES mode is **intentionally not** documented here.
- The `o*` sequence is gated by a 1s timeout (`armOPress()` sets `lastOPress = true`, cleared after `O_SEQUENCE_TIMEOUT`).

## Repo Hygiene

- Do not edit generated output in `.astro/` or `dist/`.
- Astro formatting is configured through Prettier + `prettier-plugin-astro` (`.prettierrc.mjs`).
- All routes have matching pages now (`/`, `/blog/[slug]`, `/notes/[slug]`, `/portfolio`, `/now`).
- Hidden dev/debug state lives in `src/remark-reading-time.mjs` and `src/content/now.mdx`.