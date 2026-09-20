# Cloudflare Docs (Starlight / Astro)

This repository contains the source code for **Cloudflare’s developer documentation** site, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + React + TypeScript.

> **Note**: This is a working copy / development fork of the official Cloudflare Docs codebase (`cloudflare/cloudflare-docs`). The original upstream lives at [Cloudflare-Docs](https://github.com/cloudflare/cloudflare-docs).

---

## Quick Start

### Prerequisites
- Node.js ≥ 24
- pnpm (enforced via `only-allow`)

### Setup and Development

```bash
# Install dependencies
pnpm install

# Start the local development server
pnpm dev
# → http://localhost:4321 (or the port shown)

# Type-check + worker checks
pnpm run check

# Run tests
pnpm test

# Production build
pnpm run build
```
# Environment Configuration
Copy the environment template before running some scripts:
```bash
`cp .env.example` `.env.local`
# Edit `.env.local` with any required values
```
---
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
Most are optional for a basic local `pnpm dev` run. Search-related features need the public Algolia keys 
`.env.local`:
- ​PUBLIC_ALGOLIA_APP_ID
- PUBLIC_ALGOLIA_API_KEY


# Testing
```bash
pnpm test                    # Run all test suites
pnpm test --project Node     # Node / happy-dom tests only
pnpm test -- --coverage      # Execute tests with coverage reporting
```
Tests reside alongside source files using project-specific extensions:
- `​*.node.test.ts`
- `*.astro.test.ts`
- ​`*.worker.test.ts`. 

# Contributing / Development notes

- **Atomic Commits**: Prefer small, focused commits using conventional commit syntax (`feat`:, `fix`:, `test`:, `docs`:).
- **​Test-Driven**: Always include or update unit test files alongside source code changes.
- **​Pre-flight Checks**: Run `pnpm run check` and `pnpm test` before pushing to remote branches.
- **​Code Style**: Formatting is automatically validated and enforced via Prettier and ESLint.

# License 
This project follows the same licenses as the upstream Cloudflare Docs repository: 
- Documentation content: Creative Commons Attribution 4.0 [LICENSE](license.md)
- Code: MIT [LICENSE-CODE](license-code.md)

---
*Cloudflare trademarks remain the property of Cloudflare, Inc.* 
Copyright © 2026 MD ABUL HOSSAIN. All Rights Reserved.
