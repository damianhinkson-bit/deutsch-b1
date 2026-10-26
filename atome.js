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

/* ---------- shared mistake patterns ---------- */
function pNorm(s) { return String(s || "").toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/[^a-z0-9+]+/g, " ").trim(); }
function atomsReady() {
  if (!Array.isArray(DB.atoms)) DB.atoms = [];
  if (!DB.pats || typeof DB.pats !== "object") DB.pats = {};
  if (DB.atomMode !== "satz" && DB.atomMode !== "text") DB.atomMode = "satz";
  let changed = false;
  DB.atoms.forEach(a => {
    if (a.v === 2 && Array.isArray(a.sents)) return;
    const ids = (a.fp || []).map(n => patFind(n)).filter(Boolean);
    a.sents = splitSents(a.corr).map(de => ({ de, en: "", kw: "", fp: ids.slice(), box: a.box || 1 }));
    if (!a.sents.length) a.sents = [{ de: a.corr || "", en: "", kw: "", fp: ids.slice(), box: a.box || 1 }];
    a.tr = a.tr || []; a.up = a.up || ""; a.hist = a.hist || []; a.v = 2; delete a.fp; changed = true;
  });
  if (changed) save();
}
function patFind(name, noCreate) {
  const n = pNorm(name); if (!n) return null;
  for (const id in DB.pats) if (pNorm(DB.pats[id].name) === n) return id;
  if (noCreate) return null;
  const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  DB.pats[id] = { name: String(name).trim(), made: today(), ev: [] };
  return id;
}
function patName(id) { return DB.pats[id] ? DB.pats[id].name : ""; }
function patEvent(id, r) { const p = DB.pats[id]; if (!p) return; p.ev.push({ d: today(), r }); if (p.ev.length > 200) p.ev = p.ev.slice(-200); }
function patStats(id) {
  const p = DB.pats[id], ev = p ? p.ev.slice(-12) : [];
  const o = ev.filter(e => e.r === "ok").length, h = ev.filter(e => e.r === "hint").length, f = ev.filter(e => e.r === "fail").length, n = ev.length;
  const atoms = DB.atoms.filter(a => a.sents.some(s => s.fp.includes(id)));
  return { o, h, f, n, score: n ? (o + h * 0.5) / n : -1, atoms: atoms.length, act: atoms.filter(a => !a.done).length };
}
function patsSorted() {
  return Object.keys(DB.pats).map(id => Object.assign({ id }, patStats(id))).filter(p => p.atoms || p.n)
    .sort((a, b) => (a.n ? 0 : 1) - (b.n ? 0 : 1) || a.score - b.score || b.atoms - a.atoms);
}
function patBar(p) { return p.n ? `<div class="pbar"><i class="o" style="width:${p.o / p.n * 100}%"></i><i class="h" style="width:${p.h / p.n * 100}%"></i><i class="f" style="width:${p.f / p.n * 100}%"></i></div>` : `<div class="pbar"></div>`; }
function patLine(p) { return p.n ? L(`${Math.round(p.score * 100)} % · ${p.o} ✓ · ${p.h} mit Hilfe · ${p.f} ✗`, `${Math.round(p.score * 100)}% · ${p.o} ✓ · ${p.h} with hints · ${p.f} ✗`) : L("noch nicht geübt", "not practised yet"); }
function atomPats(a) { const s = new Set(); a.sents.forEach(x => x.fp.forEach(id => { if (DB.pats[id]) s.add(id); })); return [...s]; }

/* ---------- the request for Claude ---------- */
function claudePrompt(ctx) {
  atomsReady();
  const known = patsSorted().slice(0, 25).map(p => p.name);
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
  P.push("- (ein Muster pro Zeile, kurz, mit den Satznummern, z. B. „Verb an Position 2 (Sätze 1, 3)“)");
  P.push("UMFORMEN:");
  P.push("- (3 kurze Aufgaben zum Umformen für spätere Wiederholungen, z. B. „im Perfekt“ oder „aus Sicht von Anna“)");
  P.push("B1-VERSION:");
  P.push("(derselbe Inhalt eine Stufe besser, natürlich und auf B1-Niveau)");
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
  const re = /^[ \t>#]*(KORREKTUR|SÄTZE|SAETZE|ENGLISCH|FEHLERMUSTER|UMFORMEN|B1[- ]VERSION)\b[ \t]*:?[ \t]*/gim;
  const marks = []; let m;
  while ((m = re.exec(s))) marks.push({ k: m[1].toUpperCase().replace("SAETZE", "SÄTZE").replace("B1 VERSION", "B1-VERSION"), start: m.index, body: m.index + m[0].length });
  // the last KORREKTUR wins (a quoted prompt may contain one too); without one, the first SÄTZE
  let k0 = -1; marks.forEach((mk, i) => { if (mk.k === "KORREKTUR") k0 = i; });
  if (k0 < 0) k0 = marks.findIndex(mk => mk.k === "SÄTZE");
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
    let name = (mm ? x.slice(0, mm.index) : x).trim();
    if (/^[„“"].*[“”"]$/.test(name)) name = name.slice(1, -1).trim();
    return { name, nums };
  }).filter(x => x.name);
  const up = out["B1-VERSION"] && !isPh(out["B1-VERSION"]) ? lines(out["B1-VERSION"]).join("\n") : "";
  return { sents, fp, tr: list(out.UMFORMEN), up, corr: korr ? plain(takeGuess(korr).t) : sents.map(x => plain(x.de)).join(" ") };
}

