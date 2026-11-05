/* Satzmuster: pattern drills (substitution drills) built from the atoms.
   Loaded after atome.js. One part of a sentence changes; you see the cue in its base form
   (die Katze, er, gestern …) and say or type the whole new sentence.
   Claude writes the patterns: inside every correction (SATZMUSTER block) and, for older atoms,
   with one "get patterns" request. Free practice only: atom boxes never change here.

   Data (on each atom)
   atom.pm = [{ id, f: "Ich habe [einen Hund].", en, note, items: [{ cue, de, en }], n, last, d }]
   n = rounds played, last = share right in the last round (0–1), d = day of the last round. */

(function addSmStyles() {
  const css = `
  .sm-model{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px 14px;margin-top:10px}
  .sm-model .lab{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px}
  .sm-model .f{font-size:18px;font-weight:700;line-height:1.45}
  .sm-model .en{color:var(--muted);font-size:14px;margin-top:2px}
  .sm-model .note{font-size:13px;font-weight:800;color:var(--petrol-soft);margin-top:6px}
  mark.slot{background:var(--amber-tint);color:inherit;border-radius:5px;padding:0 3px;box-shadow:inset 0 -2px 0 var(--amber)}
  .hero mark.slot{background:transparent;color:inherit;padding:0;box-shadow:inset 0 -2px 0 var(--amber)}
  .sm-model .note{background:none;padding:0}
  .sm-cue{text-align:center;margin:18px 0 6px}
  .sm-cue .lab{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .sm-cue .w{display:inline-block;margin-top:6px;background:var(--amber);color:var(--amber-ink);font-size:26px;font-weight:800;border-radius:16px;padding:10px 22px}
  .sm-mic{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:14px;background:var(--petrol);color:var(--on-petrol);border-radius:var(--r-lg);padding:18px;font-weight:800;font-size:18px}
  .sm-mic.on{background:var(--bad)}
  .sm-heard{min-height:26px;text-align:center;font-size:17px;font-weight:700;margin-top:10px;color:var(--muted)}
  .sm-row{display:block;width:100%;text-align:left;padding:12px 14px;border-bottom:1px solid var(--line)}
  .sm-row:last-child{border-bottom:none}
  .sm-row .f{font-weight:700;font-size:15.5px;line-height:1.4}
  .sm-row .sub{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;color:var(--muted);margin-top:4px}
  .sm-row .sub b{white-space:nowrap}
  .sm-miss{padding:9px 0;border-top:1px solid var(--line);font-size:15px}
  .sm-miss:first-child{border-top:none}
  .sm-miss .c{font-size:12px;font-weight:800;color:var(--muted)}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* ---------- what Claude is asked for ---------- */
const SM_RULES = [
  "Nimm pro Muster einen meiner korrigierten Sätze und setz GENAU EINE Stelle in [eckige Klammern]: die Stelle, die ausgetauscht wird.",
  "Wähle Stellen, bei denen der Austausch die Grammatik ändert, am liebsten passend zu meinen Fehlermustern: Artikel und Kasus (einen/eine/ein, den/dem), Verbendung nach Person (ich/du/er/wir), Adjektivendung, Wortstellung (Zeitangabe nach vorn, weil-/dass-Satz, Modalverb, Perfekt).",
  "Danach 6–8 Austausch-Zeilen. Das Stichwort steht immer in der Grundform (Nomen mit der/die/das, Verb im Infinitiv, Pronomen im Nominativ, Adjektiv ohne Endung), damit ich die Form selbst anpassen muss. Nur die Stelle wechselt, der Rest bleibt gleich, außer was die Grammatik mitändern muss.",
  "Einfaches, natürliches Deutsch auf A2/B1-Niveau."
];
const SM_FORMAT = [
  "M: (Satz mit [Stelle]) | (englische Bedeutung) | (was sich ändert, ganz kurz)",
  "- (Stichwort in der Grundform) → (ganzer neuer Satz) | (englische Bedeutung)",
  "(Beispiel:)",
  "(M: Ich habe [einen Hund]. | I have a dog. | Akkusativ: einen / eine / ein)",
  "(- die Katze → Ich habe eine Katze. | I have a cat.)",
  "(- das Auto → Ich habe ein Auto. | I have a car.)",
  "(- der Garten → Ich habe einen Garten. | I have a garden.)"
];
function satzmusterPromptLines(P) {
  P.push("SATZMUSTER:");
  P.push("(2–3 Muster aus meinen korrigierten Sätzen für Austausch-Übungen. " + SM_RULES.join(" ") + ")");
  SM_FORMAT.forEach(l => P.push(l));
}

/* ---------- reading the SATZMUSTER block ---------- */
const SM_ARROW = /\s*(?:→|->|=>|⇒|–>|—>)\s*/;
function smParse(body) {
  const out = []; let tn = 0, cur = null;
  const isPh = t => /^\(.*\)$/.test(t) || /^\(/.test(t);
  String(body || "").replace(/\r/g, "").replace(/\*\*|__|`/g, "").split("\n").forEach(raw => {
    const l = raw.replace(/^\s*>\s?/, "").replace(/^#+\s*/, "").trim();
    if (!l || /^\(.*\)$/.test(l)) return;
    let m;
    if (!SM_ARROW.test(l) && (m = l.match(/^(?:TEXT|T)\s*(\d+)\b/i))) { tn = +m[1]; cur = null; return; }
    if (SM_ARROW.test(l) && (m = l.match(/^(?:[-–•*]|\d+[.)])?\s*(.+)$/))) {
      if (!cur) return;
      const ix = m[1].search(SM_ARROW); if (ix < 0) return;
      const cue = m[1].slice(0, ix).replace(/^[„“"]|[“”"]$/g, "").trim();
      const rest = m[1].slice(ix).replace(SM_ARROW, "").split(/\s*\|\s*/);
      const de = (rest[0] || "").replace(/^[„“"]|[“”"]$/g, "").replace(/[\[\]]/g, "").trim();
      if (!cue || !de || isPh(cue) || isPh(de)) return;
      cur.items.push({ cue, de, en: (rest[1] || "").trim() });
      return;
    }
    m = l.match(/^(?:M|Muster)\s*\d*\s*[:.)]\s*(.+)$/i);
    const line = m ? m[1] : /\[[^\]]+\]/.test(l) ? l : "";
    if (!line) return;
    const parts = line.split(/\s*\|\s*/);
    const f = (parts[0] || "").replace(/^[„“"]|[“”"]$/g, "").trim();
    if (!f || isPh(f)) { cur = null; return; }
    cur = { tn, f, en: (parts[1] || "").trim(), note: parts.slice(2).join(" · ").trim(), items: [] };
    out.push(cur);
  });
  return out.filter(p => p.items.length >= 3);
}
let smSeq = 0;
function smStamp(list) {
  return (list || []).filter(p => p && p.f && p.items && p.items.length).map(p => ({
    id: "m" + Date.now().toString(36) + (smSeq++).toString(36), f: p.f, en: p.en || "", note: p.note || "",
    items: p.items.map(x => ({ cue: x.cue, de: x.de, en: x.en || "" })), n: 0, last: null, d: ""
  }));
}

