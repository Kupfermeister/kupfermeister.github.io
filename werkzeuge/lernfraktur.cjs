// Lernfraktur – jede Glyphe wird mit einer simulierten Breitfeder "geschrieben".
// Federmodell: Feder = Strecke der Breite W, gehalten im Winkel ANG zur Grundlinie.
// Jeder Strich ist ein Pfad der Federmitte; jedes Teilstück wird als Minkowski-Summe
// (Strecke ⊕ Federkante) = Parallelogramm gefüllt. Dünn = Bewegung parallel zur Feder,
// fett = Bewegung senkrecht dazu (Rauten an Kopf und Fuß).
const opentype = require('opentype.js');
const path = require('path');

const W = 92, ANG = 40 * Math.PI / 180;
const hx = Math.cos(ANG) * W / 2, hy = Math.sin(ANG) * W / 2; // ≈ 35 / 30
const T = 470, B = 30, C = 670, A = 770, D = -220; // Federmitte für x-Höhe 500, Grundlinie 0, Versal 700, Ober 800, Unter -250

function parallelogramme(strich) {
  const out = [];
  for (let i = 0; i < strich.length - 1; i++) {
    const [x0, y0] = strich[i], [x1, y1] = strich[i + 1];
    let p = [[x0 - hx, y0 - hy], [x1 - hx, y1 - hy], [x1 + hx, y1 + hy], [x0 + hx, y0 + hy]];
    let fl = 0; for (let k = 0; k < 4; k++) { const a = p[k], b = p[(k + 1) % 4]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (Math.abs(fl) < 1) continue;
    if (fl < 0) p.reverse(); // alle Konturen gegen den Uhrzeigersinn → nonzero füllt Überlappungen
    out.push(p);
  }
  return out;
}

// ---- Federgriffe (Bausteine) ----
// Schaft mit Rautenkopf und Rautenfuß; top/bot = Tintenkante
const st = (x, top, bot, kopf = true, fuss = true) => [
  ...(kopf ? [[x - 30, top - 30]] : [[x, top - 30]]), [x, top - 62],
  [x, bot + 62], ...(fuss ? [[x + 30, bot + 30]] : [[x, bot + 30]])];
const raute = (x, y) => [[x - 22, y + 20], [x + 22, y - 20]];
const hexo = (L, R, t, b, c) => [
  [[L + c, t], [L, t - c], [L, b + c], [L + c, b]],
  [[L + c, t], [R - c, t], [R, t - c], [R, b + c], [R - c, b], [L + c, b]]];
const bogenL = (L, R, t, b, c) => [[R, t], [L + c, t], [L, t - c], [L, b + c], [L + c, b], [R, b + 20]];
const bogenR = (x, R, t, b, c) => [[x, t - 60], [x + 60, t], [R - c, t], [R, t - c], [R, b + c], [R - c, b], [x, b]];
const sAuf = (L, R, t, b) => [[R + 10, t - 30], [R - 30, t], [L + 40, t], [L, t - 40], [L, (t + b) / 2 + 60], [R, (t + b) / 2 - 60], [R, b + 40], [R - 40, b], [L + 10, b], [L - 25, b + 35]];
const ue = (x) => [raute(x - 55, 620), raute(x + 55, 620)];

const g = {}; // zeichen → [striche, breite]
const def = (ch, striche, breite) => g[ch] = [striche, breite];

// ---- Gemeine ----
def('a', [bogenL(60, 290, T, B, 60), st(290, 500, 0, false)], 370);
def('b', [st(80, 800, 0, true, false), bogenR(80, 300, T, B, 60)], 370);
def('c', [[[275, T - 35], [250, T], [130, T], [60, T - 70], [60, B + 70], [130, B], [280, B + 30]]], 340);
def('d', [bogenL(60, 290, T, B, 60), [[220, A], [290, A - 60], [290, B + 32], [320, B]]], 370);
def('e', [[[290, B + 30], [260, B], [130, B], [60, B + 70], [60, T - 70], [130, T], [235, T], [290, T - 55], [290, 300], [62, 220]]], 360);
def('f', [[[90, -150], [90, 690], [150, A], [230, A], [280, A - 40]], [[30, T], [230, T]]], 300);
def('g', [bogenL(60, 290, T, B, 60), [[290, T + 30], [290, -150], [230, D], [110, D], [60, D + 40]]], 370);
def('h', [st(80, 800, 0), [[80, 380], [250, T], [295, T - 45], [295, -140], [230, D], [130, D]]], 370);
def('i', [st(100, 500, 0), raute(100, 630)], 200);
def('j', [[[70, T], [100, T - 32], [100, -150], [40, D], [-20, D + 20]], raute(100, 630)], 200);
def('k', [st(80, 800, 0), [[80, 280], [210, T], [265, T - 40], [265, 380], [160, 300], [80, 290]], [[160, 290], [300, B]]], 350);
def('l', [st(100, 800, 0)], 200);
def('m', [st(80, 500, 0), [[80, 380], [230, T], [270, T - 40], [270, B + 62], [300, B + 32]], [[270, 380], [420, T], [460, T - 40], [460, B + 62], [490, B + 32]]], 560);
def('n', [st(80, 500, 0), [[80, 380], [250, T], [290, T - 40], [290, B + 62], [320, B + 32]]], 380);
def('o', hexo(60, 300, T, B, 60), 360);
def('p', [st(80, 500, -250, true, false), bogenR(80, 300, T, B, 60)], 370);
def('q', [bogenL(60, 290, T, B, 60), st(290, 500, -250, false, false)], 370);
def('r', [st(80, 500, 0), [[80, 380], [200, T], [250, T - 30]], raute(255, T - 30)], 290);
def('s', [sAuf(55, 270, T, B)], 330);
def('t', [[[100, 640], [100, 90], [160, B], [260, B + 30]], [[30, T], [230, T]]], 290);
def('u', [[[50, T], [80, T - 30], [80, B + 62], [140, B], [290, 110]], st(290, 500, 0)], 380);
def('v', [[[50, T], [80, T - 30], [80, B + 62], [140, B], [290, 120], [290, T - 40], [245, T]]], 350);
def('w', [[[50, T], [80, T - 30], [80, B + 62], [140, B], [270, 100]], [[270, T - 30], [270, B + 62], [330, B], [470, 120], [470, T - 40], [425, T]]], 530);
def('x', [[[40, T], [70, T - 30], [270, B + 30], [300, B]], [[280, T], [60, B]]], 340);
def('y', [[[50, T], [80, T - 30], [80, B + 62], [140, B], [290, 110]], [[290, T + 30], [290, -150], [230, D], [110, D], [60, D + 40]]], 370);
def('z', [[[45, T - 40], [90, T], [280, T], [280, T - 60], [70, B + 20], [250, B], [300, B + 40]]], 340);
def('ß', [[[80, B + 62], [80, 690], [150, A], [240, A], [290, A - 50], [290, 590], [180, 470], [290, 400], [290, 90], [230, B], [150, B]]], 370);
def('ä', [...g.a[0], ...ue(175)], 370);
def('ö', [...g.o[0], ...ue(180)], 360);
def('ü', [...g.u[0], ...ue(185)], 380);

// ---- Versalien (vereinfacht, gebrochen) ----
def('A', [[[40, B], [250, C]], [[250, C], [330, C], [400, C - 70], [400, B + 62], [430, B + 32]], [[140, 330], [400, 330]]], 480);
def('B', [st(80, 700, 0, true, false), [[80, C], [300, C], [350, C - 50], [350, 440], [270, 380], [80, 380]], [[270, 380], [380, 320], [380, 90], [320, B], [80, B]]], 450);
def('C', [[[400, C - 30], [370, C], [170, C], [70, C - 100], [70, B + 100], [170, B], [370, B], [420, B + 40]], raute(400, C - 40)], 460);
def('D', [st(80, 700, 0, true, false), [[80, C], [290, C], [410, C - 120], [410, B + 120], [290, B], [80, B]]], 480);
def('E', [[[400, C - 30], [370, C], [170, C], [70, C - 100], [70, B + 100], [170, B], [370, B], [420, B + 40]], [[90, 370], [320, 370]]], 460);
def('F', [st(110, 700, 0, false), [[40, C], [390, C], [430, C - 40]], [[110, 370], [330, 370]]], 450);
def('G', [[[400, C - 30], [370, C], [170, C], [70, C - 100], [70, B + 100], [170, B], [340, B], [410, B + 70], [410, 300], [250, 300]]], 480);
def('H', [st(80, 700, 0), [[80, 380], [300, C - 220], [380, C - 300], [380, B + 62], [410, B + 32]], [[30, C], [80, C - 30]]], 470);
def('I', [[[90, C], [310, C]], [[200, C], [200, B]], [[90, B], [310, B]]], 400);
def('J', [[[90, C], [330, C]], [[250, C], [250, 100], [180, B], [80, B], [30, B + 50]]], 380);
def('K', [st(80, 700, 0), [[400, C], [100, 370]], [[190, 420], [420, B]]], 450);
def('L', [st(100, 700, 0, true, false), [[100, B], [380, B], [420, B + 40]]], 440);
def('M', [st(80, 700, 0), [[80, C - 120], [230, C], [280, C - 50], [280, B + 62], [310, B + 32]], [[280, C - 120], [430, C], [480, C - 50], [480, B + 62], [510, B + 32]]], 580);
def('N', [st(80, 700, 0), [[80, C], [380, B]], st(380, 700, 0, true, false)], 470);
def('O', hexo(70, 420, C, B, 100), 490);
def('P', [st(80, 700, 0), [[80, C], [300, C], [380, C - 80], [380, 420], [300, 340], [80, 340]]], 450);
def('Q', [...hexo(70, 420, C, B, 100), [[250, 120], [450, -130]]], 490);
def('R', [st(80, 700, 0), [[80, C], [300, C], [380, C - 80], [380, 420], [300, 340], [80, 340]], [[220, 340], [410, B]]], 460);
def('S', [sAuf(60, 380, C, B)], 440);
def('T', [[[40, C], [420, C], [450, C - 40]], st(240, 700, 0, false)], 480);
def('U', [[[50, C], [80, C - 30], [80, B + 90], [160, B], [380, 120]], st(380, 700, 0)], 470);
def('V', [[[50, C], [80, C - 30], [80, B + 90], [160, B], [400, 200], [400, C - 50], [350, C]]], 470);
def('W', [[[50, C], [80, C - 30], [80, B + 90], [150, B], [290, 120]], [[290, C - 30], [290, B + 90], [360, B], [520, 200], [520, C - 50], [470, C]]], 590);
def('X', [[[40, C], [70, C - 30], [390, B + 30], [420, B]], [[410, C], [60, B]]], 460);
def('Y', [[[40, C], [70, C - 30], [230, 360]], [[420, C], [230, 360], [230, B + 62], [260, B + 32]]], 460);
def('Z', [[[50, C - 50], [100, C], [400, C], [400, C - 60], [70, B + 20], [370, B], [420, B + 40]], [[130, 350], [330, 350]]], 460);
def('Ä', [...g.A[0], ...ue(250).map(r => r.map(([x, y]) => [x, y + 180]))], 480);
def('Ö', [...g.O[0], ...ue(245).map(r => r.map(([x, y]) => [x, y + 180]))], 490);
def('Ü', [...g.U[0], ...ue(230).map(r => r.map(([x, y]) => [x, y + 180]))], 470);

// ---- Ziffern (Höhe 650) ----
const Z = 620;
def('0', hexo(60, 340, Z, B, 80), 400);
def('1', [[[90, Z - 100], [210, Z]], st(210, 650, 0, false)], 400);
def('2', [[[70, Z - 60], [130, Z], [270, Z], [330, Z - 60], [330, 400], [70, B + 20], [300, B], [350, B + 40]]], 400);
def('3', [[[70, Z - 40], [120, Z], [270, Z], [330, Z - 60], [330, 410], [270, 350], [170, 350]], [[270, 350], [340, 280], [340, 90], [280, B], [120, B], [60, B + 50]]], 400);
def('4', [[[260, Z], [50, 220], [360, 220]], st(270, 650, 0, false)], 400);
def('5', [[[330, Z], [90, Z], [80, 380], [270, 380], [340, 310], [340, 90], [280, B], [120, B], [60, B + 50]]], 400);
def('6', [[[310, Z], [150, Z], [70, Z - 100], [70, B + 70], [130, B], [280, B], [340, B + 60], [340, 300], [280, 360], [80, 360]]], 400);
def('7', [[[50, Z - 30], [80, Z], [340, Z], [150, B]], [[120, 330], [300, 330]]], 400);
def('8', [...hexo(80, 320, Z, 360, 60), ...hexo(60, 340, 360, B, 70)], 400);
def('9', [[[90, B], [250, B], [330, 100], [330, Z - 70], [270, Z], [120, Z], [60, Z - 60], [60, 420], [120, 360], [320, 360]]], 400);

// ---- Zeichen ----
def('.', [raute(90, 30)], 180);
def(',', [[[68, 50], [112, 10], [70, -110]]], 180);
def(':', [raute(90, 30), raute(90, 400)], 180);
def(';', [[[68, 50], [112, 10], [70, -110]], raute(90, 400)], 180);
def('-', [[[40, 270], [220, 270]]], 260);
def('–', [[[40, 270], [460, 270]]], 500);
def('!', [st(100, 720, 180, true, false), raute(100, 30)], 200);
def('?', [[[60, 620], [120, 690], [270, 690], [320, 630], [320, 520], [170, 380], [170, 220]], raute(170, 30)], 380);
def("'", [[[80, 700], [80, 560]]], 160);
def('"', [[[70, 700], [70, 560]], [[160, 700], [160, 560]]], 240);
def('(', [[[220, 760], [90, 600], [90, 0], [220, -160]]], 260);
def(')', [[[40, 760], [170, 600], [170, 0], [40, -160]]], 260);
def('/', [[[40, -120], [300, 760]]], 340);
def('&', [[[400, B], [110, 450], [110, 590], [170, 660], [260, 660], [310, 600], [80, 300], [80, 90], [140, B], [260, B], [380, 220]]], 450);
def(' ', [], 220);

// ---- Schrift erzeugen ----
const glyphs = [new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 400, path: new opentype.Path() })];
for (const [ch, [striche, breite]] of Object.entries(g)) {
  const p = new opentype.Path();
  for (const s of striche) for (const pg of parallelogramme(s)) {
    p.moveTo(...pg[0].map(Math.round)); for (let k = 1; k < 4; k++) p.lineTo(...pg[k].map(Math.round)); p.close();
  }
  glyphs.push(new opentype.Glyph({ name: 'u' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'), unicode: ch.codePointAt(0), advanceWidth: breite + 30, path: p }));
}
const font = new opentype.Font({
  familyName: 'Lernfraktur', styleName: 'Regular', unitsPerEm: 1000, ascender: 820, descender: -260, glyphs,
  copyright: 'Lernfraktur – frei unter der SIL Open Font License 1.1',
  license: 'SIL Open Font License 1.1', licenseURL: 'https://openfontlicense.org',
});
const ziel = process.argv[2] || path.join(__dirname, 'Lernfraktur.otf');
font.download ? 0 : 0;
require('fs').writeFileSync(ziel, Buffer.from(font.toArrayBuffer()));
console.log('geschrieben:', ziel, Object.keys(g).length, 'Zeichen');
