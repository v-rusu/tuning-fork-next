// Artist slug generation
// We use URL-safe slugs based on artist names
// Artist slugs are kept in English for simplicity across all locales

/**
 * Generate a URL-safe slug from an artist name
 */
export function generateArtistSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Common artist slug overrides for cleaner URLs
 * Maps artist name to preferred slug
 */
export const artistSlugOverrides: Record<string, string> = {
  'Stone Gossard & Mike McCready': 'stone-gossard-mike-mccready',
};

/**
 * Get the slug for an artist
 */
export function getArtistSlug(name: string): string {
  return artistSlugOverrides[name] || generateArtistSlug(name);
}
