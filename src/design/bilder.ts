// Hintergrundbilder der Fach-Kacheln (Dateien: public/bilder/<fach>.jpg, Quelle: Wikimedia Commons).
// Motive: ikonische Ereignisse, Werke, Symbole, Strukturen – keine Porträts.
// Neues Bild: Datei ablegen, Eintrag mit Titel, Urheber, Lizenz und Commons-Link ergänzen.
type Bild = { titel: string; urheber: string; lizenz: string; quelle: string; position?: string; negativ?: boolean };
const c = (datei: string) => `https://commons.wikimedia.org/wiki/File:${datei}`;
export const bilder: Record<string, Bild> = {
  biologie: { titel: 'Photo 51 – Röntgenbeugungsbild der DNA (Nachbildung)', urheber: 'Emily Willoughby', lizenz: 'CC0', quelle: c('60251254_photo-51-print-qp867-a4_2.jpg') },
  chemie: { titel: 'Koffein-Molekül (Kugel-Stab-Modell)', urheber: 'Jynto', lizenz: 'CC0', quelle: c('Caffeine_(2)_3D_ball.png') },
  deutsch: { titel: 'Gutenberg-Bibel, Genesis', urheber: 'Johannes Gutenberg', lizenz: 'gemeinfrei', quelle: c('Gutenberg_Bible_B42_Genesis.JPG') },
  englisch: { titel: 'Elizabeth Tower (Big Ben)', urheber: 'Julian Herzog', lizenz: 'CC BY 4.0', quelle: c('Big_Ben_Elizabeth_Tower_London_2023_01.jpg'), position: '50% 20%' },
  ethik: { titel: 'Kant, Grundlegung zur Metaphysik der Sitten (1785)', urheber: 'Immanuel Kant', lizenz: 'gemeinfrei', quelle: c('Kant_Groundwork_Title.jpg') },
  geschichte: { titel: 'Brandenburger Tor', urheber: 'Thomas Wolf, www.foto-tw.de', lizenz: 'CC BY-SA 3.0', quelle: c('Brandenburger_Tor_nachts.jpg') },
  kunst: { titel: 'Sternennacht', urheber: 'Vincent van Gogh', lizenz: 'gemeinfrei', quelle: c('Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg') },
  mathe: { titel: 'Integral als Fläche unter der Kurve', urheber: '4C', lizenz: 'CC BY-SA 3.0', quelle: c('Integral_as_region_under_curve.svg'), negativ: true },
  physik: { titel: 'Blasenkammer Gargamelle, leptonisches Ereignis', urheber: 'CERN', lizenz: 'CC BY 4.0', quelle: c('Leptonic_event_in_Gargamelle_bubble_chamber.jpg') },
  politik: { titel: 'Reichstagskuppel', urheber: 'Ank Kumar', lizenz: 'CC BY-SA 4.0', quelle: c('Reichstag_Dome,_Berlin_(Ank_Kumar)_04.jpg') },
};
