import type { WaveformType } from '@/lib/tuner/tone-generator';

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

interface WaveformSelectorProps {
  value: WaveformType;
  onChange: (waveform: WaveformType) => void;
  messages: { tuningFork: Record<string, any> };
}

const waveforms: { value: WaveformType; icon: string }[] = [
  { value: 'sine', icon: '\u223F' },
  { value: 'triangle', icon: '\u25B3' },
  { value: 'sawtooth', icon: '\u22C0' },
  { value: 'square', icon: '\u25A1' },
];

export function WaveformSelector({ value, onChange, messages }: WaveformSelectorProps) {
  const t = createT(messages.tuningFork);

  const getLabel = (waveform: WaveformType) => {
    switch (waveform) {
      case 'sine':
        return t('sine');
      case 'triangle':
        return t('triangle');
      case 'sawtooth':
        return t('sawtooth');
      case 'square':
        return 'Square';
      default:
        return waveform;
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {t('waveform')}
      </label>
      <div className="flex gap-2">
        {waveforms.map((wf) => (
          <button
            key={wf.value}
            onClick={() => onChange(wf.value)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all ${
              value === wf.value
                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                : 'bg-tuner-card border-tuner-faded/50 text-text-secondary hover:border-tuner-faded'
            }`}
            title={getLabel(wf.value)}
          >
            <span className="text-2xl mb-1">{wf.icon}</span>
            <span className="text-xs">{getLabel(wf.value)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
