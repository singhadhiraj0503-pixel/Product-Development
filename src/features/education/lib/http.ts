import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json({ success: false, message, ...(errors ? { errors } : {}) }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) return fail("Validation failed", 422, error.flatten());
  if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Authentication required", 401);
  if (error instanceof Error && error.message === "FORBIDDEN") return fail("You do not have permission to perform this action", 403);
  console.error("[education-api]", error);
  return fail("An unexpected error occurred", 500);
}
