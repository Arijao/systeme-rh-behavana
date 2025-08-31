// --- VERSION 5: Manala tanteraka ny maskable-icon ---
const CACHE_NAME = 'rh-behavana-cache-v5';

const urlsToCache = [
  // Ny pejy fototra
  '/systeme-rh-behavana/',
  '/systeme-rh-behavana/index.html',
  
  // Ireo rakitra CSS (averina eto indray satria tsy ireo no olana)
  '/systeme-rh-behavana/roboto.css',
  '/systeme-rh-behavana/icons.css',
  
  // Ireo sary famantarana (ireo tena misy ihany)
  '/systeme-rh-behavana/icon-192.png',
  '/systeme-rh-behavana/icon-512.png',

  // Ireo librairies ivelany
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Ny tohin'ny kaody (install, fetch, activate ) dia tsy miova
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache misokatra (v5)');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
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
            console.log('Fafana ny cache taloha:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
