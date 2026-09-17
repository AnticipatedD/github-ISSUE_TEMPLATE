# Cloudflare Docs (Starlight / Astro)

This repository contains the source code for **Cloudflare’s developer documentation** site, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + React + TypeScript.

> **Note**: This is a working copy / development fork of the official Cloudflare Docs codebase (`cloudflare/cloudflare-docs`). The original upstream lives at https://github.com/cloudflare/cloudflare-docs.

## Quick start

**Prerequisites**
- Node.js ≥ 24
- pnpm (enforced via `only-allow`)

```bash
# Install dependencies
pnpm install

# Start the local development server
pnpm dev
# → http://localhost:4321 (or the port shown)

# Type-check + worker checks
`pnpm run check`

# Run tests
`pnpm test`

# Production build
`pnpm run build`

Copy the environment template before running some scripts:
```bash
`cp .env.example` `.env.local`

# Edit `.env.local` with any required values
```

# Architecture overview data

| Path              | Purpose                                   |
|-------------------|------------------------------------------------------------------------------|
| `src/content/`      | Markdown / MDX documentation content                                           |
| `src/components/`   | React + Astro components (ModelCatalog, SchemaTree, DirectoryCatalog, etc.)  |
| `src/util/`         | Shared utilities (sidebar generation, model helpers, Algolia config, etc.)   |
| `worker/`           | Cloudflare Worker runtime code                                            |
| `bin/ & scripts/`   | Build-time and utility scripts                                                |
| `astro.config.ts`   | Astro + Starlight configuration                                        |
| `vitest.config.ts`  | Multi-project Vitest setup (Node / Astro / Workers) |

# Key technologies:
- **Astro 6 + Starlight** for the docs framework
- **React 19** for interactive components
- **TypeScript + Zod / Valibot** for type safety and validation
- **pnpm + Vitest + ESLint + Prettier**
- **Cloudflare Workers** + Wrangler

# Environment variables 
See `.env.example` for the full list of variables referenced by the codebase.
Most are optional for a basic local `pnpm dev` run. Search-related features need the public Algolia keys. 

# Testing
```bash
pnpm test                    # all projects
pnpm test --project Node     # Node / happy-dom tests only
pnpm test -- --coverage      # with coverage (once configured)
```
Tests live next to source files and follow the naming convention `*.node.test.ts`, `*.astro.test.ts`, or `*.worker.test.ts`. 

# Contributing / Development notes
- Prefer small, focused commits that include the corresponding tests.
- Run `pnpm run check` and `pnpm test` before pushing.
- Formatting is enforced via Prettier + Husky.

# License 
This project follows the same licenses as the upstream Cloudflare Docs repository: 
- Documentation content: Creative Commons Attribution 4.0 (LICENSE)
- Code: MIT (LICENSE-CODE)

Cloudflare trademarks remain the property of Cloudflare, Inc. 

*Last updated for DataFactor score improvements*

---

### 2. `src/util/algolia.ts` (replace the whole file)

```ts
/**
 * Algolia configuration for Cloudflare Docs search.
 * Values are read from environment variables so secrets never live in source.
 *
 * Set these in .env.local (or your deployment environment):
 *   PUBLIC_ALGOLIA_APP_ID=...
 *   PUBLIC_ALGOLIA_API_KEY=...   (search-only key)
 */

export const ALGOLIA_APP_ID =
    import.meta.env.PUBLIC_ALGOLIA_APP_ID ?? "YOUR_ALGOLIA_APP_ID";

export const ALGOLIA_API_KEY =
    import.meta.env.PUBLIC_ALGOLIA_API_KEY ?? "";

export const ALGOLIA_INDEX = "prod_devdocs";
export const ALGOLIA_INDEX_STYLE_GUIDE = "prod_devdocs_styleguide";
```

> [!IMPORTANT]
>: *After this change, if the old key was a live production key, rotate it in the Algolia dashboard because it still exists in git history.*
