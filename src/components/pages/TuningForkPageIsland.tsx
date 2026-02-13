import { useState } from 'react';
import { useToneGenerator } from '@/hooks/useToneGenerator';
import { TonePlayer } from '@/components/tone-generator/TonePlayer';
import { FrequencySelector } from '@/components/tone-generator/FrequencySelector';
import { WaveformSelector } from '@/components/tone-generator/WaveformSelector';
import { VolumeSlider } from '@/components/tone-generator/VolumeSlider';
import { StringToneButtons } from '@/components/tone-generator/StringToneButtons';
import {
  referenceFrequencies,
  type ReferenceFrequency,
} from '@/lib/data/frequencies';
import { instruments, getDefaultTuning } from '@/lib/data/instruments';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

interface TuningForkPageIslandProps {
  locale: Locale;
  messages: Record<string, any>;
}

export function TuningForkPageIsland({ locale, messages }: TuningForkPageIslandProps) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = messages.tuningFork?.[key];
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k: string) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const [selectedFrequency, setSelectedFrequency] = useState<ReferenceFrequency>(
    referenceFrequencies[0]
  );
  const [selectedInstrument] = useState(instruments[0]);
  const selectedTuning = getDefaultTuning(selectedInstrument);

  const {
    isPlaying,
    frequency,
    waveform,
    volume,
    toggle,
    setFrequency,
    setWaveform,
    setVolume,
    playFrequency,
  } = useToneGenerator({ frequency: 440 });

  const handleFrequencyChange = (freq: ReferenceFrequency) => {
    setSelectedFrequency(freq);
    setFrequency(freq.frequency);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          {t('title', { frequency: selectedFrequency.frequency })}
        </h1>
        <p className="text-text-secondary text-center mb-8">
          {t('description', { frequency: selectedFrequency.frequency })}
        </p>

        <div className="flex justify-center mb-8">
          <TonePlayer isPlaying={isPlaying} frequency={frequency} onToggle={toggle} messages={messages} />
        </div>

        <div className="card mb-8 space-y-6">
          <FrequencySelector value={selectedFrequency.frequency} onChange={handleFrequencyChange} messages={messages} />
          <WaveformSelector value={waveform} onChange={setWaveform} messages={messages} />
          <VolumeSlider value={volume} onChange={setVolume} messages={messages} />
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">{selectedFrequency.name}</h2>
          <p className="text-text-secondary text-sm">{selectedFrequency.description}</p>
        </div>

        <div className="card mb-8">
          <StringToneButtons
            strings={selectedTuning.strings}
            currentFrequency={frequency}
            isPlaying={isPlaying}
            onPlay={playFrequency}
            messages={messages}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {referenceFrequencies.slice(0, 3).map((freq) => (
            <a
              key={freq.id}
              href={getLocalizedPath(`/tools/tuning-fork/${freq.slug}`, locale)}
              className={`p-3 text-center rounded-lg transition-colors ${
                freq.frequency === selectedFrequency.frequency
                  ? 'bg-primary-500 text-white'
                  : 'bg-tuner-card text-text-secondary hover:bg-tuner-faded'
              }`}
            >
              <span className="block text-lg font-bold">{freq.frequency}</span>
              <span className="block text-xs">Hz</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
