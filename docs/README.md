# Docs for AI Agents

Instructions and reference for AI coding agents (Claude Code, Cursor, etc.) working
on **Touch the Grass (TTG)**. Read these before making changes so your edits match
the existing patterns instead of inventing new ones.

## Read order

1. [agent-guide.md](agent-guide.md) — start here. How to work in this repo, golden rules, do/don't.
2. [architecture.md](architecture.md) — how the app is wired (routes, auth, data flow).
3. [conventions.md](conventions.md) — coding style and patterns this repo already follows.
4. [api-reference.md](api-reference.md) — every API route, its shape, and auth requirement.
5. [data-model.md](data-model.md) — Prisma models and the relationships between them.
6. [common-tasks.md](common-tasks.md) — step-by-step recipes for the changes you'll be asked to make.

## What this project is

Tinder-style discovery for real-world events. Swipe through events, apply, get
accepted, see accepted events on a map. 90-minute hackathon MVP — see the root
[README.md](../README.md) for the product pitch and how to run it.

## One-line stack

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + SQLite · phone-only
fake-SMS auth (JWT in httpOnly cookie) · Leaflet maps.
