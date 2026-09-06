import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Eye,
  Lock,
  Share2,
  Trash2,
  Mail,
  Server,
  Settings,
} from "lucide-react";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND, BRAND_GRADIENT_TEXT, BRAND_COLORS, BRAND_GRADIENT } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${BRAND.name} privacy policy — how we collect, use, and protect your data.`,
};

const SECTIONS = [
  {
    title: "Overview",
    body: `${BRAND.name} is built to help teams organize work. This policy explains what we collect, why we collect it, and how we keep it safe.`,
    icon: ShieldCheck,
  },
  {
    title: "Information we collect",
    body: "Account details such as name, email, and profile information. Board, list, and card content created within Vio. Usage data such as pages visited, features used, and device information.",
    icon: Eye,
  },
  {
    title: "How we use information",
    body: "Provide and improve the Vio service. Personalize your experience and maintain account security. Send important product and account communications when necessary.",
    icon: Settings,
  },
  {
    title: "Data sharing",
    body: `We do not sell your personal data. We may share data with service providers who help operate ${BRAND.name}, or when required by law.`,
    icon: Share2,
  },
  {
    title: "Data retention",
    body: "We retain your data while your account is active. When you delete your account, we delete or anonymize personal data unless we are required to retain it for legal reasons.",
    icon: Trash2,
  },
  {
    title: "Security",
    body: "We use industry-standard controls to protect data in transit and at rest. You can further protect your account by enabling two-factor authentication.",
    icon: Lock,
  },
  {
    title: "Your choices",
    body: "You can update or delete account information from account settings. You can opt out of non-essential communications. You can request account deletion by contacting support.",
    icon: Settings,
  },
  {
    title: "Contact",
    body: `If you have questions about this privacy policy, reach out to support@${BRAND.domain}.`,
    icon: Mail,
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label={`${BRAND.name} home`} className="text-2xl">
            <VioLogo className="text-2xl" withWordmark />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-md bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* Hero banner */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div
              className="absolute left-1/2 top-[-18%] h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, #8b5cf6 0%, #ec4899 45%, transparent 75%)",
              }}
            />
            <div
              className="absolute bottom-[-24%] left-1/2 h-[360px] w-[860px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, #6366f1 0%, #22d3ee 50%, transparent 75%)",
              }}
            />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
                Transparency
              </span>
              <h1
                className={`mt-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl ${BRAND_GRADIENT_TEXT}`}
              >
                Your privacy matters
              </h1>
              <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
                We believe clear, honest policies build better products. Here is
                exactly how {BRAND.name} handles your data.
              </p>
            </div>
          </div>
        </section>

        {/* Policy grid */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {SECTIONS.map(({ title, body, icon: Icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div
                  aria-hidden
                  className={`absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60 ${BRAND_GRADIENT}`}
                />
                <div
                  className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow ${BRAND_GRADIENT}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/40 px-6 py-14 sm:px-10 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div
                className="absolute right-0 top-[-30%] h-[360px] w-[700px] translate-x-1/4 rounded-full opacity-25 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, #a78bfa 0%, #ec4899 50%, transparent 75%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Still have questions?
              </h2>
              <p className="mt-3 text-muted-foreground">
                We are happy to help. Reach out and we will get back to you as
                soon as possible.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" variant="vio" className="h-12 px-6 text-base">
                  <Link href="/">Back to home</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  <Link href="/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <VioLogo className="text-base" />
            <span>
              &copy; {new Date().getFullYear()} {BRAND.copyright}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
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
    </div>
  );
}
