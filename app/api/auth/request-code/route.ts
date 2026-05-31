import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({ phone: "" }));
  const normalized = normalizePhone(phone || "");

  if (normalized.replace(/\D/g, "").length < 6) {
    return NextResponse.json(
      { error: "Enter a valid phone number." },
      { status: 400 }
    );
  }

  // FAKE SMS: generate a random 4-digit code and return it so the UI can show it.
  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.deleteMany({ where: { phone: normalized } });
  await prisma.verificationCode.create({
    data: { phone: normalized, code, expiresAt },
  });

  return NextResponse.json({ phone: normalized, code });
}
