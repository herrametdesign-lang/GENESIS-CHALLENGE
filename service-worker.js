/* GENESIS CHALLENGE PWA · versión de prueba 0.4.2-test */
const APP_VERSION = "0.4.2-test";
const CACHE_PREFIX = "genesis-challenge-";
const CACHE_NAME = CACHE_PREFIX + APP_VERSION;
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./motor-genesis.browser.js?v=" + APP_VERSION,
  "./diamond-security/diamond-unbunker.js?v=" + APP_VERSION,
  "./genesis-referrals.demo.js?v=" + APP_VERSION,
  "./pwa-icons/genesis-mark.svg",
  "./pwa-icons/genesis-192.png",
  "./pwa-icons/genesis-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  // No skipWaiting aquí: una partida abierta mantiene su controlador y sus recursos.
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname.endsWith("/service-worker.js")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put("./index.html", response.clone()));
      return response;
    }).catch(async () => (await caches.match("./index.html")) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
