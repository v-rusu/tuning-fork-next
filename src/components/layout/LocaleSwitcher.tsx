import { locales, type Locale, getPathnameWithoutLocale, getLocalizedPath } from '@/i18n/utils';

const localeNames: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  de: 'DE',
  fr: 'FR',
};

interface LocaleSwitcherProps {
  locale: Locale;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    if (newLocale === locale) return;

    const pathWithoutLocale = getPathnameWithoutLocale(window.location.pathname);
    const newPath = getLocalizedPath(pathWithoutLocale, newLocale);

    window.location.href = newPath;
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-tuner-card text-text-primary text-sm rounded-lg px-2 py-1 border border-tuner-faded/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
