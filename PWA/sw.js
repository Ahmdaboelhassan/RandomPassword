// Service Worker for Text Encryptor PWA
const CACHE_NAME = "text-encryptor-v1.0.0";

// Get base path for GitHub Pages support
const getBasePath = () => {
  return self.location.pathname.substring(
    0,
    self.location.pathname.lastIndexOf("/") + 1,
  );
};

const BASE_PATH = getBasePath();

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "css/styles.css",
  BASE_PATH + "js/crypto.js",
  BASE_PATH + "js/password-generator.js",
  BASE_PATH + "js/app.js",
  BASE_PATH + "PWA/pwa.js",
  BASE_PATH + "PWA/manifest.json",
];

// Install event - cache all static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching app shell");
        // Add files one by one to better handle errors
        return Promise.all(
          urlsToCache.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn("[Service Worker] Failed to cache:", url, err);
            });
          }),
        );
      })
      .then(() => {
        console.log("[Service Worker] Skip waiting");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[Service Worker] Caching failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[Service Worker] Claiming clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("[Service Worker] Fetch failed:", error);

          // Return offline page if available
          return caches.match("/index.html");
        });
    }),
  );
});

// Handle messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log("[Service Worker] Cache cleared");
        return self.clients.claim();
      }),
    );
  }
});

// Background sync for future features
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync:", event.tag);

  if (event.tag === "sync-data") {
    event.waitUntil(
      // Add background sync logic here if needed
      Promise.resolve(),
    );
  }
});
