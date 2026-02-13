import type { Locale } from '@/i18n/utils';

// Localized slugs for URL paths
// Format: { [englishSlug]: { [locale]: localizedSlug } }

export const instrumentSlugs: Record<string, Record<Locale, string>> = {
  guitar: {
    en: 'guitar',
    es: 'guitarra',
    de: 'gitarre',
    fr: 'guitare',
  },
  bass: {
    en: 'bass',
    es: 'bajo',
    de: 'bass',
    fr: 'basse',
  },
  'bass-5-string': {
    en: 'bass-5-string',
    es: 'bajo-5-cuerdas',
    de: 'bass-5-saiter',
    fr: 'basse-5-cordes',
  },
  ukulele: {
    en: 'ukulele',
    es: 'ukelele',
    de: 'ukulele',
    fr: 'ukulele',
  },
  banjo: {
    en: 'banjo',
    es: 'banjo',
    de: 'banjo',
    fr: 'banjo',
  },
  violin: {
    en: 'violin',
    es: 'violin',
    de: 'violine',
    fr: 'violon',
  },
  mandolin: {
    en: 'mandolin',
    es: 'mandolina',
    de: 'mandoline',
    fr: 'mandoline',
  },
};

export const tuningSlugs: Record<string, Record<Locale, string>> = {
  standard: {
    en: 'standard',
    es: 'estandar',
    de: 'standard',
    fr: 'standard',
  },
  'drop-d': {
    en: 'drop-d',
    es: 'drop-d',
    de: 'drop-d',
    fr: 'drop-d',
  },
  'open-g': {
    en: 'open-g',
    es: 'sol-abierto',
    de: 'open-g',
    fr: 'sol-ouvert',
  },
  'open-d': {
    en: 'open-d',
    es: 're-abierto',
    de: 'open-d',
    fr: 're-ouvert',
  },
  dadgad: {
    en: 'dadgad',
    es: 'dadgad',
    de: 'dadgad',
    fr: 'dadgad',
  },
  'half-step-down': {
    en: 'half-step-down',
    es: 'medio-tono-abajo',
    de: 'halbton-tiefer',
    fr: 'demi-ton-bas',
  },
  'full-step-down': {
    en: 'full-step-down',
    es: 'tono-completo-abajo',
    de: 'ganzton-tiefer',
    fr: 'ton-entier-bas',
  },
  'drop-c': {
    en: 'drop-c',
    es: 'drop-c',
    de: 'drop-c',
    fr: 'drop-c',
  },
  'open-e': {
    en: 'open-e',
    es: 'mi-abierto',
    de: 'open-e',
    fr: 'mi-ouvert',
  },
  'open-a': {
    en: 'open-a',
    es: 'la-abierto',
    de: 'open-a',
    fr: 'la-ouvert',
  },
  'low-g': {
    en: 'low-g',
    es: 'sol-bajo',
    de: 'tiefes-g',
    fr: 'sol-grave',
  },
  'd-tuning': {
    en: 'd-tuning',
    es: 'afinacion-re',
    de: 'd-stimmung',
    fr: 'accordage-re',
  },
  baritone: {
    en: 'baritone',
    es: 'baritono',
    de: 'bariton',
    fr: 'baryton',
  },
  'double-c': {
    en: 'double-c',
    es: 'doble-do',
    de: 'doppel-c',
    fr: 'double-do',
  },
  sawmill: {
    en: 'sawmill',
    es: 'sawmill',
    de: 'sawmill',
    fr: 'sawmill',
  },
  tenor: {
    en: 'tenor',
    es: 'tenor',
    de: 'tenor',
    fr: 'tenor',
  },
};

export const chordSlugs: Record<string, Record<Locale, string>> = {
  guitar: {
    en: 'guitar',
    es: 'guitarra',
    de: 'gitarre',
    fr: 'guitare',
  },
  ukulele: {
    en: 'ukulele',
    es: 'ukelele',
    de: 'ukulele',
    fr: 'ukulele',
  },
};

// Helper functions to convert between localized and English slugs
export function getLocalizedSlug(
  englishSlug: string,
  locale: Locale,
  type: 'instrument' | 'tuning' | 'chord'
): string {
  const slugMap =
    type === 'instrument'
      ? instrumentSlugs
      : type === 'tuning'
        ? tuningSlugs
        : chordSlugs;

  return slugMap[englishSlug]?.[locale] || englishSlug;
}

export function getEnglishSlug(
  localizedSlug: string,
  locale: Locale,
  type: 'instrument' | 'tuning' | 'chord'
): string {
  const slugMap =
    type === 'instrument'
      ? instrumentSlugs
      : type === 'tuning'
        ? tuningSlugs
        : chordSlugs;

  // Find the English key that has this localized value for the given locale
  for (const [englishSlug, translations] of Object.entries(slugMap)) {
    if (translations[locale] === localizedSlug) {
      return englishSlug;
    }
  }

  // Fallback: return the slug as-is (might already be English)
  return localizedSlug;
}
