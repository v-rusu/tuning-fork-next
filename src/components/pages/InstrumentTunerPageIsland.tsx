import { useState, useCallback, useEffect } from 'react';
import { useTuner } from '@/hooks/useTuner';
import { TunerDisplay } from '@/components/tuner/TunerDisplay';
import { StringIndicator } from '@/components/tuner/StringIndicator';
import { TuningSelector } from '@/components/tuner/TuningSelector';
import { MicrophoneButton } from '@/components/tuner/MicrophoneButton';
import {
  getInstrumentBySlug,
  getDefaultTuning,
  type Tuning,
} from '@/lib/data/instruments';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

interface InstrumentTunerPageIslandProps {
  instrumentSlug: string;
  locale: Locale;
  messages: Record<string, any>;
}

export function InstrumentTunerPageIsland({ instrumentSlug, locale, messages }: InstrumentTunerPageIslandProps) {
  const instrument = getInstrumentBySlug(instrumentSlug);

  const t = (ns: string, key: string, params?: Record<string, string | number>): string => {
    const value = messages[ns]?.[key];
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const [selectedTuning, setSelectedTuning] = useState<Tuning | null>(null);

  const {
    isListening,
    hasPermission,
    error,
    currentPitch,
    startListening,
    stopListening,
  } = useTuner();

  useEffect(() => {
    if (instrument && !selectedTuning) {
      setSelectedTuning(getDefaultTuning(instrument));
    }
  }, [instrument, selectedTuning]);

  const handleTuningChange = useCallback((tuning: Tuning) => {
    setSelectedTuning(tuning);
  }, []);

  if (!instrument || !selectedTuning) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto flex justify-center">
          <div className="animate-pulse text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  const instrumentName = messages.instruments?.[instrument.id] || instrument.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <nav className="mb-4 text-sm">
          <a href={getLocalizedPath('/tools/tuner', locale)} className="text-text-secondary hover:text-white">
            {t('tuner', 'chromatic')}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <span className="text-white">{instrumentName}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
          {t('tuner', 'title', { instrument: instrumentName })}
        </h1>

        <div className="mb-8">
          <TunerDisplay pitch={currentPitch} isListening={isListening} messages={messages} />
        </div>

        <div className="mb-8">
          <StringIndicator
            strings={selectedTuning.strings}
            activeNote={currentPitch?.note}
            activeOctave={currentPitch?.octave}
          />
        </div>

        <div className="card mb-8">
          <TuningSelector
            tunings={instrument.tunings}
            value={selectedTuning.id}
            onChange={handleTuningChange}
            messages={messages}
          />

          {instrument.tunings.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {instrument.tunings.slice(0, 5).map((tuning) => (
                <a
                  key={tuning.id}
                  href={getLocalizedPath(`/tools/tuner/${instrument.slug}/${tuning.slug}`, locale)}
                  className={`text-xs px-3 py-1 rounded-full ${
                    tuning.id === selectedTuning.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-tuner-card text-text-secondary hover:bg-tuner-faded'
                  }`}
                >
                  {messages.tunings?.[tuning.id] || tuning.name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <MicrophoneButton
            isListening={isListening}
            hasPermission={hasPermission}
            error={error}
            onStart={startListening}
            onStop={stopListening}
            messages={messages}
          />
        </div>

        <div className="mt-12 text-text-secondary text-sm">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('tuner', 'aboutTuning', { instrument: instrumentName })}
          </h2>
          <p className="mb-4">
            {t('tuner', 'aboutTuningDesc', { instrument: instrumentName.toLowerCase() })}
          </p>
          <p>
            {t('tuner', 'availableTunings')}: {instrument.tunings.map((tuning) => messages.tunings?.[tuning.id] || tuning.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
