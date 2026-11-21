// Hintergrundfotos der Fach-Kacheln (Dateien: public/bilder/<fach>.jpg, Quelle: Wikimedia Commons).
// Neues Bild: Datei ablegen, Eintrag mit Titel, Urheber, Lizenz und Commons-Link ergänzen.
type Bild = { titel: string; urheber: string; lizenz: string; quelle: string; position?: string };
const c = (datei: string) => `https://commons.wikimedia.org/wiki/File:${datei}`;
export const bilder: Record<string, Bild> = {
  biologie: { titel: 'Charles Darwin', urheber: 'Henry Maull & John Fox', lizenz: 'gemeinfrei', quelle: c('Charles_Darwin_seated_crop.jpg'), position: '50% 25%' },
  chemie: { titel: 'Dmitri Mendelejew', urheber: 'unbekannt', lizenz: 'gemeinfrei', quelle: c('DIMendeleevCab.jpg'), position: '50% 25%' },
  deutsch: { titel: 'Goethe', urheber: 'Joseph Karl Stieler', lizenz: 'gemeinfrei', quelle: c('Goethe_(Stieler_1828).jpg'), position: '50% 25%' },
  englisch: { titel: 'William Shakespeare', urheber: 'John Taylor (zugeschr.)', lizenz: 'gemeinfrei', quelle: c('Shakespeare.jpg'), position: '50% 25%' },
  ethik: { titel: 'Immanuel Kant', urheber: 'unbekannt', lizenz: 'gemeinfrei', quelle: c('Immanuel_Kant_portrait_c1790.jpg'), position: '50% 25%' },
  geschichte: { titel: 'Die Freiheit führt das Volk', urheber: 'Eugène Delacroix', lizenz: 'gemeinfrei', quelle: c('Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg'), position: '50% 30%' },
  kunst: { titel: 'Mona Lisa', urheber: 'Leonardo da Vinci', lizenz: 'gemeinfrei', quelle: c('Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg'), position: '50% 25%' },
  mathe: { titel: 'Leonhard Euler', urheber: 'Jakob Emanuel Handmann', lizenz: 'gemeinfrei', quelle: c('Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg'), position: '50% 25%' },
  physik: { titel: 'Albert Einstein', urheber: 'Ferdinand Schmutzer', lizenz: 'gemeinfrei', quelle: c('Einstein_1921_by_F_Schmutzer_-_restoration.jpg'), position: '50% 25%' },
  politik: { titel: 'Reichstagsgebäude', urheber: 'Jürgen Matern', lizenz: 'CC BY-SA 3.0', quelle: c('Reichstag_building_Berlin_view_from_west_before_sunset.jpg') },
};
