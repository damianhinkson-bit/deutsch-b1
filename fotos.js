/* Word pictures: your own photos (shrunk on the phone, kept in IndexedDB) and the built-in drawings (bilder.js).
   Your photo wins over the drawing. Photos are not part of the copy-code backup; the backup file in Mehr includes them. */
const FOTO_DB="b1-fotos", FOTO_ST="pics", FOTO_MAX=400, FOTO_Q=0.6;
let _fdb=null;
function fdb(){
  if(!_fdb) _fdb=new Promise((res,rej)=>{
    try{ const r=indexedDB.open(FOTO_DB,1);
      r.onupgradeneeded=()=>r.result.createObjectStore(FOTO_ST);
      r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
    }catch(e){ rej(e); }
  }).catch(e=>{ _fdb=null; throw e; });
  return _fdb;
}
function fotoReq(mode,fn){
  return fdb().then(db=>new Promise((res,rej)=>{
    const t=db.transaction(FOTO_ST,mode), q=fn(t.objectStore(FOTO_ST));
    t.oncomplete=()=>res(q?q.result:undefined); t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error);
  }));
}
const fotoGet=id=>fotoReq("readonly",s=>s.get(id));
const fotoPut=(id,blob)=>fotoReq("readwrite",s=>s.put(blob,id));
const fotoDel=id=>fotoReq("readwrite",s=>s.delete(id));
const fotoKeys=()=>fotoReq("readonly",s=>s.getAllKeys());
function fotoAll(){ return fdb().then(db=>new Promise((res,rej)=>{
  const t=db.transaction(FOTO_ST,"readonly"), s=t.objectStore(FOTO_ST), k=s.getAllKeys(), v=s.getAll();
  t.oncomplete=()=>{ const o={}; k.result.forEach((id,i)=>o[id]=v.result[i]); res(o); }; t.onerror=()=>rej(t.error);
}));}

// shrink a phone photo: longest side 400 px, WebP (JPEG if WebP isn't available)
function shrinkPhoto(file){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file), img=new Image();
    img.onload=()=>{
      const s=Math.min(1,FOTO_MAX/Math.max(img.naturalWidth,img.naturalHeight));
      const w=Math.max(1,Math.round(img.naturalWidth*s)), h=Math.max(1,Math.round(img.naturalHeight*s));
      const c=document.createElement("canvas"); c.width=w; c.height=h;
      c.getContext("2d").drawImage(img,0,0,w,h); URL.revokeObjectURL(url);
      c.toBlob(b=>{ if(b&&b.type==="image/webp") res(b); else c.toBlob(j=>j?res(j):rej(new Error("encode")),"image/jpeg",0.7); },"image/webp",FOTO_Q);
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); rej(new Error("decode")); };
    img.src=url;
  });
}
const kb=n=>Math.max(1,Math.round(n/1024))+" KB";

/* ---------- word card ---------- */
function bildSvg(id){ return (typeof BILDER!=="undefined"&&BILDER[id])?`<svg viewBox="0 0 120 80" aria-hidden="true">${BILDER[id]}</svg>`:""; }
// the picture slot inside the card: shows the drawing right away, your photo replaces it once loaded
function picSlot(w){ const s=bildSvg(w.id); return `<div class="pic" id="wpic" data-id="${w.id}"${s?"":" hidden"}>${s}</div>`; }
function picButtons(){ return `<input type="file" accept="image/*" id="picIn" hidden><div id="picBtns"></div>`; }
let _picURL=null;
function bindPic(w,redraw){
  const id=w.id, slot=$("#wpic"), btns=$("#picBtns"), inp=$("#picIn"); if(!slot||!btns||!inp) return;
  const draw=has=>{
    btns.innerHTML=has
      ?`<div class="row2"><button class="btn ghost" id="picAdd">${L("Foto ändern","Change photo")}</button><button class="btn ghost" id="picDel">${L("Foto entfernen","Remove photo")}</button></div>`
      :`<button class="btn ghost" id="picAdd">${L("Eigenes Foto hinzufügen","Add your own photo")}</button>`;
    $("#picAdd").onclick=()=>inp.click();
    const d=$("#picDel"); if(d) d.onclick=()=>fotoDel(id).then(()=>{ toast(bildSvg(id)?L("Foto entfernt. Die Zeichnung ist wieder da.","Photo removed. The drawing is back."):L("Foto entfernt","Photo removed")); redraw(); }).catch(()=>toast(L("Konnte das Foto nicht löschen","Couldn't remove the photo")));
  };
  inp.onchange=()=>{
    const f=inp.files&&inp.files[0]; inp.value=""; if(!f) return;
    toast(L("Foto wird verkleinert …","Shrinking photo …"));
    shrinkPhoto(f).then(b=>fotoPut(id,b).then(()=>{
      try{ navigator.storage&&navigator.storage.persist&&navigator.storage.persist(); }catch(e){}
      toast(L(`Foto gespeichert (${kb(b.size)})`,`Photo saved (${kb(b.size)})`)); redraw();
    })).catch(()=>toast(L("Dieses Foto ließ sich nicht öffnen. Versuch ein anderes.","Couldn't open this photo. Try another one.")));
  };
  fotoGet(id).then(b=>{
    if(slot.dataset.id!=String(id)||!document.body.contains(slot)) return;
    if(b){ if(_picURL) URL.revokeObjectURL(_picURL); _picURL=URL.createObjectURL(b);
      slot.innerHTML=`<img src="${_picURL}" alt="${L("Dein Foto","Your photo")}">`; slot.classList.add("foto"); slot.hidden=false; }
    draw(!!b);
  }).catch(()=>{ btns.innerHTML=`<p class="muted small" style="text-align:center">${L("Fotos gehen in dieser Ansicht nicht.","Photos don't work in this view.")}</p>`; });
}

