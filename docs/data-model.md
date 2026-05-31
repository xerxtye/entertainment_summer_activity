# Data Model

Defined in [prisma/schema.prisma](../prisma/schema.prisma). Provider is `sqlite`
locally, `postgresql` for deploy. Change the schema, then run `npm run db:push`.

## Models

### User
The account. Created/upserted by phone on first verify.
- `id` (cuid), `phone` (unique), `name`, `about`, `photoUrl`
- `isBoosted: boolean` — Boost subscription flag (drives feed ordering)
- Relations: `events` (as Organizer), `swipes`, `applications`

### VerificationCode
Short-lived fake-SMS code. Indexed by `phone`.
- `phone`, `code`, `expiresAt`, `createdAt`
- Created on request-code; deleted after verify (and on each new request for that phone).

### Event
- `title`, `description`, `locationName`, `lat`, `lng`, `date`, `photoUrl`
- `isPublic: boolean` — public = instant accept; private = host approves
- `isBoosted: boolean` — set from the organizer's Boost flag
- `organizerId` → `User` (relation name `"Organizer"`, `onDelete: Cascade`)
- Relations: `swipes`, `applications`

### Swipe
One row per (user, event). Upserted, so re-swiping updates direction.
- `direction: "LIKE" | "SKIP"` (string)
- `userId` → User, `eventId` → Event (both `Cascade`)
- `@@unique([userId, eventId])`

### Application
Created after a LIKE when the user submits the application form.
- `message`, `status: "PENDING" | "ACCEPTED"` (string)
- `applicantId` → User, `eventId` → Event (both `Cascade`)
- `@@unique([applicantId, eventId])`

## Relationships at a glance

```
User 1──┬──* Event        (organizer)
        ├──* Swipe
        └──* Application   (applicant)

Event 1──┬──* Swipe
         └──* Application
```

## Status / enum-like values

These are plain strings (SQLite has no native enums). Use the exact literals:
- `Swipe.direction`: `"LIKE"`, `"SKIP"`
- `Application.status`: `"PENDING"`, `"ACCEPTED"`

## Derived concepts (not columns)

- **Accepted events** (map): `Application` where `applicantId = me` and `status = "ACCEPTED"`.
- **Connections**: the union of organizers of events I joined and applicants accepted
  into events I host — computed in `GET /api/connections`, not stored.
- **Boosted ordering**: `orderBy: [{ isBoosted: "desc" }, { date: "asc" }]`.

## Changing the schema

1. Edit `prisma/schema.prisma`.
2. `npm run db:push` (regenerates the client + updates the SQLite file).
3. Update [prisma/seed.ts](../prisma/seed.ts) if new required fields need demo data.
4. `npm run db:reset` to wipe and re-seed during development.
