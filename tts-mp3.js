/* =================================================================== SAVE AS MP3
   The phone's own voice (speechSynthesis) can't be recorded, so saving uses an
   offline German voice that runs inside the app: Piper "Thorsten" (medium) on
   onnxruntime-web, with espeak-ng (German only) for pronunciation, and lamejs for MP3.
   Everything lives in ./tts/ and is downloaded once into its own cache
   ("b1-voice-v1"), which survives app updates. After that it works offline.     */

const VOICE_CACHE = "b1-voice-v1";
/* [path, bytes, pieces]. Big files are stored on GitHub in 5 MB pieces (name.p00, name.p01 …).
   Each piece is saved as soon as it arrives, so a stopped download carries on where it left off. */
const VOICE_FILES = [
  ["tts/thorsten.onnx", 63149190, 13],
  ["tts/ort-wasm-simd.wasm", 10595041, 3],
  ["tts/piper_phonemize.data", 888032, 0],
  ["tts/piper_phonemize.wasm", 635212, 0],
  ["tts/lamejs.js", 169114, 0],
  ["tts/ort.wasm.min.js", 142930, 0],
  ["tts/piper_phonemize.js", 111500, 0],
  ["tts/thorsten.onnx.json", 4819, 0]
];
const VOICE_PART = 5 * 1024 * 1024;
const VOICE_TOTAL = VOICE_FILES.reduce((n, f) => n + f[1], 0);
const VOICE_MB = Math.round(VOICE_TOTAL / 1e6);
let VOICE = null;          // { ort, sess, cfg, phon } once loaded
let VOICE_LOADING = null;  // promise while loading
let VOICE_DL = null;       // { promise, got, subs } while downloading

/* every piece to fetch: [cache key, bytes] */
function voicePieces() {
  const out = [];
  VOICE_FILES.forEach(([p, size, parts]) => {
    if (!parts) { out.push([p, size, p]); return; }
    for (let i = 0; i < parts; i++) out.push([p + ".p" + String(i).padStart(2, "0"), Math.min(VOICE_PART, size - i * VOICE_PART), p]);
  });
  return out;
}
/* bytes already saved (a file saved whole by the old version counts too) */
async function voiceSaved() {
  try {
    const c = await caches.open(VOICE_CACHE); let n = 0;
    for (const [p, size, parts] of VOICE_FILES) {
      if (parts && await c.match(p)) { n += size; continue; }
      for (const [k, b, f] of voicePieces()) if (f === p && await c.match(k)) n += b;
    }
    return n;
  } catch (e) { return 0; }
}
async function voiceCached() { return (await voiceSaved()) >= VOICE_TOTAL; }

/* keep the screen on while downloading (a locked phone stops the download) */
let VOICE_WAKE = null;
async function voiceWakeOn() { try { if (navigator.wakeLock && document.visibilityState === "visible") VOICE_WAKE = await navigator.wakeLock.request("screen"); } catch (e) { } }
function voiceWakeOff() { try { if (VOICE_WAKE) VOICE_WAKE.release(); } catch (e) { } VOICE_WAKE = null; }
document.addEventListener("visibilitychange", () => { if (VOICE_DL && document.visibilityState === "visible") voiceWakeOn(); });

/* fetch every missing piece into the voice cache, reporting bytes. One download at a time;
   a second caller (atom page and More) just listens to the running one. */
function voiceDownload(onProg) {
  if (VOICE_DL) { if (onProg) VOICE_DL.subs.push(onProg); return VOICE_DL.promise; }
  const dl = { got: 0, subs: onProg ? [onProg] : [] };
  const tell = () => dl.subs.forEach(f => { try { f(dl.got, VOICE_TOTAL); } catch (e) { } });
  dl.promise = (async () => {
    // ask Chrome to keep the voice before downloading, so a half-finished download isn't cleared
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { }
    await voiceWakeOn();
    const c = await caches.open(VOICE_CACHE);
    const whole = new Set(); for (const [p, , parts] of VOICE_FILES) if (parts && await c.match(p)) whole.add(p);
    for (const [k, size, f] of voicePieces()) {
      if (whole.has(f) || await c.match(k)) { dl.got += size; tell(); continue; }
      const res = await fetch(k, { cache: "no-store" });
      if (!res.ok || !res.body) throw new Error("download " + k + " " + res.status);
      const rd = res.body.getReader(), parts = []; let got = 0;
      for (;;) { const { done: end, value } = await rd.read(); if (end) break; parts.push(value); got += value.length; dl.got += value.length; tell(); }
      dl.got += size - got;
      await c.put(k, new Response(new Blob(parts), { headers: { "Content-Type": res.headers.get("Content-Type") || "application/octet-stream" } }));
      tell();
    }
  })();
  VOICE_DL = dl;
  return dl.promise.finally(() => { VOICE_DL = null; voiceWakeOff(); });
}

