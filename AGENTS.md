# Repository Guidelines

## Project Structure & Modules
- `app/`: Next.js App Router routes, layouts, and server actions.
- `components/`: Reusable UI (React, PascalCase filenames).
- `lib/`: Utilities and clients (e.g., Supabase, Stripe, email, security).
- `stores/`: Global state (Zustand).
- `utils/`, `types/`, `constants/`: Helpers, TypeScript types, shared config.
- `public/`: Static assets (images, fonts).
- `scripts/`: Dev checks and tools (env validation, edge-compat, seeding).
- `supabase/`: Supabase configuration/functions.
- Root: `next.config.ts`, `middleware.ts`, `tsconfig.json`, `eslint.config.mjs`.

## Build, Test, and Dev Commands
- `pnpm dev`: Run Next.js locally (Turbopack).
- `pnpm build`: Production build (also runs `test:security-ci`).
- `pnpm start`: Start production server.
- `pnpm lint`: ESLint (Next core-web-vitals rules).
- `pnpm format`: Prettier format (Tailwind-aware).
- `pnpm db:seed`: Seed product images/records to Supabase.
- `pnpm test:edge-compat`: Check Node/Edge compatibility.
- `pnpm test:dev-env`: Validate required env vars/files.
- `pnpm test:security`: Run both checks locally; blocks obvious misconfig.

## Coding Style & Naming
- Language: TypeScript (strict), ESM.
- Formatting: Prettier + `prettier-plugin-tailwindcss` (2 spaces, semicolons per Prettier defaults). Always run `pnpm format`.
- Linting: ESLint flat config, `next/core-web-vitals` + TypeScript.
- Imports: Use `@/*` path alias from `tsconfig.json`.
- Naming: Components `PascalCase`, hooks `useX`, utilities `camelCase`, route segments in `app/` are lowercase and hyphenated.

## Testing Guidelines
- No unit test framework is configured. Required checks are script-based:
  - Ensure `pnpm test:edge-compat` and `pnpm test:dev-env` pass.
  - Add ad-hoc script tests in `scripts/` when practical.

## Commit & Pull Requests
- Commits: Follow Conventional Commits used in history: `feat`, `fix`, `refactor`, `chore`, etc.
  - Example: `feat: add hero animation`.
- PRs: Provide summary, link issues, and include screenshots for UI changes.
  - Checklist: `pnpm format`, `pnpm lint`, `pnpm build`, `pnpm test:security` all pass.
  - Note any env vars or migration steps.

## Security & Configuration
- Use `.env.local` for secrets; do not commit secrets. Required: `NEXT_PUBLIC_SITE_URL`, Supabase keys, Stripe keys, `RESEND_API_KEY` (see `scripts/validate-dev-environment.js`).
- Seeding uploads to Supabase Storage; ensure bucket and keys exist before `pnpm db:seed`.
- Prefer `pnpm` to keep lockfile consistent.
