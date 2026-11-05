/* Handwerker-Modus (SHK): speaking tasks, writing tasks, Redemittel and Frage-Pingpong questions
   from the trade (heat pumps, heating, AC & ventilation, water & pumps, site and customers).
   Loaded right after aktiv-data.js, before aktiv.js. Same formats as aktiv-data.js / fluency-data.js.
   Always available; when the mode is on, the "beruf" categories are listed first. */

SP_CATS.beruf = ["Im Beruf (SHK)", "On the job (SHK)"];
SP_PHR.beruf = ["kunde", "fehler", "nachfragen", "bitten"];
SW_CATS.beruf = ["Beruf (SHK)", "On the job (SHK)"];
SW_PHR.beruf = ["mail_form", "kunde", "fehler"];

SPRECHEN.push(
{id:"shk_notruf", cat:"beruf", type:"dlg", t:["Notruf: Die Heizung ist kalt","Emergency call: the heating is cold"],
 sit:["Du hast Notdienst. Eine Kundin ruft an, weil ihre Heizung nicht mehr warm wird.","You're on emergency call. A customer rings because her heating isn't getting warm any more."],
 turns:[
  {p:"Guten Abend, hier ist Frau Schulz. Unsere Heizung ist seit heute Mittag kalt, und wir haben ein kleines Baby!", h:["Stell dich vor und frag, was genau passiert ist.","Introduce yourself and ask what exactly happened."], m:"Guten Abend, Frau Schulz, hier ist Damian vom Notdienst. Können Sie mir sagen, was genau passiert ist?"},
  {p:"Ich weiß nicht. Die Heizkörper sind alle kalt, und auf dem Display blinkt etwas.", h:["Frag nach dem Fehlercode und nach dem Druck am Manometer.","Ask about the error code and the pressure on the gauge."], m:"Welcher Fehlercode steht auf dem Display? Und können Sie bitte auf das Manometer schauen? Wie viel bar zeigt es?"},
  {p:"Da steht F22, und die Nadel ist fast bei null.", h:["Erklär, dass der Druck zu niedrig ist, und sag, dass du kommst.","Explain that the pressure is too low and say you're coming."], m:"Dann ist der Druck in der Anlage zu niedrig. Das kann ich schnell beheben. Ich bin in etwa vierzig Minuten bei Ihnen."},
  {p:"Vierzig Minuten? Was kann ich bis dahin machen?", h:["Gib einen einfachen Tipp und frag nach der Adresse.","Give a simple tip and ask for the address."], m:"Bitte schalten Sie die Heizung nicht aus und lassen Sie die Türen zu, dann bleibt die Wärme länger im Haus. Wie ist Ihre genaue Adresse?"},
  {p:"Lindenstraße 12, im Erdgeschoss. Was kostet das ungefähr?", h:["Nenn die Anfahrt im Notdienst und verabschiede dich.","Mention the emergency call-out charge and say goodbye."], m:"Im Notdienst kostet die Anfahrt 80 Euro, dazu kommt die Arbeitszeit. Bis gleich, Frau Schulz!"}
 ]},
{id:"shk_beratung", cat:"beruf", type:"dlg", t:["Beratung: Wärmepumpe","Advising on a heat pump"],
 sit:["Ein Kunde hat eine alte Gasheizung und überlegt, eine Wärmepumpe zu kaufen. Du berätst ihn vor Ort.","A customer has an old gas boiler and is thinking about buying a heat pump. You advise him on site."],
 turns:[
  {p:"Mein Nachbar sagt, eine Wärmepumpe funktioniert in alten Häusern nicht. Stimmt das?", h:["Widersprich höflich und erklär, wovon es abhängt.","Disagree politely and explain what it depends on."], m:"Das stimmt so nicht. Es hängt vor allem von der Dämmung und von der Vorlauftemperatur ab. Viele alte Häuser funktionieren sehr gut mit einer Wärmepumpe."},
  {p:"Wir haben normale Heizkörper, keine Fußbodenheizung. Ist das ein Problem?", h:["Erklär, was ihr prüfen wollt, z. B. die Heizlast und die Heizkörper.","Explain what you'll check, e.g. the heat load and the radiators."], m:"Nicht unbedingt. Wir berechnen zuerst die Heizlast und prüfen, ob die Heizkörper groß genug sind. Manchmal muss man nur zwei oder drei Heizkörper tauschen."},
  {p:"Und wo kommt das Gerät hin? Der Garten ist ziemlich klein.", h:["Schlag einen Platz für die Außeneinheit vor und nenn den Abstand.","Suggest a place for the outdoor unit and mention the clearance."], m:"Die Außeneinheit könnte hinter der Garage stehen. Wir brauchen nur etwa einen Meter Abstand zur Wand und zum Nachbarn."},
  {p:"Ist die nicht sehr laut?", h:["Beruhig ihn und vergleiche die Lautstärke.","Reassure him and compare the noise level."], m:"Moderne Geräte sind ziemlich leise. In ein paar Metern Entfernung ist sie etwa so laut wie ein Kühlschrank."},
  {p:"Gut. Was sind die nächsten Schritte?", h:["Erklär die nächsten Schritte: Angebot, Förderung, Termin.","Explain the next steps: quote, grant, date."], m:"Ich schicke Ihnen bis Freitag ein Angebot. Dann stellen wir zusammen den Antrag für die Förderung, und danach machen wir einen Termin für die Montage."}
 ]},
{id:"shk_meister", cat:"beruf", type:"dlg", t:["Mit dem Meister den Tag planen","Planning the day with the boss"],
 sit:["Es ist 7 Uhr im Betrieb. Dein Meister bespricht mit dir die Aufträge für heute.","It's 7 am at the firm. Your boss goes through today's jobs with you."],
 turns:[
  {p:"Morgen! Heute hast du drei Aufträge. Zuerst die Wartung bei Familie Becker. Weißt du, was du mitnehmen musst?", h:["Sag, was du mitnimmst.","Say what you're taking."], m:"Guten Morgen! Ja, ich nehme das Messgerät, neue Filter und Dichtungen mit. Brauche ich auch Kältemittel?"},
  {p:"Nein, Kältemittel brauchst du nicht. Danach musst du zur Baustelle in der Bahnhofstraße.", h:["Frag, was du dort genau machen sollst.","Ask what exactly you're supposed to do there."], m:"Was soll ich auf der Baustelle genau machen? Sollen wir die Leitungen schon verlegen?"},
  {p:"Genau, die Leitungen im Keller. Der Estrich kommt am Donnerstag, also muss es heute fertig werden.", h:["Sag, dass das knapp wird, und bitte um Hilfe.","Say that it'll be tight and ask for help."], m:"Das wird knapp, weil es fast dreißig Meter sind. Könnte der Azubi mitkommen und mir helfen?"},
  {p:"Okay, Jonas kommt mit. Und am Nachmittag ruft vielleicht noch der Notdienst an.", h:["Bestätige und sag, wann du dich meldest.","Confirm and say when you'll check in."], m:"Alles klar. Ich melde mich um zwölf, dann sage ich Ihnen, wie weit wir sind."}
 ]},
{id:"shk_grosshandel", cat:"beruf", type:"dlg", t:["Beim Großhandel","At the wholesaler"],
 sit:["Du holst Material beim Großhandel. Ein Teil fehlt.","You're collecting materials from the wholesaler. One part is missing."],
 turns:[
  {p:"Guten Morgen! Was darf es sein?", h:["Sag, was du brauchst: Rohr, Fittings, eine Pumpe.","Say what you need: pipe, fittings, a pump."], m:"Guten Morgen! Ich brauche zwanzig Meter Verbundrohr, sechzehn Millimeter, zehn Bögen und eine neue Umwälzpumpe."},
  {p:"Rohr und Bögen haben wir. Die Pumpe ist leider gerade nicht da.", h:["Frag, wann sie kommt, und ob es eine Alternative gibt.","Ask when it's coming and whether there's an alternative."], m:"Schade. Wann kommt die Pumpe wieder? Haben Sie vielleicht ein anderes Modell mit der gleichen Leistung?"},
  {p:"Morgen früh. Oder wir haben eine von einem anderen Hersteller, die ist aber zwanzig Euro teurer.", h:["Entscheide dich und begründe es.","Decide and give a reason."], m:"Dann nehme ich die andere, weil der Kunde heute schon seit zwei Tagen keine Heizung hat."},
  {p:"Gut. Soll ich das auf Ihre Firma schreiben?", h:["Sag den Namen der Firma und bitte um den Lieferschein.","Give the company name and ask for the delivery note."], m:"Ja, bitte auf die Firma Krüger Haustechnik. Und geben Sie mir bitte den Lieferschein mit."}
 ]},
{id:"shk_beschwerde", cat:"beruf", type:"dlg", t:["Ein Kunde beschwert sich","A customer complains"],
 sit:["Ihr habt vor zwei Wochen eine Klimaanlage montiert. Jetzt ruft der Kunde verärgert an.","Two weeks ago you installed an air conditioning unit. Now the customer calls, annoyed."],
 turns:[
  {p:"Ihre Klimaanlage tropft! Unter dem Innengerät ist eine Pfütze, und der Boden ist schon nass.", h:["Entschuldige dich und frag nach Details.","Apologise and ask for details."], m:"Das tut mir sehr leid. Seit wann tropft das Gerät? Und tropft es nur im Kühlbetrieb?"},
  {p:"Seit gestern. Ja, nur wenn es kühlt.", h:["Nenn eine mögliche Ursache.","Name a possible cause."], m:"Dann ist wahrscheinlich die Kondensatleitung verstopft, oder sie hat nicht genug Gefälle."},
  {p:"Und wer bezahlt das? Ich will nicht noch einmal bezahlen!", h:["Beruhig ihn: Es ist Garantie.","Reassure him: it's under warranty."], m:"Keine Sorge, das ist natürlich Garantie. Sie müssen nichts bezahlen."},
  {p:"Wann können Sie kommen?", h:["Schlag einen Termin vor und gib einen Tipp bis dahin.","Suggest a date and give a tip until then."], m:"Ich kann morgen um acht Uhr bei Ihnen sein. Bis dahin schalten Sie den Kühlbetrieb bitte aus und stellen eine Schüssel unter das Gerät."}
 ]},
{id:"shk_bewerbung", cat:"beruf", type:"dlg", t:["Vorstellungsgespräch im SHK-Betrieb","Job interview at an SHK firm"],
 sit:["Du hast dich bei einem SHK-Betrieb beworben. Die Chefin führt das Gespräch.","You've applied to an SHK firm. The owner is interviewing you."],
 turns:[
  {p:"Schön, dass Sie da sind. Erzählen Sie mal: Warum möchten Sie in unserem Beruf arbeiten?", h:["Erklär, warum dich SHK interessiert.","Explain why SHK interests you."], m:"Ich arbeite gern mit den Händen, und mich interessieren Technik und Energie. Wärmepumpen sind die Zukunft, und ich möchte dabei sein."},
  {p:"Haben Sie schon Erfahrung mit Pumpen oder Leitungen?", h:["Erzähl von deiner Aquaponik-Farm (Perfekt).","Talk about your aquaponics farm (Perfekt)."], m:"Ja, ich habe auf meiner Farm ein Kreislaufsystem mit Pumpen, Filtern und Rohren gebaut. Ich habe auch selbst Fehler gesucht und Pumpen ausgetauscht."},
  {p:"Und wie ist es mit der Sprache? Auf der Baustelle spricht man schnell.", h:["Sei ehrlich und sag, was du dafür tust.","Be honest and say what you're doing about it."], m:"Mein Deutsch ist noch nicht perfekt, aber ich lerne jeden Tag, auch die Fachwörter. Wenn ich etwas nicht verstehe, frage ich lieber einmal mehr nach."},
  {p:"Wann könnten Sie anfangen?", h:["Nenn einen Termin und frag nach der Arbeitszeit.","Give a date and ask about working hours."], m:"Ich könnte am ersten Februar anfangen. Wie sind denn die Arbeitszeiten bei Ihnen?"}
 ]},
{id:"shk_wp_erklaeren", cat:"beruf", type:"mono", sec:120, t:["Wie funktioniert eine Wärmepumpe?","How does a heat pump work?"],
 sit:["Ein Kunde fragt dich, wie eine Wärmepumpe funktioniert. Erklär es einfach, Schritt für Schritt.","A customer asks you how a heat pump works. Explain it simply, step by step."],
 pts:[["Woher kommt die Wärme?","Where does the heat come from?"],["Verdampfer, Verdichter, Verflüssiger","Evaporator, compressor, condenser"],["Vergleich mit dem Kühlschrank","Comparison with a fridge"],["Warum spart man Energie?","Why does it save energy?"]],
 m:"Eine Wärmepumpe holt die Wärme aus der Außenluft, aus dem Boden oder aus dem Wasser. Zuerst nimmt das Kältemittel im Verdampfer die Wärme auf und wird gasförmig. Dann macht der Verdichter den Druck höher, und dadurch wird das Gas sehr heiß. Im Verflüssiger gibt das Kältemittel die Wärme an das Heizwasser ab. Danach senkt das Expansionsventil den Druck wieder, und alles beginnt von vorn. Das funktioniert wie ein Kühlschrank, nur umgekehrt. Man spart Energie, weil man aus einer Kilowattstunde Strom etwa drei bis vier Kilowattstunden Wärme bekommt."},
{id:"shk_fehlersuche", cat:"beruf", type:"mono", sec:90, t:["Bericht: Was hast du heute repariert?","Report: what did you repair today?"],
 sit:["Erzähl deinem Meister am Abend, welchen Fehler du heute gefunden und wie du ihn behoben hast. Benutze das Perfekt.","In the evening, tell your boss what fault you found today and how you fixed it. Use the Perfekt."],
 pts:[["Was hat der Kunde gemeldet?","What did the customer report?"],["Was hast du geprüft?","What did you check?"],["Was war die Ursache?","What was the cause?"],["Was hast du gemacht?","What did you do?"]],
 m:"Heute Morgen war ich bei Herrn Wolf. Er hat gemeldet, dass das Bad kalt bleibt. Zuerst habe ich den Druck geprüft, der war in Ordnung. Dann habe ich den Heizkörper entlüftet, aber er ist trotzdem kalt geblieben. Am Ende habe ich gesehen, dass der Thermostatkopf kaputt war. Ich habe ihn ausgetauscht, und danach ist der Heizkörper sofort warm geworden. Die Rechnung kann das Büro morgen schicken."},
{id:"shk_warum", cat:"beruf", type:"mono", sec:90, t:["Warum SHK?","Why SHK?"],
 sit:["Erzähl, warum du in der Branche Sanitär, Heizung und Klima arbeiten möchtest.","Explain why you want to work in plumbing, heating and air conditioning."],
 pts:[["Was dich interessiert","What interests you"],["Deine Erfahrung (Farm, Pumpen, Technik)","Your experience (farm, pumps, tech)"],["Warum der Beruf Zukunft hat","Why the trade has a future"],["Deine Pläne","Your plans"]],
 m:"Ich möchte in der SHK-Branche arbeiten, weil mich Wasser, Wärme und Technik schon lange interessieren. Auf meiner Aquaponik-Farm habe ich Pumpen, Filter und Rohre selbst installiert und repariert. Außerdem bin ich Softwareentwickler, deshalb verstehe ich auch Regelungen und Sensoren gut. Der Beruf hat Zukunft, denn in Deutschland werden in den nächsten Jahren sehr viele Wärmepumpen gebraucht. Mein Ziel ist, zuerst als Monteur zu arbeiten und später vielleicht eine eigene Firma zu haben."},
{id:"shk_vergleich", cat:"beruf", type:"mono", sec:120, t:["Wärmepumpe oder Gasheizung?","Heat pump or gas boiler?"],
 sit:["Halte eine kurze Präsentation für Hausbesitzer: Wärmepumpe oder neue Gasheizung? Nenn Vor- und Nachteile und gib eine Empfehlung.","Give a short presentation for homeowners: heat pump or new gas boiler? Name pros and cons and make a recommendation."],
 pts:[["Einleitung","Introduction"],["Vorteile und Nachteile der Wärmepumpe","Pros and cons of the heat pump"],["Vorteile und Nachteile der Gasheizung","Pros and cons of the gas boiler"],["Deine Empfehlung","Your recommendation"]],
 m:"Heute möchte ich zwei Heizungen vergleichen: die Wärmepumpe und die Gasheizung. Ein großer Vorteil der Wärmepumpe ist, dass sie kein Gas braucht und mit Strom von der Photovoltaikanlage laufen kann. Außerdem gibt es eine hohe Förderung. Ein Nachteil ist, dass sie am Anfang teurer ist. Die Gasheizung ist billiger beim Kauf, aber die Gaspreise steigen, und sie ist nicht gut für das Klima. Meine Empfehlung ist deshalb: Wenn das Haus gut gedämmt ist, nehmen Sie eine Wärmepumpe. Vielen Dank für Ihre Aufmerksamkeit."}
);

