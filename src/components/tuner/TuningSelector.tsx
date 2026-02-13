import type { Tuning } from '@/lib/data/instruments';

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

interface TuningSelectorProps {
  tunings: Tuning[];
  value: string;
  onChange: (tuning: Tuning) => void;
  messages: { tuner: Record<string, any>; tunings: Record<string, any> };
}

export function TuningSelector({ tunings, value, onChange, messages }: TuningSelectorProps) {
  const t = createT(messages.tuner);
  const tTunings = createT(messages.tunings);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tuning = tunings.find((t) => t.id === e.target.value);
    if (tuning) {
      onChange(tuning);
    }
  };

  const getTuningLabel = (tuning: Tuning) => {
    // Try to get translated name, fallback to tuning.name
    const translated = tTunings(tuning.id);
    return translated !== tuning.id ? translated : tuning.name;
  };

  return (
    <div className="w-full">
      <label
        htmlFor="tuning-select"
        className="block text-sm font-medium text-text-secondary mb-2"
      >
        {t('selectTuning')}
      </label>
      <select
        id="tuning-select"
        value={value}
        onChange={handleChange}
        className="w-full bg-tuner-card text-white rounded-lg px-4 py-3 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-touch"
      >
        {tunings.map((tuning) => (
          <option key={tuning.id} value={tuning.id}>
            {getTuningLabel(tuning)}
          </option>
        ))}
      </select>
    </div>
  );
}
