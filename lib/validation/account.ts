import { z } from "zod";

export const accountLocales = [
  "en-US",
  "de",
  "es",
  "fr",
  "it",
  "nl",
  "pl",
  "pt-BR",
  "ru",
  "tr",
  "ja",
  "ko",
  "zh-CN",
  "zh-TW",
] as const;

export const accountSettingsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Username must be at least 2 characters")
    .max(39, "Username must be at most 39 characters")
    .regex(
      /^[a-z0-9][a-z0-9_-]*$/,
      "Use letters, numbers, hyphens, or underscores"
    ),
  initials: z
    .string()
    .trim()
    .max(5, "Initials must be at most 5 characters")
    .optional()
    .transform((value) => value || null),
  bio: z
    .string()
    .trim()
    .max(160, "Bio must be at most 160 characters")
    .optional()
    .transform((value) => value || null),
  locale: z.enum(accountLocales),
  timezone: z
    .string()
    .trim()
    .min(1, "Choose a time zone")
    .max(64, "Time zone must be at most 64 characters")
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid time zone"),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid color"),
});

export type AccountSettingsInput = z.input<typeof accountSettingsSchema>;
export type AccountSettingsValues = z.output<typeof accountSettingsSchema>;

export type AccountSettingsState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<keyof AccountSettingsInput, string>>;
};