SCHREIBEN.push(
{id:"shk_angebot", cat:"beruf", w:100, t:["Angebot an eine Kundin","A quote email to a customer"],
 task:["Du warst bei Frau Yilmaz und hast ihre alte Heizung angesehen. Schreib ihr eine E-Mail mit deinem Vorschlag.","You visited Mrs Yilmaz and looked at her old heating. Write her an email with your proposal."],
 pts:[["Bedank dich für den Termin.","Thank her for the appointment."],["Beschreib, was du vorschlägst und warum.","Describe what you suggest and why."],["Nenn den Preis und die Förderung.","Mention the price and the grant."],["Schlag die nächsten Schritte vor.","Suggest the next steps."]],
 m:"Sehr geehrte Frau Yilmaz,\nvielen Dank für den Termin am Dienstag. Wie besprochen ist Ihr Heizkessel über dreißig Jahre alt und verbraucht sehr viel Gas. Ich schlage deshalb eine Luft-Wasser-Wärmepumpe mit acht Kilowatt vor. Drei Heizkörper im Obergeschoss müssten wir tauschen, weil sie zu klein sind.\nDas Angebot finden Sie im Anhang. Die Kosten liegen bei etwa 28.000 Euro. Mit der Förderung bezahlen Sie davon ungefähr die Hälfte.\nWenn Sie Fragen haben, rufen Sie mich gern an. Sonst können wir den Antrag für die Förderung gemeinsam stellen.\nMit freundlichen Grüßen\nDamian"},
{id:"shk_bericht", cat:"beruf", w:80, t:["Arbeitsbericht für das Büro","A job report for the office"],
 task:["Schreib einen kurzen Arbeitsbericht über eine Reparatur für das Büro, damit es die Rechnung schreiben kann.","Write a short job report about a repair for the office so they can write the invoice."],
 pts:[["Kunde, Datum, Problem","Customer, date, problem"],["Was du gemacht hast (Perfekt)","What you did (Perfekt)"],["Material und Arbeitszeit","Materials and labour time"]],
 m:"Kunde: Familie Becker, Gartenweg 4\nDatum: 12. März\nProblem: Kein Warmwasser.\nIch habe zuerst die Regelung und den Speicherfühler geprüft. Der Fühler war defekt und hat einen falschen Wert gezeigt. Ich habe den Fühler ausgetauscht und die Anlage neu gestartet. Danach hat das Warmwasser wieder funktioniert.\nMaterial: 1 Speicherfühler\nArbeitszeit: 1,5 Stunden plus Anfahrt"},
{id:"shk_termin", cat:"beruf", w:60, t:["Einen Termin verschieben","Moving an appointment"],
 task:["Du kannst morgen nicht zur Wartung bei Herrn Klein kommen, weil das Ersatzteil fehlt. Schreib ihm.","You can't come to Mr Klein's service tomorrow because the spare part hasn't arrived. Write to him."],
 pts:[["Entschuldige dich.","Apologise."],["Erklär den Grund.","Explain the reason."],["Schlag zwei neue Termine vor.","Suggest two new dates."]],
 m:"Sehr geehrter Herr Klein,\nleider muss ich unseren Termin morgen um 9 Uhr absagen. Das Ersatzteil für Ihre Wärmepumpe ist noch nicht beim Großhandel angekommen. Das tut mir sehr leid.\nIch könnte am Donnerstag um 10 Uhr oder am Freitag um 14 Uhr kommen. Welcher Termin passt Ihnen besser?\nMit freundlichen Grüßen\nDamian"},
{id:"shk_bewerbung_mail", cat:"beruf", w:120, t:["Bewerbung als Monteur","Applying as a fitter"],
 task:["Du hast eine Anzeige gesehen: Ein SHK-Betrieb sucht Monteure für Wärmepumpen. Schreib eine kurze Bewerbung.","You saw an ad: an SHK firm is looking for heat pump fitters. Write a short application."],
 pts:[["Wo du die Anzeige gesehen hast","Where you saw the ad"],["Deine Erfahrung","Your experience"],["Warum du gut passt","Why you're a good fit"],["Wann du anfangen kannst","When you can start"]],
 m:"Sehr geehrte Damen und Herren,\nauf Ihrer Webseite habe ich gelesen, dass Sie Monteure für Wärmepumpen suchen. Ich interessiere mich sehr für diese Stelle.\nIch habe auf meiner Farm in Barbados ein Wassersystem mit Pumpen, Filtern und Leitungen gebaut und repariere es selbst. Außerdem bin ich Softwareentwickler und kenne mich mit Sensoren und Regelungen gut aus.\nIch arbeite gern im Team und lerne schnell. Mein Deutsch verbessere ich jeden Tag, auch die Fachsprache.\nIch könnte ab dem 1. Februar anfangen. Über eine Einladung zu einem Gespräch freue ich mich sehr.\nMit freundlichen Grüßen\nDamian"}
);

