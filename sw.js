// ClassDesk service worker — makes the app installable (home-screen icon) and lets it open offline.
// Network-first for our own files: when online you always get the latest deploy (revalidated past
// GitHub Pages' 10-minute cache); the cached copy is only a fallback when offline.
// Cross-origin requests (Firebase, fonts, icon CDN) are left alone — the browser handles them.
const CACHE = "classdesk-shell";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isPage = req.mode === "navigate";
  // Every page load (index.html?v=NN etc.) shares one cache entry, so offline always has the app.
  const key = isPage ? new URL("./", location).href : req.url;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      // A navigate-mode Request can't be re-fetched with options, so fetch pages by URL.
      let res = isPage ? await fetch(req.url, { cache: "no-cache" }) : await fetch(req);
      // Browsers reject a followed-redirect response for a page load — hand back a clean copy.
      if (isPage && res.redirected) res = new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
      if (res.ok) cache.put(key, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(key);
      if (hit) return hit;
      throw err;
    }
  })());
});
