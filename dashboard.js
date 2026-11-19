/* Weekly dashboard (card on Today + full page) and the atom reminder (app notification).
   Loaded last. Uses DB.days (new words per day), DB.log (word reviews, atom ratings, secure snapshots),
   atom hist and mistake-pattern events (both dated). */

(function addDashStyles() {
  const css = `
  .wk{display:block;width:100%;text-align:left;background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:14px 16px;margin:10px 0 0}
  .wk .top{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
  .wk .tt{font-weight:800;font-size:16px}
  .wk .vd{font-size:13px;font-weight:800;white-space:nowrap}
  .wk .ln{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:6px;font-size:13.5px;color:var(--muted)}
  .wk .ln b{color:var(--ink)}
  .g-up{color:var(--good)} .g-down{color:var(--bad)} .g-same{color:var(--muted)}
  .days7{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end;height:118px;margin:10px 0 2px}
  .days7 .d{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
  .days7 .bar{width:70%;max-width:26px;background:var(--petrol);border-radius:4px 4px 0 0;min-height:0}
  .days7 .bar.zero{background:none;border-bottom:2px solid var(--line);border-radius:0}
  .days7 .n{font-size:11.5px;font-weight:800;color:var(--muted);margin-bottom:3px}
  .days7 .lb{font-size:11.5px;font-weight:700;color:var(--muted);margin-top:4px}
  .days7 .d.today .lb{color:var(--ink)}
  .wtab{width:100%;border-collapse:collapse;font-size:14.5px}
  .wtab th{font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);text-align:right;padding:4px 0 6px}
  .wtab th:first-child,.wtab td:first-child{text-align:left}
  .wtab td{padding:9px 0;border-top:1px solid var(--line);text-align:right;vertical-align:top}
  .wtab td small{display:block;color:var(--muted);font-size:11.5px}
  .chg{font-weight:800;white-space:nowrap}
  .wpat{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid var(--line);font-size:14.5px}
  .wpat:first-child{border-top:none}
  .wpat span{white-space:nowrap;font-weight:800}
  .shortcuts{margin-top:10px}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* ---------- numbers for one week (7 days ending `end`) ---------- */
function wkRange(end) { const out = []; for (let i = 6; i >= 0; i--) out.push(addDays(end, -i)); return out; }
function wkStats(end) {
  const days = wkRange(end), set = new Set(days), lg = DB.log || {};
  const act = {}; days.forEach(d => act[d] = 0);
  let words = 0, wr = 0, wo = 0, ar = 0, ao = 0, pa = 0, po = 0;
  days.forEach(d => {
    const n = (DB.days || {})[d] || 0; words += n; act[d] += n;
    const l = lg[d] || {}; wr += l.wr || 0; wo += l.wo || 0; act[d] += l.wr || 0;
    if (l.ar) { ar += l.ar; ao += l.ao || 0; act[d] += l.ar; }
  });
  // atom reviews before the log existed: from each atom's history (counts Easy only, so it's a low estimate)
  (DB.atoms || []).forEach(a => (a.hist || []).forEach(h => {
    if (!set.has(h.d) || (lg[h.d] && lg[h.d].ar) || typeof h.n !== "number") return;
    ar += h.n; ao += h.ok || 0; act[h.d] += h.n;
  }));
  Object.keys(DB.pats || {}).forEach(id => (DB.pats[id].ev || []).forEach(e => {
    if (!set.has(e.d)) return; pa++; po += e.r === "ok" ? 1 : e.r === "hint" ? 0.5 : 0; act[e.d]++;
  }));
  const practised = days.filter(d => act[d] > 0).length;
  // secure words: today's (or the week's last) snapshot minus the one from before the week
  const snapAt = d => { const ks = Object.keys(lg).filter(k => k <= d && lg[k].sec != null).sort(); return ks.length ? lg[ks[ks.length - 1]].sec : null; };
  const secEnd = end === today() ? secureAll() : snapAt(end), secStart = snapAt(addDays(end, -7));
  return { days, act, practised, words, wr, wo, ar, ao, pa, po,
    atomPct: ar ? ao / ar : null, patPct: pa ? po / pa : null, wordPct: wr ? wo / wr : null,
    secEnd, secGain: secEnd != null && secStart != null ? secEnd - secStart : null };
}
// the four measures Damian chose: words secure, atom reviews right, mistake patterns, days practised
function wkCompare() {
  const t = today(), cur = wkStats(t), prev = wkStats(addDays(t, -7));
  const cmp = (a, b, eps) => a == null || b == null ? null : a > b + eps ? 1 : a < b - eps ? -1 : 0;
  const m = {
    sec: cmp(cur.secGain, prev.secGain, 0) ?? (cur.secGain != null ? (cur.secGain > 0 ? 1 : cur.secGain < 0 ? -1 : 0) : null),
    atom: cmp(cur.atomPct, prev.atomPct, 0.03),
    pat: cmp(cur.patPct, prev.patPct, 0.03),
    days: cmp(cur.practised, prev.practised, 0)
  };
  const vals = Object.values(m).filter(v => v != null), score = vals.reduce((s, v) => s + v, 0);
  const verdict = !vals.length ? null : score > 0 ? "up" : score < 0 ? "down" : "same";
  return { cur, prev, m, verdict };
}
const wkPct = v => v == null ? "–" : Math.round(v * 100) + " %";
function wkChg(v) { return v == null ? "" : `<span class="chg g-${v > 0 ? "up" : v < 0 ? "down" : "same"}">${v > 0 ? "▲" : v < 0 ? "▼" : "="}</span>`; }
function wkVerdictText(v) {
  return v === "up" ? L("▲ besser als letzte Woche", "▲ better than last week") : v === "down" ? L("▼ schwächer als letzte Woche", "▼ below last week") : v === "same" ? L("= wie letzte Woche", "= same as last week") : L("Erste Woche", "First week");
}

/* ---------- card on Today ---------- */
function weekCard() {
  try {
    const c = wkCompare(), s = c.cur;
    return `<button class="wk" id="wkCard"><div class="top"><span class="tt">${L("Deine Woche", "Your week")}</span><span class="vd g-${c.verdict || "same"}">${wkVerdictText(c.verdict)}</span></div>
      <div class="ln"><span><b>${s.practised}/7</b> ${L("Tage", "days")}</span>${s.secGain != null ? `<span><b>${s.secGain >= 0 ? "+" : ""}${s.secGain}</b> ${L("sichere Wörter", "secure words")}</span>` : `<span><b>${s.words}</b> ${L("neue Wörter", "new words")}</span>`}<span>${L("Atome", "Atoms")} <b>${wkPct(s.atomPct)}</b></span><span>${L("Fehlermuster", "Mistakes")} <b>${wkPct(s.patPct)}</b></span></div></button>`;
  } catch (e) { return ""; }
}
function bindWeekCard() { const b = $("#wkCard"); if (b) b.onclick = () => weekPage(); }

/* ---------- full page ---------- */
function weekPage() {
  recStop(); atomsReady();
  const c = wkCompare(), s = c.cur, p = c.prev, t = today();
  const max = Math.max(1, ...s.days.map(d => s.act[d]));
  const dayLbl = d => new Date(d + "T12:00").toLocaleDateString(EN() ? "en-GB" : "de-DE", { weekday: "short" });
  const bars = s.days.map(d => { const n = s.act[d], h = Math.round(n / max * 78); return `<div class="d ${d === t ? "today" : ""}" title="${esc(fmtDay(d))}: ${n}"><span class="n">${n || ""}</span><span class="bar ${n ? "" : "zero"}" style="height:${n ? Math.max(4, h) : 0}px"></span><span class="lb">${esc(dayLbl(d))}</span></div>`; }).join("");
  const row = (label, a, b, chg, note) => `<tr><td>${label}${note ? `<small>${note}</small>` : ""}</td><td><b>${a}</b></td><td>${b}</td><td>${chg}</td></tr>`;
  // mistake patterns: share right this week vs everything before it
  const start = addDays(t, -6);
  const pats = Object.keys(DB.pats || {}).map(id => {
    const ev = DB.pats[id].ev || [], sc = l => l.length ? l.reduce((x, e) => x + (e.r === "ok" ? 1 : e.r === "hint" ? 0.5 : 0), 0) / l.length : null;
    const wk = ev.filter(e => e.d >= start), before = ev.filter(e => e.d < start).slice(-12);
    return { id, label: patLabel(id), now: sc(wk), was: sc(before), n: wk.length };
  }).filter(x => x.n);
  const better = pats.filter(x => x.was != null && x.now > x.was + 0.05).sort((a, b) => (b.now - b.was) - (a.now - a.was)).slice(0, 4);
  const weak = pats.filter(x => x.now < 0.6).sort((a, b) => a.now - b.now).slice(0, 4);
  const pl = x => `<div class="wpat"><div>${esc(x.label)}</div><span>${x.was != null ? wkPct(x.was) + " → " : ""}${wkPct(x.now)}</span></div>`;
  const body = `<div class="result" style="padding-top:6px"><div class="lbl vd g-${c.verdict || "same"}" style="font-size:20px">${wkVerdictText(c.verdict)}</div><div class="muted small" style="margin-top:4px">${L("Letzte 7 Tage im Vergleich zu den 7 Tagen davor", "Last 7 days compared with the 7 days before")}</div></div>
    <div class="hl"><span class="lab">${L("Was du gemacht hast", "What you did")}</span><div class="days7" role="img" aria-label="${L("Übungen pro Tag", "Practice per day")}">${bars}</div>
      <div class="muted small">${L("Wörter, Wiederholungen, Atom-Sätze und Fehlermuster-Übungen pro Tag", "Words, reviews, atom sentences and mistake drills per day")}</div></div>
    <div class="hl"><table class="wtab"><thead><tr><th></th><th>${L("Diese", "This")}</th><th>${L("Letzte", "Last")}</th><th></th></tr></thead><tbody>
      ${row(L("Tage geübt", "Days practised"), `${s.practised}/7`, `${p.practised}/7`, wkChg(c.m.days))}
      ${row(L("Sichere Wörter", "Words secure"), s.secGain != null ? (s.secGain >= 0 ? "+" : "") + s.secGain : "–", p.secGain != null ? (p.secGain >= 0 ? "+" : "") + p.secGain : "–", wkChg(c.m.sec), s.secGain != null ? L(`jetzt ${s.secEnd} auf Stufe 4–5`, `${s.secEnd} at level 4–5 now`) : L(`jetzt ${secureAll()} · Vergleich ab nächster Woche`, `${secureAll()} now · comparison from next week`))}
      ${row(L("Atom-Sätze richtig", "Atom reviews right"), wkPct(s.atomPct), wkPct(p.atomPct), wkChg(c.m.atom), L(`${s.ar} Sätze bewertet · Okay oder Leicht`, `${s.ar} sentences rated · OK or Easy`))}
      ${row(L("Fehlermuster richtig", "Mistake patterns right"), wkPct(s.patPct), wkPct(p.patPct), wkChg(c.m.pat), L(`${s.pa} Versuche`, `${s.pa} attempts`))}
      ${row(L("Neue Wörter", "New words"), s.words, p.words, "")}
      ${row(L("Wort-Wiederholungen", "Word reviews"), s.wr ? `${s.wr} · ${wkPct(s.wordPct)}` : "–", p.wr ? `${p.wr} · ${wkPct(p.wordPct)}` : "–", "", L("richtig beim ersten Versuch", "right first time"))}
    </tbody></table></div>
    ${better.length ? `<div class="sec-h">${L("Besser geworden", "Got better")}</div><div class="hl">${better.map(pl).join("")}</div>` : ""}
    ${weak.length ? `<div class="sec-h">${L("Noch schwach", "Still weak")}</div><div class="hl">${weak.map(pl).join("")}</div><button class="btn primary" id="wkWeak">${L("Schwächstes Muster üben", "Practise the weakest pattern")}</button>` : ""}
    <p class="muted small">${L("Wort-Wiederholungen und Atom-Bewertungen zählt die App erst seit diesem Update genau. Ältere Atom-Tage sind geschätzt.", "Word reviews and atom ratings are counted exactly only since this update. Older atom days are estimated.")}</p>`;
  shell(L("Deine Woche", "Your week"), body, { back: L("Heute", "Today"), backTo: "home", redraw: weekPage });
  const w = $("#wkWeak"); if (w) w.onclick = () => patSmGo(weak[0].id, weekPage);
}

/* =================================================================== ATOM REMINDER
   No server: the service worker wakes up now and then (Chrome's periodic background sync, installed app only),
   reads the next due day the app saved, and shows a notification once that day has come. */
const META_CACHE = "b1-meta", META_URL = "./__meta/atoms.json";
function nextAtomDue() {
  let min = "";
  (DB.atoms || []).forEach(a => { if (a.paused || a.done) return; (a.sents || []).forEach(x => { if (isLive(x) && !x.pend && x.due && (!min || x.due < min)) min = x.due; }); });
  return min;
}
function remindSync() {
  try {
    if (!("caches" in window)) return;
    const meta = { on: !!DB.remind, due: nextAtomDue(), n: atomsDue().reduce((k, a) => k + dueSents(a).length, 0), de: !EN() };
    caches.open(META_CACHE).then(c => c.match(META_URL).then(old => old ? old.json().catch(() => ({})) : {}).then(o => {
      meta.told = o && o.told || "";
      return c.put(META_URL, new Response(JSON.stringify(meta), { headers: { "Content-Type": "application/json" } }));
    })).catch(() => { });
  } catch (e) { }
}
function remindSupport() {
  const sw = "serviceWorker" in navigator, nt = "Notification" in window;
  let ps = false; try { ps = sw && "periodicSync" in ServiceWorkerRegistration.prototype; } catch (e) { }
  return { sw, nt, ps };
}
function remindCtl() {
  const sp = remindSupport(), on = !!DB.remind && sp.nt && Notification.permission === "granted";
  const due = nextAtomDue();
  const note = !sp.nt || !sp.sw ? L("Dieser Browser kann keine Benachrichtigungen zeigen. Öffne die installierte App in Chrome.", "This browser can't show notifications. Open the installed app in Chrome.")
    : !sp.ps ? L("Chrome kann die App hier nicht im Hintergrund wecken. Das geht nur in der installierten App auf Android.", "Chrome can't wake the app in the background here. That only works in the installed app on Android.")
    : Notification.permission === "denied" ? L("Benachrichtigungen sind blockiert. Erlaube sie in den Einstellungen der App (lange auf das App-Symbol drücken → App-Info → Benachrichtigungen).", "Notifications are blocked. Allow them in the app's settings (long-press the app icon → App info → Notifications).")
    : on ? L(`An. Nächste Atom-Wiederholung: ${due ? fmtDay(due) : "keine"}. Chrome entscheidet, wann genau die App aufwacht (meist einmal am Tag).`, `On. Next atom review: ${due ? fmtDay(due) : "none"}. Chrome decides exactly when the app wakes up (usually about once a day).`)
    : L("Eine Benachrichtigung, wenn Atom-Sätze fällig sind.", "A notification when atom sentences are due.");
  return `<button class="row-sw" id="remSw" aria-pressed="${on}"><span class="tx"><b>${L("Atom-Erinnerung", "Atom reminder")}</b><span class="muted small">${note}</span></span><span class="sw ${on ? "on" : ""}"><i></i></span></button>
    ${on ? `<button class="btn ghost" id="remTest">${L("Test-Benachrichtigung", "Test notification")}</button>` : ""}`;
}
async function remindOn() {
  const sp = remindSupport();
  if (!sp.nt || !sp.sw) { toast(L("Benachrichtigungen gehen hier nicht.", "Notifications don't work here.")); return false; }
  let perm = Notification.permission;
  if (perm === "default") { try { perm = await Notification.requestPermission(); } catch (e) { } }
  if (perm !== "granted") { toast(L("Ohne Erlaubnis keine Benachrichtigung.", "No notifications without permission.")); return false; }
  if (!sp.ps) { toast(L("Hintergrund-Wecken geht hier nicht. Nutze die installierte App.", "Background wake-up doesn't work here. Use the installed app.")); return false; }
  try {
    const reg = await navigator.serviceWorker.ready;
    try { const st = await navigator.permissions.query({ name: "periodic-background-sync" }); if (st.state === "denied") { toast(L("Chrome erlaubt das Hintergrund-Wecken nicht. Installiere die App über „Installieren“.", "Chrome doesn't allow background wake-up. Install the app with “Install”.")); return false; } } catch (e) { }
    await reg.periodicSync.register("atoms-due", { minInterval: 6 * 60 * 60 * 1000 });
    return true;
  } catch (e) { toast(L("Konnte die Erinnerung nicht einrichten. Ist die App installiert?", "Couldn't set up the reminder. Is the app installed?")); return false; }
}
async function remindOff() { try { const reg = await navigator.serviceWorker.ready; if (reg.periodicSync) await reg.periodicSync.unregister("atoms-due"); } catch (e) { } }
function bindRemind(redo) {
  const sw = $("#remSw"); if (!sw) return;
  sw.onclick = async () => {
    const was = sw.getAttribute("aria-pressed") === "true";
    if (was) { DB.remind = false; save(); await remindOff(); remindSync(); toast(L("Erinnerung aus", "Reminder off")); redo(); return; }
    const ok = await remindOn();
    DB.remind = ok; save(); remindSync();
    if (ok) toast(L("Erinnerung an", "Reminder on"));
    redo();
  };
  const t = $("#remTest"); if (t) t.onclick = async () => {
    try { const reg = await navigator.serviceWorker.ready; await reg.showNotification(L("Atome sind fällig", "Atoms are due"), { body: L("So sieht deine Erinnerung aus. Tippen öffnet deine Atome.", "This is what your reminder looks like. Tap to open your atoms."), icon: "icon-192.png", badge: "icon-192.png", tag: "atoms-test", data: { url: "./?go=atoms" } }); }
    catch (e) { toast(L("Test ging nicht", "Test didn't work")); }
  };
}
// keep the service worker's copy of the next due day fresh
try { remindSync(); document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") remindSync(); }); } catch (e) { }
try { snapSecure(); save(); } catch (e) { }