/* ---------- backup file with photos (Mehr) ---------- */
function fotoBackupHTML(){
  return `<div class="h2">${L("Sicherungsdatei mit Fotos","Backup file with photos")}</div>
   <p class="muted small" id="fotoN">${L("Der Code oben enthält deine Fotos nicht. Die Datei enthält Fortschritt und Fotos.","The code above doesn't include your photos. The file has your progress and your photos.")}</p>
   <button class="btn petrol" id="fSave">${L("Sicherungsdatei speichern","Save backup file")}</button>
   <input type="file" accept=".json,application/json" id="fIn" hidden>
   <button class="btn ghost" id="fLoad">${L("Sicherungsdatei laden","Load backup file")}</button>`;
}
const blobToData=b=>new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(r.error); r.readAsDataURL(b); });
function dataToBlob(d){ const m=/^data:([^;]+);base64,(.*)$/.exec(d); if(!m) throw 0; const s=atob(m[2]), u=new Uint8Array(s.length); for(let i=0;i<s.length;i++) u[i]=s.charCodeAt(i); return new Blob([u],{type:m[1]}); }
function bindFotoBackup(){
  fotoAll().then(all=>{ const n=Object.keys(all).length, sz=Object.values(all).reduce((a,b)=>a+b.size,0), p=$("#fotoN");
    if(p) p.textContent+=" "+L(`Du hast ${n} eigene Fotos (${kb(sz)}).`,`You have ${n} photos of your own (${kb(sz)}).`); }).catch(()=>{});
  $("#fSave").onclick=()=>{
    fotoAll().catch(()=>({})).then(async all=>{
      const fotos={}; for(const k in all) fotos[k]=await blobToData(all[k]);
      const blob=new Blob([JSON.stringify({app:"deutsch-b1",v:1,db:DB,fotos})],{type:"application/json"});
      const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`deutsch-b1-sicherung-${today()}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
      toast(L(`Datei gespeichert (${kb(blob.size)})`,`File saved (${kb(blob.size)})`));
    });
  };
  const inp=$("#fIn"); $("#fLoad").onclick=()=>inp.click();
  inp.onchange=()=>{
    const f=inp.files&&inp.files[0]; inp.value=""; if(!f) return;
    f.text().then(async t=>{
      const p=JSON.parse(t); if(!p||!p.db||typeof p.db.cards!=="object") throw 0;
      DB=Object.assign(FRESH(),p.db); migrate(); LEVELS.forEach(rebuildSeq); save();
      let n=0; for(const k in (p.fotos||{})){ try{ await fotoPut(+k,dataToBlob(p.fotos[k])); n++; }catch(e){} }
      toast(L(`Geladen: Fortschritt und ${n} Fotos`,`Loaded: progress and ${n} photos`)); go("home");
    }).catch(()=>toast(L("Diese Datei ist keine gültige Sicherung.","That file isn't a valid backup.")));
  };
}
