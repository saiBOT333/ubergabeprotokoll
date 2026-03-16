/* ═══════════════════════════════════════════════════════════════
   Übergabeprotokoll – Service Worker
   Strategy: Cache-first for app shell, network-first for CDN libs
═══════════════════════════════════════════════════════════════ */

const CACHE  = 'uebergabe-v2';
const STATIC = [
  './ubergabeprotokoll.html',
  './icon.svg',
  './manifest.json',
];
const CDN = [
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
];

// ── Install: pre-cache everything ──────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled([
        cache.addAll(STATIC),
        cache.addAll(CDN),
      ])
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for app files, stale-while-revalidate for CDN ──
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  // App shell + local assets: cache-first
  if (url.includes(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          if (res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        }).catch(() => null);
        return cached || fresh;
      })
    );
    return;
  }

  // CDN resources: cache-first, fallback to network
  if (CDN.some(u => url.startsWith(u.split('/').slice(0, 3).join('/')))) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        });
      })
    );
  }
});
