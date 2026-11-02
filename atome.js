/* Atome v2: the Claude round trip, atoms, the hint ladder and the shared mistake-pattern list.
   Loaded after aktiv.js. Uses DB, save, shell, L, EN, esc, $, toast, today, addDays, shuffle,
   TTS, ICON from index.html and inputBox, bindInput, copyText, shareText, diffHtml, recStop,
   ATOM_INT, DEFAULT_TR, T from aktiv.js.

   Data
   DB.pats  = { id: { name, made, ev: [{ d, r }] } }   r = "ok" | "hint" | "fail"
   atom     = { id, t, k, task, cue, orig, corr, sents: [{ de, en, kw, fp: [patId], box }],
                tr, up, box, due, made, hist, ti, done, v: 2 }
   In sents[].de the corrected spots stand in [square brackets]. */

/* ---------- styles ---------- */
(function addAtomStyles() {
  const css = `
  .ladder{display:flex;gap:4px;margin:12px 0 4px}
  .ladder i{flex:1;height:6px;border-radius:99px;background:var(--surface-2)}
  .ladder i.on{background:var(--amber)} .ladder i.top{background:var(--bad)}
  .lad-l{display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:var(--muted)}
  .hl{margin-top:10px;background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px 14px}
  .hl .lab{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px}
  .hl .en{font-size:18px;font-weight:700;line-height:1.35}
  .hl .kw{display:flex;flex-wrap:wrap;gap:6px}
  .hl .kw span{background:var(--amber-tint);border-radius:8px;padding:4px 9px;font-weight:800}
  .hl .gapS{font-size:18px;font-weight:700;line-height:1.6}
  .hl .gapS u{display:inline-block;min-width:44px;border-bottom:3px solid var(--amber);text-decoration:none;color:transparent}
  .hl .cloze{font-size:18px;font-weight:700;letter-spacing:.04em;line-height:1.6}
  .hl .tok.used{opacity:.35}
  .hl .tokens{justify-content:flex-start;margin-top:4px}
  .prev{margin-top:10px;font-size:14.5px;color:var(--muted);line-height:1.45}
  .prev b{color:var(--ink);font-weight:700}
  .gr{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px 14px;margin-top:10px}
  .gr .tgt{font-size:17px;font-weight:700;line-height:1.4;display:flex;gap:10px;justify-content:space-between;align-items:flex-start}
  .gr .tgt mark{background:var(--amber-tint);color:inherit;border-radius:4px;padding:0 2px}
  .gr .en2{color:var(--muted);font-size:14px;margin-top:2px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px}
  .g3 button{padding:11px 4px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);font-size:13.5px;font-weight:800;line-height:1.2}
  .g3 button.on.ok{background:var(--good);border-color:var(--good);color:#fff}
  .g3 button.on.kn{background:var(--bad);border-color:var(--bad);color:#fff}
  .g3 button.on.nw{background:var(--amber);border-color:var(--amber);color:var(--amber-ink)}
  .pchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .pchip{font-size:12.5px;font-weight:800;padding:5px 10px;border-radius:99px;border:1.5px solid var(--line);background:var(--surface);color:var(--ink);text-align:left}
  .pchip[aria-pressed="true"]{background:var(--petrol);border-color:var(--petrol);color:var(--on-petrol)}
  .pchip.st{cursor:default}
  .pick{margin-top:8px;background:var(--bg);border-radius:12px;padding:10px}
  .pick .tin{font-size:15px;font-weight:600;margin-top:8px}
  .scard{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px 14px;margin-top:10px}
  .scard.guess{border:2px solid var(--amber)}
  .scard .no{font-size:12px;font-weight:800;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
  .scard .tin{font-size:15px;font-weight:600}
  .scard .ta2{min-height:60px;font-size:15.5px;font-weight:600}
  .gban{background:var(--amber-tint);border-radius:10px;padding:8px 10px;font-size:14px;margin:6px 0}
  .gban .row2{margin-top:8px}
  .pbar{display:flex;height:8px;border-radius:99px;overflow:hidden;background:var(--surface-2);margin-top:6px}
  .pbar i{display:block;height:100%}
  .pbar .o{background:var(--good)} .pbar .h{background:var(--amber)} .pbar .f{background:var(--bad)}
  .prow{display:block;width:100%;text-align:left;padding:12px 14px;border-bottom:1px solid var(--line)}
  .prow:last-child{border-bottom:none}
  .prow .top{display:flex;justify-content:space-between;gap:10px;font-weight:800;font-size:15px}
  .prow .top span{color:var(--muted);font-size:13px;white-space:nowrap}
  .prow .sub{font-size:12.5px;color:var(--muted);margin-top:4px}
  .sbox{font-size:11px;font-weight:800;border-radius:99px;padding:2px 7px;background:var(--surface-2);color:var(--muted);white-space:nowrap}
  .slist{margin-top:6px}
  .slist .s{padding:9px 0;border-top:1px solid var(--line)}
  .slist .s:first-child{border-top:none}
  .slist .s .de{display:flex;justify-content:space-between;gap:10px;font-weight:700}
  .slist .s .en{color:var(--muted);font-size:13.5px}
  .seg{display:flex;background:var(--surface-2);border-radius:99px;padding:3px;margin-top:12px}
  .seg button{flex:1;padding:8px 6px;border-radius:99px;font-weight:800;font-size:13.5px;color:var(--muted)}
  .seg button[aria-pressed="true"]{background:var(--surface);color:var(--ink);box-shadow:var(--shadow)}
  .g5{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:10px}
  .g5 button{padding:9px 2px 8px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);font-weight:800;line-height:1.15;display:flex;flex-direction:column;align-items:center;gap:2px}
  .g5 button b{font-size:18px} .g5 button span{font-size:11px;color:var(--muted);font-weight:800}
  .g5 button.on b,.g5 button.on span{color:#fff}
  .g5 button.on[data-g="1"]{background:var(--bad);border-color:var(--bad)}
  .g5 button.on[data-g="2"]{background:#d9733f;border-color:#d9733f}
  .g5 button.on[data-g="3"]{background:var(--amber);border-color:var(--amber)} .g5 button.on[data-g="3"] b,.g5 button.on[data-g="3"] span{color:var(--amber-ink)}
  .g5 button.on[data-g="4"]{background:var(--petrol-soft);border-color:var(--petrol-soft)}
  .g5 button.on[data-g="5"]{background:var(--good);border-color:var(--good)}
  .g5.picked button:not(.on){opacity:.45}
  .boxes{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:4px 0 6px}
  .boxes div{background:var(--surface);border-radius:12px;box-shadow:var(--shadow);padding:8px 4px;text-align:center}
  .boxes b{display:block;font-size:17px;font-weight:800;font-variant-numeric:tabular-nums}
  .boxes span{font-size:11px;font-weight:800;color:var(--muted)}
  .boxes .full b{color:var(--bad)}
  .boxes i{display:block;height:4px;border-radius:99px;background:var(--surface-2);margin:5px 6px 0;overflow:hidden}
  .boxes i em{display:block;height:100%;background:var(--petrol-soft)}
  .boxes .full i em{background:var(--bad)}
  .up{margin-top:10px;background:var(--good-tint);border-radius:12px;padding:10px 12px;font-size:15px;white-space:pre-wrap}
  .up .lab{font-size:12px;font-weight:800;color:var(--good);text-transform:uppercase;letter-spacing:.05em;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* ---------- small helpers ---------- */
function fmtDay(d) { return d <= today() ? L("heute", "today") : d === addDays(today(), 1) ? L("morgen", "tomorrow") : new Date(d + "T12:00").toLocaleDateString(EN() ? "en-GB" : "de-DE", { day: "numeric", month: "short" }); }
const plain = s => String(s || "").replace(/[\[\]]/g, "");
const markedHtml = s => esc(String(s || "")).replace(/\[([^\]]*)\]/g, "<mark>$1</mark>");
const RUNGS = [null, ["Thema", "Topic"], ["Englisch", "English"], ["Stichwörter", "Key words"], ["Wortbank", "Word bank"], ["Lückensatz", "Gap sentence"], ["Lösung", "Answer"]];
const STOP = new Set(("der die das den dem des ein eine einen einem einer eines und oder aber denn sondern weil dass wenn als ob obwohl damit " +
  "ich du er sie es wir ihr mich dich sich mir dir uns euch ihn ihm ihnen mein meine meinen meinem meiner meines dein deine deinen deinem deiner " +
  "sein seine seinen seinem seiner ihre ihren ihrem ihrer unser unsere unseren unserem euer eure " +
  "in im ins an am ans auf aus bei beim mit nach von vom zu zum zur für über unter vor hinter neben zwischen durch gegen ohne um bis seit " +
  "nicht kein keine keinen keinem keiner noch schon auch sehr so ja nein doch nur mal dann da hier dort wie was wer wo wann warum " +
  "ist bin bist sind seid war warst waren wart hat habe hast haben habt hatte hatten wird werde wirst werden wurde " +
  "kann kannst können will willst wollen möchte möchtest möchten muss musst müssen soll sollst sollen darf darfst dürfen " +
  "man es gibt alle viel viele etwas nichts heute jetzt gern gerne").split(/\s+/));
const keyOf = w => w.toLowerCase().replace(/[.,!?;:"„“'()«»…–-]/g, "");

function splitSents(t) {
  return String(t || "").split(/\n+/).flatMap(line => line.split(/(?<=[.!?…])\s+(?=[A-ZÄÖÜ„"(\[])/))
    .map(s => s.replace(/^\s*(?:[-–•*]|\d+[.)])\s+/, "").trim()).filter(Boolean);
}
function autoKw(de) {
  const outside = String(de).replace(/\[[^\]]*\]/g, " ");
  const seen = new Set(), out = [];
  outside.split(/\s+/).forEach(w => { const k = keyOf(w), c = w.replace(/[.,!?;:"„“'()«»…]/g, ""); if (k.length >= 3 && !STOP.has(k) && !seen.has(k)) { seen.add(k); out.push(c); } });
  return out.sort((a, b) => a.localeCompare(b, "de")).slice(0, 5);
}
function kwList(s) { const k = String(s.kw || "").split(/\s*[·,;|]\s*/).map(x => x.trim()).filter(Boolean); return k.length ? k : autoKw(s.de); }
function gapHtml(de) {
  if (/\[[^\]]+\]/.test(de)) return `<div class="gapS">${esc(de).replace(/\[([^\]]*)\]/g, (m, x) => x.trim().split(/\s+/).map(() => "<u>____</u>").join(" "))}</div>`;
  return `<div class="cloze">${esc(String(de).split(/\s+/).map(w => w.replace(/[A-Za-zÄÖÜäöüß]+/, m => m[0] + "_".repeat(Math.max(0, m.length - 1)))).join("  "))}</div>`;
}

/* ---------- boxes: every sentence has its own box and due date; no box holds more than BOX_CAP ---------- */
const BOX_CAP = 25;
const RATE = [null, ["Keine Ahnung", "No idea"], ["Schwer", "Hard"], ["Okay", "OK"], ["Gut", "Good"], ["Leicht", "Easy"]];
function allSents() { const out = []; DB.atoms.forEach(a => a.sents.forEach((x, si) => out.push({ a, s: x, si }))); return out; }
function inBox(x, b) { return !x.wait && x.box === b; }
function boxCount(b, except) { let n = 0; DB.atoms.forEach(a => a.sents.forEach(x => { if (x !== except && inBox(x, b)) n++; })); return n; }
function waitingCount() { let n = 0; DB.atoms.forEach(a => a.sents.forEach(x => { if (x.wait) n++; })); return n; }
/* put a sentence into box b; if b is full, its strongest sentence (best last rating) moves up one box to make room */
function place(x, b, depth) {
  x.wait = false;
  if (b > 5) { x.box = 6; x.due = ""; return; }
  if (boxCount(b, x) >= BOX_CAP && (depth || 0) < 8) {
    const cand = allSents().filter(y => y.s !== x && inBox(y.s, b)).sort((p, q) => (q.s.last || 0) - (p.s.last || 0) || String(q.s.due || "").localeCompare(String(p.s.due || "")));
    if (cand.length) place(cand[0].s, b + 1, (depth || 0) + 1);
  }
  x.box = b; x.due = addDays(today(), ATOM_INT[b]);
}
/* sentences of new atoms wait until box 1 has room */
function admitWaiting() {
  let room = BOX_CAP - boxCount(1), changed = false;
  if (room <= 0) return false;
  const wait = DB.atoms.slice().sort((p, q) => String(p.made || "").localeCompare(String(q.made || ""))).flatMap(a => a.sents.filter(x => x.wait).map(x => ({ a, x })));
  for (const w of wait) { if (room <= 0) break; w.x.wait = false; w.x.box = 1; w.x.due = w.a.made === today() ? addDays(today(), 1) : today(); room--; changed = true; }
  return changed;
}
function isLive(x) { return !x.wait && x.box >= 1 && x.box <= 5; }
function syncAtom(a) {
  const live = a.sents.filter(isLive), waiting = a.sents.some(x => x.wait);
  a.done = !live.length && !waiting && a.sents.length > 0 && a.sents.every(x => x.box >= 6);
  a.box = live.length ? Math.min(...live.map(x => x.box)) : waiting ? 0 : 5;
  const dues = live.filter(x => !x.pend).map(x => x.due).filter(Boolean).sort();
  a.due = dues[0] || "9999-12-31";
}
function dueSents(a) { const t = today(); return a.sents.map((x, i) => i).filter(i => { const x = a.sents[i]; return isLive(x) && !x.pend && x.due <= t; }); }
function atomsDue() { atomsReady(); return DB.atoms.filter(a => !a.done && dueSents(a).length); }
function stripGuess(t) { return String(t || "").replace(GUESS_RE, " ").replace(/\s+/g, " ").trim(); }
function boxLine(x) { return x.wait ? L("wartet", "waiting") : x.box >= 6 ? L("fertig", "done") : "Box " + x.box; }

/* ---------- shared mistake patterns ---------- */
function pNorm(s) { return String(s || "").toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/[^a-z0-9+]+/g, " ").trim(); }
function atomsReady() {
  if (!Array.isArray(DB.atoms)) DB.atoms = [];
  if (!DB.pats || typeof DB.pats !== "object") DB.pats = {};
  if (DB.atomMode !== "satz" && DB.atomMode !== "text") DB.atomMode = "satz";
  let changed = false;
  DB.atoms.forEach(a => {
    if (a.v >= 2 && Array.isArray(a.sents)) return;
    const ids = (a.fp || []).map(n => patFind(n)).filter(Boolean);
    a.sents = splitSents(a.corr).map(de => ({ de, en: "", kw: "", fp: ids.slice(), box: a.box || 1 }));
    if (!a.sents.length) a.sents = [{ de: a.corr || "", en: "", kw: "", fp: ids.slice(), box: a.box || 1 }];
    a.tr = a.tr || []; a.up = a.up || ""; a.hist = a.hist || []; a.v = 2; delete a.fp; changed = true;
  });
  // v3: a due date per sentence, no leftover "(Guess:)", boxes capped
  const old = DB.atoms.filter(a => a.v < 3);
  if (old.length) {
    old.forEach(a => {
      a.sents.forEach(x => { x.de = stripGuess(x.de); x.last = x.last || 0; x.wait = false;
        if (a.done || x.box >= 6) { x.box = 6; x.due = ""; } else { x.box = Math.max(1, Math.min(5, x.box || 1)); x.due = a.due || today(); } });
      a.v = 3;
    });
    // box 1 too full: the newest sentences wait; boxes 2-5 too full: the strongest move up
    const b1 = allSents().filter(y => inBox(y.s, 1)).sort((p, q) => String(q.a.made || "").localeCompare(String(p.a.made || "")));
    b1.slice(0, Math.max(0, b1.length - BOX_CAP)).forEach(y => { y.s.wait = true; y.s.box = 0; y.s.due = ""; });
    for (let b = 2; b <= 5; b++) { let guard = 200; while (boxCount(b) > BOX_CAP && guard--) { const c = allSents().filter(y => inBox(y.s, b)).sort((p, q) => String(q.s.due).localeCompare(String(p.s.due)))[0]; place(c.s, b + 1); } }
    changed = true;
  }
  if (admitWaiting()) changed = true;
  DB.atoms.forEach(syncAtom);
  if (changed) save();
}
function patFind(name, noCreate, en) {
  const n = pNorm(name); if (!n) return null;
  for (const id in DB.pats) if (pNorm(DB.pats[id].name) === n) { if (en && !DB.pats[id].en) DB.pats[id].en = en; return id; }
  if (noCreate) return null;
  const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  DB.pats[id] = { name: String(name).trim(), made: today(), ev: [] };
  if (en) DB.pats[id].en = en;
  return id;
}
function patName(id) { return DB.pats[id] ? DB.pats[id].name : ""; }
function patLabel(id) { const p = DB.pats[id]; return p ? (EN() && p.en ? p.en : p.name) : ""; }
function patEvent(id, r) { const p = DB.pats[id]; if (!p) return; p.ev.push({ d: today(), r }); if (p.ev.length > 200) p.ev = p.ev.slice(-200); }
function patStats(id) {
  const p = DB.pats[id], ev = p ? p.ev.slice(-12) : [];
  const o = ev.filter(e => e.r === "ok").length, h = ev.filter(e => e.r === "hint").length, f = ev.filter(e => e.r === "fail").length, n = ev.length;
  const atoms = DB.atoms.filter(a => a.sents.some(s => s.fp.includes(id)));
  return { o, h, f, n, score: n ? (o + h * 0.5) / n : -1, atoms: atoms.length, act: atoms.filter(a => !a.done).length };
}
function patsSorted() {
  return Object.keys(DB.pats).map(id => Object.assign({ id, name: DB.pats[id].name, label: patLabel(id) }, patStats(id))).filter(p => p.atoms || p.n)
    .sort((a, b) => (a.n ? 0 : 1) - (b.n ? 0 : 1) || a.score - b.score || b.atoms - a.atoms);
}
function patBar(p) { return p.n ? `<div class="pbar"><i class="o" style="width:${p.o / p.n * 100}%"></i><i class="h" style="width:${p.h / p.n * 100}%"></i><i class="f" style="width:${p.f / p.n * 100}%"></i></div>` : `<div class="pbar"></div>`; }
function patLine(p) { return p.n ? L(`${Math.round(p.score * 100)} % · ${p.o} ✓ · ${p.h} mit Hilfe · ${p.f} ✗`, `${Math.round(p.score * 100)}% · ${p.o} ✓ · ${p.h} with hints · ${p.f} ✗`) : L("noch nicht geübt", "not practised yet"); }
function atomPats(a) { const s = new Set(); a.sents.forEach(x => x.fp.forEach(id => { if (DB.pats[id]) s.add(id); })); return [...s]; }

/* ---------- the request for Claude ---------- */
function claudePrompt(ctx) {
  atomsReady();
  const known = patsSorted().map(p => p.name).filter(Boolean).slice(0, 25);
  const P = [];
  P.push("Bitte korrigiere meinen deutschen Text. Mein Ziel: flüssig Deutsch sprechen und schreiben (B1).");
  P.push("Art: " + ctx.kindDe + (ctx.title ? " – " + ctx.title : ""));
  if (ctx.spoken) P.push("Ich habe gesprochen. Der Text kommt aus der Spracherkennung: offensichtliche Erkennungsfehler (z. B. falsche Großschreibung oder fehlende Satzzeichen) bitte nicht als meine Fehler zählen. Wenn du raten musst, was ich gemeint habe, markiere den Satz mit (?).");
  if (ctx.dialog) P.push("Es ist ein Gespräch. Korrigiere nur meine Sätze (Ich:).");
  if (ctx.task) P.push("Aufgabe: " + ctx.task);
  if (known.length) P.push("Meine bekannten Fehlermuster (benutze genau diese Namen, wenn eins passt): " + known.join("; "));
  P.push("", "---", ctx.text.trim(), "---", "");
  P.push("Erkläre die wichtigsten Korrekturen kurz auf Englisch. Schreib danach genau diesen Block:");
  P.push("KORREKTUR:");
  P.push(ctx.dialog ? "(nur meine Sätze, korrigiert, so nah wie möglich an meinem Original)" : "(mein Text korrigiert, so nah wie möglich an meinem Original)");
  P.push("SÄTZE:");
  P.push("1. (korrigierter Satz mit den korrigierten Stellen in [eckigen Klammern]) | (englische Bedeutung) | (2–4 Stichwörter in der Grundform, ohne die korrigierten Stellen)");
  P.push("(ein Satz pro Zeile, nummeriert; geratene Sätze mit (?) am Ende des deutschen Satzes)");
  P.push("FEHLERMUSTER:");
  P.push("- (ein Muster pro Zeile: deutscher Name | englischer Name (Satznummern), z. B. „Verb an Position 2 | Verb in second position (Sätze 1, 3)“)");
  P.push("UMFORMEN:");
  P.push("- (3 kurze Aufgaben zum Umformen für spätere Wiederholungen, z. B. „im Perfekt“ oder „aus Sicht von Anna“)");
  P.push("B1-VERSION:");
  P.push("(derselbe Inhalt eine Stufe besser, natürlich und auf B1-Niveau)");
  P.push("TITEL:");
  P.push("(ein kurzer deutscher Titel für den Text, 2–4 Wörter)");
  return P.join("\n");
}

/* ---------- reading Claude's reply ---------- */
const GUESS_RE = /\s*\((?:\?|guess(?:ed)?|vermutung|geraten)\s*:?\)\s*/gi;
function takeGuess(s) { let g = false; const t = String(s).replace(GUESS_RE, () => { g = true; return " "; }).replace(/\s+/g, " ").trim(); return { t, g }; }
function parseNums(t) {
  const out = new Set();
  String(t).replace(/(\d+)\s*[–-]\s*(\d+)/g, (m, a, b) => { for (let i = +a; i <= +b && i - a < 40; i++) out.add(i); return " "; })
    .replace(/\d+/g, m => { out.add(+m); return " "; });
  return [...out];
}
function parseClaude(raw) {
  const s = String(raw || "").replace(/\r/g, "").replace(/\*\*|__/g, "").split("\n").filter(l => !/^\s*```/.test(l)).join("\n");
  const re = /^[ \t>#]*(KORREKTUR|SÄTZE|SAETZE|ENGLISCH|FEHLERMUSTER|MUSTER|UMFORMEN|B1[- ]VERSION|TITEL)\b[ \t]*:?[ \t]*/gim;
  const marks = []; let m;
  while ((m = re.exec(s))) marks.push({ k: m[1].toUpperCase().replace("SAETZE", "SÄTZE").replace("B1 VERSION", "B1-VERSION"), start: m.index, body: m.index + m[0].length });
  // the last KORREKTUR wins (a quoted prompt may contain one too); without one, the first SÄTZE
  let k0 = -1; marks.forEach((mk, i) => { if (mk.k === "KORREKTUR") k0 = i; });
  if (k0 < 0) marks.forEach((mk, i) => { if (mk.k === "SÄTZE") k0 = i; });
  if (k0 < 0) return null;
  const use = marks.slice(k0), out = {};
  use.forEach((mk, i) => { const end = i + 1 < use.length ? use[i + 1].start : s.length; if (!(mk.k in out)) out[mk.k] = s.slice(mk.body, end).trim(); });
  const isPh = t => /^\([\s\S]*\)$/.test(String(t || "").trim());
  const lines = t => String(t || "").split("\n").map(x => x.replace(/^\s*>\s?/, "").trim()).filter(x => x && !isPh(x));
  const list = t => lines(t).map(x => x.replace(/^\s*(?:[-–•*]|\d+[.)])\s*/, "").trim()).filter(Boolean);
  let sents = [];
  if (out["SÄTZE"] && !isPh(out["SÄTZE"])) {
    lines(out["SÄTZE"]).forEach(l => {
      const parts = l.replace(/^\s*(?:\d+[.)]|[-–•*])\s*/, "").split(/\s+\|\s+|\s*\|\s*/);
      const g = takeGuess(parts[0] || ""); if (!g.t) return;
      sents.push({ de: g.t, en: (parts[1] || "").trim(), kw: (parts[2] || "").trim(), g: g.g });
    });
  }
  const korr = out.KORREKTUR && !isPh(out.KORREKTUR) ? lines(out.KORREKTUR).join("\n") : "";
  if (!sents.length && korr) {
    const en = list(out.ENGLISCH);
    sents = splitSents(korr).map(x => { const g = takeGuess(x); return { de: g.t, en: "", kw: "", g: g.g }; }).filter(x => x.de);
    if (en.length === sents.length) sents.forEach((x, i) => x.en = en[i]);
  }
  if (!sents.length) return null;
  const fp = list(out.FEHLERMUSTER).map(x => {
    const mm = x.match(/\s*\(([^()]*\d[^()]*)\)\s*$/);
    const nums = mm ? parseNums(mm[1]).filter(n => n >= 1 && n <= sents.length) : [];
    let name = (mm ? x.slice(0, mm.index) : x).trim(), en = "";
    if (/^[„“"].*[“”"]$/.test(name)) name = name.slice(1, -1).trim();
    const bar = name.split(/\s+\|\s+|\s*\|\s*/);
    if (bar.length > 1) { name = bar[0].trim(); en = bar.slice(1).join(" ").trim(); }
    return { name, en, nums };
  }).filter(x => x.name);
  const up = out["B1-VERSION"] && !isPh(out["B1-VERSION"]) ? lines(out["B1-VERSION"]).join("\n") : "";
  const title = out.TITEL && !isPh(out.TITEL) ? lines(out.TITEL)[0].replace(/^[„“"]|[“”"]$/g, "").trim() : "";
  return { sents, fp, tr: list(out.UMFORMEN), up, title, muster: list(out.MUSTER), corr: korr ? plain(takeGuess(korr).t) : sents.map(x => plain(x.de)).join(" ") };
}

