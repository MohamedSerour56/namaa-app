const CACHE="namaa-shell-v2";
const BASE=self.location.pathname.replace(/\/sw\.js$/,"");

self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.add(`${BASE}/`)).catch(()=>undefined));
 self.skipWaiting();
});

self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
 self.clients.claim();
});

self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  const copy=response.clone();
  void caches.open(CACHE).then(cache=>cache.put(event.request,copy));
  return response;
 }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(`${BASE}/`))));
});
