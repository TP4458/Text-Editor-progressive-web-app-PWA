const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
const { StaleWhileRevalidate } = require('workbox-strategies');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Check to see if the request is a navigation to a new page
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implemented asset caching
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  //StaleWhileRevalidate strategy always sends a request to the network even after cache hit and uses response to refresh the cache
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      //  cache any requests with response 0 or 200.
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // cache for 30 days
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);
