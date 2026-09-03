import Link from "next/link";
import { Suspense } from "react";
import {
  CheckCircle2,
  Layers,
  Sparkles,
  Users,
  Zap,
  KanbanSquare,
  Workflow,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND, BRAND_GRADIENT, BRAND_GRADIENT_TEXT } from "@/lib/brand";
import { KanbanPreview } from "@/components/marketing/kanban-preview";

// Marketing landing page. Everything below the root layout is owned by
// this page; the `(marketing)` route group is a thin pass-through.
export const metadata = {
  title: `${BRAND.name} — Boards, lists, and cards for teams that ship`,
  description: BRAND.description,
};

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Boards that fit how you work",
    body: "Lists, cards, and labels in a kanban your team will actually use. Drag, reorder, archive — it just works.",
  },
  {
    icon: Workflow,
    title: "Automate the busywork",
    body: "Set up rules once. When a card moves to Done, archive it. When due in 24h, ping the assignee. Done.",
  },
  {
    icon: MessagesSquare,
    title: "Conversations in context",
    body: "Comment, react, and mention teammates right on the card. No more \"which doc was that in?\"",
  },
];

const PROOFS = [
  { value: "50k+", label: "teams shipping every week" },
  { value: "12M+", label: "cards moved today" },
  { value: "99.99%", label: "uptime this quarter" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <ProofStrip />
        <FeatureGrid />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ----------------------------- Site header ---------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${BRAND.name} home`}
          className="text-2xl"
        >
          <VioLogo className="text-2xl" withWordmark />
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="#features">Features</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="vio" size="sm">
            <Link href="/signup">Sign up free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

/* --------------------------------- Hero -------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Symmetric decorative backdrop. Equal left/right blobs, equal
          top/bottom placement — keeps the visual weight balanced. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-12%] h-[480px] w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, #8b5cf6 0%, #ec4899 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-1/2 h-[360px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, #6366f1 0%, #22d3ee 50%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="col-span-1 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            New · Automations are now in beta
          </span>

          <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            The boards workspace
            <br className="hidden sm:block" /> your team will{" "}
            <span className={BRAND_GRADIENT_TEXT}>actually</span> use.
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            {BRAND.name} is the easy, flexible, and free way to plan projects,
            track work, and ship together — from the first idea to the final
            launch.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="vio" className="h-12 px-6 text-base">
              <Link href="/signup">Get started — it&apos;s free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <Link href="/login">
                <Users className="h-4 w-4" />
                I already have an account
              </Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              "No credit card required",
              "Unlimited boards on the free plan",
              "SSO & advanced security",
            ].map((line) => (
              <li key={line} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview streams in — falls back to a sized skeleton so the
            layout never reflows. */}
        <div className="col-span-1 flex justify-center">
          <div className="w-full max-w-5xl">
            <Suspense fallback={<KanbanPreviewSkeleton />}>
              <KanbanPreview />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

function KanbanPreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-2xl shadow-violet-500/10">
      <div className="h-9 border-b bg-muted/40" />
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl bg-muted/30 ring-1 ring-border/60"
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Proofs ------------------------------- */

function ProofStrip() {
  return (
    <section
      aria-label="Proof"
      className="border-y border-border/60 bg-muted/20"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-border/60 px-4 sm:px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
        {PROOFS.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-1 px-6 py-8 text-center"
          >
            <div
              className={`text-4xl font-semibold tracking-tight sm:text-5xl ${BRAND_GRADIENT_TEXT}`}
            >
              {p.value}
            </div>
            <div className="text-sm text-muted-foreground">{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Features ------------------------------ */

function FeatureGrid() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          <Zap className="h-3.5 w-3.5" />
          Built for shipping
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need, nothing you don&apos;t.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {BRAND.name} is opinionated where it matters, flexible where it
          counts. Move at the speed of trust.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <div
              aria-hidden
              className={`absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60 ${BRAND_GRADIENT}`}
            />
            <div
              className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow ${BRAND_GRADIENT}`}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Final CTA ----------------------------- */

function FinalCta() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div
        className={`relative overflow-hidden rounded-3xl ${BRAND_GRADIENT} p-10 text-center text-white shadow-2xl shadow-violet-500/30 sm:p-16`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.3), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <Layers className="mx-auto mb-5 h-8 w-8" />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to move work forward?
          </h2>
          <p className="mt-3 text-white/85">
            Spin up a board in under a minute. Invite your team. See what you
            can ship this week.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-6 text-base text-violet-700 hover:bg-white/90"
            >
              <Link href="/signup">Create a free account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-6 text-base text-white hover:bg-white/10"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Footer -------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <VioLogo className="text-base" />
          <span>
            &copy; {new Date().getFullYear()} {BRAND.copyright}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
