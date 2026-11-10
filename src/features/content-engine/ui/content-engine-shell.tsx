"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, BookOpen, ChevronDown, Code2, Layers3, Workflow, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/content-engine/workflow", label: "Workflow Architecture", icon: Workflow },
  { href: "/content-engine/carousel", label: "Carousel Studio", icon: Layers3 },
  { href: "/content-engine/schemas", label: "Schemas & Tech Stack", icon: Code2 },
  { href: "/content-engine/docs", label: "Documentation", icon: BookOpen },
];

export function ContentEngineHeader() {
  const pathname = usePathname();
  return (
    <header className="ce-header sticky top-0 z-40 border-b border-indigo-100/80 bg-[#fbfaff]/95 backdrop-blur dark:border-indigo-950 dark:bg-slate-950/95">
      <div className="mx-auto flex min-h-[62px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/content-engine/workflow" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white"><Layers3 size={17}/></span>
          <span>ContentEngine <span className="text-indigo-600">AI</span></span>
          <span className="hidden rounded-full bg-indigo-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-indigo-700 sm:inline">Solo Studio</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={cn("rounded-lg px-3 py-2 text-xs transition-colors", pathname.startsWith(href) ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-900")}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <Link href="/content-engine/workflow" className="hidden sm:block">
            <Button size="sm" className="h-9 bg-indigo-600 text-xs hover:bg-indigo-700"><Bolt size={14} className="mr-1"/> Trigger Automation Run</Button>
          </Link>
          <Button size="icon" variant="outline" className="size-9 rounded-full border-indigo-200 text-indigo-700 dark:border-indigo-900 dark:text-indigo-300" aria-label="Account"><UserRound size={16}/></Button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-indigo-100/70 px-3 py-1.5 lg:hidden dark:border-indigo-950">
        {links.map(({ href, label }) => <Link key={href} href={href} className={cn("shrink-0 rounded-md px-3 py-1.5 text-[11px]", pathname.startsWith(href) ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-600 dark:text-slate-300")}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function ContentEngineFooter() {
  return <footer className="border-t border-indigo-100 bg-white px-5 py-7 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 sm:flex-row"><span>© 2025 ContentEngine AI. Autonomous Carousel Studio Architecture. All rights reserved.</span><div className="flex flex-wrap gap-4"><Link href="/content-engine/docs">Documentation</Link><a href="#api">API Reference</a><a href="#status">System Status</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div></footer>;
}
