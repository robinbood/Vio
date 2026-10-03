"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { checkUsernameAvailability } from "@/app/actions/account";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  accountLocales,
  accountSettingsSchema,
  type AccountSettingsState,
} from "@/lib/validation/account";

type AccountSettingsFormProps = {
  email: string;
  fullName: string;
  username: string;
  initials: string | null;
  bio: string | null;
  locale: string | null;
  timezone: string | null;
  avatarColor: string | null;
};

const localeNames: Record<(typeof accountLocales)[number], string> = {
  "en-US": "English (US)",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  "pt-BR": "Português (Brasil)",
  ru: "Русский",
  tr: "Türkçe",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export function AccountSettingsForm({
  email,
  fullName,
  username,
  initials,
  bio,
  locale,
  timezone,
  avatarColor,
}: AccountSettingsFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] =
    useState<AccountSettingsState["fieldErrors"]>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setFieldErrors(undefined);

    const parsed = accountSettingsSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget).entries())
    );
    if (!parsed.success) {
      const nextErrors: AccountSettingsState["fieldErrors"] = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof nextErrors | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setError("Please correct the highlighted fields.");
      setFieldErrors(nextErrors);
      return;
    }

    setPending(true);
    try {
      const isAvailable = await checkUsernameAvailability(parsed.data.username);
      if (!isAvailable) {
        setError("Please correct the highlighted fields.");
        setFieldErrors({ username: "That username is already in use." });
        return;
      }

      const { error: updateError } = await authClient.updateUser({
        name: parsed.data.fullName,
        username: parsed.data.username,
        fullName: parsed.data.fullName,
        initials: parsed.data.initials ?? "",
        bio: parsed.data.bio ?? "",
        locale: parsed.data.locale,
        timezone: parsed.data.timezone,
        avatarColor: parsed.data.avatarColor,
      });
      if (updateError) {
        setError(
          "We couldn't save your account settings. Check whether the username is already in use."
        );
        return;
      }

      setSuccess("Your account settings were saved.");
      router.refresh();
    } catch (updateError) {
      console.error("[account] settings update failed:", updateError);
      setError("We couldn't save your account settings. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h2 className="font-semibold">Profile and visibility</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your name and profile details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full name
            </label>
            <Input id="fullName" name="fullName" defaultValue={fullName} required />
            {fieldErrors?.fullName && (
              <p className="text-sm text-destructive">{fieldErrors.fullName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              defaultValue={username}
              autoComplete="username"
              required
            />
            <p className="text-xs text-muted-foreground">
              Your username is used in your profile URL.
            </p>
            {fieldErrors?.username && (
              <p className="text-sm text-destructive">{fieldErrors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="initials" className="text-sm font-medium">
              Initials
            </label>
            <Input
              id="initials"
              name="initials"
              defaultValue={initials ?? ""}
              maxLength={5}
            />
            {fieldErrors?.initials && (
              <p className="text-sm text-destructive">{fieldErrors.initials}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="avatarColor" className="text-sm font-medium">
              Avatar color
            </label>
            <Input
              id="avatarColor"
              name="avatarColor"
              type="color"
              defaultValue={avatarColor ?? "#6d28d9"}
              className="h-10 p-1"
            />
            {fieldErrors?.avatarColor && (
              <p className="text-sm text-destructive">{fieldErrors.avatarColor}</p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea id="bio" name="bio" defaultValue={bio ?? ""} maxLength={160} />
            {fieldErrors?.bio && (
              <p className="text-sm text-destructive">{fieldErrors.bio}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h2 className="font-semibold">Account details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Email address changes require verification.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input id="email" value={email} readOnly aria-readonly="true" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="locale" className="text-sm font-medium">
              Language
            </label>
            <select
              id="locale"
              name="locale"
              defaultValue={locale ?? "en-US"}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {accountLocales.map((value) => (
                <option key={value} value={value}>
                  {localeNames[value]}
                </option>
              ))}
            </select>
            {fieldErrors?.locale && (
              <p className="text-sm text-destructive">{fieldErrors.locale}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium">
              Time zone
            </label>
            <Input
              id="timezone"
              name="timezone"
              defaultValue={timezone ?? "UTC"}
              placeholder="America/New_York"
              required
            />
            {fieldErrors?.timezone && (
              <p className="text-sm text-destructive">{fieldErrors.timezone}</p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-emerald-700">
          {success}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
