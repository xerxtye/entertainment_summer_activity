import { prisma } from "./prisma";
import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
