/* Sprechtraining (speaking drill): say your own atom sentences out loud until speech recognition hears them right.
   Loaded after fluency.js. Uses DB, save, shell, L, EN, esc, $, toast, today, TTS, ICON, say, hush from index.html,
   SRC, recStart, recStop, diffHtml, numKey from aktiv.js, and allSents, atomById, isLive, place, plain, stripGuess,
   patEvent, admitWaiting, syncAtom, ATOM_INT from atome.js.

   Two modes:
   - German visible: read it aloud (pronunciation). Only logged, never touches your boxes.
   - German hidden: recall it. A clean first try (no peeking, no listening first) moves the sentence up one box,
     once per sentence per day, and counts as "right" for its mistake patterns.
     A miss on the first try counts as a mistake for its patterns. Boxes never go down here.

   DB.sd = { hide, src: "box"|"atom", box, atom, log: { "aid#si": { n, ok, miss, d } } } */

(function addSdStyles() {
  const css = `
  .sd-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 10px}
  .sd-nav button{min-width:64px;padding:9px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);font-weight:800;font-size:14px}
  .sd-nav button:disabled{opacity:.35}
  .sd-nav .c{font-weight:800;color:var(--muted);font-size:13.5px;text-align:center;line-height:1.3}
  .sd-card{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:14px 16px}
  .sd-card .lab{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px}
  .sd-card .en{font-size:20px;font-weight:700;line-height:1.35}
  .sd-de{margin-top:14px;display:flex;gap:10px;justify-content:space-between;align-items:flex-start}
  .sd-de .tx{font-size:22px;font-weight:800;line-height:1.4}
  .sd-hid{margin-top:14px;border:1.5px dashed var(--line);border-radius:12px;padding:12px;text-align:center;color:var(--muted);font-weight:700;font-size:14px}
  .sd-hid button{margin-top:6px;font-weight:800;color:var(--petrol-soft);font-size:14px}
  .sd-mic{display:flex;flex-direction:column;align-items:center;gap:8px;margin:18px 0 6px}
  .sd-mic .big{width:84px;height:84px;border-radius:50%;background:var(--petrol);color:var(--on-petrol);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow)}
  .sd-mic .big svg{width:36px;height:36px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .sd-mic .big.on{background:var(--bad);color:#fff;animation:sdPulse 1.2s ease-in-out infinite}
  @keyframes sdPulse{50%{transform:scale(1.06)}}
  .sd-mic .st{font-size:13.5px;font-weight:800;color:var(--muted)}
  .sd-heard{min-height:24px;font-size:17px;line-height:1.5;text-align:center;margin-top:4px}
  .sd-heard .int{color:var(--muted);font-style:italic}
  .sd-res{margin-top:12px}
  .sd-ok{background:var(--good-tint);color:var(--good);border-radius:12px;padding:10px 12px;font-weight:800;text-align:center}
  .sd-no{background:var(--bad-tint);color:var(--bad);border-radius:12px;padding:10px 12px;font-weight:800;text-align:center}
  .sd-tries{font-size:12.5px;font-weight:800;color:var(--muted);text-align:center;margin-top:6px}
  .sd-pick{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:6px}
  .sd-pick button{background:var(--surface);border-radius:12px;box-shadow:var(--shadow);padding:9px 4px;text-align:center;border:2px solid transparent}
  .sd-pick button b{display:block;font-size:17px;font-weight:800}
  .sd-pick button span{font-size:11px;font-weight:800;color:var(--muted)}
  .sd-pick button[aria-pressed="true"]{border-color:var(--petrol)}
  .sd-pick button:disabled{opacity:.4}`;
  try { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); } catch (e) { }
})();

function sdDB() {
  if (!DB.sd || typeof DB.sd !== "object") DB.sd = {};
  const s = DB.sd;
  if (typeof s.hide !== "boolean") s.hide = false;
  if (s.src !== "box" && s.src !== "atom") s.src = "box";
  if (!(s.box >= 1 && s.box <= 5)) s.box = 1;
  if (!s.log || typeof s.log !== "object") s.log = {};
  return s;
}

