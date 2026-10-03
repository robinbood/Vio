/**
 * Next.js signals control flow by throwing, with the reason carried on
 * `error.digest`:
 *
 * - `NEXT_REDIRECT` — `redirect()` from `next/navigation`
 * - `NEXT_HTTP_ERROR_FALLBACK;404` — `notFound()`
 * - `DYNAMIC_SERVER_USAGE` — a runtime API (`headers()`, `cookies()`, …) was
 *   read during a render that was being prerendered
 *
 * A blanket `catch` around any of those swallows the signal: the route is
 * then prerendered as if it had never touched a runtime API, which produces
 * stale output instead of a build error. Only genuine faults should be
 * degraded, so anything carrying one of these digests is re-thrown.
 */
const CONTROL_FLOW_DIGESTS = [
  "NEXT_REDIRECT",
  "NEXT_NOT_FOUND",
  "NEXT_HTTP_ERROR_FALLBACK",
  "DYNAMIC_SERVER_USAGE",
];

export function isNextControlFlow(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  if (typeof digest !== "string") return false;
  return CONTROL_FLOW_DIGESTS.some(
    (code) => digest === code || digest.startsWith(`${code};`)
  );
}
