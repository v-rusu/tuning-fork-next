import { useState, useCallback, useEffect } from 'react';
import { useTuner } from '@/hooks/useTuner';
import { TunerDisplay } from './TunerDisplay';
import { StringIndicator } from './StringIndicator';
import { MicrophoneButton } from './MicrophoneButton';
import { InstrumentSelector } from './InstrumentSelector';
import { TuningSelector } from './TuningSelector';
import {
  instruments,
  getDefaultTuning,
  type Instrument,
  type Tuning,
} from '@/lib/data/instruments';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

function createT(msgs: Record<string, any>) {
  return (key: string, params?: Record<string, string | number>): string => {
    const parts = key.split('.');
    let value: any = msgs;
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return key;
      value = value[part];
    }
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_: string, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };
}

interface HomeTunerProps {
  messages: { tuner: Record<string, any>; tunings: Record<string, any>; instruments: Record<string, any> };
  locale: Locale;
}

export function HomeTuner({ messages, locale }: HomeTunerProps) {
  const tTunings = createT(messages.tunings);

  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instruments[0]);
  const [selectedTuning, setSelectedTuning] = useState<Tuning>(getDefaultTuning(instruments[0]));

  const {
    isListening,
    hasPermission,
    error,
    currentPitch,
    startListening,
    stopListening,
  } = useTuner();

  useEffect(() => {
    setSelectedTuning(getDefaultTuning(selectedInstrument));
  }, [selectedInstrument]);

  const handleInstrumentChange = useCallback((instrument: Instrument) => {
    setSelectedInstrument(instrument);
  }, []);

  const handleTuningChange = useCallback((tuning: Tuning) => {
    setSelectedTuning(tuning);
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      {/* Tuner display with mic button inline */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <TunerDisplay pitch={currentPitch} isListening={isListening} messages={messages} />
        </div>
        <MicrophoneButton
          isListening={isListening}
          hasPermission={hasPermission}
          error={error}
          onStart={startListening}
          onStop={stopListening}
          messages={messages}
        />
      </div>

      {/* String indicator */}
      <div className="mb-4">
        <StringIndicator
          strings={selectedTuning.strings}
          activeNote={currentPitch?.note}
          activeOctave={currentPitch?.octave}
        />
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InstrumentSelector
            value={selectedInstrument.id}
            onChange={handleInstrumentChange}
            messages={messages}
          />
          <TuningSelector
            tunings={selectedInstrument.tunings}
            value={selectedTuning.id}
            onChange={handleTuningChange}
            messages={messages}
          />
        </div>

        {/* Quick tuning links */}
        {selectedInstrument.tunings.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedInstrument.tunings.slice(0, 5).map((tuning) => (
              <a
                key={tuning.id}
                href={getLocalizedPath(`/tools/tuner/${selectedInstrument.slug}/${tuning.slug}`, locale)}
                className={`text-xs px-3 py-1 rounded-full ${
                  tuning.id === selectedTuning.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-tuner-card text-text-secondary hover:bg-tuner-faded'
                }`}
              >
                {tTunings(tuning.id)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
