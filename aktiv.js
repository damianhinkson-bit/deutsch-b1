/* Aktiv: speaking, writing, the atom queue, verbs with prepositions and Redemittel.
   Uses the helpers, storage (DB) and screen shell from index.html. Corrections come from Claude:
   the app copies a ready-made request, Damian pastes Claude's reply back, and the app reads the
   KORREKTUR / FEHLERMUSTER / UMFORMEN block from it. */

const GRAMMAR_URL = "https://damianhinkson-bit.github.io/deutsch-a2/";
const T = a => (a ? (EN() ? a[1] : a[0]) : "");
const ATOM_INT = [0, 1, 3, 7, 16, 35];
const DEFAULT_TR = [
  ["im Perfekt", "in the Perfekt"], ["aus der Sicht von „er“ oder „sie“", "from the point of view of “he” or “she”"],
  ["verneint (mit nicht oder kein)", "negated (with nicht or kein)"], ["im Präteritum", "in the Präteritum"],
  ["mit einem Nebensatz mit weil oder dass", "with a weil or dass clause"], ["als Frage an einen Freund", "as questions to a friend"]
];

const VERBEN = VERBEN_RAW.map(r => ({ id: r[0] + "|" + r[1], verb: r[0], prep: r[1], cas: r[2], en: r[3], ex: r[4], exEn: r[5], x: r[6] || [] }));
const REDEMITTEL = REDEMITTEL_RAW.map(r => ({ id: r[0] + "|" + r[1], cat: r[0], de: r[1], en: r[2], note: r[3] || "" }));
const VBY = {}; VERBEN.forEach(v => VBY[v.id] = v);
const RBY = {}; REDEMITTEL.forEach(r => RBY[r.id] = r);

(function ensureDB() {
  if (!Array.isArray(DB.atoms)) DB.atoms = [];
  if (!DB.dk || typeof DB.dk !== "object") DB.dk = {};
  if (!DB.dk.v) DB.dk.v = {}; if (!DB.dk.r) DB.dk.r = {};
  if (!DB.spDone) DB.spDone = {}; if (!DB.swDone) DB.swDone = {};
  if (!DB.drafts) DB.drafts = {};
})();