/* the sentences you can drill: live (in a box), not waiting for Claude, with a German text */
function sdUsable(a, x) { return a && x && !a.paused && !x.pend && plain(x.de).trim(); }
function sdItems(src, val) {
  atomsReady();
  const out = [];
  if (src === "atom") {
    const a = atomById(val); if (!a) return out;
    a.sents.forEach((x, si) => { if (sdUsable(a, x) && !a.sents[si].wait) out.push({ aid: a.id, si }); });
    // an atom with nothing live (waiting / graduated) can still be practised, just never scored
    if (!out.length) a.sents.forEach((x, si) => { if (!x.pend && plain(x.de).trim()) out.push({ aid: a.id, si }); });
  } else {
    allSents().forEach(({ a, s, si }) => { if (sdUsable(a, s) && isLive(s) && s.box === val) out.push({ aid: a.id, si }); });
  }
  return out;
}

/* matching: same words in the same order; case, punctuation, ß/ss and "10"/"zehn" don't matter */
const sdKey = w => numKey(flKey(w));
const sdToks = s => String(s || "").replace(/…/g, " ").split(/\s+/).map(sdKey).filter(Boolean);
function sdClean(heard, target) { const A = sdToks(heard), B = sdToks(target); return B.length > 0 && A.length === B.length && A.every((w, i) => w === B[i]); }

