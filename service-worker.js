const CACHE_NAME = 'games-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/app.html',
  '/style.css',
  '/script.js',
  '/images/vodka.WEBP'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