RM_CATS.kunde = ["Mit Kunden sprechen", "Talking to customers", "Du bist beim Kunden oder am Telefon mit einem Kunden.", "You're at a customer's home or on the phone with one.", 13];
RM_CATS.fehler = ["Fehler beschreiben", "Describing faults", "Du beschreibst ein Problem an einer Anlage.", "You're describing a problem with a system.", 14];
REDEMITTEL_RAW.push(
["kunde","Was kann ich für Sie tun?","What can I do for you?"],
["kunde","Seit wann haben Sie das Problem?","How long have you had the problem?"],
["kunde","Darf ich mir das mal ansehen?","May I have a look at it?"],
["kunde","Wo ist denn der Heizungsraum?","Where's the boiler room?"],
["kunde","Ich muss kurz das Wasser abstellen.","I need to turn the water off for a moment.","abstellen = ausschalten (Wasser, Strom)"],
["kunde","Das dauert ungefähr eine Stunde.","That'll take about an hour."],
["kunde","Ich schicke Ihnen ein Angebot.","I'll send you a quote."],
["kunde","Das ist leider nicht in der Garantie.","Unfortunately that's not covered by the warranty."],
["kunde","Das ist zum Glück Garantie.","Luckily that's under warranty."],
["kunde","Ich empfehle Ihnen …","I recommend …","Nach empfehlen: Dativ für die Person (Ihnen), Akkusativ für die Sache."],
["kunde","Wenn Sie möchten, kann ich …","If you like, I can …","Nach wenn steht das Verb am Ende: Wenn Sie möchten, …"],
["kunde","Haben Sie noch Fragen?","Do you have any more questions?"],
["kunde","So, jetzt funktioniert alles wieder.","Right, now everything is working again."],
["kunde","Ich komme morgen mit dem Ersatzteil wieder.","I'll come back tomorrow with the spare part."],
["kunde","Bitte unterschreiben Sie hier.","Please sign here."],
["fehler","Die Anlage zeigt eine Fehlermeldung.","The system is showing an error message."],
["fehler","Der Druck ist zu niedrig.","The pressure is too low."],
["fehler","Hier ist etwas undicht.","Something's leaking here."],
["fehler","Die Pumpe läuft, aber es kommt kein Wasser.","The pump is running, but no water is coming."],
["fehler","Der Heizkörper wird nicht richtig warm.","The radiator isn't getting properly warm."],
["fehler","Das Gerät macht ein komisches Geräusch.","The unit is making a strange noise."],
["fehler","Ich vermute, dass … kaputt ist.","I suspect that … is broken.","dass schickt das Verb ans Ende: …, dass die Pumpe kaputt ist."],
["fehler","Die Ursache ist wahrscheinlich …","The cause is probably …"],
["fehler","Zuerst prüfe ich …, dann …","First I'll check …, then …","Nach dann kommt das Verb direkt: dann messe ich …"],
["fehler","Das Teil muss ausgetauscht werden.","The part has to be replaced.","Passiv mit Modalverb: muss … werden."],
["fehler","Ich habe den Fehler gefunden.","I've found the fault."],
["fehler","Wir müssen die Anlage neu befüllen.","We have to refill the system."]
);

