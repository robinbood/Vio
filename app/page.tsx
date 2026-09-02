import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  // Better Auth cookie names are prefixed (BRAND.cookiePrefix) for both the
  // session and the session_token variants.
  return /(^|;\s*)(?:vio|trello)\.session=|(^|;\s*)(?:vio|trello)\.session_token=/.test(
    cookieHeader
  );
}

export default async function HomePage() {
  const cookieHeader = (await headers()).get("cookie");
  if (hasSessionCookie(cookieHeader)) {
    // Don't hit the DB on the public landing; let /boards validate the session.
    redirect("/boards");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <VioLogo className="h-7 w-7 text-vio" />
          {BRAND.name}
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="vio">
            <Link href="/signup">Sign up</Link>
          </Button>
        </nav>
      </header>
      <main className="container flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {BRAND.name} helps teams move work forward.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Collaborate, manage projects, and reach new productivity peaks. From
          high rises to the home office, the way your team works is unique —
          accomplish it all with {BRAND.name}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="vio">
            <Link href="/signup">Sign up — it&apos;s free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </main>
      <footer className="container py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {BRAND.copyright}
      </footer>
    </div>
  );
}
