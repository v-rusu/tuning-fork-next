import { useToneGenerator } from '@/hooks/useToneGenerator';
import { TonePlayer } from '@/components/tone-generator/TonePlayer';
import { WaveformSelector } from '@/components/tone-generator/WaveformSelector';
import { VolumeSlider } from '@/components/tone-generator/VolumeSlider';
import { StringToneButtons } from '@/components/tone-generator/StringToneButtons';
import { getFrequencyBySlug, referenceFrequencies } from '@/lib/data/frequencies';
import { instruments, getDefaultTuning } from '@/lib/data/instruments';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

type HowToUseStepKey = 'step1' | 'step2' | 'step3' | 'step4';

interface FrequencyPageIslandProps {
  frequencySlug: string;
  locale: Locale;
  messages: Record<string, any>;
}

export function FrequencyPageIsland({ frequencySlug, locale, messages }: FrequencyPageIslandProps) {
  const referenceFreq = getFrequencyBySlug(frequencySlug);

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Support dot notation for nested keys like howToUseSteps.step1
    const parts = key.split('.');
    let value: any = messages.tuningFork;
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

  const selectedInstrument = instruments[0];
  const selectedTuning = getDefaultTuning(selectedInstrument);

  const { isPlaying, frequency, waveform, volume, toggle, setWaveform, setVolume, playFrequency } =
    useToneGenerator({
      frequency: referenceFreq?.frequency || 440,
    });

  if (!referenceFreq) {
    return <div className="container mx-auto px-4 py-8 text-center text-text-secondary">Not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <nav className="mb-4 text-sm">
          <a href={getLocalizedPath('/tools/tuning-fork', locale)} className="text-text-secondary hover:text-white">
            {messages.nav?.tuningFork || 'Tuning Fork'}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <span className="text-white">{referenceFreq.frequency} Hz</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          {t('title', { frequency: referenceFreq.frequency })}
        </h1>
        <p className="text-text-secondary text-center mb-8">{referenceFreq.description}</p>

        <div className="flex justify-center mb-8">
          <TonePlayer isPlaying={isPlaying} frequency={frequency} onToggle={toggle} messages={messages} />
        </div>

        <div className="card mb-8 space-y-6">
          <WaveformSelector value={waveform} onChange={setWaveform} messages={messages} />
          <VolumeSlider value={volume} onChange={setVolume} messages={messages} />
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

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('aboutFrequency', { frequency: referenceFreq.frequency })}
          </h2>
          <p className="text-text-secondary text-sm mb-4">{referenceFreq.description}</p>
          {referenceFreq.keywords && (
            <div className="flex flex-wrap gap-2">
              {referenceFreq.keywords.map((keyword) => (
                <span key={keyword} className="text-xs px-2 py-1 bg-tuner-card text-text-secondary rounded">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">{t('otherFrequencies')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {referenceFrequencies
              .filter((f) => f.frequency !== referenceFreq.frequency)
              .map((freq) => (
                <a
                  key={freq.id}
                  href={getLocalizedPath(`/tools/tuning-fork/${freq.slug}`, locale)}
                  className="p-3 text-center rounded-lg bg-tuner-card text-text-secondary hover:bg-tuner-faded transition-colors"
                >
                  <span className="block text-lg font-bold">{freq.frequency}</span>
                  <span className="block text-xs">{freq.name}</span>
                </a>
              ))}
          </div>
        </div>

        <div className="mt-8 text-text-secondary text-sm">
          <h2 className="text-lg font-semibold text-white mb-4">{t('howToUse')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {(['step1', 'step2', 'step3', 'step4'] as HowToUseStepKey[]).map((step) => (
              <li key={step}>{t(`howToUseSteps.${step}`, { frequency: referenceFreq.frequency })}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
