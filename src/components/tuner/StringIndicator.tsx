import type { StringDefinition } from '@/lib/data/instruments';

interface StringIndicatorProps {
  strings: StringDefinition[];
  activeNote?: string;
  activeOctave?: number;
  onStringSelect?: (string: StringDefinition) => void;
}

export function StringIndicator({
  strings,
  activeNote,
  activeOctave,
  onStringSelect,
}: StringIndicatorProps) {
  const isStringActive = (string: StringDefinition) => {
    if (!activeNote || activeOctave === undefined) return false;
    return string.note === activeNote && string.octave === activeOctave;
  };

  const isStringClose = (string: StringDefinition) => {
    if (!activeNote) return false;
    // Check if the note matches (ignoring octave)
    return string.note === activeNote;
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {strings.map((string, index) => {
        const active = isStringActive(string);
        const close = isStringClose(string);

        return (
          <button
            key={`${string.note}-${string.octave}-${index}`}
            onClick={() => onStringSelect?.(string)}
            className={`string-button ${
              active
                ? 'string-button-active'
                : close
                ? 'border-primary-500/50 text-primary-400'
                : 'string-button-inactive'
            }`}
            title={`${string.note}${string.octave} (${string.frequency.toFixed(1)} Hz)`}
          >
            <span className="text-sm font-bold">{string.note}</span>
            <span className="text-xs">{string.octave}</span>
          </button>
        );
      })}
    </div>
  );
}
