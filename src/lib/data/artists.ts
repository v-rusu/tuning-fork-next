import artistData from '../../../artists_guitar_data.json';
import { getArtistSlug } from './artistSlugs';
import { getGenreById, type Genre } from './genres';
import { mapArtistTuningToSlug, getPrimaryAppTuning, getAllAppTunings } from './tuningMappings';
import type { Tuning } from './instruments';

// Raw data types from JSON
interface RawSong {
  song: string;
  tuning: string;
}

interface RawArtist {
  name: string;
  band?: string;
  primary_tunings: string[];
  string_brand: string;
  string_gauge: string;
  popular_songs: RawSong[];
  bio: string;
  gear_notes: string;
  sources: string[];
}

interface RawArtistData {
  classic_rock: RawArtist[];
  grunge_alt_rock: RawArtist[];
  metal: RawArtist[];
  metadata: {
    generated_date: string;
    total_artists: number;
    categories: string[];
    data_sources: string[];
    notes: string;
  };
}

// Processed types for the app
export interface Song {
  title: string;
  tuning: string;
  tuningSlug?: string; // Maps to app tuning if available
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  band?: string;
  genreId: string;
  genre: Genre;
  primaryTunings: string[];
  stringBrand: string;
  stringGauge: string;
  songs: Song[];
  bio: string;
  gearNotes: string;
  sources: string[];
  // Computed fields
  primaryAppTuning?: Tuning;
  appTunings: Tuning[];
}

// Process raw artist data into app format
function processArtist(raw: RawArtist, genreId: string): Artist {
  const genre = getGenreById(genreId);
  if (!genre) {
    throw new Error(`Genre not found: ${genreId}`);
  }

  const songs: Song[] = raw.popular_songs.map((s) => ({
    title: s.song,
    tuning: s.tuning,
    tuningSlug: mapArtistTuningToSlug(s.tuning),
  }));

  return {
    id: getArtistSlug(raw.name),
    name: raw.name,
    slug: getArtistSlug(raw.name),
    band: raw.band,
    genreId,
    genre,
    primaryTunings: raw.primary_tunings,
    stringBrand: raw.string_brand,
    stringGauge: raw.string_gauge,
    songs,
    bio: raw.bio,
    gearNotes: raw.gear_notes,
    sources: raw.sources,
    primaryAppTuning: getPrimaryAppTuning(raw.primary_tunings),
    appTunings: getAllAppTunings(raw.primary_tunings),
  };
}

// Load and process all artists
function loadArtists(): Artist[] {
  const data = artistData as RawArtistData;
  const artists: Artist[] = [];

  // Process each genre category
  for (const rawArtist of data.classic_rock) {
    artists.push(processArtist(rawArtist, 'classic_rock'));
  }
  for (const rawArtist of data.grunge_alt_rock) {
    artists.push(processArtist(rawArtist, 'grunge_alt_rock'));
  }
  for (const rawArtist of data.metal) {
    artists.push(processArtist(rawArtist, 'metal'));
  }

  return artists;
}

// Cached artists array
let _artists: Artist[] | null = null;

/**
 * Get all artists
 */
export function getAllArtists(): Artist[] {
  if (!_artists) {
    _artists = loadArtists();
  }
  return _artists;
}

/**
 * Get artist by slug
 */
export function getArtistBySlug(slug: string): Artist | undefined {
  return getAllArtists().find((a) => a.slug === slug);
}

/**
 * Get artists by genre
 */
export function getArtistsByGenre(genreId: string): Artist[] {
  return getAllArtists().filter((a) => a.genreId === genreId);
}

/**
 * Get artists by tuning slug
 */
export function getArtistsByTuning(tuningSlug: string): Artist[] {
  return getAllArtists().filter((a) =>
    a.appTunings.some((t) => t.slug === tuningSlug)
  );
}

/**
 * Get similar artists based on genre and tuning overlap
 */
export function getSimilarArtists(artist: Artist, limit: number = 4): Artist[] {
  const allArtists = getAllArtists();

  // Score each artist based on similarity
  const scored = allArtists
    .filter((a) => a.id !== artist.id)
    .map((a) => {
      let score = 0;

      // Same genre: +3 points
      if (a.genreId === artist.genreId) {
        score += 3;
      }

      // Shared tunings: +1 point each
      for (const tuning of a.appTunings) {
        if (artist.appTunings.some((t) => t.slug === tuning.slug)) {
          score += 1;
        }
      }

      return { artist: a, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.artist);
}

/**
 * Get featured artists (for home page)
 */
export function getFeaturedArtists(limit: number = 6): Artist[] {
  const artists = getAllArtists();
  // Pick diverse selection from each genre
  const featured: Artist[] = [];
  const genres = ['classic_rock', 'grunge_alt_rock', 'metal'];

  for (const genre of genres) {
    const genreArtists = artists.filter((a) => a.genreId === genre);
    const count = Math.ceil(limit / genres.length);
    featured.push(...genreArtists.slice(0, count));
  }

  return featured.slice(0, limit);
}

/**
 * Search artists by name or band
 */
export function searchArtists(query: string): Artist[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return getAllArtists().filter((a) => {
    const nameMatch = a.name.toLowerCase().includes(normalizedQuery);
    const bandMatch = a.band?.toLowerCase().includes(normalizedQuery);
    return nameMatch || bandMatch;
  });
}

/**
 * Get all unique tunings used by artists
 */
export function getAllUsedTunings(): Tuning[] {
  const tunings = new Map<string, Tuning>();

  for (const artist of getAllArtists()) {
    for (const tuning of artist.appTunings) {
      if (!tunings.has(tuning.slug)) {
        tunings.set(tuning.slug, tuning);
      }
    }
  }

  return Array.from(tunings.values());
}

/**
 * Group songs by tuning for an artist
 */
export function groupSongsByTuning(artist: Artist): Map<string, Song[]> {
  const groups = new Map<string, Song[]>();

  for (const song of artist.songs) {
    const key = song.tuning;
    const existing = groups.get(key) || [];
    existing.push(song);
    groups.set(key, existing);
  }

  return groups;
}