/* ---------- the atom editor (after a correction, and for "Bearbeiten") ---------- */
/* st = { t, sents:[{de,en,kw,g,pn:[names]}], pats:[names], tr:[], up } */
function stateFromParse(p, title) {
  const names = p.fp.map(x => x.name);
  return {
    t: title || "", tr: p.tr.slice(), up: p.up || "", pats: names.slice(),
    sents: p.sents.map((s, i) => ({ de: s.de, en: s.en, kw: s.kw, g: !!s.g, pn: p.fp.filter(f => !f.nums.length || f.nums.includes(i + 1)).map(f => f.name) }))
  };
}
function stateFromAtom(a) {
  const pats = atomPats(a).map(patName);
  return { t: a.t, tr: (a.tr || []).slice(), up: a.up || "", pats, sents: a.sents.map(s => ({ de: s.de, en: s.en, kw: s.kw, g: false, pn: s.fp.map(patName).filter(Boolean), box: s.box })) };
}
function atomEditor(host, st, opt) {
  const draw = () => {
    const guesses = st.sents.filter(s => s.g).length;
    host.innerHTML = `
      <label class="lab2" for="edT">${L("Titel", "Title")}</label><input class="tin" id="edT" value="${esc(st.t)}">
      ${guesses ? `<div class="hint" style="margin-top:12px"><b>${L("Bitte prüfen:", "Please check:")}</b> ${L(`Bei ${guesses === 1 ? "einem Satz" : guesses + " Sätzen"} musste Claude raten, was du meintest. Bestätige oder ändere ${guesses === 1 ? "ihn" : "sie"}, bevor du speicherst.`, `Claude had to guess what you meant in ${guesses === 1 ? "one sentence" : guesses + " sentences"}. Confirm or change ${guesses === 1 ? "it" : "them"} before saving.`)}</div>` : ""}
      <div class="sec-h">${L("Fehlermuster", "Mistake patterns")}</div>
      <div class="pchips">${st.pats.map((n, i) => `<button class="pchip" aria-pressed="true" data-rmp="${i}">${esc(n)} ✕</button>`).join("") || `<span class="muted small">${L("Noch keine.", "None yet.")}</span>`}</div>
      <div class="row2" style="margin-top:8px"><input class="tin" id="edNP" style="margin-top:0" placeholder="${L("Muster hinzufügen", "Add a pattern")}" list="edPL"><button class="btn ghost" id="edAdd" style="flex:0 0 auto;width:auto;padding:0 16px">+</button></div>
      <datalist id="edPL">${Object.values(DB.pats).map(p => `<option value="${esc(p.name)}">`).join("")}</datalist>
      <div class="sec-h">${L("Sätze", "Sentences")}</div>
      <p class="muted small" style="margin:0 2px">${L("[Eckige Klammern] markieren deine korrigierten Stellen. Sie werden später zu Lücken. Tippe ein Muster an, um es dem Satz zuzuordnen.", "[Square brackets] mark your corrected spots. Later they become the gaps. Tap a pattern to link it to the sentence.")}</p>
      ${st.sents.map((s, i) => `<div class="scard ${s.g ? "guess" : ""}">
        <div class="no"><span>${L("Satz", "Sentence")} ${i + 1}</span><button class="pchip" data-del="${i}">${L("Löschen", "Delete")}</button></div>
        ${s.g ? `<div class="gban"><b>${L("Geraten.", "Guessed.")}</b> ${L("Meintest du das? Ändere den Satz, wenn nicht.", "Is this what you meant? Change the sentence if not.")}<div class="row2"><button class="btn petrol" data-ok="${i}">${L("Ja, so meinte ich das", "Yes, that's what I meant")}</button></div></div>` : ""}
        <textarea class="ta2" data-f="de" data-i="${i}" aria-label="${L("Deutscher Satz", "German sentence")}">${esc(s.de)}</textarea>
        <input class="tin" data-f="en" data-i="${i}" value="${esc(s.en)}" placeholder="${L("Englische Bedeutung", "English meaning")}">
        <input class="tin" data-f="kw" data-i="${i}" value="${esc(s.kw)}" placeholder="${L("Stichwörter, z. B. Freizeit · pflanzen · Baum", "Key words, e.g. Freizeit · pflanzen · Baum")}">
        ${st.pats.length ? `<div class="pchips">${st.pats.map(n => `<button class="pchip" data-tg="${i}" data-n="${esc(n)}" aria-pressed="${s.pn.includes(n)}">${esc(n)}</button>`).join("")}</div>` : ""}
      </div>`).join("")}
      <button class="btn ghost" id="edAddS">${L("+ Satz hinzufügen", "+ Add a sentence")}</button>
      <label class="lab2" for="edR">${L("Umformen (eins pro Zeile)", "Transformations (one per line)")}</label><textarea class="ta2" id="edR">${esc(st.tr.join("\n"))}</textarea>
      <label class="lab2" for="edU">${L("B1-Version (eine Stufe höher, optional)", "B1 version (one step up, optional)")}</label><textarea class="ta2" id="edU">${esc(st.up)}</textarea>
      <button class="btn primary" id="edSave">${esc(opt.saveLabel)}</button>
      ${opt.cancel ? `<button class="btn ghost" id="edCancel" style="margin-top:8px">${L("Abbrechen", "Cancel")}</button>` : ""}
      ${opt.note ? `<p class="muted small">${esc(opt.note)}</p>` : ""}`;
    const keep = () => { st.t = $("#edT", host).value; st.tr = $("#edR", host).value.split("\n").map(x => x.trim()).filter(Boolean); st.up = $("#edU", host).value.trim(); };
    host.querySelectorAll("[data-f]").forEach(el => el.addEventListener("input", () => { st.sents[+el.dataset.i][el.dataset.f] = el.value; }));
    ["#edT", "#edR", "#edU"].forEach(s => $(s, host).addEventListener("input", keep));
    const redo = () => { keep(); const y = window.scrollY; draw(); window.scrollTo(0, y); };
    host.querySelectorAll("[data-rmp]").forEach(b => b.onclick = () => { const n = st.pats[+b.dataset.rmp]; st.pats.splice(+b.dataset.rmp, 1); st.sents.forEach(s => s.pn = s.pn.filter(x => x !== n)); redo(); });
    const add = () => { const v = $("#edNP", host).value.trim(); if (!v) return; const ex = st.pats.find(n => pNorm(n) === pNorm(v)); if (!ex) st.pats.push(v); redo(); };
    $("#edAdd", host).onclick = add; $("#edNP", host).addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); add(); } });
    host.querySelectorAll("[data-tg]").forEach(b => b.onclick = () => { const s = st.sents[+b.dataset.tg], n = b.dataset.n; s.pn = s.pn.includes(n) ? s.pn.filter(x => x !== n) : s.pn.concat(n); b.setAttribute("aria-pressed", s.pn.includes(n)); });
    host.querySelectorAll("[data-ok]").forEach(b => b.onclick = () => { st.sents[+b.dataset.ok].g = false; redo(); });
    let armed = -1;
    host.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const i = +b.dataset.del; if (armed !== i) { armed = i; b.textContent = L("Wirklich?", "Sure?"); return; } st.sents.splice(i, 1); redo(); });
    $("#edAddS", host).onclick = () => { st.sents.push({ de: "", en: "", kw: "", g: false, pn: [] }); redo(); };
    if (opt.cancel) $("#edCancel", host).onclick = opt.cancel;
    $("#edSave", host).onclick = () => {
      keep();
      st.sents.forEach(s => { s.de = s.de.replace(/\s+/g, " ").trim(); });
      const real = st.sents.filter(s => s.de);
      if (!real.length) { toast(L("Es fehlt mindestens ein Satz.", "At least one sentence is needed.")); return; }
      const gi = st.sents.findIndex(s => s.de && s.g);
      if (gi >= 0) { toast(L("Bitte zuerst die geratenen Sätze bestätigen.", "Please confirm the guessed sentences first.")); const c = host.querySelectorAll(".scard")[gi]; if (c) c.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      opt.onSave(Object.assign({}, st, { sents: real }));
    };
  };
  draw();
}
function buildSents(st, oldSents) {
  return st.sents.map((s, i) => ({
    de: s.de, en: (s.en || "").trim(), kw: (s.kw || "").trim(),
    fp: [...new Set(s.pn.filter(n => st.pats.some(p => pNorm(p) === pNorm(n))).map(n => patFind(n)))].filter(Boolean),
    box: s.box || (oldSents && oldSents[i] ? oldSents[i].box : 1) || 1
  }));
}
function newAtomFrom(st, ctx) {
  atomsReady();
  const sents = buildSents(st);
  st.pats.forEach(n => patFind(n));
  const a = { id: "a" + Date.now().toString(36), t: st.t.trim() || ctx.title || L("Mein Text", "My text"), k: ctx.kindKey || "frei", task: ctx.task || "", cue: ctx.cue || "", orig: ctx.text || "",
    corr: sents.map(s => plain(s.de)).join(" "), sents, tr: st.tr, up: st.up, box: 1, due: addDays(today(), 1), made: today(), hist: [], ti: 0, done: false, v: 2 };
  DB.atoms.push(a); save();
  return a;
}
function savedNote(host, a) {
  host.innerHTML = `<div class="fb good"><b>${L("Gespeichert.", "Saved.")}</b> ${L(`„${esc(a.t)}“ ist jetzt ein Atom mit ${a.sents.length} Sätzen. Erste Wiederholung: morgen.`, `“${esc(a.t)}” is now an atom with ${a.sents.length} sentences. First review: tomorrow.`)}</div><button class="btn petrol" id="toAtoms">${L("Zu meinen Atomen", "Go to my atoms")}</button>`;
  $("#toAtoms").onclick = () => atomsHub();
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
  const row = a => `<button class="li" data-at="${a.id}"><span class="tx"><span class="d">${esc(a.t)}</span><span class="e">${a.done ? L("abgeschlossen", "graduated") : L(`Box ${Math.min(a.box, 5)} · ${a.sents.length} Sätze · ${fmtDay(a.due)}`, `Box ${Math.min(a.box, 5)} · ${a.sents.length} sentences · ${fmtDay(a.due)}`)}</span></span>${a.done ? `<span class="badge ok">✓</span>` : a.due <= today() ? `<span class="badge due">${L("fällig", "due")}</span>` : `<span class="badge">${Math.min(a.box, 5)}</span>`}</button>`;
  const body = `<div class="stats"><div><b>${due.length}</b><span>${L("fällig", "due")}</span></div><div><b>${act.length}</b><span>${L("aktiv", "active")}</span></div><div><b>${pats.length}</b><span>${L("Muster", "patterns")}</span></div></div>
    <button class="hero" id="rev" ${due.length ? "" : "disabled"}><span class="ic">${due.length}</span><span><span class="tt">${L("Wiederholen", "Review")}</span><span class="ss">${due.length ? L("Mit Hinweisen, wenn du sie brauchst.", "With hints when you need them.") : L("Heute ist nichts fällig.", "Nothing is due today.")}</span></span></button>
    ${weak ? `<button class="hero alt" id="weak"><span class="ic">!</span><span><span class="tt">${L("Schwächstes Muster üben", "Practise your weakest pattern")}</span><span class="ss">${esc(weak.name)} · ${Math.round(weak.score * 100)} %</span></span></button>` : ""}
    <div class="seg" id="mode"><button data-m="satz" aria-pressed="${DB.atomMode === "satz"}">${L("Satz für Satz", "Sentence by sentence")}</button><button data-m="text" aria-pressed="${DB.atomMode === "text"}">${L("Ganzer Text", "Whole text")}</button></div>
    <div class="menu" style="margin-top:12px">
      <button class="item" id="mPats"><span class="ic">${pats.length || "0"}</span><span class="tx"><span class="tt">${L("Meine Fehlermuster", "My mistake patterns")}</span><span class="ss">${pats.length ? L("Was klappt, was nur mit Hilfe, was noch nicht", "What works, what needs hints, what doesn't yet") : L("Kommen mit deinem ersten Atom", "They arrive with your first atom")}</span></span></button>
      <button class="item" id="new"><span class="ic">+</span><span class="tx"><span class="tt">${L("Neues Atom", "New atom")}</span><span class="ss">${L("Schreiben oder sprechen, korrigieren lassen, speichern.", "Write or speak, get corrected, save.")}</span></span></button>
      <button class="item" id="paste"><span class="ic">⇩</span><span class="tx"><span class="tt">${L("Claude-Antwort einfügen", "Paste a Claude reply")}</span><span class="ss">${L("Für Texte, die du direkt im Chat geschrieben hast", "For texts you wrote straight into a chat")}</span></span></button>
    </div>
    ${act.length ? `<div class="sec-h">${L("Aktive Atome", "Active atoms")}</div><div class="list">${act.map(row).join("")}</div>` : `<p class="empty">${L("Noch keine Atome. Jeder Text, den du korrigieren lässt, kann ein Atom werden.", "No atoms yet. Any text you get corrected can become an atom.")}</p>`}
    ${grad.length ? `<details class="fold"><summary>${L("Abgeschlossen", "Graduated")} (${grad.length})</summary><div class="in"><div class="list">${grad.map(row).join("")}</div></div></details>` : ""}
    <details class="fold"><summary>${L("So funktionieren Atome", "How atoms work")}</summary><div class="in small">
      <p style="margin-top:0">${L("Ein Atom ist ein eigener, korrigierter Text. Jeder Satz hat seine eigene Box. Wiederholt wird nach 1, 3, 7, 16 und 35 Tagen.", "An atom is one of your own corrected texts. Every sentence has its own box. Reviews come after 1, 3, 7, 16 and 35 days.")}</p>
      <p>${L("Du siehst die englische Bedeutung und sagst den Satz auf Deutsch. Hängst du fest, holst du dir Hinweise: Stichwörter, dann eine Wortbank, dann einen Lückensatz, am Ende die Lösung. Die Hinweise verraten nie die Grammatik, die du übst.", "You see the English meaning and say the sentence in German. If you're stuck, take hints: key words, then a word bank, then a gap sentence, and finally the answer. Hints never give away the grammar you're practising.")}</p>
      <p>${L("Richtig nur mit Englisch: eine Box höher. Richtig mit Stichwörtern: Box bleibt. Wortbank, Lücken oder Lösung gebraucht, oder ein bekannter Fehler: eine Box tiefer. Ein neuer Fehler wird nur notiert. Die Box des Atoms ist die seines schwächsten Satzes.", "Right with only the English: up one box. Right with key words: the box stays. Needed the word bank, gaps or answer, or a known mistake came back: down one box. A new mistake is just noted. The atom's box is that of its weakest sentence.")}</p>
      <p style="margin-bottom:0">${L("Box 1–2: Satz neu bauen. Box 3–4: umformen. Box 5: ohne Englisch, ganz frei. Danach ist das Atom abgeschlossen.", "Box 1–2: rebuild the sentence. Box 3–4: transform it. Box 5: without the English, completely free. Then the atom graduates.")}</p></div></details>`;
  shell(L("Atome", "Atoms"), body, { back: L("Aktiv", "Active"), backTo: "aktiv", redraw: atomsHub });
  $("#rev").onclick = () => { if (due.length) startAtomReview(due.map(a => a.id)); };
  const w = $("#weak"); if (w) w.onclick = () => startPatPractice(weak.id);
  document.querySelectorAll("#mode button").forEach(b => b.onclick = () => { DB.atomMode = b.dataset.m; save(); document.querySelectorAll("#mode button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
  $("#mPats").onclick = () => patsHub();
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
      onSave: s => { s.pats.forEach(n => patFind(n)); a.t = s.t.trim() || a.t; a.sents = buildSents(s, a.sents); a.corr = a.sents.map(x => plain(x.de)).join(" "); a.tr = s.tr; a.up = s.up; a.box = Math.min(...a.sents.map(x => x.box)); save(); toast(L("Gespeichert", "Saved")); atomDetail(id); } });
    return;
  }
  const hist = a.hist.slice(-8).map(h => `${fmtDay(h.d)}: ${typeof h.ok === "boolean" ? (h.ok ? "✓" : "✗") : `${h.ok}/${h.n}`}`).join(" · ");
  const body = `<div class="sit"><span class="lab">${a.done ? L("Abgeschlossen", "Graduated") : L(`Box ${Math.min(a.box, 5)} · nächste Wiederholung ${fmtDay(a.due)}`, `Box ${Math.min(a.box, 5)} · next review ${fmtDay(a.due)}`)}</span>${a.task ? `<p class="muted small">${esc(a.task)}</p>` : ""}</div>
    <div class="sec-h">${L("Sätze", "Sentences")}</div>
    <div class="hl"><div class="slist">${a.sents.map(s => `<div class="s"><div class="de"><span>${markedHtml(s.de)}</span><span class="sbox">Box ${Math.min(s.box, 5)}</span></div>${s.en ? `<div class="en">${esc(s.en)}</div>` : ""}${s.fp.length ? `<div class="pchips">${s.fp.filter(x => DB.pats[x]).map(x => `<span class="pchip st">${esc(patName(x))}</span>`).join("")}</div>` : ""}</div>`).join("")}</div></div>
    ${TTS ? `<button class="btn ghost" data-say="${esc(a.corr)}">${L("Ganzen Text anhören", "Play the whole text")}</button>` : ""}
    ${a.up ? `<div class="up"><div class="lab"><span>${L("Eine Stufe höher (B1)", "One step up (B1)")}</span>${TTS ? `<button class="spk" data-say="${esc(a.up)}">${ICON.spk}</button>` : ""}</div>${esc(a.up)}</div>` : ""}
    ${a.tr.length ? `<div class="sec-h">${L("Umformen", "Transformations")}</div><ul class="fp">${a.tr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${a.orig ? `<details class="fold"><summary>${L("Mein Original", "My original")}</summary><div class="in" style="white-space:pre-wrap">${esc(a.orig)}</div></details>` : ""}
    ${hist ? `<p class="muted small">${hist}</p>` : ""}
    <button class="btn primary" id="now">${L("Jetzt wiederholen", "Review now")}</button>
    <div class="row2"><button class="btn ghost" id="edit">${L("Bearbeiten", "Edit")}</button><button class="btn ghost" id="del">${L("Löschen", "Delete")}</button></div>`;
  shell(a.t, body, { back: L("Atome", "Atoms"), backTo: "aktiv", redraw: () => atomDetail(id) });
  $("#back").onclick = () => atomsHub();
  $("#now").onclick = () => startAtomReview([id]);
  $("#edit").onclick = () => atomDetail(id, true);
  let armed = false;
  $("#del").onclick = e => { if (!armed) { armed = true; e.target.textContent = L("Nochmal tippen zum Löschen", "Tap again to delete"); e.target.classList.add("bad"); return; } DB.atoms = DB.atoms.filter(x => x.id !== id); save(); toast(L("Gelöscht", "Deleted")); atomsHub(); };
}

/* =================================================================== PATTERNS */
function patsHub() {
  recStop(); atomsReady();
  const pats = patsSorted();
  const body = `<p class="muted" style="margin-top:4px">${L("Alle Fehlermuster aus allen Atomen. Grün = ohne Hilfe richtig, gelb = nur mit Hinweisen, rot = Fehler kam wieder. Die schwächsten stehen oben.", "All mistake patterns across all atoms. Green = right without help, amber = only with hints, red = the mistake came back. The weakest are at the top.")}</p>
    ${pats.length ? `<div class="hl" style="padding:0">${pats.map(p => `<button class="prow" data-p="${p.id}"><div class="top"><b>${esc(p.name)}</b><span>${L(`${p.atoms} ${p.atoms === 1 ? "Atom" : "Atome"}`, `${p.atoms} ${p.atoms === 1 ? "atom" : "atoms"}`)}</span></div>${patBar(p)}<div class="sub">${patLine(p)}</div></button>`).join("")}</div>`
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
      ${others.length ? `<label class="lab2" for="pnM">${L("Gleiches Muster wie …", "Same pattern as …")}</label><select class="tin" id="pnM">${others.map(o => `<option value="${o}">${esc(patName(o))}</option>`).join("")}</select><button class="btn ghost" id="pnG">${L("Zusammenführen", "Merge")}</button>` : ""}
      <button class="btn ghost" id="pnD" style="margin-top:8px">${L("Muster löschen", "Delete pattern")}</button></div></details>`;
  shell(p.name, body, { back: L("Muster", "Patterns"), backTo: "aktiv", redraw: () => patDetail(id) });
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
function atomPhase(a) { return a.box <= 2 ? "rebuild" : a.box <= 4 ? "transform" : "free"; }
function startRung(a, s) { return atomPhase(a) === "free" || !s.en ? 1 : 2; }
function startAtomReview(ids) {
  atomsReady();
  const steps = [];
  ids.map(atomById).filter(Boolean).forEach(a => {
    if (DB.atomMode === "text") steps.push({ aid: a.id, sis: a.sents.map((_, i) => i) });
    else a.sents.forEach((_, i) => steps.push({ aid: a.id, sis: [i] }));
  });
  if (!steps.length) { atomsHub(); return; }
  R = { steps, i: 0, kind: "due", res: {}, rung: {}, att: {}, shown: {}, tr: {} };
  reviewStep();
}
function startPatPractice(pid) {
  atomsReady();
  const list = shuffle(patSentences(pid)).slice(0, 10);
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
  const body = `<div class="cnt muted small" style="text-align:center;font-weight:700">${R.i + 1} ${L("von", "of")} ${R.steps.length}${R.kind === "pat" ? " · " + esc(patName(R.pat)) : ` · Box ${Math.min(...st.sis.map(si => a.sents[si].box), 5)}`}</div>
    <div class="sit"><span class="lab">${esc(a.t)}${single ? ` · ${L("Satz", "Sentence")} ${si0 + 1}/${a.sents.length}` : ""}</span><p>${esc(ins)}</p>${a.task && rung >= 1 ? `<p class="muted small">${esc(a.task)}</p>` : ""}${prev}</div>
    <div class="ladder">${[1, 2, 3, 4, 5, 6].map(n => `<i class="${n <= rung ? (n >= 4 ? "on top" : "on") : ""}"></i>`).join("")}</div>
    <div class="lad-l"><span>${L("Hinweis", "Hint")}: ${esc(T(RUNGS[Math.max(1, rung)]))}</span><span>${rung <= (phase === "free" ? 1 : 2) ? L("ohne Hilfe", "no help") : rung === 3 ? L("Box bleibt", "box stays") : L("Box sinkt", "box drops")}</span></div>
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
  $("#cmp").innerHTML = `${att ? `<div class="sec-h">${L("Dein Versuch", "Your attempt")}</div><div class="model ${phase === "rebuild" ? "diff" : ""}">${phase === "rebuild" ? diffHtml(att, target) : esc(att)}</div>${phase === "rebuild" ? `<p class="muted small">${L("Grün = fehlte bei dir, rot durchgestrichen = zu viel oder anders.", "Green = missing in yours, red crossed out = extra or different.")}</p>` : ""}` : `<p class="muted small">${L("Ohne Versuch aufgedeckt: zählt wie die Lösung.", "Revealed without an attempt: counts as the answer.")}</p>`}
    <div class="sec-h">${phase === "rebuild" ? L("So ist es richtig", "The correct version") : L("Dein Original zum Vergleich", "Your original, for comparison")} · ${L("bewerte jeden Satz", "grade each sentence")}</div>
    ${rows}
    ${phase !== "rebuild" && att ? `<button class="btn ghost" id="chk">${L("Unsicher? Von Claude prüfen lassen", "Not sure? Ask Claude to check")}</button>` : ""}
    <button class="btn primary" id="next">${R.i + 1 < R.steps.length ? L("Weiter", "Next") : L("Fertig", "Finish")}</button>`;
  st.sis.forEach(si => bindGradeRow(a, si, k));
  const chk = $("#chk"); if (chk) chk.onclick = () => { const p = checkPrompt([{ a, att, tr: phase === "transform" ? trFor(a) : "", sis: st.sis }]); if (!shareText(p)) copyText(p, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy"))); };
  $("#next").onclick = () => {
    const miss = st.sis.find(si => !R.res[rk(a.id, si)] || !R.res[rk(a.id, si)].g);
    if (miss != null) { toast(single ? L("Bewerte zuerst den Satz.", "Grade the sentence first.") : L("Bewerte zuerst alle Sätze.", "Grade all sentences first.")); return; }
    const pend = st.sis.find(si => { const r = R.res[rk(a.id, si)]; return r.g !== "ok" && !r.pk.length; });
    if (pend != null) { toast(L("Wähle das Fehlermuster aus (oder schreib ein neues).", "Pick the mistake pattern (or type a new one).")); return; }
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
    ${s.fp.filter(x => DB.pats[x]).length ? `<div class="pchips">${s.fp.filter(x => DB.pats[x]).map(x => `<span class="pchip st">${esc(patName(x))}</span>`).join("")}</div>` : ""}
    <div class="g3"><button class="ok ${r.g === "ok" ? "on" : ""}" data-g="ok">✓ ${L("Richtig", "Right")}</button><button class="kn ${r.g === "kn" ? "on" : ""}" data-g="kn">✗ ${L("Bekannter Fehler", "Known mistake")}</button><button class="nw ${r.g === "nw" ? "on" : ""}" data-g="nw">＋ ${L("Neuer Fehler", "New mistake")}</button></div>
    <div class="pk"></div></div>`;
}
function bindGradeRow(a, si, k) {
  const box = $("#gr-" + si), key = rk(a.id, si), s = a.sents[si];
  const drawPick = () => {
    const r = R.res[key], host = box.querySelector(".pk");
    box.querySelectorAll("[data-g]").forEach(b => b.classList.toggle("on", b.dataset.g === r.g));
    if (!r || r.g === "ok") { host.innerHTML = ""; return; }
    const own = s.fp.filter(x => DB.pats[x]);
    const opts = r.g === "kn" ? (own.length ? own : atomPats(a)) : patsSorted().map(p => p.id).filter(x => !own.includes(x)).slice(0, 14);
    host.innerHTML = `<div class="pick"><div class="muted small" style="font-weight:700">${r.g === "kn" ? L("Welches Muster kam wieder?", "Which pattern came back?") : L("Welcher Fehler? Wähle ein Muster oder schreib ein neues.", "Which mistake? Pick a pattern or type a new one.")}</div>
      <div class="pchips">${opts.map(x => `<button class="pchip" data-pk="${x}" aria-pressed="${r.pk.includes(x)}">${esc(patName(x))}</button>`).join("")}</div>
      ${r.g === "nw" || !opts.length ? `<div class="row2" style="margin-top:8px"><input class="tin" style="margin-top:0" id="np-${si}" placeholder="${L("Neues Muster, z. B. Dativ nach mit", "New pattern, e.g. dative after mit")}"><button class="btn ghost" id="npb-${si}" style="flex:0 0 auto;width:auto;padding:0 16px">+</button></div>` : ""}</div>`;
    host.querySelectorAll("[data-pk]").forEach(b => b.onclick = () => { const x = b.dataset.pk; r.pk = r.pk.includes(x) ? r.pk.filter(y => y !== x) : r.pk.concat(x); b.setAttribute("aria-pressed", r.pk.includes(x)); });
    const nb = $("#npb-" + si), ni = $("#np-" + si);
    if (nb) { const addNew = () => { const v = ni.value.trim(); if (!v) return; const id = patFind(v); save(); if (!r.pk.includes(id)) r.pk.push(id); drawPick(); }; nb.onclick = addNew; ni.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addNew(); } }); }
  };
  box.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
    const prev = R.res[key];
    R.res[key] = { g: b.dataset.g, pk: prev && prev.g === b.dataset.g ? prev.pk : [] };
    if (b.dataset.g === "kn") { const own = s.fp.filter(x => DB.pats[x]); if (own.length === 1) R.res[key].pk = own.slice(); }
    drawPick();
  });
  if (R.res[key]) drawPick();
}
/* the scoring: free rung 2 (rung 1 in box 5), key words keep the box, more help or a known mistake drops it */
function scoreSentence(a, si, r) {
  const s = a.sents[si], free = R.kind === "pat" ? 2 : atomPhase(a) === "free" ? 1 : 2;
  let delta = 0, ev;
  if (r.g === "kn") { delta = -1; }
  else if (r.g === "nw") { delta = 0; }
  else { delta = r.rung <= free ? 1 : r.rung === 3 ? 0 : -1; }
  ev = r.g === "ok" ? (r.rung <= free ? "ok" : "hint") : null;
  // pattern events: the named ones failed, the rest of the sentence's patterns get the hint result
  const failed = r.g === "ok" ? [] : r.pk;
  s.fp.filter(x => DB.pats[x]).forEach(x => { if (failed.includes(x)) return; patEvent(x, r.g === "ok" ? ev : r.rung <= free ? "ok" : "hint"); });
  failed.forEach(x => patEvent(x, "fail"));
  if (r.g === "nw") s.fp = [...new Set(s.fp.concat(r.pk))];
  return delta;
}
function finishAtom(a) {
  const old = a.box; let ok = 0;
  a.sents.forEach((s, si) => {
    const r = R.res[rk(a.id, si)]; if (!r) return;
    const d = scoreSentence(a, si, r);
    s.box = Math.max(1, Math.min(6, (s.box || 1) + d));
    if (d > 0) ok++;
  });
  if (atomPhase(a) === "transform") a.ti = (a.ti || 0) + 1;
  const min = Math.min(...a.sents.map(s => s.box));
  if (min >= 6) { a.done = true; a.box = 5; }
  else { a.box = min; a.due = addDays(today(), ATOM_INT[Math.min(5, min)]); }
  a.hist.push({ d: today(), b: old, ok, n: a.sents.length });
  save();
  toast(a.done ? L("Atom abgeschlossen! 🎉", "Atom graduated! 🎉") : L(`${a.t}: Box ${a.box} · wieder ${fmtDay(a.due)}`, `${a.t}: box ${a.box} · back ${fmtDay(a.due)}`));
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
  const free = res.filter(r => r.g === "ok" && r.rung <= 2).length, help = res.filter(r => r.g === "ok" && r.rung > 2).length, bad = n - free - help;
  const touched = [...new Set(res.flatMap(r => r.pk || []))].filter(x => DB.pats[x]);
  if (s.kind === "pat") {
    // free practice: only the patterns change
    s.steps.forEach(st => { const a = atomById(st.aid); if (!a) return; st.sis.forEach(si => { const r = s.res[rk(a.id, si)]; if (r) { R = s; scoreSentence(a, si, r); R = null; } }); });
    save();
  }
  const attempts = [];
  s.steps.forEach(st => { const a = atomById(st.aid); if (!a) return; const k = st.aid + "#" + st.sis.join(","); if ((s.att[k] || "").trim()) attempts.push({ a, att: s.att[k].trim(), tr: atomPhase(a) === "transform" && s.kind === "due" ? (s.tr[a.id] || "") : "", sis: st.sis }); });
  const body = `<div class="result"><div class="pct">${free}/${n}</div><div class="lbl">${L("Sätze ohne Hilfe richtig", "sentences right without help")}</div></div>
    <div class="stats"><div><b>${free}</b><span>${L("ohne Hilfe", "no help")}</span></div><div><b>${help}</b><span>${L("mit Hinweisen", "with hints")}</span></div><div><b>${bad}</b><span>${L("Fehler", "mistakes")}</span></div></div>
    ${touched.length ? `<div class="hint"><b>${L("Diese Muster kamen heute vor:", "These patterns came up today:")}</b><ul class="fp">${touched.map(x => `<li>${esc(patName(x))}</li>`).join("")}</ul></div>` : ""}
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
