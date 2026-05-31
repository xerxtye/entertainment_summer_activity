import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const PATCH = handle(async (req) => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, string> = {};
  if (typeof body.name === "string") data.name = body.name.slice(0, 60);
  if (typeof body.about === "string") data.about = body.about.slice(0, 500);
  if (typeof body.photoUrl === "string") data.photoUrl = body.photoUrl.slice(0, 500);

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ user: updated });
});
