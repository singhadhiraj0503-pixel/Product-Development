"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Download,
  ExternalLink,
  Layers3,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EducationShell, Eyebrow, SectionTitle } from "./education-shell";

type AnyRecord = Record<string, any>;
async function getJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    return json?.success ? json.data : fallback;
  } catch {
    return fallback;
  }
}

const stats = [
  {
    value: "4 Weeks",
    label: "Live Weekly Sprints",
    text: "Daily paired-code reviews, live architectural debriefs, and real-time async help.",
    icon: Clock3,
    color: "text-indigo-600",
  },
  {
    value: "5 Apps",
    label: "Production Repos",
    text: "Full-stack multi-agent apps shipped to your public GitHub with automated CI/CD pipelines.",
    icon: Layers3,
    color: "text-indigo-600",
  },
  {
    value: "94%",
    label: "Placement & Impact",
    text: "Graduates secured full-time AI roles, research grants, or paid SaaS contracts within 90 days.",
    icon: Zap,
    color: "text-emerald-700",
  },
  {
    value: "1:8",
    label: "Fellow-to-Mentor",
    text: "Strict cohort ceilings guarantee personal 1-on-1 architecture feedback every week.",
    icon: Users,
    color: "text-slate-900 dark:text-white",
  },
];

const comparisonLeft = [
  "Passive Video Consumption: Hundreds of hours watching someone else code with no architectural pressure.",
  "Trivial Chatbot Clones: Superficial wrappers around raw OpenAI endpoints that fail in real latency conditions.",
  "Zero Production Context: No telemetry, no token budgeting, no evals, and no database synchronization.",
  "Abandoned GitHub Repos: Half-baked tutorial files with no automated tests, zero users, and zero commercial viability.",
];
const comparisonRight = [
  "Hands-On Paired Engineering: Live coding sessions, hard debugging scenarios, and architecture review panels.",
  "Autonomous Swarm Architecture: Multi-agent workflows utilizing LangGraph, LangSmith, and CrewAI state machines.",
  "Hybrid Vector+Graph RAG: Sub-millisecond context retrieval through hybrid Pinecone, Neo4j, and self-correcting rerankers.",
  "5 Production End-to-End Apps: Shipped as automated micro-SaaS with FastAPI, Stripe billing, and continuous evaluation suites.",
];

function StatCard({ item }: { item: (typeof stats)[number] }) {
  const Icon = item.icon;
  return (
    <Card className="rounded-xl border-indigo-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className={`text-2xl font-semibold tracking-tight ${item.color}`}>
            {item.value}
          </p>
          <Icon size={15} className="text-slate-400" />
        </div>
        <p className="mt-2 text-xs font-semibold">{item.label}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
          {item.text}
        </p>
      </CardContent>
    </Card>
  );
}

function OrchestrationVisual() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-[#111b31] p-4 text-white shadow-xl">
      <div className="mb-4 flex items-center justify-between text-[9px]">
        <span className="font-mono text-slate-300">
          ✳ synthetix-agent-mesh.v4
        </span>
        <span className="rounded bg-emerald-400/20 px-2 py-1 text-emerald-300">
          LIVE SANDBOX
        </span>
      </div>
      <div className="rounded-lg border border-slate-700 bg-[#0b1427] p-4">
        <div className="mb-4 flex justify-between text-[9px]">
          <span className="font-semibold">✳ Orchestration Graph</span>
          <span className="text-emerald-300">Status: 200 OK • 18ms</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-2 text-center font-mono text-[8px]">
          <span className="rounded bg-slate-800 p-2">
            INPUT
            <br />
            Stream
          </span>
          <span className="rounded bg-indigo-600 p-3">
            ROUTER
            <br />
            LangGraph
          </span>
          <span className="rounded bg-emerald-900 p-2 text-emerald-200">
            FINISHING
            <br />
            Registry
          </span>
          <span className="col-span-3 text-emerald-300">
            ↓ Agentic[Critic] Evaluating context drift ↓
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-300">
        <span className="size-6 rounded-full bg-indigo-200" />
        <span>
          “Synthetix replaced 6 months of fragmented learning in 30 days.”
        </span>
      </div>
    </div>
  );
}

