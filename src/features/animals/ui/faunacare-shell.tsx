"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, UserRound, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaunaCareHeader() {
  const pathname = usePathname();
  const links = [
    { href: "/animals", label: "Find Care" },
    { href: "/animals/emergency", label: "Emergency 24/7" },
    { href: "/animals/list-business", label: "List Your Business" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 sm:px-6">
        <Link href="/animals" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm">
            <PawPrint size={20} fill="currentColor" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">FaunaCare</span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Veterinary Health</span>
          </span>
        </Link>

        <nav className="hidden h-full items-center gap-5 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/animals" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-full items-center border-b-2 px-0.5 text-xs transition-colors",
                  active
                    ? "border-emerald-800 font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/animals/emergency"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-red-100 px-3 text-[10px] font-semibold text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-300"
          >
            <Siren size={13} /> SOS Emergency
          </Link>
          <Link
            href="/sign-in"
            aria-label="Account"
            className="grid size-8 place-items-center rounded-full bg-emerald-800 text-white"
          >
            <UserRound size={15} />
          </Link>
        </div>
      </div>
      <nav className="flex items-center justify-around border-t px-2 py-2 md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={cn("text-[10px]", pathname === link.href ? "font-bold text-emerald-700" : "text-muted-foreground")}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function FaunaCareFooter() {
  return (
    <footer className="border-t bg-[#edf3ff] text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-800 text-white"><PawPrint size={16} /></span>
            FaunaCare
          </div>
          <p className="max-w-xs text-xs leading-5 text-muted-foreground">Connecting pet parents with empathetic clinical veterinarians, 24/7 critical animal care, and accredited wellness networks.</p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold text-foreground">Medical Discovery</h3>
          <ul className="space-y-2 text-xs text-muted-foreground"><li>Find Clinics & Doctors</li><li>Emergency ICU Directory</li><li>Diagnostic Tele-triage</li></ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold text-foreground">Partners & NGOs</h3>
          <ul className="space-y-2 text-xs text-muted-foreground"><li>Join Veterinary Network</li><li>NGO & Shelter Portal</li><li>Accreditation Standard</li></ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold text-foreground">Emergency Helpline</h3>
          <p className="text-xs text-muted-foreground">24/7 Dedicated Dispatch: 1-800-FAUNA-SOS</p>
          <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">✓ Certified Veterinary Care</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 border-t border-slate-200 px-5 py-4 text-[10px] text-muted-foreground sm:flex-row dark:border-slate-800">
        <span>© 2025 FaunaCare Health Technologies Inc. All rights reserved.</span>
        <span className="flex gap-5"><span>Clinical Privacy</span><span>Terms of Care</span><span>Security</span></span>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: import("react").ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900 dark:bg-background dark:text-foreground">
      <FaunaCareHeader />
      {children}
      <FaunaCareFooter />
    </div>
  );
}
