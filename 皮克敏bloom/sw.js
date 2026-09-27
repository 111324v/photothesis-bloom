/* 光合作用 Service Worker
   策略：导航 network-first（保证拿到新版），静态资源 cache-first（弱网/二次访问秒开） */
const V = 'bloom-v684-tabsleft';
const CORE = [
  './index.html', './manifest.webmanifest',
  './app_assets/three/es-module-shims.js',
  './app_assets/three/three.module.js',
  './app_assets/three/controls/OrbitControls.js',
  './app_assets/three/loaders/GLTFLoader.js',
  './app_assets/three/utils/BufferGeometryUtils.js',
  './app_assets/strawberry_anim.glb',
  './app_assets/watering_can.glb',
  './app_assets/sun_sticker.png',
  './app_assets/back-arrow.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(V)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copy = r.clone();
          caches.open(V).then((c) => c.put('./index.html', copy));
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) {
        fetch(e.request).then((r) => {
          if (r.ok) caches.open(V).then((c) => c.put(e.request, r.clone()));
        }).catch(() => {});
        return hit;
      }
      return fetch(e.request).then((r) => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(V).then((c) => c.put(e.request, copy));
        }
        return r;
      });
    })
  );
});
