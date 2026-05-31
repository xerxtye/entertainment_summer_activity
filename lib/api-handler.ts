import { NextResponse } from "next/server";

/**
 * Wraps a route handler so any unhandled error always returns valid JSON.
 * Without this, an uncaught Prisma / DB error causes Next.js to stream an
 * empty body, making the client throw "JSON.parse: unexpected end of data".
 */
export function handle(
  fn: (req: Request) => Promise<NextResponse>
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (err: any) {
      console.error("[API error]", err?.message ?? err);

      // Give a friendlier message for common Prisma connection errors.
      const isDbError =
        err?.code?.startsWith("P1") ||
        err?.code?.startsWith("P2") ||
        err?.message?.includes("connect") ||
        err?.message?.includes("ENOENT") ||
        err?.message?.includes("does not exist");

      const message = isDbError
        ? "Database not reachable. Set DATABASE_URL in Vercel environment variables."
        : (err?.message ?? "Internal server error");

      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
