import { getLocalizedPath, type Locale } from '@/i18n/utils';

interface FooterProps {
  locale: Locale;
  messages: { footer: Record<string, string> };
}

export function Footer({ locale, messages }: FooterProps) {
  const t = (key: string, params?: Record<string, string | number>) => {
    const value = messages.footer[key] ?? key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      );
    }
    return value;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tuner-background border-t border-tuner-faded/30 safe-area-inset-bottom">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href={getLocalizedPath('/', locale)} className="flex items-center gap-2 mb-4">
              <svg
                className="w-8 h-8 text-primary-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span className="text-xl font-bold text-white">TuningFork</span>
            </a>
            <p className="text-text-secondary text-sm max-w-md">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={getLocalizedPath('/tools/tuner/guitar', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('guitarTuner')}
                </a>
              </li>
              <li>
                <a
                  href={getLocalizedPath('/tools/tuner/bass', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('bassTuner')}
                </a>
              </li>
              <li>
                <a
                  href={getLocalizedPath('/tools/tuner/ukulele', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('ukuleleTuner')}
                </a>
              </li>
              <li>
                <a
                  href={getLocalizedPath('/tools/tuning-fork/440', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('a440TuningFork')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('resources')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={getLocalizedPath('/tools/chords/guitar', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('guitarChords')}
                </a>
              </li>
              <li>
                <a
                  href={getLocalizedPath('/tools/chords/ukulele', locale)}
                  className="text-text-secondary hover:text-white text-sm"
                >
                  {t('ukuleleChords')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-tuner-faded/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex gap-6">
            <a
              href={getLocalizedPath('/', locale)}
              className="text-text-secondary hover:text-white text-sm"
            >
              {t('privacy')}
            </a>
            <a
              href={getLocalizedPath('/', locale)}
              className="text-text-secondary hover:text-white text-sm"
            >
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
