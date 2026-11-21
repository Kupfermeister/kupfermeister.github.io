// Hintergrundbilder der Fach-Kacheln (Dateien: public/bilder/<fach>.jpg, Quelle: Wikimedia Commons).
// Motive: ikonische Ereignisse, Werke, Symbole, Strukturen – keine Porträts.
// Neues Bild: Datei ablegen, Eintrag mit Titel, Urheber, Lizenz und Commons-Link ergänzen.
type Bild = { titel: string; urheber: string; lizenz: string; quelle: string; position?: string };
const c = (datei: string) => `https://commons.wikimedia.org/wiki/File:${datei}`;
export const bilder: Record<string, Bild> = {
  biologie: { titel: 'Haeckel, Kunstformen der Natur (Stephoidea)', urheber: 'Ernst Haeckel', lizenz: 'gemeinfrei', quelle: c('Haeckel_Stephoidea.jpg') },
  chemie: { titel: 'Mendelejews Periodensystem 1869', urheber: 'NikNaks nach D. Mendelejew', lizenz: 'gemeinfrei', quelle: c("Mendeleev's_1869_periodic_table.svg") },
  deutsch: { titel: 'Gutenberg-Bibel, Genesis', urheber: 'Johannes Gutenberg', lizenz: 'gemeinfrei', quelle: c('Gutenberg_Bible_B42_Genesis.JPG') },
  englisch: { titel: 'Elizabeth Tower (Big Ben)', urheber: 'Julian Herzog', lizenz: 'CC BY 4.0', quelle: c('Big_Ben_Elizabeth_Tower_London_2023_01.jpg'), position: '50% 20%' },
  ethik: { titel: 'Kant, Grundlegung zur Metaphysik der Sitten (1785)', urheber: 'Immanuel Kant', lizenz: 'gemeinfrei', quelle: c('Kant_Groundwork_Title.jpg') },
  geschichte: { titel: 'Brandenburger Tor', urheber: 'Thomas Wolf, www.foto-tw.de', lizenz: 'CC BY-SA 3.0', quelle: c('Brandenburger_Tor_nachts.jpg') },
  kunst: { titel: 'Sternennacht', urheber: 'Vincent van Gogh', lizenz: 'gemeinfrei', quelle: c('Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg') },
  mathe: { titel: 'Mandelbrot-Menge', urheber: 'Aokoroko', lizenz: 'CC0', quelle: c('Mandelbrot_Set_Image_94.png') },
  physik: { titel: 'Blasenkammer Gargamelle, leptonisches Ereignis', urheber: 'CERN', lizenz: 'CC BY 4.0', quelle: c('Leptonic_event_in_Gargamelle_bubble_chamber.jpg') },
  politik: { titel: 'Reichstagskuppel', urheber: 'Ank Kumar', lizenz: 'CC BY-SA 4.0', quelle: c('Reichstag_Dome,_Berlin_(Ank_Kumar)_04.jpg') },
};
