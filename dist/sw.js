const CACHE_NAME = 'ttmebel-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/catalog.html',
  '/about.html',
  '/delivery.html',
  '/reviews.html',
  '/contacts.html',
  '/css/style.css',
  '/css/admin.css',
  '/js/main.js',
  '/js/catalog.js',
  '/js/site-render.js',
  '/js/notify.js',
  '/data/products.json',
  '/data/site.json',
  '/data/config.json',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com') || request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetched = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetched;
        });
      })
    );
    return;
  }

  if (request.url.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => new Response('', { status: 404 }));
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response.ok && request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
