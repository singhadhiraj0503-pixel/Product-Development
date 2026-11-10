"use client";

import { useCallback, useEffect, useState } from "react";
import { AudioLines, CheckCircle2, Clock3, Code2, Copy, FileJson, Headphones, LayoutTemplate, Loader2, Mic, RefreshCw, Rocket, Send, ShieldCheck, Workflow as WorkflowIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, formatDuration } from "./api";
import type { Run, Workflow } from "./types";
import { CEContainer, CEPage, Eyebrow, SectionTitle, StatusBadge } from "./page-primitives";

const stages = [
  { number: "01", name: "Idea Ingestion & Audio Memo", desc: "Founder records voice memo or single-sentence raw concept via Telegram Bot or Apple Shortcuts webhook trigger.", tags: ["Telegram Bot API", "iOS Shortcuts", "Whisper Large v3"], icon: Mic, guarantee: "Zero friction capture, <2s acknowledgement." },
  { number: "02", name: "Semantic Decomposition", desc: "Deconstructs unstructured memo into 5–7 punchy, high-signal takeaway frames conforming to an immutable JSON Schema.", tags: ["Claude 3.5 Sonnet", "Pydantic V2 Schemas", "Strict JSON Mode"], icon: WorkflowIcon, guarantee: "Hook <65 chars, zero hallucination." },
  { number: "03", name: "Layout & Headless Render", desc: "Automated webhook builds vector templates and renders 1080×1350, 4:5 ratio. Applies typographic rules and dynamic slide counts.", tags: ["n8n (Self-Hosted)", "Headless HTML/CSS", "Puppeteer / Playwright"], icon: LayoutTemplate, guarantee: "Exact kerning, zero visual clipping." },
  { number: "04", name: "Async Sign-Off & Distribution", desc: "Card preview sent to private Telegram channel. 1-click Approve pushes to social APIs; 1-click Retry re-prompts.", tags: ["Telegram Inline Keybd", "Buffer API", "Ayrshare Multi-Pub"], icon: Send, guarantee: "100% human-in-the-loop governance." },
];

