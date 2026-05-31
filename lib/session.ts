import { cookies } from "next/headers";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE,
  type SessionPayload,
} from "./jwt";

export { SESSION_COOKIE, verifySessionToken };
export type { SessionPayload };

export async function setSession(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
