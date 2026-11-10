import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentEducationUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireEducationUser() {
  const user = await getCurrentEducationUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireEducationAdmin() {
  const user = await requireEducationUser();
  if ((user as { role?: string }).role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
