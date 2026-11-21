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
    farbe: z.string().default('#64748b'),
    reihenfolge: z.number().default(100),
  }),
});

// Ein Thema = eine .md/.mdx-Datei im Fach-Ordner
const themen = defineCollection({
  loader: glob({ pattern: ['*/*.{md,mdx}', '!*/fach.md'], base }),
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

export const collections = { faecher, themen };
