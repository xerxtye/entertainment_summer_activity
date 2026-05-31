import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
});
