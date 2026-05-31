import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ttg_session";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ttg-dev-secret-change-me-in-prod-please-32+chars"
);

export type SessionPayload = { userId: string; phone: string };

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string, phone: payload.phone as string };
  } catch {
    return null;
  }
}
