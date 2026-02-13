import type { StringDefinition } from '@/lib/data/instruments';

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

interface StringToneButtonsProps {
  strings: StringDefinition[];
  currentFrequency?: number;
  isPlaying: boolean;
  onPlay: (frequency: number) => void;
  messages: { tuningFork: Record<string, any> };
}

export function StringToneButtons({
  strings,
  currentFrequency,
  isPlaying,
  onPlay,
  messages,
}: StringToneButtonsProps) {
  const t = createT(messages.tuningFork);

  const isActive = (string: StringDefinition) => {
    return isPlaying && Math.abs(string.frequency - (currentFrequency || 0)) < 1;
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-text-secondary mb-3 text-center">
        {t('playStringTones')}
      </h3>
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {strings.map((string, index) => {
          const active = isActive(string);

          return (
            <button
              key={`${string.note}-${string.octave}-${index}`}
              onClick={() => onPlay(string.frequency)}
              className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 font-bold transition-all duration-200 ${
                active
                  ? 'bg-primary-500 border-primary-500 text-white scale-105'
                  : 'bg-tuner-card border-tuner-faded/50 text-text-secondary hover:border-primary-500 hover:text-white'
              }`}
              title={`Play ${string.note}${string.octave} (${string.frequency.toFixed(1)} Hz)`}
            >
              <span className="text-lg font-bold">
                {string.note}
                <span className="text-xs">{string.octave}</span>
              </span>
              <span className="text-xs text-text-secondary">
                {string.frequency.toFixed(0)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
