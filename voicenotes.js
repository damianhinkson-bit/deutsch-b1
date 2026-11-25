/* =================================================================== VOICE NOTES
   Every MP3 the app makes is kept on the phone (IndexedDB "b1-voicenotes"), one per atom
   and text (making it again replaces it). Plus MP3s added from the phone's files.
   One shared player for the whole app: keeps playing when you change page or turn the
   screen off (lock-screen controls via Media Session), play all in a row, repeat one,
   0.75× speed. A small bar above the tabs shows what's playing.
   Voice notes are NOT part of any backup: they can be made again from the atom.        */

const VN_DB = "b1-voicenotes", VN_ST = "notes";
let _vndb = null;
function vndb() {
  if (!_vndb) _vndb = new Promise((res, rej) => {
    try {
      const r = indexedDB.open(VN_DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(VN_ST, { keyPath: "id" });
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  }).catch(e => { _vndb = null; throw e; });
  return _vndb;
}
function vnReq(mode, fn) {
  return vndb().then(db => new Promise((res, rej) => {
    const t = db.transaction(VN_ST, mode), q = fn(t.objectStore(VN_ST));
    t.oncomplete = () => res(q ? q.result : undefined); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
  }));
}
const vnGet = id => vnReq("readonly", s => s.get(id));
const vnDel = id => vnReq("readwrite", s => s.delete(id));
function vnPut(rec) {
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { }); } catch (e) { }
  return vnReq("readwrite", s => s.put(rec));
}
/* all notes, newest first */
function vnAll() { return vnReq("readonly", s => s.getAll()).then(l => (l || []).sort((a, b) => b.at - a.at)).catch(() => []); }
const vnId = (atomId, which) => `${atomId}:${which}`;
/* called when an atom is deleted */
function vnDelAtom(atomId) { return vnAll().then(l => Promise.all(l.filter(r => r.atomId === atomId).map(r => vnDel(r.id)))).catch(() => { }); }

const vnKind = r => r.which === "up" ? L("B1-Version", "B1 version") : r.which === "mine" ? L("Mein Text", "My text") : L("Vom Handy", "From your phone");
const vnTime = s => `${Math.floor((s || 0) / 60)}:${String(Math.round(s || 0) % 60).padStart(2, "0")}`;
const vnDay = t => { try { return new Date(t).toLocaleDateString(EN() ? "en-GB" : "de-DE", { day: "numeric", month: "short" }); } catch (e) { return ""; } };
const VN_IC = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" class="f"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" class="f"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M6 5v14l9-7z" class="f"/><path d="M17 5v14"/></svg>',
  rep: '<svg viewBox="0 0 24 24"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};

/* ---------- the shared player ---------- */
const VN = { q: [], i: 0, cur: null, url: null, au: null };
const vnRate = () => (DB.vnRate === 0.75 ? 0.75 : 1);
const vnRep = () => !!DB.vnRep;
function vnAudio() {
  if (VN.au) return VN.au;
  const au = VN.au = new Audio(); au.preload = "auto";
  au.onended = () => { if (VN.i + 1 < VN.q.length) vnLoad(VN.i + 1, true); else { VN.au.currentTime = 0; vnSync(); } };
  au.onplay = au.onpause = () => vnSync();
  au.ontimeupdate = () => vnProg();
  au.onerror = () => { if (VN.cur) toast(L("Diese Sprachnotiz lässt sich nicht abspielen.", "This voice note can't be played.")); };
  try {
    const ms = navigator.mediaSession;
    if (ms) {
      ms.setActionHandler("play", () => au.play().catch(() => { }));
      ms.setActionHandler("pause", () => au.pause());
      ms.setActionHandler("nexttrack", () => vnNext());
      ms.setActionHandler("previoustrack", () => { if (au.currentTime > 3 || VN.i === 0) au.currentTime = 0; else vnLoad(VN.i - 1, true); });
      ms.setActionHandler("seekbackward", d => { au.currentTime = Math.max(0, au.currentTime - ((d && d.seekOffset) || 10)); });
      ms.setActionHandler("seekforward", d => { au.currentTime = Math.min(au.duration || 0, au.currentTime + ((d && d.seekOffset) || 10)); });
    }
  } catch (e) { }
  return au;
}
/* play a list of note ids, starting at index i */
function vnPlay(ids, i = 0) { VN.q = ids.slice(); vnLoad(i, true); }
async function vnLoad(i, autoplay) {
  const id = VN.q[i]; if (!id) return;
  let rec; try { rec = await vnGet(id); } catch (e) { rec = null; }
  if (!rec || !rec.blob) { toast(L("Sprachnotiz nicht gefunden", "Voice note not found")); return; }
  const au = vnAudio();
  if (VN.url) URL.revokeObjectURL(VN.url);
  VN.i = i; VN.cur = { id: rec.id, title: rec.title, which: rec.which, secs: rec.secs };
  VN.url = URL.createObjectURL(rec.blob);
  au.src = VN.url; au.loop = vnRep(); au.defaultPlaybackRate = au.playbackRate = vnRate();
  try { au.preservesPitch = true; } catch (e) { }
  try {
    if (navigator.mediaSession && window.MediaMetadata)
      navigator.mediaSession.metadata = new MediaMetadata({ title: rec.title, artist: vnKind(rec), album: "Deutsch B1", artwork: [{ src: "icon-512.png", sizes: "512x512", type: "image/png" }] });
  } catch (e) { }
  if (autoplay) au.play().catch(() => { });
  vnSync();
}
function vnToggle() { const au = vnAudio(); if (!VN.cur) return; if (au.paused) au.play().catch(() => { }); else au.pause(); }
function vnNext() { if (VN.i + 1 < VN.q.length) vnLoad(VN.i + 1, true); }
function vnStop() {
  const au = VN.au; if (au) { au.pause(); au.removeAttribute("src"); au.load(); }
  if (VN.url) URL.revokeObjectURL(VN.url); VN.url = null; VN.cur = null; VN.q = []; VN.i = 0;
  try { if (navigator.mediaSession) navigator.mediaSession.metadata = null; } catch (e) { }
  vnSync();
}
function vnSetRate(r) { DB.vnRate = r; save(); if (VN.au) { VN.au.defaultPlaybackRate = VN.au.playbackRate = r; } vnSync(); }
function vnSetRep(on) { DB.vnRep = on; save(); if (VN.au) VN.au.loop = on; vnSync(); }
const vnPlaying = () => !!(VN.cur && VN.au && !VN.au.paused);

