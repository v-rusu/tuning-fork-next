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

interface MicrophoneButtonProps {
  isListening: boolean;
  hasPermission: boolean | null;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
  messages: { tuner: Record<string, any> };
}

export function MicrophoneButton({
  isListening,
  hasPermission,
  error,
  onStart,
  onStop,
  messages,
}: MicrophoneButtonProps) {
  const t = createT(messages.tuner);

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-tuner-inTune mic-listening'
            : 'border-2 border-accent text-accent hover:bg-accent hover:text-black'
        }`}
        aria-label={isListening ? t('stopListening') : t('startListening')}
      >
        {isListening ? (
          // Stop icon
          <svg
            className="w-8 h-8 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Microphone icon
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 10v2a7 7 0 01-14 0v-2"
            />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>

      <span className="text-sm text-text-secondary">
        {isListening ? t('stopListening') : t('startListening')}
      </span>

      {error && (
        <div className="text-sm text-red-400 text-center max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
