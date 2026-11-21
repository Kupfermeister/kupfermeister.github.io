import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const base = './src/inhalte';

// Ein Fach = ein Ordner in src/inhalte mit einer fach.md
const faecher = defineCollection({
  loader: glob({ pattern: '*/fach.md', base }),
  schema: z.object({
    titel: z.string(),
    beschreibung: z.string().default(''),
    kuerzel: z.string().max(3).default(''),
    farbe: z.string().default('#64748b'), // grau, falls keine Farbe gesetzt
    reihenfolge: z.number().default(100),
    erlassSeite: z.number().optional(), // Seite des Fachs im Abiturerlass-PDF (Sprung per #page=)
    kerncurriculum: z.string().url().optional(), // PDF des gültigen KCGO (Hessen, Abitur 2028)
  }),
});

// Ein Thema = Ordner <fach>/<thema>/ mit index.mdx (Frontmatter) – oder eine einzelne <fach>/<thema>.mdx
const themen = defineCollection({
  loader: glob({ pattern: ['*/*.{md,mdx}', '*/*/index.{md,mdx}', '!*/fach.md'], base }),
  schema: z.object({
    titel: z.string(),
    beschreibung: z.string().default(''),
    art: z
      .enum(['text', 'spiel', 'generator', 'uebung', 'zusammenfassung', 'werkzeug'])
      .default('text'),
    akzent: z.string().optional(), // Name einer Bedeutungsfarbe (z. B. "anion") oder Farbwert
    reihenfolge: z.number().default(100),
    breit: z.boolean().default(false), // volle Breite, z. B. für Spiele
    entwurf: z.boolean().default(false), // nur lokal sichtbar
  }),
});

// Abschnitte eines Themas: <fach>/<thema>/01-name.mdx … (Reihenfolge = Dateiname)
const abschnitte = defineCollection({
  loader: glob({ pattern: ['*/*/*.{md,mdx}', '!*/*/index.{md,mdx}'], base }),
  schema: z.object({ entwurf: z.boolean().default(false) }),
});

// Begriffsverzeichnis: <fach>/begriffe.yaml (fachbezogen) und begriffe.yaml (fächerübergreifend)
const begriff = z.object({
  def: z.string(), // Definition
  erkl: z.string(), // Erklärung
  erlaeut: z.string().optional(), // Erläuterung / Beispiel
});
const begriffe = defineCollection({
  loader: glob({ pattern: ['begriffe.yaml', '*/begriffe.yaml'], base }),
  schema: z.record(z.string(), begriff),
});

export const collections = { faecher, themen, abschnitte, begriffe };
