import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const enabled =
    typeof body.enabled === "boolean" ? body.enabled : !user.isBoosted;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isBoosted: enabled },
  });
  await prisma.event.updateMany({
    where: { organizerId: user.id },
    data: { isBoosted: enabled },
  });

  return NextResponse.json({ user: updated });
});
