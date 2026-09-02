// Minimal no-op service worker. Next.js dev tooling probes /sw.js on every
// request to decide whether to register a service worker for HMR; serving
// this file (instead of returning 404) prevents the dev terminal from being
// flooded with 404 lines on every page load.
//
// In production, real PWA work (offline cache, push) should be implemented
// per the PWA guide; see AGENTS.md §17.

self.addEventListener("install", () => {
  // Skip waiting so the no-op SW activates immediately when installed.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Unregister ourselves so the page stops probing /sw.js on subsequent loads.
  event.waitUntil(
    (async () => {
      const regs = await self.registration.unregister().catch(() => undefined);
      return regs;
    })()
  );
});
