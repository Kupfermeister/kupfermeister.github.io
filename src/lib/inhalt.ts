import { getCollection } from 'astro:content';

export const fachVon = (id: string) => id.split('/')[0];
export const slugVon = (id: string) => id.split('/').slice(1).join('/');

const sichtbar = (entwurf: boolean) => !(import.meta.env.PROD && entwurf);
const sortiere = <T extends { data: { reihenfolge: number; titel: string } }>(a: T, b: T) =>
  a.data.reihenfolge - b.data.reihenfolge || a.data.titel.localeCompare(b.data.titel, 'de');

export async function alleFaecher() {
  const f = await getCollection('faecher');
  return f.map((e) => ({ ...e, slug: fachVon(e.id) })).sort(sortiere);
}

export async function alleThemen(fach?: string) {
  const t = await getCollection(
    'themen',
    (e) => sichtbar(e.data.entwurf) && (!fach || fachVon(e.id) === fach),
  );
  return t.map((e) => ({ ...e, fach: fachVon(e.id), slug: slugVon(e.id) })).sort(sortiere);
}

// Links immer über url(), damit ein späterer Umzug (z. B. nach /JF) nur die Konfig betrifft
export const url = (pfad = '') =>
  import.meta.env.BASE_URL.replace(/\/?$/, '/') + pfad.replace(/^\//, '');