/* ---------- styles for the new screens (same tokens as the rest of the app) ---------- */
(function addStyles() {
  const css = `
  .tarea{width:100%;min-height:120px;background:var(--surface);border:1.5px solid var(--line);border-radius:var(--r-md);padding:12px 14px;font-size:16.5px;line-height:1.5;outline:none;resize:vertical;display:block}
  .tarea:focus{border-color:var(--petrol-soft)}
  .ibox{margin-top:12px}
  .interim{min-height:0;color:var(--muted);font-style:italic;font-size:14.5px;padding:4px 2px 0}
  .interim:empty{display:none}
  .mic-row{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
  .mic-row .uml button{width:42px}
  .mic-row .uml{margin:0;flex:1;justify-content:flex-end}
  .mic{display:flex;align-items:center;gap:8px;background:var(--petrol);color:var(--on-petrol);border-radius:99px;padding:11px 18px 11px 14px;font-weight:800;font-size:15.5px;flex:0 0 auto}
  .mic svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .mic.on{background:var(--bad);animation:micpulse 1.4s infinite}
  .mic[disabled]{opacity:.45}
  @keyframes micpulse{0%,100%{box-shadow:0 0 0 0 rgba(201,70,58,.45)}50%{box-shadow:0 0 0 9px rgba(201,70,58,0)}}
  .msg{font-size:13.5px;color:var(--bad);padding:6px 2px 0}.msg:empty{display:none}
  .sit{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:16px}
  .sit .lab{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .sit p{margin:6px 0 0;font-size:16px}
  .pts{margin:10px 0 0;padding-left:20px}.pts li{margin:3px 0}
  .log{display:flex;flex-direction:column;gap:8px;margin-top:14px}
  .bub{max-width:88%;padding:10px 13px;border-radius:16px;font-size:15.5px;line-height:1.4;position:relative}
  .bub.p{align-self:flex-start;background:var(--surface);box-shadow:var(--shadow);border-bottom-left-radius:5px}
  .bub.me{align-self:flex-end;background:var(--petrol);color:var(--on-petrol);border-bottom-right-radius:5px}
  .bub.cur{border:2px solid var(--amber)}
  .bub .who{display:block;font-size:11.5px;font-weight:800;opacity:.7;margin-bottom:2px}
  .bub.p .row{display:flex;gap:10px;align-items:flex-start;justify-content:space-between}
  .hidden-line{color:var(--muted);font-style:italic}
  .hint{margin-top:10px;font-size:14.5px;background:var(--amber-tint);border-radius:12px;padding:10px 12px}
  .hint b{font-weight:800}
  .model{margin-top:10px;background:var(--bg);border:1.5px dashed var(--line);border-radius:12px;padding:10px 12px;font-size:15px;white-space:pre-wrap}
  .model .lab{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
  details.fold{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);margin-top:12px}
  details.fold summary{padding:12px 14px;font-weight:800;font-size:15px;cursor:pointer;list-style:none}
  details.fold summary::-webkit-details-marker{display:none}
  details.fold summary::after{content:"＋";float:right;color:var(--muted)}
  details.fold[open] summary::after{content:"－"}
  details.fold .in{padding:0 14px 12px}
  .phr{padding:6px 0;border-top:1px solid var(--line);display:flex;gap:10px;align-items:center}
  .phr:first-child{border-top:none}
  .phr .tx2{flex:1;min-width:0}.phr b{display:block;font-size:15px}.phr span{color:var(--muted);font-size:13px}
  .wc{font-size:13px;color:var(--muted);text-align:right;padding-top:4px;font-variant-numeric:tabular-nums}
  .timer{font-variant-numeric:tabular-nums;font-weight:800;color:var(--muted);font-size:14px;white-space:nowrap}
  .cb{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:16px;margin-top:18px}
  .cb h3{margin:0 0 4px;font-size:17px}
  .step{display:flex;gap:10px;align-items:flex-start;margin-top:12px}
  .step .n{width:26px;height:26px;border-radius:50%;background:var(--amber);color:var(--amber-ink);font-weight:800;display:grid;place-items:center;flex:0 0 auto;font-size:14px}
  .step .b{flex:1;min-width:0}
  .ta2{width:100%;min-height:90px;background:var(--bg);border:1.5px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14.5px;outline:none;margin-top:8px}
  .fp{margin:6px 0 0;padding-left:20px}.fp li{margin:2px 0}
  .tin{width:100%;background:var(--surface);border:1.5px solid var(--line);border-radius:12px;padding:11px 13px;font-size:16px;font-weight:700;outline:none;margin-top:6px}
  .lab2{font-size:13px;font-weight:800;color:var(--muted);margin-top:12px;display:block}
  .badge{font-size:11.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:var(--surface-2);color:var(--muted);white-space:nowrap}
  .badge.due{background:var(--amber);color:var(--amber-ink)} .badge.ok{background:var(--good-tint);color:var(--good)}
  .diff{white-space:pre-wrap;line-height:1.7}
  .diff .miss{background:var(--good-tint);color:var(--good);font-weight:800;border-radius:4px;padding:0 2px}
  .diff .extra{background:var(--bad-tint);color:var(--bad);text-decoration:line-through;border-radius:4px;padding:0 2px}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
  .g2 button{padding:16px 6px;border-radius:var(--r-md);border:2px solid var(--line);background:var(--surface);font-size:19px;font-weight:800}
  .g2 button.ok{background:var(--good);border-color:var(--good);color:#fff}.g2 button.no{background:var(--bad);border-color:var(--bad);color:#fff}.g2 button.dim{opacity:.45}
  .sent{font-size:22px;font-weight:700;line-height:1.35;margin:12px 0 4px}
  .sent .gap{display:inline-block;min-width:54px;border-bottom:3px solid var(--amber);color:var(--amber)}
  .tokens{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;min-height:48px}
  .tok{background:var(--surface);border:1.5px solid var(--line);border-radius:10px;padding:8px 12px;font-weight:700;font-size:16px}
  .tokens.ans{background:var(--bg);border-radius:14px;padding:10px;border:1.5px dashed var(--line)}
  .tokens.ans .tok{background:var(--petrol);border-color:var(--petrol);color:var(--on-petrol)}
  .sec-h{font-size:13px;font-weight:800;color:var(--muted);margin:20px 2px 6px;text-transform:uppercase;letter-spacing:.05em}
  .ext{font-size:13px;color:var(--muted)}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

const AICON = {
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>'
};

/* ---------- drafts (so nothing is lost when you switch screens) ---------- */
let draftT;
function draftGet(k) { return (DB.drafts && DB.drafts[k]) || ""; }
function draftSet(k, v) { if (!DB.drafts) DB.drafts = {}; if (v) DB.drafts[k] = v; else delete DB.drafts[k]; clearTimeout(draftT); draftT = setTimeout(save, 400); }

/* ---------- speech recognition (guarded) ---------- */
const SRC = (() => { try { return window.SpeechRecognition || window.webkitSpeechRecognition || null; } catch (e) { return null; } })();
const ANDROID = /Android/i.test((navigator && navigator.userAgent) || "");
let REC = { on: false, r: null, cb: null, errs: 0 };
function recStart(cb) {
  if (!SRC) { cb.state(false, L("Spracherkennung gibt es in diesem Browser nicht. Öffne die App in Chrome oder tippe deine Antwort.", "Speech recognition isn't available in this browser. Open the app in Chrome, or type your answer.")); return; }
  recStop(); hush();
  REC = { on: true, r: null, cb, errs: 0 };
  cb.state(true);
  recSpin();
}
function recSpin() {
  if (!REC.on) return;
  let r;
  try { r = new SRC(); } catch (e) { REC.on = false; REC.cb.state(false, L("Spracherkennung konnte nicht starten.", "Speech recognition couldn't start.")); return; }
  r.lang = "de-DE"; r.interimResults = true; r.continuous = !ANDROID; r.maxAlternatives = 1;
  const cb = REC.cb;
  r.onresult = e => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) { cb.final(String(res[0].transcript || "").trim()); REC.errs = 0; } else interim += res[0].transcript;
    }
    cb.interim(interim);
  };
  r.onerror = e => {
    const er = e && e.error;
    const stopWith = m => { if (REC.r === r) { REC.on = false; REC.r = null; } cb.state(false, m); };
    if (er === "not-allowed" || er === "service-not-allowed") stopWith(L("Das Mikrofon ist blockiert. Erlaube es für diese Seite in Chrome.", "The microphone is blocked. Allow it for this site in Chrome."));
    else if (er === "network") stopWith(L("Die Spracherkennung braucht Internet. Ohne Netz tippst du deine Antwort einfach.", "Speech recognition needs the internet. Offline, just type your answer."));
    else if (er === "audio-capture") stopWith(L("Kein Mikrofon gefunden.", "No microphone found."));
    else REC.errs++;
  };
  r.onend = () => {
    cb.interim("");
    if (REC.r !== r) return;
    if (REC.on && REC.errs < 6) { setTimeout(recSpin, 120); return; }
    const was = REC.on; REC.on = false; REC.r = null; if (was) cb.state(false);
  };
  REC.r = r;
  try { r.start(); } catch (e) { REC.on = false; REC.r = null; cb.state(false, L("Spracherkennung konnte nicht starten.", "Speech recognition couldn't start.")); }
}
function recStop() {
  const r = REC.r, was = REC.on, cb = REC.cb;
  REC.on = false; REC.r = null;
  if (r) { try { r.stop(); } catch (e) { } }
  if (was && cb) cb.state(false);
}

/* ---------- input box: textarea + microphone + umlauts ---------- */
function inputBox(key, opt = {}) {
  const val = opt.value != null ? opt.value : draftGet(key);
  return `<div class="ibox">
    <textarea class="tarea" id="ib-${key}" rows="${opt.rows || 5}" placeholder="${esc(opt.ph || L("Sprich oder schreib auf Deutsch …", "Speak or type in German …"))}" autocapitalize="sentences" spellcheck="false" aria-label="${L("Dein Text", "Your text")}">${esc(val)}</textarea>
    <div class="interim" id="ib-${key}-int"></div>
    <div class="mic-row"><button class="mic" id="ib-${key}-mic" type="button">${AICON.mic}<span>${L("Sprechen", "Speak")}</span></button>
      ${opt.timer ? `<span class="timer" id="ib-${key}-tm"></span>` : ""}
      <div class="uml">${["ä", "ö", "ü", "ß"].map(c => `<button type="button" data-ins="${key}" data-c="${c}">${c}</button>`).join("")}</div></div>
    <div class="msg" id="ib-${key}-msg"></div>
    ${opt.wc ? `<div class="wc" id="ib-${key}-wc"></div>` : ""}
  </div>`;
}
function words(s) { return (String(s).trim().match(/\S+/g) || []).length; }
function bindInput(key, opt = {}) {
  const ta = $("#ib-" + key), mic = $("#ib-" + key + "-mic"), int = $("#ib-" + key + "-int"), msg = $("#ib-" + key + "-msg"), wc = $("#ib-" + key + "-wc"), tm = $("#ib-" + key + "-tm");
  if (!ta) return;
  const upd = () => { if (wc) wc.textContent = `${words(ta.value)}${opt.wc ? " / ~" + opt.wc : ""} ${L("Wörter", "words")}`; if (opt.draft !== false) draftSet(key, ta.value); if (opt.onInput) opt.onInput(ta.value); };
  ta.addEventListener("input", upd); upd();
  document.querySelectorAll(`[data-ins="${key}"]`).forEach(b => b.onclick = () => { const p = ta.selectionStart ?? ta.value.length; ta.value = ta.value.slice(0, p) + b.dataset.c + ta.value.slice(ta.selectionEnd ?? p); ta.focus(); try { ta.setSelectionRange(p + 1, p + 1); } catch (e) { } upd(); });
  let t0 = 0, acc = opt.elapsed || 0, tick = null;
  const showT = () => { if (!tm) return; const s = Math.round(acc + (t0 ? (Date.now() - t0) / 1000 : 0)); tm.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}${opt.timer ? " / " + Math.floor(opt.timer / 60) + ":" + String(opt.timer % 60).padStart(2, "0") : ""}`; };
  showT();
  const setOn = on => {
    if (!mic.isConnected) return;
    mic.classList.toggle("on", on);
    mic.innerHTML = (on ? AICON.stop : AICON.mic) + `<span>${on ? L("Stopp", "Stop") : L("Sprechen", "Speak")}</span>`;
    if (on) { t0 = Date.now(); clearInterval(tick); tick = setInterval(() => { if (!mic.isConnected) { clearInterval(tick); return; } showT(); }, 500); }
    else { if (t0) acc += (Date.now() - t0) / 1000; t0 = 0; clearInterval(tick); showT(); if (opt.onTime) opt.onTime(acc); }
  };
  mic.onclick = () => {
    if (REC.on) { recStop(); return; }
    msg.textContent = "";
    recStart({
      final: txt => { if (!txt || !ta.isConnected) return; const sep = ta.value && !/\s$/.test(ta.value) ? " " : ""; ta.value += sep + txt; upd(); },
      interim: txt => { if (int.isConnected) int.textContent = txt; },
      state: (on, m) => { setOn(on); if (m && msg.isConnected) msg.textContent = m; }
    });
  };
  if (!SRC) { msg.textContent = L("Spracherkennung geht nur in Chrome. Du kannst trotzdem tippen.", "Speech recognition only works in Chrome. You can still type."); }
  return ta;
}

