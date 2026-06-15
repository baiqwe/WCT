import { WorldCupHomePage } from '@/components/blocks/world-cup-homepage';
import { websiteConfig } from '@/config/website';
import {
  defaultLocale,
  getLocaleConfig,
  getPageKey,
  getPagePath,
  getWorldCupContent,
  normalizeLocale,
  publicLocales,
} from '@/lib/world-cup-content';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/$page')({
  beforeLoad: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const pageKey = getPageKey(locale, params.page);
    const canonicalPath = getPagePath(locale, pageKey);

    if (`/${params.locale}/${params.page}` !== canonicalPath) {
      throw redirect({ to: canonicalPath });
    }
  },
  head: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const pageKey = getPageKey(locale, params.page);
    const page = getWorldCupContent(locale, pageKey);
    const path = getPagePath(locale, pageKey);
    const metadata = seo(path, {
      title: page.seo.title,
      description: page.seo.description,
      keywords: page.seo.keywords,
    });
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };
    const appJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: page.seo.h1,
      applicationCategory: 'SportsApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: page.seo.description,
      url: getCanonicalUrl(path),
      isAccessibleForFree: true,
      publisher: {
        '@type': 'Organization',
        name: websiteConfig.metadata?.name ?? 'World Cup Tool',
        url: getCanonicalUrl(getPagePath(defaultLocale, 'home')),
      },
    };
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'World Cup 2026 Simulator',
          item: getCanonicalUrl(getPagePath(defaultLocale, 'home')),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.seo.h1,
          item: getCanonicalUrl(path),
        },
      ],
    };

    return {
      ...metadata,
      links: [
        ...metadata.links,
        ...publicLocales.map((candidate) => ({
          rel: 'alternate',
          hrefLang: getLocaleConfig(candidate).htmlLang,
          href: getCanonicalUrl(getPagePath(candidate, pageKey)),
        })),
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: getCanonicalUrl(getPagePath(defaultLocale, pageKey)),
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(faqJsonLd),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(appJsonLd),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbJsonLd),
        },
      ],
    };
  },
  component: LocaleToolPage,
});

function LocaleToolPage() {
  const { locale, page } = Route.useParams();
  const normalizedLocale = normalizeLocale(locale);
  const pageKey = getPageKey(normalizedLocale, page);
  return <WorldCupHomePage locale={normalizedLocale} pageKey={pageKey} />;
}
