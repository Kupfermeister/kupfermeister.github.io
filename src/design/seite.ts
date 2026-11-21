// Name und Untertitel der Seite – an einer Stelle änderbar.
export const seite = {
  name: 'Lernseite',
  untertitel: 'Frei zugängliche Lerninhalte für alle Fächer.',
  start: 'Start', // erster Eintrag im Pfad (Kopfzeile)
};

// Verbindliche Grundlage: Hessen, Landesabitur 2028.
// Gültige Kerncurricula (KCGO, Ausgabe 2024) stehen je Fach in fach.md (Feld `kerncurriculum`).
export const abiturerlass = {
  titel: 'Abiturerlass zum Landesabitur 2028',
  stand: 'Erlass vom 28. Mai 2026',
  href: 'https://kultus.hessen.de/sites/kultus.hessen.de/files/2026-11/abiturerlass_la28.pdf',
};

export const artLabel: Record<string, string> = {
  text: '',
  spiel: 'Spiel',
  generator: 'Generator',
  uebung: 'Übung',
  zusammenfassung: 'Zusammenfassung',
  werkzeug: 'Werkzeug',
};
