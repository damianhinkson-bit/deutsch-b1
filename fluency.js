/* Fluency drills for Deutsch B1: Sag's schnell, Frage-Pingpong and the "Sagen" mode of the Redemittel deck.
   Uses the helpers from index.html (DB, L, say, shell …), the speech recognition from aktiv.js (recStart, SRC)
   and the atoms and rating labels from atome.js (allSents, RATE, claudeBlock). */

if (typeof SHK_PP_CAT !== "undefined") PP_CATS.beruf = SHK_PP_CAT;
const PINGPONG = PINGPONG_RAW.concat(typeof SHK_PP !== "undefined" ? SHK_PP : []).map(r => ({ id: r[1], cat: r[0], q: r[1], en: r[2], m: r[3] }));

function flDB() {
  if (!DB.fl || typeof DB.fl !== "object") DB.fl = {};
  const f = DB.fl;
  if (!f.s || typeof f.s !== "object") f.s = {};   // Sag's schnell: key -> {n, last, d}
  if (!f.q || typeof f.q !== "object") f.q = {};   // Pingpong: question -> {n, last, d}
  if (!f.fs) f.fs = { src: "mix", sec: 8, n: 20, mic: true };
  if (!f.pp) f.pp = { cat: "all", sec: 20, n: 10, mic: true, hide: false };
  return f;
}

/* ---------- styles ---------- */
(function addFlStyles() {
  const css = `
  .tbar{height:8px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin:14px 0 4px}
  .tbar i{display:block;height:100%;width:100%;background:var(--amber);transition:width .1s linear}
  .tbar.low i{background:var(--bad)}
  .tnum{font-variant-numeric:tabular-nums;font-weight:800;color:var(--muted);font-size:13px}
  .lstat{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:4px;min-height:20px}
  .lstat .st{font-size:13.5px;font-weight:800;color:var(--muted)}
  .lstat .st.on{color:var(--bad)}
  .heard{min-height:26px;font-size:17px;line-height:1.45;margin-top:10px;text-align:left}
  .heard .int{color:var(--muted);font-style:italic}
  .flcard .en{font-size:24px;line-height:1.3}
  .flcard .src{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .reveal{margin-top:14px;text-align:left}
  .reveal .tgt{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;font-size:20px;font-weight:800;line-height:1.35}
  .reveal .lab{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:12px 0 3px}
  .score{display:inline-block;font-size:12.5px;font-weight:800;border-radius:99px;padding:3px 10px;background:var(--surface-2);margin-top:8px}
  .score.hi{background:var(--good-tint);color:var(--good)} .score.lo{background:var(--bad-tint);color:var(--bad)}
  .rate-q{font-size:14px;font-weight:800;margin-top:16px;text-align:left}
  .hard{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)}
  .hard:last-child{border-bottom:0}
  .hard .e{color:var(--muted);font-size:14px}
  .pp-q{display:flex;gap:10px;align-items:flex-start;justify-content:space-between}
  .pp-q .tx{font-size:18px;font-weight:700;line-height:1.4}
  .pp-en{margin-top:6px;font-size:15px;color:var(--muted);font-style:italic}
  .pp-help{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
  .pp-help .chip{padding:6px 12px;font-size:13px}`;
  try { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); } catch (e) { }
})();

