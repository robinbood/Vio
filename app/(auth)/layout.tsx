import Link from "next/link";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-vio p-12 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.3), transparent 50%)",
          }}
        />
        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight"
          >
            <VioLogo className="h-8 w-8" />
            {BRAND.name}
          </Link>
        </div>
        <div className="relative space-y-6">
          <blockquote className="text-3xl font-semibold leading-tight">
            Make the impossible possible, together.
          </blockquote>
          <p className="max-w-md text-base text-white/80">
            Vio is the easy, free, and flexible way to organize your projects,
            tasks, and team — all in one place.
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
