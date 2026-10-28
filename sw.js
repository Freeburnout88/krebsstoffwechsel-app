const CACHE = 'krebsapp-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './app-icon.svg',
  './icon-192.svg',
  './icon-512.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => { try { c.put(e.request, copy); } catch (err) {} });
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
