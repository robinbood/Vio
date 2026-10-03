"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResendVerificationEmail } from "@/components/auth/resend-verification-email";
import { toast } from "sonner";

/**
 * Post-sign-up state. Verification is mandatory, so there is no session yet and
 * nowhere to navigate to — but the send itself is a background task, so success
 * is not proof that a message was delivered. The resend form is what keeps this
 * from being a dead end.
 */
export function CheckEmail({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [showResend, setShowResend] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary lg:mx-0">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to <span className="font-medium text-foreground">{email}</span>.
          Follow it to activate your account, then log in.
        </p>
      </div>

      <Button asChild variant="vio" className="w-full" size="lg">
        <Link href="/login">Back to log in</Link>
      </Button>

      <div className="border-t pt-4">
        {showResend ? (
          <>
            <ResendVerificationEmail email={email} />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowResend(false)}
            >
              Hide
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t get it? Email can also fail to send, and links expire
              after an hour.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowResend(true)}
            >
              Resend verification email
            </Button>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          toast("Change the address by signing up again.");
          onBack();
        }}
      >
        Use a different email address
      </Button>
    </div>
  );
}
