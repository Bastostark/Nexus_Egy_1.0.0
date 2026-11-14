/* ============================================
   NEXUS EGY — Service Worker (PWA Offline)
   ============================================ */

const CACHE_NAME = 'nexus-egy-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/boot.css',
  '/css/style.css',
  '/js/sound.js',
  '/js/boot.js',
  '/js/app.js',
  '/manifest.json',
  '/assets/logo.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
