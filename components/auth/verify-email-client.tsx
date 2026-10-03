"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { safeRedirect } from "@/lib/utils/redirect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type State =
  | { phase: "verifying" }
  | { phase: "success" }
  | { phase: "error"; reason: "missing" | "invalid" };

/**
 * Verification has to run through the browser client, not `auth.api` on the
 * server: better-auth's `autoSignInAfterVerification` puts the session cookie on
 * the response of whichever API call performs the verification, and a Server
 * Component cannot forward response headers to the browser. Calling
 * `auth.api.verifyEmail` from the server therefore marked the address verified
 * but left the user with no session — they were bounced straight back to
 * /login, with no way to tell that anything had succeeded.
 */
export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackURL = safeRedirect(
    searchParams.get("callbackURL") ?? "/boards"
  );

  // Derived during render rather than set in an effect: the token is already
  // known here, so seeding the state from it avoids a wasted render pass (and
  // a cascading-render warning).
  const [state, setState] = useState<State>(() =>
    token ? { phase: "verifying" } : { phase: "error", reason: "missing" }
  );
  const started = useRef(false);

  useEffect(() => {
    // `useSearchParams` can settle after the first render, and React 19 runs
    // effects twice in StrictMode — without this guard the verification token
    // would be spent on the first pass and reported as invalid on the second.
    if (!token || started.current) return;
    started.current = true;

    void (async () => {
      // Deliberately NOT forwarding callbackURL to better-auth. Its
      // /verify-email handler turns *both* outcomes into a 302 when one is
      // present — on success it redirects to it, on failure it redirects to it
      // with `?error=…`. The client fetch would follow that redirect and get
      // an HTML page back, so success and failure become indistinguishable.
      // Without it the handler returns JSON on success and throws a typed
      // APIError on failure, and still sets the session cookie.
      const { error } = await authClient.verifyEmail({ query: { token } });
      if (error) {
        setState({ phase: "error", reason: "invalid" });
        return;
      }
      setState({ phase: "success" });
      // A session now exists, so send the user where they were headed instead
      // of making them log in again.
      router.replace(callbackURL);
    })();
  }, [token, callbackURL, router]);

  if (state.phase === "verifying") {
    return (
      <div className="space-y-6 text-center" role="status" aria-live="polite">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Verifying your email
          </h1>
          <p className="text-sm text-muted-foreground">One moment…</p>
        </div>
      </div>
    );
  }

  if (state.phase === "success") {
    return (
      <div className="space-y-6 text-center" role="status" aria-live="polite">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Email verified
          </h1>
          <p className="text-sm text-muted-foreground">Taking you there…</p>
        </div>
      </div>
    );
  }

  const missing = state.reason === "missing";
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {missing ? "This link is missing a token" : "This link is invalid or has expired"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {missing
              ? "Open the most recent verification email, or request a new one."
              : "Verification links expire after an hour. Request a new one and try again."}
          </p>
        </div>
      </div>
      <Button asChild variant="vio" className="w-full" size="lg">
        <Link href="/login">Back to log in</Link>
      </Button>
    </div>
  );
}
