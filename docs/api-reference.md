# API Reference

All routes are Next.js App Router handlers under `app/api/`. Every handler sets
`export const dynamic = "force-dynamic"`. JSON in, JSON out.

**Auth convention:** routes that touch user data call `getCurrentUser()` and return
`401` when there's no session. The `401` body uses a safe empty shape
(`{ events: [] }`, `{ connections: [] }`, `{ user: null }`, or `{ error: "Unauthorized" }`).

## Auth

### `POST /api/auth/request-code`
Fake SMS. Generates a 4-digit code, stores a `VerificationCode` (10-min expiry,
clears prior codes for the phone), and **returns the code** so the UI can display it.
- Body: `{ phone: string }` — normalized to digits/`+`; needs ≥6 digits.
- Returns: `{ phone, code }` · `400` on invalid phone.

### `POST /api/auth/verify`
Checks the code, upserts the `User` by phone, sets the session cookie.
- Body: `{ phone: string, code: string }`
- Returns: `{ user, isNew }` · `400` on invalid/expired code.

### `GET /api/auth/me`
Current user from the session.
- Returns: `{ user }` · `401` → `{ user: null }`.

### `POST /api/auth/logout`
Clears the session cookie. Returns `{ ok: true }`.

## Events

### `GET /api/events/feed`
Swipe feed. Events **not** organized by the user and **not** already swiped.
Ordered boosted-first, then soonest date. Includes minimal `organizer`.
- Returns: `{ events }` · `401` → `{ events: [] }`.

### `POST /api/events`
Create an event. New events inherit the organizer's `isBoosted` flag.
- Body: `{ title, description?, locationName?, lat, lng, date, photoUrl?, isPublic? }`
  — `title`, `date`, and numeric `lat`/`lng` are required; `isPublic` defaults to `true`.
- Field caps: title 120, description 1000, locationName 160.
- Returns: `{ event }` · `400` if required fields missing.

### `GET /api/events/mine`
Events the user organizes, with applicant list and an application count.
- Returns: `{ events }` (each includes `applications[].applicant` and `_count.applications`).

### `GET /api/events/accepted`
Events the user was **ACCEPTED** into — these render on the map.
- Returns: `{ events }` (each includes `organizer`).

## Swipes

### `POST /api/swipes`
Records/updates a swipe (upsert on `userId_eventId`).
- Body: `{ eventId: string, direction: "LIKE" | "SKIP" }`
- Returns: `{ ok: true }` · `400` on bad direction/missing id.

## Applications

### `POST /api/applications`
Apply to an event after a LIKE. Status is decided server-side:
**public → `ACCEPTED`** (no host confirmation), **private → `PENDING`**.
Upsert on `applicantId_eventId`. Message capped at 500 chars.
- Body: `{ eventId: string, message?: string }`
- Returns: `{ application, status }` · `400` missing id · `404` event not found.

## Connections

### `GET /api/connections`
People tied to ACCEPTED applications, deduped, both directions: hosts of events you
joined, and applicants accepted into events you host. Each entry has a `via` label.
- Returns: `{ connections: [{ id, name, photoUrl, via }] }`.

## Boost (fake subscription)

### `POST /api/boost`
Toggles `User.isBoosted` and applies the same flag to all the user's events.
- Body: `{ enabled?: boolean }` — omit to flip the current value.
- Returns: `{ user }`.

## Profile

### `PATCH /api/profile`
Partial update of the user's profile. Only provided string fields are written.
- Body: any of `{ name?, about?, photoUrl? }` (caps: 60 / 500 / 500).
- Returns: `{ user }`.

## Adding a new route — checklist

- Folder `app/api/<resource>/route.ts`, export the verb function.
- `export const dynamic = "force-dynamic"` if user-scoped.
- Call `getCurrentUser()`; return `401` with a safe empty shape.
- Parse the body defensively: `await req.json().catch(() => ({}))`.
- Validate inputs, return `400` with a clear message on bad input.
- Cap string lengths with `.slice(...)` like the existing routes do.
