const CACHE_NAME = 'rh-behavana-cache-v1';
// Ampidirina eto ny lisitry ny rakitra REHETRA ilain'ny fampiharana
const urlsToCache = [
  '/',
  'index.html',
  'roboto.css',
  'icons.css',
  // Ampio eto ny anaran'ireo rakitra JavaScript sy CSS hafa raha misy
  // Ohatra: 'style.css', 'script.js'
  
  // Ireo librairies ampiasaina
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',

  // Ireo sary famantarana
  'images/icon-192.png',
  'images/icon-512.png',
  'images/maskable-icon.png'
];

// Dingana 1: Fametrahana (Installation )
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache misokatra');
        return cache.addAll(urlsToCache);
      })
  );
});

// Dingana 2: Fandraisana requete (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Raha misy ao anaty cache dia io no averina
        if (response) {
          return response;
        }
        // Raha tsy misy dia alaina amin'ny aterineto
        return fetch(event.request);
      })
  );
});
