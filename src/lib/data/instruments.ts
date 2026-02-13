export interface StringDefinition {
  note: string;
  octave: number;
  frequency: number;
}

export interface Tuning {
  id: string;
  name: string;
  slug: string;
  strings: StringDefinition[];
  description?: string;
  keywords?: string[];
}

export interface Instrument {
  id: string;
  name: string;
  slug: string;
  stringCount: number;
  tunings: Tuning[];
  librarySupported: boolean;
}

// Standard A440 frequencies for common notes
const NOTE_FREQUENCIES: Record<string, number> = {
  C2: 65.41,
  'C#2': 69.3,
  D2: 73.42,
  'D#2': 77.78,
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.5,
  G2: 98.0,
  'G#2': 103.83,
  A2: 110.0,
  'A#2': 116.54,
  B2: 123.47,
  C3: 130.81,
  'C#3': 138.59,
  D3: 146.83,
  'D#3': 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  G3: 196.0,
  'G#3': 207.65,
  A3: 220.0,
  'A#3': 233.08,
  B3: 246.94,
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0,
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  'D#5': 622.25,
  E5: 659.26,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  'G#5': 830.61,
  A5: 880.0,
};

function createString(note: string, octave: number): StringDefinition {
  const key = `${note}${octave}`;
  return {
    note,
    octave,
    frequency: NOTE_FREQUENCIES[key] || 440,
  };
}

// Guitar tunings
const guitarTunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    slug: 'standard',
    strings: [
      createString('E', 4),
      createString('B', 3),
      createString('G', 3),
      createString('D', 3),
      createString('A', 2),
      createString('E', 2),
    ],
    description: 'Standard EADGBE tuning for guitar',
    keywords: ['standard tuning', 'EADGBE', 'regular tuning'],
  },
  {
    id: 'dropD',
    name: 'Drop D',
    slug: 'drop-d',
    strings: [
      createString('E', 4),
      createString('B', 3),
      createString('G', 3),
      createString('D', 3),
      createString('A', 2),
      createString('D', 2),
    ],
    description: 'Drop D tuning with low E dropped to D',
    keywords: ['drop d', 'DADGBE', 'metal tuning', 'rock tuning'],
  },
  {
    id: 'openG',
    name: 'Open G',
    slug: 'open-g',
    strings: [
      createString('D', 4),
      createString('B', 3),
      createString('G', 3),
      createString('D', 3),
      createString('G', 2),
      createString('D', 2),
    ],
    description: 'Open G tuning for slide guitar and blues',
    keywords: ['open g', 'DGDGBD', 'slide guitar', 'blues tuning'],
  },
  {
    id: 'openD',
    name: 'Open D',
    slug: 'open-d',
    strings: [
      createString('D', 4),
      createString('A', 3),
      createString('F#', 3),
      createString('D', 3),
      createString('A', 2),
      createString('D', 2),
    ],
    description: 'Open D tuning for slide and fingerstyle',
    keywords: ['open d', 'DADF#AD', 'slide guitar'],
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    slug: 'dadgad',
    strings: [
      createString('D', 4),
      createString('A', 3),
      createString('G', 3),
      createString('D', 3),
      createString('A', 2),
      createString('D', 2),
    ],
    description: 'DADGAD Celtic tuning',
    keywords: ['dadgad', 'celtic tuning', 'folk guitar'],
  },
  {
    id: 'halfStepDown',
    name: 'Half Step Down',
    slug: 'half-step-down',
    strings: [
      createString('D#', 4),
      createString('A#', 3),
      createString('F#', 3),
      createString('C#', 3),
      createString('G#', 2),
      createString('D#', 2),
    ],
    description: 'Half step down tuning (Eb standard)',
    keywords: ['half step down', 'eb standard', 'flat tuning'],
  },
  {
    id: 'fullStepDown',
    name: 'Full Step Down',
    slug: 'full-step-down',
    strings: [
      createString('D', 4),
      createString('A', 3),
      createString('F', 3),
      createString('C', 3),
      createString('G', 2),
      createString('D', 2),
    ],
    description: 'Full step down tuning (D standard)',
    keywords: ['full step down', 'd standard', 'heavy tuning'],
  },
  {
    id: 'dropC',
    name: 'Drop C',
    slug: 'drop-c',
    strings: [
      createString('D', 4),
      createString('A', 3),
      createString('F', 3),
      createString('C', 3),
      createString('G', 2),
      createString('C', 2),
    ],
    description: 'Drop C tuning for heavy metal',
    keywords: ['drop c', 'CGCFAD', 'metal tuning'],
  },
  {
    id: 'openE',
    name: 'Open E',
    slug: 'open-e',
    strings: [
      createString('E', 4),
      createString('B', 3),
      createString('G#', 3),
      createString('E', 3),
      createString('B', 2),
      createString('E', 2),
    ],
    description: 'Open E tuning for slide guitar',
    keywords: ['open e', 'EBEG#BE', 'slide guitar'],
  },
  {
    id: 'openA',
    name: 'Open A',
    slug: 'open-a',
    strings: [
      createString('E', 4),
      createString('C#', 4),
      createString('A', 3),
      createString('E', 3),
      createString('A', 2),
      createString('E', 2),
    ],
    description: 'Open A tuning',
    keywords: ['open a', 'EAEAC#E'],
  },
];

