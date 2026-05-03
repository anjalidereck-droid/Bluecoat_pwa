// service_worker.js
// Very simple service worker for offline support.
// - On install: cache core app shell files.
// - On fetch: try cache first, then network.

const CACHE_NAME = "exam-practice-v1";

// Files that make up the "app shell"
const ASSETS = [
  "/",                // Flask route for index
  "/static/styles.css",
  "/static/app.js",
  "/static/questions.js",
  "/manifest.json"
];

// Install event: pre-cache core assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate event: clean up old caches if version changes
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event: respond from cache if available, otherwise from network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});