/* ---------- lookups ---------- */
function smAll(aid) {
  const out = [];
  (DB.atoms || []).forEach(a => { if (aid && a.id !== aid) return; (a.pm || []).forEach(m => out.push({ a, m })); });
  return out;
}
function smCount() { return smAll().length; }
function smFind(aid, mid) { const a = atomById(aid); const m = a && (a.pm || []).find(x => x.id === mid); return m ? { a, m } : null; }
function smSorted(aid) {
  return smAll(aid).sort((p, q) => {
    if (!p.m.n !== !q.m.n) return p.m.n ? 1 : -1;
    if ((p.m.last ?? 1) !== (q.m.last ?? 1)) return (p.m.last ?? 1) - (q.m.last ?? 1);
    return String(p.m.d).localeCompare(String(q.m.d));
  });
}
function smWithout() { return (DB.atoms || []).filter(a => !(a.pm || []).length && a.sents && a.sents.some(x => !x.pend && plain(x.de).trim())); }
function slotHtml(f) { return esc(f).replace(/\[([^\]]+)\]/g, (m, x) => `<mark class="slot">${x}</mark>`); }
function smMode() { return DB.smMode === "type" || !SRC ? "type" : "say"; }

/* =================================================================== HUB */
function smHub(aid) {
  recStop(); atomsReady();
  const a0 = aid ? atomById(aid) : null; if (aid && !a0) { smHub(); return; }
  const list = smSorted(aid), without = aid ? [] : smWithout();
  const mixN = Math.min(15, list.reduce((n, x) => n + x.m.items.length, 0));
  const row = x => `<button class="sm-row" data-m="${x.m.id}" data-a="${x.a.id}"><div class="f">${slotHtml(x.m.f)}</div>
    <div class="sub"><span>${esc(x.m.note || x.m.en || "")}${aid ? "" : `${x.m.note || x.m.en ? " · " : ""}${esc(x.a.t)}`}</span><b>${x.m.n ? `${Math.round((x.m.last || 0) * 100)} %` : L("neu", "new")}</b></div></button>`;
  const body = `<p class="muted" style="margin-top:4px">${a0 ? L(`Nur „${esc(a0.t)}“. `, `Only “${esc(a0.t)}”. `) : ""}${L("Ein Teil des Satzes wechselt. Du siehst das Stichwort in der Grundform und sagst den ganzen Satz, mit der richtigen Form. Freies Üben: deine Boxen ändern sich nicht.", "One part of the sentence changes. You see the cue in its base form and say the whole sentence, with the right form. Free practice: your boxes don't change.")}</p>
    <div class="seg" id="smMd"><button data-v="say" aria-pressed="${smMode() === "say"}" ${SRC ? "" : "disabled"}>${L("Sprechen", "Speak")}</button><button data-v="type" aria-pressed="${smMode() === "type"}">${L("Tippen", "Type")}</button></div>
    ${SRC ? "" : `<p class="muted small" style="margin:6px 2px 0">${L("Sprechen geht nur in Chrome. Hier tippst du.", "Speaking only works in Chrome. Here you type.")}</p>`}
    ${list.length ? `<button class="hero" id="smNext"><span class="ic">▶</span><span><span class="tt">${L("Nächstes Muster", "Next pattern")}</span><span class="ss">${slotHtml(list[0].m.f)}</span></span></button>
    ${list.length > 1 ? `<button class="hero alt" id="smMix"><span class="ic">${mixN}</span><span><span class="tt">${L("Gemischt", "Mixed")}</span><span class="ss">${L("Stichwörter aus allen Mustern durcheinander", "Cues from all patterns, shuffled")}</span></span></button>` : ""}
    <div class="sec-h">${L("Alle Muster", "All patterns")} (${list.length})</div><div class="list">${list.map(row).join("")}</div>`
    : `<p class="empty">${L("Noch keine Satzmuster. Sie kommen mit jeder neuen Korrektur von Claude, oder du holst sie für deine alten Atome.", "No patterns yet. They come with every new correction from Claude, or you can get them for your older atoms.")}</p>`}
    ${a0 ? `<button class="btn ghost" id="smMore">${L("Mehr Muster von Claude holen", "Get more patterns from Claude")}</button>` : without.length ? `<div class="cb"><h3>${L(`${without.length} Atome ohne Satzmuster`, `${without.length} atoms without patterns`)}</h3>
      <div class="muted small">${L("Eine Anfrage an Claude macht Muster aus deinen eigenen Sätzen, bis zu 6 Atome auf einmal.", "One request to Claude turns your own sentences into patterns, up to 6 atoms at a time.")}</div>
      <button class="btn petrol" id="smGet">${L("Satzmuster holen", "Get patterns")}</button></div>` : ""}`;
  shell(L("Satzmuster", "Pattern drills"), body, { back: a0 ? L("Atom", "Atom") : L("Atome", "Atoms"), backTo: "aktiv", redraw: () => smHub(aid) });
  $("#back").onclick = () => a0 ? atomDetail(aid) : atomsHub();
  document.querySelectorAll("#smMd button").forEach(b => b.onclick = () => { if (b.disabled) return; DB.smMode = b.dataset.v; save(); document.querySelectorAll("#smMd button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
  const back = () => smHub(aid);
  const nx = $("#smNext"); if (nx) nx.onclick = () => smStartPattern(list[0].a.id, list[0].m.id, back);
  const mx = $("#smMix"); if (mx) mx.onclick = () => smStartMix(aid, back);
  document.querySelectorAll(".sm-row").forEach(b => b.onclick = () => smStartPattern(b.dataset.a, b.dataset.m, back));
  const mo = $("#smMore"); if (mo) mo.onclick = () => smFetch([aid], back);
  const g = $("#smGet"); if (g) g.onclick = () => smFetch(without.slice(0, 6).map(a => a.id), back);
}

/* =================================================================== GETTING PATTERNS FOR EXISTING ATOMS */
function smFetchPrompt(atoms) {
  const known = patsSorted().map(p => p.name).filter(Boolean).slice(0, 25);
  const P = ["Ich übe Deutsch (Ziel: flüssig auf B1) mit Satzmustern: Ein Teil des Satzes wechselt, und ich sage den ganzen Satz neu, mit der richtigen Form. Bitte mach aus meinen eigenen, schon korrigierten Sätzen unten Satzmuster.", ""];
  if (known.length) P.push("Meine bekannten Fehlermuster: " + known.join("; "), "");
  atoms.forEach((a, i) => {
    P.push(`TEXT ${i + 1}: ${a.t}`);
    a.sents.filter(x => !x.pend && plain(x.de).trim()).forEach((x, j) => P.push(`${j + 1}. ${plain(x.de)}`));
    if (a.pm && a.pm.length) P.push("(Diese Muster habe ich schon, bitte andere Stellen: " + a.pm.map(m => m.f).join(" / ") + ")");
    P.push("");
  });
  P.push("Regeln: " + SM_RULES.join(" "), "");
  P.push(`Schreib zuerst kurz auf Englisch, was jedes Muster übt. Schreib danach genau diesen Block, 2–3 Muster pro Text${atoms.length > 1 ? ", jeder Text mit seiner Nummer (TEXT 1, TEXT 2 …)" : ""}:`);
  P.push("SATZMUSTER:");
  if (atoms.length > 1) P.push("TEXT 1");
  SM_FORMAT.forEach(l => P.push(l));
  if (atoms.length > 1) P.push("TEXT 2", "(…)");
  return P.join("\n");
}
function smReadReply(raw, atoms) {
  const s = String(raw || "").replace(/\r/g, "").replace(/\*\*|__/g, "");
  const re = /^[ \t>#]*SATZMUSTER\b[ \t]*:?[ \t]*$/gim; let m, at = -1;
  while ((m = re.exec(s))) at = m.index + m[0].length;
  const list = smParse(at >= 0 ? s.slice(at) : s);
  const per = new Map();
  list.forEach(p => { const a = atoms.length === 1 ? atoms[0] : atoms[(p.tn || 0) - 1]; if (!a) return; if (!per.has(a)) per.set(a, []); per.get(a).push(p); });
  return per;
}
function smFetch(ids, back) {
  recStop(); atomsReady();
  const atoms = ids.map(atomById).filter(Boolean);
  if (!atoms.length) { back(); return; }
  const prompt = smFetchPrompt(atoms);
  const canShare = (() => { try { return !!navigator.share; } catch (e) { return false; } })();
  const body = `<p class="muted" style="margin-top:4px">${L("Claude macht aus deinen eigenen Sätzen Satzmuster, am liebsten an Stellen, an denen du Fehler machst.", "Claude turns your own sentences into patterns, preferably at the spots where you make mistakes.")}</p>
    <div class="hl"><span class="lab">${L("In dieser Anfrage", "In this request")}</span>${atoms.map(a => `<div style="font-weight:700">${esc(a.t)}</div>`).join("")}</div>
    <div class="cb">
    <div class="step"><span class="n">1</span><div class="b"><b>${L("An Claude senden", "Send to Claude")}</b>
      <div class="row2">${canShare ? `<button class="btn petrol" id="smShare">${L("Teilen", "Share")}</button>` : ""}<button class="btn ${canShare ? "ghost" : "petrol"}" id="smCopy">${L("Kopieren", "Copy")}</button></div></div></div>
    <div class="step"><span class="n">2</span><div class="b"><b>${L("Antwort einfügen", "Paste the reply")}</b>
      <textarea class="ta2" id="smPaste" placeholder="${L("Claudes ganze Antwort hier einfügen", "Paste Claude's whole reply here")}"></textarea>
      <button class="btn primary" id="smUse">${L("Muster übernehmen", "Use these patterns")}</button></div></div></div>`;
  shell(L("Satzmuster holen", "Get patterns"), body, { back: L("Zurück", "Back"), backTo: "aktiv" });
  $("#back").onclick = back;
  const cp = () => copyText(prompt, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy")));
  const sh = $("#smShare"); if (sh) sh.onclick = () => { if (!shareText(prompt)) cp(); };
  $("#smCopy").onclick = cp;
  $("#smUse").onclick = () => {
    const per = smReadReply($("#smPaste").value, atoms);
    let n = 0; per.forEach((list, a) => { const add = smStamp(list); a.pm = (a.pm || []).concat(add); n += add.length; });
    if (!n) { toast(L("Ich finde keine Muster. Bitte die ganze Antwort mit „SATZMUSTER:“ einfügen.", "I can't find any patterns. Please paste the whole reply with “SATZMUSTER:”.")); return; }
    save(); toast(L(`${n} Muster übernommen`, `${n} patterns added`)); back();
  };
}

/* =================================================================== THE DRILL */
let SM = null;
function smStartPattern(aid, mid, back) {
  const x = smFind(aid, mid); if (!x) { back(); return; }
  SM = { steps: shuffle(x.m.items.map((it, ii) => ({ aid, mid, ii }))), i: 0, res: [], back, one: { aid, mid } };
  smStep();
}
function smStartMix(aid, back) {
  const all = []; smAll(aid).forEach(x => x.m.items.forEach((it, ii) => all.push({ aid: x.a.id, mid: x.m.id, ii })));
  if (!all.length) { back(); return; }
  SM = { steps: shuffle(all).slice(0, 15), i: 0, res: [], back, one: null };
  smStep();
}
function smStep() {
  recStop();
  if (!SM) return;
  if (SM.i >= SM.steps.length) { smDone(); return; }
  const st = SM.steps[SM.i], x = smFind(st.aid, st.mid), it = x && x.m.items[st.ii];
  if (!it) { SM.i++; smStep(); return; }
  const mode = smMode(), r = SM.res[SM.i];
  const answer = mode === "say"
    ? `<button class="sm-mic" id="smMic">${AICON.mic}<span>${L("Sprechen", "Speak")}</span></button><div class="sm-heard" id="smHeard">${r ? esc(r.mine) : ""}</div>`
    : `<input class="tin" id="smIn" autocapitalize="sentences" autocomplete="off" spellcheck="false" placeholder="${L("Ganzer Satz …", "Whole sentence …")}" style="margin-top:14px;font-size:17px">
       <div class="uml">${["ä", "ö", "ü", "ß"].map(c => `<button type="button" data-c="${c}">${c}</button>`).join("")}</div>
       <button class="btn primary" id="smChk">${L("Prüfen", "Check")}</button>`;
  const body = `<div class="cnt muted small" style="text-align:center;font-weight:700">${SM.i + 1} ${L("von", "of")} ${SM.steps.length}</div>
    <div class="sm-model"><span class="lab">${L("Muster", "Pattern")}</span><div class="f">${slotHtml(x.m.f)}</div>${x.m.en ? `<div class="en">${esc(x.m.en)}</div>` : ""}${x.m.note ? `<div class="note">${esc(x.m.note)}</div>` : ""}</div>
    <div class="sm-cue"><div class="lab">${L("Neu einsetzen", "Swap in")}</div><div class="w">${esc(it.cue)}</div></div>
    <div id="smAns">${r ? "" : answer}</div>
    ${r ? "" : `<button class="btn ghost" id="smShow" style="margin-top:8px">${L("Lösung zeigen", "Show the answer")}</button>`}
    <div class="seg" id="smMd" style="margin-top:16px"><button data-v="say" aria-pressed="${mode === "say"}" ${SRC ? "" : "disabled"}>${L("Sprechen", "Speak")}</button><button data-v="type" aria-pressed="${mode === "type"}">${L("Tippen", "Type")}</button></div>
    <div id="smFb"></div>`;
  shell(SM.one ? L("Satzmuster", "Pattern drill") : L("Satzmuster gemischt", "Mixed patterns"), body, { back: L("Zurück", "Back"), backTo: "aktiv", redraw: smStep });
  $("#back").onclick = () => { recStop(); const b = SM.back; SM = null; b(); };
  document.querySelectorAll("#smMd button").forEach(b => b.onclick = () => { if (b.disabled || SM.res[SM.i]) return; DB.smMode = b.dataset.v; save(); smStep(); });
  if (r) { smFeedback(it, r); return; }
  const check = (mine, shown) => {
    recStop();
    const ok = !shown && dNorm(mine) === dNorm(it.de);
    SM.res[SM.i] = { ok, mine: mine || "", shown: !!shown, aid: st.aid, mid: st.mid, ii: st.ii };
    smStep();
  };
  $("#smShow").onclick = () => check("", true);
  if (mode === "say") {
    const mic = $("#smMic"), heard = $("#smHeard");
    let got = "";
    const setOn = on => { if (!mic.isConnected) return; mic.classList.toggle("on", on); mic.innerHTML = (on ? AICON.stop : AICON.mic) + `<span>${on ? L("Stopp", "Stop") : L("Sprechen", "Speak")}</span>`; };
    mic.onclick = () => {
      if (REC.on) { recStop(); if (got) check(got); return; }
      got = ""; heard.textContent = "";
      recStart({
        final: t => { if (!t || !heard.isConnected) return; got = (got ? got + " " : "") + t; heard.textContent = got; check(got); },
        interim: t => { if (heard.isConnected && t) heard.textContent = (got ? got + " " : "") + t; },
        state: (on, m) => { setOn(on); if (m && heard.isConnected) heard.textContent = m; }
      });
    };
  } else {
    const inp = $("#smIn");
    setTimeout(() => { try { inp.focus(); } catch (e) { } }, 50);
    document.querySelectorAll(".uml [data-c]").forEach(b => b.onclick = () => { const p = inp.selectionStart ?? inp.value.length; inp.value = inp.value.slice(0, p) + b.dataset.c + inp.value.slice(inp.selectionEnd ?? p); inp.focus(); try { inp.setSelectionRange(p + 1, p + 1); } catch (e) { } });
    const go = () => { const v = inp.value.trim(); if (!v) { toast(L("Schreib zuerst den ganzen Satz.", "Type the whole sentence first.")); return; } check(v); };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); go(); } });
    $("#smChk").onclick = go;
  }
}
function smFeedback(it, r) {
  const fb = $("#smFb");
  fb.innerHTML = `<div class="fb ${r.ok ? "good" : r.shown ? "" : "bad"}"><b>${r.ok ? L("Richtig!", "Right!") : r.shown ? L("Die Lösung:", "The answer:") : L("Nicht ganz.", "Not quite.")}</b>
    ${!r.ok && !r.shown && r.mine ? `<div class="diff" style="margin-top:6px;font-size:16px;line-height:1.6">${diffHtml(r.mine, it.de)}</div>` : ""}
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:6px;font-size:18px;font-weight:700"><span>${esc(it.de)}</span>${TTS ? `<button class="spk" data-say="${esc(it.de)}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>
    ${it.en ? `<div class="muted" style="margin-top:2px">${esc(it.en)}</div>` : ""}</div>
    ${!r.ok && !r.shown ? `<button class="btn ghost" id="smOk" style="margin-top:8px">${L("Ich hatte es richtig (Spracherkennung / Tippfehler)", "I had it right (speech recognition / typo)")}</button>` : ""}
    <button class="btn primary" id="smNx">${SM.i + 1 < SM.steps.length ? L("Weiter", "Next") : L("Fertig", "Finish")}</button>`;
  if (TTS && DB.autoSay !== false) say(it.de);
  const ok = $("#smOk"); if (ok) ok.onclick = () => { r.ok = true; r.fixed = true; smStep(); };
  $("#smNx").onclick = () => { SM.i++; smStep(); window.scrollTo(0, 0); };
  fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function smDone() {
  const s = SM, res = s.res.filter(Boolean), right = res.filter(r => r.ok).length;
  // per pattern: rounds played and share right this round
  const by = new Map(); res.forEach(r => { const k = r.aid + "|" + r.mid; if (!by.has(k)) by.set(k, []); by.get(k).push(r); });
  by.forEach((rs, k) => { const [aid, mid] = k.split("|"); const x = smFind(aid, mid); if (!x) return; x.m.n = (x.m.n || 0) + 1; x.m.last = rs.filter(r => r.ok).length / rs.length; x.m.d = today(); });
  save();
  const wrong = res.filter(r => !r.ok);
  const missHtml = wrong.map(r => { const x = smFind(r.aid, r.mid), it = x && x.m.items[r.ii]; return it ? `<div class="sm-miss"><div class="c">${esc(it.cue)}</div><b>${esc(it.de)}</b></div>` : ""; }).join("");
  const nextUp = smSorted().find(x => !s.one || x.m.id !== s.one.mid);
  const body = `<div class="result"><div class="pct">${right}/${res.length}</div><div class="lbl">${L("richtig", "right")}</div></div>
    ${missHtml ? `<div class="hl"><span class="lab">${L("Nochmal ansehen", "Look again")}</span>${missHtml}</div>` : ""}
    ${wrong.length ? `<button class="btn primary" id="smAgain">${L(`Fehler nochmal (${wrong.length})`, `Mistakes again (${wrong.length})`)}</button>` : ""}
    ${s.one ? `<button class="btn ${wrong.length ? "ghost" : "primary"}" id="smRe">${L("Dieses Muster nochmal", "This pattern again")}</button>` : `<button class="btn ${wrong.length ? "ghost" : "primary"}" id="smRe">${L("Neue gemischte Runde", "New mixed round")}</button>`}
    ${s.one && nextUp ? `<button class="btn petrol" id="smNextP" style="margin-top:8px">${L("Nächstes Muster", "Next pattern")}</button>` : ""}
    <button class="btn ghost" id="smBack" style="margin-top:8px">${L("Zu den Satzmustern", "Back to patterns")}</button>
    ${s.one ? `<button class="btn ghost" id="smDel" style="margin-top:8px">${L("Dieses Muster löschen", "Delete this pattern")}</button>` : ""}`;
  SM = null;
  shell(L("Geschafft", "Done"), body, { back: L("Muster", "Patterns"), backTo: "aktiv" });
  $("#back").onclick = s.back;
  const ag = $("#smAgain"); if (ag) ag.onclick = () => { SM = { steps: shuffle(wrong.map(r => ({ aid: r.aid, mid: r.mid, ii: r.ii }))), i: 0, res: [], back: s.back, one: s.one }; smStep(); };
  $("#smRe").onclick = () => { SM = { steps: shuffle(s.steps.slice()), i: 0, res: [], back: s.back, one: s.one }; smStep(); };
  const np = $("#smNextP"); if (np) np.onclick = () => smStartPattern(nextUp.a.id, nextUp.m.id, s.back);
  $("#smBack").onclick = s.back;
  const del = $("#smDel"); let armed = false;
  if (del) del.onclick = () => {
    if (!armed) { armed = true; del.textContent = L("Nochmal tippen zum Löschen", "Tap again to delete"); del.classList.add("bad"); return; }
    const x = smFind(s.one.aid, s.one.mid); if (x) { x.a.pm = x.a.pm.filter(m => m.id !== s.one.mid); save(); }
    toast(L("Gelöscht", "Deleted")); s.back();
  };
}
