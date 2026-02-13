# Agents Notes - TuningFork Project

This document contains instructions for future Claude sessions working on this codebase.

## Localized Routes

This project uses **next-intl with typed localized pathnames**. When creating new routes, you MUST follow these guidelines:

### 1. Update routing.ts with new pathnames

When adding a new route, add it to `src/i18n/routing.ts`:

```typescript
export const pathnames = {
  // ... existing routes
  '/new-route': {
    en: '/new-route',
    es: '/nueva-ruta',
    de: '/neue-route',
    fr: '/nouvelle-route',
  },
  '/new-route/[param]': {
    en: '/new-route/[param]',
    es: '/nueva-ruta/[param]',
    de: '/neue-route/[param]',
    fr: '/nouvelle-route/[param]',
  },
};
```

### 2. Add slug translations for dynamic segments

If your route has dynamic segments (e.g., `[instrument]`, `[tuning]`), add slug translations to `src/lib/data/slugs.ts`:

```typescript
export const yourNewSlugs: Record<string, Record<Locale, string>> = {
  'english-slug': {
    en: 'english-slug',
    es: 'spanish-slug',
    de: 'german-slug',
    fr: 'french-slug',
  },
  // ... more slugs
};

// Add helper functions if needed
```

### 3. Use typed Link components

When creating links with dynamic segments, use the typed pathname format:

```tsx
import { Link, type Locale } from '@/i18n/routing';
import { getLocalizedSlug } from '@/lib/data/slugs';
import { useLocale } from 'next-intl';

function MyComponent() {
  const locale = useLocale() as Locale;

  return (
    <Link
      href={{
        pathname: '/tuner/[instrument]/[tuning]',
        params: {
          instrument: getLocalizedSlug('guitar', locale, 'instrument'),
          tuning: getLocalizedSlug('drop-d', locale, 'tuning'),
        },
      }}
    >
      Link Text
    </Link>
  );
}
```

For static routes without params:
```tsx
<Link href="/tuner">Tuner</Link>
```

### 4. Handle localized slugs in page components

In page components with dynamic segments, convert localized slugs to English:

```tsx
import { useLocale } from 'next-intl';
import { getEnglishSlug } from '@/lib/data/slugs';
import { type Locale } from '@/i18n/routing';

export default function MyPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const localizedSlug = params.myParam as string;
  const englishSlug = getEnglishSlug(localizedSlug, locale, 'instrument');

  // Use englishSlug to look up data
  const data = getDataBySlug(englishSlug);
}
```

## Supported Locales

- `en` - English (default)
- `es` - Spanish
- `de` - German
- `fr` - French

## Key Files

- `src/i18n/routing.ts` - Route pathnames configuration
- `src/lib/data/slugs.ts` - Slug translations for dynamic segments
- `src/lib/data/instruments.ts` - Instrument and tuning data with localized lookup functions
- `src/i18n/locales/*.json` - Translation strings for each locale

## Important Notes

1. **Always use typed pathnames** - Don't use string interpolation like `/tuner/${slug}`. Use the pathname object format instead.

2. **Test all locales** - When adding new routes, verify they work in all 4 locales.

3. **Update slugs.ts** - Any new dynamic content (instruments, tunings, chords) needs corresponding slug translations.

4. **Locale switching** - The LocaleSwitcher component uses `next/navigation` directly to handle locale changes across the typed routes.

5. **Build before committing** - Always run `npm run build` to verify TypeScript types for routes are correct.
