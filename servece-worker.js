const CACHE_NAME = 'filippi-v1';

const ARCHIVOS_ESTATICOS = [
  '/filippi-app/index.html',
  '/filippi-app/detalle.html',
  '/filippi-app/style.css',
  '/filippi-app/app.js',
  '/filippi-app/img/logo-filippi.png',
  '/filippi-app/icono.png'
];

const API_SHEETS = 'https://opensheet.elk.sh/';

// INSTALL — cachea los archivos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_ESTATICOS))
  );
  self.skipWaiting();
});

// ACTIVATE — limpia caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH — estrategia según tipo de recurso
self.addEventListener('fetch', e => {

  // Google Sheets API → Network First (datos siempre frescos)
  if (e.request.url.includes(API_SHEETS)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Archivos estáticos → Cache First (rápido, funciona offline)
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        const copia = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
        return res;
      });
    })
  );

});