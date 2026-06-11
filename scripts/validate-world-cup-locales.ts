import { getToolUiCopy } from '../src/components/blocks/world-cup-homepage';
import {
  buildWorldCupSitemapXml,
  getWorldCupSitemapStats,
} from '../src/lib/world-cup-sitemap';
import {
  defaultLocale,
  getGroupPredictionPath,
  getLocaleSegment,
  getPagePath,
  getTeamPath,
  getWorldCupContent,
  groupPredictionPages,
  pageKeys,
  publicLocales,
  teamPages,
} from '../src/lib/world-cup-content';

type Issue = {
  locale: string;
  page?: string;
  field: string;
  message: string;
};

const issues: Issue[] = [];
const englishByPage = Object.fromEntries(
  pageKeys.map((pageKey) => [
    pageKey,
    getWorldCupContent(defaultLocale, pageKey),
  ])
);

for (const locale of publicLocales) {
  const base = getWorldCupContent(locale, 'home');
  const ui = getToolUiCopy(base.config.languageGroup);

  assertComplete(locale, 'nav', base.nav);
  assertComplete(locale, 'predictor', base.predictor);
  assertComplete(locale, 'thirdPlace', base.thirdPlace);
  assertComplete(locale, 'seoPlan', base.seoPlan);
  assertComplete(locale, 'faq', base.faq);
  assertComplete(locale, 'toolUi', ui);

  if (base.faq.length < 3) {
    issues.push({
      locale,
      field: 'faq',
      message: 'Expected at least 3 localized FAQ items.',
    });
  }

  for (const pageKey of pageKeys) {
    const content = getWorldCupContent(locale, pageKey);
    const path = getPagePath(locale, pageKey);
    assertComplete(locale, `pages.${pageKey}`, content.seo, pageKey);

    const segment = getLocaleSegment(locale);
    if (!path.startsWith(`/${segment}/`)) {
      issues.push({
        locale,
        page: pageKey,
        field: 'path',
        message: `Path does not start with locale prefix: ${path}`,
      });
    }

    if (locale !== defaultLocale) {
      const english = englishByPage[pageKey].seo;
      if (content.seo.title === english.title) {
        issues.push({
          locale,
          page: pageKey,
          field: 'seo.title',
          message: 'Title still matches the English default.',
        });
      }
      if (content.seo.description === english.description) {
        issues.push({
          locale,
          page: pageKey,
          field: 'seo.description',
          message: 'Description still matches the English default.',
        });
      }
      if (content.seo.body === english.body) {
        issues.push({
          locale,
          page: pageKey,
          field: 'seo.body',
          message: 'Body still matches the English default.',
        });
      }
    }
  }

  for (const team of teamPages) {
    const teamPath = getTeamPath(locale, team.slug);
    const segment = getLocaleSegment(locale);
    if (!teamPath.startsWith(`/${segment}/teams/`)) {
      issues.push({
        locale,
        page: `team:${team.slug}`,
        field: 'teamPath',
        message: `Team path does not use the public language prefix: ${teamPath}`,
      });
    }
  }

  for (const group of groupPredictionPages) {
    const groupPath = getGroupPredictionPath(locale, group.slug);
    const segment = getLocaleSegment(locale);
    if (!groupPath.startsWith(`/${segment}/groups/`)) {
      issues.push({
        locale,
        page: `group:${group.slug}`,
        field: 'groupPath',
        message: `Group path does not use the public language prefix: ${groupPath}`,
      });
    }
  }
}

const sitemap = buildWorldCupSitemapXml({ baseUrl: 'https://example.com' });
const sitemapStats = getWorldCupSitemapStats();
const sitemapUrlCount = sitemap.match(/<url>/g)?.length ?? 0;
const expectedSitemapUrlCount =
  sitemapStats.toolUrlCount +
  sitemapStats.teamUrlCount +
  sitemapStats.groupPredictionUrlCount;
if (sitemapUrlCount !== expectedSitemapUrlCount) {
  issues.push({
    locale: 'all',
    field: 'sitemap',
    message: `Expected ${expectedSitemapUrlCount} World Cup URLs, got ${sitemapUrlCount}.`,
  });
}
if (!sitemap.includes('/en/teams/brazil')) {
  issues.push({
    locale: 'en-us',
    field: 'sitemap.team',
    message: 'Missing English Brazil team URL from generated sitemap.',
  });
}
if (!sitemap.includes(encodeURI('/zh/世界杯模拟器'))) {
  issues.push({
    locale: 'zh-cn',
    field: 'sitemap.zh',
    message: 'Missing encoded Chinese simulator URL from generated sitemap.',
  });
}

if (issues.length > 0) {
  console.error('World Cup locale validation failed:');
  for (const issue of issues) {
    console.error(
      `- ${issue.locale}${issue.page ? `/${issue.page}` : ''} ${issue.field}: ${issue.message}`
    );
  }
  process.exit(1);
}

console.log(
  `World Cup locale validation passed: ${publicLocales.length} language locales x ${pageKeys.length} tool pages + ${teamPages.length} team pages + ${groupPredictionPages.length} group pages.`
);

function assertComplete(
  locale: string,
  field: string,
  value: unknown,
  page?: string
) {
  if (value === undefined || value === null) {
    issues.push({ locale, page, field, message: 'Missing value.' });
    return;
  }

  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      issues.push({ locale, page, field, message: 'Empty string.' });
    }
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      issues.push({ locale, page, field, message: 'Empty array.' });
    }
    value.forEach((item, index) =>
      assertComplete(locale, `${field}[${index}]`, item, page)
    );
    return;
  }

  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'icon') continue;
      assertComplete(locale, `${field}.${key}`, child, page);
    }
  }
}
