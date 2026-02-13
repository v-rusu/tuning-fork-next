import {
  referenceFrequencies,
  type ReferenceFrequency,
} from '@/lib/data/frequencies';

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

interface FrequencySelectorProps {
  value: number;
  onChange: (frequency: ReferenceFrequency) => void;
  messages: { tuningFork: Record<string, any> };
}

export function FrequencySelector({ value, onChange, messages }: FrequencySelectorProps) {
  const t = createT(messages.tuningFork);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const freq = referenceFrequencies.find(
      (f) => f.frequency === parseInt(e.target.value)
    );
    if (freq) {
      onChange(freq);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="frequency-select"
        className="block text-sm font-medium text-text-secondary mb-2"
      >
        {t('selectFrequency')}
      </label>
      <select
        id="frequency-select"
        value={value}
        onChange={handleChange}
        className="w-full bg-tuner-card text-white rounded-lg px-4 py-3 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-touch"
      >
        {referenceFrequencies.map((freq) => (
          <option key={freq.id} value={freq.frequency}>
            {freq.name}
          </option>
        ))}
      </select>
    </div>
  );
}
