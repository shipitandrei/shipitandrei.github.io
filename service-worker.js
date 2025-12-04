const CACHE_NAME = 'games-pwa-cache-v1';
const urlsToCache = [
  '/app.html',
  '/images/vodka.WEBP'
];

// Install event – cache the app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event – cleanup old caches (optional for minimal setup)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch event – respond with cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
