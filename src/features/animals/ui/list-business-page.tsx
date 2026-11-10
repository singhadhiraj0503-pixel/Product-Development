"use client";

import { useState } from "react";
import {
  Activity,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Hospital,
  ShieldCheck,
} from "lucide-react";
import { PageFrame } from "./faunacare-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const capabilities = [
  "24/7 Emergency ICU",
  "In-house Blood Bank",
  "Digital X-Ray / USG",
  "Sterile Surgery OT",
  "Pet Ambulance Support",
  "Inpatient Isolation Ward",
];

export function ListBusinessPage() {
  const [busy, setBusy] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    [],
  );
  const [entityType, setEntityType] = useState("clinic");
  const [correctionCategory, setCorrectionCategory] = useState(
    "Incorrect Operating Hours",
  );
  const [correctionRelationship, setCorrectionRelationship] =
    useState("Pet Parent");

  async function submitApplication(formData: FormData) {
    setBusy(true);
    const payload = {
      facilityName: String(formData.get("facilityName") || ""),
      entityType,
      headVeterinarian: String(formData.get("headVeterinarian") || ""),
      councilRegistrationNo: String(
        formData.get("councilRegistrationNo") || "",
      ),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      addressLine: String(formData.get("addressLine") || ""),
      locality: String(formData.get("locality") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      capabilities: selectedCapabilities,
      documents: [],
    };
    try {
      const response = await fetch("/api/animals/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to submit application");
      toast.success(
        `Application submitted. Reference: ${result.data?.id || "created"}`,
      );
      (
        document.getElementById("business-form") as HTMLFormElement | null
      )?.reset();
      setSelectedCapabilities([]);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Unable to submit application",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitCorrection(formData: FormData) {
    const payload = {
      submitterName: String(formData.get("submitterName") || ""),
      submitterEmail: String(formData.get("submitterEmail") || "") || undefined,
      relationship: correctionRelationship,
      fieldToCorrect: correctionCategory,
      suggestedValue: String(formData.get("suggestedValue") || ""),
      reason: String(formData.get("reason") || "") || undefined,
    };
    try {
      const response = await fetch("/api/animals/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to submit correction");
      toast.success("Community correction submitted");
      (
        document.getElementById("correction-form") as HTMLFormElement | null
      )?.reset();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Unable to submit correction",
      );
    }
  }

  return (
    <PageFrame>
      <main>
        <section className="bg-gradient-to-r from-[#f4f7ff] to-[#e6f7f1] px-5 py-10 dark:from-background dark:to-emerald-950/30 sm:px-8">
          <div className="mx-auto grid max-w-[1360px] items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Badge className="mb-3 border-0 bg-emerald-100 text-[9px] text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck size={11} className="mr-1" /> Veterinary Council of
                India & NABH compliant network
              </Badge>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Grow your veterinary practice. Connect with{" "}
                <span className="text-emerald-800 underline decoration-emerald-300 underline-offset-4 dark:text-emerald-400">
                  50,000+
                </span>{" "}
                local pet parents.
              </h1>
              <p className="mt-3 max-w-xl text-xs leading-5 text-muted-foreground">
                Join India's most trusted verified animal healthcare network.
                Streamline patient appointments, issue digital prescriptions,
                optimize your clinical workflow, and help save lives with
                real-time trauma routing.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="#application"
                  className="inline-flex h-10 items-center rounded-full bg-emerald-800 px-5 text-xs font-semibold text-white hover:bg-emerald-900"
                >
                  <Hospital size={14} className="mr-2" /> List Your Practice —
                  Free Onboarding
                </a>
                <a
                  href="#onboarding"
                  className="inline-flex h-10 items-center rounded-full bg-white px-5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-card dark:text-foreground dark:ring-border"
                >
                  <CalendarDays size={14} className="mr-2" /> Schedule Demo for
                  Hospitals
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-8">
                <div>
                  <strong className="text-xl text-emerald-800 dark:text-emerald-400">
                    500+
                  </strong>
                  <p className="text-[9px] text-muted-foreground">
                    Accredited Clinics
                  </p>
                </div>
                <div>
                  <strong className="text-xl text-emerald-800 dark:text-emerald-400">
                    98.4%
                  </strong>
                  <p className="text-[9px] text-muted-foreground">
                    Patient Show-up Rate
                  </p>
                </div>
                <div>
                  <strong className="text-xl text-emerald-800 dark:text-emerald-400">
                    14 Mins
                  </strong>
                  <p className="text-[9px] text-muted-foreground">
                    Avg. Trauma Dispatch
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=85"
                alt="Veterinarian examining a dog"
                className="h-64 w-full rounded-xl object-cover shadow-lg sm:h-80"
              />
              <div className="absolute -bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white p-3 shadow-lg dark:bg-card">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                    <HeartPulse size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold">
                      Emergency Live-Capacity
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      Indiranagar Specialty Vet · Demo
                    </p>
                  </div>
                </div>
                <Badge className="border-0 bg-emerald-100 text-emerald-800">
                  Illustrative
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-9 sm:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">
            Clinical infrastructure
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Engineered for veterinary excellence, built for patient calm.
          </h2>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Modern software to eliminate clinical administrative drag so doctors
            can focus on diagnostic precision and compassionate animal care.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: BellRing,
                title: "Zero No-Show Scheduling",
                desc: "Automated multilingual WhatsApp and SMS reminders integrated with pre-visit digital intake notes, reducing clinical cancellations.",
                link: "Intake sync ready",
              },
              {
                icon: ClipboardList,
                title: "Digital Records & Rx Engine",
                desc: "VCI-compliant smart e-prescriptions, lifetime vaccination trackers, and automatic diagnostic radiology & blood-panel lab data synchronisation.",
                link: "One-tap cloud charts",
              },
              {
                icon: Activity,
                title: "Emergency Trauma Routing",
                desc: "Opt-in dispatch network that routes stabilized critical patients to your facility only when your staff flags real-time oxygen or surgical bed availability.",
                link: "On-demand triage switch",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <span className="mb-4 grid size-9 place-items-center rounded-lg bg-blue-100 text-emerald-800 dark:bg-blue-950 dark:text-blue-300">
                    <item.icon size={17} />
                  </span>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 min-h-16 text-[10px] leading-5 text-muted-foreground">
                    {item.desc}
                  </p>
                  <p className="mt-4 text-[9px] font-semibold text-emerald-800 dark:text-emerald-400">
                    {item.link} →
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="onboarding"
          className="bg-[#edf3ff] px-5 py-9 dark:bg-slate-950/70 sm:px-8"
        >
          <div className="mx-auto max-w-[1360px]">
            <p className="text-center text-[9px] font-semibold uppercase tracking-widest text-emerald-800">
              Rapid onboarding
            </p>
            <h2 className="mt-1 text-center text-2xl font-semibold">
              Go live in under 24 hours
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-[10px] text-muted-foreground">
              A streamlined, clinical-first credentialing protocol designed to
              respect the demanding schedule of veterinary surgeons.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  n: "1",
                  time: "10 MINS",
                  title: "Submit Licenses & VCI Reg",
                  desc: "Provide your Veterinary Council of India (VCI) registration certificate, state veterinary council seal, and establishment clearance certificate.",
                },
                {
                  n: "2",
                  time: "SELF-SERVE",
                  title: "Virtual Practice Setup",
                  desc: "Upload clean facility snapshots, operating hours, resident specialists (radiology, oncology, surgery), and available diagnostic lab hardware.",
                },
                {
                  n: "3",
                  time: "IMMEDIATE",
                  title: "Activate Live Dispatch",
                  desc: "Receive verified badge, display available consultation slots on the FaunaCare map, and accept pre-booked or urgent triage visits.",
                },
              ].map((s) => (
                <Card key={s.n} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="grid size-8 place-items-center rounded-full bg-emerald-800 text-xs font-bold text-white">
                        {s.n}
                      </span>
                      <span className="text-[8px] text-muted-foreground">
                        {s.time}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold">{s.title}</p>
                    <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                      {s.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-9 sm:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">
            Transparent ecosystem
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            Tailored for solo practitioners, multi-specialty hospitals, and
            rescues.
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {[
              {
                tag: "Independent Practice",
                title: "Solo Vet & Clinic",
                price: "₹0",
                period: "/ month forever",
                items: [
                  "FaunaCare Verified Clinic Directory Profile",
                  "Direct In-App Appointment Bookings",
                  "Digital Prescription & Vaccination Reminder",
                  "Standard Patient Review Management",
                ],
                button: "Get Started Free",
              },
              {
                tag: "Recommended",
                title: "Specialty Hospital & 24/7 ICU",
                price: "₹2,400",
                period: "/ month billed annually",
                items: [
                  "Everything in Solo Vet",
                  "Real-Time ICU & Oxygen Bed Status Dispatch",
                  "Multi-Specialist Roster & Calendar Sync",
                  "Automated Diagnostic Lab API Integration",
                  "Priority Trauma Network Placement",
                ],
                button: "Start 30-Day Clinical Trial",
              },
              {
                tag: "Community Mission",
                title: "Verified NGO & Animal Rescue",
                price: "100% Free",
                period: "/ Always & Forever",
                items: [
                  "FaunaCare Verified Humane Rescue Badge",
                  "Direct Strays & Abandonment Helpline Listing",
                  "Foster & Adoption Matching Dashboard",
                  "Zero-Fee Medical Donation Gateway Integration",
                ],
                button: "Register NGO Entity",
              },
            ].map((p, i) => (
              <Card
                key={p.title}
                className={`border-0 shadow-sm ${i === 1 ? "bg-emerald-800 text-white ring-2 ring-emerald-700" : "bg-white dark:bg-card"}`}
              >
                <CardContent className="p-5">
                  <Badge
                    className={`border-0 text-[9px] ${i === 1 ? "bg-emerald-600 text-white" : "bg-blue-50 text-slate-700"}`}
                  >
                    {p.tag}
                  </Badge>
                  <p className="mt-3 text-sm font-semibold">{p.title}</p>
                  <p className="mt-4">
                    <strong className="text-3xl">{p.price}</strong>
                    <span
                      className={`ml-1 text-[9px] ${i === 1 ? "text-emerald-100" : "text-muted-foreground"}`}
                    >
                      {p.period}
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {p.items.map((x) => (
                      <li key={x} className="flex gap-2 text-[10px]">
                        <CheckCircle2 size={13} className="shrink-0" /> {x}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#application"
                    className={`mt-5 flex h-9 items-center justify-center rounded-full text-[10px] font-semibold ${i === 1 ? "bg-white text-emerald-900" : "bg-blue-100 text-slate-800 dark:bg-muted dark:text-foreground"}`}
                  >
                    {p.button}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="application"
          className="bg-[#edf3ff] px-5 py-9 dark:bg-slate-950/70 sm:px-8"
        >
          <div className="mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-800">
                Partner application
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Register your facility in 3 minutes.
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Our clinical onboarding team works round-the-clock to verify
                credentials, upload your schedules, and connect your diagnostic
                services directly to your daily operations.
              </p>
              <Card className="mt-4 border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold">
                    <ShieldCheck size={15} className="text-emerald-700" />{" "}
                    Strict Ethical Practice Adherence
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                    FaunaCare strictly enforces Indian Veterinary Council
                    regulations regarding prescription safety, ethical
                    marketing, and emergency referral transparency.
                  </p>
                </CardContent>
              </Card>
              <p className="mt-4 text-[10px] text-muted-foreground">
                Need help with onboarding? Call Partner Desk: +91 80 4920 8820
              </p>
            </div>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <form
                  id="business-form"
                  action={submitApplication}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <Field label="Practice / Clinic Name *">
                    <Input
                      name="facilityName"
                      required
                      placeholder="e.g. Apex Pet Hospital"
                    />
                  </Field>
                  <Field label="Entity Type *">
                    <Select value={entityType} onValueChange={setEntityType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="diagnostic">
                          Diagnostic Centre
                        </SelectItem>
                        <SelectItem value="specialty_hospital">
                          Specialty Hospital
                        </SelectItem>
                        <SelectItem value="ngo">NGO / Rescue</SelectItem>
                        <SelectItem value="sanctuary">Sanctuary</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Head Veterinarian / Director *">
                    <Input
                      name="headVeterinarian"
                      required
                      placeholder="Dr. Ananya Sharma, BVSc & AH"
                    />
                  </Field>
                  <Field label="VCI / State Council Registration No.">
                    <Input
                      name="councilRegistrationNo"
                      placeholder="VCI-KAR-2018-XXXX"
                    />
                  </Field>
                  <Field label="Official Contact Number *">
                    <Input
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                    />
                  </Field>
                  <Field label="Official Email *">
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="clinic@example.com"
                    />
                  </Field>
                  <Field label="City *">
                    <Input name="city" required placeholder="Bengaluru" />
                  </Field>
                  <Field label="State *">
                    <Input name="state" required placeholder="Karnataka" />
                  </Field>
                  <Field label="Locality *">
                    <Input name="locality" required placeholder="Indiranagar" />
                  </Field>
                  <Field label="Postal Code">
                    <Input name="postalCode" placeholder="560038" />
                  </Field>
                  <div className="grid gap-1 sm:col-span-2">
                    <Label>Facility Full Address *</Label>
                    <Input
                      name="addressLine"
                      required
                      placeholder="Plot 42, 100ft Road, Indiranagar, Bengaluru, KA 560038"
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label>Facility Capabilities (select all that apply)</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {capabilities.map((cap) => (
                        <label
                          key={cap}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <Checkbox
                            checked={selectedCapabilities.includes(cap)}
                            onCheckedChange={(v) =>
                              setSelectedCapabilities((old) =>
                                v
                                  ? [...old, cap]
                                  : old.filter((x) => x !== cap),
                              )
                            }
                          />
                          {cap}
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] leading-4 text-muted-foreground sm:col-span-2">
                    By submitting, you confirm that your facility details are
                    accurate and agree to verification. Document upload is not
                    wired in this starter; submit documents through your
                    verified onboarding channel.
                  </p>
                  <Button
                    disabled={busy}
                    className="h-10 rounded-full bg-emerald-800 text-xs hover:bg-emerald-900 sm:col-span-2"
                  >
                    {busy
                      ? "Submitting application..."
                      : "Submit Application for Verification"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-9 sm:px-8">
          <div className="grid gap-5 rounded-xl bg-blue-100 p-5 dark:bg-blue-950/50 lg:grid-cols-2">
            <div>
              <Badge className="border-0 bg-white text-[9px] text-emerald-800">
                Community Data Integrity Watch
              </Badge>
              <h2 className="mt-3 text-xl font-semibold">
                Help keep animal healthcare data 100% accurate.
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Spotted an outdated clinic, an inactive emergency telephone
                number, or an unverified listing? Submit a correction and our
                operations team will review it.
              </p>
              <p className="mt-3 text-[9px] text-muted-foreground">
                Reviewed by our directory team · Direct Vet Confirmation
              </p>
            </div>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <form
                  id="correction-form"
                  action={submitCorrection}
                  className="grid gap-2"
                >
                  <p className="text-xs font-semibold">
                    Report Clinic Detail Correction
                  </p>
                  <Field label="Your name">
                    <Input
                      name="submitterName"
                      required
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Clinic or Doctor Name">
                    <Input
                      name="providerName"
                      placeholder="e.g. Care & Cure Vet Hospital"
                    />
                  </Field>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Discrepancy Category">
                      <Select
                        value={correctionCategory}
                        onValueChange={setCorrectionCategory}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operating hours">
                            Incorrect Operating Hours
                          </SelectItem>
                          <SelectItem value="Phone">Incorrect Phone</SelectItem>
                          <SelectItem value="Address">
                            Incorrect Address
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Your Relationship">
                      <Select
                        value={correctionRelationship}
                        onValueChange={setCorrectionRelationship}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pet Parent">Pet Parent</SelectItem>
                          <SelectItem value="Clinic Staff">
                            Clinic Staff
                          </SelectItem>
                          <SelectItem value="Veterinarian">
                            Veterinarian
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field label="Contact email">
                    <Input
                      name="submitterEmail"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Suggested correct information">
                    <Textarea
                      name="suggestedValue"
                      required
                      placeholder="State the correct information..."
                    />
                  </Field>
                  <Field label="Reason / additional context">
                    <Textarea name="reason" placeholder="Optional details..." />
                  </Field>
                  <Button variant="secondary" className="w-full">
                    Submit Community Correction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: import("react").ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1">
      <Label className="text-[10px]">{label}</Label>
      {children}
    </div>
  );
}
