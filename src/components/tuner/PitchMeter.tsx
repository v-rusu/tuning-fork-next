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

interface PitchMeterProps {
  cents: number;
  isActive: boolean;
  messages: { tuner: Record<string, any> };
}

export function PitchMeter({ cents, isActive, messages }: PitchMeterProps) {
  const t = createT(messages.tuner);
  // Clamp cents to -50 to +50 range
  const clampedCents = Math.max(-50, Math.min(50, cents));
  // Convert to percentage (0-100, where 50 is center)
  const position = 50 + clampedCents;

  const getIndicatorColor = () => {
    if (!isActive) return 'bg-text-muted';
    if (Math.abs(cents) <= 5) return 'bg-tuner-inTune';
    if (cents > 0) return 'bg-tuner-sharp';
    return 'bg-tuner-flat';
  };

  return (
    <div className="w-full max-w-sm">
      {/* Meter bar */}
      <div className="relative h-4 bg-tuner-faded/50 rounded-full overflow-hidden">
        {/* Flat zone */}
        <div className="absolute inset-y-0 left-0 w-[45%] bg-tuner-flat/20" />
        {/* In-tune zone */}
        <div className="absolute inset-y-0 left-[45%] w-[10%] bg-tuner-inTune/30" />
        {/* Sharp zone */}
        <div className="absolute inset-y-0 right-0 w-[45%] bg-tuner-sharp/20" />

        {/* Center marker */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-text-primary/50 -translate-x-1/2" />

        {/* Moving indicator */}
        <div
          className={`absolute top-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-100 shadow-lg ${getIndicatorColor()}`}
          style={{ left: `${position}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-text-secondary">
        <span>{'\u266D'} {t('flat')}</span>
        <span>{t('inTune')}</span>
        <span>{t('sharp')} {'\u266F'}</span>
      </div>
    </div>
  );
}
