import { instruments, type Instrument } from '@/lib/data/instruments';

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

interface InstrumentSelectorProps {
  value: string;
  onChange: (instrument: Instrument) => void;
  messages: { tuner: Record<string, any>; instruments: Record<string, any> };
}

export function InstrumentSelector({ value, onChange, messages }: InstrumentSelectorProps) {
  const t = createT(messages.tuner);
  const tInstruments = createT(messages.instruments);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = instruments.find((i) => i.id === e.target.value);
    if (instrument) {
      onChange(instrument);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="instrument-select"
        className="block text-sm font-medium text-text-secondary mb-2"
      >
        {t('selectInstrument')}
      </label>
      <select
        id="instrument-select"
        value={value}
        onChange={handleChange}
        className="w-full bg-tuner-card text-white rounded-lg px-4 py-3 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-touch"
      >
        {instruments.map((instrument) => (
          <option key={instrument.id} value={instrument.id}>
            {tInstruments(instrument.id)}
          </option>
        ))}
      </select>
    </div>
  );
}
