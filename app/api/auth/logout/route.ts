import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const POST = handle(async () => {
  clearSession();
  return NextResponse.json({ ok: true });
});