/* a file as one blob: saved whole (old version) or put back together from its pieces */
async function vBlob(c, p) {
  const r = await c.match(p); if (r) return r.blob();
  const ps = voicePieces().filter(x => x[2] === p && x[0] !== p);
  if (!ps.length) throw new Error("missing " + p);
  const bl = []; for (const [k] of ps) { const x = await c.match(k); if (!x) throw new Error("missing " + k); bl.push(await x.blob()); }
  return new Blob(bl);
}
async function vBlobUrl(c, p, type) { const b = await vBlob(c, p); return URL.createObjectURL(type ? new Blob([b], { type }) : b); }
function vScript(url) { return new Promise((ok, bad) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => bad(new Error("script")); document.head.appendChild(s); }); }

async function voiceLoad(onProg) {
  if (VOICE) return VOICE;
  if (VOICE_LOADING) return VOICE_LOADING;
  VOICE_LOADING = (async () => {
    if (!(await voiceCached())) await voiceDownload(onProg || (() => { }));
    const c = await caches.open(VOICE_CACHE);
    if (!window.ort) await vScript(await vBlobUrl(c, "tts/ort.wasm.min.js", "text/javascript"));
    if (!window.createPiperPhonemize) await vScript(await vBlobUrl(c, "tts/piper_phonemize.js", "text/javascript"));
    if (!window.lamejs) await vScript(await vBlobUrl(c, "tts/lamejs.js", "text/javascript"));
    const ort = window.ort;
    ort.env.wasm.numThreads = 1;   // GitHub Pages can't enable threads
    ort.env.wasm.proxy = false;
    ort.env.wasm.wasmPaths = { "ort-wasm-simd.wasm": await vBlobUrl(c, "tts/ort-wasm-simd.wasm", "application/wasm") };
    const cfg = JSON.parse(await (await vBlob(c, "tts/thorsten.onnx.json")).text());
    const model = await (await vBlob(c, "tts/thorsten.onnx")).arrayBuffer();
    const sess = await ort.InferenceSession.create(model, { executionProviders: ["wasm"] });
    const phon = { wasm: await vBlobUrl(c, "tts/piper_phonemize.wasm", "application/wasm"), data: await vBlobUrl(c, "tts/piper_phonemize.data") };
    VOICE = { ort, sess, cfg, phon };
    return VOICE;
  })();
  try { return await VOICE_LOADING; } catch (e) { VOICE_LOADING = null; throw e; }
}

/* text -> phoneme ids (one fresh espeak module per call, as Piper's web build expects) */
function voicePhonemes(text) {
  return new Promise((ok, bad) => {
    let done = false;
    window.createPiperPhonemize({
      print: d => { if (done) return; try { done = true; ok(JSON.parse(d).phoneme_ids); } catch (e) { bad(e); } },
      printErr: m => { if (!done && /error/i.test(m)) { done = true; bad(new Error(m)); } },
      locateFile: u => u.endsWith(".wasm") ? VOICE.phon.wasm : u.endsWith(".data") ? VOICE.phon.data : u
    }).then(m => {
      m.callMain(["-l", VOICE.cfg.espeak.voice, "--input", JSON.stringify([{ text }]), "--espeak_data", "/espeak-ng-data"]);
      setTimeout(() => { if (!done) { done = true; bad(new Error("no phonemes")); } }, 15000);
    }, bad);
  });
}

async function voiceSentence(text) {
  const { ort, sess, cfg } = VOICE, ids = await voicePhonemes(text);
  const inf = cfg.inference || {};
  const feeds = {
    input: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor("float32", Float32Array.from([inf.noise_scale ?? 0.667, inf.length_scale ?? 1, inf.noise_w ?? 0.8]), [3])
  };
  if (cfg.num_speakers > 1) feeds.sid = new ort.Tensor("int64", BigInt64Array.from([0n]), [1]);
  const out = await sess.run(feeds);
  return (out.output || out[sess.outputNames[0]]).data;
}

