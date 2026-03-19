import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user?.email || !(session.user as any).isAdmin) {
    throw new Error("Admin access required");
  }

  return session;
}
