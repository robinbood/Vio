"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Provider = "google" | "microsoft" | "apple" | "slack";

const PROVIDERS: { id: Provider; label: string; src: string }[] = [
  {
    id: "google",
    label: "Google",
    src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    id: "apple",
    label: "Apple",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: "slack",
    label: "Slack",
    src: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
  },
];

export function SsoButtons() {
  const [pending, setPending] = useState<Provider | null>(null);

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
        {PROVIDERS.map((p) => (
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
