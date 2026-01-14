// 1. Version vaovao miaraka amin'ny face recognition
const CACHE_NAME = 'behavana-rh-cache-v2.6'; // <-- Version 2.4

// 2. Auto-detect: GitHub Pages na local
const BASE_PATH = self.location.pathname.includes('/systeme-rh-behavana/') 
  ? '/systeme-rh-behavana' 
  : '';

// 3. Lisitry ny rakitra rehetra (ampiana models)
const URLS_TO_CACHE = [
  // Pejy fototra
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons.css`,
  `${BASE_PATH}/roboto.css`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  `${BASE_PATH}/jsQR.min.js`,
  `${BASE_PATH}/js/face-api.min.js`,
  // Audio files
  `${BASE_PATH}/suivant.mp3`,
  `${BASE_PATH}/au_suivant.mp3`,
  `${BASE_PATH}/déjà là.mp3`,
  `${BASE_PATH}/efateo.mp3`,

  
  // Face-api.js models (VAOVAO)
  `${BASE_PATH}/models/ssd_mobilenetv1_model-weights_manifest.json`,
  `${BASE_PATH}/models/ssd_mobilenetv1_model.bin`,
  `${BASE_PATH}/models/face_landmark_68_model-weights_manifest.json`,
  `${BASE_PATH}/models/tiny_face_detector_model.bin`,
  `${BASE_PATH}/models/tiny_face_detector_model-weights_manifest.json`,
  `${BASE_PATH}/models/face_landmark_68_model.bin`,
  `${BASE_PATH}/models/face_recognition_model-weights_manifest.json`,
  `${BASE_PATH}/models/face_recognition_model.bin`,
  
  // CDN scripts avy any ivelany
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  
];

// 4. Dingana "Install": Mitahiry rakitra ao cache + activate avy hatrany
self.addEventListener('install', event => {
  console.log('[SW] Installation... BASE_PATH:', BASE_PATH);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache nosokafana. Manomboka mitahiry rakitra...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Rakitra rehetra tao cache!');
        return self.skipWaiting(); // Activate avy hatrany
      })
      .catch(error => {
        console.error('❌ Tsy nahomby cache:', error);
      })
  );
});

// 5. Dingana "Activate": Mamafa cache taloha + contrôle avy hatrany
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
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
    }).then(() => {
      console.log('✅ Service Worker activé!');
      return self.clients.claim(); // Contrôle avy hatrany
    })
  );
});

// 6. Dingana "Fetch": Cache first, puis network + offline fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Raha hita cache → averina avy hatrany
        if (response) {
          return response;
        }
        
        // Raha tsy hita → alaina any internet
        return fetch(event.request).then(networkResponse => {
          // Cache ny vaovao raha 200 OK
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Offline fallback: averina index.html
        if (event.request.destination === 'document') {
          return caches.match(`${BASE_PATH}/index.html`);
        }
        // Raha audio/fichier hafa tsy hita
        return new Response('Offline', { status: 503 });
      })

  );
});
