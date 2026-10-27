import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { VioLogo } from "@/components/brand/vio-logo";

export default async function NotFound() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <VioLogo className="text-4xl" withWordmark />
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        {user ? (
          <Button asChild variant="vio">
            <Link href="/boards">Go to boards</Link>
          </Button>
        ) : (
          <Button asChild variant="vio">
            <Link href="/">Home</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