/* ---------- word matching ---------- */
function flKey(w) { return String(w).toLowerCase().replace(/[.,!?;:"„“'()«»…–-]/g, "").replace(/ß/g, "ss"); }
function flToks(s) { return String(s).replace(/…/g, " ").split(/\s+/).map(flKey).filter(Boolean); }
function flMatch(heard, target) {
  const A = flToks(heard), B = flToks(target), n = A.length, m = B.length;
  if (!m) return { hit: 0, total: 0 };
  if (!n) return { hit: 0, total: m };
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  return { hit: dp[0][0], total: m };
}
function scoreChip(heard, target) {
  if (!heard) return "";
  const r = flMatch(heard, target), p = r.total ? r.hit / r.total : 0;
  return `<span class="score ${p >= .8 ? "hi" : p < .5 ? "lo" : ""}">${L(`${r.hit} von ${r.total} Wörtern erkannt`, `${r.hit} of ${r.total} words recognised`)}</span>`;
}

/* ---------- one listening round: timer + microphone ----------
   o: { sec, mic, bar, num, stat, onFinal(text), onInterim(text), autoEnd(text) -> bool, onEnd(why), onMicError(msg) } */
let LR = null;
function lrStop() {
  const s = LR; LR = null;
  if (s) { s.dead = true; clearInterval(s.tick); clearTimeout(s.quiet); clearTimeout(s.late); }
  recStop();
}
function listenRound(o) {
  lrStop();
  const s = LR = { t0: Date.now(), dead: false, ended: false, over: false, interim: "", heard: "" };
  const end = why => {
    if (s.ended || s.dead) return;
    s.ended = true; clearInterval(s.tick); clearTimeout(s.quiet); clearTimeout(s.late);
    if (LR === s) LR = null;
    recStop();
    o.onEnd(why);
  };
  s.end = end;
  const draw = () => {
    if (!o.bar || !o.bar.isConnected) { if (LR === s) lrStop(); return; }
    if (s.frozen) return;
    const left = Math.max(0, o.sec - (Date.now() - s.t0) / 1000);
    o.bar.firstChild.style.width = (100 * left / o.sec) + "%";
    o.bar.classList.toggle("low", left <= Math.min(3, o.sec / 3));
    if (o.num) o.num.textContent = Math.ceil(left) + " s";
    if (left <= 0 && !s.over) {
      s.over = true;
      // still mid-sentence? give the recogniser a moment to finish
      if (s.interim) s.late = setTimeout(() => end("time"), 2500); else end("time");
    }
  };
  s.tick = setInterval(draw, 100); draw();
  const status = (on, txt) => { if (o.stat && o.stat.isConnected) { o.stat.classList.toggle("on", on); o.stat.textContent = txt; } };
  if (o.mic && SRC) {
    recStart({
      final: t => {
        if (s.dead || s.ended || !t) return;
        s.interim = ""; s.heard += (s.heard ? " " : "") + t;
        if (o.onFinal) o.onFinal(t);
        if (o.onInterim) o.onInterim("");
        clearTimeout(s.quiet);
        if (s.over) { end("time"); return; }
        if (o.autoEnd && o.autoEnd(s.heard)) s.quiet = setTimeout(() => end("done"), 1100);
      },
      interim: t => { if (s.dead || s.ended) return; s.interim = t; if (o.onInterim) o.onInterim(t); if (t) clearTimeout(s.quiet); },
      state: (on, m) => {
        if (s.dead || s.ended) return;
        status(on, on ? L("● Ich höre zu …", "● Listening …") : L("Mikrofon aus", "Mic off"));
        if (!on && m && o.onMicError) o.onMicError(m);
      }
    });
  } else status(false, L("Sag es laut.", "Say it out loud."));
}
/* wait until the app has finished speaking, then go on */
function afterSpeech(cb) {
  const sy = getSynth(); if (!sy) { cb(); return; }
  let quiet = 0, n = 0;
  const t = setInterval(() => {
    n++;
    let busy = false; try { busy = sy.speaking || sy.pending; } catch (e) { }
    quiet = busy ? 0 : quiet + 1;
    if ((n > 3 && quiet >= 2) || n > 100) { clearInterval(t); cb(); }
  }, 150);
}
function ratingRow() {
  return `<div class="g5" id="rate">${[1, 2, 3, 4, 5].map(n => `<button data-g="${n}" aria-label="${n} ${esc(T(RATE[n]))}"><b>${n}</b><span>${esc(T(RATE[n]))}</span></button>`).join("")}</div>`;
}
function bindRating(cb) {
  const row = $("#rate");
  row.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
    if (row.classList.contains("picked")) return;
    row.classList.add("picked"); b.classList.add("on");
    setTimeout(() => cb(+b.dataset.g), 220);
  });
}
function flRecord(store, k, g) {
  const c = store[k] || (store[k] = { n: 0, last: 0, d: "" });
  c.n++; c.last = g; c.d = today();
  save();
}
/* weak first (last rating 1–2, oldest first), then never practised, then the longest ago */
function flOrder(items, store, n) {
  const weak = [], fresh = [], rest = [];
  shuffle(items).forEach(it => { const c = store[it.k]; if (!c) fresh.push(it); else if (c.last <= 2) weak.push(it); else rest.push(it); });
  weak.sort((a, b) => store[a.k].d < store[b.k].d ? -1 : 1);
  rest.sort((a, b) => store[a.k].d < store[b.k].d ? -1 : store[a.k].d > store[b.k].d ? 1 : store[a.k].last - store[b.k].last);
  const nWeak = Math.min(weak.length, Math.ceil(n * 0.4));
  const out = weak.slice(0, nWeak).concat(fresh, rest, weak.slice(nWeak));
  return out.slice(0, n);
}
function micRow(on, id) {
  if (!SRC) return `<p class="muted small" style="margin-top:12px">${L("Spracherkennung geht nur in Chrome. Du sprichst laut, deckst auf und bewertest dich selbst.", "Speech recognition only works in Chrome. You say it out loud, reveal, and rate yourself.")}</p>`;
  return `<button class="row-sw" id="${id}" aria-pressed="${on}"><span class="tx"><b>${L("Mikrofon", "Microphone")}</b><span class="muted small">${L("Die App hört zu und zeigt, welche Wörter sie erkannt hat. Braucht Internet.", "The app listens and shows which words it recognised. Needs the internet.")}</span></span><span class="sw ${on ? "on" : ""}"><i></i></span></button>`;
}

/* =================================================================== SAG'S SCHNELL */
const FS_SRC = { mix: ["Gemischt", "Mixed"], w: ["Wörter", "Words"], a: ["Atome", "Atoms"], r: ["Redemittel", "Phrases"] };
function fsItems(src) {
  const out = [];
  if (src === "w" || src === "mix") {
    const ok = w => w.ex && w.exEn && !/\n|:/.test(w.ex) && words(w.ex) <= 14;
    const started = W.filter(w => DB.cards[w.id] && ok(w));
    let ws = started;
    if (ws.length < 60) { const have = new Set(ws.map(w => w.id)); ws = ws.concat(shuffle(LW().filter(w => ok(w) && !have.has(w.id))).slice(0, 120 - ws.length)); }
    // Handwerker-Modus: trade sentences always in the mix, the ones you've started first
    if (DB.shk && typeof isShk === "function") { const have = new Set(ws.map(w => w.id)); ws = ws.filter(w => !isShk(w)).concat(W.filter(w => isShk(w) && ok(w) && DB.cards[w.id]), shuffle(W.filter(w => isShk(w) && ok(w) && !have.has(w.id) && !DB.cards[w.id])).slice(0, 60)); }
    ws.forEach(w => out.push({ k: "w:" + w.id, src: "w", en: w.exEn, de: w.ex, note: full(w) }));
  }
  if ((src === "a" || src === "mix") && typeof allSents === "function") {
    allSents().forEach(({ a, s, si }) => { if (s.en && !s.wait && !s.pend) out.push({ k: "a:" + a.id + "#" + si, src: "a", en: s.en, de: plain(stripGuess(s.de)), note: a.t || "" }); });
  }
  if (src === "r" || src === "mix") {
    REDEMITTEL.forEach(r => out.push({ k: "r:" + r.id, src: "r", en: r.en, de: r.de, note: T([RM_CATS[r.cat][0], RM_CATS[r.cat][1]]) }));
  }
  return out;
}
function fsBuild(src, n) {
  const st = flDB().s;
  if (src !== "mix") return flOrder(fsItems(src), st, n);
  const all = fsItems("mix"), by = { w: [], a: [], r: [] };
  all.forEach(it => by[it.src].push(it));
  const want = { w: Math.round(n * .5), a: Math.round(n * .3) }; want.r = n - want.w - want.a;
  let pick = [];
  if (DB.shk && typeof isShk === "function") {
    // Handwerker-Modus: half of the word sentences come from the trade
    const sh = by.w.filter(it => isShk(BY[+it.k.slice(2)])), ot = by.w.filter(it => !isShk(BY[+it.k.slice(2)])), hs = Math.ceil(want.w / 2);
    pick = flOrder(sh, st, hs); pick = pick.concat(flOrder(ot, st, want.w - pick.length));
    ["a", "r"].forEach(k => { pick = pick.concat(flOrder(by[k], st, want[k])); });
  } else
  ["a", "r", "w"].forEach(k => { pick = pick.concat(flOrder(by[k], st, want[k])); });
  if (pick.length < n) { const have = new Set(pick.map(x => x.k)); pick = pick.concat(flOrder(all.filter(x => !have.has(x.k)), st, n - pick.length)); }
  return shuffle(pick);
}
function fsHub() {
  lrStop();
  const f = flDB(), p = f.fs;
  const weak = Object.values(f.s).filter(c => c.last && c.last <= 2).length, done = Object.keys(f.s).length;
  const nA = typeof allSents === "function" ? allSents().filter(({ s }) => s.en && !s.wait && !s.pend).length : 0;
  const chip = (k, v, l) => `<button class="chip" data-k="${k}" data-v="${v}" aria-pressed="${String(p[k]) === String(v)}">${esc(l)}</button>`;
  const body = `<p class="muted" style="margin-top:4px">${L("Du siehst einen englischen Satz und sagst ihn auf Deutsch, bevor die Zeit abläuft. Nicht nachdenken, einfach losreden. So wird Deutsch schneller abrufbar.", "You see an English sentence and say it in German before time runs out. Don't think, just start talking. This is how German gets faster to recall.")}</p>
    <div class="stats"><div><b>${done}</b><span>${L("geübt", "practised")}</span></div><div><b>${weak}</b><span>${L("noch schwer", "still hard")}</span></div><div><b>${nA}</b><span>${L("Atom-Sätze", "atom sentences")}</span></div></div>
    <div class="h2">${L("Sätze aus", "Sentences from")}</div>
    <div class="chips">${Object.keys(FS_SRC).map(k => chip("src", k, T(FS_SRC[k]))).join("")}</div>
    <div class="h2">${L("Zeit pro Satz", "Time per sentence")}</div>
    <div class="chips">${chip("sec", 5, "5 s")}${chip("sec", 8, "8 s")}${chip("sec", 12, "12 s")}</div>
    <div class="h2">${L("Wie viele", "How many")}</div>
    <div class="chips">${chip("n", 10, "10")}${chip("n", 20, "20")}${chip("n", 30, "30")}</div>
    ${micRow(p.mic, "fsMic")}
    <button class="btn primary" id="fsGo">${L("Los", "Start")}</button>
    <details class="fold"><summary>${L("So funktioniert's", "How it works")}</summary><div class="in"><p class="small" style="margin:0">${L("Die Sätze kommen aus deinen Wörtern (Beispielsätze), deinen Atomen und den Redemitteln. Wenn du fertig bist und kurz still bist, deckt die App auf. Dann hörst du die richtige Version und bewertest dich von 1 bis 5. Sätze mit 1 oder 2 kommen in derselben Runde noch einmal und beim nächsten Mal zuerst. Deine Atom-Wiederholungen ändert das nicht.", "Sentences come from your words (example sentences), your atoms and the useful phrases. When you've finished and pause briefly, the app reveals. You hear the right version and rate yourself 1 to 5. Sentences rated 1 or 2 come back once in the same round and first next time. It doesn't change your atom reviews.")}</p></div></details>`;
  shell("Sag's schnell", body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: fsHub });
  document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const k = b.dataset.k; p[k] = k === "src" ? b.dataset.v : +b.dataset.v; save(); fsHub(); });
  const m = $("#fsMic"); if (m) m.onclick = () => { p.mic = !p.mic; save(); fsHub(); };
  $("#fsGo").onclick = () => {
    const items = fsBuild(p.src, p.n);
    if (!items.length) { toast(p.src === "a" ? L("Du hast noch keine Atom-Sätze mit Englisch.", "You don't have any atom sentences with English yet.") : L("Keine Sätze gefunden.", "No sentences found.")); return; }
    FS = { queue: items, total: items.length, done: 0, sec: p.sec, mic: p.mic && !!SRC, res: [], again: {} };
    fsAsk();
  };
}
let FS = null;
function fsAsk() {
  const s = FS; if (!s) return;
  if (!s.queue.length) { fsFinish(); return; }
  const it = s.queue[0];
  const body = `<div class="prog"><i style="width:${100 * s.done / (s.done + s.queue.length)}%"></i></div>
    <div class="card flcard"><div class="src">${esc(T(FS_SRC[it.src]))}${it.note ? " · " + esc(it.note) : ""}</div>
      <div class="en">${esc(it.en)}</div>
      <div class="tbar" id="tb"><i></i></div>
      <div class="lstat"><span class="st" id="st"></span><span class="tnum" id="tn"></span></div>
      <div class="heard" id="hd"></div>
      <div id="rv"></div>
    </div>
    <div id="ctl"><button class="btn petrol" id="show">${L("Aufdecken", "Reveal")}</button></div>
    <div id="msg" class="msg"></div>`;
  shell("Sag's schnell", body, { back: L("Ende", "End"), backTo: "aktiv", redraw: null });
  $("#back").onclick = () => { lrStop(); hush(); if (s.res.length) fsFinish(); else fsHub(); };
  let fin = "", intr = "";
  const paint = () => { const h = $("#hd"); if (h) h.innerHTML = esc(fin) + (intr ? ` <span class="int">${esc(intr)}</span>` : ""); };
  const target = it.de;
  listenRound({
    sec: s.sec, mic: s.mic, bar: $("#tb"), num: $("#tn"), stat: $("#st"),
    onFinal: t => { fin += (fin ? " " : "") + t; paint(); },
    onInterim: t => { intr = t; paint(); },
    autoEnd: h => { const r = flMatch(h, target); return r.total && (r.hit / r.total >= .7 || flToks(h).length >= r.total); },
    onMicError: m => { s.mic = false; const g = $("#msg"); if (g) g.textContent = m + " " + L("Weiter ohne Mikrofon.", "Carrying on without the mic."); },
    onEnd: why => fsReveal(it, fin.trim(), why)
  });
  $("#show").onclick = () => { if (LR && LR.end) LR.end("tap"); else fsReveal(it, fin.trim(), "tap"); };
}
function fsReveal(it, heard, why) {
  const s = FS; if (!s || !$("#rv")) return;
  lrStop();
  $("#tb").style.visibility = "hidden"; $("#st").textContent = why === "time" && !heard ? L("Zeit um!", "Time's up!") : ""; $("#tn").textContent = "";
  $("#hd").innerHTML = "";
  const tts = TTS ? `<button class="spk" data-say="${esc(it.de.replace(/…/g, ""))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : "";
  $("#rv").innerHTML = `<div class="reveal"><div class="tgt"><span>${esc(it.de)}</span>${tts}</div>
    ${heard ? `<div class="lab">${L("Gehört", "Heard")}</div><div class="diff">${diffHtml(heard, it.de.replace(/…/g, ""))}</div>${scoreChip(heard, it.de)}` : ""}
    <div class="rate-q">${L("Wie schnell und sicher war das?", "How quick and sure was that?")}</div>${ratingRow()}</div>`;
  $("#ctl").innerHTML = "";
  if (TTS && DB.autoSay !== false) say(it.de.replace(/…/g, ""));
  bindRating(g => {
    flRecord(flDB().s, it.k, g);
    s.queue.shift(); s.done++;
    s.res.push({ it, g, heard });
    if (g <= 2 && !s.again[it.k]) { s.again[it.k] = 1; s.queue.splice(Math.min(3, s.queue.length), 0, it); }
    fsAsk();
  });
}
function fsFinish() {
  lrStop();
  const s = FS; if (!s) { fsHub(); return; }
  const firsts = {}; s.res.forEach(r => { if (!firsts[r.it.k]) firsts[r.it.k] = r; });
  const list = Object.values(firsts), n = list.length;
  const avg = n ? list.reduce((a, r) => a + r.g, 0) / n : 0;
  const fast = list.filter(r => r.g >= 4).length;
  const hard = s.res.filter(r => r.g <= 2).map(r => r.it).filter((x, i, a) => a.findIndex(y => y.k === x.k) === i);
  const body = `<div class="stats"><div><b>${n}</b><span>${L("Sätze", "sentences")}</span></div><div><b>${fast}</b><span>${L("schnell (4–5)", "quick (4–5)")}</span></div><div><b>${avg ? avg.toFixed(1) : "–"}</b><span>${L("Schnitt", "average")}</span></div></div>
    ${hard.length ? `<div class="sec-h">${L("Noch schwer: laut nachsprechen", "Still hard: say them out loud again")}</div><div class="sit">${hard.map(x => `<div class="hard"><span><b>${esc(x.de)}</b><div class="e">${esc(x.en)}</div></span>${TTS ? `<button class="spk" data-say="${esc(x.de.replace(/…/g, ""))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>`).join("")}</div>` : `<p class="muted">${L("Keine schweren Sätze. Stark!", "No hard sentences. Nice!")}</p>`}
    <div class="row2"><button class="btn primary" id="again">${L("Neue Runde", "New round")}</button><button class="btn ghost" id="hub">${L("Einstellungen", "Settings")}</button></div>`;
  shell("Sag's schnell", body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: fsFinish });
  FS = null;
  $("#again").onclick = () => { const p = flDB().fs, items = fsBuild(p.src, p.n); if (!items.length) { fsHub(); return; } FS = { queue: items, total: items.length, done: 0, sec: p.sec, mic: p.mic && !!SRC, res: [], again: {} }; fsAsk(); };
  $("#hub").onclick = fsHub;
}