/* whole text -> MP3 blob. Sentence by sentence, with a short natural gap between them. */
async function textToMp3(text, onStep) {
  const sr = VOICE.cfg.audio.sample_rate, gap = new Float32Array(Math.round(sr * 0.35));
  const sents = splitSents(text).filter(s => /[A-Za-zÄÖÜäöüß0-9]/.test(s));
  const pcm = [];
  for (let i = 0; i < sents.length; i++) {
    onStep(i, sents.length);
    pcm.push(await voiceSentence(sents[i]), gap);
    await new Promise(r => setTimeout(r, 0));
  }
  onStep(sents.length, sents.length);
  const n = pcm.reduce((k, p) => k + p.length, 0), all = new Int16Array(n);
  let o = 0; pcm.forEach(p => { for (let j = 0; j < p.length; j++) { const v = Math.max(-1, Math.min(1, p[j])); all[o++] = v < 0 ? v * 32768 : v * 32767; } });
  const enc = new window.lamejs.Mp3Encoder(1, sr, 64), out = [];
  for (let j = 0; j < all.length; j += 1152) { const b = enc.encodeBuffer(all.subarray(j, j + 1152)); if (b.length) out.push(new Uint8Array(b)); }
  const end = enc.flush(); if (end.length) out.push(new Uint8Array(end));
  return { blob: new Blob(out, { type: "audio/mpeg" }), secs: Math.round(all.length / sr) };
}

function mp3Name(title, which) {
  const base = String(title || "Atom").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "Atom";
  return `${base}-${which}.mp3`;
}

function voiceProgText(got, tot) {
  return L(`Stimme wird geladen (einmalig): ${Math.round(got / 1e6)} von ${Math.round(tot / 1e6)} MB. Lass die App offen. Wenn es abbricht, geht es beim nächsten Mal dort weiter.`, `Downloading the voice (once): ${Math.round(got / 1e6)} of ${Math.round(tot / 1e6)} MB. Keep the app open. If it stops, it carries on from there next time.`);
}

/* the row in More: is the voice on the phone, and download it now */
function voiceCtl() {
  return `<div class="row-sw" id="vcRow" style="cursor:default"><span class="tx"><b>${L("Deutsche Stimme für MP3", "German voice for MP3")}</b><span class="muted small" id="vcNote">${L("Wird geprüft …", "Checking …")}</span></span></div><div id="vcBtn"></div>`;
}
function bindVoiceCtl() {
  const note = document.getElementById("vcNote"), bh = document.getElementById("vcBtn"); if (!note || !bh) return;
  const show = got => {
    if (!note.isConnected) return;
    if (got >= VOICE_TOTAL) { note.textContent = L(`Auf dem Handy gespeichert (${VOICE_MB} MB). MP3s gehen jetzt offline.`, `Saved on your phone (${VOICE_MB} MB). MP3s now work offline.`) + " ✓"; bh.innerHTML = ""; return; }
    note.textContent = got > 0 ? L(`${Math.round(got / 1e6)} von ${VOICE_MB} MB gespeichert. Am besten im WLAN weiterladen.`, `${Math.round(got / 1e6)} of ${VOICE_MB} MB saved. Best to finish on Wi-Fi.`) : L(`Noch nicht geladen (${VOICE_MB} MB, einmalig). Am besten im WLAN.`, `Not downloaded yet (${VOICE_MB} MB, once). Best on Wi-Fi.`);
    bh.innerHTML = `<button class="btn petrol" id="vcGo">${got > 0 ? L("Weiterladen", "Continue download") : L("Stimme jetzt laden", "Download voice now")}</button>`;
    document.getElementById("vcGo").onclick = run;
  };
  const prog = (got, tot) => { if (note.isConnected) note.textContent = voiceProgText(got, tot); };
  const run = async () => {
    bh.innerHTML = "";
    try { await voiceDownload(prog); show(VOICE_TOTAL); toast(L("Stimme gespeichert", "Voice saved")); }
    catch (e) { voiceSaved().then(show); if (note.isConnected) toast(navigator.onLine === false ? L("Kein Internet. Später weiterladen.", "No internet. Continue later.") : L("Download unterbrochen. Tipp auf Weiterladen.", "Download stopped. Tap Continue download.")); }
  };
  if (VOICE_DL) { VOICE_DL.subs.push(prog); VOICE_DL.promise.then(() => show(VOICE_TOTAL), () => voiceSaved().then(show)); return; }
  voiceSaved().then(show);
}

