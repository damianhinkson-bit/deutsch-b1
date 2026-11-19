const CACHE="b1-wortschatz-v41";
const VOICE_CACHE="b1-voice-v1";
const META_CACHE="b1-meta"; // the next atom due day, written by the app (dashboard.js) for the reminder // the MP3 voice (tts/): downloaded by the app on first use, kept across updates
const CORE=["./","index.html","shk-data.js","aktiv-data.js","shk-aktiv.js","aktiv.js","atome.js","satzmuster.js","fluency-data.js","fluency.js","tts-mp3.js","bilder.js","fotos.js","dashboard.js","manifest.webmanifest","icon-192.png","icon-512.png",
  "grammatik/index.html","grammatik/shk-items.js","grammatik/fonts/bricolage.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==VOICE_CACHE&&k!==META_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const url=new URL(r.url);
  if(url.origin!==location.origin) return;
  const p=url.pathname;
  // voice files: the app manages its own cache for them; never copy 75 MB into the app cache
  if(p.includes("/tts/")) return;
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

/* atom reminder: Chrome wakes the installed app now and then; notify once on a day atoms are due */
const META_URL=new URL("./__meta/atoms.json",self.registration.scope).href;
function localDay(){const d=new Date(),z=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());}
async function checkAtoms(){
  const c=await caches.open(META_CACHE); const r=await c.match(META_URL); if(!r) return;
  const m=await r.json().catch(()=>null); if(!m||!m.on||!m.due) return;
  const t=localDay(); if(m.due>t||m.told===t) return;
  // don't notify while the app is open in front of you
  const open=await self.clients.matchAll({type:"window",includeUncontrolled:true});
  if(open.some(w=>w.visibilityState==="visible")) return;
  await self.registration.showNotification(m.de?"Atome sind fällig":"Atoms are due",{
    body:m.de?"Zeit für deine Atom-Wiederholung. Tippen zum Öffnen.":"Time for your atom review. Tap to open.",
    icon:"icon-192.png",badge:"icon-192.png",tag:"atoms-due",renotify:false,data:{url:"./?go=atoms"}});
  m.told=t; await c.put(META_URL,new Response(JSON.stringify(m),{headers:{"Content-Type":"application/json"}}));
}
self.addEventListener("periodicsync",e=>{ if(e.tag==="atoms-due") e.waitUntil(checkAtoms()); });
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(ws=>{
    const w=ws.find(x=>x.url.startsWith(self.registration.scope));
    if(w) return w.navigate(url).then(x=>(x||w).focus()).catch(()=>w.focus());
    return self.clients.openWindow(url);
  }));
});
