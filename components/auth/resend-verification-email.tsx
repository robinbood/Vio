"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * Re-issues the verification email.
 *
 * Delivery runs as a background task after sign-up, so a provider outage fails
 * *after* the account is created and the response is still 200. Without this
 * screen an account whose email bounced is permanently stuck: the user cannot
 * verify, and the app never told them the send failed.
 */
export function ResendVerificationEmail({ email }: { email?: string }) {
  const [value, setValue] = useState(email ?? "");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!value) return;

    setPending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: value,
        callbackURL: "/boards",
      });
      if (error) {
        toast.error("Couldn't send the email", {
          description: error.message ?? "Please try again.",
        });
        return;
      }
      setSent(true);
      toast.success("Verification email sent", {
        description: `Check ${value} for a new link.`,
      });
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          If an account exists for <span className="font-medium">{value}</span>,
          a fresh verification link is on its way. The link expires in an hour.
        </p>
        <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
          Send to a different address
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resend-email">Email address</Label>
        <Input
          id="resend-email"
          type="email"
          autoComplete="email"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Resend verification email"}
      </Button>
    </form>
  );
}