/* ---------- the atom editor (after a correction, and for "Bearbeiten") ---------- */
/* st = { t, sents:[{de,en,kw,g,pn:[names]}], pats:[names], tr:[], up } */
const PAT_EN = {};
function stateFromParse(p, title) {
  const names = p.fp.map(x => x.name);
  p.fp.forEach(x => { if (x.en) PAT_EN[pNorm(x.name)] = x.en; });
  return {
    t: title || p.title || autoTitle(p.sents), tr: p.tr.slice(), up: p.up || "", pats: names.slice(),
    sents: p.sents.map((s, i) => ({ de: s.de, en: s.en, kw: s.kw, g: !!s.g, pn: p.fp.filter(f => !f.nums.length || f.nums.includes(i + 1)).map(f => f.name) }))
  };
}
function autoTitle(sents) {
  const w = plain((sents[0] || {}).de || "").replace(/[.,!?;:"„“]/g, "").split(/\s+/).filter(Boolean);
  return w.length ? w.slice(0, 4).join(" ") + (w.length > 4 ? " …" : "") : "";
}
function stateFromAtom(a) {
  const pats = atomPats(a).map(patName);
  return { t: a.t, tr: (a.tr || []).slice(), up: a.up || "", pats, sents: a.sents.map(s => ({ de: s.de, en: s.en, kw: s.kw, g: false, pend: s.pend || "", pn: s.fp.map(patName).filter(Boolean), box: s.box, due: s.due, last: s.last, wait: s.wait })) };
}

function atomEditor(host, st, opt) {
  const open = {};
  const draw = () => {
    const guesses = st.sents.filter(s => s.g).length;
    host.innerHTML = `
      <label class="lab2" for="edT">${L("Titel", "Title")}</label><input class="tin" id="edT" value="${esc(st.t)}">
      <p class="muted small" style="margin:12px 2px 0">${guesses ? L(`Prüf kurz, ob das Englisch stimmt. Bei ${guesses === 1 ? "einem Satz" : guesses + " Sätzen"} musste Claude raten: Sag, ob es stimmt.`, `Check the English is what you meant. Claude had to guess ${guesses === 1 ? "one sentence" : guesses + " sentences"}: say whether it's right.`) : L("Prüf kurz, ob das Englisch stimmt. So wirst du später abgefragt: Englisch sehen, Deutsch sagen.", "Check the English is what you meant. That's how you'll be tested later: see the English, say the German.")}</p>
      ${st.sents.map((s, i) => `<div class="scard ${s.g ? "guess" : ""}">
        <div class="no"><span>${i + 1}</span>${s.g ? "" : `<button class="pchip" data-ed="${i}">${open[i] ? L("Fertig", "Done") : L("Ändern", "Change")}</button>`}</div>
        ${open[i] ? `<textarea class="ta2" data-f="de" data-i="${i}" aria-label="${L("Deutscher Satz", "German sentence")}">${esc(s.de)}</textarea>
          <input class="tin" data-f="en" data-i="${i}" value="${esc(s.en)}" placeholder="${L("Englische Bedeutung", "English meaning")}">
          <button class="pchip" data-del="${i}" style="margin-top:8px">${L("Satz löschen", "Delete sentence")}</button>`
        : `<div style="font-size:17px;font-weight:700;line-height:1.4">${esc(plain(s.de))}</div>${s.en ? `<div class="muted" style="margin-top:2px">${esc(s.en)}</div>` : ""}`}
        ${s.g ? `<div class="gban"><b>${L("Geraten. Meintest du das?", "Guessed. Is this what you meant?")}</b>
          ${s.no ? `<textarea class="ta2" data-f="pend" data-i="${i}" placeholder="${L("Was wolltest du sagen? Englisch reicht.", "What did you want to say? English is fine.")}">${esc(s.pend || "")}</textarea>
            <div class="row2"><button class="btn ghost" data-back="${i}">${L("Doch, es stimmt", "Actually, it's right")}</button><button class="btn petrol" data-keep="${i}">${L("Claude fragen", "Ask Claude")}</button></div>`
          : `<div class="row2"><button class="btn petrol" data-ok="${i}">${L("Ja, stimmt", "Yes, right")}</button><button class="btn ghost" data-no="${i}">${L("Nein", "No")}</button></div>`}</div>` : ""}
        ${s.pend && !s.g ? `<div class="gban">${L("Wird von Claude geprüft: ", "Claude will check: ")}<b>${esc(s.pend)}</b></div>` : ""}
      </div>`).join("")}
      <button class="btn primary" id="edSave">${esc(opt.saveLabel)}</button>
      ${opt.cancel ? `<button class="btn ghost" id="edCancel" style="margin-top:8px">${L("Abbrechen", "Cancel")}</button>` : ""}`;
    host.querySelectorAll("[data-f]").forEach(el => el.addEventListener("input", () => { st.sents[+el.dataset.i][el.dataset.f] = el.value; }));
    $("#edT", host).addEventListener("input", e => { st.t = e.target.value; });
    const redo = () => { const y = window.scrollY; draw(); window.scrollTo(0, y); };
    host.querySelectorAll("[data-ed]").forEach(b => b.onclick = () => { const i = +b.dataset.ed; open[i] = !open[i]; redo(); });
    host.querySelectorAll("[data-ok]").forEach(b => b.onclick = () => { const s = st.sents[+b.dataset.ok]; s.g = false; s.no = false; s.pend = ""; redo(); });
    host.querySelectorAll("[data-no]").forEach(b => b.onclick = () => { st.sents[+b.dataset.no].no = true; redo(); const t = host.querySelector(`[data-f="pend"][data-i="${b.dataset.no}"]`); if (t) t.focus(); });
    host.querySelectorAll("[data-back]").forEach(b => b.onclick = () => { const s = st.sents[+b.dataset.back]; s.no = false; s.pend = ""; redo(); });
    host.querySelectorAll("[data-keep]").forEach(b => b.onclick = () => { const s = st.sents[+b.dataset.keep]; s.pend = (s.pend || "").trim(); if (!s.pend) { toast(L("Schreib kurz, was du meintest.", "Write briefly what you meant.")); return; } s.g = false; s.no = false; redo(); });
    let armed = -1;
    host.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const i = +b.dataset.del; if (armed !== i) { armed = i; b.textContent = L("Wirklich?", "Sure?"); return; } st.sents.splice(i, 1); delete open[i]; redo(); });
    if (opt.cancel) $("#edCancel", host).onclick = opt.cancel;
    $("#edSave", host).onclick = () => {
      st.sents.forEach(s => { s.de = s.de.replace(/\s+/g, " ").trim(); });
      const real = st.sents.filter(s => s.de);
      if (!real.length) { toast(L("Es fehlt mindestens ein Satz.", "At least one sentence is needed.")); return; }
      const gi = st.sents.findIndex(s => s.de && s.g);
      if (gi >= 0) { toast(L("Sag zuerst bei den geratenen Sätzen, ob sie stimmen.", "First say whether the guessed sentences are right.")); const c = host.querySelectorAll(".scard")[gi]; if (c) c.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      if (!st.t.trim()) st.t = autoTitle(real);
      opt.onSave(Object.assign({}, st, { sents: real }));
    };
  };
  draw();
}

function buildSents(st, oldSents) {
  return st.sents.map((s, i) => {
    const o = s.box != null ? s : oldSents && oldSents[i] ? oldSents[i] : null;
    const x = {
      de: stripGuess(s.de), en: (s.en || "").trim(), kw: (s.kw || "").trim(),
      fp: [...new Set(s.pn.filter(n => st.pats.some(p => pNorm(p) === pNorm(n))).map(n => patFind(n, false, PAT_EN[pNorm(n)])))].filter(Boolean),
      box: o ? o.box : 0, due: o ? o.due || "" : "", last: o ? o.last || 0 : 0, wait: o ? !!o.wait : true,
      pend: (s.pend || "").trim()
    };
    if (!x.pend) delete x.pend;
    return x;
  });
}

function newAtomFrom(st, ctx) {
  atomsReady();
  const sents = buildSents(st);
  st.pats.forEach(n => patFind(n, false, PAT_EN[pNorm(n)]));
  const a = { id: "a" + Date.now().toString(36), t: st.t.trim() || ctx.title || L("Mein Text", "My text"), k: ctx.kindKey || "frei", task: ctx.task || "", cue: ctx.cue || "", orig: ctx.text || "",
    corr: sents.map(s => plain(s.de)).join(" "), sents, tr: st.tr, up: st.up, box: 0, due: "9999-12-31", made: today(), hist: [], ti: 0, done: false, v: 3 };
  DB.atoms.push(a); admitWaiting(); syncAtom(a); save();
  return a;
}
function savedNote(host, a) {
  const w = a.sents.filter(x => x.wait).length;
  host.innerHTML = `<div class="fb good"><b>${L("Gespeichert.", "Saved.")}</b> ${w === a.sents.length ? L(`„${esc(a.t)}“ ist ein Atom mit ${a.sents.length} Sätzen. Box 1 ist voll: Die Sätze warten, bis Platz ist.`, `“${esc(a.t)}” is an atom with ${a.sents.length} sentences. Box 1 is full, so they wait until there's room.`) : w ? L(`„${esc(a.t)}“ ist ein Atom mit ${a.sents.length} Sätzen. ${a.sents.length - w} kommen morgen dran, ${w} warten auf Platz in Box 1.`, `“${esc(a.t)}” is an atom with ${a.sents.length} sentences. ${a.sents.length - w} come up tomorrow, ${w} wait for room in box 1.`) : L(`„${esc(a.t)}“ ist jetzt ein Atom mit ${a.sents.length} Sätzen. Erste Wiederholung: morgen.`, `“${esc(a.t)}” is now an atom with ${a.sents.length} sentences. First review: tomorrow.`)}</div><div id="fixHost"></div><button class="btn petrol" id="toAtoms">${L("Zu meinen Atomen", "Go to my atoms")}</button>`;
  fixBlock($("#fixHost", host), a, () => savedNote(host, a));
  $("#toAtoms").onclick = () => atomsHub();
}

function pendingOf(a) { return a.sents.map((s, i) => i).filter(i => a.sents[i].pend); }
function checkOf(a) { return a.sents.map((s, i) => i).filter(i => a.sents[i].pend || a.sents[i].chk); }
function needsClaude(a) { return checkOf(a).length > 0 || !!a.upOld; }
function fixPrompt(a) {
  const todo = checkOf(a);
  const P = [];
  if (todo.length) {
    P.push(`Ich arbeite an meinem deutschen Text „${a.t}“ (Ziel B1). Bitte prüf diese Sätze und schreib jeden richtig auf Deutsch, so nah wie möglich an meiner Version. Bei „Ich meinte“ musstest du vorher raten: schreib, was ich wirklich sagen wollte.`, "");
    todo.forEach((i, n) => { const x = a.sents[i]; P.push(x.pend ? `${n + 1}. Geraten: ${plain(x.de)} — Ich meinte: ${x.pend}` : `${n + 1}. Von mir geändert: ${plain(x.de)}`); });
    P.push("");
  } else P.push(`Ich habe meinen deutschen Text „${a.t}“ geändert.`, "");
  if (a.up || todo.length) P.push("Mein ganzer Text im Moment:", a.sents.map(x => x.pend ? `[${x.pend}]` : plain(x.de)).join(" "), "");
  P.push("Antworte am Ende mit genau diesen Blöcken:");
  if (todo.length) P.push("SÄTZE:", "1. (korrigierter Satz, korrigierte Stellen in [eckigen Klammern]) | (englische Bedeutung) | (2–4 Stichwörter in der Grundform)", "(ein Satz pro Zeile, gleiche Nummern und Reihenfolge wie oben)");
  P.push("B1-VERSION:", "(der ganze Text mit den neuen Sätzen, eine Stufe besser, natürlich und auf B1-Niveau)");
  return P.join("\n");
}
function fixBlock(host, a, after) {
  if (!host) return;
  const todo = checkOf(a), pend = pendingOf(a);
  if (!needsClaude(a)) { host.innerHTML = ""; return; }
  const what = pend.length ? L(`${pend.length === 1 ? "1 geratener Satz wartet" : pend.length + " geratene Sätze warten"} auf Claude. Bis dahin kommen sie nicht in deine Wiederholung.`, `${pend.length === 1 ? "1 guessed sentence is" : pend.length + " guessed sentences are"} waiting for Claude. Until then they stay out of your reviews.`)
    : todo.length ? L(`Du hast ${todo.length === 1 ? "einen Satz" : todo.length + " Sätze"} geändert. Claude prüft sie und passt die B1-Version an, in einem Schritt.`, `You changed ${todo.length === 1 ? "a sentence" : todo.length + " sentences"}. Claude checks them and updates the B1 version, in one step.`)
    : L("Die B1-Version passt nicht mehr zu deinen Sätzen. Claude passt sie an.", "The B1 version no longer matches your sentences. Claude updates it.");
  host.innerHTML = `<div class="cb"><h3>${L("Von Claude prüfen lassen", "Check with Claude")}</h3>
    <div class="muted small">${what}</div>
    <div class="step"><span class="n">1</span><div class="b"><button class="btn petrol" id="fxCopy" style="margin-top:0">${L("Anfrage kopieren", "Copy the request")}</button></div></div>
    <div class="step"><span class="n">2</span><div class="b"><textarea class="ta2" id="fxPaste" style="margin-top:0" placeholder="${L("Claudes Antwort hier einfügen", "Paste Claude's reply here")}"></textarea><button class="btn primary" id="fxGo">${L("Übernehmen", "Use it")}</button>
    ${pend.length ? "" : `<button class="btn ghost" id="fxSkip" style="margin-top:8px">${L("Nicht nötig", "Not needed")}</button>`}</div></div></div>`;
  const p = fixPrompt(a);
  $("#fxCopy", host).onclick = () => { if (!shareText(p)) copyText(p, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy"))); };
  const sk = $("#fxSkip", host); if (sk) sk.onclick = () => { a.sents.forEach(x => delete x.chk); a.upOld = false; save(); after(); };
  $("#fxGo", host).onclick = () => {
    const raw = $("#fxPaste", host).value;
    const r = parseClaude(raw) || { sents: [], up: "" };
    if (!r.up) { const m = String(raw).replace(/\*\*|__/g, "").match(/B1[- ]VERSION\s*:?\s*([\s\S]+)$/i); if (m) r.up = m[1].split("\n").map(x => x.trim()).filter(x => x && !/^```/.test(x)).join(" "); }
    if (todo.length && r.sents.length < todo.length) { toast(L("Ich finde die Sätze nicht. Bitte die ganze Antwort einfügen.", "I can't find the sentences. Please paste the whole reply.")); return; }
    if (!todo.length && !r.up) { toast(L("Ich finde „B1-VERSION:“ nicht. Bitte die ganze Antwort einfügen.", "I can't find “B1-VERSION:”. Please paste the whole reply.")); return; }
    todo.forEach((i, n) => { const s = a.sents[i], x = r.sents[n]; const changed = plain(x.de) !== plain(s.de); s.de = x.de; s.en = x.en || s.en; s.kw = x.kw || s.kw; delete s.pend; delete s.chk; if (changed && isLive(s)) { place(s, 1); s.last = 0; } });
    a.corr = a.sents.map(x => plain(x.de)).join(" ");
    if (r.up) { a.up = r.up; a.upOld = false; }
    admitWaiting(); DB.atoms.forEach(syncAtom);
    save(); toast(L("Übernommen", "Done")); after();
  };
}

