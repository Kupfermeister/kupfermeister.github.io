# Lernseite – Arbeitsregeln

Astro-Seite, veröffentlicht über GitHub Pages (`.github/workflows/deploy.yml`, bei jedem Push auf `main`).
**Nur die Dateien lesen, die für die Aufgabe nötig sind.** Struktur und Regeln stehen hier.

## Struktur
- `src/inhalte/<fach>/fach.md` – ein Fach (Frontmatter: `titel`, `reihenfolge`, `kerncurriculum` (PDF-URL), optional `farbe` (ohne = grau), `beschreibung`, `kuerzel`)
- `src/inhalte/<fach>/<thema>.mdx` – ein Thema = eine Seite (Frontmatter: `titel`, optional `beschreibung`, `art`, `akzent`, `reihenfolge`, `breit`, `entwurf`). Schema: `src/content.config.ts`
- Fach ohne Themen: Kachel auf der Startseite sichtbar, aber nicht klickbar. Erstes Thema anlegen → Fach wird automatisch klickbar.
- `src/interaktiv/<Name>.astro` – Spiele, Generatoren, Diagramme; im Thema per `import X from '../../interaktiv/X.astro'` einbinden
- `src/design/farben.ts` – **einzige** Quelle der Bedeutungsfarben (semantische Farbcodierung)
- `src/styles/base.css` – Grunddesign/Tokens. Farben nie direkt in Seiten, immer Tokens (`var(--akzent)`, `var(--leise)` …)
- Seiten-Routing (`src/pages/`) und Layout (`src/layouts/Basis.astro`) nur bei Design-Änderungen anfassen

## Inhaltliche Regeln (verbindlich)
- **Grundlage: Hessen, Landesabitur 2028.** Immer den Abiturerlass für 2028 (Link in `src/design/seite.ts`) und das dafür gültige Kerncurriculum (KCGO Ausgabe 2024, Link je Fach in `fach.md` → `kerncurriculum`) nutzen. Schwerpunktthemen und Operatoren aus dem Erlass haben Vorrang.
- **Ziel:** Ein Schüler mit wenig Vorwissen soll kompakt auf 15-Punkte-LK-Niveau kommen.
- **Fachbegriffe:** niedrige Schwelle – jedes Wort, das ein Anfänger nicht sicher kennt, wird mit `<Begriff>` ausklappbar erklärt. Definition + Erklärung (+ Erläuterung/Beispiel) so gründlich, dass auch jemand ohne Grundlagen mitkommt.
- **Jeder Text ist selbst ein 15-Punkte-Text:** Er befolgt den jeweiligen Operator (definieren, erklären, erläutern, analysieren, erörtern …) genau so, wie Erlass/KCGO ihn beschreiben.

## In Themen ohne Import verfügbar
- `<F name>Text</F>` – Bedeutungsfarbe (Namen aus farben.ts; unbekannte Namen brechen den Build ab)
- `<Begriff def="…" erkl="…" erlaeut="…">Fachwort</Begriff>` – ausklappbarer Fachbegriff im Satz (`erlaeut` optional, keine Leerzeilen im Fachwort)
- `<Kasten merke|definition|beispiel|achtung|tipp titel="…">` – Hinweiskasten (Leerzeilen um Markdown-Inhalt)

## Bausteine für interaktive Teile (base.css)
`.werkzeug` (Rahmen), `.knopf` / `.knopf.haupt`, `.reihe` (Flex-Zeile). Skripte mit `document.querySelectorAll('[data-…]')` pro Instanz.

## Prüfen und Veröffentlichen (Pflicht nach jeder Änderung)
1. `npm run build` muss fehlerfrei laufen.
2. Danach **immer** veröffentlichen, ohne Rückfrage: `git add -A`, `git commit -m "<kurz, deutsch>"`, `git push` (Branch `main`, Repo Kupfermeister/kupfermeister.github.io). GitHub Actions baut und lädt die Seite hoch.
3. Schlägt der Build fehl: nicht pushen, erst reparieren.

Lokal ansehen: `npm run dev`.
