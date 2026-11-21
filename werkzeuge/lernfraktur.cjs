// Lernfraktur – moderne gebrochene Schrift im Stil der Schaftstiefelgrotesk (Tannenberg, Potsdam).
// Jede Glyphe wird mit einer simulierten Feder "geschrieben": ein Strich ist der Weg der Federmitte,
// jedes Teilstück wird als Minkowski-Summe (Strecke ⊕ Federform) = konvexe Hülle gefüllt.
// Die Feder ist ein breites, schräg geschnittenes Parallelogramm (130 breit, 90 hoch, Schnitt steigt
// nach rechts). Ergebnis: fast gleich fette Schäfte und Querstriche, schräg abgeschnittene Schaftenden,
// gebrochene (abgeschrägte) Ecken statt Rundungen – die Merkmale der Schaftstiefelgrotesk.
// Aufruf: node werkzeuge/lernfraktur.cjs public/schriften/Lernfraktur.otf
const opentype = require('opentype.js');
const fs = require('fs');
const pc = require('polygon-clipping');

const FEDER = [[-72, -62], [72, -26], [72, 62], [-72, 26]];
const T = 438, B = 62, C = 638, A = 738, D = -188, Z = 588; // Federmitte für x-Höhe 500, Versal 700, Ober 800, Unter −250, Ziffer 650

function huelle(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const u = [], o = [];
  for (const p of pts) { while (u.length >= 2 && kreuz(u[u.length - 2], u[u.length - 1], p) <= 0) u.pop(); u.push(p); }
  for (const p of pts.slice().reverse()) { while (o.length >= 2 && kreuz(o[o.length - 2], o[o.length - 1], p) <= 0) o.pop(); o.push(p); }
  return u.slice(0, -1).concat(o.slice(0, -1)); // gegen den Uhrzeigersinn
}
const zug = (strich) => {
  if (strich.length === 1) strich = [strich[0], [strich[0][0], strich[0][1] + 1]];
  const out = [];
  for (let i = 0; i < strich.length - 1; i++) {
    const [p, q] = [strich[i], strich[i + 1]];
    out.push(huelle(FEDER.flatMap(([dx, dy]) => [[p[0] + dx, p[1] + dy], [q[0] + dx, q[1] + dy]])));
  }
  return out;
};

// ---- Bausteine ----
const L = 80, R = 320;
const punkt = (x, y) => [[x, y]];
const bogenL = (l, r, t, b, c = 60) => [[r, t], [l + c, t], [l, t - c], [l, b + c], [l + c, b], [r, b]];
const bogenR = (l, r, t, b, c = 60) => [[l, t], [r - c, t], [r, t - c], [r, b + c], [r - c, b], [l, b]];
const ring = (l, r, t, b, c = 60) => [[l + c, t], [r - c, t], [r, t - c], [r, b + c], [r - c, b], [l + c, b], [l, b + c], [l, t - c], [l + c, t]];
const schulter = (l, r, t, b, c = 110) => [[l, t - c], [l + c, t], [r, t], [r, b]];
const sForm = (l, r, t, b) => { const m = (t + b) / 2; return [[r + 10, t], [l + 60, t], [l, t - 60], [l, m + 40], [r, m - 40], [r, b + 60], [r - 60, b], [l - 10, b]]; };
const ueber = (striche, x1, x2, y) => [...striche, punkt(x1, y), punkt(x2, y)];

const g = {};
const def = (ch, striche) => g[ch] = striche;

