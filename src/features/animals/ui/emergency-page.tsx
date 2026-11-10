"use client";

import { useEffect, useState } from "react";
import { Activity, Ambulance, AlertTriangle, ArrowRight, CheckCircle2, Clock3, Droplet, FlaskConical, HeartPulse, MapPin, Phone, Siren, Wind, Zap } from "lucide-react";
import { PageFrame } from "./faunacare-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Resource = { id: string; resourceType: string; label: string; total: number; available: number; bloodGroup?: string | null; isDemoData: boolean };

const symptoms = [
  { label: "Severe Trauma / Hit & Run", icon: Siren },
  { label: "Breathing Distress / Choking", icon: Wind },
  { label: "Poisoning / Toxin Ingestion", icon: FlaskConical },
  { label: "Seizures / Unconscious", icon: Activity },
  { label: "Bloat / Sudden Vomiting", icon: AlertTriangle },
  { label: "Heatstroke / Hyperthermia", icon: Droplet },
];

export function EmergencyPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<string[]>([symptoms[0].label]);
  const [submitting, setSubmitting] = useState(false);
  const [city, setCity] = useState("Bengaluru");
  const [notice, setNotice] = useState("Emergency inventory is demonstration data until connected to verified providers.");

  useEffect(() => {
    fetch(`/api/animals/emergencies/resources?city=${encodeURIComponent(city)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (j.success) { setResources(j.data || []); setNotice(j.notice || notice); } })
      .catch(() => setNotice("Unable to load resource inventory. This screen is a demonstration only."));
  }, [city]);

  const sum = (type: string) => resources.filter(r => r.resourceType === type).reduce((n,r) => n + r.available, 0);
  const total = (type: string) => resources.filter(r => r.resourceType === type).reduce((n,r) => n + r.total, 0);
  const resourceStats = [
    { label: "Active Ambulances", value: sum("ambulance"), total: total("ambulance"), icon: Ambulance, type: "ambulance" },
    { label: "Oxygen Incubators", value: sum("oxygen_incubator"), total: total("oxygen_incubator"), icon: Wind, type: "oxygen_incubator" },
    { label: "Trauma Theatres", value: sum("trauma_theatre"), total: total("trauma_theatre"), icon: Activity, type: "trauma_theatre" },
    { label: "Blood Bank Reserves", value: resources.filter(r => r.resourceType === "blood_unit" && r.available > 0).length, total: resources.filter(r => r.resourceType === "blood_unit").length, icon: Droplet, type: "blood_unit" },
  ];

  async function submitSOS(formData: FormData) {
    setSubmitting(true);
    const payload = {
      ownerName: String(formData.get("ownerName") || ""),
      phone: String(formData.get("phone") || ""),
      petName: String(formData.get("petName") || ""),
      species: String(formData.get("species") || "Dog"),
      symptoms: selected,
      description: String(formData.get("description") || ""),
      address: String(formData.get("address") || ""),
    };
    try {
      const response = await fetch("/api/animals/emergencies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to record request");
      toast.success(result.message || "Emergency request recorded");
      (document.getElementById("sos-form") as HTMLFormElement | null)?.reset();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Unable to submit emergency request"); }
    finally { setSubmitting(false); }
  }

  return (
    <PageFrame>
      <main>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-red-100 px-4 py-2 text-[10px] text-red-800 dark:bg-red-950 dark:text-red-200 sm:px-6">
          <span className="font-semibold"><span className="mr-1 inline-block size-1.5 rounded-full bg-red-600"/> LIVE TRIAGE NETWORK PRIORITY · Rapid Veterinary Dispatch Across {city}</span>
          <span className="flex items-center gap-3"><span>◷ Average arrival: demo estimate</span><a href="tel:18007328672" className="rounded-full bg-red-700 px-3 py-1 font-bold text-white">1-800-PET-EMERGENCY</a></span>
        </div>

        <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <Badge className="mb-3 border-0 bg-blue-50 text-[9px] text-blue-800 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-200">ZERO WAIT TIME TRIAGE PROTOCOL</Badge>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">24/7 Critical Trauma & Pet Emergency Triage</h1>
            <p className="mt-3 max-w-xl text-xs leading-5 text-muted-foreground">Do not panic. Connect with veterinary critical care intensivists and specialized animal ambulances. Start with live oxygen support and blood-plasma readiness.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="tel:18007328672" className="inline-flex h-10 items-center gap-2 rounded-full bg-red-700 px-5 text-xs font-semibold text-white shadow-sm hover:bg-red-800"><Siren size={15}/> Immediate SOS Dispatch Call</a>
              <Button variant="secondary" className="h-10 rounded-full text-xs" onClick={() => document.getElementById("symptoms")?.scrollIntoView({ behavior: "smooth" })}><HeartPulse size={14} className="mr-2"/> Instant Symptom Triage</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-700"/> No advance paperwork required</span><span className="flex items-center gap-1"><ShieldCheckIcon/> Accredited Tier-1 Trauma Units</span></div>
          </div>
          <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200 dark:bg-card dark:ring-border">
            <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1000&q=85" alt="Veterinarian caring for an injured dog" className="h-52 w-full object-cover sm:h-64"/>
            <div className="p-4"><div className="flex items-center justify-between text-[9px]"><span className="font-semibold uppercase tracking-wide text-emerald-800">Priority Trauma Desk</span><Badge className="border-0 bg-emerald-100 text-emerald-800">Demo network</Badge></div><p className="mt-1 text-sm font-semibold">Bengaluru Central Command Dispatch</p><p className="mt-1 text-[10px] text-muted-foreground">This prototype records requests and does not contact a real dispatch centre.</p></div>
          </div>
        </section>

        <section className="bg-[#edf3ff] px-5 py-5 dark:bg-slate-950/70 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-wide">▤ {city} emergency resource directory</p><span className="text-[9px] text-muted-foreground">Demo inventory</span></div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {resourceStats.map(stat => <Card key={stat.type} className="border-0 shadow-sm"><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[9px] text-muted-foreground">{stat.label}</p><stat.icon size={14} className="text-emerald-800"/></div><p className="mt-1 text-xl font-semibold">{stat.value}<span className="ml-1 text-xs font-normal text-muted-foreground">{stat.type === "blood_unit" ? "groups available" : `/ ${stat.total}`}</span></p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-muted"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${stat.total ? Math.min(100, stat.value / stat.total * 100) : 0}%` }}/></div></CardContent></Card>)}
            </div>
            <p className="mt-3 text-[9px] text-muted-foreground">{notice}</p>
          </div>
        </section>

        <section id="symptoms" className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-red-700">⚡ Immediate action guide</p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Tap your pet's current distress symptom</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Select all symptoms that apply. A veterinary professional should assess your pet immediately.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {symptoms.map(s => <button key={s.label} type="button" onClick={() => setSelected(old => old.includes(s.label) ? old.filter(x => x !== s.label) : [...old, s.label])} className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left text-[10px] transition ${selected.includes(s.label) ? "border-blue-200 bg-blue-100 text-slate-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100" : "border-slate-100 bg-white hover:border-slate-300 dark:border-border dark:bg-card"}`}><s.icon size={15} className={selected.includes(s.label) ? "text-red-700" : "text-emerald-800"}/>{s.label}</button>)}
          </div>
          <div className="mt-3 flex flex-col justify-between gap-3 rounded-xl bg-blue-100 p-4 shadow-sm dark:bg-blue-950/50 sm:flex-row sm:items-center"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-red-700 text-white"><AlertTriangle size={18}/></span><div><p className="text-xs font-semibold">Suspected Severe Trauma Protocol</p><p className="mt-1 max-w-3xl text-[10px] leading-4 text-slate-600 dark:text-slate-300">Do not elevate the pet's head. Place on a rigid, flat surface (board or thick blanket) as a makeshift stretcher. Minimize movement to prevent spinal shock.</p></div></div><Button onClick={() => document.getElementById("sos-form-section")?.scrollIntoView({ behavior: "smooth" })} className="shrink-0 rounded-full bg-red-700 text-[10px] hover:bg-red-800"><Phone size={12} className="mr-2"/> Connect to Trauma Team Now</Button></div>
        </section>

        <section className="bg-[#edf3ff] px-5 py-8 dark:bg-slate-950/70 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">Live geo-tracking · demo</p>
            <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-semibold sm:text-2xl">Real-Time ICU Bed & Ambulance Routing</h2><p className="text-[10px] text-muted-foreground">The map below is illustrative; connect a verified location provider for live tracking.</p></div><Badge variant="secondary">Sample route map</Badge></div>
            <div className="mt-4 overflow-hidden rounded-xl border bg-white dark:bg-card"><img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?auto=format&fit=crop&w=1600&q=80" alt="Illustrative Bengaluru map" className="h-64 w-full object-cover sm:h-80"/><div className="border-t p-3 text-[10px] text-muted-foreground"><MapPin size={12} className="mr-1 inline"/> Bengaluru region · illustrative map, not live vehicle positions</div></div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">Accredited trauma facilities</p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Live Hospital Availability Near You</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Connect with approved emergency providers. Availability shown here is not live.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[{name:"FaunaCare Central Trauma & Critical Care Unit",area:"HAL Old Airport Road, Indiranagar",desc:"24/7 emergency care · demo listing"},{name:"Hope for Strays Rescue & NGO Emergency Infirmary",area:"Koramangala",desc:"Rescue and emergency support · demo listing"},{name:"Bengaluru Veterinary College Emergency Clinic",area:"Hebbal",desc:"Diagnostics and critical care · demo listing"}].map((item,i) => <Card key={item.name} className="border-0 shadow-sm"><CardContent className="flex gap-3 p-3"><img src={`https://images.unsplash.com/photo-${["1628009368231-7bb7cfcb0def","1576201836106-db1758fd1c97","1516734212186-a967f81ad0d7"][i]}?auto=format&fit=crop&w=300&q=75`} alt="" className="size-16 rounded-lg object-cover"/><div className="min-w-0 flex-1"><Badge className="border-0 bg-emerald-100 text-[8px] text-emerald-800">Demo facility</Badge><p className="mt-1 text-xs font-semibold">{item.name}</p><p className="mt-1 text-[9px] text-muted-foreground">{item.area}</p><p className="mt-1 text-[9px] text-muted-foreground">{item.desc}</p></div></CardContent></Card>)}
          </div>
        </section>

        <section className="bg-[#edf3ff] px-5 py-8 dark:bg-slate-950/70 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">While help is en route</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Emergency Pet First-Aid Instructions</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[{title:"1. Transporting Injured Pet",desc:"Gently slide a flat blanket, towel, or cardboard sheet beneath the pet. Never drag or pull by the limbs. Keep neck straight to prevent airway blockage or spinal twisting.",caution:"Even the gentlest pet may bite when in severe pain. Wrap muzzle softly only if breathing is safe."},{title:"2. Suspected Poisoning",desc:"Do NOT induce vomiting unless strictly instructed by the vet on call. Collect toxin packaging, labels, or material and bring it to the hospital.",caution:"Photograph packaging or keep botanical leaves if the ingested item is from a plant."},{title:"3. Heatstroke & Hyperthermia",desc:"Move pet to a shaded or air-conditioned room. Pour lukewarm or room-temperature water over paws, groin, and ears. Never use ice water, as it triggers capillary shock.",caution:"Offer small sips of cool water only if fully conscious. Fan continuously during transport."}].map(item => <Card key={item.title} className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-xs font-semibold">{item.title}</p><p className="mt-2 text-[10px] leading-5 text-muted-foreground">{item.desc}</p><div className="mt-3 rounded-md bg-blue-50 p-2 text-[9px] leading-4 text-slate-700 dark:bg-blue-950 dark:text-slate-300"><strong>Caution:</strong> {item.caution}</div></CardContent></Card>)}
            </div>
          </div>
        </section>

        <section id="sos-form-section" className="mx-auto max-w-3xl px-5 py-10">
          <Card className="border-red-200 shadow-sm dark:border-red-900"><CardContent className="p-5 sm:p-7">
            <div className="mb-4"><Badge className="border-0 bg-red-100 text-red-800">Demo request form</Badge><h2 className="mt-2 text-xl font-semibold">Submit an emergency assistance request</h2><p className="mt-1 text-xs text-muted-foreground">This saves a request record only. It does not dispatch an ambulance or alert a real clinic. For immediate assistance, call your local emergency veterinary provider.</p></div>
            <form id="sos-form" action={submitSOS} className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1"><Label>Owner name</Label><Input name="ownerName" required/></div>
              <div className="grid gap-1"><Label>Phone</Label><Input name="phone" required/></div>
              <div className="grid gap-1"><Label>Pet name</Label><Input name="petName"/></div>
              <div className="grid gap-1"><Label>Species</Label><Input name="species" defaultValue="Dog" required/></div>
              <div className="grid gap-1 sm:col-span-2"><Label>Current location / address</Label><Input name="address" required placeholder="Street, locality, city"/></div>
              <div className="grid gap-1 sm:col-span-2"><Label>Additional details</Label><Textarea name="description" placeholder="What happened? When did symptoms start?"/></div>
              <div className="sm:col-span-2"><p className="mb-2 text-[10px] text-muted-foreground">Selected symptoms: {selected.length ? selected.join(", ") : "None selected"}</p><Button disabled={submitting} className="w-full bg-red-700 hover:bg-red-800">{submitting ? "Submitting..." : "Record emergency request"}</Button></div>
            </form>
          </CardContent></Card>
        </section>
      </main>
    </PageFrame>
  );
}

function ShieldCheckIcon() {
  return <CheckCircle2 size={12} className="text-emerald-700"/>;
}
