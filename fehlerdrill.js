/* Fehler-Drill: drill a mistake pattern with fresh sentences, not just the few atom sentences that contain it.
   Loaded after atome.js and fehlerdrill-data.js.

   Sources for one pattern (DB.pats[id]):
   - your own atom sentences with that pattern (translate, word order)
   - built-in: the grammar trainer's rules (grammatik/rules.js, loaded on demand) linked to the pattern,
     automatically by its name (FD_MATCH) or chosen by hand (p.rules), plus FD_EXTRA
   - from Claude: p.bank = [{ t: "tr"|"uf"|"fx", ... }] added with a copy-paste request
   A round has 10 drills of four kinds: tr (English → German), uf (transform), fx (fix the mistake), sb (word order).
   Free practice: every answer counts for the pattern's last-12 bar, atom boxes never change.
   p.ds[key] = { n, f, e } per drill: times seen, times wrong, day rated Easy. */

(function addFdStyles() {
  const css = `
  .fd-card{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:14px 16px;margin-top:10px}
  .fd-card .lab{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px}
  .fd-card .big{font-size:20px;font-weight:700;line-height:1.45}
  .fd-card .en{color:var(--muted);font-size:14px;margin-top:4px}
  .fd-card .task{margin-top:8px;font-weight:800;color:var(--petrol-soft)}
  .fd-wrong{text-decoration:underline wavy var(--bad);text-decoration-thickness:1.5px;text-underline-offset:5px}
  .fd-pat{font-size:12.5px;font-weight:800;color:var(--muted);text-align:center;margin-top:2px}
  .fd-rate{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
  .fd-rate button{padding:14px 6px;border-radius:var(--r-md);font-weight:800;font-size:15.5px;border:2px solid var(--line);background:var(--surface)}
  .fd-rate button small{display:block;font-weight:600;font-size:11.5px;color:var(--muted);margin-top:2px}
  .fd-rate .a{border-color:var(--bad)} .fd-rate .o{border-color:var(--amber)} .fd-rate .e{border-color:var(--good)}
  .fd-why{font-size:14px;margin-top:6px;color:var(--ink)}
  .fd-src{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 2px}
  .fd-src span{background:var(--bg);border-radius:99px;padding:4px 10px;font-size:12.5px;font-weight:700}
  .fd-rules .chip{margin:0 6px 6px 0}
  .fd-rules .chips{flex-wrap:wrap;overflow:visible}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

const FD_N = 10;
const FD_KINDS = { tr: ["Übersetzen", "Translate"], uf: ["Umformen", "Transform"], fx: ["Fehler finden", "Fix the mistake"], sb: ["Satzbau", "Word order"] };

/* ---------- built-in rules: loaded from the grammar trainer when first needed ---------- */
let FD_RULES = null, fdLoading = null;
function fdLoad(cb) {
  if (FD_RULES) { cb(); return; }
  if (!fdLoading) fdLoading = new Promise(res => {
    const need = [];
    if (typeof RULES_B1 === "undefined") need.push("grammatik/rules.js");
    if (typeof SHK_ITEMS === "undefined") need.push("grammatik/shk-items.js");
    let left = need.length, bad = false;
    const fin = () => {
      let list = [];
      try { list = [].concat(RULES_A1.map(r => Object.assign({ level: "A1" }, r)), RULES.map(r => Object.assign({ level: "A2" }, r)), RULES_B1.map(r => Object.assign({ level: "B1" }, r))); } catch (e) { bad = true; }
      list = list.concat(FD_EXTRA);
      if (!bad) FD_RULES = list; // offline without a saved copy: try again next time
      fdLoading = null; res(list);
    };
    if (!left) { fin(); return; }
    need.forEach(src => { const s = document.createElement("script"); s.src = src; s.onload = s.onerror = e => { if (e.type === "error") bad = true; if (--left === 0) fin(); }; document.head.appendChild(s); });
  });
  fdLoading.then(list => { if (!FD_RULES) FD_RULES_TMP = list; cb(); });
}
let FD_RULES_TMP = [];
function fdRuleList() { return FD_RULES || FD_RULES_TMP || FD_EXTRA; }
function fdRule(id) { return fdRuleList().find(r => r.id === id); }
function fdRuleTitle(r) { return EN() && r.en ? r.en : r.title; }

function fdAutoRules(pid) {
  const p = DB.pats[pid]; if (!p) return [];
  const t = (String(p.name || "") + " " + String(p.en || "")).toLowerCase();
  let ids = FD_MATCH.filter(([id, re]) => re.test(t)).map(x => x[0]);
  if (ids.includes("x-indirekt")) ids = ids.filter(x => x !== "a1-fragen");
  return ids.slice(0, 3);
}
function fdRulesFor(pid) { const p = DB.pats[pid]; return p && Array.isArray(p.rules) ? p.rules.slice() : fdAutoRules(pid); }

/* ---------- turning sources into drills ---------- */
// a drill: { key, kind, de (answer, may hold [marks]), alts, en, q, task, wrong, toks, why, src, base }
const fdPlain = s => String(s || "").replace(/[\[\]]/g, "").replace(/\s+,/g, ",").replace(/\s+/g, " ").trim();
const fdCap = s => String(s).replace(/^(\[?)([a-zäöü])/, (m, b, c) => b + c.toUpperCase());
const fdEnd = en => /\?\s*$/.test(String(en || "")) ? "?" : ".";
// the first word is shown in lower case (so it doesn't give the start away), unless it must stay capitalised
const FD_LOWER = /^(ich|du|er|sie|es|wir|ihr|man|der|die|das|den|dem|des|ein|eine|einen|einem|einer|kein|keine|mein|meine|meinen|dein|deine|sein|seine|unser|unsere|am|im|um|in|an|auf|mit|nach|seit|bei|von|zu|zum|zur|für|heute|morgen|gestern|jetzt|dann|hier|dort|da|leider|vielleicht|wann|wo|woher|wohin|was|wie|warum|wer|wen|wem|welche|welcher|welches|kannst|können|könnten|haben|hast|hat|ist|bist|sind|gibt|weißt|wissen|wenn|weil|obwohl|als|dass|ob|bitte|morgens|abends|zuerst|danach|deshalb|trotzdem|außerdem|normalerweise|oft|immer|nie|manchmal)$/i;
function fdToks(s, cap, trainer) {
  const t = String(s).split(/\s+/).filter(Boolean);
  if (t.length && !cap && (trainer || FD_LOWER.test(t[0].replace(/[.,!?]/g, "")))) t[0] = t[0].charAt(0).toLowerCase() + t[0].slice(1);
  return t;
}
function fdFromRule(r) {
  const out = [];
  const items = r.items.map((it, i) => ({ it, k: i })).concat(DB.shk && typeof SHK_ITEMS !== "undefined" ? (SHK_ITEMS[r.id] || []).map((it, i) => ({ it, k: "s" + i })) : []);
  items.forEach(({ it, k }) => {
    if (it.shk && !DB.shk) return;
    const key = "r|" + r.id + "|" + k, why = it.why || "", en = it.en || "", src = "rule";
    const add = (kind, o) => { const d = Object.assign({ key: key + "|" + kind, kind, en, why, src, rid: r.id }, o); d.base = dNorm(fdPlain(d.de)); out.push(d); };
    if (it.t === "gap") {
      const full = fdCap(it.q.replace("___", `[${it.a[0]}]`));
      add("tr", { de: full, alts: it.a.slice(1).map(x => fdCap(it.q.replace("___", x))) });
      if (fdPlain(full).split(" ").length >= 4) add("sb", { de: full, toks: fdToks(fdPlain(full)) });
    } else if (it.t === "mc") {
      let full, wrong;
      if (it.q.includes("___")) { full = fdCap(it.q.replace("___", `[${it.o[0]}]`)); wrong = fdCap(it.q.replace("___", it.o[1])); }
      else if (/…\s*$/.test(it.q)) { const e = fdEnd(en); full = it.q.replace(/…\s*$/, `[${it.o[0]}]`) + e; wrong = it.q.replace(/…\s*$/, it.o[1]) + e; }
      else { full = it.o[0]; wrong = it.o[1]; }
      add("tr", { de: full });
      if (wrong && dNorm(wrong) !== dNorm(fdPlain(full))) add("fx", { de: full, wrong: fdPlain(wrong) });
    } else if (it.t === "sb") {
      const full = fdPlain(it.s);
      add("sb", { de: full, alts: (it.alt || []).map(fdPlain), toks: fdToks(it.s, it.cap, true) });
      add("tr", { de: full, alts: (it.alt || []).map(fdPlain) });
    } else if (it.t === "uf") {
      add("uf", { de: it.a[0], alts: it.a.slice(1), q: it.q, task: it.task });
      add("tr", { de: it.a[0], alts: it.a.slice(1) });
    }
  });
  return out;
}
function fdFromBank(p) {
  const out = [];
  (p.bank || []).forEach((b, i) => {
    const key = "c|" + (b.id || i), src = "claude";
    const add = (kind, o) => { const d = Object.assign({ key: key + "|" + kind, kind, en: b.en || "", src }, o); d.base = dNorm(fdPlain(d.de)); out.push(d); };
    if (b.t === "tr") { add("tr", { de: b.de }); if (fdPlain(b.de).split(" ").length >= 4) add("sb", { de: b.de, toks: fdToks(fdPlain(b.de)) }); }
    else if (b.t === "uf") { add("uf", { de: b.de, q: b.q, task: b.task }); add("tr", { de: b.de }); }
    else if (b.t === "fx") { add("fx", { de: b.de, wrong: b.wrong }); add("tr", { de: b.de }); }
  });
  return out;
}
function fdFromOwn(pid) {
  const out = [];
  patSentences(pid).forEach(({ a, si }) => {
    const s = a.sents[si]; if (!s || s.pend || !plain(s.de).trim()) return;
    const key = "o|" + a.id + "|" + si, base = dNorm(plain(s.de)), why = L(`Dein Satz aus „${a.t}“`, `Your sentence from “${a.t}”`);
    if (s.en) out.push({ key: key + "|tr", kind: "tr", de: s.de, en: s.en, why, src: "own", base });
    if (plain(s.de).split(/\s+/).length >= 4) out.push({ key: key + "|sb", kind: "sb", de: s.de, en: s.en || "", toks: fdToks(plain(s.de)), why, src: "own", base });
  });
  return out;
}
function fdPool(pid) {
  const p = DB.pats[pid]; if (!p) return [];
  return fdFromOwn(pid).concat(fdFromBank(p), fdRulesFor(pid).map(fdRule).filter(Boolean).flatMap(fdFromRule));
}
function fdCounts(pid) {
  const p = DB.pats[pid], own = new Set(), rule = new Set(), cl = new Set();
  fdPool(pid).forEach(d => (d.src === "own" ? own : d.src === "claude" ? cl : rule).add(d.base));
  return { own: own.size, rule: rule.size, claude: cl.size, all: own.size + rule.size + cl.size, bank: (p && p.bank || []).length };
}

/* a round: about 3 translate, 2 transform, 3 fix, 2 word order; your own sentences and past mistakes first, Easy ones rarely */
function fdPick(pid, n) {
  const p = DB.pats[pid], ds = p.ds || {}, pool = fdPool(pid), td = today();
  const score = d => {
    const s = ds[d.key] || {};
    let v = Math.random();
    if (d.src === "own") v += 0.7;
    if (d.src === "claude") v += 0.35;
    if (!s.n) v += 0.25;
    v += Math.min(3, s.f || 0) * 0.35;
    if (s.e && daysBetweenFd(s.e, td) < 14) v -= 1.2;
    return v;
  };
  const by = {}; pool.forEach(d => { (by[d.kind] = by[d.kind] || []).push(Object.assign({ sc: score(d) }, d)); });
  Object.values(by).forEach(l => l.sort((a, b) => b.sc - a.sc));
  const want = { tr: 3, uf: 2, fx: 3, sb: 2 }, seen = new Set(), out = [];
  const take = kind => { const l = by[kind] || []; while (l.length) { const d = l.shift(); if (seen.has(d.base)) continue; seen.add(d.base); out.push(d); return true; } return false; };
  Object.keys(want).forEach(k => { for (let i = 0; i < want[k]; i++) take(k); });
  let guard = 50; while (out.length < n && guard--) { if (!["fx", "tr", "uf", "sb"].some(take)) break; }
  return shuffle(out.slice(0, n));
}
function daysBetweenFd(a, b) { try { return Math.round((new Date(b) - new Date(a)) / 864e5); } catch (e) { return 99; } }

/* ---------- highlighting the part the pattern is about ---------- */
function fdKeyOf(w) { return w.toLowerCase().replace(/[.,!?;:"„“'()«»…–-]/g, "").replace(/ß/g, "ss"); }
// words of `target` that are not in `other` (by longest common subsequence) get marked
function fdMarkDiff(target, other) {
  const A = target.split(/\s+/).filter(Boolean), B = String(other || "").split(/\s+/).filter(Boolean), n = A.length, m = B.length;
  if (!m || n * m > 40000) return esc(target);
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = fdKeyOf(A[i]) === fdKeyOf(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const keep = new Array(n).fill(false); let i = 0, j = 0;
  while (i < n && j < m) { if (fdKeyOf(A[i]) === fdKeyOf(B[j])) { keep[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  return A.map((w, k) => keep[k] ? esc(w) : `<mark class="slot">${esc(w)}</mark>`).join(" ").replace(/<\/mark> <mark class="slot">/g, " ");
}
function fdAnswerHtml(d) {
  if (/\[[^\]]+\]/.test(d.de)) return esc(d.de.replace(/\s+,/g, ",")).replace(/\[([^\]]+)\]/g, (m, x) => `<mark class="slot">${x}</mark>`);
  if (d.kind === "fx" && d.wrong) return fdMarkDiff(fdPlain(d.de), d.wrong);
  if (d.kind === "uf" && d.q) return fdMarkDiff(fdPlain(d.de), d.q);
  return esc(fdPlain(d.de));
}

/* =================================================================== THE ROUND */
let FD = null;
function fdStart(pid, back) {
  recStop(); atomsReady();
  if (!DB.pats[pid]) { back(); return; }
  fdLoad(() => {
    const steps = fdPick(pid, FD_N);
    if (!steps.length) { toast(L("Für dieses Muster gibt es noch keine Übungen. Verknüpfe eine Grammatikregel oder hol Sätze von Claude.", "No drills for this pattern yet. Link a grammar rule or get sentences from Claude.")); patDetail(pid); return; }
    FD = { pid, steps, i: 0, res: [], back, again: new Set() };
    fdStep();
  });
}
function fdStep() {
  recStop();
  if (!FD) return;
  if (FD.i >= FD.steps.length) { fdDone(); return; }
  const d = FD.steps[FD.i], r = FD.res[FD.i];
  let card = "";
  if (d.kind === "tr") card = `<div class="fd-card"><span class="lab">${L("Sag es auf Deutsch", "Say it in German")}</span><div class="big">${esc(d.en)}</div></div>`;
  else if (d.kind === "uf") card = `<div class="fd-card"><span class="lab">${L("Forme um", "Rewrite")}</span><div class="big">${esc(d.q)}</div><div class="task">${esc(EN() && typeof TASK_EN !== "undefined" ? fdTaskEn(d.task) : d.task)}</div></div>`;
  else if (d.kind === "fx") card = `<div class="fd-card"><span class="lab">${L("In diesem Satz steckt dein Fehler", "This sentence has your mistake")}</span><div class="big"><span class="fd-wrong">${esc(d.wrong)}</span></div>${d.en ? `<div class="en">${esc(d.en)}</div>` : ""}<div class="task">${L("Sag oder tipp den Satz richtig.", "Say or type the sentence correctly.")}</div></div>`;
  else card = `<div class="fd-card"><span class="lab">${L("Bring die Wörter in die richtige Reihenfolge", "Put the words in the right order")}</span>${d.en ? `<div class="big" style="font-size:17px">${esc(d.en)}</div>` : ""}</div>`;
  let ans = "";
  if (!r) {
    if (d.kind === "sb") {
      if (!d.pool) { d.pool = shuffleSeeded(d.toks, d.key + FD.i); d.pick = []; }
      ans = `<div class="tokens ans dr-ans" id="fdAns">${d.pick.map((pi, j) => `<button class="tok" data-a="${j}">${esc(d.pool[pi])}</button>`).join("")}</div>
        <div class="tokens dr-pool">${d.pool.map((w, pi) => `<button class="tok ${d.pick.includes(pi) ? "used" : ""}" data-p="${pi}">${esc(w)}</button>`).join("")}</div>
        <button class="btn primary" id="fdChk" ${d.pick.length === d.pool.length ? "" : "disabled"}>${L("Prüfen", "Check")}</button>`;
    } else {
      ans = `${inputBox("fd", { rows: 2, draft: false, value: d.att || "", ph: L("Ganzer Satz auf Deutsch …", "Whole sentence in German …") })}
        <button class="btn primary" id="fdChk">${L("Prüfen", "Check")}</button>`;
    }
    ans += `<button class="btn ghost" id="fdShow" style="margin-top:8px">${L("Lösung zeigen", "Show the answer")}</button>`;
  }
  const p = DB.pats[FD.pid];
  const body = `<div class="cnt muted small" style="text-align:center;font-weight:700">${FD.i + 1} ${L("von", "of")} ${FD.steps.length} · <span class="dr-type">${esc(T(FD_KINDS[d.kind]))}</span></div>
    <div class="fd-pat">${esc(patLabel(FD.pid) || (p && p.name) || "")}</div>
    ${card}<div id="fdA">${ans}</div><div id="fdFb"></div>`;
  shell(L("Fehler-Drill", "Mistake drill"), body, { back: L("Zurück", "Back"), backTo: "aktiv", redraw: fdStep });
  $("#back").onclick = () => { recStop(); const b = FD.back; FD = null; b(); };
  if (r) { fdFeedback(d, r); return; }
  const answers = [fdPlain(d.de)].concat((d.alts || []).map(fdPlain));
  const check = (mine, shown) => {
    recStop();
    const ok = !shown && answers.some(a => dNorm(a) === dNorm(mine));
    FD.res[FD.i] = { ok, mine: mine || "", shown: !!shown };
    fdStep();
  };
  $("#fdShow").onclick = () => check("", true);
  if (d.kind === "sb") {
    document.querySelectorAll("#fdA [data-p]").forEach(b => b.onclick = () => { const pi = +b.dataset.p; if (d.pick.includes(pi)) return; d.pick.push(pi); fdStep(); });
    document.querySelectorAll("#fdA [data-a]").forEach(b => b.onclick = () => { d.pick.splice(+b.dataset.a, 1); fdStep(); });
    const c = $("#fdChk"); c.onclick = () => { if (c.disabled) return; check(d.pick.map(pi => d.pool[pi]).join(" ")); };
  } else {
    const ta = bindInput("fd", { draft: false, onInput: v => { d.att = v; } });
    setTimeout(() => { try { if (!SRC) ta.focus(); } catch (e) { } }, 50);
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#fdChk").click(); } });
    $("#fdChk").onclick = () => { const v = (ta.value || "").trim(); if (!v) { toast(L("Sag oder tipp zuerst den Satz.", "Say or type the sentence first.")); return; } check(v); };
  }
}
function fdTaskEn(t) { for (const [re, out] of TASK_EN) if (re.test(t)) return t.replace(re, out); return t; }
function fdFeedback(d, r) {
  const target = fdPlain(d.de), last = FD.i + 1 >= FD.steps.length;
  const head = r.ok ? L("Richtig!", "Right!") : r.shown ? L("Die Lösung:", "The answer:") : L("Nicht ganz.", "Not quite.");
  $("#fdFb").innerHTML = `<div class="fb ${r.ok ? "good" : r.shown ? "" : "bad"}"><b>${head}</b>
    ${!r.ok && !r.shown && r.mine ? `<div class="diff" style="margin-top:6px;font-size:16px;line-height:1.6">${diffHtml(r.mine, target)}</div>` : ""}
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:8px;font-size:18px;font-weight:700;line-height:1.5"><span>${fdAnswerHtml(d)}</span>${TTS ? `<button class="spk" data-say="${esc(target)}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}</div>
    ${d.en && d.kind !== "tr" && d.kind !== "sb" ? `<div class="muted" style="margin-top:2px">${esc(d.en)}</div>` : ""}
    ${d.why ? `<div class="fd-why">${esc(d.why)}</div>` : ""}</div>
    ${r.ok ? `<div class="fd-rate"><button class="a" data-rt="1">${L("Nochmal", "Again")}<small>${L("kommt gleich wieder", "comes back soon")}</small></button><button class="o" data-rt="2">${L("Okay", "OK")}<small>${L("mit Mühe", "took effort")}</small></button><button class="e" data-rt="3">${L("Leicht", "Easy")}<small>${L("seltener", "less often")}</small></button></div>`
      : `${!r.shown ? `<button class="btn ghost" id="fdOk" style="margin-top:8px">${L("Ich hatte es richtig (Spracherkennung / Tippfehler)", "I had it right (speech recognition / typo)")}</button>` : ""}
         <button class="btn primary" id="fdNx">${last && !fdWillRepeat(d) ? L("Fertig", "Finish") : L("Weiter", "Next")}</button>`}`;
  if (TTS && DB.autoSay !== false) say(target);
  const ok = $("#fdOk"); if (ok) ok.onclick = () => { r.ok = true; r.fixed = true; fdStep(); };
  document.querySelectorAll("[data-rt]").forEach(b => b.onclick = () => fdRate(d, r, +b.dataset.rt));
  const nx = $("#fdNx"); if (nx) nx.onclick = () => fdRate(d, r, 0);
  $("#fdFb").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function fdWillRepeat(d) { return !FD.again.has(d.key) && FD.steps.length < FD_N + 5; }
// rt: 0 = wrong, 1 Again, 2 OK, 3 Easy
function fdRate(d, r, rt) {
  const p = DB.pats[FD.pid]; if (!p) { FD = null; patsHub(); return; }
  p.ds = p.ds || {};
  const s = p.ds[d.key] || (p.ds[d.key] = { n: 0, f: 0 });
  s.n++;
  if (!rt) s.f++;
  if (rt === 3) s.e = today(); else if (s.e && rt !== 2) delete s.e;
  patEvent(FD.pid, !rt ? "fail" : rt === 1 ? "hint" : "ok");
  r.rt = rt;
  // wrong or Again: it comes back once at the end of the round
  if ((rt === 0 || rt === 1) && fdWillRepeat(d)) { FD.again.add(d.key); const c = Object.assign({}, d); delete c.pool; delete c.pick; delete c.att; FD.steps.push(c); }
  const keys = Object.keys(p.ds); if (keys.length > 400) keys.sort((a, b) => (p.ds[a].n || 0) - (p.ds[b].n || 0)).slice(0, keys.length - 400).forEach(k => delete p.ds[k]);
  save();
  FD.i++; fdStep(); window.scrollTo(0, 0);
}
function fdDone() {
  const s = FD; FD = null;
  const res = s.res.filter(Boolean), first = new Map();
  s.steps.forEach((d, i) => { if (s.res[i] && !first.has(d.key)) first.set(d.key, { d, r: s.res[i] }); });
  const firsts = [...first.values()], right = firsts.filter(x => x.r.ok).length;
  const miss = firsts.filter(x => !x.r.ok || x.r.rt === 1);
  const st = patStats(s.pid);
  const missHtml = miss.map(x => `<div class="sm-miss"><div class="c">${esc(T(FD_KINDS[x.d.kind]))}</div><b>${fdAnswerHtml(x.d)}</b></div>`).join("");
  const body = `<div class="result"><div class="pct">${right}/${firsts.length}</div><div class="lbl">${L("beim ersten Versuch richtig", "right first time")}</div></div>
    <div class="hl"><span class="lab">${esc(patLabel(s.pid))} · ${L("letzte 12 Versuche", "last 12 attempts")}</span>${patBar(st)}<div class="sub muted small" style="margin-top:6px">${patLine(st)}</div></div>
    ${missHtml ? `<div class="hl"><span class="lab">${L("Nochmal ansehen", "Look again")}</span>${missHtml}</div>` : ""}
    <button class="btn primary" id="fdRe">${L("Neue Runde", "New round")}</button>
    <button class="btn petrol" id="fdPat" style="margin-top:8px">${L("Zum Muster", "Go to the pattern")}</button>
    <button class="btn ghost" id="fdBack" style="margin-top:8px">${L("Zurück", "Back")}</button>`;
  shell(L("Geschafft", "Done"), body, { back: L("Zurück", "Back"), backTo: "aktiv" });
  $("#back").onclick = s.back;
  $("#fdRe").onclick = () => fdStart(s.pid, s.back);
  $("#fdPat").onclick = () => patDetail(s.pid);
  $("#fdBack").onclick = s.back;
}

/* =================================================================== ON THE PATTERN PAGE */
function fdPatBlock(host, pid) {
  if (!host) return;
  host.innerHTML = `<p class="muted small">${L("Übungen werden geladen …", "Loading drills …")}</p>`;
  fdLoad(() => {
    if (!host.isConnected) return;
    const p = DB.pats[pid]; if (!p) return;
    const c = fdCounts(pid), rules = fdRulesFor(pid).map(fdRule).filter(Boolean), manual = Array.isArray(p.rules);
    const lv = ["A1", "A2", "B1"];
    host.innerHTML = `<button class="btn primary" id="fdGo" ${c.all ? "" : "disabled"}>${L(`Fehler-Drill (${Math.min(FD_N, c.all)} Übungen)`, `Mistake drill (${Math.min(FD_N, c.all)} drills)`)}</button>
      <div class="fd-src"><span>${L(`${c.own} eigene`, `${c.own} of yours`)}</span><span>${L(`${c.rule} eingebaut`, `${c.rule} built-in`)}</span><span>${L(`${c.claude} von Claude`, `${c.claude} from Claude`)}</span></div>
      <p class="muted small" style="margin-top:4px">${L("Neue Sätze mit derselben Regel: übersetzen, umformen, deinen Fehler finden, Satzbau. Freies Üben: zählt für dein Muster, ändert aber nicht die Boxen deiner Atome.", "Fresh sentences with the same rule: translate, transform, fix your mistake, word order. Free practice: it counts for the pattern but doesn't change your atoms' boxes.")}</p>
      <button class="btn petrol" id="fdMore">${L("Mehr Sätze von Claude holen", "Get more sentences from Claude")}</button>
      <details class="fold fd-rules"${rules.length ? "" : " open"}><summary>${L("Grammatikregeln", "Grammar rules")}: ${rules.length ? esc(rules.map(fdRuleTitle).join(" · ")) : L("keine verknüpft", "none linked")}</summary><div class="in">
        <p class="muted small" style="margin-top:0">${manual ? L("Von dir gewählt.", "Chosen by you.") : L("Automatisch nach dem Namen des Musters gewählt.", "Picked automatically from the pattern's name.")} ${L("Tippe Regeln an, deren eingebaute Sätze in den Drill kommen sollen.", "Tap the rules whose built-in sentences should go into the drill.")}</p>
        ${lv.map(l => `<div class="h2">${l}</div><div class="chips">${fdRuleList().filter(r => r.level === l).map(r => `<button class="chip" data-rl="${r.id}" aria-pressed="${rules.some(x => x.id === r.id)}">${esc(fdRuleTitle(r))}</button>`).join("")}</div>`).join("")}
        ${manual ? `<button class="btn ghost" id="fdAuto">${L("Wieder automatisch", "Back to automatic")}</button>` : ""}</div></details>`;
    $("#fdGo").onclick = () => fdStart(pid, () => patDetail(pid));
    $("#fdMore").onclick = () => fdFetch(pid, () => patDetail(pid));
    host.querySelectorAll("[data-rl]").forEach(b => b.onclick = () => {
      const id = b.dataset.rl; let cur = fdRulesFor(pid);
      cur = cur.includes(id) ? cur.filter(x => x !== id) : cur.concat(id);
      p.rules = cur; save(); fdPatBlock(host, pid); const d = host.querySelector("details"); if (d) d.open = true;
    });
    const au = $("#fdAuto"); if (au) au.onclick = () => { delete p.rules; save(); fdPatBlock(host, pid); };
  });
}

/* =================================================================== MORE SENTENCES FROM CLAUDE */
function fdPrompt(pid) {
  const p = DB.pats[pid], own = patSentences(pid).map(({ a, si }) => a.sents[si]).filter(s => s && !s.pend);
  const P = [`Ich übe Deutsch (Ziel: flüssig auf B1). Diesen Fehler mache ich immer wieder: „${p.name}“${p.en ? ` (${p.en})` : ""}. Bitte schreib mir neue Übungssätze genau für dieses Muster.`, ""];
  if (own.length) { P.push("Meine eigenen Sätze mit diesem Muster (die korrigierten Stellen stehen in [eckigen Klammern]):"); own.slice(0, 12).forEach((s, i) => P.push(`${i + 1}. ${s.de}`)); P.push(""); }
  if (shkLine()) P.push(shkLine() + " Etwa die Hälfte der Sätze soll aus diesem Bereich kommen.", "");
  const have = (p.bank || []).map(b => fdPlain(b.de)).slice(-24);
  if (have.length) P.push("Diese Sätze habe ich schon, bitte andere: " + have.join(" / "), "");
  P.push("Regeln: Einfaches, natürliches Deutsch auf A2/B1-Niveau, alltägliche Situationen. Jeder Satz übt genau dieses Muster. Setz in jedem richtigen deutschen Satz die Stelle, um die es beim Muster geht, in [eckige Klammern]. Bei F ist im falschen Satz genau mein typischer Fehler, sonst ist alles richtig. Die Aufgaben bei U kurz auf Englisch.", "");
  P.push("Erklär zuerst in zwei, drei Sätzen auf Englisch, wie die Regel geht. Schreib danach genau diesen Block mit 6 Ü-Zeilen, 4 U-Zeilen und 4 F-Zeilen:");
  P.push("DRILL:");
  P.push("Ü: (englischer Satz) | (deutscher Satz mit [Stelle])");
  P.push("U: (Ausgangssatz) | (Aufgabe auf Englisch) | (Zielsatz mit [Stelle]) | (englische Bedeutung)");
  P.push("F: (falscher Satz) | (richtiger Satz mit [Stelle]) | (englische Bedeutung)");
  P.push("(Beispiel für „Verb am Ende im indirekten Fragesatz“:)");
  P.push("(Ü: Do you know where the meter is? | Wissen Sie, wo der Zähler [ist]?)");
  P.push("(U: Wann kommt der Techniker? | Start with “Können Sie mir sagen, …” | Können Sie mir sagen, wann der Techniker [kommt]? | Can you tell me when the technician is coming?)");
  P.push("(F: Ich weiß nicht, was ist kaputt. | Ich weiß nicht, was kaputt [ist]. | I don't know what's broken.)");
  return P.join("\n");
}
function fdParse(raw) {
  const s = String(raw || "").replace(/\r/g, "").replace(/\*\*|__|`/g, "");
  const re = /^[ \t>#]*DRILL\b[ \t]*:?[ \t]*$/gim; let m, at = -1;
  while ((m = re.exec(s))) at = m.index + m[0].length;
  const out = [], q = t => String(t || "").replace(/^[„“"«»]+|[“”"«»]+$/g, "").trim(), ph = t => /^\(/.test(t);
  (at >= 0 ? s.slice(at) : s).split("\n").forEach(raw => {
    const l = raw.replace(/^\s*>\s?/, "").trim();
    const mm = l.match(/^(?:[-–•*]\s*|\d+[.)]\s*)?(Ü|UE|U|F)\s*\d*\s*[:.)]\s*(.+)$/i);
    if (!mm || ph(mm[2])) return;
    const k = mm[1].toUpperCase(), parts = mm[2].split(/\s*\|\s*/).map(q);
    if (k === "Ü" || k === "UE") { const [en, de] = parts; if (en && de && !ph(de)) out.push({ t: "tr", en, de }); }
    else if (k === "U") { const [qq, task, de, en] = parts; if (qq && task && de && dNorm(fdPlain(de)) !== dNorm(qq)) out.push({ t: "uf", q: qq, task, de, en: en || "" }); }
    else { const [wrong, de, en] = parts; if (wrong && de && dNorm(fdPlain(wrong)) !== dNorm(fdPlain(de))) out.push({ t: "fx", wrong: fdPlain(wrong), de, en: en || "" }); }
  });
  return out;
}
let fdSeq = 0;
function fdFetch(pid, back) {
  recStop(); atomsReady();
  const p = DB.pats[pid]; if (!p) { back(); return; }
  const prompt = fdPrompt(pid);
  const canShare = (() => { try { return !!navigator.share; } catch (e) { return false; } })();
  const body = `<p class="muted" style="margin-top:4px">${L("Claude schreibt neue Sätze für genau dieses Fehlermuster. Sie kommen in deinen Fehler-Drill.", "Claude writes new sentences for exactly this mistake pattern. They go into your mistake drill.")}</p>
    <div class="hl"><span class="lab">${L("Muster", "Pattern")}</span><div style="font-weight:700">${esc(patLabel(pid))}</div>${(p.bank || []).length ? `<div class="muted small">${L(`${p.bank.length} Sätze von Claude schon da`, `${p.bank.length} sentences from Claude already`)}</div>` : ""}</div>
    <div class="cb">
    <div class="step"><span class="n">1</span><div class="b"><b>${L("An Claude senden", "Send to Claude")}</b>
      <div class="row2">${canShare ? `<button class="btn petrol" id="fdShare">${L("Teilen", "Share")}</button>` : ""}<button class="btn ${canShare ? "ghost" : "petrol"}" id="fdCopy">${L("Kopieren", "Copy")}</button></div></div></div>
    <div class="step"><span class="n">2</span><div class="b"><b>${L("Antwort einfügen", "Paste the reply")}</b>
      <textarea class="ta2" id="fdPaste" placeholder="${L("Claudes ganze Antwort hier einfügen", "Paste Claude's whole reply here")}"></textarea>
      <button class="btn primary" id="fdUse">${L("Sätze übernehmen", "Add these sentences")}</button></div></div></div>
    ${(p.bank || []).length ? `<button class="btn ghost" id="fdClr" style="margin-top:8px">${L("Claudes Sätze für dieses Muster löschen", "Delete Claude's sentences for this pattern")}</button>` : ""}`;
  shell(L("Sätze holen", "Get sentences"), body, { back: L("Zurück", "Back"), backTo: "aktiv" });
  $("#back").onclick = back;
  const cp = () => copyText(prompt, ok => toast(ok ? L("Kopiert. Jetzt bei Claude einfügen.", "Copied. Now paste it to Claude.") : L("Kopieren ging nicht", "Couldn't copy")));
  const sh = $("#fdShare"); if (sh) sh.onclick = () => { if (!shareText(prompt)) cp(); };
  $("#fdCopy").onclick = cp;
  $("#fdUse").onclick = () => {
    const list = fdParse($("#fdPaste").value);
    const have = new Set((p.bank || []).map(b => b.t + dNorm(fdPlain(b.de))));
    const add = list.filter(b => !have.has(b.t + dNorm(fdPlain(b.de)))).map(b => Object.assign({ id: "b" + Date.now().toString(36) + (fdSeq++).toString(36) }, b));
    if (!list.length) { toast(L("Ich finde keine Sätze. Bitte die ganze Antwort mit „DRILL:“ einfügen.", "I can't find any sentences. Please paste the whole reply with “DRILL:”.")); return; }
    p.bank = (p.bank || []).concat(add);
    if (p.bank.length > 120) p.bank = p.bank.slice(-120);
    save(); toast(L(`${add.length} neue Sätze übernommen`, `${add.length} new sentences added`)); back();
  };
  const clr = $("#fdClr"); let armed = false;
  if (clr) clr.onclick = () => { if (!armed) { armed = true; clr.textContent = L("Nochmal tippen zum Löschen", "Tap again to delete"); clr.classList.add("bad"); return; } p.bank = []; save(); toast(L("Gelöscht", "Deleted")); back(); };
}

