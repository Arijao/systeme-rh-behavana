// --- VERSION 3: Manitsy ny lalan'ny sary ho ao amin'ny faka (root) ---
const CACHE_NAME = 'rh-behavana-cache-v3';

const urlsToCache = [
  // Ny pejy fototra
  '/systeme-rh-behavana/',
  '/systeme-rh-behavana/index.html',
  
  // Ireo rakitra CSS
  '/systeme-rh-behavana/roboto.css',
  '/systeme-rh-behavana/icons.css',
  
  // Ireo sary famantarana (ao amin'ny faka ankehitriny)
  '/systeme-rh-behavana/icon-192.png',
  '/systeme-rh-behavana/icon-512.png',
  '/systeme-rh-behavana/maskable-icon.png',

  // Ireo librairies ivelany (tsy miova mihitsy)
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Dingana 1: Fametrahana (Installation )
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache misokatra (v3)');
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

// Dingana 3: Fampiasana (Activation) - Manadio ny cache taloha
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Tehirizina fotsiny ny cache v3
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