/* the panel on the atom page: two buttons, progress, then play / save / share */
function mp3Block(host, a) {
  if (!host) return;
  const mine = (a.corr || a.sents.map(x => plain(x.de)).join(" ")).trim(), up = (a.up || "").trim();
  if (!mine && !up) { host.innerHTML = ""; return; }
  const draw = () => {
    host.innerHTML = `<div class="sec-h">${L("Als MP3 speichern", "Save as MP3")}</div>
      <div class="row2">${mine ? `<button class="btn ghost" data-mp3="mine">${L("Mein Text", "My text")}</button>` : ""}${up ? `<button class="btn ghost" data-mp3="up">${L("B1-Version", "B1 version")}</button>` : ""}</div>
      <p class="muted small" id="mp3Note" style="margin:6px 2px 0">${VOICE ? "" : L(`Beim ersten Mal lädt die App eine deutsche Stimme (${VOICE_MB} MB, einmalig). Danach geht es offline.`, `The first time, the app downloads a German voice (${VOICE_MB} MB, once). After that it works offline.`)}</p>
      <div id="mp3Out"></div><div id="vnAtom"></div>`;
    if (typeof vnAtomList === "function") vnAtomList(host.querySelector("#vnAtom"), a, { mine, up });
    voiceSaved().then(got => { const n = host.querySelector("#mp3Note"); if (!n || n.dataset.busy || VOICE) return; if (got >= VOICE_TOTAL) n.textContent = ""; else if (got > 0) n.textContent = L(`Stimme: ${Math.round(got / 1e6)} von ${VOICE_MB} MB schon gespeichert. Tipp auf einen Knopf, dann lädt sie weiter.`, `Voice: ${Math.round(got / 1e6)} of ${VOICE_MB} MB already saved. Tap a button and it carries on.`); });
    host.querySelectorAll("[data-mp3]").forEach(b => b.onclick = () => run(b.dataset.mp3));
  };
  const run = async which => {
    const btns = host.querySelectorAll("[data-mp3]"), note = host.querySelector("#mp3Note"), outEl = host.querySelector("#mp3Out");
    btns.forEach(b => b.disabled = true); note.dataset.busy = "1"; outEl.innerHTML = "";
    try {
      await voiceLoad((got, tot) => { if (note.isConnected) note.textContent = voiceProgText(got, tot); });
      note.textContent = L("Audio wird erstellt …", "Making the audio …");
      const { blob, secs } = await textToMp3(which === "up" ? up : mine, (i, n) => { note.textContent = i < n ? L(`Audio wird erstellt: Satz ${i + 1} von ${n}`, `Making the audio: sentence ${i + 1} of ${n}`) : L("MP3 wird gespeichert …", "Saving the MP3 …"); });
      const name = mp3Name(a.t, which === "up" ? "B1" : L("mein-Text", "my-text")), url = URL.createObjectURL(blob);
      const file = new File([blob], name, { type: "audio/mpeg" });
      const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
      let kept = false;
      if (typeof vnPut === "function") {
        try { await vnPut({ id: vnId(a.id, which), atomId: a.id, which, title: a.t || "Atom", blob, secs, src: which === "up" ? up : mine, at: Date.now() }); kept = true; } catch (e) { }
      }
      note.textContent = L(`Fertig: ${which === "up" ? "B1-Version" : "dein Text"}, ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")} Min.`, `Done: ${which === "up" ? "B1 version" : "your text"}, ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")} min.`)
        + " " + (kept ? L("In deinen Sprachnotizen gespeichert ✓", "Saved to your voice notes ✓") : L("Konnte nicht in der App gespeichert werden. Lade sie herunter.", "Couldn't keep it in the app. Download it instead."));
      outEl.innerHTML = `${kept ? "" : `<audio controls src="${url}" style="width:100%;margin:8px 0 4px"></audio>`}
        <div class="row2"><a class="btn ghost" href="${url}" download="${esc(name)}" style="text-align:center;text-decoration:none">${L("Auf dem Handy speichern", "Save to phone")}</a>${canShare ? `<button class="btn ghost" id="mp3Share">${L("Teilen", "Share")}</button>` : ""}</div>`;
      const sh = outEl.querySelector("#mp3Share"); if (sh) sh.onclick = () => navigator.share({ files: [file], title: name }).catch(() => { });
      if (kept) { vnAtomList(host.querySelector("#vnAtom"), a, { mine, up }).then(() => { VN.q = [vnId(a.id, which)]; vnLoad(0, false); }); }
    } catch (e) {
      note.textContent = navigator.onLine === false && !VOICE
        ? L("Für den ersten Download brauchst du Internet. Danach geht es offline.", "You need internet for the first download. After that it works offline.")
        : L("Das hat nicht geklappt. Versuch es nochmal.", "That didn't work. Please try again.") + " (" + (e && e.message || e) + ")";
    } finally { btns.forEach(b => b.disabled = false); delete note.dataset.busy; }
  };
  draw();
}
