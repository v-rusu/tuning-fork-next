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

interface VolumeSliderProps {
  value: number;
  onChange: (volume: number) => void;
  messages: { tuningFork: Record<string, any> };
}

export function VolumeSlider({ value, onChange, messages }: VolumeSliderProps) {
  const t = createT(messages.tuningFork);

  return (
    <div className="w-full">
      <label
        htmlFor="volume-slider"
        className="block text-sm font-medium text-text-secondary mb-2"
      >
        {t('volume')}: {Math.round(value * 100)}%
      </label>
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
          />
        </svg>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="100"
          value={value * 100}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          className="flex-1 h-2 bg-tuner-card rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <svg
          className="w-5 h-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
          />
        </svg>
      </div>
    </div>
  );
}
