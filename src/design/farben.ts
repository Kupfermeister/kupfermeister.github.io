// Semantische Farbcodierung: eine Farbe = immer dieselbe Bedeutung.
// Einzige Quelle für alle Bedeutungsfarben. Daraus entstehen automatisch
// die CSS-Klassen (.f-anion …), die <F>-Markierung und die Legende unter /farben/.
// Namen müssen über alle Gruppen hinweg eindeutig sein.

type Farbe = { name: string; hell: string; dunkel: string; info: string };

/* eslint-disable @typescript-eslint/no-unused-vars */
const blau = { hell: '#1d4ed8', dunkel: '#7aa7ff' };
const rot = { hell: '#c81e1e', dunkel: '#ff7b7b' };
const gruen = { hell: '#15803d', dunkel: '#5fd38a' };
const lila = { hell: '#7e22ce', dunkel: '#c39bff' };
const orange = { hell: '#c2410c', dunkel: '#ff9d5c' };
const grau = { hell: '#57606a', dunkel: '#a0a8b2' };

export const farben: Record<string, Record<string, Farbe>> = {
  // Weitere Gruppen pro Fach hier ergänzen, z. B.
  // Ethik: { pflicht: { name: 'Pflicht', ...blau, info: '…' } },
  Allgemein: {
    wichtig: { name: 'Wichtig', ...orange, info: 'besonders beachten' },
    fehler: { name: 'Fehler', ...rot, info: 'falsch / typischer Fehler' },
    richtig: { name: 'Richtig', ...gruen, info: 'korrekt' },
  },
};

export const alleFarben: Record<string, Farbe> = Object.assign({}, ...Object.values(farben));
export const farbNamen = Object.keys(alleFarben);

// akzent aus dem Frontmatter: Bedeutungsfarbe oder direkter Farbwert
export const loeseFarbe = (wert?: string) =>
  !wert ? undefined : wert in alleFarben ? `var(--f-${wert})` : wert;

export function farbCss() {
  const e = Object.entries(alleFarben);
  return [
    `:root{${e.map(([k, v]) => `--f-${k}:${v.hell}`).join(';')}}`,
    `@media (prefers-color-scheme: dark){:root{${e.map(([k, v]) => `--f-${k}:${v.dunkel}`).join(';')}}}`,
    e.map(([k]) => `.f-${k}{color:var(--f-${k})}`).join(''),
  ].join('\n');
}
