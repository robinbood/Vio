import { describe, expect, it } from "vitest";
import { isNextControlFlow } from "@/lib/errors/control-flow";

/** Next signals control flow by throwing with a `digest`. */
function withDigest(digest: string) {
  return Object.assign(new Error("Dynamic server usage: Route /boards"), {
    digest,
  });
}

describe("isNextControlFlow", () => {
  it("recognises redirect(), notFound() and dynamic bailouts", () => {
    expect(isNextControlFlow(withDigest("NEXT_REDIRECT"))).toBe(true);
    expect(isNextControlFlow(withDigest("DYNAMIC_SERVER_USAGE"))).toBe(true);
    expect(isNextControlFlow(withDigest("NEXT_HTTP_ERROR_FALLBACK;404"))).toBe(true);
  });

  it("does not swallow genuine faults", () => {
    // A DB outage must still degrade to "signed out" rather than propagating a
    // stack trace on every request.
    expect(isNextControlFlow(new Error("connection terminated"))).toBe(false);
    expect(
      isNextControlFlow(Object.assign(new Error("boom"), { code: "ECONNRESET" }))
    ).toBe(false);
    expect(
      isNextControlFlow(Object.assign(new Error("boom"), { digest: "SOMETHING_ELSE" }))
    ).toBe(false);
  });

  it("tolerates non-error values", () => {
    expect(isNextControlFlow(null)).toBe(false);
    expect(isNextControlFlow(undefined)).toBe(false);
    expect(isNextControlFlow("NEXT_REDIRECT")).toBe(false);
    expect(isNextControlFlow(42)).toBe(false);
    expect(isNextControlFlow({})).toBe(false);
  });
});
