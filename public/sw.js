/**
 * Solstice: Heatwave Buddy - Minimal Hand-Written Service Worker (Step 5A)
 * 
 * Strict Privacy & Zero-Storage Guarantees:
 * - Caches ONLY the public app shell, static assets, and the emergency check.
 * - NEVER caches API routes (/api/*), live weather queries, Gemini AI plans,
 *   Amazon Polly audio, user accounts, preferences, or personal health notes.
 */

const CACHE_NAME = 'solstice-v1';

// Static assets and pages to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/plan',
  '/offline',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          // Pre-cache individual failure non-fatal (e.g. dev vs prod paths)
          console.warn('[Solstice SW] Pre-cache skipped asset:', asset, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1. Only intercept GET requests
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // 2. PRIVACY & DYNAMIC DATA SAFEGUARD:
  // NEVER cache API responses, live weather, audio synthesis, or user database queries.
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('supabase.co') ||
    url.pathname.includes('/speak') ||
    url.pathname.includes('/audio') ||
    url.searchParams.has('weather') ||
    req.headers.get('accept')?.includes('audio/')
  ) {
    return; // Pass through to network directly without caching
  }

  // 3. Same-origin navigation requests (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname === '/' || url.pathname === '/plan' || url.pathname === '/offline')
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cache = await caches.open(CACHE_NAME);
          const cachedPage = await cache.match(req);
          if (cachedPage) {
            return cachedPage;
          }
          if (url.pathname === '/plan') {
            const cachedPlan = await cache.match('/plan');
            if (cachedPlan) return cachedPlan;
          }
          const offlineFallback = await cache.match('/offline');
          if (offlineFallback) {
            return offlineFallback;
          }
          return new Response(
            'You are offline. Solstice emergency check and Call 108 are still available.',
            { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 4. Same-origin static assets (_next/static, images, icons, fonts)
  if (
    url.origin === self.location.origin &&
    (
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js')
    )
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});
