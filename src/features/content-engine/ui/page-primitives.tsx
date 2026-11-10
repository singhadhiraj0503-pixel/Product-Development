import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CEPage({ children }: { children: ReactNode }) {
  return <div className="ce-page min-h-screen bg-[#faf9ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">{children}</div>;
}
export function CEContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9", className)}>{children}</main>;
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><span className="size-1.5 rounded-full bg-indigo-600"/>{children}</div>;
}
export function SectionTitle({ eyebrow, title, description, right }: { eyebrow?: string; title: string; description?: string; right?: ReactNode }) {
  return <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[.14em] text-indigo-600">{eyebrow}</p>}<h2 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h2>{description && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>}</div>{right}</div>;
}
export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const colors = { neutral: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", warn: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", bad: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
  return <Badge className={cn("border-0 text-[9px] font-semibold uppercase tracking-wider", colors[tone])}>{children}</Badge>;
}
