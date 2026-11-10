import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CEContainer, CEPage, Eyebrow } from "@/features/content-engine/ui/page-primitives";

export default function DocsPage(){
  return <CEPage><CEContainer><Eyebrow>ContentEngine Documentation</Eyebrow><h1 className="text-3xl font-semibold">Quickstart Guide</h1><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Configure the ContentEngine backend, then create a workflow, generate a deck and export your slides.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Card><CardContent className="p-5"><h2 className="font-semibold">Workflow Architecture</h2><p className="mt-2 text-xs text-slate-500">Trigger and inspect automation runs.</p><Link className="mt-3 inline-block text-xs text-indigo-600" href="/content-engine/workflow">Open workflow →</Link></CardContent></Card><Card><CardContent className="p-5"><h2 className="font-semibold">Carousel Studio</h2><p className="mt-2 text-xs text-slate-500">Create decks, inspect frames and export.</p><Link className="mt-3 inline-block text-xs text-indigo-600" href="/content-engine/carousel">Open studio →</Link></CardContent></Card></div></CEContainer></CEPage>;
}