// ---- Gemeine ----
def('a', [bogenL(L, R, T, B), [[R, T], [R, B]]]);
def('b', [[[L, A], [L, B]], [[L - 60, A - 30], [L, A]], bogenR(L, R, T, B)]);
def('c', [[[R + 10, T], [L + 60, T], [L, T - 60], [L, B + 60], [L + 60, B], [R + 10, B]]]);
def('d', [[[R, T - 40], [R, B + 60], [R - 60, B], [L + 60, B], [L, B + 60], [L, T - 60], [L + 60, T], [R - 20, T]], [[R, T - 40], [R, T + 60], [L + 10, A]]]);
def('e', [[[R + 10, B], [L + 60, B], [L, B + 60], [L, T - 60], [L + 60, T], [R - 50, T], [R, T - 50], [R, 250], [L, 250]]]);
def('f', [[[L, B], [L, A - 60], [L + 60, A], [R + 10, A]], [[L - 50, T], [R - 40, T]]]);
def('g', [bogenL(L, R, T, B), [[R, T], [R, D + 60], [R - 60, D], [L - 10, D]]]);
def('h', [[[L, A], [L, B]], [[L - 60, A - 30], [L, A]], [[L, T - 110], [L + 110, T], [R, T], [R, D + 60], [R - 60, D], [L + 20, D]]]);
def('i', [[[L, T], [L, B]], punkt(L, 650)]);
def('j', [[[L, T], [L, D + 60], [L - 60, D], [L - 120, D]], punkt(L, 650)]);
def('k', [[[L, A], [L, B]], [[L - 60, A - 30], [L, A]], [[L + 30, 240], [R, T]], [[L + 60, 260], [R + 10, B]]]);
def('l', [[[L, A], [L, B]], [[L - 60, A - 30], [L, A]]]);
def('m', [[[80, T], [80, B]], schulter(80, 320, T, B), schulter(320, 560, T, B)]);
def('n', [[[L, T], [L, B]], schulter(L, R, T, B)]);
def('o', [ring(L, R, T, B)]);
def('p', [[[L, T], [L, D]], bogenR(L, R, T, B)]);
def('q', [bogenL(L, R, T, B), [[R, T], [R, D]]]);
def('r', [[[L, T], [L, B]], [[L, T - 110], [L + 110, T], [R, T], [R, T - 50]]]);
def('s', [sForm(L, R, T, B)]);
def('t', [[[L, 640], [L, B + 60], [L + 60, B], [R, B]], [[L - 50, T], [R - 40, T]]]);
def('u', [[[L, T], [L, B + 60], [L + 60, B], [R, B]], [[R, T], [R, B]]]);
def('v', [[[L, T], [L, B + 60], [L + 60, B], [R, B + 110], [R, T]]]);
def('w', [[[80, T], [80, B + 60], [140, B], [320, B]], [[320, T], [320, B + 60], [380, B], [560, B + 110], [560, T]]]);
def('x', [[[L, T], [R, B]], [[R, T], [L, B]]]);
def('y', [[[L, T], [L, B + 60], [L + 60, B], [R, B]], [[R, T], [R, D + 60], [R - 60, D], [L - 10, D]]]);
def('z', [[[L, T], [R, T], [R, T - 50], [L, B + 50], [L, B], [R + 10, B]]]);
def('ß', [[[L, B], [L, A - 60], [L + 60, A], [R - 60, A], [R, A - 60], [R, 560], [L + 90, 420], [R - 60, 400], [R, 340], [R, B + 60], [R - 60, B], [L + 40, B]]]);
def('ä', ueber(g.a, L, R, 650));
def('ö', ueber(g.o, L, R, 650));
def('ü', ueber(g.u, L, R, 650));

