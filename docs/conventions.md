# Conventions

Patterns this repo already follows. Match them.

## TypeScript

- Strict TypeScript. Avoid `any`; use `unknown` and narrow for untrusted input.
- Shared/cross-file types live in [lib/types.ts](../lib/types.ts) (`FeedEvent`,
  `CurrentUser`, `Organizer`). Add new shared shapes there rather than redefining inline.
- Let TS infer obvious locals; annotate exported function signatures.

## API routes

Every route handler follows the same skeleton:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic"; // when the route is user-scoped

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  // ...prisma query...
  return NextResponse.json({ events });
}
```

Conventions:
- Return JSON via `NextResponse.json(...)`.
- Unauthenticated → status `401`, with a safe empty payload shape (e.g. `{ events: [] }`).
- Use the `@/` path alias for imports from the project root (`@/lib/...`).
- Name the exported function after the HTTP verb (`GET`, `POST`, etc.).
- Validate request bodies before using them; fail with a clear `400` on bad input.

## Prisma queries

- Use `select` / `include` to fetch only what the client needs (see the feed route
  selecting `organizer: { id, name, photoUrl }`).
- `orderBy` for ordering — boosted-first ordering is `[{ isBoosted: "desc" }, { date: "asc" }]`.
- Statuses are plain strings, documented inline in the schema:
  `Swipe.direction` = `"LIKE" | "SKIP"`, `Application.status` = `"PENDING" | "ACCEPTED"`.
  Reuse those exact literals.

## Components

- Client components start with `"use client"`.
- PascalCase component files in `components/` (e.g. `EventCard.tsx`, `SwipeDeck.tsx`).
- Props typed with a named `interface`/`type`; type callback props explicitly.
- Don't use `React.FC`.

## Styling

- Tailwind utility classes inline. Global styles in [app/globals.css](../app/globals.css).
- Tailwind config in [tailwind.config.ts](../tailwind.config.ts) — extend tokens there
  instead of hardcoding repeated colors/spacing.

## Naming

- Variables/functions: `camelCase`. Booleans: `is`/`has`/`should` prefix
  (`isBoosted`, `isPublic`).
- Types/components: `PascalCase`. Constants: `UPPER_SNAKE_CASE`
  (e.g. `SESSION_COOKIE`, `PUBLIC_PATHS`).

## General

- Small, focused files. Extract a helper rather than growing a route past readability.
- Handle errors explicitly; don't swallow them. User-facing messages stay friendly,
  detailed context stays server-side.
- No `console.log` left in committed code.
- No hardcoded secrets — `AUTH_SECRET`, `DATABASE_URL` come from env only.