/* Frage-Pingpong: questions from the job ([category, question, English, example answer]) */
const SHK_PP_CAT = ["Im Beruf (SHK)", "On the job (SHK)", "Fachwörter, weil, Perfekt"];
const SHK_PP = [
["beruf","Was macht ein Anlagenmechaniker für SHK?","What does an SHK installer do?","Er installiert und repariert Heizungen, Wärmepumpen, Klimaanlagen und Wasserleitungen."],
["beruf","Warum möchtest du in diesem Beruf arbeiten?","Why do you want to work in this trade?","Weil ich gern mit den Händen arbeite und weil Wärmepumpen die Zukunft sind."],
["beruf","Wie funktioniert eine Wärmepumpe, ganz kurz?","How does a heat pump work, in short?","Sie holt die Wärme aus der Luft und macht sie mit einem Verdichter heißer, wie ein Kühlschrank, nur umgekehrt."],
["beruf","Was ist der Unterschied zwischen Vorlauf und Rücklauf?","What's the difference between flow and return?","Im Vorlauf geht das warme Wasser zu den Heizkörpern, im Rücklauf kommt es kälter zurück."],
["beruf","Was machst du, wenn ein Heizkörper nicht warm wird?","What do you do if a radiator doesn't get warm?","Zuerst entlüfte ich den Heizkörper, dann prüfe ich den Druck und das Thermostatventil."],
["beruf","Was machst du zuerst, wenn ein Rohr geplatzt ist?","What do you do first if a pipe has burst?","Zuerst drehe ich den Hauptwasserhahn zu, damit kein Wasser mehr in die Wohnung läuft."],
["beruf","Welches Werkzeug benutzt du am meisten?","Which tool do you use most?","Am meisten benutze ich die Presszange und den Akkuschrauber."],
["beruf","Was hast du auf deiner Farm schon repariert?","What have you already repaired on your farm?","Ich habe schon Pumpen ausgetauscht, Filter gereinigt und undichte Rohre abgedichtet."],
["beruf","Warum ist Arbeitsschutz auf der Baustelle wichtig?","Why is health and safety important on site?","Weil man sich schnell verletzen kann, zum Beispiel beim Bohren oder auf der Leiter."],
["beruf","Was trägst du, wenn du mit Kältemittel arbeitest?","What do you wear when you work with refrigerant?","Ich trage immer Handschuhe und eine Schutzbrille."],
["beruf","Wie erklärst du einem Kunden einen Fehlercode?","How do you explain an error code to a customer?","Ich sage einfach, was das Problem ist, zum Beispiel: Der Druck ist zu niedrig, das kann ich schnell beheben."],
["beruf","Was sagst du, wenn ein Kunde sich über den Preis beschwert?","What do you say if a customer complains about the price?","Ich erkläre, was im Preis enthalten ist, und zeige ihm die Förderung."],
["beruf","Wie oft sollte man eine Heizung warten lassen?","How often should you have a heating system serviced?","Man sollte sie einmal im Jahr warten lassen, am besten vor dem Winter."],
["beruf","Warum braucht ein Abwasserrohr Gefälle?","Why does a waste pipe need a fall?","Weil das Wasser sonst nicht richtig abfließt und das Rohr verstopft."],
["beruf","Was passiert, wenn der Druck in der Heizung zu hoch ist?","What happens if the pressure in the heating is too high?","Dann öffnet das Sicherheitsventil und lässt Wasser ab."],
["beruf","Was ist besser für eine Wärmepumpe: Fußbodenheizung oder Heizkörper?","What's better for a heat pump: underfloor heating or radiators?","Eine Fußbodenheizung ist besser, weil sie eine niedrige Vorlauftemperatur braucht."],
["beruf","Was hast du gestern auf der Arbeit gemacht?","What did you do at work yesterday?","Gestern habe ich mit einem Kollegen eine Außeneinheit montiert und die Leitungen verlegt."],
["beruf","Was würdest du machen, wenn du deine eigene Firma hättest?","What would you do if you had your own firm?","Wenn ich eine eigene Firma hätte, würde ich vor allem Wärmepumpen und Solaranlagen installieren."],
["beruf","Wie findest du die Arbeit auf der Baustelle im Winter?","How do you find work on site in winter?","Im Winter ist es anstrengend, weil es kalt ist, aber die Kunden brauchen uns dann am meisten."],
["beruf","Was machst du, wenn du ein Fachwort nicht verstehst?","What do you do if you don't understand a technical word?","Ich frage nach: Können Sie das bitte noch einmal erklären? Oder ich zeige auf das Teil."],
["beruf","Warum gibt es in Deutschland so viele Wärmepumpen?","Why are there so many heat pumps in Germany?","Weil Deutschland weniger Gas verbrauchen will und weil der Staat sie fördert."],
["beruf","Was ist dein Lieblingsteil an diesem Beruf?","What's your favourite part of this trade?","Am liebsten suche ich Fehler, denn das ist wie ein Rätsel."],
["beruf","Wie kann ein Kunde Heizkosten sparen?","How can a customer save on heating costs?","Er kann die Heizkurve richtig einstellen lassen, die Rohre dämmen und richtig lüften."],
["beruf","Was ist ein hydraulischer Abgleich?","What is hydraulic balancing?","Man stellt alle Heizkörper so ein, dass jeder Raum gleich viel warmes Wasser bekommt."],
["beruf","Wie lange dauert es, eine Wärmepumpe zu installieren?","How long does it take to install a heat pump?","Meistens dauert es zwei bis drei Tage, wenn alles gut vorbereitet ist."],
["beruf","Was machst du, wenn die Klimaanlage tropft?","What do you do if the air conditioning drips?","Ich prüfe die Kondensatleitung, denn oft ist sie verstopft oder hat zu wenig Gefälle."],
["beruf","Wozu braucht man eine Hebeanlage?","What do you need a lifting station for?","Man braucht sie, wenn das Abwasser im Keller tiefer als der Kanal liegt."],
["beruf","Wie würdest du dich bei einem neuen Kunden vorstellen?","How would you introduce yourself to a new customer?","Guten Tag, mein Name ist Damian von der Firma Krüger. Ich komme wegen Ihrer Heizung."],
["beruf","Was hast du heute gelernt, was du vorher nicht wusstest?","What did you learn today that you didn't know before?","Heute habe ich gelernt, dass man Kältemittelleitungen vor dem Befüllen evakuieren muss."],
["beruf","Was sind die Vor- und Nachteile einer Photovoltaikanlage?","What are the pros and cons of a PV system?","Ein Vorteil ist, dass man eigenen Strom hat. Ein Nachteil ist, dass sie am Anfang viel kostet."]
];
