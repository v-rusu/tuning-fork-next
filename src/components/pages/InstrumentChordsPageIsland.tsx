import { useState, useMemo } from 'react';
import { ChordGrid } from '@/components/chords/ChordGrid';
import { ChordSearch } from '@/components/chords/ChordSearch';
import {
  getChordsByInstrument,
  filterChords,
  guitarChords,
  type InstrumentChords,
  type RootNote,
  type ChordQuality,
} from '@/lib/data/chords';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

const instrumentConfig: Record<string, { id: InstrumentChords; stringCount: number }> = {
  guitar: { id: 'guitar', stringCount: 6 },
  ukulele: { id: 'ukulele', stringCount: 4 },
};

interface InstrumentChordsPageIslandProps {
  instrumentSlug: string;
  locale: Locale;
  messages: Record<string, any>;
}

export function InstrumentChordsPageIsland({ instrumentSlug, locale, messages }: InstrumentChordsPageIslandProps) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = messages.chords?.[key];
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<RootNote | ''>('');
  const [selectedQuality, setSelectedQuality] = useState<ChordQuality | ''>('');

  const config = instrumentConfig[instrumentSlug];

  const allChords = useMemo(() => {
    if (!config) return guitarChords;
    return getChordsByInstrument(config.id);
  }, [config]);

  const filteredChords = useMemo(() => {
    let chords = allChords;
    if (selectedRoot || selectedQuality) {
      chords = filterChords(chords, selectedRoot || undefined, selectedQuality || undefined);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      chords = chords.filter(
        (chord) =>
          chord.name.toLowerCase().includes(query) ||
          chord.root.toLowerCase().includes(query) ||
          chord.notes.some((note) => note.toLowerCase().includes(query))
      );
    }
    return chords;
  }, [allChords, searchQuery, selectedRoot, selectedQuality]);

  if (!config) {
    return <div className="container mx-auto px-4 py-8 text-center text-text-secondary">Not found</div>;
  }

  const instrumentName = messages.instruments?.[config.id] || instrumentSlug;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-4 text-sm">
          <a href={getLocalizedPath('/tools/chords', locale)} className="text-text-secondary hover:text-white">
            {messages.nav?.chords || 'Chords'}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <span className="text-white">{instrumentName}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          {t('title', { instrument: instrumentName })}
        </h1>
        <p className="text-text-secondary text-center mb-8">
          {t('diagramsAvailable', { count: allChords.length })}
        </p>

        <ChordSearch
          searchQuery={searchQuery}
          selectedRoot={selectedRoot}
          selectedQuality={selectedQuality}
          onSearchChange={setSearchQuery}
          onRootChange={setSelectedRoot}
          onQualityChange={setSelectedQuality}
          messages={messages}
        />

        <ChordGrid
          chords={filteredChords}
          instrumentSlug={instrumentSlug}
          stringCount={config.stringCount}
          basePath="/tools/chords"
          locale={locale}
        />

        <div className="mt-12 text-text-secondary text-sm">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('learningChords', { instrument: instrumentName })}
          </h2>
          <p className="mb-4">{t('learningChordsDesc', { instrument: instrumentName.toLowerCase() })}</p>
          <p>{t('learningChordsTip')}</p>
        </div>
      </div>
    </div>
  );
}
