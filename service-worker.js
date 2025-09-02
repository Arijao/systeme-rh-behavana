// service-worker.js

// 1. Ovay ny anaran'ny cache mba hanerena fanavaozana
const CACHE_NAME = 'behavana-rh-cache-v1.5'; // <-- Version vaovao

// 2. Lisitry ny rakitra miaraka amin'ny lalana marina ho an'ny GitHub Pages
const URLS_TO_CACHE = [
  // --- FANITSIANA LEHIBE ETO ---
  // Ampiana '/systeme-rh-behavana/' daholo ny rakitra eo an-toerana
  '/systeme-rh-behavana/',
  '/systeme-rh-behavana/index.html',
  '/systeme-rh-behavana/manifest.json',
  '/systeme-rh-behavana/icons.css',
  '/systeme-rh-behavana/roboto.css',
  '/systeme-rh-behavana/icon-192.png',
  '/systeme-rh-behavana/icon-512.png',
  '/systeme-rh-behavana/jsQR.min.js',

  // Ireo script avy any ivelany (CDN) dia tsy ovaina satria adiresy feno
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// 3. Dingana "Install": Mitahiry ireo rakitra ao anaty cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME )
      .then(cache => {
        console.log('Cache nosokafana. Manomboka mitahiry rakitra...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('Tsy nahomby ny fitehirizana rakitra tao anaty cache:', error);
      })
  );
});

// 4. Dingana "Activate": Mamafa ireo cache taloha
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Mamafa cache taloha:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 5. Dingana "Fetch": Manome ny valiny rehefa misy fangatahana
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Raha hita ao anaty cache ilay fangatahana, dia io no averina avy hatrany
        if (response) {
          return response;
        }
        // Raha tsy hita, dia andramana alaina any anaty internet
        return fetch(event.request);
      })
  );
});
