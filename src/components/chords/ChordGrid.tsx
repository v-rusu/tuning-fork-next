import type { Chord } from '@/lib/data/chords';
import { ChordDiagram } from './ChordDiagram';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

interface ChordGridProps {
  chords: Chord[];
  instrumentSlug: string;
  stringCount?: number;
  basePath?: '/chords' | '/tools/chords';
  locale: Locale;
}

export function ChordGrid({
  chords,
  instrumentSlug,
  stringCount = 6,
  basePath = '/tools/chords',
  locale,
}: ChordGridProps) {
  if (chords.length === 0) {
    return (
      <div className="text-center text-text-secondary py-8">
        No chords found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {chords.map((chord) => (
        <a
          key={chord.id}
          href={getLocalizedPath(`${basePath}/${instrumentSlug}/${chord.slug}`, locale)}
          className="card hover:bg-tuner-faded transition-colors p-2"
        >
          <ChordDiagram
            name={chord.name}
            position={chord.positions[0]}
            stringCount={stringCount}
            size="sm"
          />
        </a>
      ))}
    </div>
  );
}
