import {
  rootNotes,
  chordQualities,
  type RootNote,
  type ChordQuality,
} from '@/lib/data/chords';

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

interface ChordSearchProps {
  searchQuery: string;
  selectedRoot: RootNote | '';
  selectedQuality: ChordQuality | '';
  onSearchChange: (query: string) => void;
  onRootChange: (root: RootNote | '') => void;
  onQualityChange: (quality: ChordQuality | '') => void;
  messages: { chords: Record<string, any> };
}

export function ChordSearch({
  searchQuery,
  selectedRoot,
  selectedQuality,
  onSearchChange,
  onRootChange,
  onQualityChange,
  messages,
}: ChordSearchProps) {
  const t = createT(messages.chords);

  return (
    <div className="card mb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Search input */}
        <div>
          <label
            htmlFor="chord-search"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {t('searchPlaceholder')}
          </label>
          <input
            id="chord-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-tuner-card text-white rounded-lg px-4 py-2 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Root note filter */}
        <div>
          <label
            htmlFor="root-filter"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {t('filterByRoot')}
          </label>
          <select
            id="root-filter"
            value={selectedRoot}
            onChange={(e) => onRootChange(e.target.value as RootNote | '')}
            className="w-full bg-tuner-card text-white rounded-lg px-4 py-2 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('allRoots')}</option>
            {rootNotes.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        {/* Quality filter */}
        <div>
          <label
            htmlFor="quality-filter"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {t('filterByQuality')}
          </label>
          <select
            id="quality-filter"
            value={selectedQuality}
            onChange={(e) => onQualityChange(e.target.value as ChordQuality | '')}
            className="w-full bg-tuner-card text-white rounded-lg px-4 py-2 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('allQualities')}</option>
            {chordQualities.map((quality) => (
              <option key={quality.value} value={quality.value}>
                {quality.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
