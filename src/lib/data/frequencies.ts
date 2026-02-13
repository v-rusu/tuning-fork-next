export interface ReferenceFrequency {
  id: string;
  name: string;
  slug: string;
  frequency: number;
  description: string;
  keywords: string[];
}

export const referenceFrequencies: ReferenceFrequency[] = [
  {
    id: 'a440',
    name: 'A440 (Standard)',
    slug: '440',
    frequency: 440,
    description:
      'Standard concert pitch used by most modern instruments and orchestras worldwide.',
    keywords: ['a440', 'standard pitch', 'concert pitch', '440hz', 'iso 16'],
  },
  {
    id: 'a432',
    name: 'A432 (Verdi)',
    slug: '432',
    frequency: 432,
    description:
      'Alternative tuning also known as "Verdi pitch" or "philosophical pitch". Some musicians prefer its warmer sound.',
    keywords: ['a432', 'verdi pitch', '432hz', 'philosophical pitch', 'natural tuning'],
  },
  {
    id: 'a415',
    name: 'A415 (Baroque)',
    slug: '415',
    frequency: 415,
    description:
      'Baroque pitch standard, approximately one semitone lower than modern pitch. Used for historically informed performance.',
    keywords: ['a415', 'baroque pitch', '415hz', 'historical pitch', 'early music'],
  },
  {
    id: 'a442',
    name: 'A442',
    slug: '442',
    frequency: 442,
    description:
      'Slightly higher pitch used by some European orchestras for a brighter sound.',
    keywords: ['a442', '442hz', 'european pitch', 'orchestral'],
  },
  {
    id: 'a444',
    name: 'A444',
    slug: '444',
    frequency: 444,
    description:
      'Higher pitch standard sometimes used for a brighter, more brilliant tone.',
    keywords: ['a444', '444hz', 'high pitch'],
  },
];

export function getFrequencyBySlug(slug: string): ReferenceFrequency | undefined {
  return referenceFrequencies.find((f) => f.slug === slug);
}

export function getDefaultFrequency(): ReferenceFrequency {
  return referenceFrequencies[0]; // A440
}

// Calculate frequency for any note based on a reference A4
export function calculateNoteFrequency(
  note: string,
  octave: number,
  referenceA4: number = 440
): number {
  const noteOffsets: Record<string, number> = {
    C: -9,
    'C#': -8,
    Db: -8,
    D: -7,
    'D#': -6,
    Eb: -6,
    E: -5,
    F: -4,
    'F#': -3,
    Gb: -3,
    G: -2,
    'G#': -1,
    Ab: -1,
    A: 0,
    'A#': 1,
    Bb: 1,
    B: 2,
  };

  const offset = noteOffsets[note];
  if (offset === undefined) return 440;

  // Calculate semitones from A4
  const semitonesFromA4 = offset + (octave - 4) * 12;

  // f = referenceA4 * 2^(n/12)
  return referenceA4 * Math.pow(2, semitonesFromA4 / 12);
}

// Generate all notes in a given octave range
export function generateNoteFrequencies(
  startOctave: number = 2,
  endOctave: number = 6,
  referenceA4: number = 440
): Record<string, number> {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const frequencies: Record<string, number> = {};

  for (let octave = startOctave; octave <= endOctave; octave++) {
    for (const note of notes) {
      const key = `${note}${octave}`;
      frequencies[key] = calculateNoteFrequency(note, octave, referenceA4);
    }
  }

  return frequencies;
}
