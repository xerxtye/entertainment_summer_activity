import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
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
});
