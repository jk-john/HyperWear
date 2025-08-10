// Service Worker for performance optimization
const CACHE_NAME = 'hyperwear-v1';
const STATIC_ASSETS = [
  '/',
  '/HYPE.svg',
  '/hyperwear.png',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/');
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (event.request.url.includes('/_next/static/') || 
      event.request.url.includes('/favicon.ico') ||
      event.request.url.includes('/HYPE.svg') ||
      event.request.url.includes('/hyperwear.png')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});