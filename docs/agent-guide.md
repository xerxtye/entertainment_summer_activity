# Agent Guide

How to work effectively in this repo. Read this first.

## Golden rules

1. **Match what's already here.** This is a small, consistent codebase. Before adding
   anything, find the closest existing example and copy its shape. Do not introduce
   new libraries, state managers, or patterns when the repo already solves the problem.
2. **Keep the MVP spirit.** It's a hackathon project. Prefer the simplest change that
   works. Don't add abstractions, config layers, or "enterprise" structure.
3. **Don't break the run flow.** The whole demo depends on `npm run dev` working with
   SQLite. Never require a real SMS provider, real payments, or cloud services.
4. **Auth is server-side.** Every API route that touches user data must call
   `getCurrentUser()` and return `401` when there's no session. See
   [api-reference.md](api-reference.md).
5. **Stay DB-agnostic.** The code must run on SQLite locally and Postgres in prod
   without code changes. Don't use DB-provider-specific features.

## Project layout

```
app/
  (app)/            # authenticated screens (feed, map, create, profile) + shared layout
  api/              # route handlers — one folder per resource
  onboarding/       # phone sign-in (the only public screen)
  layout.tsx        # root layout
  page.tsx          # root redirect
components/         # React client components (cards, deck, map, modals, nav)
lib/                # server + shared helpers (auth, jwt, prisma, session, types, format)
prisma/
  schema.prisma     # data model
  seed.ts           # demo data
middleware.ts       # redirects unauthenticated users to /onboarding
```

## Where things live

| You need to… | Go to |
|---|---|
| Add/change a screen | `app/(app)/<screen>/page.tsx` |
| Add/change an endpoint | `app/api/<resource>/route.ts` |
| Read the logged-in user | `getCurrentUser()` / `requireUser()` in [lib/auth.ts](../lib/auth.ts) |
| Touch the DB | `prisma` from [lib/prisma.ts](../lib/prisma.ts) |
| Add a shared type | [lib/types.ts](../lib/types.ts) |
| Change the data model | [prisma/schema.prisma](../prisma/schema.prisma) — then `npm run db:push` |
| Add a UI component | `components/` |

## Before you finish a change

- [ ] `npm run lint` passes (`next lint`).
- [ ] `npm run build` succeeds — the App Router catches many errors only at build time.
- [ ] If you changed `schema.prisma`: ran `npm run db:push` and updated [prisma/seed.ts](../prisma/seed.ts) if needed.
- [ ] New API routes call `getCurrentUser()` and handle the unauthenticated case.
- [ ] No hardcoded secrets. `AUTH_SECRET` and `DATABASE_URL` come from env.
- [ ] No new dependency unless there is no reasonable way to avoid it.

## Hard don'ts

- Don't add real SMS/telephony or real payment integrations — those are intentionally faked.
- Don't move auth to the client or store the session anywhere but the httpOnly cookie.
- Don't bypass `middleware.ts` for page protection.
- Don't add file-upload storage — photos are URLs or suggestions only.
- Don't commit `prisma/dev.db` or `.env` (they're gitignored — keep it that way).