/* ---------- the Claude block on task screens ---------- */
/* ctx: {kindDe, kindKey, title, task, text, spoken, dialog, cue, onSaved} */
function claudeBlock(ctx, host) {
  atomsReady();
  const prompt = claudePrompt(ctx);
  const canShare = (() => { try { return !!navigator.share; } catch (e) { return false; } })();
  host.innerHTML = `<div class="cb"><h3>${L("Korrektur von Claude", "Correction from Claude")}</h3>
    <div class="muted small">${L("Die App kann nicht selbst korrigieren. So geht's in zwei Schritten:", "The app can't correct you by itself. It takes two steps:")}</div>
    <div class="step"><span class="n">1</span><div class="b"><b>${L("An Claude senden", "Send to Claude")}</b><div class="muted small">${L("Kopiere die fertige Anfrage und füge sie in einen Chat mit Claude ein.", "Copy the ready-made request and paste it into a chat with Claude.")}</div>
      <div class="row2">${canShare ? `<button class="btn petrol" id="cbShare">${L("Teilen", "Share")}</button>` : ""}<button class="btn ${canShare ? "ghost" : "petrol"}" id="cbCopy">${L("Kopieren", "Copy")}</button></div></div></div>
    <div class="step"><span class="n">2</span><div class="b"><b>${L("Antwort einfügen", "Paste the reply")}</b><div class="muted small">${L("Kopiere Claudes ganze Antwort und füge sie hier ein.", "Copy Claude's whole reply and paste it here.")}</div>
      <textarea class="ta2" id="cbPaste" placeholder="${L("Claudes Antwort hier einfügen", "Paste Claude's reply here")}"></textarea>
      <button class="btn primary" id="cbRead">${L("Korrektur übernehmen", "Use this correction")}</button>
      <button class="btn ghost" id="cbSelf" style="margin-top:8px">${L("Ohne Claude: selbst korrigieren", "Without Claude: correct it myself")}</button></div></div>
    <div id="cbOut"></div></div>`;
  const sh = $("#cbShare"); if (sh) sh.onclick = () => { if (!shareText(prompt)) copyText(prompt, ok => toast(ok ? L("Kopiert", "Copied") : L("Kopieren ging nicht", "Couldn't copy"))); };
  $("#cbCopy").onclick = () => copyText(prompt, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy")));
  const out = $("#cbOut");
  const edit = (st, fromClaude) => {
    out.innerHTML = `<div class="sec-h">${L("Dein neues Atom", "Your new atom")}</div>${fromClaude ? "" : `<p class="muted small">${L("Schreib die richtige Version selbst auf, setz deine korrigierten Stellen in [eckige Klammern] und notiere deine Fehlermuster.", "Write the correct version yourself, put your corrected spots in [square brackets] and note your mistake patterns.")}</p>`}<div id="cbEd"></div>`;
    atomEditor($("#cbEd"), st, { saveLabel: L("Als Atom speichern", "Save as an atom"), note: L("Morgen kommt das Atom zum ersten Mal dran. Du baust es dann Satz für Satz neu, mit Hinweisen, wenn du sie brauchst.", "The atom first comes up tomorrow. You rebuild it sentence by sentence, with hints when you need them."),
      onSave: s => { const a = newAtomFrom(s, ctx); if (ctx.onSaved) ctx.onSaved(a); save(); savedNote(out, a); } });
  };
  $("#cbRead").onclick = () => {
    const p = parseClaude($("#cbPaste").value);
    if (!p) { toast(L("Ich finde den Block „KORREKTUR:“ nicht. Bitte die ganze Antwort einfügen.", "I can't find the “KORREKTUR:” block. Please paste the whole reply.")); return; }
    edit(stateFromParse(p, ctx.title), true);
  };
  $("#cbSelf").onclick = () => {
    const base = ctx.dialog ? ctx.text.split("\n").filter(l => /^Ich:/.test(l)).map(l => l.replace(/^Ich:\s*/, "")).join("\n") : ctx.text;
    edit({ t: ctx.title || "", tr: [], up: "", pats: [], sents: splitSents(base).map(de => ({ de, en: "", kw: "", g: false, pn: [] })) }, false);
  };
}

/* ---------- paste a reply from any chat ---------- */
function pasteImport() {
  recStop(); atomsReady();
  const body = `<p class="muted" style="margin-top:4px">${L("Du hast direkt im Chat mit Claude geschrieben? Füge Claudes Antwort hier ein. Die App macht daraus ein Atom.", "Wrote straight into a chat with Claude? Paste Claude's reply here and the app turns it into an atom.")}</p>
    <label class="lab2" for="piT">${L("Titel", "Title")}</label><input class="tin" id="piT" placeholder="${L("z. B. Stell dich vor", "e.g. Introduce yourself")}">
    <div class="lab2">${L("Art", "Type")}</div><div class="seg" id="piK"><button data-k="sw" aria-pressed="true">${L("Geschrieben", "Written")}</button><button data-k="sp" aria-pressed="false">${L("Gesprochen", "Spoken")}</button></div>
    <label class="lab2" for="piO">${L("Dein Original (optional)", "Your original (optional)")}</label><textarea class="ta2" id="piO"></textarea>
    <label class="lab2" for="piP">${L("Claudes Antwort", "Claude's reply")}</label><textarea class="ta2" id="piP" style="min-height:150px" placeholder="${L("Ganze Antwort mit KORREKTUR: einfügen", "Paste the whole reply with KORREKTUR:")}"></textarea>
    <button class="btn primary" id="piGo">${L("Weiter", "Next")}</button>
    <div id="piOut"></div>`;
  shell(L("Antwort einfügen", "Paste a reply"), body, { back: L("Atome", "Atoms"), backTo: "aktiv" });
  $("#back").onclick = () => atomsHub();
  let kind = "sw";
  document.querySelectorAll("#piK button").forEach(b => b.onclick = () => { kind = b.dataset.k; document.querySelectorAll("#piK button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
  $("#piGo").onclick = () => {
    const p = parseClaude($("#piP").value);
    if (!p) { toast(L("Ich finde den Block „KORREKTUR:“ nicht. Bitte die ganze Antwort einfügen.", "I can't find the “KORREKTUR:” block. Please paste the whole reply.")); return; }
    const out = $("#piOut"), ctx = { kindKey: kind, title: $("#piT").value.trim(), text: $("#piO").value.trim() };
    out.innerHTML = `<div class="sec-h">${L("Dein neues Atom", "Your new atom")}</div><div id="piEd"></div>`;
    atomEditor($("#piEd"), stateFromParse(p, ctx.title), { saveLabel: L("Als Atom speichern", "Save as an atom"), onSave: s => { const a = newAtomFrom(s, ctx); savedNote(out, a); } });
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* =================================================================== ATOMS HUB */
function atomById(id) { return DB.atoms.find(a => a.id === id); }
function atomsHub() {
  recStop(); atomsReady();
  const due = atomsDue(), act = DB.atoms.filter(a => !a.done).sort((a, b) => a.due < b.due ? -1 : 1), grad = DB.atoms.filter(a => a.done);
  const pats = patsSorted(), weak = pats.find(p => p.n && p.score < 1 && p.atoms);
  const row = a => { const dn = dueSents(a).length; return `<button class="li" data-at="${a.id}"><span class="tx"><span class="d">${esc(a.t)}</span><span class="e">${needsClaude(a) ? L("von Claude prüfen lassen · ", "check with Claude · ") : ""}${a.done ? L("abgeschlossen", "graduated") : a.box === 0 ? L(`${a.sents.length} Sätze warten auf Platz`, `${a.sents.length} sentences waiting for room`) : dn ? L(`${dn} von ${a.sents.length} Sätzen fällig`, `${dn} of ${a.sents.length} sentences due`) : L(`${a.sents.length} Sätze · nächste ${fmtDay(a.due)}`, `${a.sents.length} sentences · next ${fmtDay(a.due)}`)}</span></span>${a.done ? `<span class="badge ok">✓</span>` : dn ? `<span class="badge due">${dn}</span>` : a.box === 0 ? `<span class="badge">…</span>` : `<span class="badge">${a.box}</span>`}</button>`; };
  const dueN = due.reduce((n, a) => n + dueSents(a).length, 0), waitN = waitingCount();
  const boxes = [1, 2, 3, 4, 5].map(b => { const n = boxCount(b); return `<div class="${n >= BOX_CAP ? "full" : ""}"><b>${n}</b><span>Box ${b}</span><i><em style="width:${Math.min(100, n / BOX_CAP * 100)}%"></em></i></div>`; }).join("");
  const body = `<div class="boxes">${boxes}</div>
    <p class="muted small" style="margin:0 2px 10px">${L(`Höchstens ${BOX_CAP} Sätze pro Box.`, `At most ${BOX_CAP} sentences per box.`)}${waitN ? " " + L(`${waitN} neue Sätze warten auf Platz in Box 1.`, `${waitN} new sentences are waiting for room in box 1.`) : ""}</p>
    <button class="hero" id="rev" ${dueN ? "" : "disabled"}><span class="ic">${dueN}</span><span><span class="tt">${L("Wiederholen", "Review")}</span><span class="ss">${dueN ? L(`${dueN} Sätze aus ${due.length} Atomen.`, `${dueN} sentences from ${due.length} atoms.`) : L("Heute ist nichts fällig.", "Nothing is due today.")}</span></span></button>
    ${weak ? `<button class="hero alt" id="weak"><span class="ic">!</span><span><span class="tt">${L("Schwächstes Muster üben", "Practise your weakest pattern")}</span><span class="ss">${esc(weak.label)} · ${Math.round(weak.score * 100)} %</span></span></button>` : ""}
    <div class="seg" id="mode"><button data-m="satz" aria-pressed="${DB.atomMode === "satz"}">${L("Satz für Satz", "Sentence by sentence")}</button><button data-m="text" aria-pressed="${DB.atomMode === "text"}">${L("Ganzer Text", "Whole text")}</button></div>
    <div class="menu" style="margin-top:12px">
      ${missingEn().n ? `<button class="item" id="mEn"><span class="ic">EN</span><span class="tx"><span class="tt">${L("Englisch ergänzen", "Add the English")}</span><span class="ss">${L(`${missingEn().n} Sätze oder Muster ohne Englisch`, `${missingEn().n} sentences or patterns have no English`)}</span></span></button>` : ""}
      <button class="item" id="mPats"><span class="ic">${pats.length || "0"}</span><span class="tx"><span class="tt">${L("Meine Fehlermuster", "My mistake patterns")}</span><span class="ss">${pats.length ? L("Was klappt, was nur mit Hilfe, was noch nicht", "What works, what needs hints, what doesn't yet") : L("Kommen mit deinem ersten Atom", "They arrive with your first atom")}</span></span></button>
      <button class="item" id="new"><span class="ic">+</span><span class="tx"><span class="tt">${L("Neues Atom", "New atom")}</span><span class="ss">${L("Schreiben oder sprechen, korrigieren lassen, speichern.", "Write or speak, get corrected, save.")}</span></span></button>
      <button class="item" id="paste"><span class="ic">⇩</span><span class="tx"><span class="tt">${L("Claude-Antwort einfügen", "Paste a Claude reply")}</span><span class="ss">${L("Für Texte, die du direkt im Chat geschrieben hast", "For texts you wrote straight into a chat")}</span></span></button>
    </div>
    ${act.length ? `<div class="sec-h">${L("Aktive Atome", "Active atoms")}</div><div class="list">${act.map(row).join("")}</div>` : `<p class="empty">${L("Noch keine Atome. Jeder Text, den du korrigieren lässt, kann ein Atom werden.", "No atoms yet. Any text you get corrected can become an atom.")}</p>`}
    ${grad.length ? `<details class="fold"><summary>${L("Abgeschlossen", "Graduated")} (${grad.length})</summary><div class="in"><div class="list">${grad.map(row).join("")}</div></div></details>` : ""}
    <details class="fold"><summary>${L("So funktionieren Atome", "How atoms work")}</summary><div class="in small">
      <p style="margin-top:0">${L("Ein Atom ist ein eigener, korrigierter Text. Jeder Satz hat seine eigene Box. Wiederholt wird nach 1, 3, 7, 16 und 35 Tagen.", "An atom is one of your own corrected texts. Every sentence has its own box. Reviews come after 1, 3, 7, 16 and 35 days.")}</p>
      <p>${L("Du siehst die englische Bedeutung und sagst den Satz auf Deutsch. Hängst du fest, holst du dir Hinweise: Stichwörter, dann eine Wortbank, dann einen Lückensatz, am Ende die Lösung. Die Hinweise verraten nie die Grammatik, die du übst.", "You see the English meaning and say the sentence in German. If you're stuck, take hints: key words, then a word bank, then a gap sentence, and finally the answer. Hints never give away the grammar you're practising.")}</p>
      <p>${L("Danach bewertest du jeden Satz: 1 Keine Ahnung (zurück in Box 1), 2 Schwer (eine Box tiefer), 3 Okay (bleibt), 4 Gut (eine Box höher), 5 Leicht (zwei Boxen höher). Jeder Satz kommt einzeln wieder, wenn er fällig ist.", "Then you rate each sentence: 1 No idea (back to box 1), 2 Hard (down one box), 3 OK (stays), 4 Good (up one box), 5 Easy (up two boxes). Each sentence comes back on its own when it's due.")}</p>
      <p style="margin-bottom:0">${L(`Keine Box hat mehr als ${BOX_CAP} Sätze. Ist eine Box voll, rückt ihr stärkster Satz eine Box höher. Neue Sätze warten, bis in Box 1 Platz ist. Nach Box 5 ist ein Satz fertig.`, `No box holds more than ${BOX_CAP} sentences. When a box is full, its strongest sentence moves up one box. New sentences wait until box 1 has room. After box 5 a sentence is done.`)}</p></div></details>`;
  shell(L("Atome", "Atoms"), body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: atomsHub });
  $("#rev").onclick = () => { if (dueN) startAtomReview(due.map(a => a.id)); };
  const w = $("#weak"); if (w) w.onclick = () => startPatPractice(weak.id);
  document.querySelectorAll("#mode button").forEach(b => b.onclick = () => { DB.atomMode = b.dataset.m; save(); document.querySelectorAll("#mode button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
  $("#mPats").onclick = () => patsHub();
  const mEn = $("#mEn"); if (mEn) mEn.onclick = () => enFill();
  $("#new").onclick = () => freeWrite();
  $("#paste").onclick = () => pasteImport();
  document.querySelectorAll("[data-at]").forEach(b => b.onclick = () => atomDetail(b.dataset.at));
}

function atomDetail(id, editing) {
  recStop(); atomsReady();
  const a = atomById(id); if (!a) { atomsHub(); return; }
  if (editing) {
    shell(a.t, `<div id="adEd"></div>`, { back: L("Atom", "Atom"), backTo: "aktiv", redraw: () => atomDetail(id, true) });
    $("#back").onclick = () => atomDetail(id);
    atomEditor($("#adEd"), stateFromAtom(a), { saveLabel: L("Speichern", "Save"), cancel: () => atomDetail(id),
      onSave: s => { s.pats.forEach(n => patFind(n)); a.t = s.t.trim() || a.t; const oldDe = a.sents.map(x => plain(x.de)); const oldChk = a.sents.map(x => !!x.chk); a.sents = buildSents(s, a.sents); a.sents.forEach((x, i) => { if (!x.pend && (oldChk[i] || oldDe[i] !== plain(x.de))) x.chk = true; }); const before = oldDe.join(" "); a.corr = a.sents.map(x => plain(x.de)).join(" "); a.tr = s.tr; if (s.up !== a.up) { a.up = s.up; a.upOld = false; } else if (a.up && a.corr !== before) a.upOld = true; admitWaiting(); DB.atoms.forEach(syncAtom); save(); toast(L("Gespeichert", "Saved")); atomDetail(id); } });
    return;
  }
  const hist = a.hist.slice(-8).map(h => `${fmtDay(h.d)}: ${typeof h.ok === "boolean" ? (h.ok ? "✓" : "✗") : `${h.ok}/${h.n}`}`).join(" · ");
  const body = `<div class="sit"><span class="lab">${a.done ? L("Abgeschlossen", "Graduated") : a.box === 0 ? L("Wartet auf Platz in Box 1", "Waiting for room in box 1") : L(`Nächste Wiederholung ${fmtDay(a.due)}`, `Next review ${fmtDay(a.due)}`)}</span></div>
    <div class="sec-h">${L("Sätze", "Sentences")}</div>
    <div class="hl"><div class="slist">${a.sents.map(s => `<div class="s"><div class="de"><span>${markedHtml(s.de)}</span><span class="sbox">${boxLine(s)}</span></div>${s.en ? `<div class="en">${esc(s.en)}</div>` : ""}${s.pend ? `<div class="en" style="color:var(--amber)">${L("wartet auf Claude", "waiting for Claude")}</div>` : s.chk ? `<div class="en" style="color:var(--amber)">${L("geändert, noch nicht geprüft", "changed, not checked yet")}</div>` : ""}</div>`).join("")}</div></div>
    <div id="fixHost"></div>
    ${TTS ? `<button class="btn ghost" data-say="${esc(a.corr)}">${L("Ganzen Text anhören", "Play the whole text")}</button>` : ""}
    ${a.up ? `<div class="up"><div class="lab"><span>${L("Eine Stufe höher (B1)", "One step up (B1)")}</span>${TTS ? `<button class="spk" data-say="${esc(a.up)}">${ICON.spk}</button>` : ""}</div>${esc(a.up)}</div>` : ""}
    ${hist ? `<p class="muted small">${hist}</p>` : ""}
    ${a.sents.some(x => isLive(x) && !x.pend) ? `<button class="btn primary" id="now">${L("Jetzt wiederholen", "Review now")}</button>` : ""}
    <div class="row2"><button class="btn ghost" id="edit">${L("Bearbeiten", "Edit")}</button><button class="btn ghost" id="del">${L("Löschen", "Delete")}</button></div>`;
  shell(a.t, body, { back: L("Atome", "Atoms"), backTo: "aktiv", redraw: () => atomDetail(id) });
  $("#back").onclick = () => atomsHub();
  fixBlock($("#fixHost"), a, () => atomDetail(id));

  const nw = $("#now"); if (nw) nw.onclick = () => startAtomReview([id], true);
  $("#edit").onclick = () => atomDetail(id, true);
  let armed = false;
  $("#del").onclick = e => { if (!armed) { armed = true; e.target.textContent = L("Nochmal tippen zum Löschen", "Tap again to delete"); e.target.classList.add("bad"); return; } DB.atoms = DB.atoms.filter(x => x.id !== id); save(); toast(L("Gelöscht", "Deleted")); atomsHub(); };
}

/* =================================================================== PATTERNS */
function patsHub() {
  recStop(); atomsReady();
  const pats = patsSorted();
  const body = `<p class="muted" style="margin-top:4px">${L("Alle Fehlermuster aus allen Atomen. Grün = ohne Hilfe richtig, gelb = nur mit Hinweisen, rot = Fehler kam wieder. Die schwächsten stehen oben.", "All mistake patterns across all atoms. Green = right without help, amber = only with hints, red = the mistake came back. The weakest are at the top.")}</p>
    ${pats.length ? `<div class="hl" style="padding:0">${pats.map(p => `<button class="prow" data-p="${p.id}"><div class="top"><b>${esc(p.label)}</b><span>${L(`${p.atoms} ${p.atoms === 1 ? "Atom" : "Atome"}`, `${p.atoms} ${p.atoms === 1 ? "atom" : "atoms"}`)}</span></div>${patBar(p)}<div class="sub">${patLine(p)}</div></button>`).join("")}</div>`
      : `<p class="empty">${L("Noch keine Muster. Sie kommen mit deinem ersten korrigierten Text.", "No patterns yet. They arrive with your first corrected text.")}</p>`}`;
  shell(L("Fehlermuster", "Mistake patterns"), body, { back: L("Atome", "Atoms"), backTo: "aktiv", redraw: patsHub });
  $("#back").onclick = () => atomsHub();
  document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => patDetail(b.dataset.p));
}
function patSentences(id) { const out = []; DB.atoms.forEach(a => a.sents.forEach((s, si) => { if (s.fp.includes(id)) out.push({ a, si }); })); return out; }
function patDetail(id) {
  recStop(); atomsReady();
  const p = DB.pats[id]; if (!p) { patsHub(); return; }
  const st = Object.assign({ id, name: p.name }, patStats(id)), list = patSentences(id);
  const others = Object.keys(DB.pats).filter(x => x !== id).sort((a, b) => patName(a).localeCompare(patName(b), "de"));
  const body = `<div class="hl"><span class="lab">${L("Letzte 12 Versuche", "Last 12 attempts")}</span>${patBar(st)}<div class="sub muted small" style="margin-top:6px">${patLine(st)}</div></div>
    <button class="btn primary" id="go" ${list.length ? "" : "disabled"}>${L(`Dieses Muster üben (${Math.min(list.length, 10)} Sätze)`, `Practise this pattern (${Math.min(list.length, 10)} sentences)`)}</button>
    <p class="muted small">${L("Freies Üben: zählt für dein Muster, ändert aber nicht die Boxen deiner Atome.", "Free practice: it counts for the pattern but doesn't change your atoms' boxes.")}</p>
    <div class="sec-h">${L("Sätze mit diesem Muster", "Sentences with this pattern")}</div>
    <div class="hl"><div class="slist">${list.map(x => `<div class="s"><div class="de"><span>${markedHtml(x.a.sents[x.si].de)}</span></div><div class="en">${esc(x.a.t)}</div></div>`).join("") || `<span class="muted small">${L("Keine.", "None.")}</span>`}</div></div>
    <details class="fold"><summary>${L("Umbenennen oder zusammenführen", "Rename or merge")}</summary><div class="in">
      <label class="lab2" for="pnN">${L("Name", "Name")}</label><input class="tin" id="pnN" value="${esc(p.name)}"><button class="btn petrol" id="pnS">${L("Umbenennen", "Rename")}</button>
      ${others.length ? `<label class="lab2" for="pnM">${L("Gleiches Muster wie …", "Same pattern as …")}</label><select class="tin" id="pnM">${others.map(o => `<option value="${o}">${esc(patLabel(o))}</option>`).join("")}</select><button class="btn ghost" id="pnG">${L("Zusammenführen", "Merge")}</button>` : ""}
      <button class="btn ghost" id="pnD" style="margin-top:8px">${L("Muster löschen", "Delete pattern")}</button></div></details>`;
  shell(patLabel(id), body, { back: L("Muster", "Patterns"), backTo: "aktiv", redraw: () => patDetail(id) });
  $("#back").onclick = () => patsHub();
  $("#go").onclick = () => startPatPractice(id);
  $("#pnS").onclick = () => { const v = $("#pnN").value.trim(); if (!v) return; const ex = patFind(v, true); if (ex && ex !== id) { toast(L("Diesen Namen gibt es schon. Nutze „Zusammenführen“.", "That name exists already. Use “Merge”.")); return; } p.name = v; save(); toast(L("Umbenannt", "Renamed")); patDetail(id); };
  const g = $("#pnG"); if (g) g.onclick = () => { const into = $("#pnM").value; if (!DB.pats[into]) return; DB.pats[into].ev = DB.pats[into].ev.concat(p.ev).sort((x, y) => x.d < y.d ? -1 : 1).slice(-200); DB.atoms.forEach(a => a.sents.forEach(s => { if (s.fp.includes(id)) s.fp = [...new Set(s.fp.map(x => x === id ? into : x))]; })); delete DB.pats[id]; save(); toast(L("Zusammengeführt", "Merged")); patDetail(into); };
  let armed = false;
  $("#pnD").onclick = e => { if (!armed) { armed = true; e.target.textContent = L("Nochmal tippen zum Löschen", "Tap again to delete"); e.target.classList.add("bad"); return; } DB.atoms.forEach(a => a.sents.forEach(s => s.fp = s.fp.filter(x => x !== id))); delete DB.pats[id]; save(); toast(L("Gelöscht", "Deleted")); patsHub(); };
}

/* =================================================================== REVIEW */
/* A session is a list of steps. A step is one atom in "text" mode, or one sentence of an atom in "satz" mode.
   R = { steps:[{aid, sis:[...]}], i, kind:"due"|"pat", pat, res:{ "aid|si": {g, rung, pk:[ids], att} }, attempts:{} } */
let R = null;
function atomPhase(a) { return "rebuild"; }
function startRung(a, s) { return s.en ? 2 : 1; }
function startAtomReview(ids, all) {
  atomsReady();
  const steps = [];
  ids.map(atomById).filter(Boolean).forEach(a => {
    const ok = all ? a.sents.map((_, i) => i).filter(i => isLive(a.sents[i]) && !a.sents[i].pend) : dueSents(a);
    if (!ok.length) return;
    if (DB.atomMode === "text") steps.push({ aid: a.id, sis: ok });
    else ok.forEach(i => steps.push({ aid: a.id, sis: [i] }));
  });
  if (!steps.length) { toast(L("Gerade ist hier nichts zu wiederholen.", "There's nothing to review here right now.")); atomsHub(); return; }
  R = { steps, i: 0, kind: "due", res: {}, rung: {}, att: {}, shown: {}, tr: {} };
  reviewStep();
}
function startPatPractice(pid) {
  atomsReady();
  const list = shuffle(patSentences(pid).filter(x => !x.a.sents[x.si].pend)).slice(0, 10);
  if (!list.length) { toast(L("Keine Sätze für dieses Muster.", "No sentences for this pattern.")); return; }
  R = { steps: list.map(x => ({ aid: x.a.id, sis: [x.si] })), i: 0, kind: "pat", pat: pid, res: {}, rung: {}, att: {}, shown: {}, tr: {} };
  reviewStep();
}
const rk = (aid, si) => aid + "|" + si;
function stepRung(st, a) { const k = st.aid + "#" + st.sis.join(","); if (R.rung[k] == null) R.rung[k] = R.kind === "pat" ? (a.sents[st.sis[0]].en ? 2 : 1) : Math.min(...st.sis.map(si => startRung(a, a.sents[si]))); return k; }
function trFor(a) {
  if (R.tr[a.id] != null) return R.tr[a.id];
  const list = a.tr.length ? a.tr : DEFAULT_TR.map(x => T(x));
  return R.tr[a.id] = list[(a.ti || 0) % list.length];
}
function hintBlock(a, sis, rung, single) {
  const parts = [];
  if (rung >= 2) {
    const en = sis.map(si => a.sents[si].en).filter(Boolean);
    if (en.length) parts.push(`<div class="hl"><span class="lab">${esc(T(RUNGS[2]))}</span>${single ? `<div class="en">${esc(en[0])}</div>` : `<ol class="fp" style="margin:0">${sis.map(si => `<li>${esc(a.sents[si].en || "–")}</li>`).join("")}</ol>`}</div>`);
  }
  if (rung >= 3) parts.push(`<div class="hl"><span class="lab">${esc(T(RUNGS[3]))}</span>${sis.map(si => `<div class="kw" style="margin-top:${single ? 0 : 6}px">${single ? "" : `<b style="margin-right:4px">${si + 1}.</b>`}${kwList(a.sents[si]).map(k => `<span>${esc(k)}</span>`).join("")}</div>`).join("")}</div>`);
  if (rung >= 4 && rung < 6) parts.push(`<div class="hl"><span class="lab">${esc(T(RUNGS[4]))} · ${L("antippen zum Einfügen", "tap to insert")}</span>${sis.map(si => `<div class="tokens">${shuffleSeeded(plain(a.sents[si].de).split(/\s+/).filter(Boolean), a.id + si).map(t => `<button class="tok" data-tok="${esc(t)}">${esc(t)}</button>`).join("")}</div>`).join("")}</div>`);
  if (rung >= 5 && rung < 6) parts.push(`<div class="hl"><span class="lab">${esc(T(RUNGS[5]))}</span>${sis.map(si => gapHtml(a.sents[si].de)).join("")}</div>`);
  return parts.join("");
}
function shuffleSeeded(arr, seed) {
  let h = 0; for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.length > 2 && a.join(" ") === arr.join(" ")) a.push(a.shift());
  return a;
}
function reviewStep() {
  recStop();
  if (!R) { atomsHub(); return; }
  if (R.i >= R.steps.length) { reviewDone(); return; }
  const st = R.steps[R.i], a = atomById(st.aid);
  if (!a || st.sis.some(si => !a.sents[si])) { R.i++; reviewStep(); return; }
  const single = st.sis.length === 1, si0 = st.sis[0], phase = R.kind === "pat" ? "rebuild" : atomPhase(a);
  const k = stepRung(st, a), rung = R.rung[k], shown = !!R.shown[k];
  const ins = phase === "rebuild" ? (single ? L("Sag diesen Satz auf Deutsch.", "Say this sentence in German.") : L("Bau deinen ganzen Text neu.", "Rebuild your whole text."))
    : phase === "transform" ? L("Sag den Inhalt anders: ", "Say it differently: ") + trFor(a) + "."
    : L("Ganz frei. Hol dir das Englisch nur, wenn du es brauchst.", "Completely free. Only take the English if you need it.");
  const spoken = a.k === "sp";
  const prev = single && R.kind === "due" && si0 > 0 ? `<div class="prev">${a.sents.slice(0, si0).map(s => `<b>${esc(plain(s.de))}</b>`).join(" ")}</div>` : "";
  const nextR = rung + 1;
  const body = `<div class="cnt muted small" style="text-align:center;font-weight:700">${R.i + 1} ${L("von", "of")} ${R.steps.length}${R.kind === "pat" ? " · " + esc(patLabel(R.pat)) : ` · Box ${Math.min(...st.sis.map(si => a.sents[si].box), 5)}`}</div>
    <div class="sit"><span class="lab">${esc(a.t)}${single ? ` · ${L("Satz", "Sentence")} ${si0 + 1}/${a.sents.length}` : ""}</span><p>${esc(ins)}</p>${prev}</div>
    <div class="ladder">${[1, 2, 3, 4, 5, 6].map(n => `<i class="${n <= rung ? (n >= 4 ? "on top" : "on") : ""}"></i>`).join("")}</div>
    <div class="lad-l"><span>${L("Hinweis", "Hint")}: ${esc(T(RUNGS[Math.max(1, rung)]))}</span><span></span></div>
    ${hintBlock(a, st.sis, Math.min(rung, 5), single)}
    ${shown ? "" : `${inputBox("rv", { value: R.att[k] || "", rows: single ? 3 : 7, draft: false, ph: spoken ? L("Sprich laut, dann tipp auf Stopp …", "Speak out loud, then tap Stop …") : L("Sprich oder schreib auf Deutsch …", "Speak or type in German …") })}
    <div class="row2">${nextR <= 5 ? `<button class="btn ghost" id="more">${L("Hinweis", "Hint")}: ${esc(T(RUNGS[nextR]))}</button>` : ""}<button class="btn primary" id="reveal">${L("Aufdecken", "Reveal")}</button></div>`}
    <div id="cmp"></div>`;
  shell(R.kind === "pat" ? L("Muster üben", "Pattern practice") : L("Atome wiederholen", "Review atoms"), body, { back: R.kind === "pat" ? L("Muster", "Patterns") : L("Atome", "Atoms"), backTo: "aktiv", redraw: reviewStep });
  $("#back").onclick = () => { recStop(); const p = R.kind === "pat" ? R.pat : null; R = null; if (p) patDetail(p); else atomsHub(); };
  if (shown) { drawCompare(st, a, k, phase); return; }
  const ta = bindInput("rv", { draft: false, onInput: v => { R.att[k] = v; } });
  document.querySelectorAll("[data-tok]").forEach(b => b.onclick = () => { const sep = ta.value && !/\s$/.test(ta.value) ? " " : ""; ta.value += sep + b.dataset.tok; R.att[k] = ta.value; b.classList.add("used"); ta.dispatchEvent(new Event("input")); });
  const more = $("#more"); if (more) more.onclick = () => { R.att[k] = ta.value; R.rung[k] = nextR; reviewStep(); };
  $("#reveal").onclick = () => { R.att[k] = ta.value; R.shown[k] = true; if (!(ta.value || "").trim()) R.rung[k] = 6; reviewStep(); const c = $("#cmp"); if (c) c.scrollIntoView({ behavior: "smooth", block: "start" }); };
}
function drawCompare(st, a, k, phase) {
  const att = (R.att[k] || "").trim(), single = st.sis.length === 1;
  const target = st.sis.map(si => plain(a.sents[si].de)).join(" ");
  const rows = st.sis.map(si => gradeRowHtml(a, si)).join("");
  $("#cmp").innerHTML = `${att ? `<div class="sec-h">${L("Dein Versuch", "Your attempt")}</div><div class="model ${phase === "rebuild" ? "diff" : ""}">${phase === "rebuild" ? diffHtml(att, target) : esc(att)}</div>${phase === "rebuild" ? `<p class="muted small">${L("Grün = fehlte bei dir, rot durchgestrichen = zu viel oder anders.", "Green = missing in yours, red crossed out = extra or different.")}</p>` : ""}` : `<p class="muted small">${L("Ohne Versuch aufgedeckt.", "Revealed without an attempt.")}</p>`}
    <div class="sec-h">${phase === "rebuild" ? L("So ist es richtig", "The correct version") : L("Dein Original zum Vergleich", "Your original, for comparison")} · ${L("wie gut ging es?", "how well did it go?")}</div>
    ${rows}
    ${phase !== "rebuild" && att ? `<button class="btn ghost" id="chk">${L("Unsicher? Von Claude prüfen lassen", "Not sure? Ask Claude to check")}</button>` : ""}
    <button class="btn primary" id="next">${R.i + 1 < R.steps.length ? L("Weiter", "Next") : L("Fertig", "Finish")}</button>`;
  st.sis.forEach(si => bindGradeRow(a, si, k));
  const chk = $("#chk"); if (chk) chk.onclick = () => { const p = checkPrompt([{ a, att, tr: phase === "transform" ? trFor(a) : "", sis: st.sis }]); if (!shareText(p)) copyText(p, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy"))); };
  $("#next").onclick = () => {
    const miss = st.sis.find(si => !R.res[rk(a.id, si)] || !R.res[rk(a.id, si)].g);
    if (miss != null) { toast(single ? L("Bewerte zuerst den Satz (1–5).", "Rate the sentence first (1–5).") : L("Bewerte zuerst alle Sätze (1–5).", "Rate all sentences first (1–5).")); return; }
    st.sis.forEach(si => { const r = R.res[rk(a.id, si)]; r.rung = R.rung[k]; r.att = att; });
    R.i++;
    const nextSt = R.steps[R.i];
    if (R.kind === "due" && (!nextSt || nextSt.aid !== a.id)) finishAtom(a);
    reviewStep(); window.scrollTo(0, 0);
  };
}
function gradeRowHtml(a, si) {
  const s = a.sents[si], r = R.res[rk(a.id, si)] || {};
  return `<div class="gr" id="gr-${si}"><div class="tgt"><span>${markedHtml(s.de)}</span>${TTS ? `<button class="spk" data-say="${esc(plain(s.de))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>
    ${s.en ? `<div class="en2">${esc(s.en)}</div>` : ""}
    <div class="g5 ${r.g ? "picked" : ""}">${[1, 2, 3, 4, 5].map(n => `<button data-g="${n}" class="${r.g === String(n) ? "on" : ""}" aria-label="${n} ${esc(T(RATE[n]))}"><b>${n}</b><span>${esc(T(RATE[n]))}</span></button>`).join("")}</div></div>`;
}

function bindGradeRow(a, si, k) {
  const box = $("#gr-" + si), key = rk(a.id, si), row = box.querySelector(".g5");
  box.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
    R.res[key] = { g: b.dataset.g, pk: [] };
    row.classList.add("picked");
    box.querySelectorAll("[data-g]").forEach(x => x.classList.toggle("on", x === b));
  });
}

/* scoring: 1-2 count as a mistake for the sentence's patterns, 3 as needing help, 4-5 as right */
function scoreSentence(a, si, r) {
  const x = a.sents[si], n = +r.g || 3;
  x.fp.filter(id => DB.pats[id]).forEach(id => patEvent(id, n <= 2 ? "fail" : n === 3 ? "hint" : "ok"));
  return n;
}

function finishAtom(a) {
  const old = a.box; let good = 0, n = 0;
  a.sents.forEach((x, si) => {
    const r = R.res[rk(a.id, si)]; if (!r) return;
    const g = scoreSentence(a, si, r); n++;
    const b = Math.max(1, Math.min(5, x.box || 1));
    const target = g === 1 ? 1 : g === 2 ? Math.max(1, b - 1) : g === 3 ? b : g === 4 ? b + 1 : b + 2;
    x.last = g; place(x, target);
    if (g >= 4) good++;
  });
  admitWaiting(); DB.atoms.forEach(syncAtom);
  a.hist.push({ d: today(), b: old, ok: good, n });
  save();
  toast(a.done ? L("Atom abgeschlossen! 🎉", "Atom graduated! 🎉") : L(`${a.t}: gespeichert · nächste ${fmtDay(a.due)}`, `${a.t}: saved · next ${fmtDay(a.due)}`));
}

function checkPrompt(items) {
  const P = ["Ich wiederhole eigene deutsche Texte (B1). Bitte prüfe meine Versuche. Sag mir kurz auf Englisch, ob ich einen meiner bekannten Fehler wieder gemacht habe, und korrigiere die Versuche.", ""];
  items.forEach(x => {
    P.push("Titel: " + x.a.t);
    if (x.tr) P.push("Aufgabe: Inhalt umformen, " + x.tr);
    P.push("Korrigiertes Original: " + x.sis.map(si => plain(x.a.sents[si].de)).join(" "));
    const pats = [...new Set(x.sis.flatMap(si => x.a.sents[si].fp))].map(patName).filter(Boolean);
    P.push("Meine bekannten Fehler: " + (pats.join("; ") || "–"));
    P.push("Mein Versuch: " + (x.att || "–"), "");
  });
  return P.join("\n");
}
function reviewDone() {
  const s = R; R = null;
  const res = Object.values(s.res), n = res.length;
  const free = res.filter(r => +r.g >= 4).length, help = res.filter(r => +r.g === 3).length, bad = n - free - help;
  const touched = [...new Set(Object.keys(s.res).filter(key => +s.res[key].g <= 2).flatMap(key => { const [aid, si] = key.split("|"); const a = atomById(aid); return a && a.sents[+si] ? a.sents[+si].fp : []; }))].filter(x => DB.pats[x]);
  if (s.kind === "pat") {
    // free practice: only the patterns change
    s.steps.forEach(st => { const a = atomById(st.aid); if (!a) return; st.sis.forEach(si => { const r = s.res[rk(a.id, si)]; if (r) { R = s; scoreSentence(a, si, r); R = null; } }); });
    save();
  }
  const attempts = [];
  s.steps.forEach(st => { const a = atomById(st.aid); if (!a) return; const k = st.aid + "#" + st.sis.join(","); if ((s.att[k] || "").trim()) attempts.push({ a, att: s.att[k].trim(), tr: atomPhase(a) === "transform" && s.kind === "due" ? (s.tr[a.id] || "") : "", sis: st.sis }); });
  const body = `<div class="result"><div class="pct">${free}/${n}</div><div class="lbl">${L("Sätze gut oder leicht", "sentences good or easy")}</div></div>
    <div class="stats"><div><b>${free}</b><span>${L("gut / leicht", "good / easy")}</span></div><div><b>${help}</b><span>${L("okay", "OK")}</span></div><div><b>${bad}</b><span>${L("schwer / keine Ahnung", "hard / no idea")}</span></div></div>
    ${touched.length ? `<div class="hint"><b>${L("Diese Muster kamen heute vor:", "These patterns came up today:")}</b><ul class="fp">${touched.map(x => `<li>${esc(patLabel(x))}</li>`).join("")}</ul></div>` : ""}
    ${attempts.length ? `<button class="btn ghost" id="chk">${L("Alle Versuche von Claude prüfen lassen", "Ask Claude to check all attempts")}</button>` : ""}
    ${s.kind === "pat" ? `<button class="btn primary" id="again">${L("Nochmal üben", "Practise again")}</button>` : `<button class="btn primary" id="new">${L("Neues Atom schreiben", "Write a new atom")}</button>`}
    <button class="btn ghost" id="pats" style="margin-top:8px">${L("Meine Fehlermuster", "My mistake patterns")}</button>
    <button class="btn ghost" id="hub" style="margin-top:8px">${L("Zu den Atomen", "Back to atoms")}</button>`;
  shell(L("Geschafft", "Done"), body, { back: L("Atome", "Atoms"), backTo: "aktiv" });
  $("#back").onclick = () => atomsHub();
  const chk = $("#chk"); if (chk) chk.onclick = () => { const p = checkPrompt(attempts); if (!shareText(p)) copyText(p, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy"))); };
  const ag = $("#again"); if (ag) ag.onclick = () => startPatPractice(s.pat);
  const nw = $("#new"); if (nw) nw.onclick = () => freeWrite();
  $("#pats").onclick = () => patsHub(); $("#hub").onclick = () => atomsHub();
}

/* =================================================================== MISSING ENGLISH */
function missingEn() {
  atomsReady();
  const sents = [];
  DB.atoms.forEach(a => { if (a.done) return; a.sents.forEach((s, si) => { if (!s.en && !s.pend) sents.push({ a, si }); }); });
  const pats = Object.keys(DB.pats).filter(id => !DB.pats[id].en && patStats(id).atoms);
  return { sents, pats, n: sents.length + pats.length };
}
function enPrompt(m) {
  const P = ["Bitte gib mir für diese deutschen Sätze und Fehlermuster die englische Bedeutung. Ändere die deutschen Sätze nicht.",
    "Antworte nur mit diesen Blöcken, gleiche Reihenfolge und Nummern wie unten:"];
  if (m.sents.length) P.push("SÄTZE:", "1. (deutscher Satz unverändert) | (englische Bedeutung) | (2–4 Stichwörter in der Grundform)");
  if (m.pats.length) P.push("MUSTER:", "1. (englischer Name des Musters, kurz)");
  P.push("");
  if (m.sents.length) { P.push("Deutsche Sätze:"); m.sents.forEach((x, i) => P.push(`${i + 1}. ${plain(x.a.sents[x.si].de)}`)); }
  if (m.pats.length) { P.push("", "Deutsche Muster:"); m.pats.forEach((id, i) => P.push(`${i + 1}. ${patName(id)}`)); }
  return P.join("\n");
}
function enFill() {
  recStop();
  const m = missingEn();
  if (!m.n) { toast(L("Alles hat schon Englisch.", "Everything has English already.")); atomsHub(); return; }
  const body = `<p class="muted" style="margin-top:4px">${L(`${m.sents.length} Sätze und ${m.pats.length} Muster haben noch kein Englisch. Claude ergänzt es in einem Schritt.`, `${m.sents.length} sentences and ${m.pats.length} patterns don't have English yet. Claude adds it in one go.`)}</p>
    <div class="cb"><div class="step" style="margin-top:0"><span class="n">1</span><div class="b"><button class="btn petrol" id="enCopy" style="margin-top:0">${L("Anfrage kopieren", "Copy the request")}</button></div></div>
    <div class="step"><span class="n">2</span><div class="b"><textarea class="ta2" id="enPaste" style="margin-top:0" placeholder="${L("Claudes Antwort hier einfügen", "Paste Claude's reply here")}"></textarea><button class="btn primary" id="enGo">${L("Übernehmen", "Use it")}</button></div></div></div>`;
  shell(L("Englisch ergänzen", "Add English"), body, { back: L("Atome", "Atoms"), backTo: "aktiv", redraw: enFill });
  $("#back").onclick = () => atomsHub();
  const p = enPrompt(m);
  $("#enCopy").onclick = () => { if (!shareText(p)) copyText(p, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy"))); };
  $("#enGo").onclick = () => {
    const r = parseClaude($("#enPaste").value);
    if (!r && m.sents.length) { toast(L("Ich finde den Block „SÄTZE:“ nicht. Bitte die ganze Antwort einfügen.", "I can't find the “SÄTZE:” block. Please paste the whole reply.")); return; }
    let ns = 0, np = 0;
    if (r) {
      m.sents.forEach((x, i) => { const y = r.sents[i], s = x.a.sents[x.si]; if (y && y.en) { s.en = y.en; if (!s.kw && y.kw) s.kw = y.kw; ns++; } });
      m.pats.forEach((id, i) => { const e = (r.muster || [])[i]; if (e) { DB.pats[id].en = e; np++; } });
    }
    save();
    toast(L(`${ns} Sätze und ${np} Muster ergänzt`, `Added ${ns} sentences and ${np} patterns`));
    atomsHub();
  };
}

/* first load: migrate and let waiting sentences in */
try { atomsReady(); } catch (e) { }