export function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [runDialog, setRunDialog] = useState(false);
  const [activeRun, setActiveRun] = useState<Run | null>(null);

  const load = useCallback(async () => {
    try {
      const w = await api<Workflow[]>("/api/content-engine/workflows");
      setWorkflows(w);
      if (activeRun) {
        const fresh = await api<Run>(`/api/content-engine/runs/${activeRun.id}`).catch(() => null);
        if (fresh) setActiveRun(fresh);
      }
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load ContentEngine data."); }
    finally { setLoading(false); }
  }, [activeRun?.id]);

  useEffect(() => { void load(); }, []); // initial fetch
  useEffect(() => {
    if (!activeRun || ["dispatched", "failed", "cancelled"].includes(activeRun.status)) return;
    const timer = window.setInterval(() => {
      api<Run>(`/api/content-engine/runs/${activeRun.id}`).then(setActiveRun).catch(() => {});
    }, 2500);
    return () => window.clearInterval(timer);
  }, [activeRun?.id, activeRun?.status]);

  const latestEvents = activeRun?.events || [];

  async function createAndRun() {
    if (!text.trim()) return;
    setBusy(true); setError("");
    try {
      let workflow = workflows.find(w => w.status === "active");
      if (!workflow) workflow = await api<Workflow>("/api/content-engine/workflows", { method: "POST", body: JSON.stringify({ name: "Founder Content Pipeline", description: "Text and audio-to-carousel automation", triggerType: "manual", status: "active" }) });
      const result = await api<{ runId: string }>("/api/content-engine/runs", { method: "POST", body: JSON.stringify({ workflowId: workflow.id, rawText: text, title: title || undefined, source: "text", platformTargets: ["linkedin", "instagram"], aspectRatio: "4:5", visualTheme: "obsidian-minimal" }) });
      const fresh = await api<Run>(`/api/content-engine/runs/${result.runId}`);
      setActiveRun(fresh); setRunDialog(false); setText(""); setTitle("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not start automation."); }
    finally { setBusy(false); }
  }

  const copyN8n = async () => {
    const json = JSON.stringify({ name: "ContentEngine Founder Pipeline", nodes: [{ name: "Idea Ingest", type: "webhook" }, { name: "Transcribe / Parse", type: "ai" }, { name: "Generate Carousel", type: "content-engine-api" }, { name: "Render Slides", type: "playwright" }, { name: "Telegram Approval", type: "telegram" }], connections: { "Idea Ingest": ["Transcribe / Parse"], "Transcribe / Parse": ["Generate Carousel"], "Generate Carousel": ["Render Slides"], "Render Slides": ["Telegram Approval"] } }, null, 2);
    await navigator.clipboard.writeText(json);
  };

  return <CEPage><CEContainer className="space-y-8 lg:space-y-9">
    <div className="pt-1">
      <Eyebrow>System Deliverable 03 // 04-Hour Founder Automation Engine</Eyebrow>
      <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">Zero-Designer AI Content Pipeline<br className="hidden sm:block"/> for Solo Founders</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">From raw unstructured thought to viral, brand-consistent LinkedIn & Instagram carousels in under 120 seconds. Fully automated with human-in-the-loop sign-off.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Dialog open={runDialog} onOpenChange={setRunDialog}>
          <DialogTrigger asChild><Button className="bg-indigo-600 hover:bg-indigo-700"><Rocket size={15} className="mr-2"/>Trigger Automation Run</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Trigger Content Automation</DialogTitle><DialogDescription>Submit an idea to generate a carousel using your configured backend pipeline.</DialogDescription></DialogHeader>
            <div className="space-y-3"><div className="space-y-1.5"><Label>Deck title (optional)</Label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="5 Mental Models for AI Product Builders"/></div><div className="space-y-1.5"><Label>Your idea / voice memo transcript</Label><Textarea rows={5} value={text} onChange={e=>setText(e.target.value)} placeholder="Write or paste the raw idea you want transformed into a carousel..."/></div></div>
            <DialogFooter><Button variant="outline" onClick={()=>setRunDialog(false)}>Cancel</Button><Button disabled={!text.trim()||busy} onClick={createAndRun} className="bg-indigo-600">{busy&&<Loader2 className="mr-2 size-4 animate-spin"/>}Start automation</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={()=>document.getElementById("workflow-stages")?.scrollIntoView({behavior:"smooth"})}><WorkflowIcon size={15} className="mr-2"/>View System Architecture Diagram</Button>
        <span className="flex items-center gap-1 text-[10px] text-slate-500"><ShieldCheck size={13} className="text-emerald-700"/>Deterministic JSON Schema V2 Compliant</span>
      </div>
      {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label:"Founder Effort", value:"—", note:"Actual time saved will be calculated from run telemetry.", icon:Clock3, color:"text-indigo-600" },
        { label:"Design Integrity", value:"Schema V2", note:"Validated structured slide output.", icon:CheckCircle2, color:"text-emerald-700" },
        { label:"Unit Economics", value:"—", note:"Connect provider billing to calculate cost per deck.", icon:Zap, color:"text-indigo-600" },
        { label:"Generated Decks", value:"—", note:"Live total will appear as deck history is enabled.", icon:FileJson, color:"text-indigo-600" },
      ].map(item=><Card key={item.label} className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="p-5"><div className="flex items-center justify-between text-[9px] font-medium uppercase tracking-wider text-slate-500">{item.label}<item.icon size={14} className={item.color}/></div><div className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</div><p className="mt-1 text-[11px] leading-4 text-slate-500">{item.note}</p></CardContent></Card>)}
    </div>

    <div className="grid gap-3 md:grid-cols-3">
      {[
        { title:"Frictionless Audio Trigger", tag:"INPUT VECTOR", icon:AudioLines, image:"from-slate-500 to-slate-800" },
        { title:"Headless 4:5 Carousel Canvas", tag:"VECTOR ENGINE", icon:Code2, image:"from-indigo-500 to-slate-900" },
        { title:"Telegram 1-Tap Governance", tag:"HUMAN CONTROL", icon:Headphones, image:"from-slate-600 to-indigo-950" },
      ].map(item=><div key={item.title} className={`relative flex h-28 items-end overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br ${item.image} p-4 text-white shadow-sm`}><div className="absolute right-4 top-4 opacity-30"><item.icon size={40}/></div><div className="relative"><p className="text-[9px] uppercase tracking-wider text-white/75">{item.tag}</p><p className="text-sm font-semibold">{item.title}</p></div></div>)}
    </div>

    <section id="workflow-stages">
      <SectionTitle eyebrow="Autonomous Architecture" title="4-Stage Deterministic Workflow" description="How unstructured mobile voice dumps transform into pixel-accurate multi-channel carousels with strict programmatic guarantees." right={<StatusBadge tone="good">● {workflows.filter(w=>w.status==="active").length} active workflows</StatusBadge>}/>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map(stage=><Card key={stage.number} className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="flex h-full flex-col p-5"><div className="flex items-center justify-between"><span className="rounded bg-indigo-50 px-2 py-1 font-mono text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{stage.number} // {["INGEST","PARSE","RENDER","DISPATCH"][Number(stage.number)-1]}</span><span className="rounded-md bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><stage.icon size={15}/></span></div><h3 className="mt-4 text-sm font-semibold">{stage.name}</h3><p className="mt-2 flex-1 text-[11px] leading-[1.65] text-slate-600 dark:text-slate-400">{stage.desc}</p><p className="mb-1 mt-4 text-[9px] font-semibold uppercase">Stack integrations</p><div className="flex flex-wrap gap-1">{stage.tags.map(tag=><code key={tag} className="rounded bg-indigo-50 px-1.5 py-1 text-[9px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{tag}</code>)}</div><div className="mt-3 rounded bg-indigo-50/80 px-2 py-2 text-[10px] text-slate-600 dark:bg-indigo-950/50 dark:text-slate-300"><CheckCircle2 size={11} className="mr-1 inline text-emerald-700"/>{stage.guarantee}</div></CardContent></Card>)}
      </div>
    </section>

    <section>
      <Card className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-widest text-indigo-600">Execution Telemetry</p><h2 className="text-lg font-semibold">Live Pipeline Latency & Event Stream</h2></div><div className="flex gap-2"><StatusBadge tone="neutral">Run: {activeRun?.id.slice(0,12) || "No active run"}</StatusBadge><Button size="sm" variant="outline" onClick={()=>void load()}><RefreshCw size={13} className="mr-1"/>Refresh</Button></div></div>
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#252d42] text-slate-100">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] text-slate-300"><span><i className="mr-1 inline-block size-2 rounded-full bg-red-500"/><i className="mx-1 inline-block size-2 rounded-full bg-indigo-500"/><i className="mr-2 inline-block size-2 rounded-full bg-emerald-400"/>run_trace_id: {activeRun?.id || "awaiting-trigger"}</span><span>NODE: content-engine-worker</span></div>
          <div className="space-y-4 p-4 sm:p-5">
            {latestEvents.length ? latestEvents.map(event=><div key={event.id} className="grid gap-1 font-mono text-[10px] sm:grid-cols-[65px_1fr_auto] sm:items-center"><span className="text-emerald-300">{formatDuration(event.elapsedMs)}</span><span className="text-slate-100">{event.message}</span><span className={event.level==="error"?"text-red-300":"text-emerald-300"}>{event.level.toUpperCase()}</span></div>) : <div className="py-8 text-center font-mono text-xs text-slate-400">{loading ? "Loading run telemetry..." : "No execution events yet. Trigger an automation run to stream real pipeline events."}</div>}
            <div className="border-t border-white/10 pt-3 text-[10px] text-slate-300">Status: <span className="text-emerald-300">{activeRun?.status || "Ready for next ingest stream"}</span><span className="float-right">Elapsed: {formatDuration(activeRun?.durationMs)}</span></div>
          </div>
        </div>
      </CardContent></Card>
    </section>

    <section className="rounded-2xl border border-indigo-100 bg-[#e6e9ff] p-6 dark:border-indigo-900 dark:bg-indigo-950/50 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center"><div><p className="text-[9px] font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Zero-Code Setup Pack</p><h2 className="mt-1 text-xl font-semibold">Ready to deploy your solo automation engine?</h2><p className="mt-2 max-w-xl text-xs leading-5 text-slate-600 dark:text-slate-300">Copy a starter workflow definition and connect your configured AI provider, renderer and Telegram approval channel.</p></div><div className="flex flex-wrap gap-2"><Button onClick={copyN8n} className="bg-indigo-600 hover:bg-indigo-700"><Copy size={14} className="mr-2"/>Copy n8n Workflow JSON</Button><Button variant="outline" onClick={()=>window.open("/content-engine/docs","_self")}><BookOpenIcon/>Open Quickstart Guide</Button></div></div>
    </section>
  </CEContainer></CEPage>;
}
function BookOpenIcon(){return <FileJson size={14} className="mr-2"/>}
