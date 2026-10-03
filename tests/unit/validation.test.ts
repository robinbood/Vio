import { describe, expect, it } from "vitest";
import { accountSettingsSchema } from "@/lib/validation/account";
import {
  createBoardSchema,
  parseCreateBoardForm,
} from "@/lib/validation/board";
import {
  parseCreateWorkspaceForm,
  parseUpdateWorkspaceForm,
} from "@/lib/validation/workspace";
import { signUpSchema } from "@/lib/validation/auth";

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

describe("create workspace validation", () => {
  it("accepts a valid payload and normalises empty optionals to null", () => {
    const result = parseCreateWorkspaceForm(
      form({ name: "  Acme Corp  ", description: "", visibility: "private" })
    );
    expect(result.state).toBeNull();
    expect(result.values).toMatchObject({
      name: "Acme Corp",
      description: null,
      displayName: null,
      visibility: "private",
    });
  });

  /**
   * `visibility` used to reach the database as a bare `as` cast, so any string
   * could be written into a pgEnum column and rejected at insert time.
   */
  it("rejects an unknown visibility", () => {
    const result = parseCreateWorkspaceForm(
      form({ name: "Acme", visibility: "everyone" })
    );
    expect(result.values).toBeNull();
    expect(result.state?.fieldErrors?.visibility).toBeDefined();
  });

  it("reports field errors instead of throwing", () => {
    const result = parseCreateWorkspaceForm(form({ name: "a" }));
    expect(result.values).toBeNull();
    expect(result.state?.fieldErrors?.name).toMatch(/at least 2/i);
  });

  it("trims and bounds the name", () => {
    expect(
      parseCreateWorkspaceForm(form({ name: "x".repeat(65) })).state?.fieldErrors?.name
    ).toBeDefined();
  });
});

describe("create board validation", () => {
  it("accepts a valid board and defaults defaultLists from the checkbox", () => {
    const result = parseCreateBoardForm(
      form({ name: "Roadmap", visibility: "workspace", defaultLists: "on" })
    );
    expect(result.state).toBeNull();
    expect(result.values).toMatchObject({
      name: "Roadmap",
      visibility: "workspace",
      defaultLists: true,
      workspaceId: null,
    });
  });

  describe("update workspace validation", () => {
    it("accepts supported settings and normalizes an empty website", () => {
      const result = parseUpdateWorkspaceForm(
        form({
          displayName: "Acme",
          description: "",
          website: "",
          visibility: "private",
        })
      );
      expect(result.state).toBeNull();
      expect(result.values).toMatchObject({
        displayName: "Acme",
        description: null,
        website: null,
        visibility: "private",
      });
    });

    it("rejects unsafe or malformed website URLs", () => {
      const result = parseUpdateWorkspaceForm(
        form({
          displayName: "Acme",
          website: "javascript:alert(1)",
          visibility: "public",
        })
      );
      expect(result.values).toBeNull();
      expect(result.state?.fieldErrors?.website).toBeDefined();
    });
  });

  describe("account settings validation", () => {
    it("normalizes usernames and accepts valid profile settings", () => {
      const result = accountSettingsSchema.safeParse({
        fullName: "Ada Lovelace",
        username: "Ada_L",
        initials: "AL",
        bio: "Working on projects.",
        locale: "en-US",
        timezone: "America/New_York",
        avatarColor: "#6d28d9",
      });

      expect(result.success).toBe(true);
      if (result.success) expect(result.data.username).toBe("ada_l");
    });

    it("rejects invalid time zones and usernames", () => {
      const result = accountSettingsSchema.safeParse({
        fullName: "Ada Lovelace",
        username: "not a username",
        initials: "",
        bio: "",
        locale: "en-US",
        timezone: "not/a-zone",
        avatarColor: "#6d28d9",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("sign-up validation", () => {
    it("allows an empty optional username without sending it to Better Auth", () => {
      const result = signUpSchema.safeParse({
        email: "ada@example.com",
        password: "secure-password",
        fullName: "Ada Lovelace",
        username: "",
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.username).toBeUndefined();
    });
  });

  it("treats an absent checkbox as false", () => {
    const result = parseCreateBoardForm(form({ name: "Roadmap" }));
    expect(result.values?.defaultLists).toBe(false);
  });

  it("requires a name", () => {
    const result = parseCreateBoardForm(form({ name: "   " }));
    expect(result.values).toBeNull();
    expect(result.state?.fieldErrors?.name).toBeDefined();
  });

  it("rejects an invalid visibility", () => {
    expect(
      parseCreateBoardForm(form({ name: "x", visibility: "nope" })).state
        ?.fieldErrors?.visibility
    ).toBeDefined();
  });

  it("does not coerce the API string false value to true", () => {
    expect(
      createBoardSchema.safeParse({ name: "Roadmap", defaultLists: "false" }).success
    ).toBe(false);
  });
});
