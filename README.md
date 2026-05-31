# 🌱 Touch the Grass (TTG)

Tinder-style discovery for **real-world events**. Swipe through hikes, pickup
soccer, picnics and more — swipe right to apply, get accepted, and see your
events on a map. Built as a 90-minute hackathon MVP.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma** + **SQLite** (swap to Postgres for deploy — see below)
- **Phone-only auth** with a **fake SMS** code shown on screen (`jose` JWT in an httpOnly cookie)
- **Leaflet** + OpenStreetMap for the map and the "tap to pin" location picker (no API key)

## Screens

1. **Onboarding** — phone number → on-screen demo code → verify
2. **Swipe feed** — event cards, swipe right = interested, left = skip forever
3. **Application form** — message the organizer after a right swipe
4. **Map** — only events you were accepted into
5. **Create event** — title, description, tap-to-pin location, date, cover photo, public/private
6. **Profile** — about me, my events (+ applicants), my connections, **Boost** subscription

### Monetization — Boost ⚡

Subscribe to **Boost** on the Profile screen. Boosted users' events surface
first in everyone else's feed and show a **⚡ BOOST** badge on the card.

- Public events: joining is instant (no host confirmation).
- Private events: the host approves requests (they stay pending and don't hit your map until accepted).

## Run locally

```bash
npm install          # also generates the Prisma client
npm run db:push      # create the SQLite schema (prisma/dev.db)
npm run db:seed      # 8 demo events + 2 demo organizers
npm run dev          # http://localhost:3000
```

Open `http://localhost:3000`, enter any phone number, and use the 4-digit code
shown on screen.

> Useful scripts: `npm run db:reset` wipes and re-seeds the database.

## Demo it to a room (multi-user on local Wi-Fi)

Everyone can use the live app from their own phones on the same network:

```bash
npm run dev -- -H 0.0.0.0
```

Then share `http://<your-laptop-LAN-IP>:3000`. Each person signs in with their
own phone number — events, swipes and connections are shared through the same
database, so the feed and map update for everyone in real time.

## Deploy later (Vercel + Postgres)

The code is DB-agnostic. To ship a public URL:

1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. Create a Postgres DB (Neon / Supabase / Vercel Postgres) and set
   `DATABASE_URL` + `AUTH_SECRET` as environment variables.
3. `npx prisma db push && npm run db:seed`
4. `vercel deploy`

No application code changes required.

## Notes / out of scope (intentional)

- Real SMS/telephony and real payments are faked for the demo.
- Photos are chosen from suggestions or pasted as URLs (no upload storage).
- Private-event host approval UI is out of scope; private requests simply stay
  pending.