// ---- Versalien ----
const VL = 90, VR = 420;
def('A', [[[VL, B], [VL, C - 60], [VL + 60, C], [VR, C], [VR, B]], [[VL, 340], [VR, 340]]]);
def('B', [[[VL, C], [VL, B]], [[VL, C], [VR - 60, C], [VR, C - 60], [VR, 420], [VR - 60, 360], [VL, 360]], [[VR - 60, 360], [VR, 300], [VR, B + 60], [VR - 60, B], [VL, B]]]);
def('C', [[[VR + 10, C], [VL + 80, C], [VL, C - 80], [VL, B + 80], [VL + 80, B], [VR + 10, B]], [[VL + 150, C - 120], [VL + 150, C]]]);
def('D', [[[VL, C], [VL, B]], [[VL, C], [VR - 80, C], [VR, C - 80], [VR, B + 80], [VR - 80, B], [VL, B]]]);
def('E', [[[VR + 10, C], [VL + 80, C], [VL, C - 80], [VL, B + 80], [VL + 80, B], [VR + 10, B]], [[VL, 360], [VR - 40, 360]]]);
def('F', [[[VL, C], [VL, B]], [[VL, C], [VR + 10, C]], [[VL, 360], [VR - 40, 360]]]);
def('G', [[[VR + 10, C], [VL + 80, C], [VL, C - 80], [VL, B + 80], [VL + 80, B], [VR, B], [VR, 330], [VR - 110, 330]]]);
def('H', [[[VL, C], [VL, B]], [[VL, C - 130], [VL + 130, 380], [VR, 380]], [[VR, C], [VR, D + 60], [VR - 60, D], [VL + 40, D]]]);
def('I', [[[110, C], [110, B]], [[30, C], [190, C]]]);
def('J', [[[30, C], [230, C]], [[160, C], [160, B + 60], [100, B], [20, B]]]);
def('K', [[[VL, C], [VL, B]], [[VL + 40, 320], [VR, C]], [[VL + 70, 350], [VR + 10, B]]]);
def('L', [[[VL, C], [VL, B], [VR + 10, B]]]);
def('M', [[[80, C], [80, B]], schulter(80, 335, C, B, 120), schulter(335, 590, C, B, 120)]);
def('N', [[[VL, C], [VL, B]], schulter(VL, VR, C, B, 130)]);
def('O', [ring(VL, VR, C, B, 80)]);
def('P', [[[VL, C], [VL, B]], [[VL, C], [VR - 60, C], [VR, C - 60], [VR, 400], [VR - 60, 340], [VL, 340]]]);
def('Q', [ring(VL, VR, C, B, 80), [[VR - 80, B + 40], [VR + 40, B - 110]]]);
def('R', [[[VL, C], [VL, B]], [[VL, C], [VR - 60, C], [VR, C - 60], [VR, 400], [VR - 60, 340], [VL, 340]], [[VR - 60, 340], [VR, 280], [VR, B]]]);
def('S', [sForm(VL, VR, C, B)]);
def('T', [[[30, C], [410, C]], [[220, C], [220, B]]]);
def('U', [[[VL, C], [VL, B + 60], [VL + 60, B], [VR, B]], [[VR, C], [VR, B]]]);
def('V', [[[VL, C], [VL, B + 60], [VL + 60, B], [VR, B + 130], [VR, C]]]);
def('W', [[[80, C], [80, B + 60], [140, B], [335, B]], [[335, C], [335, B + 60], [395, B], [590, B + 130], [590, C]]]);
def('X', [[[VL, C], [VR, B]], [[VR, C], [VL, B]]]);
def('Y', [[[VL, C], [VL, 400], [VL + 60, 340], [VR, 340]], [[VR, C], [VR, B]]]);
def('Z', [[[VL, C], [VR, C], [VR, C - 60], [VL, B + 60], [VL, B], [VR + 10, B]]]);
def('Ä', ueber(g.A, VL, VR, 860));
def('Ö', ueber(g.O, VL, VR, 860));
def('Ü', ueber(g.U, VL, VR, 860));

