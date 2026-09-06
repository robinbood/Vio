"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Provider = "google" | "microsoft" | "apple" | "slack";

const PROVIDERS: { id: Provider; label: string; src: string; envKey: string }[] = [
  {
    id: "google",
    label: "Google",
    src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
    envKey: "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    envKey: "NEXT_PUBLIC_MICROSOFT_CLIENT_ID",
  },
  {
    id: "apple",
    label: "Apple",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    envKey: "NEXT_PUBLIC_APPLE_CLIENT_ID",
  },
  {
    id: "slack",
    label: "Slack",
    src: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
    envKey: "NEXT_PUBLIC_SLACK_CLIENT_ID",
  },
];

const enabledProviders = PROVIDERS.filter((p) => typeof process !== "undefined" && !!process.env[p.envKey]);

export function SsoButtons() {
  const [pending, setPending] = useState<Provider | null>(null);

  if (enabledProviders.length === 0) return null;

  async function signInWith(provider: Provider) {
    setPending(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/boards",
      });
    } catch (err) {
      toast.error("Could not sign in", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {enabledProviders.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="outline"
            disabled={pending !== null}
            onClick={() => signInWith(p.id)}
            className="w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" className="h-4 w-4" />
            <span>{pending === p.id ? "Connecting…" : p.label}</span>
          </Button>
        ))}
      </div>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
      </div>
    </div>
  );
}
