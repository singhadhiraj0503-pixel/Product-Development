"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Code2, Download, FileArchive, Loader2, RefreshCw, Save, Send, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "./api";
import type { Deck, Slide } from "./types";
import { CEContainer, CEPage, Eyebrow, SectionTitle, StatusBadge } from "./page-primitives";

export function CarouselStudioPage() {
  const [deck,setDeck]=useState<Deck|null>(null);
  const [active,setActive]=useState(0);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [topic,setTopic]=useState("");
  const [theme,setTheme]=useState("obsidian-minimal");
  const [watermark,setWatermark]=useState("@alexm_ai");
  const [ratio,setRatio]=useState("4:5");
  const [fontPair,setFontPair]=useState("Space Grotesk + Plus Jakarta Sans");
  const [showMarkup,setShowMarkup]=useState(false);

  const load=useCallback(async()=>{
    try{
      const rows=await api<Deck[]>("/api/content-engine/decks");
      const selected=deck ? rows.find(d=>d.id===deck.id) : rows[0];
      if(selected) setDeck(await api<Deck>(`/api/content-engine/decks/${selected.id}`));
      else setDeck(null);
      setError("");
    }catch(e){setError(e instanceof Error?e.message:"Unable to load decks.");}
    finally{setLoading(false);}
  },[deck?.id]);
  useEffect(()=>{void load();},[]);
  const slides=deck?.slides||[];
  const slide=slides[active]||slides[0];
  const slideCount=slides.length;

  async function createDeck(){
    setBusy(true);setError("");
    try{
      const created=await api<Deck>("/api/content-engine/decks",{method:"POST",body:JSON.stringify({title:"New AI Carousel",topic,platformTargets:["linkedin","instagram"],aspectRatio:ratio,visualTheme:theme,fontPair,watermark})});
      setDeck(await api<Deck>(`/api/content-engine/decks/${created.id}`));
      setActive(0);
    }catch(e){setError(e instanceof Error?e.message:"Could not create deck.");}
    finally{setBusy(false);}
  }
  async function generate(){
    if(!deck||!topic.trim())return;
    setBusy(true);setError("");
    try{
      const response=await api<{runId:string}>(`/api/content-engine/decks/${deck.id}/generate`,{method:"POST",body:JSON.stringify({rawText:topic,title:deck.title,source:"text",platformTargets:deck.platformTargets,visualTheme:theme,aspectRatio:ratio})});
      // Poll the run until the pipeline is complete, then reload the deck.
      let done=false;
      for(let i=0;i<50&&!done;i++){
        await new Promise(r=>setTimeout(r,2000));
        const run=await api<{status:string;errorMessage?:string}>(`/api/content-engine/runs/${response.runId}`);
        if(run.status==="failed")throw new Error(run.errorMessage||"Generation failed.");
        done=["awaiting_approval","dispatched"].includes(run.status);
      }
      const fresh=await api<Deck>(`/api/content-engine/decks/${deck.id}`);
      setDeck(fresh);setActive(0);
      if(!done)setError("Generation is still running. Refresh this page in a moment.");
    }catch(e){setError(e instanceof Error?e.message:"Generation failed.");}
    finally{setBusy(false);}
  }
  async function saveSettings(){
    if(!deck)return;
    setBusy(true);
    try{
      const fresh=await api<Deck>(`/api/content-engine/decks/${deck.id}`,{method:"PATCH",body:JSON.stringify({visualTheme:theme,fontPair,watermark,aspectRatio:ratio,width:1080,height:ratio==="1:1"?1080:ratio==="9:16"?1920:1350})});
      setDeck(fresh);setError("");
    }catch(e){setError(e instanceof Error?e.message:"Could not save deck settings.");}
    finally{setBusy(false);}
  }
  async function exportDeck(){
    if(!deck)return;
    setBusy(true);
    try{
      const result=await api<{pdf:string;zip:string;pngs:string[]}>(`/api/content-engine/decks/${deck.id}/export`,{method:"POST"});
      const base=window.location.origin;
      if(result.pdf)window.open(new URL(result.pdf,base).toString(),"_blank","noopener,noreferrer");
      if(result.zip)window.open(new URL(result.zip,base).toString(),"_blank","noopener,noreferrer");
    }catch(e){setError(e instanceof Error?e.message:"Export failed.");}
    finally{setBusy(false);}
  }
  async function approval(decision:"approve"|"reject"){
    if(!deck)return;
    setBusy(true);
    try{
      const updated=await api<{deck:Deck}>(`/api/content-engine/decks/${deck.id}/approval`,{method:"POST",body:JSON.stringify({decision})});
      setDeck({...deck,...updated.deck});
    }catch(e){setError(e instanceof Error?e.message:"Approval action failed.");}
    finally{setBusy(false);}
  }

  return <CEPage><CEContainer className="space-y-8 lg:space-y-10">
    <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div className="max-w-2xl"><Eyebrow>Live Carousel Studio & Inspector</Eyebrow><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">5 Mental Models for AI Product Builders</h1><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Generate and inspect structured carousel slides from your own source material. Every slide is stored and rendered by the ContentEngine backend.</p></div>
      <div className="flex flex-wrap gap-2"><Button onClick={exportDeck} disabled={!deck||!slides.length||busy} className="bg-indigo-600 hover:bg-indigo-700"><Download size={14} className="mr-2"/>Download Deck as PDF</Button><Button variant="outline" onClick={exportDeck} disabled={!deck||!slides.length||busy}><FileArchive size={14} className="mr-2"/>Export PNGs (ZIP)</Button></div>
    </div>
    {loading&&<p className="text-xs text-slate-500">Loading your saved carousel decks…</p>}
    <div className="flex flex-wrap gap-2 text-[11px]"><StatusBadge>Format: {deck?.width||1080}×{deck?.height||1350}</StatusBadge><StatusBadge>Theme: {deck?.visualTheme||theme}</StatusBadge><StatusBadge>Target: LinkedIn & Instagram</StatusBadge><StatusBadge>Render Engine: Playwright</StatusBadge></div>
    {error&&<p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
    {!deck&&<Card className="border-indigo-100 bg-white dark:border-slate-800 dark:bg-slate-900"><CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto] md:items-end"><div className="md:col-span-3"><h2 className="font-semibold">Create your first carousel deck</h2><p className="text-xs text-slate-500">Paste an idea or article below. The backend will generate a structured slide deck.</p></div><div className="space-y-1"><Label>Source idea / content</Label><Textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={3} placeholder="Paste your source material..."/></div><div className="space-y-1"><Label>Visual theme</Label><Select value={theme} onValueChange={setTheme}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="obsidian-minimal">Obsidian Minimal</SelectItem><SelectItem value="editorial-light">Editorial Light</SelectItem><SelectItem value="indigo-tech">Indigo Tech</SelectItem></SelectContent></Select></div><Button disabled={busy||!topic.trim()} onClick={createDeck} className="bg-indigo-600"><Sparkles size={14} className="mr-2"/>Create deck</Button></CardContent></Card>}
    {deck&&<Card className="border-indigo-100 bg-white dark:border-slate-800 dark:bg-slate-900"><CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-end"><div className="space-y-1.5"><Label>Source idea / content for this deck</Label><Textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={3} placeholder="Paste the idea, article or notes you want converted into carousel slides..."/></div><Button disabled={busy||!topic.trim()} onClick={generate} className="bg-indigo-600 hover:bg-indigo-700">{busy?<Loader2 size={14} className="mr-2 animate-spin"/>:<Sparkles size={14} className="mr-2"/>}Generate / Re-run Generation</Button></CardContent></Card>}
    {deck&&<div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px]"><span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300"><CheckCircle2 size={13}/>PIXEL-PERFECT CANVAS <span className="text-slate-500">• Scale: Fit preview</span></span><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>setShowMarkup(v=>!v)}><Code2 size={13} className="mr-1"/>Markup</Button><Button size="sm" variant="ghost" onClick={()=>setActive(0)}>Reset frame</Button></div></div>
        <div className="mx-auto max-w-[440px]">
          <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-[#202b43] via-[#252d42] to-[#29265f] p-7 text-white shadow-xl sm:p-9">
            {slide?<><div className="flex items-center justify-between font-mono text-[10px] tracking-[.18em] text-indigo-100"><span>● {slide.kicker||"ESSENTIAL READING"} // {String(active+1).padStart(2,"0")}</span><span className="rounded bg-white/10 px-2 py-1">{String(active+1).padStart(2,"0")}/{String(slideCount).padStart(2,"0")}</span></div><div><div className="mb-5 inline-flex rounded-xl bg-white/10 p-3 text-indigo-100"><Code2 size={23}/></div><h2 className="text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl">{slide.title}</h2><p className="mt-6 text-sm leading-6 text-indigo-100/90 sm:text-base">{slide.body||slide.subtitle}</p></div><div className="flex items-end justify-between border-t border-white/15 pt-4 text-[10px] text-indigo-100"><span>{watermark||deck.watermark||"CONTENTENGINE AI"}<br/><span className="text-white/60">AI-generated carousel preview</span></span><span className="flex gap-3"><Share2 size={15}/><Download size={15}/></span></div></>:<div className="m-auto text-center text-sm text-white/70">No slides generated yet. Add source content and select Generate.</div>}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">{slides.map((s,i)=><button key={s.id} onClick={()=>setActive(i)} aria-label={`Show slide ${i+1}`} className={`size-2.5 rounded-full ${i===active?"bg-indigo-700":"bg-indigo-200"}`}/>)}</div>
          {showMarkup&&<pre className="mt-4 max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-[10px] text-emerald-200">{JSON.stringify(slide,null,2)}</pre>}
        </div>
      </div>
      <div className="space-y-4">
        <Card className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Frame Inspector</h2><div className="flex items-center gap-2"><Button size="icon" variant="outline" className="size-7" disabled={active<=0} onClick={()=>setActive(v=>Math.max(0,v-1))}><ChevronLeft size={14}/></Button><span className="text-xs tabular-nums">{slideCount?active+1:0} / {slideCount}</span><Button size="icon" variant="outline" className="size-7" disabled={active>=slideCount-1} onClick={()=>setActive(v=>Math.min(slideCount-1,v+1))}><ChevronRight size={14}/></Button></div></div>
          <Tabs value={String(active)} onValueChange={v=>setActive(Number(v))} className="mt-4"><TabsList className="grid w-full" style={{gridTemplateColumns:`repeat(${Math.max(slideCount,1)},minmax(0,1fr))`}}>{slides.map((s,i)=><TabsTrigger key={s.id} value={String(i)} className="text-[10px]">S{i+1}</TabsTrigger>)}</TabsList></Tabs>
          {slide?<div className="mt-4 space-y-3 rounded-lg bg-indigo-50/70 p-4 text-xs dark:bg-indigo-950/40"><div className="flex justify-between gap-3"><span className="text-slate-500">Slide Role</span><span className="font-medium text-indigo-700 dark:text-indigo-300">{slide.role}</span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Title Length</span><span className="font-mono">{slide.title.length} chars</span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Body Length</span><span className="font-mono">{(slide.body||"").length} chars</span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Schema</span><span className="text-emerald-700 dark:text-emerald-300">● Stored slide record</span></div></div>:<p className="py-8 text-center text-xs text-slate-500">No frame selected.</p>}
        </CardContent></Card>
        <Card className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Deck Sequence Outline</h2><span className="text-[10px] text-slate-500">{slideCount} Cards Total</span></div><div className="space-y-1.5">{slides.map((s,i)=><button key={s.id} onClick={()=>setActive(i)} className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition ${active===i?"bg-indigo-100 dark:bg-indigo-950":"hover:bg-slate-50 dark:hover:bg-slate-800"}`}><span className="rounded bg-indigo-100 px-2 py-1 font-mono text-[10px] text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">{String(i+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium">{s.role==="hook"?"Hook — ":""}{s.title}</span><span className="mt-0.5 block line-clamp-1 text-[10px] text-slate-500">{s.body||s.subtitle||s.role}</span></span></button>)}</div></CardContent></Card>
      </div>
    </div>}
    <Card className="border-indigo-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><CardContent className="p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold">Deck Configuration & Style Overrides</h2><p className="mt-1 text-xs text-slate-500">Modify render attributes across the entire carousel deck.</p></div><StatusBadge tone="good">Configuration</StatusBadge></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5"><Label>Visual Theme</Label><Select value={theme} onValueChange={setTheme}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="obsidian-minimal">Obsidian Minimal</SelectItem><SelectItem value="editorial-light">Editorial Light</SelectItem><SelectItem value="indigo-tech">Indigo Tech</SelectItem></SelectContent></Select><p className="text-[10px] text-slate-500">Dark slate surface with indigo light cast</p></div>
        <div className="space-y-1.5"><Label>Font Pair</Label><Select value={fontPair} onValueChange={setFontPair}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Space Grotesk + Plus Jakarta Sans">Space Grotesk + Plus Jakarta</SelectItem><SelectItem value="Inter + Inter">Inter</SelectItem><SelectItem value="DM Sans + DM Sans">DM Sans</SelectItem></SelectContent></Select><p className="text-[10px] text-slate-500">Typography for high-retention feeds</p></div>
        <div className="space-y-1.5"><Label>Watermark Handle</Label><Input value={watermark} onChange={e=>setWatermark(e.target.value)}/><p className="text-[10px] text-slate-500">Rendered in author footer zone</p></div>
        <div className="space-y-1.5"><Label>Aspect Ratio</Label><Select value={ratio} onValueChange={setRatio}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="4:5">4:5 (1080×1350)</SelectItem><SelectItem value="1:1">1:1 (Square)</SelectItem><SelectItem value="9:16">9:16 (Story)</SelectItem></SelectContent><p className="text-[10px] text-slate-500">Target canvas dimensions</p></Select></div>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={load}><RefreshCw size={14} className="mr-2"/>Reload</Button><Button onClick={saveSettings} disabled={!deck||busy} className="bg-indigo-600 hover:bg-indigo-700"><Save size={14} className="mr-2"/>Save Configuration</Button></div>
    </CardContent></Card>
    <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#242d44] via-[#3028a0] to-[#343d55] p-6 text-white shadow-lg sm:p-8"><div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-[9px] font-semibold uppercase tracking-widest text-indigo-200">Rapid Replication & Dispatch</p><h2 className="mt-2 text-xl font-semibold">Want to customize this carousel template?</h2><p className="mt-2 max-w-xl text-xs leading-5 text-indigo-100/80">Review the deck, then send it for human approval through your Telegram workflow.</p></div><div className="flex flex-wrap gap-2"><Button onClick={()=>approval("approve")} disabled={!deck||busy||!slides.length} className="bg-white text-indigo-700 hover:bg-indigo-50"><Send size={14} className="mr-2"/>Approve Deck</Button><Button onClick={()=>approval("reject")} disabled={!deck||busy||!slides.length} variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Reject</Button></div></div></section>
  </CEContainer></CEPage>;
}
