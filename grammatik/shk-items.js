/* Handwerker-Modus (SHK): extra drill items for every grammar rule, from heating, heat pumps,
   AC, water and site work. Same item format as the rules. When the mode is switched on in the
   B1 app they are added after each rule's own items (so saved progress keys stay the same). */
const SHK_ITEMS = {
"a1-praesens": [
  { t: "gap", q: "Der Monteur ___ die Heizung.", h: "prüfen", a: ["prüft"], en: "The fitter checks the heating.", why: "er → -t." },
  { t: "gap", q: "Du ___ den Heizkörper.", h: "entlüften", a: ["entlüftest"], en: "You bleed the radiator.", why: "Stem ends in -t → du adds -est." },
  { t: "mc", q: "Er ___ das Rohr mit der Zange.", o: ["hält", "haltet", "halt"], en: "He holds the pipe with the pliers.", why: "halten: a → ä with er: hält." },
  { t: "mc", q: "Wir ___ heute die Wärmepumpe.", o: ["montieren", "montiert", "montierst"], en: "Today we're installing the heat pump.", why: "wir → -en." },
  { t: "sb", s: "Der Kunde wartet im Keller.", en: "The customer is waiting in the basement.", why: "Verb in position 2." },
  { t: "sb", s: "Ihr arbeitet heute auf der Baustelle.", en: "You're working on the site today.", why: "ihr arbeitet: extra e after t." },
  { t: "uf", q: "Ich messe den Druck.", task: "Subjekt: er", a: ["Er misst den Druck."], en: "He measures the pressure.", why: "messen: e → i with er: misst." },
  { t: "uf", q: "Wir fahren zum Großhandel.", task: "Subjekt: du", a: ["Du fährst zum Großhandel."], en: "You're driving to the wholesaler.", why: "fahren: a → ä with du." }
],
"a1-seinhaben": [
  { t: "gap", q: "Die Pumpe ___ kaputt.", h: "sein", a: ["ist"], en: "The pump is broken.", why: "die Pumpe = sie → ist." },
  { t: "gap", q: "Wir ___ heute drei Aufträge.", h: "haben", a: ["haben"], en: "We have three jobs today.", why: "wir haben." },
  { t: "mc", q: "___ du das Messgerät dabei?", o: ["Hast", "Hat", "Habt"], en: "Have you got the meter with you?", why: "du hast." },
  { t: "mc", q: "Die Rohre ___ zu kurz.", o: ["sind", "ist", "seid"], en: "The pipes are too short.", why: "die Rohre = sie (plural) → sind." },
  { t: "sb", s: "Der Kunde hat kein Warmwasser.", en: "The customer has no hot water.", why: "haben + Akkusativ." },
  { t: "sb", s: "Ich bin in zehn Minuten da.", en: "I'll be there in ten minutes.", why: "ich bin." },
  { t: "uf", q: "Ich habe Notdienst.", task: "Subjekt: er", a: ["Er hat Notdienst."], en: "He's on emergency call.", why: "er hat." },
  { t: "uf", q: "Das Ventil ist undicht.", task: "Plural: die Ventile", a: ["Die Ventile sind undicht."], en: "The valves are leaking.", why: "Plural → sind." }
],
"a1-artikel": [
  { t: "mc", q: "___ Wärmepumpe steht im Garten.", o: ["Die", "Der", "Das"], en: "The heat pump is in the garden.", why: "die Wärmepumpe (feminine)." },
  { t: "mc", q: "___ Ventil ist neu.", o: ["Das", "Der", "Die"], en: "The valve is new.", why: "das Ventil (neuter)." },
  { t: "mc", q: "___ Heizkörper ist kalt.", o: ["Der", "Die", "Das"], en: "The radiator is cold.", why: "der Heizkörper (masculine)." },
  { t: "mc", q: "Das ist ___ Kältemittel.", o: ["ein", "eine", "einer"], en: "That's a refrigerant.", why: "das Kältemittel → ein." },
  { t: "gap", q: "Wir brauchen ___ neue Pumpe.", h: "ein/eine", a: ["eine"], en: "We need a new pump.", why: "die Pumpe → eine (Akkusativ feminine = eine)." },
  { t: "gap", q: "___ Werkzeug liegt im Auto.", h: "der/die/das", a: ["Das"], en: "The tools are in the van.", why: "das Werkzeug." },
  { t: "sb", s: "Das Manometer zeigt zwei bar.", en: "The gauge shows two bar.", why: "das Manometer." },
  { t: "uf", q: "Der Fühler ist kaputt.", task: "Plural", a: ["Die Fühler sind kaputt."], en: "The sensors are broken.", why: "Plural article always die; der Fühler → die Fühler." }
],
"a1-akkusativ": [
  { t: "gap", q: "Ich brauche ___ Schraubenschlüssel.", h: "ein", a: ["einen"], en: "I need a spanner.", why: "der Schraubenschlüssel → Akkusativ einen." },
  { t: "gap", q: "Wir tauschen ___ Thermostatkopf aus.", h: "der", a: ["den"], en: "We're replacing the thermostat head.", why: "der → den in the Akkusativ." },
  { t: "mc", q: "Hast du ___ Bohrer für Beton?", o: ["einen", "ein", "eine"], en: "Have you got a bit for concrete?", why: "der Bohrer → einen." },
  { t: "mc", q: "Der Kunde hat ___ Wasserschaden.", o: ["einen", "ein", "einem"], en: "The customer has water damage.", why: "der Wasserschaden → einen." },
  { t: "sb", s: "Ich sehe den Fehler nicht.", en: "I can't see the fault.", why: "der Fehler → den Fehler." },
  { t: "sb", s: "Wir bestellen einen neuen Speicher.", en: "We're ordering a new tank.", why: "einen neuen Speicher (masculine Akkusativ)." },
  { t: "uf", q: "Ich prüfe die Pumpe.", task: "statt die Pumpe: der Verdichter", a: ["Ich prüfe den Verdichter."], en: "I'm checking the compressor.", why: "der → den." },
  { t: "uf", q: "Siehst du den Monteur?", task: "Ersetze den Monteur durch ein Pronomen", a: ["Siehst du ihn?"], en: "Can you see him?", why: "Masculine Akkusativ pronoun: ihn." }
],
"a1-negation": [
  { t: "mc", q: "Wir haben ___ Ersatzteil.", o: ["kein", "nicht", "keine"], en: "We don't have a spare part.", why: "Noun with ein → kein (das Ersatzteil → kein)." },
  { t: "mc", q: "Der Heizkörper wird ___ warm.", o: ["nicht", "kein", "keinen"], en: "The radiator doesn't get warm.", why: "Adjective → nicht." },
  { t: "gap", q: "Es gibt ___ Warmwasser.", h: "kein", a: ["kein"], en: "There's no hot water.", why: "das Warmwasser → kein." },
  { t: "gap", q: "Ich brauche ___ Leiter.", h: "kein", a: ["keine"], en: "I don't need a ladder.", why: "die Leiter → keine." },
  { t: "sb", s: "Die Pumpe funktioniert nicht.", en: "The pump doesn't work.", why: "nicht after the verb." },
  { t: "sb", s: "Wir haben heute keinen Notdienst.", en: "We're not on emergency call today.", why: "der Notdienst → keinen." },
  { t: "uf", q: "Das Rohr ist dicht.", task: "verneinen", a: ["Das Rohr ist nicht dicht."], en: "The pipe isn't tight.", why: "Adjective → nicht." },
  { t: "uf", q: "Ich habe einen Termin.", task: "verneinen", a: ["Ich habe keinen Termin."], en: "I don't have an appointment.", why: "einen → keinen." }
],
"a1-wortstellung": [
  { t: "sb", s: "Morgen montieren wir die Außeneinheit.", alt: ["Wir montieren morgen die Außeneinheit."], en: "Tomorrow we're installing the outdoor unit.", why: "Time first, verb in position 2." },
  { t: "sb", s: "Im Keller ist es sehr feucht.", alt: ["Es ist im Keller sehr feucht."], en: "It's very damp in the basement.", why: "Verb in position 2." },
  { t: "sb", s: "Zuerst drehe ich das Wasser zu.", alt: ["Ich drehe zuerst das Wasser zu."], en: "First I turn the water off.", why: "Verb 2, prefix zu at the end." },
  { t: "gap", q: "Heute ___ wir den Kessel aus.", h: "bauen", a: ["bauen"], en: "Today we're taking the boiler out.", why: "Verb in position 2 after Heute." },
  { t: "mc", q: "Um acht Uhr ___ der Kunde.", o: ["kommt", "kommen", "kommst"], en: "The customer comes at eight.", why: "Verb in position 2, subject after it." },
  { t: "mc", q: "Danach ___ ich die Filter.", o: ["reinige", "reinigt", "reinigen"], en: "Then I clean the filters.", why: "Danach in position 1 → verb next." },
  { t: "uf", q: "Wir bohren das Loch morgen.", task: "Beginne mit: Morgen", a: ["Morgen bohren wir das Loch."], en: "Tomorrow we'll drill the hole.", why: "Verb stays in position 2." },
  { t: "uf", q: "Die Pumpe läuft seit gestern nicht.", task: "Beginne mit: Seit gestern", a: ["Seit gestern läuft die Pumpe nicht."], en: "The pump hasn't run since yesterday.", why: "Verb in position 2, subject after." }
],
"a1-fragen": [
  { t: "mc", q: "___ ist der Heizungsraum?", o: ["Wo", "Wer", "Wann"], en: "Where's the boiler room?", why: "Place → wo." },
  { t: "mc", q: "___ tropft das Gerät?", o: ["Seit wann", "Wo", "Wer"], en: "Since when has the unit been dripping?", why: "How long → seit wann." },
  { t: "gap", q: "___ viel bar zeigt das Manometer?", h: "W-Wort", a: ["Wie"], en: "How many bar does the gauge show?", why: "wie viel = how much/many." },
  { t: "gap", q: "___ du die Presszange?", h: "haben", a: ["Hast"], en: "Have you got the press tool?", why: "Yes/no question: verb first." },
  { t: "sb", s: "Wann kommt das Ersatzteil?", en: "When is the spare part coming?", why: "W-word, then verb." },
  { t: "sb", s: "Funktioniert die Heizung wieder?", en: "Is the heating working again?", why: "Yes/no question: verb first." },
  { t: "uf", q: "Sie brauchen ein Angebot.", task: "Ja/Nein-Frage", a: ["Brauchen Sie ein Angebot?"], en: "Do you need a quote?", why: "Verb moves to the front." },
  { t: "uf", q: "Der Monteur kommt morgen.", task: "Frage nach: morgen", a: ["Wann kommt der Monteur?"], en: "When is the fitter coming?", why: "Time → wann." }
],
"a1-modal": [
  { t: "gap", q: "Wir ___ das Wasser abstellen.", h: "müssen", a: ["müssen"], en: "We have to turn the water off.", why: "wir müssen + infinitive at the end." },
  { t: "gap", q: "___ du mir kurz helfen?", h: "können", a: ["Kannst"], en: "Can you help me for a moment?", why: "du kannst." },
  { t: "mc", q: "Man ___ das Kältemittel nicht in die Luft lassen.", o: ["darf", "dürft", "dürfen"], en: "You're not allowed to release the refrigerant into the air.", why: "man darf." },
  { t: "mc", q: "Ich möchte eine Wärmepumpe ___.", o: ["kaufen", "kaufe", "gekauft"], en: "I'd like to buy a heat pump.", why: "Modal + infinitive at the end." },
  { t: "sb", s: "Der Speicher muss heute noch in den Keller.", en: "The tank has to go into the basement today.", why: "Modal in position 2." },
  { t: "sb", s: "Ich kann den Fehler nicht finden.", en: "I can't find the fault.", why: "Infinitive at the end." },
  { t: "uf", q: "Ich entlüfte den Heizkörper.", task: "mit müssen", a: ["Ich muss den Heizkörper entlüften."], en: "I have to bleed the radiator.", why: "Modal in position 2, infinitive at the end." },
  { t: "uf", q: "Wir bohren hier.", task: "mit dürfen, verneint", a: ["Wir dürfen hier nicht bohren."], en: "We're not allowed to drill here.", why: "nicht before the infinitive." }
],
"a1-possessiv": [
  { t: "gap", q: "Das ist ___ Werkzeugkoffer.", h: "ich", a: ["mein"], en: "That's my toolbox.", why: "der Werkzeugkoffer → mein." },
  { t: "gap", q: "Wo ist ___ Heizungsraum, Frau Schulz?", h: "Sie", a: ["Ihr"], en: "Where's your boiler room, Mrs Schulz?", why: "Formal Sie → Ihr." },
  { t: "mc", q: "Der Kunde sucht ___ Rechnung.", o: ["seine", "sein", "ihre"], en: "The customer is looking for his invoice.", why: "der Kunde → sein-; die Rechnung → seine." },
  { t: "mc", q: "Die Kundin zeigt mir ___ Bad.", o: ["ihr", "ihre", "sein"], en: "The customer shows me her bathroom.", why: "die Kundin → ihr; das Bad → ihr." },
  { t: "sb", s: "Unser Betrieb hat zwölf Mitarbeiter.", en: "Our firm has twelve employees.", why: "der Betrieb → unser." },
  { t: "sb", s: "Ich nehme meinen Akkuschrauber mit.", en: "I'm taking my cordless driver.", why: "Akkusativ masculine: meinen." },
  { t: "uf", q: "Das ist mein Auftrag.", task: "Plural: Aufträge", a: ["Das sind meine Aufträge."], en: "Those are my jobs.", why: "Plural → meine." },
  { t: "uf", q: "Ich brauche mein Messgerät.", task: "Subjekt: er", a: ["Er braucht sein Messgerät."], en: "He needs his meter.", why: "er → sein." }
],
"a1-trennbar": [
  { t: "gap", q: "Ich ___ die alte Pumpe aus.", h: "austauschen", a: ["tausche"], en: "I'm replacing the old pump.", why: "Prefix aus goes to the end." },
  { t: "gap", q: "Bitte ___ Sie das Wasser ab.", h: "abstellen", a: ["stellen"], en: "Please turn the water off.", why: "Prefix ab at the end." },
  { t: "mc", q: "Wir bauen den Kessel heute ___.", o: ["aus", "ab", "zu"], en: "We're taking the boiler out today.", why: "ausbauen." },
  { t: "mc", q: "Der Elektriker ___ die Wärmepumpe an.", o: ["schließt", "anschließt", "schließen"], en: "The electrician connects the heat pump.", why: "anschließen → schließt … an." },
  { t: "sb", s: "Ich fülle die Anlage mit Wasser nach.", en: "I'm topping up the system with water.", why: "nachfüllen: nach at the end." },
  { t: "sb", s: "Wann schaltest du die Heizung ein?", en: "When are you switching the heating on?", why: "einschalten: ein at the end." },
  { t: "uf", q: "Ich muss das Wasser zudrehen.", task: "ohne müssen", a: ["Ich drehe das Wasser zu."], en: "I turn the water off.", why: "Without a modal the prefix splits off." },
  { t: "uf", q: "Wir bauen eine neue Pumpe ein.", task: "mit können", a: ["Wir können eine neue Pumpe einbauen."], en: "We can fit a new pump.", why: "With a modal the verb stays together at the end." }
],
"a1-imperativ": [
  { t: "gap", q: "___ bitte die Leiter fest! (du, halten)", h: "halten", a: ["Halt", "Halte"], en: "Hold the ladder, please!", why: "du-imperative: halt(e), no vowel change." },
  { t: "gap", q: "___ Sie bitte den Hauptwasserhahn zu! (drehen)", h: "zudrehen", a: ["Drehen"], en: "Please turn off the main stopcock!", why: "Sie-imperative: verb + Sie." },
  { t: "mc", q: "___ mir mal die Zange! (du)", o: ["Gib", "Gibst", "Gebe"], en: "Pass me the pliers!", why: "geben → gib (e → i)." },
  { t: "mc", q: "___ Handschuhe! (ihr)", o: ["Tragt", "Trag", "Trägt"], en: "Wear gloves!", why: "ihr-imperative: ihr-form without ihr." },
  { t: "sb", s: "Schalten Sie bitte die Heizung ab!", en: "Please switch the heating off!", why: "Sie-imperative, prefix at the end." },
  { t: "sb", s: "Pass auf die Kabel auf!", en: "Watch out for the cables!", why: "aufpassen → Pass … auf!" },
  { t: "uf", q: "Du bringst den Werkzeugkoffer mit.", task: "Imperativ (du)", a: ["Bring den Werkzeugkoffer mit!", "Bringe den Werkzeugkoffer mit!"], en: "Bring the toolbox!", why: "Drop du and -st." },
  { t: "uf", q: "Sie lüften das Bad.", task: "Imperativ (Sie)", a: ["Lüften Sie das Bad!"], en: "Air the bathroom!", why: "Verb first, then Sie." }
],
"a1-zeit": [
  { t: "mc", q: "Der Monteur kommt ___ Montag.", o: ["am", "um", "im"], en: "The fitter is coming on Monday.", why: "Days → am." },
  { t: "mc", q: "Die Heizperiode beginnt ___ Oktober.", o: ["im", "am", "um"], en: "The heating season starts in October.", why: "Months → im." },
  { t: "gap", q: "Ich bin ___ 8 Uhr auf der Baustelle.", h: "am/um/im", a: ["um"], en: "I'm on site at 8 o'clock.", why: "Clock time → um." },
  { t: "gap", q: "___ Winter haben wir viele Notrufe.", h: "am/um/im", a: ["Im"], en: "In winter we get lots of emergency calls.", why: "Seasons → im." },
  { t: "sb", s: "Am Freitag ist die Inbetriebnahme.", en: "The commissioning is on Friday.", why: "am + day; verb in position 2." },
  { t: "sb", s: "Die Wartung machen wir im Herbst.", en: "We do the service in autumn.", why: "im + season." },
  { t: "uf", q: "Der Termin ist um 10 Uhr.", task: "statt um 10 Uhr: Dienstag", a: ["Der Termin ist am Dienstag."], en: "The appointment is on Tuesday.", why: "Day → am." },
  { t: "uf", q: "Wir sind im März fertig.", task: "statt März: 15 Uhr", a: ["Wir sind um 15 Uhr fertig."], en: "We'll be finished at 3 pm.", why: "Clock time → um." }
],
"perfekt-hs": [
  { t: "gap", q: "Ich ___ den Fehler gefunden.", h: "haben/sein", a: ["habe"], en: "I've found the fault.", why: "finden + haben." },
  { t: "gap", q: "Der Monteur ___ zum Großhandel gefahren.", h: "haben/sein", a: ["ist"], en: "The fitter has driven to the wholesaler.", why: "Movement → sein." },
  { t: "mc", q: "Das Rohr ___ im Winter geplatzt.", o: ["ist", "hat", "wird"], en: "The pipe burst in winter.", why: "platzen = change of state → sein." },
  { t: "mc", q: "Wir ___ die Anlage geprüft.", o: ["haben", "sind", "hat"], en: "We've checked the system.", why: "prüfen + haben." },
  { t: "sb", s: "Der Kunde hat gestern angerufen.", en: "The customer called yesterday.", why: "Participle at the end." },
  { t: "sb", s: "Das Wasser ist in den Keller gelaufen.", en: "The water ran into the basement.", why: "laufen (movement) → sein." },
  { t: "uf", q: "Ich tausche die Pumpe aus.", task: "im Perfekt", a: ["Ich habe die Pumpe ausgetauscht."], en: "I've replaced the pump.", why: "haben + ausgetauscht." },
  { t: "uf", q: "Die Leitung friert ein.", task: "im Perfekt", a: ["Die Leitung ist eingefroren."], en: "The pipe has frozen.", why: "Change of state → sein." }
],
"partizip": [
  { t: "gap", q: "Hast du das Ventil schon ___?", h: "montieren", a: ["montiert"], en: "Have you fitted the valve yet?", why: "-ieren verbs: no ge-." },
  { t: "gap", q: "Wir haben das Loch ___.", h: "bohren", a: ["gebohrt"], en: "We've drilled the hole.", why: "Regular: ge- … -t." },
  { t: "mc", q: "Ich habe die Anlage ___.", o: ["entlüftet", "geentlüftet", "entlüftt"], en: "I've bled the system.", why: "ent- is inseparable: no ge-." },
  { t: "mc", q: "Er hat den Druck ___.", o: ["gemessen", "gemesst", "messt"], en: "He's measured the pressure.", why: "messen is irregular: gemessen." },
  { t: "sb", s: "Wir haben die Rohre verlegt.", en: "We've laid the pipes.", why: "ver- is inseparable: verlegt." },
  { t: "sb", s: "Der Azubi hat das Werkzeug aufgeräumt.", en: "The apprentice has tidied the tools away.", why: "Separable: auf-ge-räumt." },
  { t: "uf", q: "Ich schließe die Waschmaschine an.", task: "im Perfekt", a: ["Ich habe die Waschmaschine angeschlossen."], en: "I've connected the washing machine.", why: "an-ge-schlossen." },
  { t: "uf", q: "Wir installieren eine Klimaanlage.", task: "im Perfekt", a: ["Wir haben eine Klimaanlage installiert."], en: "We've installed an air conditioning unit.", why: "installiert (no ge-)." }
],
"praeteritum": [
  { t: "gap", q: "Gestern ___ die Heizung kaputt.", h: "sein", a: ["war"], en: "Yesterday the heating was broken.", why: "sein → war." },
  { t: "gap", q: "Wir ___ kein Ersatzteil.", h: "haben", a: ["hatten"], en: "We didn't have a spare part.", why: "haben → hatten." },
  { t: "mc", q: "Ich ___ den Fehler nicht finden.", o: ["konnte", "kann", "konnten"], en: "I couldn't find the fault.", why: "können → konnte." },
  { t: "mc", q: "Der Monteur ___ am Wochenende arbeiten.", o: ["musste", "muss", "müsste"], en: "The fitter had to work at the weekend.", why: "müssen → musste." },
  { t: "sb", s: "Der Keller war voller Wasser.", en: "The basement was full of water.", why: "war in position 2." },
  { t: "sb", s: "Wir mussten den Kessel ausbauen.", en: "We had to take the boiler out.", why: "Modal Präteritum + infinitive." },
  { t: "uf", q: "Ich habe Notdienst.", task: "im Präteritum", a: ["Ich hatte Notdienst."], en: "I was on emergency call.", why: "haben → hatte." },
  { t: "uf", q: "Wir wollen die Pumpe reparieren.", task: "im Präteritum", a: ["Wir wollten die Pumpe reparieren."], en: "We wanted to repair the pump.", why: "wollen → wollten." }
],
"dativ": [
  { t: "gap", q: "Ich gebe ___ Kunden die Rechnung.", h: "der", a: ["dem"], en: "I give the customer the invoice.", why: "der → dem in the Dativ." },
  { t: "gap", q: "Der Meister erklärt ___ die Anlage.", h: "ich", a: ["mir"], en: "The boss explains the system to me.", why: "ich → mir." },
  { t: "mc", q: "Wir zeigen ___ Kundin das Angebot.", o: ["der", "die", "den"], en: "We show the customer the quote.", why: "die → der in the Dativ." },
  { t: "mc", q: "Ich schicke ___ eine E-Mail. (Herr Klein)", o: ["ihm", "ihn", "er"], en: "I'll send him an email.", why: "Dativ masculine pronoun: ihm." },
  { t: "sb", s: "Ich bringe dem Monteur die Rohre.", en: "I'm bringing the fitter the pipes.", why: "dem Monteur = Dativ (person)." },
  { t: "sb", s: "Kannst du mir die Zange geben?", en: "Can you give me the pliers?", why: "mir = Dativ." },
  { t: "uf", q: "Ich gebe dem Azubi den Schlüssel.", task: "Ersetze dem Azubi durch ein Pronomen", a: ["Ich gebe ihm den Schlüssel."], en: "I give him the key.", why: "dem Azubi → ihm." },
  { t: "uf", q: "Wir erklären dem Kunden die Regelung.", task: "Plural: die Kunden", a: ["Wir erklären den Kunden die Regelung."], en: "We explain the controls to the customers.", why: "Dativ plural: den Kunden." }
],
"dativverben": [
  { t: "gap", q: "Kannst du ___ helfen? Der Speicher ist schwer.", h: "ich", a: ["mir"], en: "Can you help me? The tank is heavy.", why: "helfen + Dativ." },
  { t: "gap", q: "Das Werkzeug gehört ___ Firma.", h: "die", a: ["der"], en: "The tools belong to the firm.", why: "gehören + Dativ: der Firma." },
  { t: "mc", q: "Die neue Wärmepumpe gefällt ___ Kunden sehr.", o: ["den", "die", "der"], en: "The customers really like the new heat pump.", why: "gefallen + Dativ; plural Dativ: den Kunden." },
  { t: "mc", q: "Ich danke ___ für den Auftrag.", o: ["Ihnen", "Sie", "Ihr"], en: "Thank you for the job.", why: "danken + Dativ." },
  { t: "sb", s: "Der Meister hilft dem Azubi.", en: "The boss helps the apprentice.", why: "helfen + Dativ." },
  { t: "sb", s: "Die Lautstärke gefällt dem Nachbarn nicht.", en: "The neighbour doesn't like the noise.", why: "gefallen + Dativ; Nachbar → dem Nachbarn." },
  { t: "uf", q: "Ich helfe dem Kollegen.", task: "Pronomen statt dem Kollegen", a: ["Ich helfe ihm."], en: "I'm helping him.", why: "Dativ: ihm." },
  { t: "uf", q: "Das Auto gehört mir.", task: "Subjekt: die Rohre", a: ["Die Rohre gehören mir."], en: "The pipes belong to me.", why: "Plural verb, Dativ stays." }
],
"dativpraep": [
  { t: "gap", q: "Ich arbeite seit drei Jahren ___ einer SHK-Firma.", h: "bei/mit", a: ["bei"], en: "I've worked at an SHK firm for three years.", why: "bei + Dativ: at a company." },
  { t: "gap", q: "Wir fahren ___ Baustelle.", h: "zu + die", a: ["zur"], en: "We're driving to the site.", why: "zu der → zur." },
  { t: "mc", q: "Ich löse die Mutter ___ dem Schraubenschlüssel.", o: ["mit", "bei", "von"], en: "I loosen the nut with the spanner.", why: "mit = with (tool)." },
  { t: "mc", q: "Das Wasser kommt ___ dem Brunnen.", o: ["aus", "zu", "nach"], en: "The water comes from the well.", why: "aus = out of." },
  { t: "sb", s: "Nach der Wartung schreibe ich das Protokoll.", en: "After the service I write the report.", why: "nach + Dativ." },
  { t: "sb", s: "Seit dem Winter ist die Pumpe laut.", en: "The pump has been loud since the winter.", why: "seit + Dativ." },
  { t: "uf", q: "Ich fahre zum Großhandel.", task: "statt Großhandel: die Firma", a: ["Ich fahre zur Firma."], en: "I'm driving to the firm.", why: "zu + die → zur." },
  { t: "uf", q: "Ich komme vom Kunden.", task: "statt Kunden: die Baustelle", a: ["Ich komme von der Baustelle."], en: "I'm coming from the site.", why: "von + der (Dativ feminine)." }
],
"wechsel": [
  { t: "mc", q: "Die Heizung steht ___ Keller.", o: ["im", "in den", "ins"], en: "The heating is in the basement.", why: "Wo? → Dativ: im." },
  { t: "mc", q: "Wir tragen den Speicher ___ Keller.", o: ["in den", "im", "in dem"], en: "We're carrying the tank into the basement.", why: "Wohin? → Akkusativ: in den." },
  { t: "gap", q: "Das Gerät hängt an ___ Wand.", h: "die", a: ["der"], en: "The unit is hanging on the wall.", why: "Wo? → Dativ: an der Wand." },
  { t: "gap", q: "Ich hänge das Gerät an ___ Wand.", h: "die", a: ["die"], en: "I'm hanging the unit on the wall.", why: "Wohin? → Akkusativ: an die Wand." },
  { t: "sb", s: "Die Leitungen liegen unter dem Estrich.", en: "The pipes are under the screed.", why: "Wo? → Dativ." },
  { t: "sb", s: "Stell die Leiter neben die Tür.", en: "Put the ladder next to the door.", why: "Wohin? → Akkusativ." },
  { t: "uf", q: "Das Werkzeug liegt im Auto.", task: "mit legen (Wohin?)", a: ["Ich lege das Werkzeug ins Auto."], en: "I put the tools in the van.", why: "Wohin? → ins (in das)." },
  { t: "uf", q: "Ich stelle die Außeneinheit hinter die Garage.", task: "mit stehen (Wo?)", a: ["Die Außeneinheit steht hinter der Garage."], en: "The outdoor unit is behind the garage.", why: "Wo? → Dativ: hinter der." }
],
"nebensatz": [
  { t: "sb", s: "Der Heizkörper ist kalt, weil Luft im System ist.", en: "The radiator is cold because there's air in the system.", why: "weil: verb at the end." },
  { t: "sb", s: "Ich glaube, dass die Pumpe kaputt ist.", en: "I think the pump is broken.", why: "dass: verb at the end." },
  { t: "sb", s: "Rufen Sie an, wenn das Gerät wieder tropft.", en: "Call if the unit drips again.", why: "wenn: verb at the end." },
  { t: "mc", q: "Ich weiß nicht, ___ das Ersatzteil heute kommt.", o: ["ob", "dass", "wenn"], en: "I don't know whether the part is coming today.", why: "Yes/no uncertainty → ob." },
  { t: "mc", q: "Wir können nicht anfangen, ___ der Strom noch an ist.", o: ["weil", "denn", "dass"], en: "We can't start because the power's still on.", why: "weil + verb at the end (ist)." },
  { t: "gap", q: "Der Kunde sagt, dass die Heizung laut ___.", h: "sein", a: ["ist"], en: "The customer says the heating is loud.", why: "dass: verb at the end." },
  { t: "uf", q: "Ich komme später. Das Ersatzteil fehlt.", task: "mit weil verbinden", a: ["Ich komme später, weil das Ersatzteil fehlt."], en: "I'm coming later because the spare part is missing.", why: "weil sends fehlt to the end." },
  { t: "uf", q: "Die Leitung ist undicht. Ich vermute es.", task: "Ich vermute, dass …", a: ["Ich vermute, dass die Leitung undicht ist."], en: "I suspect the pipe is leaking.", why: "dass: verb at the end." }
],
"reflexiv": [
  { t: "gap", q: "Der Kunde beschwert ___ über den Lärm.", h: "sich", a: ["sich"], en: "The customer is complaining about the noise.", why: "er → sich." },
  { t: "gap", q: "Ich interessiere ___ für Wärmepumpen.", h: "sich", a: ["mich"], en: "I'm interested in heat pumps.", why: "ich → mich." },
  { t: "mc", q: "Wir treffen ___ um sieben im Betrieb.", o: ["uns", "sich", "euch"], en: "We're meeting at seven at the firm.", why: "wir → uns." },
  { t: "mc", q: "Hast du ___ verletzt?", o: ["dich", "dir", "sich"], en: "Have you hurt yourself?", why: "du → dich (Akkusativ)." },
  { t: "sb", s: "Ich kümmere mich um die Ersatzteile.", en: "I'll take care of the spare parts.", why: "sich kümmern um." },
  { t: "sb", s: "Die Kunden freuen sich über die Förderung.", en: "The customers are pleased about the grant.", why: "sich freuen über." },
  { t: "uf", q: "Ich melde mich morgen.", task: "Subjekt: der Meister", a: ["Der Meister meldet sich morgen."], en: "The boss will get in touch tomorrow.", why: "er → sich." },
  { t: "uf", q: "Er bewirbt sich bei einer SHK-Firma.", task: "Subjekt: ich", a: ["Ich bewerbe mich bei einer SHK-Firma."], en: "I'm applying to an SHK firm.", why: "ich → mich." }
],
"adjektiv": [
  { t: "gap", q: "Wir bauen eine neu___ Pumpe ein.", h: "Endung", a: ["e"], en: "We're fitting a new pump.", why: "eine neue (Akkusativ feminine)." },
  { t: "gap", q: "Der alt___ Kessel muss raus.", h: "Endung", a: ["e"], en: "The old boiler has to go.", why: "der alte (Nominativ, der-word)." },
  { t: "mc", q: "Ich brauche einen ___ Schraubendreher.", o: ["kleinen", "kleine", "kleiner"], en: "I need a small screwdriver.", why: "einen kleinen (Akkusativ masculine)." },
  { t: "mc", q: "Das ist ein sehr ___ Gerät.", o: ["leises", "leise", "leisen"], en: "That's a very quiet unit.", why: "ein leises (neuter, ein-word)." },
  { t: "sb", s: "Mit dem neuen Filter ist die Luft sauber.", en: "With the new filter the air is clean.", why: "dem neuen (Dativ)." },
  { t: "sb", s: "Wir tauschen die alten Heizkörper aus.", en: "We're replacing the old radiators.", why: "die alten (plural)." },
  { t: "uf", q: "Das Rohr ist geplatzt.", task: "Wir tauschen das … Rohr aus.", a: ["Wir tauschen das geplatzte Rohr aus."], en: "We're replacing the burst pipe.", why: "das geplatzte (Akkusativ neuter, der-word)." },
  { t: "uf", q: "Die Wärmepumpe ist effizient.", task: "Das ist eine … Wärmepumpe.", a: ["Das ist eine effiziente Wärmepumpe."], en: "That's an efficient heat pump.", why: "eine effiziente." }
],
"komparativ": [
  { t: "gap", q: "Die neue Pumpe ist ___ als die alte.", h: "leise", a: ["leiser"], en: "The new pump is quieter than the old one.", why: "leise → leiser." },
  { t: "gap", q: "Eine Wärmepumpe ist ___ als eine Gasheizung.", h: "effizient", a: ["effizienter"], en: "A heat pump is more efficient than a gas boiler.", why: "Komparativ -er + als." },
  { t: "mc", q: "Im Januar ist der Verbrauch am ___.", o: ["höchsten", "hoch", "höher"], en: "Consumption is highest in January.", why: "hoch → am höchsten." },
  { t: "mc", q: "Kupfer ist teurer ___ Kunststoff.", o: ["als", "wie", "dann"], en: "Copper is more expensive than plastic.", why: "Komparativ + als." },
  { t: "sb", s: "Die Fußbodenheizung ist besser für die Wärmepumpe.", en: "Underfloor heating is better for the heat pump.", why: "gut → besser." },
  { t: "sb", s: "Dieses Gerät ist genauso laut wie ein Kühlschrank.", en: "This unit is just as loud as a fridge.", why: "genauso … wie." },
  { t: "uf", q: "Das Kunststoffrohr ist leicht.", task: "Komparativ mit als das Kupferrohr", a: ["Das Kunststoffrohr ist leichter als das Kupferrohr."], en: "Plastic pipe is lighter than copper pipe.", why: "leicht → leichter als." },
  { t: "uf", q: "Diese Wärmepumpe ist leise.", task: "Superlativ", a: ["Diese Wärmepumpe ist am leisesten."], en: "This heat pump is the quietest.", why: "leise → am leisesten." }
],
"konjunktiv": [
  { t: "gap", q: "___ Sie morgen um acht Zeit?", h: "haben", a: ["Hätten"], en: "Would you have time tomorrow at eight?", why: "Polite: hätten." },
  { t: "gap", q: "Ich ___ gern einen Kostenvoranschlag.", h: "haben", a: ["hätte"], en: "I'd like a cost estimate.", why: "ich hätte gern." },
  { t: "mc", q: "___ Sie mir bitte die Tür aufmachen?", o: ["Könnten", "Können", "Konnten"], en: "Could you open the door for me, please?", why: "Polite request: könnten." },
  { t: "mc", q: "Wenn ich eine eigene Firma hätte, ___ ich Wärmepumpen verkaufen.", o: ["würde", "werde", "wurde"], en: "If I had my own firm, I'd sell heat pumps.", why: "würde + infinitive." },
  { t: "sb", s: "Es wäre gut, wenn Sie die Heizung ausschalten würden.", en: "It would be good if you switched the heating off.", why: "wäre … würden." },
  { t: "sb", s: "An Ihrer Stelle würde ich die Rohre dämmen.", en: "If I were you, I'd insulate the pipes.", why: "Advice: würde + infinitive." },
  { t: "uf", q: "Können Sie mir helfen?", task: "höflicher", a: ["Könnten Sie mir helfen?"], en: "Could you help me?", why: "können → könnten." },
  { t: "uf", q: "Ich habe mehr Zeit.", task: "Wunsch: Wenn ich doch …", a: ["Wenn ich doch mehr Zeit hätte!"], en: "If only I had more time!", why: "hätte, verb at the end." }
],
"b1-praeteritum": [
  { t: "gap", q: "Der Monteur ___ um sieben zur Baustelle.", h: "fahren", a: ["fuhr"], en: "The fitter drove to the site at seven.", why: "fahren → fuhr." },
  { t: "gap", q: "Das Wasser ___ unter der Tür durch.", h: "fließen", a: ["floss"], en: "The water flowed under the door.", why: "fließen → floss." },
  { t: "mc", q: "Wir ___ das Leck nach zwei Stunden.", o: ["fanden", "findeten", "fandet"], en: "We found the leak after two hours.", why: "finden → fanden." },
  { t: "mc", q: "Der Kunde ___ am Abend an.", o: ["rief", "rufte", "ruf"], en: "The customer rang in the evening.", why: "anrufen → rief … an." },
  { t: "sb", s: "Ich prüfte zuerst den Druck.", en: "First I checked the pressure.", why: "Regular Präteritum: prüfte." },
  { t: "sb", s: "Das Rohr brach bei minus zehn Grad.", en: "The pipe broke at minus ten degrees.", why: "brechen → brach." },
  { t: "uf", q: "Der Meister kommt um acht.", task: "im Präteritum", a: ["Der Meister kam um acht."], en: "The boss came at eight.", why: "kommen → kam." },
  { t: "uf", q: "Wir bauen den Kessel aus.", task: "im Präteritum", a: ["Wir bauten den Kessel aus."], en: "We took the boiler out.", why: "bauten … aus." }
],
"b1-plusquam": [
  { t: "gap", q: "Nachdem wir das Wasser abgestellt ___, öffneten wir das Rohr.", h: "haben", a: ["hatten"], en: "After we had turned the water off, we opened the pipe.", why: "Plusquamperfekt: hatten + participle." },
  { t: "gap", q: "Das Rohr ___ schon in der Nacht geplatzt.", h: "sein", a: ["war"], en: "The pipe had already burst in the night.", why: "platzen → war geplatzt." },
  { t: "mc", q: "Der Kunde ___ den Fehlercode nicht aufgeschrieben.", o: ["hatte", "war", "hat"], en: "The customer hadn't written down the error code.", why: "aufschreiben + haben → hatte." },
  { t: "mc", q: "Als ich ankam, ___ der Kollege schon gegangen.", o: ["war", "hatte", "ist"], en: "When I arrived, my colleague had already left.", why: "gehen + sein → war gegangen." },
  { t: "sb", s: "Wir hatten die Leitungen vorher geprüft.", en: "We had checked the lines beforehand.", why: "hatte + participle at the end." },
  { t: "sb", s: "Der Keller war mit Wasser vollgelaufen.", en: "The basement had filled with water.", why: "volllaufen + sein → war vollgelaufen." },
  { t: "uf", q: "Ich habe das Ersatzteil bestellt.", task: "im Plusquamperfekt", a: ["Ich hatte das Ersatzteil bestellt."], en: "I had ordered the spare part.", why: "habe → hatte." },
  { t: "uf", q: "Die Leitung ist eingefroren.", task: "im Plusquamperfekt", a: ["Die Leitung war eingefroren."], en: "The pipe had frozen.", why: "ist → war." }
],
"b1-passiv": [
  { t: "gap", q: "Die Wärmepumpe ___ morgen montiert.", h: "werden", a: ["wird"], en: "The heat pump is being installed tomorrow.", why: "Passiv: wird + participle." },
  { t: "gap", q: "Die Heizung ___ letztes Jahr gewartet.", h: "werden", a: ["wurde"], en: "The heating was serviced last year.", why: "Past passive: wurde." },
  { t: "mc", q: "Die Rohre ___ mit Stickstoff abgedrückt.", o: ["werden", "wird", "sind"], en: "The pipes are pressure-tested with nitrogen.", why: "Plural: werden." },
  { t: "mc", q: "Das alte Kältemittel muss abgesaugt ___.", o: ["werden", "wird", "worden"], en: "The old refrigerant has to be recovered.", why: "Modal + participle + werden." },
  { t: "sb", s: "Der Fehler wurde schnell gefunden.", en: "The fault was found quickly.", why: "wurde … gefunden." },
  { t: "sb", s: "Hier wird gerade ein Bad saniert.", en: "A bathroom is being renovated here.", why: "wird … saniert." },
  { t: "uf", q: "Wir tauschen die Pumpe aus.", task: "im Passiv (Präsens)", a: ["Die Pumpe wird ausgetauscht."], en: "The pump is being replaced.", why: "Object becomes subject: wird ausgetauscht." },
  { t: "uf", q: "Der Elektriker schloss die Anlage an.", task: "im Passiv (Präteritum)", a: ["Die Anlage wurde angeschlossen.", "Die Anlage wurde vom Elektriker angeschlossen."], en: "The system was connected (by the electrician).", why: "wurde + angeschlossen." }
],
"b1-relativ": [
  { t: "gap", q: "Das ist die Pumpe, ___ kaputt ist.", h: "Relativpronomen", a: ["die"], en: "That's the pump that's broken.", why: "die Pumpe → die (Nominativ)." },
  { t: "gap", q: "Der Kunde, ___ ich gestern geholfen habe, ruft wieder an.", h: "Relativpronomen", a: ["dem"], en: "The customer I helped yesterday is calling again.", why: "helfen + Dativ → dem." },
  { t: "mc", q: "Das ist das Werkzeug, ___ ich die Rohre schneide.", o: ["mit dem", "mit das", "das"], en: "That's the tool I cut the pipes with.", why: "mit + Dativ neuter → mit dem." },
  { t: "mc", q: "Wo ist der Schlüssel, ___ du gestern hattest?", o: ["den", "der", "dem"], en: "Where's the key you had yesterday?", why: "haben + Akkusativ → den." },
  { t: "sb", s: "Das ist der Monteur, der die Anlage gebaut hat.", en: "That's the fitter who built the system.", why: "Relative clause: verb at the end." },
  { t: "sb", s: "Die Firma, bei der ich arbeite, sucht Azubis.", en: "The firm I work for is looking for apprentices.", why: "bei + der (Dativ feminine)." },
  { t: "uf", q: "Das ist der Heizkörper. Er wird nicht warm.", task: "mit Relativsatz verbinden", a: ["Das ist der Heizkörper, der nicht warm wird."], en: "That's the radiator that doesn't get warm.", why: "der, verb at the end." },
  { t: "uf", q: "Hier ist das Ersatzteil. Wir haben es bestellt.", task: "mit Relativsatz verbinden", a: ["Hier ist das Ersatzteil, das wir bestellt haben."], en: "Here's the spare part we ordered.", why: "das (Akkusativ neuter), verb at the end." }
],
"b1-genitiv": [
  { t: "gap", q: "Die Leistung ___ Wärmepumpe ist zu klein.", h: "die", a: ["der"], en: "The output of the heat pump is too small.", why: "Genitiv feminine: der." },
  { t: "gap", q: "Wegen ___ Frosts sind die Rohre geplatzt.", h: "der", a: ["des"], en: "Because of the frost the pipes burst.", why: "wegen + Genitiv: des Frosts." },
  { t: "mc", q: "Während ___ Wartung bleibt die Heizung aus.", o: ["der", "die", "den"], en: "During the service the heating stays off.", why: "während + Genitiv: der Wartung." },
  { t: "mc", q: "Das ist das Typenschild ___ Geräts.", o: ["des", "der", "dem"], en: "That's the unit's rating plate.", why: "das Gerät → des Geräts." },
  { t: "sb", s: "Trotz des Regens arbeiten wir draußen.", en: "Despite the rain we're working outside.", why: "trotz + Genitiv." },
  { t: "sb", s: "Der Druck des Systems ist zu niedrig.", en: "The system pressure is too low.", why: "des Systems." },
  { t: "uf", q: "Wegen dem Ersatzteil kommen wir später.", task: "korrekt mit Genitiv", a: ["Wegen des Ersatzteils kommen wir später."], en: "Because of the spare part we're coming later.", why: "wegen + Genitiv: des Ersatzteils." },
  { t: "uf", q: "Der Kunde hat ein Bad. Das Bad ist alt.", task: "mit Genitiv: Das Bad …", a: ["Das Bad des Kunden ist alt."], en: "The customer's bathroom is old.", why: "der Kunde → des Kunden (n-noun)." }
],
"b1-konj2past": [
  { t: "gap", q: "Wenn du das Wasser abgestellt ___, wäre das nicht passiert.", h: "haben", a: ["hättest"], en: "If you had turned off the water, that wouldn't have happened.", why: "hättest + participle." },
  { t: "gap", q: "Ohne die Dämmung ___ die Leitung eingefroren.", h: "sein", a: ["wäre"], en: "Without the insulation the pipe would have frozen.", why: "einfrieren + sein → wäre eingefroren." },
  { t: "mc", q: "Wir ___ früher anfangen sollen.", o: ["hätten", "wären", "würden"], en: "We should have started earlier.", why: "hätten … sollen." },
  { t: "mc", q: "Fast ___ ich vom Dach gefallen!", o: ["wäre", "hätte", "würde"], en: "I almost fell off the roof!", why: "fallen + sein → wäre gefallen." },
  { t: "sb", s: "Ich hätte das Ersatzteil früher bestellen sollen.", en: "I should have ordered the spare part earlier.", why: "hätte + infinitive + sollen." },
  { t: "sb", s: "Mit einem Rückschlagventil wäre das Wasser nicht zurückgelaufen.", en: "With a non-return valve the water wouldn't have flowed back.", why: "wäre … zurückgelaufen." },
  { t: "uf", q: "Ich habe den Fehler nicht gefunden.", task: "Wunsch: Wenn ich doch …", a: ["Wenn ich doch den Fehler gefunden hätte!"], en: "If only I'd found the fault!", why: "hätte at the end." },
  { t: "uf", q: "Wir sind zu spät gekommen.", task: "Wir … früher …", a: ["Wir wären früher gekommen."], en: "We would have come earlier.", why: "kommen + sein → wären gekommen." }
],
"b1-zuinf": [
  { t: "gap", q: "Vergiss nicht, den Strom ___ (abschalten).", h: "zu + Infinitiv", a: ["abzuschalten"], en: "Don't forget to switch off the power.", why: "Separable: ab-zu-schalten." },
  { t: "gap", q: "Wir brauchen die Pumpe, ___ den Keller leer zu pumpen.", h: "um/damit", a: ["um"], en: "We need the pump to pump the basement dry.", why: "um … zu = in order to." },
  { t: "mc", q: "Es ist wichtig, Handschuhe ___.", o: ["zu tragen", "tragen", "trägt"], en: "It's important to wear gloves.", why: "Es ist wichtig + zu + infinitive." },
  { t: "mc", q: "Ich habe keine Zeit, die Filter ___.", o: ["zu reinigen", "reinigen zu", "gereinigt"], en: "I don't have time to clean the filters.", why: "zu before the infinitive." },
  { t: "sb", s: "Ich versuche, den Fehler zu finden.", en: "I'm trying to find the fault.", why: "versuchen + zu." },
  { t: "sb", s: "Wir bohren ein Loch, um die Leitung durchzuführen.", en: "We're drilling a hole to run the line through.", why: "um … zu, separable: durchzuführen." },
  { t: "uf", q: "Ich fahre zum Großhandel. Ich hole Rohre.", task: "mit um … zu", a: ["Ich fahre zum Großhandel, um Rohre zu holen."], en: "I'm going to the wholesaler to get pipes.", why: "um … zu holen." },
  { t: "uf", q: "Bitte rufen Sie mich an.", task: "Ich bitte Sie, …", a: ["Ich bitte Sie, mich anzurufen."], en: "I'm asking you to call me.", why: "anrufen → anzurufen." }
],
"b1-zeitkonn": [
  { t: "mc", q: "___ ich ankam, war der Keller schon nass.", o: ["Als", "Wenn", "Wann"], en: "When I arrived, the basement was already wet.", why: "One event in the past → als." },
  { t: "mc", q: "___ das Wasser steigt, schaltet die Pumpe ein.", o: ["Wenn", "Als", "Nachdem"], en: "When the water rises, the pump switches on.", why: "Every time / present → wenn." },
  { t: "gap", q: "___ wir die Rohre verpresst haben, machen wir die Druckprüfung.", h: "nachdem/bevor", a: ["Nachdem"], en: "After we've pressed the pipes, we do the pressure test.", why: "nachdem = after." },
  { t: "gap", q: "Schalten Sie den Strom ab, ___ Sie das Gerät öffnen.", h: "nachdem/bevor", a: ["bevor"], en: "Switch off the power before you open the unit.", why: "bevor = before." },
  { t: "sb", s: "Während der Estrich trocknet, arbeiten wir im Bad.", en: "While the screed dries, we work in the bathroom.", why: "während: verb at the end, then main verb first." },
  { t: "sb", s: "Bevor ich gehe, schreibe ich das Protokoll.", en: "Before I leave, I write the report.", why: "Subordinate clause first → verb, verb." },
  { t: "uf", q: "Ich entlüfte den Heizkörper. Danach fülle ich Wasser nach.", task: "mit nachdem", a: ["Nachdem ich den Heizkörper entlüftet habe, fülle ich Wasser nach."], en: "After I've bled the radiator, I top up the water.", why: "nachdem + Perfekt, verb at the end." },
  { t: "uf", q: "Ich war Azubi. Ich habe viel gelernt.", task: "mit als", a: ["Als ich Azubi war, habe ich viel gelernt."], en: "When I was an apprentice, I learned a lot.", why: "als: verb at the end; main clause starts with the verb." }
],
"b1-konnektoren": [
  { t: "mc", q: "Die Anlage ist neu, ___ funktioniert sie nicht.", o: ["trotzdem", "obwohl", "deshalb"], en: "The system is new, but it still doesn't work.", why: "trotzdem + verb next." },
  { t: "mc", q: "___ es kalt war, haben wir draußen gearbeitet.", o: ["Obwohl", "Trotzdem", "Deshalb"], en: "Although it was cold, we worked outside.", why: "obwohl + verb at the end." },
  { t: "gap", q: "Der Druck ist zu niedrig, ___ fülle ich Wasser nach.", h: "deshalb/obwohl", a: ["deshalb"], en: "The pressure is too low, so I'm topping up water.", why: "deshalb = result, verb next." },
  { t: "gap", q: "Wir dämmen die Rohre, ___ sie im Winter nicht einfrieren.", h: "damit/um", a: ["damit"], en: "We insulate the pipes so that they don't freeze in winter.", why: "Different subject → damit." },
  { t: "sb", s: "Das Gerät ist teuer, trotzdem kaufen viele Kunden es.", en: "The unit is expensive, but many customers buy it anyway.", why: "trotzdem in position 1 → verb next." },
  { t: "sb", s: "Ich nehme eine Schutzbrille, damit nichts ins Auge kommt.", en: "I take goggles so nothing gets in my eye.", why: "damit: verb at the end." },
  { t: "uf", q: "Der Kunde spart Geld. Er hat eine Wärmepumpe.", task: "mit deshalb: Er hat …", a: ["Er hat eine Wärmepumpe, deshalb spart er Geld."], en: "He has a heat pump, so he saves money.", why: "deshalb + verb + subject." },
  { t: "uf", q: "Die Pumpe läuft. Es kommt kein Wasser.", task: "mit obwohl", a: ["Obwohl die Pumpe läuft, kommt kein Wasser.", "Es kommt kein Wasser, obwohl die Pumpe läuft."], en: "Although the pump is running, no water is coming.", why: "obwohl: verb at the end." }
],
"b1-zweiteilig": [
  { t: "mc", q: "Wir nehmen ___ eine Wärmepumpe ___ eine Hybridheizung.", o: ["entweder … oder", "weder … noch", "sowohl … als auch"], en: "We'll take either a heat pump or a hybrid system.", why: "Choice → entweder … oder." },
  { t: "mc", q: "Je besser die Dämmung ist, ___ weniger Energie braucht man.", o: ["desto", "als", "so"], en: "The better the insulation, the less energy you need.", why: "je … desto." },
  { t: "gap", q: "Das Gerät ist ___ leise als auch effizient.", h: "zweiteilig", a: ["sowohl"], en: "The unit is both quiet and efficient.", why: "sowohl … als auch." },
  { t: "gap", q: "Es gibt ___ Strom noch Wasser.", h: "zweiteilig", a: ["weder"], en: "There's neither electricity nor water.", why: "weder … noch." },
  { t: "sb", s: "Je niedriger die Vorlauftemperatur ist, desto effizienter läuft die Wärmepumpe.", en: "The lower the flow temperature, the more efficiently the heat pump runs.", why: "je + verb at the end, desto + verb next." },
  { t: "sb", s: "Wir brauchen nicht nur Rohre, sondern auch Fittings.", en: "We need not only pipes but also fittings.", why: "nicht nur … sondern auch." },
  { t: "uf", q: "Ich komme heute nicht. Mein Kollege kommt auch nicht.", task: "mit weder … noch", a: ["Weder ich noch mein Kollege kommt heute.", "Weder ich noch mein Kollege kommen heute."], en: "Neither I nor my colleague is coming today.", why: "weder … noch." },
  { t: "uf", q: "Die Anlage ist alt. Sie verbraucht viel.", task: "mit je … desto: älter / mehr", a: ["Je älter die Anlage ist, desto mehr verbraucht sie."], en: "The older the system, the more it uses.", why: "je … ist, desto … verbraucht sie." }
],
"b1-praepverben": [
  { t: "gap", q: "Ich warte ___ das Ersatzteil.", h: "Präposition", a: ["auf"], en: "I'm waiting for the spare part.", why: "warten auf + Akkusativ." },
  { t: "gap", q: "Der Kunde beschwert sich ___ den Lärm.", h: "Präposition", a: ["über"], en: "The customer is complaining about the noise.", why: "sich beschweren über." },
  { t: "mc", q: "Ich kümmere mich ___ die Förderung.", o: ["um", "für", "über"], en: "I'll take care of the grant.", why: "sich kümmern um." },
  { t: "mc", q: "___ interessierst du dich? – Für Kältetechnik.", o: ["Wofür", "Worüber", "Für was"], en: "What are you interested in? – Refrigeration.", why: "sich interessieren für → wofür." },
  { t: "sb", s: "Achten Sie bitte auf die Kabel.", en: "Please watch out for the cables.", why: "achten auf." },
  { t: "sb", s: "Ich frage den Meister nach dem Fehlercode.", en: "I'll ask the boss about the error code.", why: "fragen nach + Dativ." },
  { t: "uf", q: "Ich denke an die Wartung.", task: "Ersetze an die Wartung", a: ["Ich denke daran."], en: "I'm thinking about it.", why: "Thing → da(r) + Präposition: daran." },
  { t: "uf", q: "Er spricht über die neue Anlage.", task: "Frage danach", a: ["Worüber spricht er?"], en: "What is he talking about?", why: "Thing → wo(r) + Präposition: worüber." }
],
"b1-futur": [
  { t: "gap", q: "Morgen ___ wir die Anlage in Betrieb nehmen.", h: "werden", a: ["werden"], en: "Tomorrow we'll commission the system.", why: "Futur: werden + infinitive." },
  { t: "gap", q: "Ich spreche mit dem ___. (der Kollege)", h: "n-Deklination", a: ["Kollegen"], en: "I'm talking to my colleague.", why: "n-noun: dem Kollegen." },
  { t: "mc", q: "Der Monteur ___ in einer Stunde da sein.", o: ["wird", "werdet", "wurde"], en: "The fitter will be there in an hour.", why: "er wird." },
  { t: "mc", q: "Haben Sie den ___ schon gefragt? (der Kunde)", o: ["Kunden", "Kunde", "Kundes"], en: "Have you asked the customer yet?", why: "n-noun: den Kunden." },
  { t: "sb", s: "In Zukunft werden viele Häuser mit Wärmepumpen heizen.", en: "In future many houses will heat with heat pumps.", why: "werden + infinitive at the end." },
  { t: "sb", s: "Der Azubi hilft dem Kollegen beim Tragen.", en: "The apprentice helps the colleague carry things.", why: "dem Kollegen (n-noun)." },
  { t: "uf", q: "Ich rufe den Kunden an.", task: "im Futur I", a: ["Ich werde den Kunden anrufen."], en: "I'll call the customer.", why: "werde + anrufen." },
  { t: "uf", q: "Das Ersatzteil kommt am Montag.", task: "im Futur I", a: ["Das Ersatzteil wird am Montag kommen."], en: "The spare part will come on Monday.", why: "wird + kommen." }
]
};
