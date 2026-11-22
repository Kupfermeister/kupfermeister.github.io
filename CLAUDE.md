# Lernseite – Arbeitsregeln

Astro-Seite, veröffentlicht über GitHub Pages (`.github/workflows/deploy.yml`, bei jedem Push auf `main`).
**Nur die Dateien lesen, die für die Aufgabe nötig sind.** Struktur und Regeln stehen hier.

## Struktur
- `src/inhalte/<fach>/fach.md` – ein Fach (Frontmatter: `titel`, `reihenfolge`, `kerncurriculum` (PDF-URL), optional `farbe` (ohne = grau), `beschreibung`, `kuerzel`)
- `src/inhalte/<fach>/<thema>/index.mdx` – ein Thema = eine Seite (Frontmatter: `titel`, optional `beschreibung`, `art`, `akzent`, `reihenfolge`, `breit`, `entwurf`). Schema: `src/content.config.ts`
- `src/inhalte/<fach>/<thema>/01-name.mdx`, `02-…` – **Abschnitte** des Themas, erscheinen nach Dateiname sortiert unter dem index. Ein Abschnitt = ein `##`-Kapitel, kurz halten. Zum Bearbeiten nur den betroffenen Abschnitt lesen.
- `src/inhalte/<fach>/begriffe.yaml` – **Begriffsverzeichnis** des Fachs, jeder Begriff genau einmal (`def`, `erkl`, optional `erlaeut`). Fächerübergreifendes (z. B. Operatoren) in `src/inhalte/begriffe.yaml`. Vor neuem Eintrag per Grep prüfen, ob er schon existiert.
- Fach ohne Themen: Kachel auf der Startseite sichtbar, aber nicht klickbar. Erstes Thema anlegen → Fach wird automatisch klickbar.
- `src/interaktiv/<Name>.astro` – Spiele, Generatoren, Diagramme; im Thema per `import X from '../../interaktiv/X.astro'` einbinden
- `src/design/farben.ts` – **einzige** Quelle der Bedeutungsfarben (semantische Farbcodierung)
- `src/styles/base.css` – Grunddesign/Tokens. Farben nie direkt in Seiten, immer Tokens (`var(--akzent)`, `var(--leise)` …)
- Seiten-Routing (`src/pages/`) und Layout (`src/layouts/Basis.astro`) nur bei Design-Änderungen anfassen

## Inhaltliche Regeln (verbindlich)
- **Grundlage: Hessen, Landesabitur 2028.** Immer den Abiturerlass für 2028 (Link in `src/design/seite.ts`) und das dafür gültige Kerncurriculum (KCGO Ausgabe 2024, Link je Fach in `fach.md` → `kerncurriculum`) nutzen. Schwerpunktthemen und Operatoren aus dem Erlass haben Vorrang.
- **Ziel:** Ein Schüler mit wenig Vorwissen soll kompakt auf 15-Punkte-LK-Niveau kommen.
- **Fachbegriffe:** niedrige Schwelle – jedes Wort, das ein Anfänger nicht sicher kennt, wird mit `<B>` ausklappbar erklärt (Eintrag in `begriffe.yaml`). Definition + Erklärung (+ Erläuterung/Beispiel) so gründlich, dass auch jemand ohne Grundlagen mitkommt.
- **Jeder Text ist selbst ein 15-Punkte-Text:** Er befolgt den jeweiligen Operator (definieren, erklären, erläutern, analysieren, erörtern …) genau so, wie Erlass/KCGO ihn beschreiben.

## In Themen ohne Import verfügbar
- `<F name>Text</F>` – Bedeutungsfarbe (Namen aus farben.ts; unbekannte Namen brechen den Build ab)
- `<B>Maxime</B>` / gebeugt `<B w="Maxime">Maximen</B>` – ausklappbarer Fachbegriff aus `begriffe.yaml` (Standard). Fehlt der Eintrag, bricht der Build ab.
- `<Begriff def="…" erkl="…" erlaeut="…">Wort</Begriff>` – nur für einmalige Erklärungen, die nicht ins Verzeichnis gehören
- `<Kasten merke|definition|beispiel|achtung|tipp titel="…">` – Hinweiskasten (Leerzeilen um Markdown-Inhalt)

## Bausteine für interaktive Teile (base.css)
`.werkzeug` (Rahmen), `.knopf` / `.knopf.haupt`, `.reihe` (Flex-Zeile). Skripte mit `document.querySelectorAll('[data-…]')` pro Instanz.

## Prüfen und Veröffentlichen (Pflicht nach jeder Änderung)
1. `npm run build` muss fehlerfrei laufen.
2. Danach **immer** veröffentlichen, ohne Rückfrage: `git add -A`, `git commit -m "<kurz, deutsch>"`, `git push` (Branch `main`, Repo Kupfermeister/kupfermeister.github.io). GitHub Actions baut und lädt die Seite hoch.
   Danach mit `gh run list -L 1` prüfen, dass das Deployment erfolgreich war (dann ist die neue Version auch auf dem iPad).
3. Schlägt der Build fehl: nicht pushen, erst reparieren.

Lokal ansehen: `npm run dev`.
