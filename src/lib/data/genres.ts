import type { Locale } from '@/i18n/utils';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const genres: Genre[] = [
  {
    id: 'classic_rock',
    name: 'Classic Rock',
    slug: 'classic-rock',
    description: 'Rock music from the 1960s-1980s featuring iconic guitar work',
  },
  {
    id: 'grunge_alt_rock',
    name: 'Grunge / Alternative Rock',
    slug: 'grunge-alternative',
    description: 'Alternative rock and grunge from the late 1980s-1990s Seattle scene and beyond',
  },
  {
    id: 'metal',
    name: 'Metal',
    slug: 'metal',
    description: 'Heavy metal and its subgenres featuring aggressive guitar techniques',
  },
];

export const genreSlugs: Record<string, Record<Locale, string>> = {
  'classic-rock': {
    en: 'classic-rock',
    es: 'rock-clasico',
    de: 'classic-rock',
    fr: 'rock-classique',
  },
  'grunge-alternative': {
    en: 'grunge-alternative',
    es: 'grunge-alternativo',
    de: 'grunge-alternative',
    fr: 'grunge-alternatif',
  },
  metal: {
    en: 'metal',
    es: 'metal',
    de: 'metal',
    fr: 'metal',
  },
};

export function getGenreById(id: string): Genre | undefined {
  return genres.find((g) => g.id === id);
}

export function getGenreBySlug(slug: string): Genre | undefined {
  return genres.find((g) => g.slug === slug);
}

export function getLocalizedGenreSlug(englishSlug: string, locale: Locale): string {
  return genreSlugs[englishSlug]?.[locale] || englishSlug;
}

export function getEnglishGenreSlug(localizedSlug: string, locale: Locale): string {
  for (const [englishSlug, translations] of Object.entries(genreSlugs)) {
    if (translations[locale] === localizedSlug) {
      return englishSlug;
    }
  }
  return localizedSlug;
}
