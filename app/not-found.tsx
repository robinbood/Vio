import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VioLogo } from "@/components/brand/vio-logo";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <VioLogo className="text-4xl" withWordmark />
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="vio">
          <Link href="/boards">Go to boards</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
