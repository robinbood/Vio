import { z } from "zod";

export const boardVisibilitySchema = z.enum(["private", "workspace", "public"]);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

export const createBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Board name is required")
    .max(64, "Board name must be at most 64 characters"),
  description: optionalText(256),
  visibility: boardVisibilitySchema.default("private"),
  workspaceId: optionalText(64),
  defaultLists: z
    .union([z.boolean(), z.literal("on"), z.literal("")])
    .default(true)
    .transform((value) => value === true || value === "on"),
});

export type CreateBoardInput = z.input<typeof createBoardSchema>;
export type CreateBoardValues = z.output<typeof createBoardSchema>;

export type CreateBoardState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateBoardInput, string>>;
};

/** Parse a submitted board form into the validated payload. */
export function parseCreateBoardForm(
  formData: FormData
): { values: CreateBoardValues; state: null } | { values: null; state: CreateBoardState } {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    visibility: formData.get("visibility")?.toString() ?? "private",
    workspaceId: formData.get("workspaceId")?.toString() ?? "",
    defaultLists: formData.get("defaultLists") === "on",
  };

  const parsed = createBoardSchema.safeParse(raw);
  if (parsed.success) return { values: parsed.data, state: null };

  const fieldErrors: CreateBoardState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof CreateBoardInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    values: null,
    state: { error: "Please correct the highlighted fields.", fieldErrors },
  };
}
