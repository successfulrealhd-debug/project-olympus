const cacheName = 'olympus-cache-v1';
const assets = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.json'];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
