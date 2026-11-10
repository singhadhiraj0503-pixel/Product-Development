"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, PawPrint, Star, Phone, CalendarDays, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Clock3, Stethoscope, Activity, SlidersHorizontal } from "lucide-react";
import { PageFrame } from "./faunacare-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Provider = {
  id: string; name: string; providerType: string; description?: string | null;
  locality: string; city: string; state?: string; addressLine: string; phone: string;
  isVerified: boolean; isEmergency: boolean; open24Hours: boolean;
  averageRating: string | number; reviewCount: number; consultationFee?: string | number | null;
  species?: string[]; specialties?: string[]; capabilities?: string[]; coverImageUrl?: string | null;
};

const services = ["All Services", "General Vet Checkup", "Vaccinations", "Diagnostics & Blood Lab", "Pet Boarding", "Dental Care"];
const species = ["Dogs", "Cats", "Birds & Avian", "Small Animals", "Exotics & Reptiles"];
const demoImages = [
  "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7b0?auto=format&fit=crop&w=700&q=80",
];

function ProviderCard({ provider, index, onBook }: { provider: Provider; index: number; onBook: (p: Provider) => void }) {
  const fee = provider.consultationFee ? `₹${Number(provider.consultationFee).toLocaleString("en-IN")}` : "Contact";
  const image = provider.coverImageUrl || demoImages[index % demoImages.length];
  const tags = provider.capabilities?.length ? provider.capabilities.slice(0, 4) : (provider.specialties || []).slice(0, 4);
  return (
    <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-card dark:ring-border">
      <CardContent className="p-3.5 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {provider.isEmergency && <Badge className="border-0 bg-red-100 text-[9px] text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">24/7 TRAUMA ICU</Badge>}
            {provider.isVerified && <Badge className="border-0 bg-emerald-100 text-[9px] text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"><ShieldCheck className="mr-1 size-3"/> Council Verified</Badge>}
          </div>
          <Badge className="border-0 bg-blue-50 text-[10px] text-blue-800 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-200"><Star className="mr-1 size-3 fill-current"/> {Number(provider.averageRating || 0).toFixed(1)} ({provider.reviewCount || 0})</Badge>
        </div>
        <h3 className="text-sm font-semibold tracking-tight">{provider.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><MapPin size={11}/>{provider.locality}, {provider.city} <span>·</span>{provider.open24Hours ? "Open 24 Hours" : provider.providerType}</p>
        <div className="mt-3 grid grid-cols-[1fr_1fr_0.8fr] gap-1 overflow-hidden rounded-lg bg-slate-100 dark:bg-muted">
          <img src={image} alt={`${provider.name} facility`} className="h-16 w-full object-cover sm:h-[76px]" />
          <img src={demoImages[(index + 1) % demoImages.length]} alt="Veterinary care" className="h-16 w-full object-cover sm:h-[76px]" />
          <div className="flex flex-col items-center justify-center gap-1 px-1 text-center text-[9px] text-emerald-900 dark:text-emerald-300"><Stethoscope size={17}/><span>{provider.specialties?.[0] || "Veterinary Care"}</span></div>
        </div>
        <div className="mt-2 rounded-lg bg-[#eef3ff] p-2.5 dark:bg-muted">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-600 dark:text-muted-foreground">Facility information</p>
          <p className="mt-1 line-clamp-2 text-[10px] text-slate-700 dark:text-foreground">{provider.description || provider.addressLine}</p>
        </div>
        <div className="mt-2 flex min-h-6 flex-wrap gap-1">
          {tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-sm px-1.5 py-0 text-[9px] font-normal">{tag}</Badge>)}
        </div>
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-3 dark:border-border">
          <div><p className="text-[9px] text-muted-foreground">Consultation Fee</p><p className="text-lg font-semibold leading-tight">{fee}</p><p className="text-[9px] text-muted-foreground">standard slot</p></div>
          <div className="flex items-center gap-1.5">
            <Button size="icon" variant="outline" className="size-8 rounded-full" onClick={() => window.location.href = `tel:${provider.phone}`} aria-label="Call provider"><Phone size={13}/></Button>
            <Button size="sm" className="h-8 rounded-full bg-emerald-800 px-4 text-[10px] hover:bg-emerald-900" onClick={() => onBook(provider)}>Book Appointment</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentDialog({ provider, onClose }: { provider: Provider | null; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    if (!provider) return;
    setBusy(true);
    const payload = {
      providerId: provider.id,
      petName: String(formData.get("petName") || ""),
      species: String(formData.get("species") || "Dog"),
      ownerName: String(formData.get("ownerName") || ""),
      ownerPhone: String(formData.get("ownerPhone") || ""),
      ownerEmail: String(formData.get("ownerEmail") || "") || undefined,
      appointmentAt: new Date(String(formData.get("appointmentAt"))).toISOString(),
      reason: String(formData.get("reason") || ""),
    };
    try {
      const response = await fetch("/api/animals/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to book appointment");
      toast.success("Appointment request submitted");
      onClose();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(false); }
  }
  return (
    <Dialog open={!!provider} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Book an appointment</DialogTitle></DialogHeader>
        {provider && <form action={submit} className="grid gap-3">
          <p className="text-sm text-muted-foreground">{provider.name}</p>
          <div className="grid gap-1"><Label>Pet name</Label><Input name="petName" required placeholder="e.g. Bruno"/></div>
          <div className="grid gap-1"><Label>Species</Label><Select name="species" defaultValue="Dog"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Dog">Dog</SelectItem><SelectItem value="Cat">Cat</SelectItem><SelectItem value="Bird">Bird</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
          <div className="grid gap-1"><Label>Your name</Label><Input name="ownerName" required/></div>
          <div className="grid gap-1"><Label>Phone</Label><Input name="ownerPhone" required/></div>
          <div className="grid gap-1"><Label>Email</Label><Input name="ownerEmail" type="email"/></div>
          <div className="grid gap-1"><Label>Preferred date & time</Label><Input name="appointmentAt" type="datetime-local" required/></div>
          <div className="grid gap-1"><Label>Reason</Label><Textarea name="reason" placeholder="Briefly describe the concern"/></div>
          <Button disabled={busy} className="bg-emerald-800 hover:bg-emerald-900">{busy ? "Submitting..." : "Request appointment"}</Button>
        </form>}
      </DialogContent>
    </Dialog>
  );
}

export function FindCarePage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [locality, setLocality] = useState("Indiranagar");
  const [selectedSpecies, setSelectedSpecies] = useState("Dogs");
  const [service, setService] = useState("All Services");
  const [sort, setSort] = useState("proximity");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [booking, setBooking] = useState<Provider | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);
  const limit = 4;

  const loadProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ city, locality, page: String(page), limit: String(limit), sort });
    if (query.trim()) params.set("q", query.trim());
    if (selectedSpecies) params.set("species", selectedSpecies);
    if (service !== "All Services") params.set("service", service);
    try {
      const res = await fetch(`/api/animals/providers?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Unable to load providers");
      setProviders(json.data || []);
      setTotal(json.pagination?.total || 0);
    } catch (error) {
      setProviders([]);
      setTotal(0);
      toast.error(error instanceof Error ? error.message : "Unable to load providers");
    } finally { setLoading(false); }
  }, [city, locality, page, query, selectedSpecies, service, sort]);

  useEffect(() => { void loadProviders(); }, [loadProviders]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const shownStart = total ? (page - 1) * limit + 1 : 0;
  const shownEnd = Math.min(page * limit, total);

  return (
    <PageFrame>
      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-[#f6f8ff] via-[#eef4fb] to-[#e4f8f2] px-4 pb-8 pt-7 dark:from-background dark:via-slate-900 dark:to-emerald-950/30 sm:pt-9">
          <div className="mx-auto max-w-[1120px] text-center">
            <Badge className="mb-3 rounded-full border-0 bg-emerald-100 px-3 py-1 text-[9px] font-medium tracking-wide text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"><ShieldCheck size={11} className="mr-1"/> ACCREDITED VETERINARY NETWORK · BENGALURU REGION</Badge>
            <h1 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[46px]">Compassionate healthcare & clinic discovery for your pets</h1>
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">Connecting pet parents in India to accredited veterinary hospitals, verified exotic specialists, certified emergency rescues, and zero-delay trauma care centers.</p>
            <div className="mx-auto mt-6 flex max-w-[850px] flex-col gap-2 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200 sm:flex-row sm:items-center sm:rounded-full dark:bg-card dark:ring-border">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left sm:w-40 dark:bg-muted"><MapPin size={15} className="text-emerald-800"/><div className="min-w-0"><p className="text-[9px] text-muted-foreground">Neighborhood</p><Input value={locality} onChange={e => {setLocality(e.target.value);setPage(1)}} className="h-4 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0" aria-label="Neighborhood"/></div></div>
              <div className="flex flex-1 items-center gap-2 px-2"><Search size={16} className="text-muted-foreground"/><Input value={query} onChange={e => {setQuery(e.target.value);setPage(1)}} placeholder="Search clinics, doctors, surgery, vaccinations..." className="h-9 border-0 text-xs shadow-none focus-visible:ring-0"/></div>
              <Button onClick={() => void loadProviders()} className="h-10 rounded-full bg-emerald-800 px-7 text-xs hover:bg-emerald-900">Find Care <ArrowRight size={14} className="ml-2"/></Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2"><span className="mr-1 text-[9px] uppercase text-muted-foreground">Species:</span>{species.map(s => <button key={s} onClick={() => {setSelectedSpecies(s);setPage(1)}} className={`rounded-full px-3 py-1 text-[9px] ${selectedSpecies === s ? "bg-emerald-200 font-semibold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100" : "bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-card dark:text-foreground dark:ring-border"}`}>{s}</button>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-10 pt-5 sm:px-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5">{services.map(s => <button key={s} onClick={() => {setService(s);setPage(1)}} className={`rounded-full px-3 py-1.5 text-[9px] ${service === s ? "bg-emerald-800 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-card dark:text-foreground dark:ring-border"}`}>{s}</button>)}</div>
            <div className="flex items-center gap-2 self-end text-[10px] text-muted-foreground sm:self-auto"><SlidersHorizontal size={13}/> Sort:<Select value={sort} onValueChange={v => {setSort(v);setPage(1)}}><SelectTrigger className="h-8 w-[170px] rounded-full bg-white text-[10px] dark:bg-card"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="proximity">Proximity (Closest first)</SelectItem><SelectItem value="rating">Highest rated</SelectItem><SelectItem value="fee-low">Fee: low to high</SelectItem><SelectItem value="fee-high">Fee: high to low</SelectItem><SelectItem value="name">Name</SelectItem></SelectContent></Select></div>
          </div>

          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Curated Animal Care in {city}</h2><p className="mt-1 text-[10px] text-muted-foreground">{total} verified clinical centers</p></div>
            <p className="hidden text-[9px] text-muted-foreground sm:block">Directory updates when providers are approved</p>
          </div>

          {loading ? <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(n => <div key={n} className="h-[310px] animate-pulse rounded-xl bg-muted"/>)}</div> :
            providers.length ? <div className="grid gap-4 md:grid-cols-2">{providers.map((p,i) => <ProviderCard key={p.id} provider={p} index={i} onBook={setBooking}/>)}</div> :
            <Card className="border-dashed bg-white/70 dark:bg-card"><CardContent className="py-12 text-center"><PawPrint className="mx-auto mb-3 text-emerald-700" size={30}/><h3 className="font-semibold">No matching providers found</h3><p className="mt-1 text-sm text-muted-foreground">Try another locality, service or species.</p><Button variant="outline" className="mt-4" onClick={() => {setQuery("");setLocality("");setService("All Services");setSelectedSpecies("Dogs")}}>Clear filters</Button></CardContent></Card>}

          <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-[10px] text-muted-foreground shadow-sm dark:bg-card sm:flex-row">
            <span>Showing {shownStart}–{shownEnd} of {total} clinical centers</span>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="size-8 rounded-full" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14}/></Button>
              <span className="grid size-7 place-items-center rounded-full bg-emerald-800 text-white">{page}</span>
              <span className="px-1">of {totalPages}</span>
              <Button size="icon" variant="ghost" className="size-8 rounded-full" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14}/></Button>
            </div>
          </div>
        </section>

        <section className="bg-[#edf3ff] px-4 py-10 dark:bg-slate-950/70 sm:px-6">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Clinical rigor · empathetic care</p>
            <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-semibold tracking-tight">Thoughtful Veterinary Architecture</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">Every veterinarian and surgical unit on FaunaCare is verified under strict animal health standards, transparent fee frameworks, and emergency response SLAs.</p></div><div className="flex gap-5 rounded-xl bg-white px-5 py-3 shadow-sm dark:bg-card"><div><strong className="text-xl text-emerald-800 dark:text-emerald-400">100%</strong><p className="text-[9px] text-muted-foreground">Council Verified</p></div><div><strong className="text-xl text-emerald-800 dark:text-emerald-400">&lt;15m</strong><p className="text-[9px] text-muted-foreground">Avg SOS Response</p></div></div></div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[{icon:Search,title:"Search Verified Animal Specialists",desc:"Filter by exact species, specialized care protocols, surgery capabilities, and real distance from your home to avoid transit distress for unwell pets.",link:"Learn vetting criteria"},{icon:CalendarDays,title:"Transparent Fees & Operating Hours",desc:"No hidden trauma markups. Clear consultation fees, diagnostic estimates, and verified operational hours eliminate high-stress guessing in emergencies.",link:"View tariff standards"},{icon:Activity,title:"Instant Booking or SOS Dispatch",desc:"Confirm guaranteed consultation appointments directly, or activate a one-tap emergency trauma dispatch to alert the ICU team before arrival.",link:"Emergency hotline setup"}].map(item => <Card key={item.title} className="border-0 shadow-sm"><CardContent className="p-5"><span className="mb-4 grid size-9 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><item.icon size={17}/></span><p className="text-sm font-semibold">{item.title}</p><p className="mt-2 min-h-20 text-xs leading-5 text-muted-foreground">{item.desc}</p><Link href="/animals/emergency" className="mt-4 inline-flex items-center text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">{item.link} <ArrowRight size={12} className="ml-1"/></Link></CardContent></Card>)}
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-card sm:flex-row"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-emerald-800 text-white"><PawPrint size={17}/></span><div><p className="text-sm font-semibold">Are you an accredited veterinary surgeon or clinic?</p><p className="text-[10px] text-muted-foreground">Join FaunaCare's digital clinical directory and reach local pet guardians.</p></div></div><Button asChild className="rounded-full bg-emerald-800 text-xs hover:bg-emerald-900"><Link href="/animals/list-business">List Your Practice</Link></Button></div>
          </div>
        </section>
      </main>
      <AppointmentDialog provider={booking} onClose={() => setBooking(null)}/>
    </PageFrame>
  );
}
