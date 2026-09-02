import Link from "next/link";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        {/* Animated brand gradient backdrop */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #ec4899 0%, #8b5cf6 45%, #6366f1 80%, #4338ca 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.3), transparent 40%), radial-gradient(circle at 85% 70%, rgba(34,211,238,0.35), transparent 50%)",
          }}
        />
        {/* Decorative grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative">
          <Link
            href="/"
            className="text-2xl"
            aria-label={`${BRAND.name} home`}
          >
            <VioLogo className="text-2xl" withWordmark />
          </Link>
        </div>
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
            New · Automations beta
          </span>
          <blockquote className="text-3xl font-semibold leading-tight">
            Make the impossible possible, together.
          </blockquote>
          <p className="max-w-md text-base text-white/85">
            {BRAND.name} is the easy, free, and flexible way to organize your
            projects, tasks, and team — all in one place.
          </p>
        </div>
        <div className="relative text-sm text-white/70">
          &copy; {new Date().getFullYear()} {BRAND.copyright}
        </div>
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