/* ---------- the bar above the tabs ---------- */
function vnBar() {
  let b = document.getElementById("vnBar");
  if (!b) { b = document.createElement("div"); b.id = "vnBar"; b.className = "vnbar"; b.hidden = true; document.body.appendChild(b); }
  return b;
}
function vnProg() {
  const au = VN.au; if (!au) return;
  const p = au.duration ? Math.min(100, au.currentTime / au.duration * 100) : 0;
  document.querySelectorAll(".vn-prog i").forEach(i => i.style.width = p + "%");
  const t = document.getElementById("vnT"); if (t) t.textContent = `${vnTime(au.currentTime)} / ${vnTime(au.duration || (VN.cur && VN.cur.secs))}`;
}
function vnSync() {
  const b = vnBar(), on = !!VN.cur;
  document.body.classList.toggle("vn-on", on);
  if (!on) { b.hidden = true; b.innerHTML = ""; }
  else {
    const tabs = document.querySelector(".tabs"); b.style.bottom = (tabs ? tabs.offsetHeight : 64) + "px";
    b.hidden = false;
    b.innerHTML = `<div class="vnbar-in"><button class="vb main" id="vnPP" aria-label="${vnPlaying() ? L("Pause", "Pause") : L("Abspielen", "Play")}">${vnPlaying() ? VN_IC.pause : VN_IC.play}</button>
      <button class="vn-tx" id="vnOpen"><b>${esc(VN.cur.title)}</b><span><span>${esc(vnKind(VN.cur))}${VN.q.length > 1 ? ` · ${VN.i + 1}/${VN.q.length}` : ""}</span><span id="vnT"></span></span></button>
      <button class="vb sp ${vnRate() !== 1 ? "on" : ""}" id="vnRt" aria-label="${L("Tempo", "Speed")}">${vnRate() === 1 ? "1×" : "0.75×"}</button>
      <button class="vb ${vnRep() ? "on" : ""}" id="vnRp" aria-pressed="${vnRep()}" aria-label="${L("Wiederholen", "Repeat")}">${VN_IC.rep}</button>
      ${VN.i + 1 < VN.q.length ? `<button class="vb" id="vnNx" aria-label="${L("Nächste", "Next")}">${VN_IC.next}</button>` : ""}
      <button class="vb" id="vnX" aria-label="${L("Schließen", "Close")}">${VN_IC.x}</button></div><div class="vn-prog"><i></i></div>`;
    b.querySelector("#vnPP").onclick = vnToggle;
    b.querySelector("#vnOpen").onclick = () => vnPage();
    b.querySelector("#vnRt").onclick = () => vnSetRate(vnRate() === 1 ? 0.75 : 1);
    b.querySelector("#vnRp").onclick = () => vnSetRep(!vnRep());
    const nx = b.querySelector("#vnNx"); if (nx) nx.onclick = vnNext;
    b.querySelector("#vnX").onclick = vnStop;
  }
  // rows on the current page
  document.querySelectorAll("[data-vnp]").forEach(btn => {
    const cur = !!(VN.cur && VN.cur.id === btn.dataset.vnp), pl = cur && vnPlaying();
    btn.innerHTML = pl ? VN_IC.pause : VN_IC.play; btn.classList.toggle("on", cur);
    const row = btn.closest(".vn-row"); if (row) row.classList.toggle("cur", cur);
  });
  document.querySelectorAll("[data-vnrate]").forEach(c => c.setAttribute("aria-pressed", String(+c.dataset.vnrate === vnRate())));
  const rp = document.getElementById("vnRepSw"); if (rp) { rp.setAttribute("aria-pressed", String(vnRep())); const s = rp.querySelector(".sw"); if (s) s.classList.toggle("on", vnRep()); }
  vnProg();
}

