import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  const apps = await prisma.application.findMany({
    where: { applicantId: user.id, status: "ACCEPTED" },
    include: {
      event: {
        include: {
          organizer: { select: { id: true, name: true, photoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const events = apps.map((a) => a.event);
  return NextResponse.json({ events });
});
