const CACHE_NAME = 'ias-offline-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json', // We'll add this optionally
  // The rest will be cached on the fly as they are requested
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // For API/Dynamic requests (if any in future)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network First, fallback to cache (so we always get latest UI if online)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Don't cache non-successful responses or browser extension requests
        if (!response || response.status !== 200 || response.type !== 'basic' || event.request.url.startsWith('chrome-extension')) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // If it's a navigation request and not in cache, fallback to index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
