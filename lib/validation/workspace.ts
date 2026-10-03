import { z } from "zod";

export const workspaceVisibilitySchema = z.enum(["private", "public"]);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

/**
 * Single source of truth for the create-workspace payload. The client form and
 * the server action both parse with this — the action because `maxLength` on an
 * `<input>` is a UI hint, not enforcement.
 */
export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(64, "Workspace name must be at most 64 characters"),
  displayName: optionalText(64),
  description: optionalText(256),
  visibility: workspaceVisibilitySchema.default("private"),
});

export const updateWorkspaceSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(64, "Workspace name must be at most 64 characters"),
  description: optionalText(256),
  website: z
    .string()
    .trim()
    .max(256, "Website must be at most 256 characters")
    .optional()
    .transform((value) => (value ? value : null))
    .refine((value) => {
      if (!value) return true;
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, "Enter a valid website URL"),
  visibility: workspaceVisibilitySchema,
});

export type CreateWorkspaceInput = z.input<typeof createWorkspaceSchema>;
export type CreateWorkspaceValues = z.output<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.input<typeof updateWorkspaceSchema>;
export type UpdateWorkspaceValues = z.output<typeof updateWorkspaceSchema>;

export type CreateWorkspaceState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateWorkspaceInput, string>>;
};

export type UpdateWorkspaceState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<keyof UpdateWorkspaceInput, string>>;
};

/** Parse a submitted form into the validated payload. */
export function parseCreateWorkspaceForm(
  formData: FormData
): { values: CreateWorkspaceValues; state: null } | { values: null; state: CreateWorkspaceState } {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    displayName: formData.get("displayName")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    visibility: formData.get("visibility")?.toString() ?? "private",
  };

  const parsed = createWorkspaceSchema.safeParse(raw);
  if (parsed.success) return { values: parsed.data, state: null };

  const fieldErrors: CreateWorkspaceState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof CreateWorkspaceInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    values: null,
    state: {
      error: "Please correct the highlighted fields.",
      fieldErrors,
    },
  };
}

export function parseUpdateWorkspaceForm(
  formData: FormData
): { values: UpdateWorkspaceValues; state: null } | { values: null; state: UpdateWorkspaceState } {
  const parsed = updateWorkspaceSchema.safeParse({
    displayName: formData.get("displayName")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    visibility: formData.get("visibility")?.toString() ?? "private",
  });
  if (parsed.success) return { values: parsed.data, state: null };

  const fieldErrors: UpdateWorkspaceState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof UpdateWorkspaceInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    values: null,
    state: {
      error: "Please correct the highlighted fields.",
      fieldErrors,
    },
  };
}
