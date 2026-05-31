import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export const POST = handle(async (req) => {
  const body = await req.json().catch(() => ({}));
  const phone = normalizePhone(body.phone || "");
  const code = String(body.code || "").trim();

  const record = await prisma.verificationCode.findFirst({
    where: { phone, code, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired code." },
      { status: 400 }
    );
  }

  await prisma.verificationCode.deleteMany({ where: { phone } });

  const isNew = !(await prisma.user.findUnique({ where: { phone } }));
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  await setSession({ userId: user.id, phone: user.phone });

  return NextResponse.json({ user, isNew });
});