/* ---------- a list of notes (used on the page and on each atom) ---------- */
function vnRowsHtml(list, opts = {}) {
  return list.map(r => `<div class="vn-row" data-row="${esc(r.id)}">
    <button class="vplay" data-vnp="${esc(r.id)}" aria-label="${L("Abspielen", "Play")}">${VN_IC.play}</button>
    <div class="tx"><b>${esc(opts.kindOnly ? vnKind(r) : r.title)}</b><span class="muted small">${opts.kindOnly ? "" : esc(vnKind(r)) + " · "}${vnTime(r.secs)} · ${vnDay(r.at)}${opts.stale && opts.stale(r) ? ` · <span style="color:var(--bad)">${L("Text inzwischen geändert", "text changed since")}</span>` : ""}</span></div>
    <button class="vdel" data-vnd="${esc(r.id)}" aria-label="${L("Löschen", "Delete")}">${VN_IC.x}</button></div>`).join("");
}
function vnBindRows(host, list, after) {
  const ids = list.map(r => r.id);
  host.querySelectorAll("[data-vnp]").forEach(b => b.onclick = () => {
    const id = b.dataset.vnp;
    if (VN.cur && VN.cur.id === id) { vnToggle(); return; }
    vnPlay(ids, ids.indexOf(id));
  });
  host.querySelectorAll("[data-vnd]").forEach(b => {
    let armed = false;
    b.onclick = async () => {
      if (!armed) { armed = true; b.classList.add("armed"); b.textContent = L("Löschen?", "Delete?"); return; }
      const id = b.dataset.vnd; if (VN.cur && VN.cur.id === id) vnStop();
      try { await vnDel(id); toast(L("Sprachnotiz gelöscht", "Voice note deleted")); } catch (e) { toast(L("Löschen ging nicht", "Couldn't delete")); }
      after();
    };
  });
  vnSync();
}

/* ---------- on the atom page: this atom's notes ---------- */
async function vnAtomList(host, a, texts) {
  if (!host) return;
  const list = (await vnAll()).filter(r => r.atomId === a.id).sort((x, y) => (x.which === "mine" ? 0 : 1) - (y.which === "mine" ? 0 : 1));
  if (!host.isConnected) return;
  if (!list.length) { host.innerHTML = ""; return; }
  host.innerHTML = `<div class="vn-list" style="margin-top:12px">${vnRowsHtml(list, { kindOnly: true, stale: r => texts[r.which] != null && r.src != null && r.src !== texts[r.which] })}</div>
    <button class="linkbtn" id="vnAll">${L("Alle Sprachnotizen ›", "All voice notes ›")}</button>`;
  vnBindRows(host, list, () => vnAtomList(host, a, texts));
  host.querySelector("#vnAll").onclick = () => vnPage(() => atomDetail(a.id), L("Atom", "Atom"));
}

