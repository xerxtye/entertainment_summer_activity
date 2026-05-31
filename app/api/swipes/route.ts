import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, direction } = await req.json().catch(() => ({}));
  if (!eventId || !["LIKE", "SKIP"].includes(direction)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await prisma.swipe.upsert({
    where: { userId_eventId: { userId: user.id, eventId } },
    update: { direction },
    create: { userId: user.id, eventId, direction },
  });

  return NextResponse.json({ ok: true });
});
