/* Fehler-Drill data: extra built-in rules the grammar trainer doesn't have, and the table that
   links a mistake pattern (named freely by Claude, German | English) to grammar-trainer rules.
   Items use the grammar trainer's format (gap, mc, sb, uf). shk: 1 = only in Handwerker-Modus. */

const FD_EXTRA = [
{
  id: "x-indirekt", level: "A2", title: "Indirekte Fragen: Wissen Sie, wo …?", en: "Indirect questions: Do you know where …?",
  items: [
    { t: "gap", q: "Weißt du, wo der Bahnhof ___?", h: "sein", a: ["ist"], en: "Do you know where the station is?", why: "After the question word (wo) the verb goes to the end." },
    { t: "gap", q: "Können Sie mir sagen, wann der Zug ___?", h: "abfahren", a: ["abfährt"], en: "Can you tell me when the train leaves?", why: "Separable verb at the end joins up: abfährt." },
    { t: "gap", q: "Ich weiß nicht, was das ___.", h: "kosten", a: ["kostet"], en: "I don't know what that costs.", why: "Indirect question: verb at the end." },
    { t: "gap", q: "Sag mir bitte, wie spät es ___.", h: "sein", a: ["ist"], en: "Please tell me what time it is.", why: "wie spät … ist: verb at the end." },
    { t: "mc", q: "Weißt du, wo …", o: ["meine Brille ist", "ist meine Brille", "meine Brille sein"], en: "Do you know where my glasses are?", why: "Indirect question: verb at the end, not after the question word." },
    { t: "mc", q: "Können Sie mir sagen, wie lange …", o: ["die Apotheke geöffnet hat", "hat die Apotheke geöffnet", "die Apotheke hat geöffnet"], en: "Can you tell me how long the pharmacy is open?", why: "The conjugated verb (hat) goes to the very end." },
    { t: "mc", q: "Ich möchte wissen, warum …", o: ["du so spät kommst", "kommst du so spät", "du kommst so spät"], en: "I'd like to know why you're so late.", why: "warum … kommst: verb at the end." },
    { t: "mc", q: "Er fragt, wer …", o: ["morgen mitkommen will", "will morgen mitkommen", "morgen will mitkommen"], en: "He's asking who wants to come along tomorrow.", why: "Modal verb last: mitkommen will." },
    { t: "sb", s: "Weißt du , wann der Kurs beginnt?", cap: 1, en: "Do you know when the course starts?", why: "wann … beginnt: verb at the end." },
    { t: "sb", s: "Ich weiß nicht , wo ich parken kann.", en: "I don't know where I can park.", why: "Modal verb (kann) at the very end." },
    { t: "sb", s: "Können Sie mir sagen , wie ich zum Rathaus komme?", cap: 1, en: "Can you tell me how I get to the town hall?", why: "wie … komme: verb at the end." },
    { t: "sb", s: "Wir fragen den Chef , wann wir Urlaub nehmen können.", en: "We're asking the boss when we can take holiday.", why: "nehmen können: modal verb last." },
    { t: "uf", q: "Wo wohnt Anna?", task: "Fang mit »Ich weiß nicht, …« an", a: ["Ich weiß nicht, wo Anna wohnt."], en: "I don't know where Anna lives.", why: "wohnt moves to the end." },
    { t: "uf", q: "Wann kommt der Bus?", task: "Fang mit »Können Sie mir sagen, …« an", a: ["Können Sie mir sagen, wann der Bus kommt?"], en: "Can you tell me when the bus is coming?", why: "kommt moves to the end." },
    { t: "uf", q: "Was hat er gesagt?", task: "Fang mit »Ich habe nicht verstanden, …« an", a: ["Ich habe nicht verstanden, was er gesagt hat."], en: "I didn't understand what he said.", why: "hat moves to the very end, after gesagt." },
    { t: "uf", q: "Wie viel kostet das Ticket?", task: "Fang mit »Weißt du, …« an", a: ["Weißt du, wie viel das Ticket kostet?"], en: "Do you know how much the ticket costs?", why: "kostet moves to the end." },
    { t: "gap", q: "Wissen Sie, wo der Zähler ___?", h: "sein", a: ["ist"], en: "Do you know where the meter is?", why: "Verb at the end.", shk: 1 },
    { t: "mc", q: "Können Sie mir sagen, wann …", o: ["die Heizung ausgefallen ist", "ist die Heizung ausgefallen", "die Heizung ist ausgefallen"], en: "Can you tell me when the heating broke down?", why: "Perfekt in an indirect question: ausgefallen ist.", shk: 1 },
    { t: "mc", q: "Der Kunde fragt, wie lange …", o: ["die Reparatur dauert", "dauert die Reparatur", "die Reparatur dauern"], en: "The customer is asking how long the repair will take.", why: "dauert at the end.", shk: 1 },
    { t: "sb", s: "Ich schaue nach , warum die Wärmepumpe so laut ist.", en: "I'll check why the heat pump is so loud.", why: "warum … ist: verb at the end.", shk: 1 },
    { t: "uf", q: "Wo ist das Ventil?", task: "Fang mit »Zeigen Sie mir bitte, …« an", a: ["Zeigen Sie mir bitte, wo das Ventil ist."], en: "Please show me where the valve is.", why: "ist moves to the end.", shk: 1 },
    { t: "uf", q: "Was ist kaputt?", task: "Fang mit »Können Sie sehen, …« an", a: ["Können Sie sehen, was kaputt ist?"], en: "Can you see what's broken?", why: "ist moves to the end.", shk: 1 }
  ]
}
];

