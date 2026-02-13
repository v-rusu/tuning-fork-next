import { PitchMeter } from './PitchMeter';
import type { TunerResult } from '@/hooks/useTuner';

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

interface TunerDisplayProps {
  pitch: TunerResult | null;
  isListening: boolean;
  messages: { tuner: Record<string, any> };
}

export function TunerDisplay({ pitch, isListening, messages }: TunerDisplayProps) {
  const t = createT(messages.tuner);

  const getTuningStatus = () => {
    if (!pitch) return null;
    const { cents } = pitch;
    if (Math.abs(cents) <= 5) return 'inTune';
    if (cents > 0) return 'sharp';
    return 'flat';
  };

  const status = getTuningStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'inTune':
        return 'text-tuner-inTune';
      case 'sharp':
        return 'text-tuner-sharp';
      case 'flat':
        return 'text-tuner-flat';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'inTune':
        return t('inTune');
      case 'sharp':
        return t('tooSharp');
      case 'flat':
        return t('tooFlat');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pitch meter bar */}
      <PitchMeter cents={pitch?.cents ?? 0} isActive={!!pitch} messages={messages} />

      {/* Note info and status on one line */}
      <div className="flex items-center justify-center gap-4 text-center">
        {pitch ? (
          <>
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {pitch.note}
              <span className="text-xl">{pitch.octave}</span>
            </span>
            <span className={`text-lg ${getStatusColor()}`}>
              {pitch.cents > 0 ? '+' : ''}
              {pitch.cents} {t('cents')}
            </span>
            <span
              className={`text-lg font-semibold ${getStatusColor()} ${
                status === 'inTune' ? 'animate-in-tune' : ''
              }`}
            >
              {getStatusText()}
            </span>
          </>
        ) : (
          <span className="text-xl text-text-secondary">
            {isListening ? t('noSignal') : '\u2014'}
          </span>
        )}
      </div>
    </div>
  );
}