// Bass tunings
const bassTunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    slug: 'standard',
    strings: [
      createString('G', 2),
      createString('D', 2),
      createString('A', 2),
      createString('E', 2),
    ],
    description: 'Standard 4-string bass tuning',
    keywords: ['standard bass', 'EADG', 'bass tuning'],
  },
  {
    id: 'dropD',
    name: 'Drop D',
    slug: 'drop-d',
    strings: [
      createString('G', 2),
      createString('D', 2),
      createString('A', 2),
      createString('D', 2),
    ],
    description: 'Drop D bass tuning',
    keywords: ['drop d bass', 'DADG'],
  },
  {
    id: 'halfStepDown',
    name: 'Half Step Down',
    slug: 'half-step-down',
    strings: [
      createString('F#', 2),
      createString('C#', 2),
      createString('G#', 2),
      createString('D#', 2),
    ],
    description: 'Half step down bass tuning',
    keywords: ['bass eb tuning', 'flat bass'],
  },
  {
    id: 'fullStepDown',
    name: 'Full Step Down',
    slug: 'full-step-down',
    strings: [
      createString('F', 2),
      createString('C', 2),
      createString('G', 2),
      createString('D', 2),
    ],
    description: 'Full step down bass tuning (D standard)',
    keywords: ['bass d standard', 'DGCF'],
  },
];

// 5-string bass tunings
const bass5Tunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    slug: 'standard',
    strings: [
      createString('G', 2),
      createString('D', 2),
      createString('A', 2),
      createString('E', 2),
      createString('B', 2),
    ],
    description: 'Standard 5-string bass tuning',
    keywords: ['5 string bass', 'BEADG'],
  },
  {
    id: 'tenor',
    name: 'Tenor',
    slug: 'tenor',
    strings: [
      createString('C', 3),
      createString('G', 2),
      createString('D', 2),
      createString('A', 2),
      createString('E', 2),
    ],
    description: '5-string bass tenor tuning',
    keywords: ['tenor bass', 'EADGC'],
  },
];

// Ukulele tunings
const ukuleleTunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard (High G)',
    slug: 'standard',
    strings: [
      createString('A', 4),
      createString('E', 4),
      createString('C', 4),
      createString('G', 4),
    ],
    description: 'Standard soprano/concert/tenor ukulele tuning',
    keywords: ['standard ukulele', 'GCEA', 'high g'],
  },
  {
    id: 'lowG',
    name: 'Low G',
    slug: 'low-g',
    strings: [
      createString('A', 4),
      createString('E', 4),
      createString('C', 4),
      createString('G', 3),
    ],
    description: 'Low G ukulele tuning',
    keywords: ['low g ukulele', 'linear tuning'],
  },
  {
    id: 'dTuning',
    name: 'D Tuning',
    slug: 'd-tuning',
    strings: [
      createString('B', 4),
      createString('F#', 4),
      createString('D', 4),
      createString('A', 4),
    ],
    description: 'D tuning (ADF#B) for ukulele',
    keywords: ['d tuning', 'ADF#B'],
  },
  {
    id: 'baritone',
    name: 'Baritone',
    slug: 'baritone',
    strings: [
      createString('E', 4),
      createString('B', 3),
      createString('G', 3),
      createString('D', 3),
    ],
    description: 'Baritone ukulele tuning (same as guitar top 4)',
    keywords: ['baritone ukulele', 'DGBE'],
  },
];