/* =================================================================== HUB */
function sdHub(back) {
  recStop(); hush(); atomsReady();
  if (back) SD_BACK = back;
  const p = sdDB();
  const counts = [1, 2, 3, 4, 5].map(b => sdItems("box", b).length);
  if (p.src === "atom" && !atomById(p.atom)) p.src = "box";
  const atoms = DB.atoms.filter(a => !a.paused && a.sents.some(x => !x.pend)).sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0) || String(b.made || "").localeCompare(String(a.made || "")));
  const sel = p.src === "atom" ? sdItems("atom", p.atom) : sdItems("box", p.box);
  const body = `<p class="muted" style="margin-top:4px">${L("Deine eigenen Atom-Sätze laut sprechen. Die App hört zu und zeigt in Rot und Grün, was sie verstanden hat. Wiederhol den Satz, bis er sitzt.", "Say your own atom sentences out loud. The app listens and shows in red and green what it understood. Repeat the sentence until it's right.")}</p>
    <div class="h2">${L("Aus einer Box", "From a box")}</div>
    <div class="sd-pick">${counts.map((n, i) => `<button data-sbox="${i + 1}" aria-pressed="${p.src === "box" && p.box === i + 1}" ${n ? "" : "disabled"}><b>${n}</b><span>Box ${i + 1}</span></button>`).join("")}</div>
    <div class="h2">${L("Oder ein ganzes Atom", "Or a whole atom")}</div>
    ${atoms.length ? `<select class="tin" id="sdAtom"><option value="">${L("– Atom wählen –", "– choose an atom –")}</option>${atoms.map(a => `<option value="${a.id}" ${p.src === "atom" && p.atom === a.id ? "selected" : ""}>${esc(a.t)} (${a.sents.length})${a.done ? " ✓" : ""}</option>`).join("")}</select>` : `<p class="muted small">${L("Noch keine Atome.", "No atoms yet.")}</p>`}
    <button class="row-sw" id="sdHide" aria-pressed="${p.hide}" style="margin-top:14px"><span class="tx"><b>${L("Deutsch verstecken", "Hide the German")}</b><span class="muted small">${p.hide ? L("Aus dem Gedächtnis sagen. Klappt es beim ersten Versuch, rückt der Satz eine Box höher.", "Say it from memory. Right on the first try moves the sentence up one box.") : L("Deutsch steht da, du liest laut vor: Aussprache. Zählt nicht für die Boxen.", "The German is shown and you read it aloud: pronunciation. Doesn't count for your boxes.")}</span></span><span class="sw ${p.hide ? "on" : ""}"><i></i></span></button>
    ${SRC ? "" : `<p class="muted small">${L("Spracherkennung geht nur in Chrome. Hier kannst du deinen Satz tippen.", "Speech recognition only works in Chrome. Here you can type your sentence instead.")}</p>`}
    <button class="btn primary" id="sdGo" ${sel.length ? "" : "disabled"}>${sel.length ? L(`${sel.length} Sätze sprechen`, `Speak ${sel.length} sentences`) : L("Wähl eine Box oder ein Atom", "Choose a box or an atom")}</button>
    <details class="fold"><summary>${L("So funktioniert's", "How it works")}</summary><div class="in small">
      <p style="margin-top:0">${L("Tipp aufs Mikrofon und sprich. Wenn du eine Pause machst, hört die App von selbst auf und vergleicht. Sonst tippst du auf Stopp. Rot = zu viel oder anders, Grün = fehlte.", "Tap the mic and speak. When you pause, the app stops by itself and compares. Otherwise tap Stop. Red = extra or different, green = missing.")}</p>
      <p>${L("Mit ‹ und › gehst du jederzeit vor und zurück, auch an schweren Sätzen vorbei.", "Use ‹ and › to move back and forth at any time, including past hard sentences.")}</p>
      <p style="margin-bottom:0">${L("Mit verstecktem Deutsch: Richtig beim ersten Versuch, ohne Spicken und ohne Anhören, bringt den Satz eine Box höher (einmal pro Tag) und zählt für seine Fehlermuster. Ein Fehler beim ersten Versuch zählt als Fehler für seine Muster. Nach unten geht hier keine Box.", "With the German hidden: right on the first try, without peeking or listening, moves the sentence up one box (once a day) and counts for its mistake patterns. A miss on the first try counts as a mistake for its patterns. No box goes down here.")}</p></div></details>`;
  shell(L("Sprechtraining", "Speaking drill"), body, { back: SD_BACK.label, backTo: SD_BACK.to, redraw: () => sdHub() });
  if (SD_BACK.fn) $("#back").onclick = SD_BACK.fn;
  document.querySelectorAll("[data-sbox]").forEach(b => b.onclick = () => { p.src = "box"; p.box = +b.dataset.sbox; save(); sdHub(); });
  const sa = $("#sdAtom"); if (sa) sa.onchange = () => { if (sa.value) { p.src = "atom"; p.atom = sa.value; } else p.src = "box"; save(); sdHub(); };
  $("#sdHide").onclick = () => { p.hide = !p.hide; save(); sdHub(); };
  $("#sdGo").onclick = () => sdStart(sel, p.hide);
}
let SD_BACK = { label: "", to: "ueben" };
function sdFromPractice() { sdHub({ label: L("Üben", "Practice"), to: "ueben" }); }

/* open straight on one atom (from the atom page) */
function sdForAtom(id) {
  const p = sdDB(); p.src = "atom"; p.atom = id; save();
  sdHub({ label: L("Atom", "Atom"), to: "aktiv", fn: () => atomDetail(id) });
}

/* =================================================================== DRILL */
/* SD = { items:[{aid, si}], i, hide, st: { "aid#si": { tries, first:"ok"|"miss", peek, done } }, ups } */
let SD = null;
function sdStart(items, hide) {
  if (!items.length) return;
  SD = { items: items.slice(), i: 0, hide: !!hide, st: {}, ups: 0 };
  sdStep();
}
const sdK = it => it.aid + "#" + it.si;
function sdState(it) { const k = sdK(it); return SD.st[k] || (SD.st[k] = { tries: 0, first: "", peek: false, heard: "", res: "" }); }