/* =================================================================== FRAGE-PINGPONG */
function ppBuild(cat, n) {
  const items = PINGPONG.filter(q => cat === "all" || q.cat === cat).map(q => Object.assign({ k: q.id }, q));
  return flOrder(items, flDB().q, n);
}
function ppHub() {
  lrStop();
  const f = flDB(), p = f.pp;
  if (!PP_CATS[p.cat] && p.cat !== "all") p.cat = "all";
  const asked = Object.keys(f.q).filter(k => PINGPONG.some(q => q.id === k)).length;
  const chip = (k, v, l) => `<button class="chip" data-k="${k}" data-v="${v}" aria-pressed="${String(p[k]) === String(v)}">${esc(l)}</button>`;
  const body = `<p class="muted" style="margin-top:4px">${L("Die App stellt dir eine Frage, und du antwortest sofort, ohne Vorbereitung. Lieber einfach und flüssig als perfekt.", "The app asks you a question and you answer straight away, without preparing. Simple and fluent beats perfect.")}</p>
    <div class="stats"><div><b>${PINGPONG.length}</b><span>${L("Fragen", "questions")}</span></div><div><b>${asked}</b><span>${L("beantwortet", "answered")}</span></div><div><b>${Object.values(f.q).filter(c => c.last && c.last <= 2).length}</b><span>${L("noch schwer", "still hard")}</span></div></div>
    <div class="h2">${L("Thema", "Topic")}</div>
    <div class="chips">${chip("cat", "all", L("Alle", "All"))}${shkFirst(Object.keys(PP_CATS)).map(k => chip("cat", k, T(PP_CATS[k]))).join("")}</div>
    ${p.cat !== "all" ? `<p class="muted small" style="margin:0 2px">${L("Übt vor allem: ", "Mostly practises: ")}${esc(PP_CATS[p.cat][2])}</p>` : ""}
    <div class="h2">${L("Zeit zum Antworten", "Time to answer")}</div>
    <div class="chips">${chip("sec", 15, "15 s")}${chip("sec", 20, "20 s")}${chip("sec", 30, "30 s")}</div>
    <div class="h2">${L("Wie viele Fragen", "How many questions")}</div>
    <div class="chips">${chip("n", 5, "5")}${chip("n", 10, "10")}${chip("n", 15, "15")}</div>
    ${TTS ? `<button class="row-sw" id="ppHide" aria-pressed="${p.hide}"><span class="tx"><b>${L("Frage nur hören", "Listen only")}</b><span class="muted small">${L("Die Frage erscheint erst, wenn du tippst. Wie im echten Gespräch.", "The question only appears when you tap. Like a real conversation.")}</span></span><span class="sw ${p.hide ? "on" : ""}"><i></i></span></button>` : ""}
    ${micRow(p.mic, "ppMic")}
    <button class="btn primary" id="ppGo">${L("Los", "Start")}</button>
    <p class="muted small">${L("Am Ende kannst du alle Antworten auf einmal von Claude korrigieren lassen. Daraus werden Atome.", "At the end you can get all your answers corrected by Claude in one go. They become atoms.")}</p>`;
  shell("Frage-Pingpong", body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: ppHub });
  document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const k = b.dataset.k; p[k] = k === "cat" ? b.dataset.v : +b.dataset.v; save(); ppHub(); });
  const h = $("#ppHide"); if (h) h.onclick = () => { p.hide = !p.hide; save(); ppHub(); };
  const m = $("#ppMic"); if (m) m.onclick = () => { p.mic = !p.mic; save(); ppHub(); };
  $("#ppGo").onclick = () => ppStart();
}
let PP = null;
function ppStart() {
  const p = flDB().pp, qs = ppBuild(p.cat, p.n);
  if (!qs.length) { toast(L("Keine Fragen gefunden.", "No questions found.")); return; }
  PP = { qs, i: 0, me: [], g: [], sec: p.sec, mic: p.mic && !!SRC, hide: p.hide && TTS };
  ppAsk();
}
function ppAsk() {
  const s = PP; if (!s) return;
  if (s.i >= s.qs.length) { ppFinish(); return; }
  lrStop();
  const q = s.qs[s.i];
  let shown = !s.hide;
  const body = `<div class="prog"><i style="width:${100 * s.i / s.qs.length}%"></i></div>
    <div class="log"><div class="bub p cur"><span class="who">${L("Frage", "Question")} ${s.i + 1}/${s.qs.length}</span><div class="pp-q"><span class="tx" id="qTx">${shown ? esc(q.q) : `<span class="hidden-line">${L("Tippe zum Anzeigen", "Tap to show")}</span>`}</span>${TTS ? `<button class="spk" id="qSay" aria-label="${L("Nochmal anhören", "Play again")}">${ICON.spk}</button>` : ""}</div>
      ${q.en ? `<div class="pp-en" id="qEn" hidden>${esc(q.en)}</div><div class="pp-help"><button class="chip" id="qEnB">EN</button><button class="chip" id="qNv">${L("Nicht verstanden", "Didn't understand")}</button></div>` : ""}</div></div>
    <div class="tbar" id="tb"><i></i></div>
    <div class="lstat"><span class="st" id="st"></span><span class="tnum" id="tn"></span></div>
    <div class="ibox"><textarea class="tarea" id="ans" rows="4" placeholder="${esc(s.mic ? L("Deine Antwort erscheint hier. Du kannst sie auch tippen.", "Your answer appears here. You can also type it.") : L("Sag deine Antwort laut. Wenn du willst, tipp sie hier.", "Say your answer out loud. Type it here if you like."))}" spellcheck="false" autocapitalize="sentences"></textarea><div class="interim" id="int"></div></div>
    <div class="msg" id="msg"></div>
    <div class="row2"><button class="btn ghost" id="skip">${L("Überspringen", "Skip")}</button><button class="btn petrol" id="done">${L("Fertig", "Done")}</button></div>`;
  shell("Frage-Pingpong", body, { back: L("Ende", "End"), backTo: "aktiv", redraw: null });
  $("#back").onclick = () => { lrStop(); hush(); if (s.me.some(Boolean)) { s.qs = s.qs.slice(0, s.i); ppFinish(); } else ppHub(); };
  const ta = $("#ans"), it = $("#int");
  const qTx = $("#qTx"); qTx.onclick = () => { if (!shown) { shown = true; qTx.textContent = q.q; } };
  const begin = () => {
    if (!$("#tb")) return;
    listenRound({
      sec: s.sec, mic: s.mic, bar: $("#tb"), num: $("#tn"), stat: $("#st"),
      onFinal: t => { if (!ta.isConnected) return; ta.value += (ta.value && !/\s$/.test(ta.value) ? " " : "") + t; },
      onInterim: t => { if (it.isConnected) it.textContent = t; },
      onMicError: m => { s.mic = false; const g = $("#msg"); if (g) g.textContent = m; },
      onEnd: () => ppReveal(ta.value.trim())
    });
  };
  const ask = () => {
    lrStop();
    const st = $("#st"); if (st) { st.classList.remove("on"); st.textContent = L("Hör zu …", "Listen …"); }
    const bar = $("#tb"); if (bar) bar.firstChild.style.width = "100%";
    if (TTS && say(q.q)) afterSpeech(begin); else begin();
  };
  if ($("#qSay")) $("#qSay").onclick = ask;
  // English help: EN shows the meaning and stops the clock; "Nicht verstanden" also replays the question slowly,
  // restarts the clock and brings the question back once more at the end of the round
  const showEn = () => { const e = $("#qEn"); if (e) e.hidden = false; if (!shown) { shown = true; qTx.textContent = q.q; } };
  const enB = $("#qEnB");
  if (enB) enB.onclick = () => { showEn(); enB.disabled = true; if (LR) { LR.frozen = true; const n = $("#tn"); if (n) n.textContent = L("Uhr angehalten", "Clock paused"); } };
  const nv = $("#qNv");
  if (nv) nv.onclick = () => {
    showEn(); if (enB) enB.disabled = true; nv.disabled = true;
    if (!q.again) { s.qs.push(Object.assign({}, q, { again: true })); }
    lrStop();
    const st = $("#st"); if (st) { st.classList.remove("on"); st.textContent = L("Langsam: hör zu …", "Slowly: listen …"); }
    const bar = $("#tb"); if (bar) bar.firstChild.style.width = "100%";
    if (TTS && say(q.q, .65)) afterSpeech(begin); else begin();
  };
  ta.addEventListener("focus", () => { if (LR) { LR.frozen = true; const n = $("#tn"); if (n) n.textContent = L("Uhr angehalten", "Clock paused"); } }); // typing: stop the clock
  $("#done").onclick = () => { if (LR && LR.end) LR.end("tap"); else ppReveal(ta.value.trim()); };
  $("#skip").onclick = () => { lrStop(); hush(); s.qs.splice(s.i, 1); ppAsk(); };
  setTimeout(ask, 250);
}
function ppReveal(ans) {
  const s = PP; if (!s || !$("#done")) return;
  lrStop();
  const q = s.qs[s.i];
  s.me[s.i] = ans;
  const body = `<div class="prog"><i style="width:${100 * (s.i + 1) / s.qs.length}%"></i></div>
    <div class="log"><div class="bub p"><span class="who">${L("Frage", "Question")} ${s.i + 1}/${s.qs.length}</span><div class="pp-q"><span class="tx">${esc(q.q)}</span>${TTS ? `<button class="spk" data-say="${esc(q.q)}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div><div class="muted small" style="margin-top:3px">${esc(q.en)}</div></div>
    <div class="bub me"><span class="who">${L("Du", "You")}</span>${ans ? esc(ans) : `<i>${L("(laut gesprochen)", "(said out loud)")}</i>`}</div></div>
    ${modelBox(q.m)}
    <div class="rate-q">${L("Wie flüssig war deine Antwort?", "How fluent was your answer?")}</div>${ratingRow()}`;
  shell("Frage-Pingpong", body, { back: L("Ende", "End"), backTo: "aktiv", redraw: null });
  $("#back").onclick = () => { hush(); s.qs = s.qs.slice(0, s.i + 1); ppFinish(); };
  bindRating(g => { flRecord(flDB().q, q.id, g); s.g[s.i] = g; s.i++; ppAsk(); });
}
function ppFinish() {
  lrStop();
  const s = PP; if (!s) { ppHub(); return; }
  const rated = s.g.filter(Boolean), avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0;
  const said = s.qs.map((q, i) => ({ q, a: s.me[i] || "" })).filter(x => x.a);
  const body = `<div class="stats"><div><b>${s.qs.length}</b><span>${L("Fragen", "questions")}</span></div><div><b>${rated.filter(g => g >= 4).length}</b><span>${L("flüssig (4–5)", "fluent (4–5)")}</span></div><div><b>${avg ? avg.toFixed(1) : "–"}</b><span>${L("Schnitt", "average")}</span></div></div>
    <div class="sec-h">${L("Deine Antworten", "Your answers")}</div>
    <div class="log">${s.qs.map((q, i) => `<div class="bub p"><span class="who">${L("Frage", "Question")}</span>${esc(q.q)}</div><div class="bub me"><span class="who">${L("Du", "You")}</span>${s.me[i] ? esc(s.me[i]) : `<i>${L("(laut gesprochen)", "(said out loud)")}</i>`}</div>`).join("")}</div>
    ${said.length ? `<div id="cbHost"></div>` : `<p class="muted small">${L("Keine Antworten als Text, deshalb gibt es diesmal keine Korrektur. Mit Mikrofon oder Tippen geht das.", "No answers as text, so there's no correction this time. With the mic or typing, there is.")}</p>`}
    <div class="row2"><button class="btn primary" id="again">${L("Neue Fragen", "New questions")}</button><button class="btn ghost" id="hub">${L("Einstellungen", "Settings")}</button></div>`;
  shell("Frage-Pingpong", body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: null });
  if (said.length) claudeBlock({ kindDe: "Sprechen (spontane Antworten auf Fragen)", kindKey: "sp", title: "Frage-Pingpong", task: "Ich habe schnelle Fragen spontan beantwortet, ohne Vorbereitung.", text: said.map(x => `Frage: ${x.q.q}\nIch: ${x.a}`).join("\n"), spoken: true, dialog: true, cue: said.map(x => x.q.q).join("\n") }, $("#cbHost"));
  PP = null;
  $("#again").onclick = ppStart; $("#hub").onclick = ppHub;
}

/* =================================================================== REDEMITTEL: SAGEN mode
   Called from deckAsk in aktiv.js. Shows the situation + English, listens, then reveals. */
function rmSayHtml(it) {
  return `<div class="mode">${L("Sag es", "Say it")}</div><div class="meta">${esc(T([RM_CATS[it.cat][2], RM_CATS[it.cat][3]]))}</div><div class="en" style="font-size:22px">${esc(it.en)}</div>
    <div class="tbar" id="tb"><i></i></div><div class="lstat"><span class="st" id="st"></span><span class="tnum" id="tn"></span></div>
    <div class="heard" id="hd"></div><div id="kb"><button class="btn petrol" id="flip">${L("Aufdecken", "Reveal")}</button></div>`;
}
function rmSayBind(it, onAnswer) {
  const target = it.de.replace(/…/g, " ").trim();
  let fin = "", intr = "", done = false;
  const paint = () => { const h = $("#hd"); if (h) h.innerHTML = esc(fin) + (intr ? ` <span class="int">${esc(intr)}</span>` : ""); };
  const reveal = () => {
    if (done || !$("#kb")) return; done = true; lrStop();
    $("#tb").style.visibility = "hidden"; $("#st").textContent = ""; $("#tn").textContent = "";
    $("#hd").innerHTML = fin ? `<div class="diff">${diffHtml(fin, target)}</div>${scoreChip(fin, target)}` : "";
    $("#kb").innerHTML = `<div class="w sm" style="margin-top:14px">${esc(it.de)}</div><div class="row2"><button class="btn bad" id="kNo">${L("Nicht gewusst", "Didn't know")}</button><button class="btn petrol" id="kOk">${L("Gewusst", "Knew it")}</button></div>`;
    if (TTS && DB.autoSay !== false) say(target);
    $("#kOk").onclick = () => onAnswer(true); $("#kNo").onclick = () => onAnswer(false);
  };
  listenRound({
    sec: 8, mic: flDB().fs.mic && !!SRC, bar: $("#tb"), num: $("#tn"), stat: $("#st"),
    onFinal: t => { fin += (fin ? " " : "") + t; paint(); },
    onInterim: t => { intr = t; paint(); },
    autoEnd: h => { const r = flMatch(h, target); return r.total && r.hit / r.total >= .7; },
    onMicError: () => { flDB().fs.mic = false; save(); },
    onEnd: reveal
  });
  $("#flip").onclick = () => { if (LR && LR.end) LR.end("tap"); else reveal(); };
}

/* =================================================================== AKTIV MENU HOOK */
function fluencyMenu() {
  const f = flDB();
  return `<div class="sec-h">${L("Flüssig sprechen", "Speaking fluency")}</div><div class="menu">
    <button class="item" id="mFs"><span class="ic">⚡</span><span class="tx"><span class="tt">Sag's schnell</span><span class="ss">${L("Englisch sehen, Deutsch sagen, gegen die Uhr", "See English, say German, against the clock")}</span></span></button>
    <button class="item" id="mPp"><span class="ic">🏓</span><span class="tx"><span class="tt">Frage-Pingpong</span><span class="ss">${L(`${PINGPONG.length} Fragen · sofort antworten`, `${PINGPONG.length} questions · answer straight away`)}</span></span></button>
    <button class="item" id="mGk"><span class="ic">🧩</span><span class="tx"><span class="tt">${L("Gesprächskleber", "Conversation glue")}</span><span class="ss">${L(`${REDEMITTEL.filter(r => GLUE_CATS.includes(r.cat)).length} Wendungen zum Reagieren, Weiterreden und Umschreiben`, `${REDEMITTEL.filter(r => GLUE_CATS.includes(r.cat)).length} phrases to react, keep going and talk around words`)}</span></span></button>
  </div>`;
}
function bindFluencyMenu() {
  const a = $("#mFs"), b = $("#mPp"), c = $("#mGk");
  if (a) a.onclick = fsHub; if (b) b.onclick = ppHub;
  if (c) c.onclick = () => {
    const ids = shuffle(REDEMITTEL.filter(r => GLUE_CATS.includes(r.cat)).map(r => r.id));
    const due = ids.filter(id => { const s = DB.dk.r[id]; return s && s.due <= today(); });
    const fresh = ids.filter(id => !DB.dk.r[id]).slice(0, 10);
    const pick = due.concat(fresh);
    if (pick.length) startDeck("r", pick, true, "sagen");
    else startDeck("r", ids.slice(0, 15), false, "sagen");
  };
}