/* Mistake pattern → grammar rules. Tested against "German name English name" in lower case.
   The most specific rules come first; a pattern links to at most 3 of them. */
const FD_MATCH = [
  ["x-indirekt", /indirekt|indirect|eingebettet|embedded question|wissen sie, w|weißt du, w|können sie mir sagen/],
  ["b1-relativ", /relativ|relative/],
  ["b1-zuinf", /zu ?\+ ?inf|zu-inf|infinitiv mit zu|infinitive with zu|um\b.*\bzu\b|to-infinitive/],
  ["b1-zweiteilig", /zweiteilig|two-part|entweder|sowohl|weder|nicht nur|\bzwar\b|je .*desto/],
  ["b1-konnektoren", /obwohl|trotzdem|deshalb|deswegen|darum|\bdamit\b|konnektor|connector|linking word|conjunction/],
  ["b1-zeitkonn", /temporal|nachdem|bevor|während|seitdem|sobald|als oder wenn|als\/wenn|when in the past/],
  ["nebensatz", /nebensatz|subordinate|\bweil\b|\bdass\b|\bob\b|wenn-satz|verb am ende|verb at the end|verb-final|verbendstellung|verb last/],
  ["b1-plusquam", /plusquam|pluperfect|past perfect/],
  ["b1-konj2past", /hätte .*gemacht|wäre .*gegangen|konjunktiv ii der vergangenheit|past subjunctive|would have/],
  ["konjunktiv", /konjunktiv|subjunctive|würde|hätte|wäre|könnte|höflich|polite|wunsch|wishes/],
  ["b1-passiv", /passiv|passive/],
  ["b1-genitiv", /genitiv|genitive|\bwegen\b|\btrotz\b/],
  ["b1-futur", /futur|future|n-deklination|n-declension|weak nouns?/],
  ["b1-praepverben", /verben? mit präposition|verbs? with preposition|präpositionalverb|prepositional verb|warten auf|denken an|sich freuen auf/],
  ["dativverben", /verben? mit dativ|dative verbs?|helfen|gefallen|gehören/],
  ["wechsel", /wechselpräp|two-way|wo oder wohin|wo\/wohin|location (vs|or) direction|in den .*in dem/],
  ["dativpraep", /präposition(en)? mit (dem )?dativ|dative preposition|preposition.*dative|mit dem|nach dem|bei dem|\bseit\b/],
  ["dativ", /dativ|dative|indirektes objekt|indirect object/],
  ["a1-akkusativ", /akkusativ|accusative|direktes objekt|direct object|\beinen\b/],
  ["adjektiv", /adjektiv|adjective/],
  ["komparativ", /komparativ|superlativ|comparative|superlative|vergleich|comparison|als oder wie/],
  ["reflexiv", /reflexiv|reflexive|\bsich\b/],
  ["perfekt-hs", /perfekt|present perfect|perfect tense|hilfsverb|auxiliary|haben oder sein|haben\/sein/],
  ["partizip", /partizip|participle|\bge-/],
  ["b1-praeteritum", /präteritum aller|simple past of all|präteritum von|preterite of/],
  ["praeteritum", /präteritum|simple past|preterite|\bwar\b|\bhatte\b/],
  ["a1-trennbar", /trennbar|separable|präfix|prefix/],
  ["a1-modal", /modal|möchte|infinitiv am ende|infinitive at the end/],
  ["a1-imperativ", /imperativ|imperative|befehl|command/],
  ["a1-possessiv", /possessiv|possessive/],
  ["a1-negation", /negation|verneinung|negative|\bnicht\b|\bkein/],
  ["a1-fragen", /w-frage|ja\/nein|ja-nein|question word|yes\/no|fragesatz|frage|question/],
  ["a1-wortstellung", /position 2|second position|zweite[rn]? (stelle|position)|inversion|verbzweit|\bv2\b|zeitangabe|time (phrase|expression)|wortstellung|word order|satzstellung|satzbau/],
  ["a1-zeit", /\bam\b.*\bum\b|\bum\b.*\buhr\b|time prepositions?|präpositionen der zeit|uhrzeit|datum|wochentag/],
  ["a1-praesens", /konjugation|conjugat|verbendung|verb ending|personalendung|subject-verb|kongruenz|agreement/],
  ["a1-seinhaben", /\bsein\b.*\bhaben\b|\bhaben\b.*\bsein\b|to be|to have/],
  ["a1-artikel", /genus|gender|artikel|article|der\/die\/das|plural/]
];