// ---- Ziffern ----
const ZL = 80, ZR = 330;
def('0', [ring(ZL, ZR, Z, B, 70)]);
def('1', [[[60, 500], [190, Z]], [[190, Z], [190, B]]]);
def('2', [[[ZL, Z - 50], [ZL + 50, Z], [ZR - 60, Z], [ZR, Z - 60], [ZR, 400], [ZL, B + 60], [ZL, B], [ZR + 10, B]]]);
def('3', [[[ZL, Z], [ZR - 60, Z], [ZR, Z - 60], [ZR, 400], [ZR - 60, 340], [ZL + 40, 340]], [[ZR - 60, 340], [ZR, 280], [ZR, B + 60], [ZR - 60, B], [ZL, B]]]);
def('4', [[[ZR - 20, Z], [ZL, 240], [ZL, 190], [ZR + 40, 190]], [[ZR, 400], [ZR, B]]]);
def('5', [[[ZR + 10, Z], [ZL, Z], [ZL, 350], [ZR - 60, 350], [ZR, 290], [ZR, B + 60], [ZR - 60, B], [ZL, B]]]);
def('6', [[[ZR, Z], [ZL + 60, Z], [ZL, Z - 60], [ZL, B + 60], [ZL + 60, B], [ZR - 60, B], [ZR, B + 60], [ZR, 290], [ZR - 60, 350], [ZL, 350]]]);
def('7', [[[ZL, Z], [ZR, Z], [ZR, Z - 90], [ZL + 60, B]]]);
def('8', [ring(ZL + 10, ZR - 10, Z, 340, 55), ring(ZL, ZR, 340, B, 60)]);
def('9', [[[ZL, B], [ZR - 60, B], [ZR, B + 60], [ZR, Z - 60], [ZR - 60, Z], [ZL + 60, Z], [ZL, Z - 60], [ZL, 360], [ZL + 60, 300], [ZR, 300]]]);

// ---- Zeichen ----
def('.', [punkt(75, B)]);
def(',', [[[75, B], [55, -100]]]);
def(':', [punkt(75, B), punkt(75, 400)]);
def(';', [[[75, B], [55, -100]], punkt(75, 400)]);
def('-', [[[60, 260], [180, 260]]]);
def('–', [[[60, 260], [400, 260]]]);
def('!', [[[75, 700], [75, 230]], punkt(75, B)]);
def('?', [[[L, 600], [L + 60, 655], [R - 60, 655], [R, 595], [R, 470], [185, 360], [185, 250]], punkt(185, B)]);
def("'", [[[75, 700], [75, 580]]]);
def('"', [[[75, 700], [75, 580]], [[235, 700], [235, 580]]]);
def('(', [[[210, 760], [90, 640], [90, -60], [210, -180]]]);
def(')', [[[75, 760], [195, 640], [195, -60], [75, -180]]]);
def('/', [[[60, -120], [300, 760]]]);
def('&', [[[R + 60, B], [L + 60, 430], [L + 60, 580], [L + 120, 655], [R - 40, 655], [R, 590], [L, 310], [L, B + 60], [L + 60, B], [R, B], [R + 60, 200]]]);

// ---- Schrift erzeugen (Vor- und Nachbreite automatisch: je 35 Einheiten) ----
const glyphs = [new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 400, path: new opentype.Path() }),
  new opentype.Glyph({ name: 'space', unicode: 32, advanceWidth: 240, path: new opentype.Path() })];
for (const [ch, striche] of Object.entries(g)) {
  const roh = striche.flatMap(zug);
  const verschmolzen = roh.length ? pc.union(...roh.map(p => [[...p, p[0]]])) : [];
  const polys = verschmolzen.flatMap(poly => poly.map(ring => ring.slice(0, -1)));
  const minX = Math.min(...polys.flat().map(p => p[0])), maxX = Math.max(...polys.flat().map(p => p[0]));
  const dx = 35 - minX, p = new opentype.Path();
  for (const pg of polys) { pg.forEach(([x, y], k) => p[k ? 'lineTo' : 'moveTo'](Math.round(x + dx), Math.round(y))); p.close(); }
  glyphs.push(new opentype.Glyph({ name: 'u' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'), unicode: ch.codePointAt(0), advanceWidth: Math.round(maxX - minX + 70), path: p }));
}
const font = new opentype.Font({
  familyName: 'Lernfraktur', styleName: 'Regular', unitsPerEm: 1000, ascender: 900, descender: -260, glyphs,
  copyright: 'Lernfraktur – frei unter der SIL Open Font License 1.1',
  license: 'SIL Open Font License 1.1', licenseURL: 'https://openfontlicense.org',
});
const ziel = process.argv[2] || 'Lernfraktur.otf';
fs.writeFileSync(ziel, Buffer.from(font.toArrayBuffer()));
console.log('geschrieben:', ziel, glyphs.length - 1, 'Zeichen');
