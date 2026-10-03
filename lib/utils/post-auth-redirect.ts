const KEY = "vio:post-auth-redirect";

/**
 * Remember where the user was heading before authenticating. The two-factor
 * challenge navigates via a full page load, so the target has to survive
 * outside React state.
 */
export function rememberPostAuthRedirect(path: string): void {
  try {
    window.sessionStorage.setItem(KEY, path);
  } catch {
    // Private mode / storage disabled — the fallback destination is fine.
  }
}

export function takePostAuthRedirect(fallback = "/boards"): string {
  try {
    const stored = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}
