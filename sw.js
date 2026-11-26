/* Saysko Photographie — service worker : cache hors ligne pour la version mobile. */
'use strict';
var CACHE = 'saysko-mobile-v1';
var ASSETS = [
  'mobile.html', 'site.css', 'site.js',
  'icon-192.png', 'icon-512.png',
  'bg-studio-softbox.jpg', 'bg-about.jpg', 'canon-face.jpg',
  'bg-retouche.jpg', 'station-retouche-3ecrans.jpg',
  'galerie-AB9A7835.jpg', 'galerie-AB9A7833_2.jpg',
  'galerie-portrait_nette.jpg', 'galerie-AB9A7956.jpg',
  'galerie-AB9A7830.jpg', 'shooting-exterieur.jpg',
  'audio/lofi-retouche.mp3'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (u) {
      return c.add(u).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return caches.match('mobile.html'); });
    })
  );
});