/* ---------- copy / share helpers ---------- */
function copyText(text, onDone) {
  const fall = () => { const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (e) { } t.remove(); onDone(ok); };
  try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => onDone(true), fall); else fall(); } catch (e) { fall(); }
}
function shareText(text) {
  try { if (navigator.share) { navigator.share({ text }).catch(() => { }); return true; } } catch (e) { }
  return false;
}

/* ---------- the Claude round trip and the atoms live in atome.js ---------- */

/* ---------- Redemittel helper for task screens ---------- */
function phraseFold(cats, open) {
  const list = []; cats.forEach(c => REDEMITTEL.filter(r => r.cat === c).slice(0, 3).forEach(r => list.push(r)));
  return `<details class="fold" ${open ? "open" : ""}><summary>${L("Hilfreiche Redemittel", "Useful phrases")}</summary><div class="in">${list.map(r => `<div class="phr"><span class="tx2"><b>${esc(r.de)}</b><span>${esc(r.en)}</span></span>${TTS ? `<button class="spk" data-say="${esc(r.de.replace(/…/g, ""))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>`).join("")}</div></details>`;
}

/* =================================================================== HUB */
function atomsDue() { const t = today(); return DB.atoms.filter(a => !a.done && a.due <= t); }
function deckDueCount(d) { const t = today(), st = DB.dk[d]; let n = 0; for (const id in st) if (st[id].due <= t && (d === "v" ? VBY[id] : RBY[id])) n++; return n; }
function aktiv() {
  recStop();
  const ad = atomsDue().length, act = DB.atoms.filter(a => !a.done).length;
  const spN = Object.keys(DB.spDone).length, swN = Object.keys(DB.swDone).length;
  const vD = deckDueCount("v"), rD = deckDueCount("r");
  const item = (id, ic, tt, ss, ext) => `<button class="item" id="${id}"><span class="ic">${ic}</span><span class="tx"><span class="tt">${tt}</span><span class="ss">${ss}</span></span>${ext ? `<span class="ext">↗</span>` : ""}</button>`;
  const body = `<p class="muted" style="margin-top:4px">${L("Hier wird aus Wörtern echtes Deutsch: sprechen, schreiben, von Claude korrigieren lassen und als Atom wiederholen.", "This is where words become real German: speak, write, get corrected by Claude, and review it as an atom.")}</p>
   ${ad ? `<button class="hero" id="hAtoms"><span class="ic">${ad}</span><span><span class="tt">${L("Atome wiederholen", "Review atoms")}</span><span class="ss">${L("Deine eigenen Texte, aus dem Gedächtnis.", "Your own texts, from memory.")}</span></span></button>` : ""}
   <div class="menu">
    ${item("mSp", "🎙", L("Sprechen", "Speaking"), L(`${SPRECHEN.length} Aufgaben · ${spN} geübt`, `${SPRECHEN.length} tasks · ${spN} practised`))}
    ${item("mSw", "✎", L("Schreiben", "Writing"), L(`${SCHREIBEN.length} Aufgaben und freies Schreiben · ${swN} geschrieben`, `${SCHREIBEN.length} tasks plus free writing · ${swN} written`))}
    ${item("mAt", ad || act || "0", L("Atome", "Atoms"), act ? L(`${ad} fällig · ${act} aktiv`, `${ad} due · ${act} active`) : L("Deine korrigierten Texte als Wiederholung", "Your corrected texts, for review"))}
    ${item("mV", vD || "Vp", L("Verben mit Präpositionen", "Verbs with prepositions"), L(`${VERBEN.length} Verben · ${vD} fällig`, `${VERBEN.length} verbs · ${vD} due`))}
    ${item("mR", rD || "Rm", L("Redemittel", "Useful phrases"), L(`${REDEMITTEL.length} Wendungen · ${rD} fällig`, `${REDEMITTEL.length} phrases · ${rD} due`))}
    ${item("mG", "Gr", L("Grammatik-Trainer", "Grammar trainer"), L("A1, A2 und B1: öffnet deine Grammatik-App", "A1, A2 and B1: opens your grammar app"), true)}
   </div>
   <details class="fold"><summary>${L("So funktioniert die Korrektur", "How correction works")}</summary><div class="in"><p class="small" style="margin:0">${L("Nach dem Sprechen oder Schreiben tippst du auf „Teilen“ oder „Kopieren“. Die App macht daraus eine fertige Anfrage für Claude. Claude antwortet mit Erklärungen und einem Block mit KORREKTUR, FEHLERMUSTER und UMFORMEN. Diese Antwort fügst du wieder ein, und die App speichert den Text als Atom. Atome wiederholst du nach 1, 3, 7, 16 und 35 Tagen, zuerst aus dem Gedächtnis, später umgeformt und am Ende ganz frei.", "After speaking or writing, tap “Share” or “Copy”. The app turns it into a ready-made request for Claude. Claude replies with explanations and a block with KORREKTUR, FEHLERMUSTER and UMFORMEN. You paste that reply back and the app saves the text as an atom. You review atoms after 1, 3, 7, 16 and 35 days: first from memory, later transformed, and finally completely freely.")}</p></div></details>`;
  shell(L("Aktiv", "Active"), body, { redraw: aktiv, noLevel: true });
  const h = $("#hAtoms"); if (h) h.onclick = () => startAtomReview(atomsDue().map(a => a.id));
  $("#mSp").onclick = () => spHub(); $("#mSw").onclick = () => swHub(); $("#mAt").onclick = () => atomsHub();
  $("#mV").onclick = () => deckHub("v"); $("#mR").onclick = () => deckHub("r");
  $("#mG").onclick = () => { try { window.open(GRAMMAR_URL, "_blank", "noopener"); } catch (e) { location.href = GRAMMAR_URL; } };
}
function aktivHome() {
  const ad = atomsDue().length, vD = deckDueCount("v"), rD = deckDueCount("r"), tot = ad + vD + rD;
  const bits = [];
  if (ad) bits.push(ad === 1 ? L("1 Atom", "1 atom") : L(`${ad} Atome`, `${ad} atoms`));
  if (vD) bits.push(vD === 1 ? L("1 Verb", "1 verb") : L(`${vD} Verben`, `${vD} verbs`));
  if (rD) bits.push(rD === 1 ? L("1 Redemittel", "1 phrase") : L(`${rD} Redemittel`, `${rD} phrases`));
  return `<button class="hero ghosty" id="goAktiv"><span class="ic">${tot || "🎙"}</span><span><span class="tt">${tot ? L("Aktiv: fällig", "Active: due") : L("Sprechen & schreiben", "Speak & write")}</span><span class="ss">${tot ? esc(bits.join(" · ")) : L("Sprechen, Schreiben, Atome, Verben und Redemittel.", "Speaking, writing, atoms, verbs and phrases.")}</span></span></button>`;
}
function bindAktivHome() { const b = $("#goAktiv"); if (b) b.onclick = () => go("aktiv"); }
function backToHub() { go("aktiv"); }

/* =================================================================== SPRECHEN */
function spHub() {
  recStop();
  const body = Object.keys(SP_CATS).map(c => `<div class="sec-h">${esc(T(SP_CATS[c]))}</div><div class="menu">${SPRECHEN.filter(t => t.cat === c).map(t => `<button class="item" data-sp="${t.id}"><span class="ic">${t.type === "dlg" ? "💬" : "🗣"}</span><span class="tx"><span class="tt">${esc(T(t.t))}</span><span class="ss">${t.type === "dlg" ? L(`Gespräch · ${t.turns.length} Antworten`, `Conversation · ${t.turns.length} replies`) : L(`Allein sprechen · ca. ${Math.round(t.sec / 60 * 2) / 2} Min.`, `Monologue · about ${Math.round(t.sec / 60 * 2) / 2} min`)}</span></span>${DB.spDone[t.id] ? `<span class="badge ok">✓</span>` : ""}</button>`).join("")}</div>`).join("")
    + `<p class="muted small" style="margin-top:14px">${SRC ? L("Die Spracherkennung schickt deine Stimme an Google und braucht meistens Internet. Ohne Netz kannst du deine Antworten tippen.", "Speech recognition sends your voice to Google and usually needs the internet. Offline, you can type your answers.") : L("Spracherkennung geht nur in Chrome. Hier kannst du deine Antworten tippen.", "Speech recognition only works in Chrome. Here you can type your answers.")}</p>`;
  shell(L("Sprechen", "Speaking"), body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: spHub });
  document.querySelectorAll("[data-sp]").forEach(b => b.onclick = () => { const t = SPRECHEN.find(x => x.id === b.dataset.sp); if (t.type === "dlg") startDialog(t); else monoTask(t); });
}
function sitCard(t, label) {
  return `<div class="sit"><span class="lab">${esc(label || L("Situation", "Situation"))}</span><p>${esc(T(t.sit))}</p>${t.pts ? `<ul class="pts">${t.pts.map(p => `<li>${esc(T(p))}</li>`).join("")}</ul>` : ""}</div>`;
}

/* ---- conversation ---- */
let DLG = null;
function startDialog(t) { DLG = { t, i: 0, me: [], showModel: false }; dialogTurn(true); }
function dialogTurn(speak) {
  recStop();
  const s = DLG, t = s.t;
  if (s.i >= t.turns.length) { dialogDone(); return; }
  const turn = t.turns[s.i];
  const hide = !!DB.spHide;
  const log = t.turns.slice(0, s.i).map((x, i) => `<div class="bub p"><span class="who">${L("Partner", "Partner")}</span>${esc(x.p)}</div><div class="bub me"><span class="who">${L("Du", "You")}</span>${esc(s.me[i] || "")}</div>`).join("");
  const body = `${sitCard(t)}
    <button class="row-sw" id="hideSw" aria-pressed="${hide}"><span class="tx"><b>${L("Partner nur hören", "Listen only")}</b><span class="muted small">${TTS ? L("Der Text erscheint erst, wenn du tippst. Gutes Hörtraining.", "The text only appears when you tap. Good listening practice.") : L("Ton ist hier nicht verfügbar, deshalb siehst du den Text immer.", "Sound isn't available here, so the text is always shown.")}</span></span><span class="sw ${hide ? "on" : ""}"><i></i></span></button>
    <div class="log">${log}
      <div class="bub p cur"><span class="who">${L("Partner", "Partner")} · ${s.i + 1}/${t.turns.length}</span><div class="row"><span id="pLine">${hide && TTS ? `<span class="hidden-line">${L("Tippe zum Anzeigen", "Tap to show")}</span>` : esc(turn.p)}</span>${TTS ? `<button class="spk" data-say="${esc(turn.p)}" aria-label="${L("Nochmal anhören", "Play again")}">${ICON.spk}</button>` : ""}</div></div>
    </div>
    <div class="hint"><b>${L("Deine Aufgabe:", "Your task:")}</b> ${esc(T(turn.h))}</div>
    ${inputBox("dlg", { value: s.me[s.i] || "", rows: 3, draft: false })}
    <div class="row2"><button class="btn ghost" id="mdl">${s.showModel ? L("Muster ausblenden", "Hide example") : L("Muster zeigen", "Show example")}</button><button class="btn primary" id="nx">${s.i + 1 < t.turns.length ? L("Weiter", "Next") : L("Fertig", "Finish")}</button></div>
    <div id="mdlBox">${s.showModel ? modelBox(turn.m) : ""}</div>
    ${phraseFold(SP_PHR[t.cat] || [], false)}`;
  shell(T(t.t), body, { back: L("Sprechen", "Speaking"), backTo: "aktiv", redraw: () => dialogTurn(false) });
  $("#back").onclick = () => { recStop(); spHub(); };
  const ta = bindInput("dlg", { draft: false, onInput: v => { s.me[s.i] = v; } });
  $("#hideSw").onclick = () => { DB.spHide = !DB.spHide; save(); dialogTurn(false); };
  const pl = $("#pLine"); if (pl && hide && TTS) pl.onclick = () => { pl.textContent = turn.p; };
  $("#mdl").onclick = () => { s.showModel = !s.showModel; $("#mdlBox").innerHTML = s.showModel ? modelBox(turn.m) : ""; $("#mdl").textContent = s.showModel ? L("Muster ausblenden", "Hide example") : L("Muster zeigen", "Show example"); };
  $("#nx").onclick = () => {
    const v = (ta.value || "").trim();
    if (!v) { toast(L("Sag oder tipp zuerst deine Antwort.", "Say or type your answer first.")); return; }
    recStop(); s.me[s.i] = v; s.i++; s.showModel = false; dialogTurn(true); const cur = $(".bub.cur"); if (cur) try { cur.scrollIntoView({ block: "center" }); } catch (e) { }
  };
  if (speak && TTS && DB.autoSay !== false) setTimeout(() => say(turn.p), 250);
}
function modelBox(text) {
  return `<div class="model"><div class="lab"><span>${L("Beispiel", "Example")}</span>${TTS ? `<button class="spk" data-say="${esc(text)}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>${esc(text)}</div>`;
}
function dialogDone() {
  recStop();
  const s = DLG, t = s.t;
  DB.spDone[t.id] = today(); save();
  const txt = t.turns.map((x, i) => `Partner: ${x.p}\nIch: ${s.me[i] || ""}`).join("\n");
  const body = `${sitCard(t, L("Geschafft", "Done"))}
    <div class="sec-h">${L("Dein Gespräch und ein Beispiel", "Your conversation and an example")}</div>
    <div class="log">${t.turns.map((x, i) => `<div class="bub p"><span class="who">${L("Partner", "Partner")}</span>${esc(x.p)}</div><div class="bub me"><span class="who">${L("Du", "You")}</span>${esc(s.me[i] || "")}</div><div class="model" style="align-self:flex-end;max-width:88%"><div class="lab"><span>${L("Beispiel", "Example")}</span>${TTS ? `<button class="spk" data-say="${esc(x.m)}">${ICON.spk}</button>` : ""}</div>${esc(x.m)}</div>`).join("")}</div>
    <div id="cbHost"></div>
    <div class="row2"><button class="btn ghost" id="again">${L("Nochmal", "Again")}</button><button class="btn ghost" id="list">${L("Andere Aufgabe", "Another task")}</button></div>`;
  shell(T(t.t), body, { back: L("Sprechen", "Speaking"), backTo: "aktiv", redraw: dialogDone });
  $("#back").onclick = () => spHub();
  claudeBlock({ kindDe: "Sprechen (Gespräch)", kindKey: "sp", title: t.t[0], task: t.sit[0], text: txt, spoken: true, dialog: true, cue: t.turns.map(x => x.p).join("\n") }, $("#cbHost"));
  $("#again").onclick = () => startDialog(t); $("#list").onclick = () => spHub();
}

