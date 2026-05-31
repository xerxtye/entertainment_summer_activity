import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  const events = await prisma.event.findMany({
    where: { organizerId: user.id },
    include: {
      _count: { select: { applications: true } },
      applications: {
        include: {
          applicant: { select: { id: true, name: true, photoUrl: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
});
