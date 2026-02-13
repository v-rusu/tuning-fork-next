// Map artist tuning names to app tuning slugs
// Artist data uses varied naming conventions, this provides fuzzy matching

import { instruments, type Tuning } from './instruments';

// Map of common tuning name variations to our app tuning slugs
const tuningNameMap: Record<string, string> = {
  // Standard tunings
  'e standard': 'standard',
  'standard': 'standard',
  'standard tuning': 'standard',

  // Eb / Half step down
  'eb standard': 'half-step-down',
  'eb standard (half-step down)': 'half-step-down',
  'd# standard': 'half-step-down',
  'half-step down': 'half-step-down',
  'half step down': 'half-step-down',

  // D Standard / Full step down
  'd standard': 'full-step-down',
  'd standard (quarter-step down from e)': 'full-step-down',
  'full step down': 'full-step-down',
  'full-step down': 'full-step-down',

  // Drop tunings
  'drop d': 'drop-d',
  'drop-d': 'drop-d',
  'drop db': 'drop-d', // Close enough for our purposes
  'drop d (tuned down)': 'drop-d',
  'drop c': 'drop-c',
  'drop-c': 'drop-c',
  'drop cb': 'drop-c',
  'drop a': 'drop-c', // Map to closest available
  'drop b': 'drop-c', // Map to closest available

  // Open tunings
  'open g': 'open-g',
  'open-g': 'open-g',
  'open g (5-string)': 'open-g',
  'open g (g-d-g-b-d, 5-string)': 'open-g',
  'open d': 'open-d',
  'open-d': 'open-d',
  'open e': 'open-e',
  'open-e': 'open-e',
  'open a': 'open-a',
  'open-a': 'open-a',

  // DADGAD and Celtic
  'dadgad': 'dadgad',
  'dadgad (celtic)': 'dadgad',

  // C# Standard - map to Drop C as closest
  'c# standard': 'drop-c',
  'c standard': 'drop-c',

  // B Standard (7-string) - no direct mapping
  'b standard': 'drop-c',
  'b standard (7-string)': 'drop-c',
};

/**
 * Map an artist tuning name to our app tuning slug
 * Returns undefined if no good match found
 */
export function mapArtistTuningToSlug(artistTuning: string): string | undefined {
  const normalized = artistTuning.toLowerCase().trim();

  // Direct match
  if (tuningNameMap[normalized]) {
    return tuningNameMap[normalized];
  }

  // Partial match - check if the normalized string contains a key
  for (const [key, slug] of Object.entries(tuningNameMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return slug;
    }
  }

  return undefined;
}

/**
 * Get the app Tuning object for a guitar tuning slug
 */
export function getGuitarTuning(slug: string): Tuning | undefined {
  const guitar = instruments.find(i => i.id === 'guitar');
  return guitar?.tunings.find(t => t.slug === slug);
}

/**
 * Get the primary tuning for an artist (the first one that maps to our app)
 */
export function getPrimaryAppTuning(artistTunings: string[]): Tuning | undefined {
  for (const tuning of artistTunings) {
    const slug = mapArtistTuningToSlug(tuning);
    if (slug) {
      const appTuning = getGuitarTuning(slug);
      if (appTuning) {
        return appTuning;
      }
    }
  }
  return undefined;
}

/**
 * Get all app tunings that match the artist's tunings
 */
export function getAllAppTunings(artistTunings: string[]): Tuning[] {
  const tunings: Tuning[] = [];
  const seenSlugs = new Set<string>();

  for (const tuning of artistTunings) {
    const slug = mapArtistTuningToSlug(tuning);
    if (slug && !seenSlugs.has(slug)) {
      const appTuning = getGuitarTuning(slug);
      if (appTuning) {
        tunings.push(appTuning);
        seenSlugs.add(slug);
      }
    }
  }

  return tunings;
}
