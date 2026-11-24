/* Per-scenario "Useful phrases" for the speaking tasks.
   Every scenario starts with its own starter phrases (SP_START). Each correction request to Claude
   also asks for 3–5 new phrases for that scenario (PHRASEN: block); after pasting the reply you tick
   the ones to keep. Any phrase can be deleted at any time, and you can add your own.
   Saved in DB.spPh[taskId] = { add:[{de,en,d}], del:[key] } (included in the backup file). */

const SP_START = {
/* ---- Alltag ---- */
arzt: [
 ["Ich hätte gern einen Termin, möglichst bald.", "I'd like an appointment, as soon as possible."],
 ["Ich habe seit … Tagen Halsschmerzen.", "I've had a sore throat for … days."],
 ["Seit gestern habe ich auch Fieber.", "Since yesterday I've also had a fever."],
 ["Geht es vielleicht auch am Nachmittag?", "Is the afternoon possible too?"],
 ["Ich komme zum ersten Mal zu Ihnen.", "It's my first time coming to you."],
 ["Was muss ich mitbringen?", "What do I need to bring?"]],
wohnung: [
 ["Die Wohnung ist schön hell.", "The flat is nice and bright."],
 ["Wie hoch ist die Miete?", "How much is the rent?"],
 ["Sind die Nebenkosten schon dabei?", "Are the extra costs included?"],
 ["Ab wann ist die Wohnung frei?", "From when is the flat available?"],
 ["Sind Haustiere erlaubt?", "Are pets allowed?"],
 ["Bis wann muss ich mich bei Ihnen melden?", "By when do I need to get back to you?"]],
baumarkt: [
 ["Ich suche Material für …", "I'm looking for materials for …"],
 ["Ich brauche ungefähr zehn Meter Rohr.", "I need about ten metres of pipe."],
 ["Was würden Sie mir empfehlen?", "What would you recommend?"],
 ["Das ist mir ein bisschen zu teuer.", "That's a bit too expensive for me."],
 ["Haben Sie auch etwas Günstigeres?", "Do you have something cheaper?"],
 ["Kann ich das zurückgeben, wenn es nicht funktioniert?", "Can I return it if it doesn't work?"]],
amt: [
 ["Ich möchte meinen neuen Wohnsitz anmelden.", "I'd like to register my new address."],
 ["Das Wort kenne ich leider nicht.", "Sorry, I don't know that word."],
 ["Können Sie bitte erklären, was das bedeutet?", "Could you explain what that means?"],
 ["Das habe ich leider nicht dabei.", "I'm afraid I don't have that with me."],
 ["Muss ich dafür einen neuen Termin machen?", "Do I need to make a new appointment for that?"],
 ["Also morgen zwischen acht und zwölf, richtig?", "So tomorrow between eight and twelve, right?"]],
reklamation: [
 ["Ich habe das letzte Woche bei Ihnen gekauft.", "I bought this from you last week."],
 ["Er funktioniert nicht mehr.", "It doesn't work any more."],
 ["Das Licht geht an, aber das Wasser bleibt kalt.", "The light comes on, but the water stays cold."],
 ["Ich hätte gern mein Geld zurück.", "I'd like my money back."],
 ["Das finde ich schade, aber dann nehme ich lieber ein neues Gerät.", "That's a shame, but then I'd rather take a new one."],
 ["Gilt die Garantie auch für das neue Gerät?", "Does the guarantee also apply to the new one?"]],
nachbarin: [
 ["Ich wohne seit Anfang des Monats hier.", "I've lived here since the start of the month."],
 ["Das ist sehr nett von Ihnen.", "That's very kind of you."],
 ["Wann kann ich das Paket bei Ihnen abholen?", "When can I collect the parcel from you?"],
 ["Das tut mir wirklich leid.", "I'm really sorry."],
 ["Das kommt nicht wieder vor.", "It won't happen again."],
 ["Darf ich Sie mal auf einen Kaffee einladen?", "May I invite you for a coffee some time?"]],
restaurant: [
 ["Ich möchte gern einen Tisch für vier Personen reservieren.", "I'd like to book a table for four."],
 ["Dann nehmen wir halb acht.", "Then we'll take half past seven."],
 ["Wir sitzen lieber auf der Terrasse.", "We'd rather sit on the terrace."],
 ["Falls es regnet, dann gern drinnen.", "If it rains, inside is fine."],
 ["Auf den Namen …, bitte.", "In the name of …, please."],
 ["Haben Sie auch vegetarische Gerichte?", "Do you also have vegetarian dishes?"]],
bank: [
 ["Ich möchte ein Konto eröffnen.", "I'd like to open an account."],
 ["Ich lebe teilweise in Barbados und teilweise in Deutschland.", "I live partly in Barbados and partly in Germany."],
 ["Ich brauche ein deutsches Konto, weil …", "I need a German account because …"],
 ["Gibt es auch ein kostenloses Konto?", "Is there also a free account?"],
 ["Was kostet eine Überweisung ins Ausland?", "What does a transfer abroad cost?"],
 ["Welche Unterlagen brauche ich dafür?", "Which documents do I need for that?"]],
/* ---- Über mein Leben ---- */
vorstellen: [
 ["Ich heiße … und komme aus Barbados.", "My name is … and I'm from Barbados."],
 ["Zurzeit lebe ich zwischen Barbados und Deutschland.", "At the moment I live between Barbados and Germany."],
 ["Von Beruf bin ich Softwareentwickler.", "I'm a software developer by profession."],
 ["In meiner Freizeit kümmere ich mich um meine Farm.", "In my free time I look after my farm."],
 ["Ich lerne Deutsch, weil ich in Deutschland leben möchte.", "I'm learning German because I want to live in Germany."],
 ["In Zukunft möchte ich …", "In the future I'd like to …"]],
farm: [
 ["Aquaponik ist eine Kombination aus Fischzucht und Pflanzenanbau.", "Aquaponics is a combination of fish farming and growing plants."],
 ["Die Fische produzieren Nährstoffe für die Pflanzen.", "The fish produce nutrients for the plants."],
 ["Die Pflanzen reinigen das Wasser für die Fische.", "The plants clean the water for the fish."],
 ["Eine Pumpe bringt das Wasser zu den Pflanzen.", "A pump carries the water to the plants."],
 ["Am schwierigsten ist es, das Gleichgewicht zu halten.", "The hardest thing is keeping the balance."],
 ["Man braucht viel weniger Wasser als in der normalen Landwirtschaft.", "You need much less water than in normal farming."]],
beruf: [
 ["Ich arbeite als …", "I work as …"],
 ["Ich bin für … zuständig.", "I'm responsible for …"],
 ["Im Moment arbeite ich an einem Projekt, bei dem …", "At the moment I'm working on a project in which …"],
 ["Ein normaler Arbeitstag fängt um … an.", "A normal working day starts at …"],
 ["Was mir besonders gefällt, ist …", "What I particularly like is …"],
 ["Was mir weniger gefällt, ist …", "What I like less is …"]],
bbde: [
 ["Im Vergleich zu Deutschland ist es in Barbados …", "Compared with Germany, in Barbados it's …"],
 ["In Barbados ist es das ganze Jahr warm, in Deutschland dagegen …", "In Barbados it's warm all year, whereas in Germany …"],
 ["Ein großer Unterschied ist …", "One big difference is …"],
 ["Die Leute in Barbados sind eher …, die Deutschen eher …", "People in Barbados tend to be …, Germans tend to be …"],
 ["Was ich in Deutschland am meisten vermisse, ist …", "What I miss most in Germany is …"],
 ["Beide Länder haben ihre Vor- und Nachteile.", "Both countries have their pros and cons."]],
tag: [
 ["Morgens stehe ich meistens um … auf.", "In the morning I usually get up at …"],
 ["Zuerst …, danach …", "First …, then …"],
 ["Am Vormittag arbeite ich am Computer.", "In the morning I work at the computer."],
 ["Mittags mache ich eine kurze Pause.", "At midday I take a short break."],
 ["Abends koche ich meistens selbst.", "In the evening I usually cook myself."],
 ["Am Wochenende habe ich mehr Zeit für …", "At the weekend I have more time for …"]],
erlebnis: [
 ["Das ist vor ungefähr … Jahren passiert.", "That happened about … years ago."],
 ["Ich war damals in …", "At the time I was in …"],
 ["Plötzlich ist etwas Unerwartetes passiert.", "Suddenly something unexpected happened."],
 ["Zuerst hatte ich Angst, aber dann …", "At first I was scared, but then …"],
 ["Am Ende ist alles gut gegangen.", "In the end everything went well."],
 ["Daraus habe ich gelernt, dass …", "From that I learned that …"]],
zukunft: [
 ["Nächstes Jahr möchte ich …", "Next year I'd like to …"],
 ["Ich habe vor, nach Deutschland zu ziehen.", "I'm planning to move to Germany."],
 ["Beruflich möchte ich gern …", "Professionally I'd like to …"],
 ["Mit Deutsch kann ich später …", "With German I'll later be able to …"],
 ["Wenn alles klappt, …", "If everything works out, …"],
 ["Mein großer Traum ist es, … zu …", "My big dream is to …"]],
warumdeutsch: [
 ["Ich lerne seit … Deutsch.", "I've been learning German for …"],
 ["Ich lerne Deutsch, weil ich in Deutschland leben und arbeiten möchte.", "I'm learning German because I want to live and work in Germany."],
 ["Am leichtesten finde ich …", "I find … easiest."],
 ["Am schwierigsten sind für mich die Artikel.", "The hardest thing for me is the articles."],
 ["Ich lerne jeden Tag mit einer App, die ich selbst gebaut habe.", "I learn every day with an app I built myself."],
 ["Am meisten hilft mir das Sprechen.", "Speaking helps me the most."]],
/* ---- Diskutieren & planen ---- */
feier: [
 ["Gute Idee! Wie wäre es mit …?", "Good idea! How about …?"],
 ["Ich hätte einen anderen Vorschlag: …", "I'd have a different suggestion: …"],
 ["Das passt besser, weil …", "That works better because …"],
 ["Da hast du recht, aber …", "You're right there, but …"],
 ["Ich kümmere mich um …", "I'll take care of …"],
 ["Dann machen wir es so.", "Then let's do it that way."]],
ausflug: [
 ["Wohin sollen wir fahren?", "Where should we go?"],
 ["Das finde ich nicht so gut, weil …", "I don't think that's so good because …"],
 ["Lass uns lieber …", "Let's … instead."],
 ["Wie wäre es, wenn wir …?", "How about if we …?"],
 ["Meiner Meinung nach …", "In my opinion …"],
 ["Du kümmerst dich um …, und ich …", "You take care of …, and I …"]],
homeoffice: [
 ["Da bin ich anderer Meinung.", "I see it differently."],
 ["Ich verstehe deinen Punkt, aber …", "I see your point, but …"],
 ["Ein großer Vorteil vom Homeoffice ist, dass …", "A big advantage of working from home is that …"],
 ["Da stimme ich dir zu.", "I agree with you there."],
 ["Ein Kompromiss wäre, zwei Tage pro Woche im Büro zu arbeiten.", "A compromise would be to work two days a week in the office."],
 ["Ehrlich gesagt …", "To be honest …"]],
regional: [
 ["Ich finde regionale Lebensmittel wichtig, weil …", "I think local food is important because …"],
 ["Das stimmt, sie sind oft etwas teurer.", "That's true, they're often a bit more expensive."],
 ["Dafür sind sie frischer und schmecken besser.", "But they're fresher and taste better."],
 ["Ich baue selbst Gemüse an und weiß, wie viel Arbeit das ist.", "I grow vegetables myself and know how much work that is."],
 ["Ich erwarte, dass …", "I expect that …"],
 ["Probier doch mal den Wochenmarkt aus!", "Why not give the farmers' market a try!"]],
kinderhandy: [
 ["Ich finde, Kinder brauchen nicht so früh ein Smartphone.", "I think children don't need a smartphone so early."],
 ["Ich kann das gut verstehen, aber …", "I can understand that, but …"],
 ["Da hast du teilweise recht.", "You're partly right there."],
 ["Ich würde sagen, ab etwa zwölf Jahren, weil …", "I'd say from about twelve, because …"],
 ["Wichtig sind klare Regeln.", "Clear rules are what matters."],
 ["Zusammenfassend kann man sagen, dass …", "To sum up, you could say that …"]],
geschenk: [
 ["Wie viel wollen wir ausgeben?", "How much do we want to spend?"],
 ["Ein Gutschein ist mir ein bisschen zu langweilig.", "A voucher is a bit too boring for me."],
 ["Was hältst du von …?", "What do you think of …?"],
 ["Wir könnten auch … fragen, ob er mitmacht.", "We could also ask … if he'll join in."],
 ["Dann teilen wir die Kosten.", "Then we'll split the costs."],
 ["Ich besorge das Geschenk, und du …", "I'll get the present, and you …"]],
/* ---- Kurze Präsentation ---- */
online: [
 ["Ich möchte heute über das Thema „Online einkaufen“ sprechen.", "Today I'd like to talk about “shopping online”."],
 ["Ich selbst kaufe oft online, zum Beispiel …", "I often buy online myself, for example …"],
 ["In Barbados dauert die Lieferung oft länger, weil …", "In Barbados delivery often takes longer because …"],
 ["Ein Vorteil ist, dass man Zeit spart.", "One advantage is that you save time."],
 ["Ein Nachteil ist, dass die kleinen Geschäfte darunter leiden.", "One disadvantage is that small shops suffer."],
 ["Vielen Dank fürs Zuhören.", "Thank you for listening."]],
stadtland: [
 ["In meiner Präsentation geht es um die Frage: Stadt oder Land?", "My presentation is about the question: city or countryside?"],
 ["Ich habe selbst schon in der Stadt und auf dem Land gelebt.", "I've lived in both the city and the countryside myself."],
 ["In Barbados ist der Unterschied nicht so groß, weil die Insel klein ist.", "In Barbados the difference isn't so big because the island is small."],
 ["In der Stadt hat man mehr Möglichkeiten, aber es ist lauter.", "In the city you have more opportunities, but it's louder."],
 ["Auf dem Land ist das Leben ruhiger und günstiger.", "In the countryside life is quieter and cheaper."],
 ["Ich persönlich lebe lieber auf dem Land, weil …", "Personally I prefer living in the countryside because …"]],
sport: [
 ["Mein Thema heute ist „Sport im Alltag“.", "My topic today is “sport in everyday life”."],
 ["Ich versuche, mich jeden Tag zu bewegen.", "I try to move every day."],
 ["In Barbados machen viele Leute Sport am Strand.", "In Barbados many people do sport on the beach."],
 ["Sport ist gut für die Gesundheit und hilft gegen Stress.", "Sport is good for your health and helps against stress."],
 ["Viele Menschen haben leider keine Zeit dafür.", "Sadly many people don't have time for it."],
 ["Ich bin der Meinung, dass schon zwanzig Minuten am Tag reichen.", "In my opinion, just twenty minutes a day is enough."]],
nachhaltig: [
 ["Heute möchte ich etwas über nachhaltiges Leben erzählen.", "Today I'd like to say something about living sustainably."],
 ["Auf meiner Farm verbrauche ich sehr wenig Wasser.", "On my farm I use very little water."],
 ["In Barbados muss fast alles importiert werden.", "In Barbados almost everything has to be imported."],
 ["Wenn man regional einkauft, schützt man die Umwelt.", "If you buy local, you protect the environment."],
 ["Nachhaltig zu leben ist oft teurer und kostet Zeit.", "Living sustainably is often more expensive and takes time."],
 ["Jeder kann einen kleinen Beitrag leisten.", "Everyone can make a small contribution."]],
ausland: [
 ["Ich spreche heute über das Thema „Ein Jahr im Ausland arbeiten“.", "Today I'm talking about “working abroad for a year”."],
 ["Ich habe selbst Erfahrung damit, weil ich zwischen zwei Ländern lebe.", "I have experience of this myself because I live between two countries."],
 ["Viele junge Leute aus Barbados gehen ins Ausland, um Geld zu verdienen.", "Many young people from Barbados go abroad to earn money."],
 ["Man lernt eine neue Sprache und eine andere Kultur kennen.", "You get to know a new language and a different culture."],
 ["Am Anfang fühlt man sich oft einsam.", "At first you often feel lonely."],
 ["Insgesamt würde ich es jedem empfehlen.", "Overall I'd recommend it to everyone."]],
ki: [
 ["Mein Thema ist „Künstliche Intelligenz im Alltag“.", "My topic is “artificial intelligence in everyday life”."],
 ["Ich benutze KI fast jeden Tag, zum Beispiel beim Programmieren.", "I use AI almost every day, for example when programming."],
 ["In Barbados benutzen immer mehr Firmen KI.", "In Barbados more and more companies are using AI."],
 ["KI kann viel Zeit sparen.", "AI can save a lot of time."],
 ["Man sollte aber nicht alles glauben, was die KI sagt.", "But you shouldn't believe everything the AI says."],
 ["Zum Schluss möchte ich sagen, dass …", "Finally I'd like to say that …"]],
/* ---- Im Beruf (SHK) ---- */
shk_notruf: [
 ["Notdienst, hier spricht … Was ist passiert?", "Emergency service, … speaking. What's happened?"],
 ["Zeigt die Anlage eine Fehlermeldung?", "Is the system showing an error message?"],
 ["Wie viel bar zeigt das Manometer an?", "How many bar does the pressure gauge show?"],
 ["Der Druck ist zu niedrig, deshalb geht die Heizung aus.", "The pressure is too low, that's why the heating switches off."],
 ["Ich komme in etwa einer Stunde vorbei.", "I'll come by in about an hour."],
 ["Für den Notdienst berechnen wir eine Pauschale.", "We charge a flat fee for the emergency call-out."]],
shk_beratung: [
 ["Das kommt darauf an, wie gut das Haus gedämmt ist.", "That depends on how well the house is insulated."],
 ["Zuerst berechnen wir die Heizlast.", "First we calculate the heat load."],
 ["Wir müssen prüfen, ob die Heizkörper groß genug sind.", "We have to check whether the radiators are big enough."],
 ["Das Außengerät könnte hier an der Hauswand stehen.", "The outdoor unit could go here on the house wall."],
 ["Moderne Wärmepumpen sind viel leiser als früher.", "Modern heat pumps are much quieter than they used to be."],
 ["Als Nächstes schicke ich Ihnen ein Angebot, und wir beantragen die Förderung.", "Next I'll send you a quote and we'll apply for the grant."]],
shk_meister: [
 ["Ich nehme heute den Auftrag in …", "I'll take the job in … today."],
 ["Was genau soll ich dort machen?", "What exactly am I supposed to do there?"],
 ["Welches Material brauche ich dafür?", "What material do I need for it?"],
 ["Das wird zeitlich ziemlich knapp.", "That's going to be pretty tight for time."],
 ["Kann mir jemand dabei helfen?", "Can someone help me with it?"],
 ["Alles klar, ich melde mich gegen Mittag.", "All right, I'll check in around midday."]],
shk_grosshandel: [
 ["Ich brauche zwanzig Meter Kupferrohr und die passenden Fittings.", "I need twenty metres of copper pipe and the matching fittings."],
 ["Wann kommt die Pumpe wieder rein?", "When is the pump coming back in?"],
 ["Gibt es eine Alternative?", "Is there an alternative?"],
 ["Dann nehme ich die andere, weil der Kunde nicht warten kann.", "Then I'll take the other one, because the customer can't wait."],
 ["Das geht auf die Rechnung der Firma …", "Put that on …'s account."],
 ["Kann ich bitte den Lieferschein bekommen?", "Can I have the delivery note, please?"]],
shk_beschwerde: [
 ["Das tut mir sehr leid. Was genau ist das Problem?", "I'm very sorry. What exactly is the problem?"],
 ["Seit wann tropft das Gerät?", "Since when has the unit been dripping?"],
 ["Wahrscheinlich ist die Kondensatleitung verstopft.", "The condensate pipe is probably blocked."],
 ["Keine Sorge, das ist natürlich Garantie.", "Don't worry, that's covered by the warranty, of course."],
 ["Ich kann morgen früh bei Ihnen sein.", "I can be with you tomorrow morning."],
 ["Bis dahin schalten Sie das Gerät bitte aus.", "Until then, please switch the unit off."]],
shk_bewerbung: [
 ["Mich interessiert die Technik hinter Heizung und Wasser.", "I'm interested in the technology behind heating and water."],
 ["Ich habe eine Aquaponik-Farm aufgebaut.", "I've built an aquaponics farm."],
 ["Dabei habe ich Pumpen und Rohrleitungen selbst installiert.", "In the process I installed pumps and pipework myself."],
 ["Mein Deutsch ist noch nicht perfekt, aber ich lerne jeden Tag.", "My German isn't perfect yet, but I learn every day."],
 ["Ich könnte ab … anfangen.", "I could start from …"],
 ["Wie sind die Arbeitszeiten?", "What are the working hours?"]],
shk_wp_erklaeren: [
 ["Die Wärmepumpe holt die Wärme aus der Luft, dem Boden oder dem Wasser.", "The heat pump takes heat from the air, the ground or the water."],
 ["Im Verdampfer wird das Kältemittel gasförmig.", "In the evaporator the refrigerant turns into gas."],
 ["Der Verdichter erhöht den Druck und die Temperatur.", "The compressor raises the pressure and the temperature."],
 ["Im Verflüssiger gibt das Kältemittel die Wärme an das Heizwasser ab.", "In the condenser the refrigerant gives off its heat to the heating water."],
 ["Das funktioniert wie ein Kühlschrank, nur umgekehrt.", "It works like a fridge, just the other way round."],
 ["Aus einer Kilowattstunde Strom macht sie etwa drei bis vier Kilowattstunden Wärme.", "From one kilowatt-hour of electricity it makes about three to four kilowatt-hours of heat."]],
shk_fehlersuche: [
 ["Die Kundin hat gemeldet, dass die Heizung nicht warm wird.", "The customer reported that the heating isn't getting warm."],
 ["Zuerst habe ich den Druck geprüft.", "First I checked the pressure."],
 ["Dann habe ich die Pumpe kontrolliert.", "Then I checked the pump."],
 ["Die Ursache war ein defektes Ventil.", "The cause was a faulty valve."],
 ["Ich habe das Ventil ausgetauscht und die Anlage entlüftet.", "I replaced the valve and bled the system."],
 ["Jetzt funktioniert alles wieder.", "Everything works again now."]],
shk_warum: [
 ["Mich hat Technik schon immer interessiert.", "I've always been interested in technology."],
 ["Auf meiner Farm habe ich viel mit Pumpen und Wasser gearbeitet.", "On my farm I've worked a lot with pumps and water."],
 ["Das Handwerk hat Zukunft, weil überall Fachkräfte fehlen.", "The trade has a future because skilled workers are missing everywhere."],
 ["Durch die Energiewende braucht man immer mehr Wärmepumpen.", "Because of the energy transition, more and more heat pumps are needed."],
 ["Ich arbeite gern mit den Händen.", "I like working with my hands."],
 ["Mein Ziel ist es, in Deutschland als Monteur zu arbeiten.", "My goal is to work in Germany as a fitter."]],
shk_vergleich: [
 ["Viele Hausbesitzer fragen sich: Wärmepumpe oder Gasheizung?", "Many homeowners ask themselves: heat pump or gas boiler?"],
 ["Die Wärmepumpe ist teurer in der Anschaffung, aber günstiger im Betrieb.", "A heat pump costs more to buy but less to run."],
 ["Für eine Wärmepumpe gibt es eine staatliche Förderung.", "There's a government grant for a heat pump."],
 ["Eine Gasheizung ist günstiger, aber der Gaspreis wird wahrscheinlich steigen.", "A gas boiler is cheaper, but the gas price will probably rise."],
 ["Bei einem schlecht gedämmten Haus muss man genau rechnen.", "With a poorly insulated house you have to do the sums carefully."],
 ["Meine Empfehlung ist deshalb …", "My recommendation is therefore …"]]
};