function sdStep() {
  recStop(); hush();
  const s = SD; if (!s) { sdHub(); return; }
  const it = s.items[s.i], a = atomById(it.aid), x = a && a.sents[it.si];
  if (!x) { s.items.splice(s.i, 1); if (!s.items.length) { sdDone(); return; } s.i = Math.min(s.i, s.items.length - 1); sdStep(); return; }
  const z = sdState(it), de = plain(stripGuess(x.de)), showDe = !s.hide || z.peek || z.tries > 0;
  const spk = TTS ? `<button class="spk" id="sdSpk" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : "";
  const body = `<div class="sd-nav"><button id="sdPrev" ${s.i ? "" : "disabled"} aria-label="${L("Zurück", "Previous")}">‹</button>
      <div class="c">${s.i + 1} ${L("von", "of")} ${s.items.length}<br><span style="font-weight:700">${esc(a.t)} · ${x.box >= 1 && x.box <= 5 ? "Box " + x.box : boxLine(x)}</span></div>
      <button id="sdNext" aria-label="${L("Weiter", "Next")}">${s.i + 1 < s.items.length ? "›" : L("Ende", "End")}</button></div>
    <div class="prog"><i style="width:${100 * (s.i + 1) / s.items.length}%"></i></div>
    <div class="sd-card">
      <span class="lab">${L("Englisch", "English")}</span><div class="en">${esc(x.en || "–")}</div>
      ${showDe ? `<div class="sd-de"><span class="tx">${esc(de)}</span>${spk}</div>`
        : `<div class="sd-hid">${L("Deutsch versteckt. Sag es aus dem Gedächtnis.", "German hidden. Say it from memory.")}<br><button id="sdPeek">${L("Spicken (zählt dann nicht)", "Peek (then it won't count)")}</button></div>`}
    </div>
    ${SRC ? `<div class="sd-mic"><button class="big" id="sdMic" aria-label="${L("Sprechen", "Speak")}">${AICON.mic}</button><span class="st" id="sdSt">${L("Tippen und sprechen", "Tap and speak")}</span></div>
      <div class="sd-heard" id="sdHd"></div>`
      : `<div class="ibox" style="margin-top:14px"><textarea class="tarea" id="sdTa" rows="2" placeholder="${L("Tipp den Satz auf Deutsch …", "Type the sentence in German …")}" spellcheck="false" autocapitalize="sentences"></textarea></div><button class="btn petrol" id="sdChk">${L("Prüfen", "Check")}</button>`}
    <div class="sd-res" id="sdRes"></div>
    <div class="msg" id="sdMsg"></div>`;
  shell(L("Sprechtraining", "Speaking drill"), body, { back: L("Ende", "End"), backTo: SD_BACK.to, redraw: sdStep });
  $("#back").onclick = () => { recStop(); sdDone(); };
  $("#sdPrev").onclick = () => { if (s.i > 0) { s.i--; sdStep(); window.scrollTo(0, 0); } };
  $("#sdNext").onclick = () => { if (s.i + 1 < s.items.length) { s.i++; sdStep(); window.scrollTo(0, 0); } else sdDone(); };
  const pk = $("#sdPeek"); if (pk) pk.onclick = () => { z.peek = true; sdStep(); };
  const sp = $("#sdSpk"); if (sp) sp.onclick = e => { e.stopPropagation(); if (s.hide && !z.res) z.peek = true; if (!say(de)) toast(NO_SOUND()); };
  if (z.res) sdShowResult(it, x, de, z);

  if (!SRC) {
    const ta = $("#sdTa"); if (z.heard) ta.value = z.heard;
    $("#sdChk").onclick = () => { const v = ta.value.trim(); if (!v) return; sdJudge(it, a, x, de, v); };
    return;
  }
  const mic = $("#sdMic"), stEl = $("#sdSt"), hd = $("#sdHd");
  let fin = "", intr = "", quiet = null, live = false;
  const paint = () => { if (hd && hd.isConnected) hd.innerHTML = esc(fin) + (intr ? ` <span class="int">${esc(intr)}</span>` : ""); };
  const finish = () => {
    clearTimeout(quiet);
    if (!live) return; live = false; recStop();
    const heard = (fin + " " + intr).trim();
    if (heard) sdJudge(it, a, x, de, heard);
  };
  mic.onclick = () => {
    if (live) { finish(); return; }
    fin = ""; intr = ""; paint();
    $("#sdRes").innerHTML = ""; $("#sdMsg").textContent = "";
    live = true;
    recStart({
      final: t => { if (!live || !t) return; fin += (fin ? " " : "") + t; intr = ""; paint(); clearTimeout(quiet);
        // stop by itself after a pause: short once all the words are there, longer if some are still missing
        quiet = setTimeout(finish, sdToks(fin).length >= sdToks(de).length ? 900 : 2500); },
      interim: t => { if (!live) return; intr = t; paint(); if (t) clearTimeout(quiet); },
      state: (on, m) => {
        if (!mic.isConnected) return;
        mic.classList.toggle("on", on); mic.innerHTML = on ? AICON.stop : AICON.mic;
        stEl.textContent = on ? L("● Ich höre zu … Stopp antippen, wenn du fertig bist", "● Listening … tap Stop when you're done") : L("Tippen und sprechen", "Tap and speak");
        if (!on && live) { if (m) { live = false; $("#sdMsg").textContent = m; } else finish(); }
      }
    });
  };
}

function sdJudge(it, a, x, de, heard) {
  const s = SD, z = sdState(it), ok = sdClean(heard, de);
  z.tries++; z.heard = heard; z.res = ok ? "ok" : "miss";
  const first = !z.first;
  if (first) z.first = z.res;
  const p = sdDB(), k = sdK(it), lg = p.log[k] || (p.log[k] = { n: 0, ok: 0, miss: 0, d: "" });
  lg.n++; if (ok) lg.ok++; else lg.miss++; lg.d = today();
  if (typeof logDay === "function") logDay("sd");
  // only the first try of a sentence, with the German hidden and no peeking, is a real test
  if (first && s.hide && !z.peek) {
    x.fp.filter(id => DB.pats[id]).forEach(id => patEvent(id, ok ? "ok" : "fail"));
    if (ok && isLive(x) && x.sdUp !== today()) {
      place(x, Math.min(6, (x.box || 1) + 1)); x.last = 3; x.sdUp = today(); s.ups++;
      admitWaiting(); DB.atoms.forEach(syncAtom);
      if (typeof remindSync === "function") remindSync();
      z.up = true;
    }
  }
  save();
  if (!$("#sdRes")) return;
  if (!$(".sd-de")) { sdStep(); return; } // the German was hidden: show it now, with the result
  sdShowResult(it, x, de, z);
}

function sdShowResult(it, x, de, z) {
  const s = SD, r = $("#sdRes"); if (!r) return;
  const hd = $("#sdHd"); if (hd) hd.innerHTML = ""; // the attempt is shown below, with the diff
  const ok = z.res === "ok";
  r.innerHTML = `${z.heard ? `<div class="sec-h">${L("Dein Versuch", "Your attempt")}</div><div class="model diff">${diffHtml(z.heard, de)}</div>
      <div class="legend"><div>${L(`<span class="g">Grün</span> = fehlte bei dir.`, `<span class="g">Green</span> = missing in yours.`)}</div><div>${L(`<span class="r">Rot</span> = zu viel oder anders.`, `<span class="r">Red</span> = extra or different.`)}</div></div>` : ""}
    <div class="${ok ? "sd-ok" : "sd-no"}" style="margin-top:10px">${ok ? (z.up ? L(`Richtig! Eine Box höher: Box ${Math.min(5, x.box)}${x.box >= 6 ? " (fertig)" : ""}.`, `Right! Up one box: box ${Math.min(5, x.box)}${x.box >= 6 ? " (done)" : ""}.`) : L("Richtig!", "Right!")) : L("Noch nicht ganz. Nochmal!", "Not quite. Go again!")}</div>
    <div class="sd-tries">${L(`Versuch ${z.tries}`, `Attempt ${z.tries}`)}${s.hide && z.peek ? " · " + L("gespickt, zählt nicht", "peeked, doesn't count") : ""}</div>
    ${ok ? `<div class="row2" style="margin-top:10px"><button class="btn ghost" id="sdAgain">${L("Nochmal", "Again")}</button><button class="btn primary" id="sdOn">${s.i + 1 < s.items.length ? L("Nächster Satz", "Next sentence") : L("Fertig", "Finish")}</button></div>`
      : `<div class="row2" style="margin-top:10px"><button class="btn ghost" id="sdSkip">${L("Überspringen", "Skip")}</button>${SRC ? `<button class="btn primary" id="sdRetry">${L("Nochmal sprechen", "Say it again")}</button>` : ""}</div>`}`;
  const next = () => { if (s.i + 1 < s.items.length) { s.i++; sdStep(); window.scrollTo(0, 0); } else sdDone(); };
  const again = () => { z.res = ""; z.heard = ""; sdStep(); const m = $("#sdMic"); if (m) m.click(); };
  const b1 = $("#sdAgain"), b2 = $("#sdOn"), b3 = $("#sdSkip"), b4 = $("#sdRetry");
  if (b1) b1.onclick = again; if (b2) b2.onclick = next; if (b3) b3.onclick = next; if (b4) b4.onclick = again;
}

function sdDone() {
  recStop(); hush();
  const s = SD; SD = null;
  if (!s) { sdHub(); return; }
  const st = Object.values(s.st).filter(z => z.tries);
  const firstOk = st.filter(z => z.first === "ok").length, gotIt = st.filter(z => z.res === "ok" || z.first === "ok").length;
  const hard = s.items.filter(it => { const z = s.st[sdK(it)]; return z && z.tries && z.first !== "ok"; }).map(it => { const a = atomById(it.aid); return a && a.sents[it.si] ? { a, x: a.sents[it.si] } : null; }).filter(Boolean);
  const body = `<div class="stats"><div><b>${st.length}</b><span>${L("gesprochen", "spoken")}</span></div><div><b>${firstOk}</b><span>${L("beim 1. Versuch", "first try")}</span></div><div><b>${s.hide ? s.ups : gotIt}</b><span>${s.hide ? L("Box höher", "boxes up") : L("am Ende richtig", "right in the end")}</span></div></div>
    ${s.hide ? "" : `<p class="muted small">${L("Deutsch war sichtbar: nur geübt, deine Boxen sind unverändert.", "The German was visible: practice only, your boxes didn't change.")}</p>`}
    ${hard.length ? `<div class="sec-h">${L("Nicht beim ersten Mal: nochmal laut sagen", "Not first time: say them out loud again")}</div><div class="sit">${hard.map(h => `<div class="hard"><span><b>${esc(plain(h.x.de))}</b><div class="e">${esc(h.x.en || "")}</div></span>${TTS ? `<button class="spk" data-say="${esc(plain(h.x.de))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>`).join("")}</div>` : ""}
    <div class="row2"><button class="btn primary" id="sdAgainAll">${L("Nochmal alle", "All again")}</button>${hard.length ? `<button class="btn petrol" id="sdHard">${L(`Nur die ${hard.length} schweren`, `Just the ${hard.length} hard ones`)}</button>` : ""}</div>
    <button class="btn ghost" id="sdHub" style="margin-top:8px">${L("Auswahl ändern", "Change selection")}</button>`;
  shell(L("Sprechtraining", "Speaking drill"), body, { back: SD_BACK.label, backTo: SD_BACK.to, redraw: null });
  if (SD_BACK.fn) $("#back").onclick = SD_BACK.fn;
  $("#sdAgainAll").onclick = () => sdStart(s.items, s.hide);
  const h = $("#sdHard"); if (h) h.onclick = () => sdStart(s.items.filter(it => { const z = s.st[sdK(it)]; return z && z.tries && z.first !== "ok"; }), s.hide);
  $("#sdHub").onclick = () => sdHub();
}