export function OverviewPage() {
  const [overview, setOverview] = useState<AnyRecord | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    background: "Computer Science / STEM Student",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getJson<AnyRecord | null>("/api/education/overview", null).then(
      setOverview,
    );
  }, []);

  async function submitSyllabus(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/education/leads/syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cohortCode: overview?.program?.cohort?.code || "COHORT-04",
          consentToContact: true,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to submit your request.");
      setMessage("Your syllabus request has been received.");
      setForm({
        fullName: "",
        email: "",
        background: "Computer Science / STEM Student",
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const cohort = overview?.program?.cohort;
  const weeks: AnyRecord[] = overview?.curriculumPreview || [];
  const seats =
    overview?.program?.seatsRemaining ??
    (cohort ? Math.max(0, cohort.totalSeats - cohort.filledSeats) : 14);

  return (
    <EducationShell>
      <main>
        <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:py-14 lg:px-8">
          <div>
            <span className="mb-5 inline-flex rounded-full bg-indigo-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              ✳ Applied Generative Systems Fellowship
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
              Build production{" "}
              <span className="text-indigo-600">AI applications,</span> not just
              toy prompts.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              A rigorous 4-week, project-intensive fellowship engineered for
              students, technical researchers, and modern builders. Master
              multi-agent orchestrations, hybrid RAG, and self-healing
              micro-SaaS pipelines — backed by a risk-free trial.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="h-10 rounded-lg bg-indigo-600 px-5 text-xs hover:bg-indigo-700">
                <Link href="/education/admissions">
                  Apply for Cohort 04 (Takes 3 mins){" "}
                  <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-indigo-100 bg-white px-5 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <a href="#syllabus">
                  <Download className="mr-2 size-3.5" /> Download Syllabus
                  (28-Page PDF)
                </a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-500">
              <span>◎ No tuition until Week 2</span>
              <span>♧ 100% money-back policy</span>
              <span>◇ Ex-OpenAI & Stripe mentors</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-lg">
            <OrchestrationVisual />
          </div>
        </section>

        <section className="bg-indigo-100/70 py-5 dark:bg-slate-900">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="The pedagogy gap"
            title="Why generic AI tutorials leave you stranded"
            description="Online bootcamps sell pre-recorded videos on basic API keys. Synthetix trains production systems engineers capable of deploying scalable, fault-tolerant autonomous intelligence."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-xl border-indigo-100 bg-indigo-50/80 dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    The Standard Online Path
                  </h3>
                  <span className="rounded bg-rose-100 px-2 py-1 text-[8px] font-bold text-rose-600">
                    FRAGMENTED
                  </span>
                </div>
                <ul className="space-y-3">
                  {comparisonLeft.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300"
                    >
                      <span className="font-bold text-rose-500">×</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-lg bg-white/80 p-3 font-mono text-[9px] text-slate-500 dark:bg-slate-950">
                  Outcome: High tutorial fatigue, surface-level understanding,
                  unable to pass technical AI systems interviews.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-indigo-200 bg-white shadow-md dark:border-indigo-900 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    The Synthetix Blueprint
                  </h3>
                  <span className="rounded bg-emerald-100 px-2 py-1 text-[8px] font-bold text-emerald-700">
                    PRODUCTION READY
                  </span>
                </div>
                <ul className="space-y-3">
                  {comparisonRight.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-lg bg-indigo-50 p-3 font-mono text-[9px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
                  Outcome: A provable portfolio of production architectures that
                  commands immediate industry trust.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-indigo-50/80 py-12 dark:bg-slate-900/60">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Curriculum blueprint"
              title="4 Weeks to Applied Engineering Mastery"
              action={
                <Button variant="link" className="text-[11px] text-indigo-600">
                  <Link href="/education/curriculum">
                    View Detailed Week-by-Week Syllabus{" "}
                    <ArrowUpRight className="ml-1 size-3" />
                  </Link>
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(weeks.length
                ? weeks
                : [
                    {
                      weekNumber: 1,
                      focus: "FOUNDATIONS",
                      title: "Modern LLM Infra & Tool Calling",
                      summary:
                        "Structured JSON output schemas, function calling protocols, token latency analysis.",
                      milestone: "Autonomous Data Extractor API",
                    },
                    {
                      weekNumber: 2,
                      focus: "RETRIEVAL",
                      title: "Hybrid Vector & Graph RAG",
                      summary:
                        "Pinecone vector pipelines, rerankers, contextual compression and metadata graph filtering.",
                      milestone: "Multi-Tenant Legal & Doc Searcher",
                    },
                    {
                      weekNumber: 3,
                      focus: "AGENTS",
                      title: "Multi-Agent Swarm Orchestration",
                      summary:
                        "LangGraph state machines, supervisor/worker patterns, reflection cycles and tool delegation.",
                      milestone: "Autonomous Financial Research Crew",
                    },
                    {
                      weekNumber: 4,
                      focus: "PRODUCTION",
                      title: "Micro-SaaS & Eval Infrastructure",
                      summary:
                        "FastAPI streaming, LangSmith tracing, automated evals, Dockerized deployment and Stripe.",
                      milestone: "Commercialized Micro-SaaS Capstone",
                    },
                  ]
              ).map((week: AnyRecord, i: number) => (
                <Card
                  key={week.id || week.weekNumber}
                  className="rounded-xl border-indigo-100 bg-white dark:border-slate-800 dark:bg-slate-950"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex justify-between text-[8px] font-semibold uppercase tracking-widest text-indigo-600">
                      <span>
                        Week {String(week.weekNumber || i + 1).padStart(2, "0")}
                      </span>
                      <span>{week.focus || "ENGINEERING"}</span>
                    </div>
                    <h3 className="text-sm font-semibold leading-5">
                      {week.title}
                    </h3>
                    <p className="mt-2 min-h-[64px] text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                      {week.summary}
                    </p>
                    <div className="mt-3 rounded-lg bg-indigo-50 p-2 text-[9px] dark:bg-indigo-950">
                      <span className="text-slate-500">Shipped Milestone:</span>
                      <p className="mt-1 font-mono text-indigo-700 dark:text-indigo-300">
                        {week.milestone ||
                          week.outcomes?.[0] ||
                          "Weekly production build"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="syllabus"
          className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="grid overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="bg-indigo-100/70 p-6 sm:p-9 dark:bg-indigo-950/40">
              <span className="rounded-full bg-white px-3 py-1 text-[9px] font-semibold text-indigo-700 dark:bg-slate-900 dark:text-indigo-300">
                ♧ FREE ENGINEERING KIT
              </span>
              <h2 className="mt-5 max-w-md text-2xl font-semibold tracking-tight">
                Get the full 28-page syllabus & starter codebase
              </h2>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Explore our complete architectural blueprints, reading lists,
                and starter Python repositories before submitting an
                application.
              </p>
              <ul className="mt-5 space-y-2 text-[10px] text-slate-600 dark:text-slate-300">
                {[
                  "Complete day-by-day technical schedule & recommended readings",
                  "GitHub repository with 3 pre-built LangGraph starter templates",
                  "Detailed rubrics used for technical capstone certification",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="size-3.5 text-emerald-600" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex items-center gap-3">
                <div className="grid size-14 place-items-center rounded-lg border border-indigo-200 bg-white text-indigo-700 dark:border-slate-700 dark:bg-slate-900">
                  <BookOpen size={25} />
                </div>
                <div className="text-[9px] leading-4 text-slate-500">
                  DOCUMENT: SYNTETIX_SYLLABUS_V4.PDF
                  <br />
                  Updated for Cohort 04 (October 2026)
                  <br />
                  <span className="text-emerald-600">
                    Verified by Academic Review Board
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-9">
              <form onSubmit={submitSyllabus} className="space-y-4">
                <div>
                  <Label className="text-[9px] uppercase tracking-wider text-slate-500">
                    Full name
                  </Label>
                  <Input
                    required
                    minLength={2}
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Elena Rostova"
                    className="mt-1 h-10 bg-indigo-50/70 text-xs dark:bg-slate-950"
                  />
                </div>
                <div>
                  <Label className="text-[9px] uppercase tracking-wider text-slate-500">
                    University or work email
                  </Label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="elena@university.edu"
                    className="mt-1 h-10 bg-indigo-50/70 text-xs dark:bg-slate-950"
                  />
                </div>
                <div>
                  <Label className="text-[9px] uppercase tracking-wider text-slate-500">
                    Current background
                  </Label>
                  <select
                    value={form.background}
                    onChange={(e) =>
                      setForm({ ...form, background: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-md border border-input bg-indigo-50/70 px-3 text-xs dark:bg-slate-950"
                  >
                    <option>Computer Science / STEM Student</option>
                    <option>Software Developer</option>
                    <option>Product Manager</option>
                    <option>Researcher</option>
                    <option>Other</option>
                  </select>
                </div>
                <Button
                  disabled={busy}
                  className="h-10 w-full rounded-lg bg-indigo-700 text-xs hover:bg-indigo-800"
                >
                  {busy
                    ? "Submitting..."
                    : "Send Me the Syllabus & Free Starter Kit"}{" "}
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
                {message && (
                  <p
                    role="status"
                    className="text-xs text-indigo-700 dark:text-indigo-300"
                  >
                    {message}
                  </p>
                )}
                <div className="flex justify-center gap-4 text-[9px] text-slate-400">
                  <span>⚡ Instant Delivery</span>
                  <span>♧ Zero Spam Ever</span>
                  <span>↗ 1-Click Unsubscribe</span>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-700 bg-[#202b43] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-emerald-300">
                ● {seats} seats remaining in cohort 04
              </p>
              <h2 className="max-w-xl text-2xl font-semibold leading-tight">
                Ready to transition into applied production engineering?
              </h2>
              <p className="mt-2 max-w-xl text-[10px] leading-4 text-slate-300">
                Admissions are evaluated on a rolling basis. Review your
                curriculum, prepare your GitHub handle, and secure your place.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button className="bg-indigo-600 text-[10px] hover:bg-indigo-700">
                <Link href="/education/admissions">
                  Start Formal Application{" "}
                  <ArrowRight className="ml-2 size-3" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-slate-500 bg-slate-700 text-[10px] text-white hover:bg-slate-600"
              >
                <Link href="/education/admissions">Review Tuition & Aid</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </EducationShell>
  );
}

export function CurriculumPage() {
  const [weeks, setWeeks] = useState<AnyRecord[]>([]);
  const [projects, setProjects] = useState<AnyRecord[]>([]);
  const [stack, setStack] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getJson<AnyRecord[]>("/api/education/curriculum", []),
      getJson<AnyRecord>("/api/education/projects", {
        projects: [],
        technologyStack: [],
      }),
    ])
      .then(([w, p]) => {
        setWeeks(w);
        setProjects(p.projects || []);
        setStack(p.technologyStack || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const fallbackWeeks = [
    {
      weekNumber: 1,
      focus: "FOUNDATIONS",
      title: "Core Foundation & Structured Reasoning",
      summary:
        "Taming stochastic output into deterministic enterprise pipelines. You will master schema enforcement, typed JSON generation, dynamic execution and real-time multi-model inference.",
      modules: [
        {
          title: "Pydantic v2 schemas & instructor-level JSON extraction",
          summary: "Typed extraction and validation",
          outcomes: [
            "Structured outputs",
            "Function calling",
            "Schema validation",
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      focus: "RETRIEVAL & KNOWLEDGE",
      title: "Enterprise Knowledge Retrieval & Semantic RAG",
      summary:
        "Moving past naive RAG into production-grade retrieval. Build resilient vector architectures that enable hallucinations and query ambiguity.",
      modules: [
        {
          title: "Hybrid retrieval and semantic search",
          summary: "Hybrid vector and keyword search",
          outcomes: ["Vector retrieval", "Reranking", "Metadata filters"],
        },
      ],
    },
    {
      weekNumber: 3,
      focus: "AUTONOMOUS SYSTEMS",
      title: "Autonomous Multi-Agent Swarms & Orchestration",
      summary:
        "Moving beyond linear chains. Build multi-agent machines with cyclic execution graphs, self-correcting loops, external tool delegation and dynamic testing.",
      modules: [
        {
          title: "LangGraph state machines and supervisor patterns",
          summary: "Orchestrated agent workflows",
          outcomes: ["Agent state", "Delegation", "Human-in-the-loop"],
        },
      ],
    },
    {
      weekNumber: 4,
      focus: "PRODUCTION SAAS",
      title: "Production Deployment, Telemetry & Monetization",
      summary:
        "Turning monitored architectures into sustainable business revenue. Wire package applications into microservices, stream telemetry and serve production APIs.",
      modules: [
        {
          title: "Production deployment and telemetry",
          summary: "Deploy and monitor the capstone",
          outcomes: ["Tracing", "Evaluation", "Deployment"],
        },
      ],
    },
  ];
  const visibleWeeks = weeks.length ? weeks : fallbackWeeks;

  return (
    <EducationShell>
      <main className="mx-auto max-w-[1440px] px-4 py-9 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            ✳ Syllabus & repositories • Cohort 04
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            4 Weeks to Production-Grade
            <br />
            <span className="text-indigo-600">AI Engineering</span>
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
            An engineering-first sequence moving rigorously from strict schema
            enforcement to cyclic autonomous agent swarms and commercial
            containerized deployment.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button className="h-9 rounded-lg bg-indigo-700 text-[10px] hover:bg-indigo-800">
              <Download className="mr-2 size-3.5" />
              Download Full 28-Page PDF
            </Button>
            <Button variant="outline" className="h-9 rounded-lg text-[10px]">
              <Code2 className="mr-2 size-3.5" />
              View Code Samples on GitHub{" "}
              <ExternalLink className="ml-1 size-3" />
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 rounded-xl bg-indigo-50 p-4 sm:grid-cols-4 dark:bg-slate-900">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-slate-400">
              Timeline
            </p>
            <p className="mt-1 text-sm font-semibold">4 Weeks</p>
            <p className="text-[9px] text-slate-500">Full-time immersive</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-slate-400">
              Content
            </p>
            <p className="mt-1 text-sm font-semibold">27 Labs</p>
            <p className="text-[9px] text-slate-500">Production code reviews</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-slate-400">
              Production
            </p>
            <p className="mt-1 text-sm font-semibold">3 Capstones</p>
            <p className="text-[9px] text-slate-500">
              Zero-hallucination demos
            </p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-slate-400">
              Completion
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-700">94.8%</p>
            <p className="text-[9px] text-slate-500">Cohort graduation rate</p>
          </div>
        </div>

        <section>
          <SectionTitle
            eyebrow="Curriculum"
            title="Weekly Technical Deep Dives"
            description="Every week pairs foundational theory with live instructor pairing sessions, peer review, project execution, and an isolated engineering laboratory."
          />
          <div className="space-y-4">
            {visibleWeeks.map((week: AnyRecord, i: number) => (
              <Card
                key={week.id || week.weekNumber}
                className="overflow-hidden rounded-xl border-indigo-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <CardContent className="grid gap-5 p-4 md:grid-cols-[1fr_.82fr] md:p-5">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-600 px-2 py-1 text-[8px] font-bold text-white">
                        WEEK {String(week.weekNumber || i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {week.modules?.length || 7} Modules • Production Lab •
                        20+ Hours
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-bold text-emerald-700">
                        {week.focus || "FOUNDATIONAL"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{week.title}</h3>
                    <p className="mt-2 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                      {week.summary}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {(week.modules || [])
                        .slice(0, 4)
                        .map((module: AnyRecord, j: number) => (
                          <div
                            key={module.id || j}
                            className="flex gap-2 text-[9px] leading-4 text-slate-600 dark:text-slate-300"
                          >
                            <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-indigo-500" />
                            <span>{module.title}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-[#111a2e] p-3 font-mono text-[9px] text-emerald-200">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-700 pb-2 text-slate-400">
                      <span>
                        ● ● ● &nbsp;{" "}
                        {[
                          "lab_01.py",
                          "rag_retrieval.py",
                          "agent_graph.py",
                          "deploy.yml",
                        ][i] || "production.py"}
                      </span>
                      <span>Week {i + 1} Capstone</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-5">
                      {week.modules?.[0]?.codeSample ||
                        [
                          "class StructuredData(BaseModel):\\n  entity: str\\n  amount: float\\n\\nresult = validate(payload)",
                          "hybrid_search(query, vector=True,\\n  rerank=True, metadata=filters)",
                          "graph.add_node('researcher',\\n  researcher_agent)\\ngraph.add_edge('reviewer', END)",
                          "services:\\n  api:\\n    build: .\\n    ports: ['8000:8000']",
                        ][i]}
                    </pre>
                    <div className="mt-3 flex justify-between border-t border-slate-700 pt-2 text-[8px]">
                      <span>Production implementation</span>
                      <span className="text-emerald-300">Ready for review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Hands-on benchmark preview"
            title="Structured Extraction vs. Naive Output"
            description="See how Week 01 eliminates downstream system bugs through schema enforcement."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-rose-200 bg-[#111a2e] p-4 text-rose-200">
              <div className="mb-3 flex justify-between text-[9px]">
                <span>× Naive unstructured prompt</span>
                <span>Fail Rate: 24.8%</span>
              </div>
              <pre className="whitespace-pre-wrap text-[9px] leading-5">{`{ "User Input":\n  "Extract vendor, total, and invoice items as JSON."\n}\n→ Output received:\n  "Here is the info you requested:\n   { vendor: 'Acme Corp', total: '$450.00' }\n   Let me know if you need anything else!"`}</pre>
              <p className="mt-3 border-t border-slate-700 pt-2 text-[8px] text-rose-300">
                Validation Error: Invalid JSON payload
              </p>
            </div>
            <div className="rounded-xl border border-emerald-300 bg-[#111a2e] p-4 text-emerald-200">
              <div className="mb-3 flex justify-between text-[9px]">
                <span>✓ Synthetix Instructor Schema Enforcement</span>
                <span>Fail Rate: 0.08%</span>
              </div>
              <pre className="whitespace-pre-wrap text-[9px] leading-5">{`{ "type": "object",\n  "properties": {\n    "vendor": { "type": "string" },\n    "total": { "type": "number" },\n    "currency": { "enum": ["USD"] }\n  },\n  "required": ["vendor", "total"]\n}\n✓ Zero conversion errors, strict typesafe`}</pre>
              <p className="mt-3 border-t border-slate-700 pt-2 text-[8px] text-emerald-300">
                Schema validated • 1.2ms
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Production portfolio"
            title="Portfolio Projects You Will Ship"
            description="No generic tutorial clones. Each fellowship has three production-grade repositories ready for technical due diligence, venture funding, or enterprise deployment."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {(projects.length
              ? projects
              : [
                  {
                    slug: "autonomous-content-engine",
                    projectCode: "PRJ_01 / AGENTS",
                    title: "Autonomous Content Engine",
                    summary:
                      "A self-executing system that researches trending industry news and creates structured narratives.",
                    technologies: ["CrewAI", "Playwright", "FastAPI", "Redis"],
                    version: "v2.4.0",
                  },
                  {
                    slug: "financial-analysis-rag-copilot",
                    projectCode: "PRJ_02 / RAG",
                    title: "Financial Analysis RAG Copilot",
                    summary:
                      "Vector-indexed 10-K document reasoning engine featuring peer-financial-dataset attribution.",
                    technologies: [
                      "Pinecone",
                      "LangChain",
                      "Claude 3.5",
                      "Cohere",
                    ],
                    version: "v1.8.2",
                  },
                  {
                    slug: "omnichannel-voice-triage-agent",
                    projectCode: "PRJ_03 / REALTIME",
                    title: "Omnichannel Voice Triage Agent",
                    summary:
                      "A sub-500ms voice pipeline with Whisper and Deepgram streaming, linked to live workflows.",
                    technologies: ["WebSockets", "Deepgram", "Whisper", "n8n"],
                    version: "v1.1.0",
                  },
                ]
            ).map((project: AnyRecord, i: number) => (
              <Card
                key={project.id || project.slug}
                className="overflow-hidden rounded-xl border-indigo-100 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`relative flex h-32 items-center justify-center overflow-hidden ${["bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800", "bg-gradient-to-br from-slate-900 via-slate-700 to-indigo-900", "bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-800"][i % 3]}`}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <div className="relative rounded-lg border border-white/20 bg-black/30 p-4 font-mono text-[9px] text-emerald-200 shadow-xl">
                    <Code2 className="mb-2 size-5" />
                    {project.projectCode || "PROJECT / AI SYSTEM"}
                    <div className="mt-1 text-white/70">
                      production_pipeline.run()
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-[8px] font-semibold tracking-widest text-indigo-600">
                    {project.projectCode || "CAPSTONE PROJECT"}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-2 min-h-[54px] text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                    {project.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(project.technologies || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded bg-indigo-50 px-2 py-1 text-[8px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href="/education/admissions"
                      className="text-[9px] font-medium text-indigo-600"
                    >
                      Explore specs <ArrowUpRight className="inline size-3" />
                    </Link>
                    <span className="text-[8px] text-slate-400">
                      {project.version || "v1.0.0"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Ecosystem mastery"
            title="The Synthetix Tech Matrix"
            description="You'll bypass disposable wrappers. All tooling taught has survived strict architectural benchmarks in high-volume enterprise deployments."
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {(stack.length
              ? stack
              : [
                  "LangGraph",
                  "OpenAI",
                  "Pinecone",
                  "Claude 3.5",
                  "FastAPI",
                  "Docker",
                  "n8n",
                  "LangSmith",
                ].map((name) => ({ name, category: "Engineering platform" }))
            ).map((item: AnyRecord) => (
              <div
                key={item.id || item.name}
                className="rounded-lg border border-indigo-100 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mx-auto mb-2 grid size-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                  <Layers3 size={15} />
                </div>
                <p className="text-[10px] font-semibold">{item.name}</p>
                <p className="mt-1 text-[8px] text-slate-400">
                  {item.category || "AI Platform"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow>Pedagogical guardrails: daily PR reviews</Eyebrow>
              <h3 className="text-sm font-semibold">
                Every capstone and repository is reviewed by staff engineers.
              </h3>
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                Mandatory GitHub code reviews, architecture notes and documented
                evaluation criteria.
              </p>
            </div>
            <div className="flex -space-x-2">
              <span className="grid size-7 place-items-center rounded-full border-2 border-white bg-indigo-600 text-[8px] text-white">
                ML
              </span>
              <span className="grid size-7 place-items-center rounded-full border-2 border-white bg-emerald-600 text-[8px] text-white">
                DS
              </span>
              <span className="grid size-7 place-items-center rounded-full border-2 border-white bg-violet-600 text-[8px] text-white">
                TS
              </span>
            </div>
          </div>
        </section>
        <section className="mt-8 flex flex-col justify-between gap-4 rounded-xl border border-slate-700 bg-[#202b43] p-6 text-white sm:flex-row sm:items-center">
          <div>
            <Eyebrow>Next step: admissions & seat reservation</Eyebrow>
            <h2 className="text-xl font-semibold">
              Ready to master production AI systems?
            </h2>
            <p className="mt-1 text-[10px] text-slate-300">
              Review tuition options, team sponsorships and secure your
              technical baseline assessment.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white text-[10px] text-slate-900"
            >
              <Link href="/education/admissions">
                View Tuition & Admissions
              </Link>
            </Button>
            <Button className="bg-indigo-600 text-[10px]">
              <Link href="/education/admissions">Apply for Cohort 04</Link>
            </Button>
          </div>
        </section>
      </main>
    </EducationShell>
  );
}

export function AdmissionsPage() {
  const [data, setData] = useState<AnyRecord>({ cohorts: [], tracks: [] });
  const [faqs, setFaqs] = useState<AnyRecord[]>([]);
  const [testimonials, setTestimonials] = useState<AnyRecord[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    background: "",
    experienceLevel: "intermediate",
    motivation: "",
    portfolioUrl: "",
    trackSlug: "fellowship",
  });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([
      getJson<AnyRecord>("/api/education/admissions", {
        cohorts: [],
        tracks: [],
      }),
      getJson<AnyRecord[]>("/api/education/faqs", []),
      getJson<AnyRecord[]>("/api/education/testimonials", []),
    ]).then(([d, f, t]) => {
      setData(d);
      setFaqs(f);
      setTestimonials(t);
    });
  }, []);
  const cohort = data.cohorts?.[0];
  const tracks: AnyRecord[] = data.tracks || [];

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (!cohort?.code)
        throw new Error("No open cohort is currently published.");
      const response = await fetch("/api/education/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cohortCode: cohort.code }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to submit application.");
      setNotice(
        `Application submitted successfully. Reference: ${result.data.id}`,
      );
      setForm({
        fullName: "",
        email: "",
        phone: "",
        background: "",
        experienceLevel: "intermediate",
        motivation: "",
        portfolioUrl: "",
        trackSlug: form.trackSlug,
      });
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const defaultTracks = [
    {
      slug: "fellowship",
      name: "Fellowship Track",
      audience: "Academic & Builder",
      description:
        "Designed for university students, recent bootcamp graduates, and self-directed software developers eager to break into production generative systems.",
      priceCents: 24900,
      features: [
        "4 Live Weekly Build Sprints",
        "Weekly PR Code Reviews",
        "Synthetix AI Architect Credential",
        "Private Discord & Lifetime Repo Access",
        "$150 Compute Credits",
      ],
    },
    {
      slug: "professional",
      name: "Full Professional",
      audience: "Industry Operators",
      description:
        "Engineered for software engineers, product managers, and technical consultants shipping applied autonomous agents and RAG pipelines into production stacks.",
      priceCents: 49900,
      isRecommended: true,
      features: [
        "Everything in Fellowship Track",
        "Two 1-on-1 Architecture & Career Reviews",
        "Commercial Micro-SaaS Boilerplates",
        "Direct Hiring Partner Introductions",
        "Reimbursement & Corporate Kit",
      ],
    },
  ];
  const shownTracks = tracks.length ? tracks : defaultTracks;
  const displayFaqs = faqs.length
    ? faqs
    : [
        {
          question:
            "Do I need a Computer Science degree or deep Python background?",
          answer:
            "A CS degree is not required. Basic programming familiarity is useful; the admissions team can assess your current experience.",
        },
        {
          question: "How much time commitment is required per week?",
          answer:
            "Expect live sessions, project implementation and code reviews throughout each week. Confirm the exact schedule with the current cohort calendar.",
        },
        {
          question: "What if I miss a live cohort session?",
          answer:
            "Catch-up guidance and any session recordings are provided according to the cohort attendance policy.",
        },
        {
          question:
            "Can I get student financial assistance or employer reimbursement?",
          answer:
            "Scholarship and reimbursement eligibility is reviewed individually. Contact admissions for current terms.",
        },
        {
          question: "What are the hardware and API requirements?",
          answer:
            "A modern computer, stable internet connection and access to selected development tools are recommended.",
        },
      ];

  return (
    <EducationShell>
      <main className="mx-auto max-w-[1440px] px-4 py-9 sm:px-6 lg:px-8">
        <section>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            ✳ Transparent Admissions • Cohort 04
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Accessible Investment,
            <br />
            <span className="text-indigo-600">Guaranteed ROI.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            We believe world-class technical education shouldn't cost $15,000
            bootcamp tuition. Review the available tuition tracks, admission
            stages and cohort policies before applying.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[9px]">
            <span className="rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              ◎ Placement & Promotion Rate
            </span>
            <span className="rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              ⚡ Live Production Deployment Sprints
            </span>
            <span className="rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              ♧ 1:8 Mentor-to-Fellow Ratio
            </span>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-slate-400">
                Admissions schedule
              </p>
              <h2 className="mt-1 text-sm font-semibold">
                {cohort?.name || "Cohort 04 Intake Deadlines"}
              </h2>
            </div>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[8px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {cohort?.status || "Admissions open"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { stage: "STAGE 01", name: "Early Priority", note: "Completed" },
              {
                stage: "STAGE 02 (CURRENT)",
                name: "Regular Admissions",
                note: cohort?.applicationDeadline
                  ? `Deadline ${new Date(cohort.applicationDeadline).toLocaleDateString()}`
                  : "Reviewing applications",
              },
              {
                stage: "STAGE 03",
                name: "Technical Onboarding",
                note: cohort?.startDate
                  ? `Starts ${new Date(`${cohort.startDate}T00:00:00`).toLocaleDateString()}`
                  : "Upon acceptance",
              },
              {
                stage: "STAGE 04",
                name: "Sprint 01 Launch",
                note: "Cohort orientation",
              },
            ].map((item, i) => (
              <div
                key={item.stage}
                className={`border-l-2 pl-3 ${i === 1 ? "border-indigo-500" : "border-indigo-100 dark:border-slate-700"}`}
              >
                <p
                  className={`text-[8px] font-semibold tracking-widest ${i === 1 ? "text-indigo-600" : "text-slate-400"}`}
                >
                  {item.stage}
                </p>
                <p className="mt-1 text-xs font-medium">{item.name}</p>
                <p className="mt-1 text-[9px] text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Tuition plans • Cohort 04</Eyebrow>
              <h2 className="text-2xl font-semibold">
                Choose your fellowship track
              </h2>
            </div>
            <span className="hidden rounded-full bg-indigo-100 px-3 py-1 text-[9px] text-indigo-700 sm:inline-flex dark:bg-indigo-950 dark:text-indigo-300">
              Scholarships available
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {shownTracks.map((track: AnyRecord, i: number) => (
              <Card
                key={track.id || track.slug}
                className={`relative rounded-xl bg-white dark:bg-slate-900 ${track.isRecommended ? "border-indigo-500 shadow-lg" : "border-indigo-100 dark:border-slate-800"}`}
              >
                {track.isRecommended && (
                  <span className="absolute -top-3 right-5 rounded-full bg-indigo-700 px-3 py-1 text-[8px] font-bold text-white">
                    RECOMMENDED
                  </span>
                )}
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-indigo-600">
                      TIER 0{i + 1} • {track.audience || "LEARNING TRACK"}
                    </p>
                    {i === 0 && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[8px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Scholarships available
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{track.name}</h3>
                  <p className="mt-2 min-h-[50px] text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                    {track.description}
                  </p>
                  <div className="mt-4 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/50">
                    <p className="text-3xl font-semibold">
                      ${(Number(track.priceCents || 0) / 100).toFixed(0)}
                      <span className="ml-2 text-[10px] font-normal text-slate-500">
                        one-time payment
                      </span>
                    </p>
                    <p className="mt-1 text-[9px] text-slate-500">
                      {track.billingLabel || "Tuition for the four-week cohort"}
                    </p>
                  </div>
                  <p className="mt-4 text-[8px] font-semibold uppercase tracking-widest text-slate-500">
                    What's included
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {(track.features || []).map((feature: string) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-[10px] leading-4"
                      >
                        <CheckCircle2 className="size-3.5 shrink-0 text-indigo-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => {
                      setForm({ ...form, trackSlug: track.slug });
                      document
                        .getElementById("application")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`mt-6 h-10 w-full rounded-lg text-[10px] ${track.isRecommended ? "bg-indigo-700 hover:bg-indigo-800" : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-slate-800 dark:text-indigo-200"}`}
                  >
                    {track.isRecommended
                      ? "Enroll Professional Track"
                      : "Apply with Student ID"}{" "}
                    <ArrowRight className="ml-2 size-3.5" />
                  </Button>
                  <p className="mt-2 text-center text-[8px] text-slate-400">
                    Application review required before enrollment
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-indigo-100/80 p-6 sm:p-8 dark:bg-indigo-950/50">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 dark:bg-slate-900">
                <ShieldCheck size={25} />
              </div>
              <div>
                <Eyebrow>
                  Unconditional peace of mind • review official terms
                </Eyebrow>
                <h2 className="text-xl font-semibold">
                  The Synthetix Week 1 Guarantee
                </h2>
                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-600 dark:text-slate-300">
                  Review the published refund policy and payment terms before
                  enrolling. Any refund eligibility is subject to the official
                  terms agreed at checkout.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 text-[9px]">
              <span className="rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                ✓ Refund policy published at checkout
              </span>
              <span className="rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                ♧ Secure payment processing
              </span>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Fellow feedback</Eyebrow>
              <h2 className="text-2xl font-semibold">
                Where our fellows work & build
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">
              {testimonials.length
                ? `${testimonials.length} published testimonials`
                : "Alumni stories will appear here when approved"}
            </span>
          </div>
          {testimonials.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {testimonials.map((t: AnyRecord) => (
                <Card
                  key={t.id}
                  className="rounded-xl border-indigo-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <CardContent className="p-5">
                    <p className="text-amber-500">
                      ★★★★★{" "}
                      <span className="text-[9px] text-slate-500">
                        {t.rating}/5
                      </span>
                    </p>
                    <p className="mt-3 text-[11px] leading-5 text-slate-600 dark:text-slate-300">
                      “{t.quote}”
                    </p>
                    <div className="mt-5 border-t border-indigo-100 pt-3 dark:border-slate-800">
                      <p className="text-xs font-semibold">{t.displayName}</p>
                      <p className="text-[9px] text-slate-500">
                        {t.roleLabel} · {t.cohortLabel}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-indigo-200 p-6 text-center text-xs text-slate-500 dark:border-slate-700">
              Approved alumni testimonials will be displayed here.
            </div>
          )}
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="text-center">
            <Eyebrow>Frequently asked questions</Eyebrow>
            <h2 className="text-2xl font-semibold">
              Everything You Need to Know
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Clear answers on prerequisites, commitment, reimbursement
              policies, and API environments.
            </p>
          </div>
          <div className="mt-6 space-y-2">
            {displayFaqs.map((faq: AnyRecord, i: number) => (
              <details
                key={faq.id || faq.question}
                className="group rounded-lg border border-indigo-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-medium">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-indigo-600 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="application"
          className="mt-12 scroll-mt-24 rounded-xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-8 md:grid-cols-[.85fr_1.15fr]">
            <div>
              <Eyebrow>Secure your cohort 04 seat</Eyebrow>
              <h2 className="text-2xl font-semibold">
                Become part of the AI engineering teams are hiring.
              </h2>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Submit your application for review. The admissions team will
                follow up using the contact details you provide.
              </p>
              <p className="mt-5 rounded-lg bg-rose-50 p-3 text-[9px] text-rose-700 dark:bg-rose-950 dark:text-rose-200">
                ● {cohort?.seatsRemaining ?? "Limited"} seats remaining in the
                published cohort (subject to confirmation).
              </p>
            </div>
            <form
              onSubmit={submitApplication}
              className="grid gap-3 sm:grid-cols-2"
            >
              <div>
                <Label className="text-[9px]">Full name *</Label>
                <Input
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-[9px]">Email *</Label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-[9px]">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-[9px]">Background</Label>
                <Input
                  value={form.background}
                  onChange={(e) =>
                    setForm({ ...form, background: e.target.value })
                  }
                  placeholder="Student / Developer / Researcher"
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-[9px]">Experience level</Label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) =>
                    setForm({ ...form, experienceLevel: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label className="text-[9px]">Tuition track</Label>
                <select
                  value={form.trackSlug}
                  onChange={(e) =>
                    setForm({ ...form, trackSlug: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs"
                >
                  {shownTracks.map((t: AnyRecord) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-[9px]">GitHub / Portfolio URL</Label>
                <Input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) =>
                    setForm({ ...form, portfolioUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-[9px]">Why do you want to join?</Label>
                <textarea
                  value={form.motivation}
                  onChange={(e) =>
                    setForm({ ...form, motivation: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us about your goals..."
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  disabled={busy || !cohort}
                  className="h-10 w-full bg-indigo-700 text-xs hover:bg-indigo-800"
                >
                  {busy
                    ? "Submitting application..."
                    : "Submit Application for Verification"}{" "}
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
                {notice && (
                  <p
                    role="status"
                    className="mt-3 break-all text-xs text-indigo-700 dark:text-indigo-300"
                  >
                    {notice}
                  </p>
                )}
                <p className="mt-2 text-center text-[8px] text-slate-400">
                  Submitting this form does not guarantee admission or charge a
                  payment.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </EducationShell>
  );
}
