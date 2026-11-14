# Deutsch B1

Offline app for getting from A1 to fluent B1 German. Open the GitHub Pages address in Chrome and tap Install.

- **Wörter**: the official Goethe A1, A2 and B1 word lists (B1 without the A1 words), plus Damian's own Fachwortschatz (farm, tech, building) as a B1 theme. Spaced repetition with Artikel, Verstehen, Schreiben, Hören and Paare.
- **Aktiv**: speaking tasks with speech recognition, writing tasks, the atom queue (your own corrected texts, reviewed sentence by sentence in 5 boxes of at most 13 sentences, rated Again / OK / Easy, and you can pause an atom), verbs with prepositions, and Redemittel.
- **Flüssig sprechen** (in Aktiv): *Sag's schnell* (see English, say the German against a timer; sentences from your words, atoms and Redemittel; 1–5 self-rating, hard ones come back first), *Frage-Pingpong* (150 spoken questions to answer on the spot, corrected by Claude at the end) and *Gesprächskleber* (conversation-glue phrases in the Redemittel deck with a new say-it-aloud mode).
- Corrections come from Claude: the app copies a ready-made request, and you paste Claude's reply back. The app reads the KORREKTUR / FEHLERMUSTER / UMFORMEN block from it.
- **Save as MP3** (atom page): your text or the B1 version as an MP3, made on the phone with an offline German voice (Piper Thorsten, downloaded once, ~75 MB). See `tts/README.md`.
- **Bilder** (word card): 337 built-in drawings (describing words and almost the whole SHK deck), about 118 KB (much less once GitHub compresses it). You can add your own photo to any word: it is shrunk on the phone to 400 px WebP (about 10–20 KB) and kept on the phone. The backup file in Mehr includes your photos; the copy code doesn't. New drawings go in `tools/bilder-src.js` or `tools/shk2-src.js`, then run `node tools/gen-bilder.js`.
