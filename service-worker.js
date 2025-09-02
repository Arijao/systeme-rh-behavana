// service-worker.js

// 1. Famaritana ny anaran'ny cache sy ny version.
// Ovay ity isaky ny misy fanovana lehibe amin'ny rakitra.
const CACHE_NAME = 'behavana-rh-cache-v1.2';

// 2. Lisitry ny rakitra fototra ilaina mba handehanan'ny fampiharana "offline".
const URLS_TO_CACHE = [
  '/', // Ny pejy fandraisana
  'index.html',
  'manifest.json',
  'icons.css', // <-- Ataovy azo antoka fa marina ity anarana ity
  'roboto.css', // <-- Ataovy azo antoka fa marina ity anarana ity
  'icon-192.png',
  'icon-512.png',
  'icons.json',
  'jsQR.min.js',
  
  // Ireo script avy any ivelany (CDN)
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
// Ity no mamela ny fiasana "offline"
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
