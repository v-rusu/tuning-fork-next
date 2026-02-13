import { useTuner } from '@/hooks/useTuner';
import { TunerDisplay } from '@/components/tuner/TunerDisplay';
import { StringIndicator } from '@/components/tuner/StringIndicator';
import { MicrophoneButton } from '@/components/tuner/MicrophoneButton';
import {
  getInstrumentBySlug,
  getTuningBySlug,
} from '@/lib/data/instruments';
import { getLocalizedPath, type Locale } from '@/i18n/utils';

interface TuningTunerPageIslandProps {
  instrumentSlug: string;
  tuningSlug: string;
  locale: Locale;
  messages: Record<string, any>;
}

export function TuningTunerPageIsland({ instrumentSlug, tuningSlug, locale, messages }: TuningTunerPageIslandProps) {
  const instrument = getInstrumentBySlug(instrumentSlug);
  const tuning = instrument ? getTuningBySlug(instrument, tuningSlug) : null;

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

  const {
    isListening,
    hasPermission,
    error,
    currentPitch,
    startListening,
    stopListening,
  } = useTuner();

  if (!instrument || !tuning) {
    return <div className="container mx-auto px-4 py-8 text-center text-text-secondary">Not found</div>;
  }

  const instrumentName = messages.instruments?.[instrument.id] || instrument.name;
  const tuningName = messages.tunings?.[tuning.id] || tuning.name;

  const descriptionKey = `${instrument.id}`;
  const tuningDescNs = messages.tuningDescriptions?.[instrument.id];
  const tuningDescription = tuningDescNs?.[tuning.id] || tuning.description;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <nav className="mb-4 text-sm">
          <a href={getLocalizedPath('/tools/tuner', locale)} className="text-text-secondary hover:text-white">
            {t('tuner', 'chromatic')}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <a href={getLocalizedPath(`/tools/tuner/${instrument.slug}`, locale)} className="text-text-secondary hover:text-white">
            {instrumentName}
          </a>
          <span className="text-text-muted mx-2">/</span>
          <span className="text-white">{tuningName}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          {t('tuner', 'title', { instrument: `${instrumentName} ${tuningName}` })}
        </h1>

        {tuningDescription && (
          <p className="text-text-secondary text-center mb-8">{tuningDescription}</p>
        )}

        <div className="mb-8">
          <TunerDisplay pitch={currentPitch} isListening={isListening} messages={messages} />
        </div>

        <div className="mb-8">
          <StringIndicator
            strings={tuning.strings}
            activeNote={currentPitch?.note}
            activeOctave={currentPitch?.octave}
          />
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('tuner', 'tuningNotes', { tuning: tuningName })}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {tuning.strings.map((string, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-text-secondary mb-1">
                  {t('tuner', 'string')} {tuning.strings.length - index}
                </div>
                <div className="text-xl font-bold text-white">
                  {string.note}
                  <span className="text-sm text-text-secondary">{string.octave}</span>
                </div>
                <div className="text-xs text-text-muted">
                  {string.frequency.toFixed(1)} Hz
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <MicrophoneButton
            isListening={isListening}
            hasPermission={hasPermission}
            error={error}
            onStart={startListening}
            onStop={stopListening}
            messages={messages}
          />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('tuner', 'otherTunings', { instrument: instrumentName })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {instrument.tunings
              .filter((tt) => tt.id !== tuning.id)
              .map((otherTuning) => (
                <a
                  key={otherTuning.id}
                  href={getLocalizedPath(`/tools/tuner/${instrument.slug}/${otherTuning.slug}`, locale)}
                  className="text-sm px-3 py-1 rounded-full bg-tuner-card text-text-secondary hover:bg-tuner-faded"
                >
                  {messages.tunings?.[otherTuning.id] || otherTuning.name}
                </a>
              ))}
          </div>
        </div>

        {tuning.keywords && tuning.keywords.length > 0 && (
          <div className="mt-8 text-text-secondary text-xs">
            <p>Related: {tuning.keywords.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
