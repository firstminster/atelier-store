# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This project uses Next.js 16.4 with `cacheComponents` and `partialPrefetching` enabled in `next.config.ts`. Before writing pages, data fetching, caching or route handlers, read the matching guide in `node_modules/next/dist/docs/` (for example `01-app/01-getting-started/08-caching.md` and `01-app/02-guides/authentication.md`) instead of relying on older Next.js conventions.

## Commands

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`: ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- `npm run auth:generate`: Better Auth CLI writes its tables (user, session, account, verification) into `src/db/auth-schema.ts` (overwritten each run; `schema.ts` re-exports it). Re-run after adding Better Auth plugins that need tables.
- `npm run db:seed`: replace all categories and products with the sample catalogue in `src/db/seed.ts` (safe to re-run)
- `npm run db:push`: sync the schema straight to the database (good for prototyping)
- `npm run db:generate` then `npm run db:migrate`: create SQL migrations in `drizzle/` and apply them
- `npm run db:studio`: Drizzle Studio

There is no test framework set up yet.

## Environment

Copy `.env.example` to `.env`. The variables are `DATABASE_URL` (the pooled Neon connection string), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`. `src/db/index.ts` throws on import when `DATABASE_URL` is missing, so any route that touches the database or auth fails without it. `drizzle.config.ts` loads `.env` itself through `dotenv/config`. `.gitignore` excludes every `.env*` file except `.env.example`.

## Architecture

The stack is Next.js App Router (everything lives under `src/`, imported with the `@/*` alias), React 19, Tailwind CSS v4, Drizzle ORM on Neon Postgres, and Better Auth.

- **Tailwind v4** has no `tailwind.config`. Theme tokens are set in `src/app/globals.css` (`@import "tailwindcss"` plus `@theme inline`). CSS goes through the `@tailwindcss/turbopack` loader configured in `next.config.ts`.
- **Database:** `src/db/index.ts` exports a single `db` built with `drizzle-orm/neon-http` over `@neondatabase/serverless`. HTTP mode is stateless and does not support interactive transactions. `src/db/schema.ts` is the schema entry point: it is passed to the `db` client, and drizzle-kit reads it too. App tables go there; it re-exports the generated auth tables from `src/db/auth-schema.ts`.
- **Catalogue:** `categories` and `products` tables (price in cents, one `stock` integer per product; `gallery` and display-only `sizes` are jsonb). Featured categories with an image are the home page "Collections". Pages read through `src/lib/products.ts`, whose functions use `"use cache"` + `cacheLife("hours")` + `cacheTag("products")` and map rows to the `Product` type in `src/lib/catalog.ts` (which also holds display helpers and static editorial imagery). After editing catalogue rows directly, call `revalidateTag("products")` or redeploy. `next build` queries the database for `generateStaticParams`, so the database must be migrated and seeded first.
- **Auth flow:**
  1. The client `authClient` (`src/lib/auth-client.ts`, `better-auth/react`) calls `/api/auth/*`.
  2. The catch-all route `src/app/api/auth/[...all]/route.ts` hands those requests to `toNextJsHandler(auth)`.
  3. `auth` (`src/lib/auth.ts`) stores its data through `drizzleAdapter(db, { provider: "pg" })`.
  4. The `nextCookies()` plugin lets Server Actions set auth cookies.

  To read the session on the server, call `auth.api.getSession({ headers: await headers() })`. Better Auth reads `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from the environment on its own.
- **Current state:** the auth tables haven't been generated yet (`auth-schema.ts` is a placeholder), and `auth.ts` has no sign-in method enabled (no `emailAndPassword` or social providers). There are no carts, orders or variants yet.
