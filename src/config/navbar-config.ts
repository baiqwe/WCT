import {
  IconLanguage,
  IconUsersGroup,
  IconWorld,
} from '@tabler/icons-react';
import type { MenuItemConfig } from '../types';
import {
  defaultLocale,
  getPagePath,
  getWorldCupContent,
  languageLabels,
  localeConfigs,
  publicLocales,
  type Locale,
} from '@/lib/world-cup-content';

/**
 * Navbar links
 */
export function getNavbarLinks(locale: Locale = defaultLocale): MenuItemConfig[] {
  const t = getWorldCupContent(locale);
  return [
    { title: t.nav.home, href: getPagePath(locale, 'home'), external: false },
    { title: t.nav.predictor, href: getPagePath(locale, 'predictor'), external: false },
    { title: t.nav.bracket, href: getPagePath(locale, 'bracket'), external: false },
    { title: t.nav.groupStage, href: getPagePath(locale, 'groupStage'), external: false },
    { title: t.nav.thirdPlace, href: getPagePath(locale, 'thirdPlace'), external: false },
    {
      title: getLanguageMenuTitle(locale),
      items: publicLocales.map((candidate, index) => ({
        title: languageLabels[candidate],
        description: localeConfigs[candidate].htmlLang,
        href: getPagePath(candidate, 'home'),
        icon: index % 3 === 0 ? IconWorld : index % 3 === 1 ? IconLanguage : IconUsersGroup,
        external: false,
      })),
    },
  ];
}

function getLanguageMenuTitle(locale: Locale) {
  const group = localeConfigs[locale].languageGroup;
  return (
    {
      en: 'Languages',
      es: 'Idiomas',
      pt: 'Idiomas',
      fr: 'Langues',
      de: 'Sprachen',
      it: 'Lingue',
      nl: 'Talen',
      ja: '言語',
      ko: '언어',
      zh: '语言',
    } satisfies Record<typeof group, string>
  )[group];
}
