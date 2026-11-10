import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function requireContentEngineUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return { id: session.user.id, email: session.user.email, name: session.user.name };
}
