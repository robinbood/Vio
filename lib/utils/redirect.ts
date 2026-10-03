function hasUnsafeCharacters(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Backslash plus C0 controls and DEL. WHATWG URL parsing treats a
    // backslash as a slash for special schemes, so a value like "/\evil.com"
    // is really the protocol-relative "//evil.com".
    if (code === 0x5c || code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/**
 * Resolve a post-authentication redirect target.
 *
 * `useSearchParams().get()` percent-decodes before we ever see the value, so
 * `?redirect=/%5Cevil.com` arrives as `/\evil.com`. Anything that is not a
 * plain same-origin path falls back to `fallback`.
 */
export function safeRedirect(
  raw: string | null | undefined,
  fallback = "/boards"
): string {
  if (typeof raw !== "string") return fallback;

  const candidate = raw.trim();
  if (!candidate || hasUnsafeCharacters(candidate)) return fallback;
  if (!candidate.startsWith("/")) return fallback;
  // Reject protocol-relative and escaping targets.
  if (/^\/{2,}/.test(candidate) || candidate === "/..") return fallback;
  if (candidate.startsWith("/../")) return fallback;

  try {
    const base = "http://localhost";
    const url = new URL(candidate, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