/* ---- monologue ---- */
let MONO_T = {};
function monoTask(t) {
  recStop();
  const key = "sp-" + t.id;
  const body = `${sitCard(t, L("Aufgabe", "Task"))}
    <p class="muted small" style="margin:10px 2px 0">${L(`Sprich ungefähr ${Math.round(t.sec / 60 * 2) / 2} Minuten. Tipp auf „Sprechen“ und sprich ohne Pause weiter, auch wenn du Fehler machst.`, `Speak for about ${Math.round(t.sec / 60 * 2) / 2} minutes. Tap “Speak” and keep going even if you make mistakes.`)}</p>
    ${inputBox(key, { rows: 7, timer: t.sec, wc: 0 })}
    ${phraseFold(SP_PHR[t.cat] || [], false)}
    <details class="fold" id="mFold"><summary>${L("Beispieltext", "Example text")}</summary><div class="in">${modelBox(t.m)}</div></details>
    <button class="btn primary" id="done">${L("Fertig: korrigieren lassen", "Done: get it corrected")}</button>
    <div id="cbHost"></div>`;
  shell(T(t.t), body, { back: L("Sprechen", "Speaking"), backTo: "aktiv", redraw: () => monoTask(t) });
  $("#back").onclick = () => { recStop(); spHub(); };
  const ta = bindInput(key, { timer: t.sec, elapsed: MONO_T[t.id] || 0, onTime: s => { MONO_T[t.id] = s; } });
  $("#done").onclick = () => {
    recStop();
    const v = ta.value.trim(); if (words(v) < 5) { toast(L("Sprich oder schreib zuerst ein paar Sätze.", "Say or write a few sentences first.")); return; }
    DB.spDone[t.id] = today(); save();
    claudeBlock({ kindDe: t.cat === "praes" ? "Sprechen (Präsentation)" : "Sprechen (allein)", kindKey: "sp", title: t.t[0], task: t.sit[0] + " Punkte: " + t.pts.map(p => p[0]).join(", ") + ".", text: v, spoken: true, cue: t.pts.map(p => p[0]).join(" · "), onSaved: () => { draftSet(key, ""); delete MONO_T[t.id]; } }, $("#cbHost"));
    $("#cbHost").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* =================================================================== SCHREIBEN */
function swHub() {
  recStop();
  const body = `<div class="menu"><button class="item" id="free"><span class="ic">✦</span><span class="tx"><span class="tt">${L("Freies Schreiben", "Free writing")}</span><span class="ss">${L("Dein Thema, deine Sätze. Wird dein nächstes Atom.", "Your topic, your sentences. Becomes your next atom.")}</span></span></button></div>`
    + Object.keys(SW_CATS).map(c => `<div class="sec-h">${esc(T(SW_CATS[c]))}</div><div class="menu">${SCHREIBEN.filter(t => t.cat === c).map(t => `<button class="item" data-sw="${t.id}"><span class="ic">✎</span><span class="tx"><span class="tt">${esc(T(t.t))}</span><span class="ss">${L(`ca. ${t.w} Wörter`, `about ${t.w} words`)}${draftGet("sw-" + t.id) ? L(" · Entwurf gespeichert", " · draft saved") : ""}</span></span>${DB.swDone[t.id] ? `<span class="badge ok">✓</span>` : ""}</button>`).join("")}</div>`).join("");
  shell(L("Schreiben", "Writing"), body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: swHub });
  $("#free").onclick = () => freeWrite();
  document.querySelectorAll("[data-sw]").forEach(b => b.onclick = () => swTask(SCHREIBEN.find(x => x.id === b.dataset.sw)));
}
function swTask(t) {
  recStop();
  const key = "sw-" + t.id;
  const body = `<div class="sit"><span class="lab">${L("Aufgabe", "Task")}</span><p>${esc(T(t.task))}</p><ul class="pts">${t.pts.map(p => `<li>${esc(T(p))}</li>`).join("")}</ul></div>
    ${inputBox(key, { rows: 9, wc: t.w, ph: L("Schreib hier. Du kannst auch diktieren.", "Write here. You can also dictate.") })}
    ${phraseFold(SW_PHR[t.cat] || [], false)}
    <details class="fold"><summary>${L("Beispieltext (erst nach dem Schreiben!)", "Example text (after you've written!)")}</summary><div class="in">${modelBox(t.m)}</div></details>
    <button class="btn primary" id="done">${L("Fertig: korrigieren lassen", "Done: get it corrected")}</button>
    <div id="cbHost"></div>`;
  shell(T(t.t), body, { back: L("Schreiben", "Writing"), backTo: "aktiv", redraw: () => swTask(t) });
  $("#back").onclick = () => { recStop(); swHub(); };
  const ta = bindInput(key, { wc: t.w });
  $("#done").onclick = () => {
    recStop();
    const v = ta.value.trim(); if (words(v) < 5) { toast(L("Schreib zuerst ein paar Sätze.", "Write a few sentences first.")); return; }
    DB.swDone[t.id] = today(); save();
    claudeBlock({ kindDe: "Schreiben", kindKey: "sw", title: t.t[0], task: t.task[0] + " Punkte: " + t.pts.map(p => p[0]).join(" ") , text: v, cue: t.pts.map(p => p[0]).join(" · "), onSaved: () => draftSet(key, "") }, $("#cbHost"));
    $("#cbHost").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
function freeWrite() {
  recStop();
  const body = `<p class="muted" style="margin-top:4px">${L("Schreib oder sprich 5 bis 10 Sätze über etwas aus deinem Leben, ohne nachzuschlagen. Fehler sind erwünscht: Sie werden dein Fehlermuster.", "Write or say 5 to 10 sentences about something in your life, without looking anything up. Mistakes are welcome: they become your mistake pattern.")}</p>
    <label class="lab2" for="frT">${L("Titel", "Title")}</label><input class="tin" id="frT" value="${esc(draftGet("frei-t"))}" placeholder="${L("z. B. Mein Zimmer", "e.g. My room")}">
    ${inputBox("frei", { rows: 9, wc: 0 })}
    <button class="btn primary" id="done">${L("Fertig: korrigieren lassen", "Done: get it corrected")}</button>
    <div id="cbHost"></div>`;
  shell(L("Freies Schreiben", "Free writing"), body, { back: L("Schreiben", "Writing"), backTo: "aktiv", redraw: freeWrite });
  $("#back").onclick = () => { recStop(); swHub(); };
  const ta = bindInput("frei", {});
  $("#frT").addEventListener("input", e => draftSet("frei-t", e.target.value));
  $("#done").onclick = () => {
    recStop();
    const v = ta.value.trim(); if (words(v) < 5) { toast(L("Schreib zuerst ein paar Sätze.", "Write a few sentences first.")); return; }
    const title = $("#frT").value.trim();
    claudeBlock({ kindDe: "Freies Schreiben", kindKey: "frei", title, task: "", text: v, onSaved: () => { draftSet("frei", ""); draftSet("frei-t", ""); } }, $("#cbHost"));
    $("#cbHost").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* =================================================================== ATOME: see atome.js */
/* word-level diff (longest common subsequence), compared without case and punctuation */
function diffHtml(mine, target) {
  const tok = s => String(s).split(/\s+/).filter(Boolean);
  const key = w => w.toLowerCase().replace(/[.,!?;:"„“'()«»–-]/g, "").replace(/ß/g, "ss");
  const A = tok(mine), B = tok(target), n = A.length, m = B.length;
  if (n * m > 250000) return esc(target);
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = key(A[i]) === key(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (key(A[i]) === key(B[j])) { out.push(esc(B[j])); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="extra">${esc(A[i])}</span>`); i++; }
    else { out.push(`<span class="miss">${esc(B[j])}</span>`); j++; }
  }
  while (i < n) out.push(`<span class="extra">${esc(A[i++])}</span>`);
  while (j < m) out.push(`<span class="miss">${esc(B[j++])}</span>`);
  return out.join(" ");
}

/* =================================================================== DECKS (Verben, Redemittel) */
const DECKS = {
  v: { name: ["Verben mit Präpositionen", "Verbs with prepositions"], items: VERBEN, by: VBY,
       modes: { luecke: ["Lücke", "Gap"], kasus: ["Kasus", "Case"], karte: ["Karte", "Card"] },
       modesFor: it => TWO_WAY.includes(it.prep) ? ["luecke", "kasus", "karte"] : ["luecke", "karte"],
       filters: { all: ["Alle", "All"], A: ["+ Akkusativ", "+ accusative"], D: ["+ Dativ", "+ dative"] },
       filt: (it, f) => f === "all" || it.cas === f },
  r: { name: ["Redemittel", "Useful phrases"], items: REDEMITTEL, by: RBY,
       modes: { situation: ["Situation", "Situation"], karte: ["Karte", "Card"], satzbau: ["Satzbau", "Word order"], hoeren: ["Hören", "Listening"] },
       modesFor: it => { const m = ["situation", "karte"]; if (rmTokens(it).length >= 3) m.push("satzbau"); if (TTS) m.push("hoeren"); return m; },
       filters: Object.assign({ all: ["Alle", "All"] }, Object.fromEntries(Object.keys(RM_CATS).map(k => [k, [RM_CATS[k][0], RM_CATS[k][1]]]))),
       filt: (it, f) => f === "all" || it.cat === f }
};
const DK_NEW = 10;
function rmTokens(it) { if (/\//.test(it.de)) return []; return it.de.replace(/…/g, " ").split(/\s+/).filter(t => t && t !== "," ); }
function verbLabel(v) { return `${v.verb} ${v.prep} + ${v.cas === "A" ? "Akk." : "Dat."}`; }
function dkSt(d, id) { return DB.dk[d][id]; }
function dkGrade(d, id, ok) {
  let c = DB.dk[d][id]; if (!c) c = DB.dk[d][id] = { lv: 0, ok: 0, bad: 0, due: today() };
  if (ok) { c.lv = Math.min(5, c.lv + 1); c.ok++; } else { c.lv = c.lv > 2 ? 1 : Math.max(0, c.lv - 1); c.bad++; }
  c.due = c.lv === 0 ? today() : addDays(today(), INTERVAL[Math.max(1, c.lv)]);
  save();
}
let dkPr = { v: { mode: "mix", f: "all", n: "20" }, r: { mode: "mix", f: "all", n: "20" } };
function deckHub(d) {
  recStop();
  const D = DECKS[d], t = today();
  const due = D.items.filter(it => { const c = dkSt(d, it.id); return c && c.due <= t; }).map(it => it.id);
  const fresh = D.items.filter(it => !dkSt(d, it.id)).map(it => it.id);
  const started = D.items.length - fresh.length, sure = D.items.filter(it => { const c = dkSt(d, it.id); return c && c.lv >= 4; }).length;
  const nNew = due.length >= 30 ? 0 : Math.min(DK_NEW, fresh.length);
  const p = dkPr[d];
  const pool = D.items.filter(it => D.filt(it, p.f)).map(it => it.id);
  const chip = (k, v, l) => `<button class="chip" data-k="${k}" data-v="${v}" aria-pressed="${p[k] === v}">${esc(l)}</button>`;
  const body = `<div class="stats"><div><b>${due.length}</b><span>${L("fällig", "due")}</span></div><div><b>${started}/${D.items.length}</b><span>${L("begonnen", "started")}</span></div><div><b>${sure}</b><span>${L("sicher", "secure")}</span></div></div>
    <button class="hero" id="learn" ${due.length + nNew ? "" : "disabled"}><span class="ic">${due.length + nNew}</span><span><span class="tt">${L("Lernen", "Learn")}</span><span class="ss">${L(`${due.length} fällig · ${nNew} neu. Zählt für deinen Wiederholungsplan.`, `${due.length} due · ${nNew} new. Counts for your review plan.`)}</span></span></button>
    <div class="h2">${L("Frei üben", "Free practice")}</div>
    <div class="chips">${chip("mode", "mix", L("Gemischt", "Mixed"))}${Object.keys(D.modes).map(m => m === "hoeren" && !TTS ? "" : chip("mode", m, T(D.modes[m]))).join("")}</div>
    <div class="chips">${Object.keys(D.filters).map(f => chip("f", f, T(D.filters[f]))).join("")}</div>
    <div class="chips">${chip("n", "10", "10")}${chip("n", "20", "20")}${chip("n", "all", L("Alle", "All"))}</div>
    <button class="btn petrol" id="free" ${pool.length ? "" : "disabled"}>${L(`${p.n === "all" ? pool.length : Math.min(pool.length, +p.n)} üben (aus ${pool.length})`, `Practise ${p.n === "all" ? pool.length : Math.min(pool.length, +p.n)} (from ${pool.length})`)}</button>
    <p class="muted small">${L("Freies Üben ändert deinen Wiederholungsplan nicht.", "Free practice doesn't change your review plan.")}</p>
    <button class="btn ghost" id="all">${L("Alle ansehen", "See them all")}</button>`;
  shell(T(D.name), body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: () => deckHub(d) });
  document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { p[b.dataset.k] = b.dataset.v; deckHub(d); });
  $("#learn").onclick = () => { const ids = due.concat(fresh.slice(0, nNew)); if (ids.length) startDeck(d, ids, true, "mix"); };
  $("#free").onclick = () => { const ids = shuffle(pool).slice(0, p.n === "all" ? pool.length : +p.n); startDeck(d, ids, false, p.mode); };
  $("#all").onclick = () => deckList(d);
}
function deckList(d) {
  const D = DECKS[d];
  const lvTxt = c => !c ? L("neu", "new") : c.lv >= 4 ? L("sicher", "secure") : L("Stufe ", "Level ") + c.lv;
  let body;
  if (d === "v") body = `<div class="list">${D.items.map(v => { const c = dkSt(d, v.id); return `<div class="li"><span class="tx"><span class="d">${esc(verbLabel(v))}</span><span class="e">${esc(v.en)} · ${esc(v.ex.replace(/[\[\]]/g, ""))}</span></span><span class="lv ${c ? "l" + c.lv : ""}">${lvTxt(c)}</span></div>`; }).join("")}</div>`;
  else body = Object.keys(RM_CATS).map(k => `<div class="sec-h">${esc(T(RM_CATS[k]))}</div><div class="list">${D.items.filter(r => r.cat === k).map(r => { const c = dkSt(d, r.id); return `<div class="li"><span class="tx"><span class="d">${esc(r.de)}</span><span class="e">${esc(r.en)}${r.note ? " · " + esc(r.note) : ""}</span></span>${TTS ? `<button class="spk" data-say="${esc(r.de.replace(/…/g, ""))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}<span class="lv ${c ? "l" + c.lv : ""}">${lvTxt(c)}</span></div>`; }).join("")}</div>`).join("");
  shell(T(D.name), body, { back: T(D.name), backTo: "aktiv", redraw: () => deckList(d) });
  $("#back").onclick = () => deckHub(d);
}
let DS = null;
function startDeck(d, ids, srs, pref) {
  DS = { d, queue: srs ? ids.slice() : shuffle(ids), srs, pref, first: {}, total: ids.length, done: 0, right: 0, studied: {}, cur: null };
  deckAsk();
}
function deckAsk() {
  const s = DS; if (!s) return;
  if (!s.queue.length) { deckFinish(); return; }
  const D = DECKS[s.d], it = D.by[s.queue[0]];
  if (s.srs && !dkSt(s.d, it.id) && !s.studied[it.id]) { deckStudy(it); return; }
  if (!s.cur || s.cur.it !== it || s.cur.answered) {
    const ms = D.modesFor(it); const mode = s.pref !== "mix" && ms.includes(s.pref) ? s.pref : s.pref !== "mix" ? ms[0] : ms[Math.floor(Math.random() * ms.length)];
    s.cur = { it, mode, answered: false };
  }
  const c = s.cur, pct = s.total ? 100 * s.done / s.total : 0;
  let inner = "";
  if (s.d === "v") {
    if (c.mode === "luecke") {
      if (!c.opts) c.opts = shuffle([it.prep].concat(shuffle(PREPS.filter(p => p !== it.prep && !it.x.includes(p))).slice(0, 3)));
      inner = `<div class="mode">${L("Welche Präposition?", "Which preposition?")}</div><div class="sent">${esc(it.ex).replace(/\[[^\]]+\]/, '<span class="gap">&nbsp;?&nbsp;</span>')}</div><div class="meta">${esc(it.exEn)}</div><div class="g2">${c.opts.map((o, i) => `<button data-o="${i}">${esc(o)}</button>`).join("")}</div>`;
    } else if (c.mode === "kasus") {
      inner = `<div class="mode">${L("Akkusativ oder Dativ?", "Accusative or dative?")}</div><div class="w sm">${esc(it.verb)} ${esc(it.prep)} + ?</div><div class="meta">${esc(it.en)}</div><div class="g2"><button data-c="A">Akkusativ</button><button data-c="D">Dativ</button></div>`;
    } else {
      inner = `<div class="mode">${L("Karte", "Card")}</div><div class="en" style="font-size:24px">${esc(it.en)}</div><div class="meta">${L("Verb + Präposition + Kasus?", "Verb + preposition + case?")}</div><div id="kb"><button class="btn petrol" id="flip">${L("Aufdecken", "Reveal")}</button></div>`;
    }
  } else {
    if (c.mode === "situation") {
      if (!c.opts) { const grp = RM_CATS[it.cat][4]; c.opts = shuffle([it].concat(shuffle(REDEMITTEL.filter(r => RM_CATS[r.cat][4] !== grp)).slice(0, 3))); }
      inner = `<div class="mode">${L("Was passt?", "What fits?")}</div><div class="en" style="font-size:21px">${esc(T([RM_CATS[it.cat][2], RM_CATS[it.cat][3]]))}</div><div class="opts">${c.opts.map((o, i) => `<button class="opt" data-o="${i}">${esc(o.de)}</button>`).join("")}</div>`;
    } else if (c.mode === "hoeren") {
      if (!c.opts) c.opts = shuffle([it].concat(shuffle(REDEMITTEL.filter(r => r.id !== it.id && r.en !== it.en)).slice(0, 3)));
      inner = `<div class="mode">${L("Hören", "Listening")}</div><button class="bigspk" id="replay" aria-label="${L("Nochmal anhören", "Play again")}">${ICON.spk}</button><div class="meta">${L("Was bedeutet das?", "What does it mean?")}</div><div class="opts">${c.opts.map((o, i) => `<button class="opt" data-o="${i}">${esc(o.en)}</button>`).join("")}</div>`;
    } else if (c.mode === "satzbau") {
      if (!c.tok) { const tk = rmTokens(it); let sh = shuffle(tk.map((t, i) => ({ t, i }))); if (sh.every((x, k) => x.i === k) && tk.length > 1) sh = sh.slice(1).concat(sh[0]); c.tok = sh; c.ans = []; }
      inner = `<div class="mode">${L("Satzbau", "Word order")}</div><div class="en">${esc(it.en)}</div><div class="tokens ans" id="ans">${c.ans.map((x, k) => `<button class="tok" data-a="${k}">${esc(x.t)}</button>`).join("")}</div><div class="tokens" id="pool">${c.tok.map((x, k) => c.ans.includes(x) ? "" : `<button class="tok" data-p="${k}">${esc(x.t)}</button>`).join("")}</div><button class="btn petrol" id="chk" ${c.ans.length === c.tok.length ? "" : "disabled"}>${L("Prüfen", "Check")}</button>`;
    } else {
      inner = `<div class="mode">${L("Karte", "Card")}</div><div class="en" style="font-size:22px">${esc(it.en)}</div><div class="meta">${L("Wie sagt man das auf Deutsch?", "How do you say it in German?")}</div><div id="kb"><button class="btn petrol" id="flip">${L("Aufdecken", "Reveal")}</button></div>`;
    }
  }
  const body = `<div class="stats"><div><b>${s.queue.length}</b><span>${L("offen", "left")}</span></div><div><b>${s.right}</b><span>${L("richtig", "right")}</span></div><div><b>${s.done}</b><span>${L("fertig", "done")}</span></div></div>
    <div class="prog"><i style="width:${pct}%"></i></div><div class="card">${inner}</div><div id="after"></div>`;
  shell(T(DECKS[s.d].name), body, { back: L("Zurück", "Back"), backTo: "aktiv", redraw: () => { if (!s.cur.answered) deckAsk(); } });
  $("#back").onclick = () => { DS = null; deckHub(s.d); };
  if (s.d === "v" && c.mode === "luecke") document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { const ok = c.opts[+b.dataset.o] === it.prep; document.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; if (c.opts[+x.dataset.o] === it.prep) x.classList.add("ok"); else if (x !== b) x.classList.add("dim"); }); if (!ok) b.classList.add("no"); deckAnswer(ok); });
  if (s.d === "v" && c.mode === "kasus") document.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { const ok = b.dataset.c === it.cas; document.querySelectorAll("[data-c]").forEach(x => { x.disabled = true; if (x.dataset.c === it.cas) x.classList.add("ok"); }); if (!ok) b.classList.add("no"); deckAnswer(ok); });
  if (s.d === "r" && (c.mode === "situation" || c.mode === "hoeren")) {
    document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { const ok = c.opts[+b.dataset.o].id === it.id; document.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; const o = c.opts[+x.dataset.o]; if (o.id === it.id) x.classList.add("ok"); else if (x !== b) x.classList.add("dim"); }); if (!ok) b.classList.add("no"); deckAnswer(ok); });
    if (c.mode === "hoeren") { const p = () => say(it.de.replace(/…/g, "")); setTimeout(p, 150); $("#replay").onclick = p; }
  }
  if (s.d === "r" && c.mode === "satzbau") {
    document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { c.ans.push(c.tok[+b.dataset.p]); deckAsk(); });
    document.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { c.ans.splice(+b.dataset.a, 1); deckAsk(); });
    $("#chk").onclick = () => { const ok = c.ans.map(x => x.t).join(" ") === rmTokens(it).join(" "); document.querySelectorAll(".tok").forEach(x => x.disabled = true); $("#ans").style.borderColor = ok ? "var(--good)" : "var(--bad)"; $("#chk").disabled = true; deckAnswer(ok); };
  }
  if (c.mode === "karte") $("#flip").onclick = () => {
    $("#kb").innerHTML = `<div class="w sm" style="margin-top:14px">${esc(s.d === "v" ? verbLabel(it) : it.de)}</div><div class="row2"><button class="btn bad" id="kNo">${L("Nicht gewusst", "Didn't know")}</button><button class="btn petrol" id="kOk">${L("Gewusst", "Knew it")}</button></div>`;
    if (TTS && DB.autoSay !== false) say(s.d === "v" ? it.ex.replace(/[\[\]]/g, "") : it.de.replace(/…/g, ""));
    $("#kOk").onclick = () => deckAnswer(true); $("#kNo").onclick = () => deckAnswer(false);
  };
}
function deckItemHtml(d, it) {
  if (d === "v") return `<div class="fb"><b>${esc(verbLabel(it))}</b> = ${esc(it.en)}</div><div class="ex"><div class="de"><span>${esc(it.ex).replace(/\[([^\]]+)\]/, "<mark>$1</mark>")}</span>${TTS ? `<button class="spk" data-say="${esc(it.ex.replace(/[\[\]]/g, ""))}" aria-label="${L("Satz anhören", "Play sentence")}">${ICON.spk}</button>` : ""}</div><div class="tr">${esc(it.exEn)}</div></div>`;
  return `<div class="fb"><b>${esc(it.de)}</b> = ${esc(it.en)}<div class="muted small">${esc(T([RM_CATS[it.cat][0], RM_CATS[it.cat][1]]))}${it.note ? " · " + esc(it.note) : ""}</div></div>${TTS ? `<div class="row2"><button class="btn ghost" data-say="${esc(it.de.replace(/…/g, ""))}">${L("Anhören", "Play")}</button></div>` : ""}`;
}
function deckStudy(it) {
  const s = DS;
  const body = `<div class="study"><div class="cnt">${L("Neu", "New")} · ${esc(T(DECKS[s.d].name))}</div><div class="card"><div class="w sm">${esc(s.d === "v" ? verbLabel(it) : it.de)}</div><div class="en">${esc(it.en)}</div></div>${deckItemHtml(s.d, it)}<button class="btn primary" id="nx">${L("Jetzt abfragen", "Now test me")}</button></div>`;
  shell(T(DECKS[s.d].name), body, { back: L("Zurück", "Back"), backTo: "aktiv", redraw: () => deckStudy(it) });
  $("#back").onclick = () => { DS = null; deckHub(s.d); };
  if (TTS && DB.autoSay !== false) say(s.d === "v" ? it.ex.replace(/[\[\]]/g, "") : it.de.replace(/…/g, ""));
  $("#nx").onclick = () => { s.studied[it.id] = 1; s.queue.push(s.queue.shift()); deckAsk(); };
}
function deckAnswer(ok) {
  const s = DS, c = s.cur; if (c.answered) return; c.answered = true;
  const it = c.it, id = it.id, isFirst = !(id in s.first);
  if (isFirst) s.first[id] = ok;
  $("#after").innerHTML = `<div class="fb ${ok ? "good" : "bad"}"><b>${ok ? L("Richtig.", "Correct.") : L("Nicht ganz.", "Not quite.")}</b></div>${deckItemHtml(s.d, it)}<button class="btn primary" id="nx">${L("Weiter", "Next")}</button>`;
  if (c.mode !== "karte" && c.mode !== "hoeren" && TTS && DB.autoSay !== false) say(s.d === "v" ? it.ex.replace(/[\[\]]/g, "") : it.de.replace(/…/g, ""));
  s.queue.shift();
  if (ok) { s.done++; if (s.first[id]) s.right++; if (s.srs) dkGrade(s.d, id, s.first[id]); }
  else { const at = Math.min(s.queue.length, 3 + Math.floor(Math.random() * 3)); s.queue.splice(at, 0, id); }
  const nx = $("#nx"); nx.onclick = () => deckAsk(); setTimeout(() => { try { nx.scrollIntoView({ block: "nearest" }); } catch (e) { } }, 30);
}
function deckFinish() {
  const s = DS; DS = null;
  const pct = s.total ? Math.round(100 * s.right / s.total) : 0;
  const body = `<div class="result"><div class="pct">${pct}%</div><div class="lbl">${L("beim ersten Versuch richtig", "right first time")}</div><p class="muted">${s.total} · ${s.right} ${L("sofort gewusst", "known straight away")}</p></div>
    <button class="btn primary" id="hub">${L("Zurück", "Back")}</button>`;
  shell(T(DECKS[s.d].name), body, { back: L("Aktiv", "Active"), backTo: "aktiv" });
  $("#hub").onclick = () => deckHub(s.d);
}
