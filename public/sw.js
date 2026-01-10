const CACHE_NAME = 'mlue-finance-v2';
const STATIC_CACHE_NAME = 'mlue-finance-static-v2';
const DYNAMIC_CACHE_NAME = 'mlue-finance-dynamic-v2';

// Assets to cache on install
const urlsToCache = [
  '/',
  '/dashboard',
  '/budget',
  '/transaction',
  '/settings',
  '/manifest.json',
  '/images/Rounded_logo.png',
  '/images/mlue.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache core files, but don't fail if some are missing
        return Promise.allSettled(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`[SW] Failed to cache ${url}:`, err);
            });
          })
        );
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('mlue-finance-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Helper: Check if request is for static asset
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('/images/') ||
         url.includes('/icons/') ||
         url.includes('/Font/') ||
         url.endsWith('.png') ||
         url.endsWith('.jpg') ||
         url.endsWith('.jpeg') ||
         url.endsWith('.svg') ||
         url.endsWith('.woff') ||
         url.endsWith('.woff2') ||
         url.endsWith('.ttf') ||
         url.endsWith('.otf') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url === '/manifest.json';
}

// Helper: Check if request is for API call
function isApiCall(url) {
  return url.includes('/api/') || 
         url.startsWith('https://generativelanguage.googleapis.com') ||
         url.startsWith('https://api.groq.com');
}

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests that we can't cache
  if (url.origin !== location.origin && !isApiCall(url.href)) {
    // For external API calls, try network first but don't cache
    if (isApiCall(url.href)) {
      event.respondWith(
        fetch(request).catch(() => {
          // Return a basic error response if offline
          return new Response(
            JSON.stringify({ error: 'Network unavailable' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
      );
    }
    return;
  }

  // Static assets: Cache First strategy (fast loading, works offline)
  if (isStaticAsset(url.href)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Clone the response
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // If offline and no cache, try to return a placeholder
          if (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg')) {
            return new Response('', { status: 404 });
          }
        });
      })
    );
    return;
  }

  // Pages and dynamic content: Network First with Cache Fallback
  // This ensures users get fresh content when online, but can still use the app offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200 && response.type === 'basic') {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cache and it's a navigation request, return the home page
          if (request.mode === 'navigate') {
            return caches.match('/').then((homePage) => {
              return homePage || new Response('Offline - Please check your connection', {
                status: 503,
                headers: { 'Content-Type': 'text/html' }
              });
            });
          }
          
          // Otherwise return a generic offline response
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.action === 'getVersion') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
