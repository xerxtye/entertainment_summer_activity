import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ connections: [] }, { status: 401 });

  const asApplicant = await prisma.application.findMany({
    where: { applicantId: user.id, status: "ACCEPTED" },
    include: {
      event: {
        select: {
          title: true,
          organizer: { select: { id: true, name: true, photoUrl: true } },
        },
      },
    },
  });

  const asOrganizer = await prisma.application.findMany({
    where: { status: "ACCEPTED", event: { organizerId: user.id } },
    include: {
      applicant: { select: { id: true, name: true, photoUrl: true } },
      event: { select: { title: true } },
    },
  });

  const map = new Map<
    string,
    { id: string; name: string; photoUrl: string; via: string }
  >();

  for (const a of asApplicant) {
    const o = a.event.organizer;
    if (o.id !== user.id)
      map.set(o.id, { ...o, via: `Host of "${a.event.title}"` });
  }
  for (const a of asOrganizer) {
    const p = a.applicant;
    if (p.id !== user.id)
      map.set(p.id, { ...p, via: `Joined your "${a.event.title}"` });
  }

  return NextResponse.json({ connections: Array.from(map.values()) });
});
