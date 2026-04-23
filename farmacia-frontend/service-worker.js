const CACHE_NAME = 'farmasystem-v1';
const ASSETS = [
  './', './index.html', './app.js', './style.css', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) { e.respondWith(fetch(e.request)); return; }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
