"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function TwoFactorForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your authenticator app");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
        fetchOptions: { onSuccess: () => router.push("/boards") },
      });
      if (error) {
        toast.error("Verification failed", { description: error.message });
        return;
      }
      toast.success("Verified");
      router.push("/boards");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Two-factor authentication
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="totp">Verification code</Label>
          <Input
            id="totp"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123 456"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            className="text-center text-lg tracking-[0.4em]"
          />
        </div>
        <Button
          type="submit"
            variant="vio"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting && <Loader2 className="animate-spin" />}
          Verify
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
