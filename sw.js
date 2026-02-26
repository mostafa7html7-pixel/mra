const CACHE_NAME = 'abqarieno-v5'; // Update: Removed update toast logic
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './library.html',
    './videos.html',
    './profile.html',
    './subscription.html',
    './auth.html',
    './schedule.html',
    './reviews.html',
    './contact.html',
    './style.css',
    './main.js',
    './6.jpeg',
    './212.png'
];

// تثبيت Service Worker
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// تفعيل Service Worker وحذف الكاش القديم
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // السيطرة على الصفحات المفتوحة فوراً
    );
});

// Stale-While-Revalidate Strategy
self.addEventListener('fetch', (e) => {
    // Ignore Firebase and other external requests
    if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((res) => {
            const fetchPromise = fetch(e.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return res || fetchPromise;
        })
    );
});