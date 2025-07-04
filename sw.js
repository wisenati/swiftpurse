const CACHE_NAME = "swiftpurse-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/signup.html",
  "/login.html",
  "/dashboard.html",
  "/chat.html",
  "/Guess.html",
  "/swap.html",
  "/transaction.html",
  "/receive.html",
  "/withdraw.html",
  "/setting.html",
  "/styles/main.css",
  "/scripts/main.js",
  "/splash.html",
  "/wallet.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap",
  "https://codehubme.wordpress.com/wp-content/uploads/2025/06/file_00000000882c62439bbd2b1da125b80a_1-removebg-preview5089134587099523797.png",
  "/mock.jpeg",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
