# Common Tasks

Step-by-step recipes for the changes you'll most often be asked to make. Each one
ends green only after `npm run lint` and `npm run build` pass.

## Add a new API endpoint

1. Create `app/api/<resource>/route.ts`.
2. Copy the skeleton from [conventions.md](conventions.md): import `prisma` +
   `getCurrentUser`, set `dynamic = "force-dynamic"`, guard with `401`.
3. Parse the body with `await req.json().catch(() => ({}))`, validate, `400` on bad input.
4. Query via `prisma`; `select`/`include` only the fields the client needs.
5. Document it in [api-reference.md](api-reference.md).

## Add a field to a model

1. Add the column in [prisma/schema.prisma](../prisma/schema.prisma) (give it a default
   so existing rows stay valid).
2. `npm run db:push`.
3. If it's user-facing in the feed/map, add it to the relevant type in
   [lib/types.ts](../lib/types.ts) and to the route's `select`/`include`.
4. Seed it in [prisma/seed.ts](../prisma/seed.ts) if helpful for the demo.
5. Update [data-model.md](data-model.md).

## Add a new screen

1. Create `app/(app)/<screen>/page.tsx` (lands inside the authed layout + bottom nav).
2. Add a nav entry in [components/BottomNav.tsx](../components/BottomNav.tsx) if it
   should be reachable from the tab bar.
3. Fetch data from an API route with `fetch` from a `"use client"` component.
4. `middleware.ts` already protects anything outside `/onboarding` — no extra guard needed.

## Add a component

1. PascalCase file in `components/`. Add `"use client"` if it uses hooks/events/Leaflet.
2. Type props with a named `interface`. Style with Tailwind utilities.
3. For anything touching Leaflet/`window`, keep it client-only and dynamically imported
   with SSR disabled (follow `MapView` / `LocationPicker`).

## Change feed ordering / filtering

Edit [app/api/events/feed/route.ts](../app/api/events/feed/route.ts). Keep boosted-first
unless told otherwise: `orderBy: [{ isBoosted: "desc" }, { date: "asc" }]`. The route
already excludes the user's own events and anything they've swiped.

## Touch auth / sessions

- Token signing/verifying and the cookie name → [lib/jwt.ts](../lib/jwt.ts).
- Cookie read/write → [lib/session.ts](../lib/session.ts).
- Resolving the session to a `User` → [lib/auth.ts](../lib/auth.ts).
- Page redirect rules → [middleware.ts](../middleware.ts).

Keep the session in the httpOnly cookie. Don't move it to the client.

## Reset the database

```bash
npm run db:reset   # force-reset schema + re-seed (8 demo events, 2 organizers)
```

## Verify your change

```bash
npm run lint
npm run build
npm run dev        # manual smoke test at http://localhost:3000
```

For a multi-user demo on local Wi-Fi: `npm run dev -- -H 0.0.0.0`.