/* ---------- the Voice notes page (from More) ---------- */
let vnBackFn = null, vnBackLbl = "";
async function vnPage(back, backLbl) {
  if (typeof back === "function") { vnBackFn = back; vnBackLbl = backLbl || ""; }
  else if (back === undefined && !document.getElementById("vnPageMark")) { vnBackFn = null; vnBackLbl = ""; }
  const list = await vnAll();
  const mb = list.reduce((n, r) => n + ((r.blob && r.blob.size) || 0), 0) / 1e6;
  const body = `<span id="vnPageMark" hidden></span>
    <p class="muted" style="margin-top:4px">${L("Jede MP3, die du bei einem Atom machst, landet hier. Sie spielt weiter, wenn du die Seite wechselst oder den Bildschirm ausmachst.", "Every MP3 you make on an atom lands here. It keeps playing when you change page or turn the screen off.")}</p>
    ${list.length ? `<button class="btn primary" id="vnPlayAll">${L(`Alle abspielen (${list.length})`, `Play all (${list.length})`)}</button>
    <div class="ctl" style="margin-top:12px"><div class="ctl-t"><b>${L("Tempo", "Speed")}</b></div>
      <div class="seg" role="group"><button data-vnrate="1" aria-pressed="${vnRate() === 1}">1×</button><button data-vnrate="0.75" aria-pressed="${vnRate() === 0.75}">0.75×</button></div></div>
    <button class="row-sw" id="vnRepSw" aria-pressed="${vnRep()}"><span class="tx"><b>${L("Eine wiederholen", "Repeat one")}</b><span class="muted small">${L("Die aktuelle Notiz läuft immer wieder.", "The current note plays over and over.")}</span></span><span class="sw ${vnRep() ? "on" : ""}"><i></i></span></button>
    <div class="vn-list" style="margin-top:14px">${vnRowsHtml(list)}</div>
    <p class="muted small" style="margin:8px 2px 0">${list.length} ${L("Notizen", "notes")} · ${mb < 0.1 ? "<0.1" : mb.toFixed(1)} MB. ${L("Nicht in der Sicherung: du kannst sie beim Atom jederzeit neu machen.", "Not in your backup: you can make them again on the atom any time.")}</p>`
      : `<div class="note">${L("Noch keine Sprachnotizen. Öffne ein Atom und tippe unter „Als MP3 speichern“ auf „Mein Text“ oder „B1-Version“.", "No voice notes yet. Open an atom and, under “Save as MP3”, tap “My text” or “B1 version”.")}</div>`}
    <input type="file" accept="audio/*,.mp3" id="vnIn" hidden>
    <button class="btn ghost" id="vnAdd">${L("MP3 vom Handy hinzufügen", "Add an MP3 from your phone")}</button>
    <p class="muted small" style="margin:6px 2px 0">${L("Zum Beispiel eine MP3, die du schon in „Downloads“ gespeichert hast.", "For example an MP3 you already saved to Downloads.")}</p>`;
  shell(L("Sprachnotizen", "Voice notes"), body, { back: vnBackLbl || L("Mehr", "More"), backTo: "mehr", redraw: () => vnPage(null) });
  if (vnBackFn) { const f = vnBackFn; $("#back").onclick = () => { vnBackFn = null; f(); }; }
  const host = $("#app");
  vnBindRows(host, list, () => vnPage(null));
  const pa = $("#vnPlayAll"); if (pa) pa.onclick = () => vnPlay(list.map(r => r.id), 0);
  host.querySelectorAll("[data-vnrate]").forEach(c => c.onclick = () => vnSetRate(+c.dataset.vnrate));
  const rs = $("#vnRepSw"); if (rs) rs.onclick = () => vnSetRep(!vnRep());
  const inp = $("#vnIn");
  $("#vnAdd").onclick = () => inp.click();
  inp.onchange = async () => {
    const f = inp.files && inp.files[0]; inp.value = ""; if (!f) return;
    const secs = await vnDuration(f);
    const title = (f.name || "MP3").replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "MP3";
    try { await vnPut({ id: "f" + Date.now().toString(36), atomId: null, which: "file", title, blob: f, secs, at: Date.now() }); toast(L("Hinzugefügt", "Added")); }
    catch (e) { toast(L("Speichern ging nicht. Ist der Speicher voll?", "Couldn't save. Is the phone storage full?")); }
    vnPage(null);
  };
}
function vnDuration(blob) {
  return new Promise(res => {
    let done = false; const url = URL.createObjectURL(blob), a = new Audio();
    const fin = s => { if (done) return; done = true; URL.revokeObjectURL(url); res(isFinite(s) ? Math.round(s) : 0); };
    a.preload = "metadata"; a.onloadedmetadata = () => fin(a.duration); a.onerror = () => fin(0);
    setTimeout(() => fin(0), 5000); a.src = url;
  });
}

/* the row in More */
function vnMehrRow() {
  return `<button class="row-sw" id="vnMehr"><span class="tx"><b>${L("Sprachnotizen", "Voice notes")}</b><span class="muted small" id="vnMehrN">${L("Deine gespeicherten MP3s anhören", "Listen to your saved MP3s")}</span></span><span class="spk">${VN_IC.play}</span></button>`;
}
function bindVnMehr() {
  const b = document.getElementById("vnMehr"); if (!b) return;
  b.onclick = () => vnPage();
  vnAll().then(l => { const n = document.getElementById("vnMehrN"); if (n && l.length) n.textContent = L(`${l.length} gespeichert · anhören`, `${l.length} saved · listen`); });
}