/* =================================================================== ON TODAY */
function fdWeakest(n) {
  try { atomsReady(); } catch (e) { return []; }
  const td = today();
  const pats = patsSorted().filter(p => p.atoms && !(DB.pats[p.id].ev || []).filter(e => e.d === td).length);
  const weak = pats.filter(p => p.n && p.score < 0.85).sort((a, b) => a.score - b.score);
  const fresh = pats.filter(p => !p.n);
  return weak.concat(fresh).slice(0, n);
}
function fdHome() {
  const list = fdWeakest(2); if (!list.length) return "";
  return list.map(p => `<button class="hero ghosty" data-fdh="${p.id}"><span class="ic">!</span><span><span class="tt">${L("Fehler-Drill", "Mistake drill")}: ${esc(p.label)}</span><span class="ss">${p.n ? L(`${Math.round(p.score * 100)} % in den letzten Versuchen · ${FD_N} Übungen`, `${Math.round(p.score * 100)}% in recent attempts · ${FD_N} drills`) : L(`Noch nicht geübt · ${FD_N} Übungen`, `Not practised yet · ${FD_N} drills`)}</span></span></button>`).join("");
}
function bindFdHome() { document.querySelectorAll("[data-fdh]").forEach(b => b.onclick = () => fdStart(b.dataset.fdh, () => go("home"))); }
