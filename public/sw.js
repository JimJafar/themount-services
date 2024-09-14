importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

// This is your Service Worker, you can put any of your custom Service Worker
// code in this file, above the `precacheAndRoute` line.

// When widget is installed/pinned, push initial state.
self.addEventListener('widgetinstall', (event) => {
  event.waitUntil(updateWidget(event));
});

// When widget is shown, update content to ensure it is up-to-date.
self.addEventListener('widgetresume', (event) => {
  event.waitUntil(updateWidget(event));
});

// When the user clicks an element with an associated Action.Execute,
// handle according to the 'verb' in event.action.
self.addEventListener('widgetclick', (event) => {
  if (event.action == 'updateName') {
    event.waitUntil(updateName(event));
  }
});

// When the widget is uninstalled/unpinned, clean up any unnecessary
// periodic sync or widget-related state.
self.addEventListener('widgetuninstall', (event) => {});

const updateWidget = async (event) => {
  // The widget definition represents the fields specified in the manifest.
  const widgetDefinition = event.widget.definition;

  // Fetch the template and data defined in the manifest to generate the payload.
  const payload = {
    template: JSON.stringify(
      await (await fetch(widgetDefinition.msAcTemplate)).json()
    ),
    data: JSON.stringify(await (await fetch(widgetDefinition.data)).json()),
  };

  // Push payload to widget.
  await self.widgets.updateByInstanceId(event.instanceId, payload);
};

const updateName = async (event) => {
  const name = event.data.json().name;

  // The widget definition represents the fields specified in the manifest.
  const widgetDefinition = event.widget.definition;

  // Fetch the template and data defined in the manifest to generate the payload.
  const payload = {
    template: JSON.stringify(
      await (await fetch(widgetDefinition.msAcTemplate)).json()
    ),
    data: JSON.stringify({ name }),
  };

  // Push payload to widget.
  await self.widgets.updateByInstanceId(event.instanceId, payload);
};

// Start offline caching
// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = 'offline.html';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
// End offline caching

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
