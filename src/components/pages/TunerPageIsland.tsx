import { useState, useCallback } from 'react';
import { useTuner } from '@/hooks/useTuner';
import { TunerDisplay } from '@/components/tuner/TunerDisplay';
import { StringIndicator } from '@/components/tuner/StringIndicator';
import { InstrumentSelector } from '@/components/tuner/InstrumentSelector';
import { TuningSelector } from '@/components/tuner/TuningSelector';
import { MicrophoneButton } from '@/components/tuner/MicrophoneButton';
import {
  instruments,
  getDefaultTuning,
  type Instrument,
  type Tuning,
} from '@/lib/data/instruments';

interface TunerPageIslandProps {
  messages: Record<string, any>;
}

export function TunerPageIsland({ messages }: TunerPageIslandProps) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = messages.tuner?.[key];
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(
    instruments[0]
  );
  const [selectedTuning, setSelectedTuning] = useState<Tuning>(
    getDefaultTuning(instruments[0])
  );

  const {
    isListening,
    hasPermission,
    error,
    currentPitch,
    startListening,
    stopListening,
  } = useTuner();

  const handleInstrumentChange = useCallback((instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setSelectedTuning(getDefaultTuning(instrument));
  }, []);

  const handleTuningChange = useCallback((tuning: Tuning) => {
    setSelectedTuning(tuning);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
          {t('chromatic')} {t('title', { instrument: '' })}
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
          <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