/* ---------- storage ---------- */
function spPhDB(id) {
  if (!DB.spPh || typeof DB.spPh !== "object") DB.spPh = {};
  if (!DB.spPh[id]) DB.spPh[id] = { add: [], del: [] };
  const r = DB.spPh[id]; if (!Array.isArray(r.add)) r.add = []; if (!Array.isArray(r.del)) r.del = [];
  return r;
}
function spPhKey(de) { return String(de || "").toLowerCase().replace(/ß/g, "ss").replace(/[.,!?;:"„“'()«»…–-]/g, "").replace(/\s+/g, " ").trim(); }
/* the scenario's current list: starters you haven't deleted, then the ones you added */
function spPhrases(id) {
  const r = spPhDB(id), del = new Set(r.del), out = [], seen = new Set();
  (SP_START[id] || []).forEach(([de, en]) => { const k = spPhKey(de); if (!del.has(k) && !seen.has(k)) { seen.add(k); out.push({ de, en, k, own: false }); } });
  r.add.forEach(x => { const k = spPhKey(x.de); if (!del.has(k) && !seen.has(k)) { seen.add(k); out.push({ de: x.de, en: x.en || "", k, own: true }); } });
  return out;
}
function spPhHas(id, de) { const k = spPhKey(de); return spPhrases(id).some(x => x.k === k); }
function spPhAdd(id, de, en) {
  de = String(de || "").trim(); en = String(en || "").trim(); if (!de) return false;
  const r = spPhDB(id), k = spPhKey(de);
  if (spPhHas(id, de)) return false;
  r.del = r.del.filter(x => x !== k);                    // a phrase you deleted earlier can come back
  if (!(SP_START[id] || []).some(([d]) => spPhKey(d) === k)) r.add.push({ de, en, d: today() });
  return true;
}
function spPhDel(id, k) {
  const r = spPhDB(id);
  r.add = r.add.filter(x => spPhKey(x.de) !== k);
  if ((SP_START[id] || []).some(([d]) => spPhKey(d) === k) && !r.del.includes(k)) r.del.push(k);
}
function spPhRestore(id) { spPhDB(id).del = spPhDB(id).del.filter(k => !(SP_START[id] || []).some(([d]) => spPhKey(d) === k)); }
function spPhDeletedStarters(id) { const del = new Set(spPhDB(id).del); return (SP_START[id] || []).filter(([d]) => del.has(spPhKey(d))).length; }

/* ---------- styles ---------- */
(function spPhStyles() {
  const css = `
.phr .x{flex:none;min-width:34px;height:34px;border-radius:10px;border:1.5px solid var(--line);color:var(--muted);font-weight:800;font-size:13px;padding:0 8px}
.phr .x.sure{background:var(--bad);border-color:var(--bad);color:#fff}
.phr .own{display:inline-block;font-size:11px;font-weight:800;color:var(--amber);margin-left:6px}
.spph-add{margin-top:10px;border-top:1px solid var(--line);padding-top:10px}
.spph-add .tin{margin-top:6px;font-size:15px;font-weight:600}
.spph-add .row2 .btn{padding:11px;font-size:15px}
.spph-lnk{display:inline-block;margin-top:10px;font-weight:800;font-size:14px;color:var(--petrol-ink, var(--petrol))}
.spph-pick{background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px 14px;margin-top:14px}
.spph-pick h4{margin:0 0 4px;font-size:16px}
.spph-pick label{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line);cursor:pointer}
.spph-pick label:first-of-type{border-top:none}
.spph-pick input{width:20px;height:20px;margin-top:2px;flex:none;accent-color:var(--petrol)}
.spph-pick b{display:block;font-size:15px}
.spph-pick span span{color:var(--muted);font-size:13px}`;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
})();

/* ---------- the "Useful phrases" panel on a speaking task ---------- */
let SPPH_ADD = false;
let SPPH_OPEN = false;
function spPhraseFold(t, open) {
  SPPH_ADD = false;
  return `<details class="fold" id="spph" ${open || SPPH_OPEN ? "open" : ""}><summary>${L("Hilfreiche Redemittel", "Useful phrases")} <span class="muted small" id="spphN">· ${spPhrases(t.id).length}</span></summary><div class="in" id="spphIn">${spPhInner(t)}</div></details>`;
}
function spPhInner(t) {
  const list = spPhrases(t.id), gone = spPhDeletedStarters(t.id);
  const rows = list.map(r => `<div class="phr"><span class="tx2"><b>${esc(r.de)}${r.own ? `<span class="own">${L("neu", "new")}</span>` : ""}</b><span>${esc(r.en)}</span></span>${TTS ? `<button class="spk" data-say="${esc(r.de.replace(/…/g, ""))}" aria-label="${L("Anhören", "Play")}">${ICON.spk}</button>` : ""}<button class="x" data-phdel="${esc(r.k)}" aria-label="${L("Löschen", "Delete")}">✕</button></div>`).join("");
  return (rows || `<p class="muted small">${L("Noch keine Redemittel. Füg eins hinzu oder lass Claude welche vorschlagen.", "No phrases yet. Add one, or let Claude suggest some.")}</p>`)
    + (SPPH_ADD ? `<div class="spph-add"><input class="tin" id="phDe" placeholder="${L("Deutsch", "German")}"><input class="tin" id="phEn" placeholder="${L("Englisch (optional)", "English (optional)")}"><div class="row2" style="margin-top:8px"><button class="btn ghost" id="phCancel">${L("Abbrechen", "Cancel")}</button><button class="btn petrol" id="phSave">${L("Hinzufügen", "Add")}</button></div></div>`
      : `<button class="spph-lnk" id="phNew">＋ ${L("Eigenes Redemittel hinzufügen", "Add my own phrase")}</button>`)
    + (gone ? `<br><button class="spph-lnk" id="phRestore" style="color:var(--muted)">↺ ${L(`${gone} gelöschte Start-Redemittel zurückholen`, `Bring back ${gone} deleted starter ${gone === 1 ? "phrase" : "phrases"}`)}</button>` : "")
    + `<p class="muted small" style="margin:10px 0 0">${L("Die Liste wächst: Bei jeder Korrektur schlägt Claude neue Redemittel für diese Aufgabe vor.", "The list grows: with every correction Claude suggests new phrases for this task.")}</p>`;
}
function spPhRefresh(t) {
  const host = document.getElementById("spphIn"); if (!host) return;
  host.innerHTML = spPhInner(t);
  const n = document.getElementById("spphN"); if (n) n.textContent = "· " + spPhrases(t.id).length;
  spPhBind(t);
}
function spPhBind(t) {
  const host = document.getElementById("spphIn"); if (!host) return;
  const fold = document.getElementById("spph"); if (fold && !fold.dataset.b) { fold.dataset.b = "1"; fold.addEventListener("toggle", () => { SPPH_OPEN = fold.open; }); }
  host.querySelectorAll("[data-phdel]").forEach(b => b.onclick = () => {
    if (!b.classList.contains("sure")) {
      host.querySelectorAll(".x.sure").forEach(x => { x.classList.remove("sure"); x.textContent = "✕"; });
      b.classList.add("sure"); b.textContent = L("Löschen?", "Delete?"); return;
    }
    spPhDel(t.id, b.dataset.phdel); save(); spPhRefresh(t); toast(L("Gelöscht", "Deleted"));
  });
  const nw = host.querySelector("#phNew"); if (nw) nw.onclick = () => { SPPH_ADD = true; spPhRefresh(t); const i = document.getElementById("phDe"); if (i) i.focus(); };
  const cc = host.querySelector("#phCancel"); if (cc) cc.onclick = () => { SPPH_ADD = false; spPhRefresh(t); };
  const sv = host.querySelector("#phSave"); if (sv) sv.onclick = () => {
    const de = document.getElementById("phDe").value, en = document.getElementById("phEn").value;
    if (!de.trim()) { toast(L("Schreib zuerst das Redemittel auf Deutsch.", "Write the phrase in German first.")); return; }
    if (!spPhAdd(t.id, de, en)) { toast(L("Das steht schon auf der Liste.", "That's already on the list.")); return; }
    save(); SPPH_ADD = false; spPhRefresh(t); toast(L("Hinzugefügt", "Added"));
  };
  const rs = host.querySelector("#phRestore"); if (rs) rs.onclick = () => { spPhRestore(t.id); save(); spPhRefresh(t); };
}

/* ---------- Claude: ask for new phrases, and tick the ones to keep ---------- */
function spPhPromptLines(P, id) {
  const cur = spPhrases(id).map(x => x.de);
  if (cur.length) P.push("Meine Redemittel für diese Aufgabe (bitte nicht wiederholen): " + cur.join(" / "));
  P.push("PHRASEN:");
  P.push("- (3–5 neue, nützliche Redemittel genau für diese Aufgabe, die noch nicht auf meiner Liste stehen. Am besten für Stellen, an denen ich Probleme hatte oder etwas nicht sagen konnte. B1-Niveau, kurz, als ganze Wendung zum Wiederverwenden. Eine pro Zeile: Deutsch | Englisch)");
}
function spPhParse(block) {
  const isPh = s => /^\([\s\S]*\)$/.test(String(s || "").trim());
  return String(block || "").split("\n").map(x => x.replace(/^\s*>\s?/, "").trim()).filter(x => x && !isPh(x))
    .map(x => x.replace(/^\s*(?:[-–•*]|\d+[.)])\s*/, "").trim()).filter(Boolean)
    .map(x => { const p = x.split(/\s+\|\s+|\s*\|\s*/); return { de: (p[0] || "").replace(/^[„“"]|[“”"]$/g, "").trim(), en: (p[1] || "").replace(/^[„“"]|[“”"]$/g, "").trim() }; })
    .filter(x => x.de && x.de.length < 200);
}
/* shown after you paste Claude's reply on a speaking task: nothing is added until you tick it */
function spPhPicker(host, t, phr) {
  const fresh = []; const seen = new Set();
  phr.forEach(x => { const k = spPhKey(x.de); if (!seen.has(k) && !spPhHas(t.id, x.de)) { seen.add(k); fresh.push(x); } });
  if (!fresh.length) { host.innerHTML = ""; return; }
  host.innerHTML = `<div class="spph-pick"><h4>${L("Neue Redemittel für diese Aufgabe", "New phrases for this task")}</h4>
    <p class="muted small" style="margin:0 0 6px">${L("Hak die an, die du behalten willst. Löschen kannst du sie später jederzeit.", "Tick the ones you want to keep. You can delete them any time later.")}</p>
    ${fresh.map((x, i) => `<label><input type="checkbox" data-pi="${i}"><span><b>${esc(x.de)}</b><span>${esc(x.en)}</span></span></label>`).join("")}
    <button class="btn petrol" id="phKeep" disabled style="opacity:.5">${L("Angehakte behalten", "Keep ticked phrases")}</button></div>`;
  const btn = host.querySelector("#phKeep");
  const upd = () => { const n = host.querySelectorAll("input:checked").length; btn.disabled = !n; btn.style.opacity = n ? "" : ".5"; btn.textContent = n ? L(`${n} behalten`, `Keep ${n}`) : L("Angehakte behalten", "Keep ticked phrases"); };
  host.querySelectorAll("input").forEach(i => i.onchange = upd);
  btn.onclick = () => {
    let n = 0; host.querySelectorAll("input:checked").forEach(i => { const x = fresh[+i.dataset.pi]; if (spPhAdd(t.id, x.de, x.en)) n++; });
    save(); spPhRefresh(t);
    host.innerHTML = `<div class="spph-pick"><p class="muted small" style="margin:0">${L(`${n} ${n === 1 ? "Redemittel" : "Redemittel"} zur Liste von „${esc(t.t[0])}“ hinzugefügt.`, `Added ${n} ${n === 1 ? "phrase" : "phrases"} to the “${esc(t.t[1])}” list.`)}</p></div>`;
  };
}