// Banjo tunings
const banjoTunings: Tuning[] = [
  {
    id: 'openG',
    name: 'Open G',
    slug: 'open-g',
    strings: [
      createString('D', 4),
      createString('B', 3),
      createString('G', 3),
      createString('D', 3),
      createString('G', 4),
    ],
    description: 'Standard 5-string banjo open G tuning',
    keywords: ['banjo open g', 'gDGBD'],
  },
  {
    id: 'doubleC',
    name: 'Double C',
    slug: 'double-c',
    strings: [
      createString('D', 4),
      createString('C', 4),
      createString('G', 3),
      createString('C', 3),
      createString('G', 4),
    ],
    description: 'Double C banjo tuning for old-time',
    keywords: ['double c', 'gCGCD', 'old time banjo'],
  },
  {
    id: 'sawmill',
    name: 'Sawmill (Mountain Modal)',
    slug: 'sawmill',
    strings: [
      createString('D', 4),
      createString('C', 4),
      createString('G', 3),
      createString('D', 3),
      createString('G', 4),
    ],
    description: 'Sawmill/Mountain modal banjo tuning',
    keywords: ['sawmill', 'modal', 'gDGCD'],
  },
];

// Violin tuning (custom - not in library)
const violinTunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    slug: 'standard',
    strings: [
      createString('E', 5),
      createString('A', 4),
      createString('D', 4),
      createString('G', 3),
    ],
    description: 'Standard violin tuning GDAE',
    keywords: ['violin tuning', 'GDAE', 'fiddle tuning'],
  },
];

// Mandolin tuning (custom - not in library)
const mandolinTunings: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    slug: 'standard',
    strings: [
      createString('E', 5),
      createString('A', 4),
      createString('D', 4),
      createString('G', 3),
    ],
    description: 'Standard mandolin tuning GDAE (same as violin)',
    keywords: ['mandolin tuning', 'GDAE'],
  },
];

export const instruments: Instrument[] = [
  {
    id: 'guitar',
    name: 'Guitar',
    slug: 'guitar',
    stringCount: 6,
    tunings: guitarTunings,
    librarySupported: true,
  },
  {
    id: 'bass',
    name: 'Bass',
    slug: 'bass',
    stringCount: 4,
    tunings: bassTunings,
    librarySupported: true,
  },
  {
    id: 'bass5',
    name: '5-String Bass',
    slug: 'bass-5-string',
    stringCount: 5,
    tunings: bass5Tunings,
    librarySupported: true,
  },
  {
    id: 'ukulele',
    name: 'Ukulele',
    slug: 'ukulele',
    stringCount: 4,
    tunings: ukuleleTunings,
    librarySupported: true,
  },
  {
    id: 'banjo',
    name: 'Banjo',
    slug: 'banjo',
    stringCount: 5,
    tunings: banjoTunings,
    librarySupported: true,
  },
  {
    id: 'violin',
    name: 'Violin',
    slug: 'violin',
    stringCount: 4,
    tunings: violinTunings,
    librarySupported: false,
  },
  {
    id: 'mandolin',
    name: 'Mandolin',
    slug: 'mandolin',
    stringCount: 4,
    tunings: mandolinTunings,
    librarySupported: false,
  },
];

import { getEnglishSlug } from './slugs';
import type { Locale } from '@/i18n/utils';

export function getInstrumentBySlug(slug: string): Instrument | undefined {
  return instruments.find((i) => i.slug === slug);
}

// Get instrument by localized slug (converts to English slug first)
export function getInstrumentByLocalizedSlug(
  localizedSlug: string,
  locale: Locale
): Instrument | undefined {
  const englishSlug = getEnglishSlug(localizedSlug, locale, 'instrument');
  return instruments.find((i) => i.slug === englishSlug);
}

export function getTuningBySlug(
  instrument: Instrument,
  tuningSlug: string
): Tuning | undefined {
  return instrument.tunings.find((t) => t.slug === tuningSlug);
}

// Get tuning by localized slug (converts to English slug first)
export function getTuningByLocalizedSlug(
  instrument: Instrument,
  localizedSlug: string,
  locale: Locale
): Tuning | undefined {
  const englishSlug = getEnglishSlug(localizedSlug, locale, 'tuning');
  return instrument.tunings.find((t) => t.slug === englishSlug);
}

export function getDefaultTuning(instrument: Instrument): Tuning {
  return instrument.tunings[0];
}
