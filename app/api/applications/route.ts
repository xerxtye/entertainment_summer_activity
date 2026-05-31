import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, message } = await req.json().catch(() => ({}));
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Public events need no host confirmation -> auto ACCEPTED.
  // Private events stay PENDING until the host approves.
  const status = event.isPublic ? "ACCEPTED" : "PENDING";

  const application = await prisma.application.upsert({
    where: { applicantId_eventId: { applicantId: user.id, eventId } },
    update: { message: String(message || "").slice(0, 500), status },
    create: {
      applicantId: user.id,
      eventId,
      message: String(message || "").slice(0, 500),
      status,
    },
  });

  return NextResponse.json({ application, status });
}
