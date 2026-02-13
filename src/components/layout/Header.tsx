import { useState, useEffect } from 'react';
import { getLocalizedPath, getPathnameWithoutLocale, type Locale } from '@/i18n/utils';
import { LocaleSwitcher } from './LocaleSwitcher';

interface HeaderProps {
  locale: Locale;
  messages: { nav: Record<string, string> };
}

export function Header({ locale, messages }: HeaderProps) {
  const t = (key: string) => messages.nav[key] ?? key;
  const [pathname, setPathname] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setPathname(getPathnameWithoutLocale(window.location.pathname));
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-tuner-background/95 backdrop-blur-sm border-b border-tuner-faded/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href={getLocalizedPath('/', locale)} className="flex items-center gap-2">
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

          <nav className="hidden md:flex items-center gap-6">
            <a
              href={getLocalizedPath('/', locale)}
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-500'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {t('home')}
            </a>
            <a
              href={getLocalizedPath('/artists', locale)}
              className={`text-sm font-medium transition-colors ${
                isActive('/artists') || isActive('/browse')
                  ? 'text-primary-500'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {t('artists')}
            </a>
            <a
              href={getLocalizedPath('/tools', locale)}
              className={`text-sm font-medium transition-colors ${
                isActive('/tools')
                  ? 'text-primary-500'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {t('tools')}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <LocaleSwitcher locale={locale} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-white"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-tuner-faded/30">
            <div className="flex flex-col gap-2">
              <a
                href={getLocalizedPath('/', locale)}
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-3 text-base font-medium rounded transition-colors ${
                  isActive('/')
                    ? 'text-primary-500 bg-tuner-card'
                    : 'text-text-secondary hover:text-white hover:bg-tuner-card'
                }`}
              >
                {t('home')}
              </a>
              <a
                href={getLocalizedPath('/artists', locale)}
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-3 text-base font-medium rounded transition-colors ${
                  isActive('/artists') || isActive('/browse')
                    ? 'text-primary-500 bg-tuner-card'
                    : 'text-text-secondary hover:text-white hover:bg-tuner-card'
                }`}
              >
                {t('artists')}
              </a>
              <a
                href={getLocalizedPath('/tools', locale)}
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-3 text-base font-medium rounded transition-colors ${
                  isActive('/tools')
                    ? 'text-primary-500 bg-tuner-card'
                    : 'text-text-secondary hover:text-white hover:bg-tuner-card'
                }`}
              >
                {t('tools')}
              </a>
              <div className="border-t border-tuner-faded/30 my-2"></div>
              <a
                href={getLocalizedPath('/tools/tuner', locale)}
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-2 text-sm text-text-secondary hover:text-white hover:bg-tuner-card rounded transition-colors"
              >
                {t('tuner')}
              </a>
              <a
                href={getLocalizedPath('/tools/tuning-fork', locale)}
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-2 text-sm text-text-secondary hover:text-white hover:bg-tuner-card rounded transition-colors"
              >
                {t('tuningFork')}
              </a>
              <a
                href={getLocalizedPath('/tools/chords', locale)}
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-2 text-sm text-text-secondary hover:text-white hover:bg-tuner-card rounded transition-colors"
              >
                {t('chords')}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
