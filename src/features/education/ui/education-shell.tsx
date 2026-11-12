"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/education", label: "Overview" },
  { href: "/education/curriculum", label: "Curriculum & Projects" },
  { href: "/education/admissions", label: "Tuition & Admissions" },
];

export function EducationHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-indigo-100/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/education"
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={17} />
            </span>
            <span className="text-sm">
              Synthetix <span className="text-indigo-600">AI</span>
            </span>
            <span className="hidden rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-indigo-700 sm:inline-flex dark:bg-indigo-950 dark:text-indigo-300">
              Cohort 04 Enrolling
            </span>
          </Link>

          <nav className="hidden items-center rounded-xl bg-indigo-50/80 p-1 md:flex dark:bg-slate-900">
            {navItems.map((item) => {
              const active =
                item.href === "/education"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-[11px] font-medium transition ${active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-indigo-700 dark:text-slate-300"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="#syllabus"
              className="px-2 text-[11px] text-slate-500 hover:text-indigo-700 dark:text-slate-300"
            >
              Download Syllabus
            </a>
            <Button
              size="sm"
              className="h-8 rounded-lg bg-indigo-600 px-3 text-[11px] hover:bg-indigo-700"
            >
              <Link href="/education/admissions">Apply for Cohort 04</Link>
            </Button>
            <Link
              href="/sign-in"
              aria-label="Account"
              className="grid size-8 place-items-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <UserRound size={15} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="grid size-9 place-items-center rounded-lg border border-slate-200 md:hidden dark:border-slate-700"
            aria-label="Toggle navigation"
          >
            <Menu size={18} />
          </button>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-indigo-100 bg-white p-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
            {navItems.map((item) => (
              <Link
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/education/admissions"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
            >
              Apply for Cohort 04
            </Link>
          </nav>
        )}
      </header>
      <div className="border-b border-indigo-100 bg-indigo-50/80 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[10px] text-indigo-900 sm:px-6 lg:px-8 dark:text-indigo-200">
          <span>
            <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-500" />
            COHORT 04 ADMISSIONS <span className="mx-2 text-indigo-300">•</span>{" "}
            Starts October 28 <span className="mx-1">•</span> Limited fellowship
            seats
          </span>
          <span className="font-mono">
            Cohort updates{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-300">
              LIVE
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

export function EducationFooter() {
  return (
    <footer className="mt-16 border-t border-indigo-100 bg-indigo-50/70 py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/education" className="text-sm font-semibold">
            Synthetix <span className="text-indigo-600">ACADEMY</span>
          </Link>
          <p className="mt-3 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
            Advanced applied generative systems, model fine-tuning, and
            production-grade AI infrastructure for high-impact technical
            operators.
          </p>
          <p className="mt-4 inline-flex rounded-full bg-indigo-100 px-3 py-1.5 text-[10px] text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
            ● Cohort 04 admissions open
          </p>
        </div>
        {[
          ["PROGRAM", ["Overview", "Curriculum", "Tuition", "Capstones"]],
          [
            "COMMUNITY",
            [
              "Fellows Directory",
              "Guest Lectures",
              "Research Seminars",
              "Alumni Network",
            ],
          ],
          [
            "GOVERNANCE",
            [
              "Academic Board",
              "Ethics & Safety",
              "Syllabus Versioning",
              "Accreditation",
            ],
          ],
        ].map(([title, items]) => (
          <div key={title as string}>
            <p className="text-[9px] font-semibold tracking-widest text-slate-500">
              {title as string}
            </p>
            <ul className="mt-3 space-y-2">
              {(items as string[]).map((item) => (
                <li key={item}>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-[1440px] flex-wrap justify-between gap-3 px-4 text-[9px] text-slate-400 sm:px-6 lg:px-8">
        <span>© 2026 Synthetix Academy. Engineered for technical leaders.</span>
        <span>v4.2.0 • PROD_EU_WEST</span>
      </div>
    </footer>
  );
}

export function EducationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f8ff] text-slate-950 dark:bg-[#080d1b] dark:text-slate-100">
      <EducationHeader />
      {children}
      <EducationFooter />
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
