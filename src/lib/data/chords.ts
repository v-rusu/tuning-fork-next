export type ChordQuality =
  | 'major'
  | 'minor'
  | '7'
  | 'maj7'
  | 'min7'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4';

export type RootNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface ChordPosition {
  // -1 = muted (x), 0 = open, 1-24 = fret number
  frets: number[];
  // finger positions (0 = none, 1-4 = finger number)
  fingers: number[];
  // starting fret for barre chords
  baseFret: number;
  // barres: [fret, startString, endString]
  barres?: [number, number, number][];
}

export interface Chord {
  id: string;
  root: RootNote;
  quality: ChordQuality;
  name: string;
  slug: string;
  positions: ChordPosition[];
  notes: string[];
}

// Guitar chord definitions (6 strings: E A D G B E)
export const guitarChords: Chord[] = [
  // C chords
  {
    id: 'c-major',
    root: 'C',
    quality: 'major',
    name: 'C Major',
    slug: 'c-major',
    positions: [
      {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1,
      },
    ],
    notes: ['C', 'E', 'G'],
  },
  {
    id: 'c-minor',
    root: 'C',
    quality: 'minor',
    name: 'C Minor',
    slug: 'c-minor',
    positions: [
      {
        frets: [-1, 3, 5, 5, 4, 3],
        fingers: [0, 1, 3, 4, 2, 1],
        baseFret: 1,
        barres: [[3, 1, 5]],
      },
    ],
    notes: ['C', 'Eb', 'G'],
  },
  {
    id: 'c-7',
    root: 'C',
    quality: '7',
    name: 'C7',
    slug: 'c-7',
    positions: [
      {
        frets: [-1, 3, 2, 3, 1, 0],
        fingers: [0, 3, 2, 4, 1, 0],
        baseFret: 1,
      },
    ],
    notes: ['C', 'E', 'G', 'Bb'],
  },
  {
    id: 'c-maj7',
    root: 'C',
    quality: 'maj7',
    name: 'Cmaj7',
    slug: 'c-maj7',
    positions: [
      {
        frets: [-1, 3, 2, 0, 0, 0],
        fingers: [0, 3, 2, 0, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['C', 'E', 'G', 'B'],
  },

  // D chords
  {
    id: 'd-major',
    root: 'D',
    quality: 'major',
    name: 'D Major',
    slug: 'd-major',
    positions: [
      {
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
        baseFret: 1,
      },
    ],
    notes: ['D', 'F#', 'A'],
  },
  {
    id: 'd-minor',
    root: 'D',
    quality: 'minor',
    name: 'D Minor',
    slug: 'd-minor',
    positions: [
      {
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [0, 0, 0, 2, 3, 1],
        baseFret: 1,
      },
    ],
    notes: ['D', 'F', 'A'],
  },
  {
    id: 'd-7',
    root: 'D',
    quality: '7',
    name: 'D7',
    slug: 'd-7',
    positions: [
      {
        frets: [-1, -1, 0, 2, 1, 2],
        fingers: [0, 0, 0, 2, 1, 3],
        baseFret: 1,
      },
    ],
    notes: ['D', 'F#', 'A', 'C'],
  },

  // E chords
  {
    id: 'e-major',
    root: 'E',
    quality: 'major',
    name: 'E Major',
    slug: 'e-major',
    positions: [
      {
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['E', 'G#', 'B'],
  },
  {
    id: 'e-minor',
    root: 'E',
    quality: 'minor',
    name: 'E Minor',
    slug: 'e-minor',
    positions: [
      {
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['E', 'G', 'B'],
  },
  {
    id: 'e-7',
    root: 'E',
    quality: '7',
    name: 'E7',
    slug: 'e-7',
    positions: [
      {
        frets: [0, 2, 0, 1, 0, 0],
        fingers: [0, 2, 0, 1, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['E', 'G#', 'B', 'D'],
  },

  // F chords
  {
    id: 'f-major',
    root: 'F',
    quality: 'major',
    name: 'F Major',
    slug: 'f-major',
    positions: [
      {
        frets: [1, 3, 3, 2, 1, 1],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 1,
        barres: [[1, 0, 5]],
      },
    ],
    notes: ['F', 'A', 'C'],
  },
  {
    id: 'f-minor',
    root: 'F',
    quality: 'minor',
    name: 'F Minor',
    slug: 'f-minor',
    positions: [
      {
        frets: [1, 3, 3, 1, 1, 1],
        fingers: [1, 3, 4, 1, 1, 1],
        baseFret: 1,
        barres: [[1, 0, 5]],
      },
    ],
    notes: ['F', 'Ab', 'C'],
  },

  // G chords
  {
    id: 'g-major',
    root: 'G',
    quality: 'major',
    name: 'G Major',
    slug: 'g-major',
    positions: [
      {
        frets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
        baseFret: 1,
      },
    ],
    notes: ['G', 'B', 'D'],
  },
  {
    id: 'g-minor',
    root: 'G',
    quality: 'minor',
    name: 'G Minor',
    slug: 'g-minor',
    positions: [
      {
        frets: [3, 5, 5, 3, 3, 3],
        fingers: [1, 3, 4, 1, 1, 1],
        baseFret: 1,
        barres: [[3, 0, 5]],
      },
    ],
    notes: ['G', 'Bb', 'D'],
  },
  {
    id: 'g-7',
    root: 'G',
    quality: '7',
    name: 'G7',
    slug: 'g-7',
    positions: [
      {
        frets: [3, 2, 0, 0, 0, 1],
        fingers: [3, 2, 0, 0, 0, 1],
        baseFret: 1,
      },
    ],
    notes: ['G', 'B', 'D', 'F'],
  },

  // A chords
  {
    id: 'a-major',
    root: 'A',
    quality: 'major',
    name: 'A Major',
    slug: 'a-major',
    positions: [
      {
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [0, 0, 1, 2, 3, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C#', 'E'],
  },
  {
    id: 'a-minor',
    root: 'A',
    quality: 'minor',
    name: 'A Minor',
    slug: 'a-minor',
    positions: [
      {
        frets: [-1, 0, 2, 2, 1, 0],
        fingers: [0, 0, 2, 3, 1, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C', 'E'],
  },
  {
    id: 'a-7',
    root: 'A',
    quality: '7',
    name: 'A7',
    slug: 'a-7',
    positions: [
      {
        frets: [-1, 0, 2, 0, 2, 0],
        fingers: [0, 0, 1, 0, 2, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C#', 'E', 'G'],
  },
  {
    id: 'a-min7',
    root: 'A',
    quality: 'min7',
    name: 'Am7',
    slug: 'a-min7',
    positions: [
      {
        frets: [-1, 0, 2, 0, 1, 0],
        fingers: [0, 0, 2, 0, 1, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C', 'E', 'G'],
  },

  // B chords
  {
    id: 'b-major',
    root: 'B',
    quality: 'major',
    name: 'B Major',
    slug: 'b-major',
    positions: [
      {
        frets: [-1, 2, 4, 4, 4, 2],
        fingers: [0, 1, 2, 3, 4, 1],
        baseFret: 1,
        barres: [[2, 1, 5]],
      },
    ],
    notes: ['B', 'D#', 'F#'],
  },
  {
    id: 'b-minor',
    root: 'B',
    quality: 'minor',
    name: 'B Minor',
    slug: 'b-minor',
    positions: [
      {
        frets: [-1, 2, 4, 4, 3, 2],
        fingers: [0, 1, 3, 4, 2, 1],
        baseFret: 1,
        barres: [[2, 1, 5]],
      },
    ],
    notes: ['B', 'D', 'F#'],
  },
  {
    id: 'b-7',
    root: 'B',
    quality: '7',
    name: 'B7',
    slug: 'b-7',
    positions: [
      {
        frets: [-1, 2, 1, 2, 0, 2],
        fingers: [0, 2, 1, 3, 0, 4],
        baseFret: 1,
      },
    ],
    notes: ['B', 'D#', 'F#', 'A'],
  },
];

// Ukulele chords (4 strings: G C E A)
export const ukuleleChords: Chord[] = [
  {
    id: 'c-major',
    root: 'C',
    quality: 'major',
    name: 'C Major',
    slug: 'c-major',
    positions: [
      {
        frets: [0, 0, 0, 3],
        fingers: [0, 0, 0, 3],
        baseFret: 1,
      },
    ],
    notes: ['C', 'E', 'G'],
  },
  {
    id: 'c-minor',
    root: 'C',
    quality: 'minor',
    name: 'C Minor',
    slug: 'c-minor',
    positions: [
      {
        frets: [0, 3, 3, 3],
        fingers: [0, 1, 2, 3],
        baseFret: 1,
      },
    ],
    notes: ['C', 'Eb', 'G'],
  },
  {
    id: 'd-major',
    root: 'D',
    quality: 'major',
    name: 'D Major',
    slug: 'd-major',
    positions: [
      {
        frets: [2, 2, 2, 0],
        fingers: [1, 2, 3, 0],
        baseFret: 1,
      },
    ],
    notes: ['D', 'F#', 'A'],
  },
  {
    id: 'e-minor',
    root: 'E',
    quality: 'minor',
    name: 'E Minor',
    slug: 'e-minor',
    positions: [
      {
        frets: [0, 4, 3, 2],
        fingers: [0, 4, 3, 2],
        baseFret: 1,
      },
    ],
    notes: ['E', 'G', 'B'],
  },
  {
    id: 'f-major',
    root: 'F',
    quality: 'major',
    name: 'F Major',
    slug: 'f-major',
    positions: [
      {
        frets: [2, 0, 1, 0],
        fingers: [2, 0, 1, 0],
        baseFret: 1,
      },
    ],
    notes: ['F', 'A', 'C'],
  },
  {
    id: 'g-major',
    root: 'G',
    quality: 'major',
    name: 'G Major',
    slug: 'g-major',
    positions: [
      {
        frets: [0, 2, 3, 2],
        fingers: [0, 1, 3, 2],
        baseFret: 1,
      },
    ],
    notes: ['G', 'B', 'D'],
  },
  {
    id: 'a-major',
    root: 'A',
    quality: 'major',
    name: 'A Major',
    slug: 'a-major',
    positions: [
      {
        frets: [2, 1, 0, 0],
        fingers: [2, 1, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C#', 'E'],
  },
  {
    id: 'a-minor',
    root: 'A',
    quality: 'minor',
    name: 'A Minor',
    slug: 'a-minor',
    positions: [
      {
        frets: [2, 0, 0, 0],
        fingers: [1, 0, 0, 0],
        baseFret: 1,
      },
    ],
    notes: ['A', 'C', 'E'],
  },
];

export type InstrumentChords = 'guitar' | 'ukulele';

export function getChordsByInstrument(instrument: InstrumentChords): Chord[] {
  switch (instrument) {
    case 'guitar':
      return guitarChords;
    case 'ukulele':
      return ukuleleChords;
    default:
      return guitarChords;
  }
}

export function getChordBySlug(
  instrument: InstrumentChords,
  slug: string
): Chord | undefined {
  const chords = getChordsByInstrument(instrument);
  return chords.find((c) => c.slug === slug);
}

export function filterChords(
  chords: Chord[],
  root?: RootNote,
  quality?: ChordQuality
): Chord[] {
  return chords.filter((chord) => {
    if (root && chord.root !== root) return false;
    if (quality && chord.quality !== quality) return false;
    return true;
  });
}

export const rootNotes: RootNote[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const chordQualities: { value: ChordQuality; label: string }[] = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: '7', label: '7th' },
  { value: 'maj7', label: 'Maj7' },
  { value: 'min7', label: 'Min7' },
  { value: 'dim', label: 'Dim' },
  { value: 'aug', label: 'Aug' },
  { value: 'sus2', label: 'Sus2' },
  { value: 'sus4', label: 'Sus4' },
];
