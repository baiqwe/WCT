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
 * Footer links, grouped by section
 */
export function getFooterLinks(locale: Locale = defaultLocale): MenuItemConfig[] {
  const t = getWorldCupContent(locale);
  const labels = getFooterSectionLabels(locale);
  return [
    {
      title: labels.tools,
      items: [
        { title: t.nav.home, href: getPagePath(locale, 'home'), external: false },
        { title: t.nav.predictor, href: getPagePath(locale, 'predictor'), external: false },
        { title: t.nav.bracket, href: getPagePath(locale, 'bracket'), external: false },
        { title: t.nav.thirdPlace, href: getPagePath(locale, 'thirdPlace'), external: false },
        { title: t.nav.monteCarlo, href: getPagePath(locale, 'monteCarlo'), external: false },
      ],
    },
    {
      title: labels.languages,
      items: publicLocales.map((candidate) => ({
        title: languageLabels[candidate],
        href: getPagePath(candidate, 'home'),
        external: false,
      })),
    },
    {
      title: labels.seoPages,
      items: [
        { title: t.nav.groupStage, href: getPagePath(locale, 'groupStage'), external: false },
        { title: t.thirdPlace.title, href: getPagePath(locale, 'thirdPlace'), external: false },
        { title: t.nav.pools, href: `${getPagePath(locale, 'home')}#method`, external: false },
        { title: t.nav.faq, href: `${getPagePath(locale, 'home')}#faq`, external: false },
      ],
    },
    {
      title: labels.trust,
      items: [
        { title: labels.about, href: '/about', external: false },
        { title: labels.privacy, href: '/privacy', external: false },
        { title: labels.cookie, href: '/cookie', external: false },
        { title: labels.terms, href: '/terms', external: false },
        { title: labels.sitemap, href: '/sitemap.xml', external: false },
      ],
    },
  ];
}

function getFooterSectionLabels(locale: Locale) {
  const group = localeConfigs[locale].languageGroup;
  return (
    {
      en: { tools: 'Tools', languages: 'Languages', seoPages: 'Tool pages', trust: 'Trust', about: 'About us', privacy: 'Privacy policy', cookie: 'Cookie policy', terms: 'Terms', sitemap: 'Sitemap' },
      es: { tools: 'Herramientas', languages: 'Idiomas', seoPages: 'Paginas de herramientas', trust: 'Confianza', about: 'Sobre nosotros', privacy: 'Privacidad', cookie: 'Cookies', terms: 'Terminos', sitemap: 'Sitemap' },
      pt: { tools: 'Ferramentas', languages: 'Idiomas', seoPages: 'Paginas de ferramentas', trust: 'Confianca', about: 'Sobre', privacy: 'Privacidade', cookie: 'Cookies', terms: 'Termos', sitemap: 'Sitemap' },
      fr: { tools: 'Outils', languages: 'Langues', seoPages: 'Pages outils', trust: 'Confiance', about: 'A propos', privacy: 'Confidentialite', cookie: 'Cookies', terms: 'Conditions', sitemap: 'Sitemap' },
      de: { tools: 'Tools', languages: 'Sprachen', seoPages: 'Tool-Seiten', trust: 'Vertrauen', about: 'Uber uns', privacy: 'Datenschutz', cookie: 'Cookie-Richtlinie', terms: 'Bedingungen', sitemap: 'Sitemap' },
      it: { tools: 'Strumenti', languages: 'Lingue', seoPages: 'Pagine strumenti', trust: 'Fiducia', about: 'Chi siamo', privacy: 'Privacy', cookie: 'Cookie', terms: 'Termini', sitemap: 'Sitemap' },
      nl: { tools: 'Tools', languages: 'Talen', seoPages: 'Toolpagina’s', trust: 'Vertrouwen', about: 'Over ons', privacy: 'Privacy', cookie: 'Cookiebeleid', terms: 'Voorwaarden', sitemap: 'Sitemap' },
      ja: { tools: 'ツール', languages: '言語', seoPages: 'ツールページ', trust: '信頼情報', about: 'About us', privacy: 'Privacy policy', cookie: 'Cookie policy', terms: 'Terms', sitemap: 'Sitemap' },
      ko: { tools: '도구', languages: '언어', seoPages: '도구 페이지', trust: '신뢰 정보', about: 'About us', privacy: 'Privacy policy', cookie: 'Cookie policy', terms: 'Terms', sitemap: 'Sitemap' },
      zh: { tools: '工具', languages: '语言', seoPages: '工具页面', trust: '信任信息', about: '关于我们', privacy: '隐私政策', cookie: 'Cookie 政策', terms: '服务条款', sitemap: '站点地图' },
    } satisfies Record<typeof group, { tools: string; languages: string; seoPages: string; trust: string; about: string; privacy: string; cookie: string; terms: string; sitemap: string }>
  )[group];
}
