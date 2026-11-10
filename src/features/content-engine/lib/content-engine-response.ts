import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
export function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  const status = message === "UNAUTHORIZED" ? 401 : message === "NOT_FOUND" ? 404 : message === "FORBIDDEN" ? 403 : 400;
  return NextResponse.json({ success: false, message }, { status });
}
export function actionError(error: unknown) {
  return { success: false as const, message: error instanceof Error ? error.message : "Unexpected error" };
}
