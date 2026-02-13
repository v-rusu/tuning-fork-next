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

interface TonePlayerProps {
  isPlaying: boolean;
  frequency: number;
  onToggle: () => void;
  messages: { tuningFork: Record<string, any> };
}

export function TonePlayer({ isPlaying, frequency, onToggle, messages }: TonePlayerProps) {
  const t = createT(messages.tuningFork);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onToggle}
        className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
          isPlaying
            ? 'bg-tuner-inTune'
            : 'border-2 border-accent text-accent hover:bg-accent hover:text-black'
        }`}
        aria-label={isPlaying ? t('stopTone') : t('playTone')}
      >
        {isPlaying ? (
          // Stop icon
          <svg
            className="w-12 h-12 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Play icon
          <svg
            className="w-12 h-12 ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        <span className={`text-2xl font-bold mt-2 ${isPlaying ? 'text-black' : ''}`}>{frequency} Hz</span>
      </button>

      <span className="text-sm text-text-secondary">
        {isPlaying ? t('stopTone') : t('playTone')}
      </span>
    </div>
  );
}
