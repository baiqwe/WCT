import {
  defaultLocale,
  getGroupPredictionPath,
  getLocaleConfig,
  getPagePath,
  getTeamPath,
  groupPredictionPages,
  pageKeys,
  publicLocales,
  teamPages,
  type PageKey,
} from './world-cup-content';

export type SitemapEntry = {
  path: string;
  changefreq?: string;
  lastmod?: string;
  pageKey?: PageKey;
  priority?: string;
};

export function buildWorldCupSitemapXml({
  baseUrl,
  blogUrls = [],
  staticUrls = [],
}: {
  baseUrl: string;
  blogUrls?: SitemapEntry[];
  staticUrls?: SitemapEntry[];
}) {
  const base = baseUrl.replace(/\/$/, '');
  const worldCupUrls = publicLocales.flatMap((locale) =>
    pageKeys.map((pageKey) => ({
      path: getPagePath(locale, pageKey),
      pageKey,
      changefreq: pageKey === 'monteCarlo' ? 'weekly' : 'daily',
      priority: getWorldCupPriority(pageKey),
    }))
  );
  const teamUrls = publicLocales.flatMap((locale) =>
    teamPages.map((team) => ({
      path: getTeamPath(locale, team.slug),
      changefreq: 'weekly',
      priority: '0.72',
    }))
  );
  const groupPredictionUrls = publicLocales.flatMap((locale) =>
    groupPredictionPages.map((group) => ({
      path: getGroupPredictionPath(locale, group.slug),
      changefreq: 'weekly',
      priority: '0.76',
    }))
  );

  const parts = [
    ...worldCupUrls.map((entry) => urlEntry(base, entry)),
    ...groupPredictionUrls.map((entry) => urlEntry(base, entry)),
    ...teamUrls.map((entry) => urlEntry(base, entry)),
    ...staticUrls.map((entry) => urlEntry(base, entry)),
    ...blogUrls.map((entry) => urlEntry(base, entry)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${parts.join('\n')}
</urlset>`;
}

export function getWorldCupSitemapStats() {
  return {
    teamUrlCount: publicLocales.length * teamPages.length,
    groupPredictionUrlCount: publicLocales.length * groupPredictionPages.length,
    toolUrlCount: publicLocales.length * pageKeys.length,
  };
}

function urlEntry(base: string, opts: SitemapEntry) {
  const lastmod = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : '';
  const changefreq = opts.changefreq
    ? `\n    <changefreq>${opts.changefreq}</changefreq>`
    : '';
  const priority = opts.priority ? `\n    <priority>${opts.priority}</priority>` : '';
  const alternates = opts.pageKey ? hreflangLinks(base, opts.pageKey) : '';
  return `  <url>\n    <loc>${escapeXml(absoluteUrl(base, opts.path))}</loc>${alternates}${lastmod}${changefreq}${priority}\n  </url>`;
}

function hreflangLinks(base: string, pageKey: PageKey) {
  const alternates = publicLocales
    .map((locale) => {
      const lang = getLocaleConfig(locale).htmlLang;
      const href = absoluteUrl(base, getPagePath(locale, pageKey));
      return `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`;
    })
    .join('');
  const xDefault = absoluteUrl(base, getPagePath(defaultLocale, pageKey));
  return `${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}" />`;
}

function absoluteUrl(base: string, path: string) {
  return `${base}${encodeURI(path)}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getWorldCupPriority(pageKey: PageKey) {
  const priorities: Record<PageKey, string> = {
    home: '1.0',
    predictor: '0.95',
    bracket: '0.9',
    groupStage: '0.9',
    thirdPlace: '0.85',
    monteCarlo: '0.8',
  };
  return priorities[pageKey];
}
