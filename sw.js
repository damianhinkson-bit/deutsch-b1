const CACHE="b1-wortschatz-v33";
const CORE=["./","index.html","shk-data.js","aktiv-data.js","shk-aktiv.js","aktiv.js","atome.js","satzmuster.js","fluency-data.js","fluency.js","manifest.webmanifest","icon-192.png","icon-512.png",
  "grammatik/index.html","grammatik/shk-items.js","grammatik/fonts/bricolage.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const url=new URL(r.url);
  if(url.origin!==location.origin) return;
  const p=url.pathname;
  // the cache key is the file's own path: a folder means its index.html (the app page and the grammar page each keep their own copy)
  const key=new URL(p.endsWith("/")?p+"index.html":p, url.origin).href;
  if(r.mode==="navigate"||p.endsWith("/")||p.endsWith(".html")||p.endsWith(".js")){
    // pages and scripts: try the network for updates, fall back to the saved copy offline
    // no-cache: always ask GitHub for the newest version (it lets browsers keep old copies for 10 minutes)
    e.respondWith(fetch(url.href,{cache:"no-cache",credentials:"same-origin"}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(key,c));}return res;}).catch(()=>caches.match(key).then(hit=>hit||caches.match(r))));
    return;
  }
  // everything else (icons, fonts): saved copy first
  e.respondWith(caches.match(key).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(key,c));}return res;})));
});
