import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export const POST = handle(async (req) => {
  const { phone } = await req.json().catch(() => ({ phone: "" }));
  const normalized = normalizePhone(phone || "");

  if (normalized.replace(/\D/g, "").length < 6) {
    return NextResponse.json(
      { error: "Enter a valid phone number." },
      { status: 400 }
    );
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.deleteMany({ where: { phone: normalized } });
  await prisma.verificationCode.create({
    data: { phone: normalized, code, expiresAt },
  });

  return NextResponse.json({ phone: normalized, code });
});
