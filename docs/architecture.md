# Architecture

How the app is wired together.

## Request lifecycle

1. **`middleware.ts`** runs on every page request (not API routes — those are excluded
   by the matcher). It reads the session cookie, verifies the JWT, and:
   - redirects unauthenticated users to `/onboarding`,
   - redirects already-signed-in users away from `/onboarding` to `/feed`.
2. **Page** (`app/(app)/*/page.tsx`) renders. Authenticated screens live under the
   `(app)` route group and share `app/(app)/layout.tsx` (which includes the bottom nav).
3. **Client components** in `components/` fetch from the API routes via `fetch`.
4. **API route** (`app/api/*/route.ts`) reads the user with `getCurrentUser()`, talks
   to the DB through `prisma`, and returns JSON.

## Auth (phone-only, fake SMS)

The flow is deliberately fake for the demo, but the session mechanism is real.

```
/onboarding
  → POST /api/auth/request-code   (creates a VerificationCode, returns the demo code)
  → POST /api/auth/verify         (checks code, upserts User, sets session cookie)
  → middleware now lets the user into (app) screens
```

- **`lib/jwt.ts`** — signs/verifies the session JWT with `jose`. Defines `SESSION_COOKIE`
  and `SessionPayload`. Edge-safe (used by middleware).
- **`lib/session.ts`** — cookie read/write helpers (`setSession`, `clearSession`,
  `getSession`) using `next/headers`. Cookie is `httpOnly`, `sameSite=lax`,
  `secure` in production, 30-day max-age.
- **`lib/auth.ts`** — `getCurrentUser()` resolves the session to a DB `User` (or `null`);
  `requireUser()` throws `"UNAUTHORIZED"` when there's no session.

**Rule:** middleware guards *pages*; each API route guards *itself* by calling
`getCurrentUser()`. Both layers exist on purpose.

## Data access

- Single Prisma client singleton in [lib/prisma.ts](../lib/prisma.ts) (avoids exhausting
  connections during dev hot-reload).
- Provider is `sqlite` locally; swap to `postgresql` for deploy (see root README).
- All queries go through `prisma`. No raw SQL, no second ORM.

## Core domain flow

```
User swipes event ──► Swipe (LIKE | SKIP)
   swipe LIKE ──► user fills ApplicationModal ──► Application (PENDING)
   public event  ──► host need not confirm; treated as accepted
   private event ──► host approves later ──► Application (ACCEPTED)
Accepted applications ──► event appears on the user's Map
Boost (profile) ──► User.isBoosted = true ──► that user's events sort first in feeds
```

See [data-model.md](data-model.md) for the exact models.

## Maps

- Leaflet + react-leaflet + OpenStreetMap tiles (no API key).
- [components/MapView.tsx](../components/MapView.tsx) shows accepted events.
- [components/LocationPicker.tsx](../components/LocationPicker.tsx) is the "tap to pin"
  picker used when creating an event.
- Leaflet touches `window`, so map components are client-only (`"use client"`) and
  usually loaded dynamically with SSR disabled. Keep them that way.

## Rendering notes

- API routes that depend on the session use `export const dynamic = "force-dynamic"`
  so Next doesn't try to statically cache per-user data. Copy this on new user-scoped routes.
