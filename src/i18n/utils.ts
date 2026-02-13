import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

export const locales = ['en', 'es', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const messages: Record<Locale, Record<string, any>> = { en, es, de, fr };

export function getMessages(locale: Locale): Record<string, any> {
  return messages[locale] ?? messages[defaultLocale];
}

export function getNamespace(locale: Locale, namespace: string): Record<string, any> {
  const all = getMessages(locale);
  return all[namespace] ?? {};
}

/**
 * Creates a translation function for a given locale and optional namespace.
 * Supports nested keys via dot notation and parameter interpolation with {param}.
 */
export function useTranslations(locale: Locale, namespace?: string) {
  const pool = namespace ? getNamespace(locale, namespace) : getMessages(locale);

  function t(key: string, params?: Record<string, string | number>): string {
    // Support dot-notation for nested keys
    const parts = key.split('.');
    let value: any = pool;
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return key;
      value = value[part];
    }
    if (typeof value !== 'string') return key;

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  }

  return t;
}

/** Extract locale from a URL pathname like /es/artists → 'es' */
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first as Locale) && first !== defaultLocale) {
    return first as Locale;
  }
  return defaultLocale;
}

/** Get pathname without locale prefix: /es/artists → /artists, /artists → /artists */
export function getPathnameWithoutLocale(pathname: string): string {
  for (const loc of locales) {
    if (loc === defaultLocale) continue;
    const prefix = `/${loc}/`;
    if (pathname.startsWith(prefix)) {
      return pathname.slice(prefix.length - 1);
    }
    if (pathname === `/${loc}`) {
      return '/';
    }
  }
  return pathname;
}

/** Build a localized path: getLocalizedPath('/artists', 'es') → '/es/artists' */
export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
