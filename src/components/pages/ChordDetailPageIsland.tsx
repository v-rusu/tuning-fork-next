import { useMemo } from 'react';
import { ChordDiagram } from '@/components/chords/ChordDiagram';
import {
  getChordBySlug,
  getChordsByInstrument,
  guitarChords,
  type InstrumentChords,
} from '@/lib/data/chords';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

const instrumentConfig: Record<string, { id: InstrumentChords; stringCount: number }> = {
  guitar: { id: 'guitar', stringCount: 6 },
  ukulele: { id: 'ukulele', stringCount: 4 },
};

interface ChordDetailPageIslandProps {
  instrumentSlug: string;
  chordSlug: string;
  locale: Locale;
  messages: Record<string, any>;
}

export function ChordDetailPageIsland({ instrumentSlug, chordSlug, locale, messages }: ChordDetailPageIslandProps) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Support dot notation
    const parts = key.split('.');
    let value: any = messages.chords;
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return key;
      value = value[part];
    }
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const config = instrumentConfig[instrumentSlug];

  const chord = useMemo(() => {
    if (!config) return null;
    return getChordBySlug(config.id, chordSlug);
  }, [config, chordSlug]);

  const allChords = useMemo(() => {
    if (!config) return guitarChords;
    return getChordsByInstrument(config.id);
  }, [config]);

  const relatedChords = useMemo(() => {
    if (!chord) return [];
    return allChords
      .filter((c) => c.id !== chord.id && (c.root === chord.root || c.quality === chord.quality))
      .slice(0, 6);
  }, [allChords, chord]);

  if (!config || !chord) {
    return <div className="container mx-auto px-4 py-8 text-center text-text-secondary">Not found</div>;
  }

  const instrumentName = messages.instruments?.[config.id] || instrumentSlug;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <nav className="mb-4 text-sm">
          <a href={getLocalizedPath('/tools/chords', locale)} className="text-text-secondary hover:text-white">
            {messages.nav?.chords || 'Chords'}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <a href={getLocalizedPath(`/tools/chords/${instrumentSlug}`, locale)} className="text-text-secondary hover:text-white">
            {instrumentName}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <span className="text-white">{chord.name}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">{chord.name}</h1>
        <p className="text-text-secondary text-center mb-8">
          {t('description', { chord: chord.name, instrument: instrumentName })}
        </p>

        <div className="card mb-8 flex justify-center">
          <div className="w-48 sm:w-64">
            <ChordDiagram name={chord.name} position={chord.positions[0]} stringCount={config.stringCount} size="lg" />
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t('aboutChord', { chord: chord.name })}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-text-secondary">{t('rootNote')}</span>
              <p className="text-white font-medium">{chord.root}</p>
            </div>
            <div>
              <span className="text-sm text-text-secondary">{t('quality')}</span>
              <p className="text-white font-medium capitalize">{messages.chords?.[chord.quality] || chord.quality}</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-text-secondary">{t('notesInChord')}</span>
            <div className="flex gap-2 mt-2">
              {chord.notes.map((note) => (
                <span key={note} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t('fingerPositions')}</h2>
          <div className="grid grid-cols-6 gap-2 text-center">
            {chord.positions[0].frets.map((fret, index) => (
              <div key={index}>
                <div className="text-xs text-text-secondary mb-1">
                  {t('string')} {config.stringCount - index}
                </div>
                <div className="text-white font-medium">
                  {fret === -1 ? (
                    <span className="text-red-400">{t('muted')}</span>
                  ) : fret === 0 ? (
                    <span className="text-text-secondary">{t('open')}</span>
                  ) : (
                    `${t('fret')} ${fret}`
                  )}
                </div>
                {chord.positions[0].fingers[index] > 0 && (
                  <div className="text-xs text-text-muted">{t('finger')} {chord.positions[0].fingers[index]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {relatedChords.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">{t('relatedChords')}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {relatedChords.map((relatedChord) => (
                <a
                  key={relatedChord.id}
                  href={getLocalizedPath(`/tools/chords/${instrumentSlug}/${relatedChord.slug}`, locale)}
                  className="p-2 text-center rounded-lg bg-tuner-card text-text-secondary hover:bg-tuner-faded transition-colors"
                >
                  <span className="block font-medium text-sm">{relatedChord.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-text-secondary text-sm">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('howToPlay', { chord: chord.name, instrument: instrumentName })}
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>{t('howToPlaySteps.step1')}</li>
            <li>{t('howToPlaySteps.step2')}</li>
            <li>{t('howToPlaySteps.step3')}</li>
            <li>{t('howToPlaySteps.step4')}</li>
            <li>{t('howToPlaySteps.step5')}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
