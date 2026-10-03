"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Moves focus to the main landmark after a client-side navigation.
 *
 * Without this, focus stays on the link that was activated, so a keyboard or
 * screen-reader user is left at the top of the document with no indication that
 * the page changed. Skipped on first render so it does not steal focus on load.
 */
export function RouteFocus() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const tabbable = main.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    (tabbable ?? main).focus({ preventScroll: true });
    // Intentionally only on route change.
  }, [pathname]);

  return null;
}
