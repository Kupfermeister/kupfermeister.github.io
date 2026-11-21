# Lernseite – Arbeitsregeln

Astro-Seite, veröffentlicht über GitHub Pages (`.github/workflows/deploy.yml`, bei jedem Push auf `main`).
**Nur die Dateien lesen, die für die Aufgabe nötig sind.** Struktur und Regeln stehen hier.

## Struktur
- `src/inhalte/<fach>/fach.md` – ein Fach (Frontmatter: `titel`, `farbe`, `reihenfolge`, optional `beschreibung`, `kuerzel`)
- `src/inhalte/<fach>/<thema>.mdx` – ein Thema = eine Seite (Frontmatter: `titel`, optional `beschreibung`, `art`, `akzent`, `reihenfolge`, `breit`, `entwurf`). Schema: `src/content.config.ts`
- Fach ohne Themen: Kachel auf der Startseite sichtbar, aber nicht klickbar. Erstes Thema anlegen → Fach wird automatisch klickbar.
- `src/interaktiv/<Name>.astro` – Spiele, Generatoren, Diagramme; im Thema per `import X from '../../interaktiv/X.astro'` einbinden
- `src/design/farben.ts` – **einzige** Quelle der Bedeutungsfarben (semantische Farbcodierung)
- `src/styles/base.css` – Grunddesign/Tokens. Farben nie direkt in Seiten, immer Tokens (`var(--akzent)`, `var(--leise)` …)
- Seiten-Routing (`src/pages/`) und Layout (`src/layouts/Basis.astro`) nur bei Design-Änderungen anfassen

## In Themen ohne Import verfügbar
- `<F name>Text</F>` – Bedeutungsfarbe (Namen aus farben.ts; unbekannte Namen brechen den Build ab)
- `<Kasten merke|definition|beispiel|achtung|tipp titel="…">` – Hinweiskasten (Leerzeilen um Markdown-Inhalt)

## Bausteine für interaktive Teile (base.css)
`.werkzeug` (Rahmen), `.knopf` / `.knopf.haupt`, `.reihe` (Flex-Zeile). Skripte mit `document.querySelectorAll('[data-…]')` pro Instanz.

## Prüfen
`npm run build` muss fehlerfrei laufen. Lokal ansehen: `npm run dev`.
