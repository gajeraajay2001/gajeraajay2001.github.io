'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "340079340a4d0383b7fb69b69560d727",
"splash/img/light-2x.png": "39c1db03b722108191892c9490c53072",
"splash/img/dark-4x.png": "6c85e556df7ab97ef5e8896ad24952c0",
"splash/img/light-3x.png": "e8b587c58454a49c4d1e15a89b14f0b1",
"splash/img/dark-3x.png": "e8b587c58454a49c4d1e15a89b14f0b1",
"splash/img/light-4x.png": "6c85e556df7ab97ef5e8896ad24952c0",
"splash/img/dark-2x.png": "39c1db03b722108191892c9490c53072",
"splash/img/dark-1x.png": "80035e4efc56b75c4f158fa7236ff887",
"splash/img/light-1x.png": "80035e4efc56b75c4f158fa7236ff887",
"splash/splash.js": "c6a271349a0cd249bdb6d3c4d12f5dcf",
"splash/style.css": "db6178791b6369b77311c0ae92809585",
"index.html": "a1232642e76672bdbbdcf7f085769d16",
"/": "a1232642e76672bdbbdcf7f085769d16",
"main.dart.js": "0bbb7c046d13948d3e07567761266645",
"pexels-jonas-kakaroto-736230.jpg": "febbe6e306426548622f3e0d5de57a40",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "88861e6d19ef0ef54780779c2d5cc7fa",
"assets/AssetManifest.json": "c20358bc14e6604234e2cd8cf6f4f26d",
"assets/NOTICES": "99461e0541c3db514ec6fde37c26496c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/ic_check_box.png": "5f877a2cf3854bf0a3f4b9f11dcd217f",
"assets/assets/holiday_icon.png": "d6bc9ec4e8f078e1a795d7e7e7b762ad",
"assets/assets/out_edit.png": "64f960c794c4ebe79d08f310b478f4a9",
"assets/assets/ic_leave.png": "47b19966a3322ba0c97f9a4e1ea6d7ab",
"assets/assets/ic_serch.png": "59a6a2a31eb9672be3b5865d1ed2b766",
"assets/assets/user_image.png": "be0863a9db281020f9953be2b53b16c0",
"assets/assets/image_user.webp": "7ccc29d16d34dbafa900126610dc6bbd",
"assets/assets/ic_add.png": "8cdb475d5741af75edf01e2d980aab09",
"assets/assets/ic_lock.png": "0c804952f5072afc687e3f189843f79e",
"assets/assets/ic_mail.png": "3c425440f7c1887dc6daebde9a18b85b",
"assets/assets/ic_noti.png": "811d5c56e5a7875ecbdd3161236cf33f",
"assets/assets/logo.png": "64e9b95b0714bb4d4b52887363f49135",
"assets/assets/Logo2.png": "91ce35e8497252bcc20cc641d2b84b74",
"assets/assets/ic_box.png": "98d95a07ee71fe856a34ec85cea8c533",
"assets/assets/ic_dashboard.png": "5961da91c8ac05877d3803175e51c8aa",
"assets/assets/login_pic.png": "3f56f17d553acc06fa990a56b4adbe21",
"assets/assets/Rectangle%25204.png": "8b149bd6ee9ec57e2a8b779caf9ca917",
"assets/assets/in_edit.png": "5749aa5d0923230504daa4f6e41b07ed",
"assets/assets/ic_eye_offf.png": "a9ecceca0984e91842d48376d0efcb69",
"assets/assets/ic_eye.png": "d8b23632446b37ed9b94c9ab769db848"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
