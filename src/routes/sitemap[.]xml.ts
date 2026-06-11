import { createFileRoute } from '@tanstack/react-router';
import { getSortedPosts } from '@/lib/blog';
import { websiteConfig } from '@/config/website';
import { getBaseUrl } from '@/lib/urls';
import {
  buildWorldCupSitemapXml,
  type SitemapEntry,
} from '@/lib/world-cup-sitemap';

/**
 * Dynamic sitemap.xml
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-sitemap
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const staticUrls: {
          path: string;
          changefreq?: string;
          priority?: string;
        }[] = [
          { path: '/about', changefreq: 'monthly' },
          { path: '/contact', changefreq: 'monthly' },
          { path: '/terms', changefreq: 'monthly' },
          { path: '/privacy', changefreq: 'monthly' },
          { path: '/cookie', changefreq: 'monthly' },
        ];

        if (websiteConfig.blog?.enable) {
          staticUrls.push({ path: '/blog', changefreq: 'weekly' });
        }
        if (websiteConfig.payment?.enable) {
          staticUrls.push({ path: '/pricing', changefreq: 'weekly' });
        }

        let blogUrls: SitemapEntry[] = [];
        if (websiteConfig.blog?.enable) {
          const posts = getSortedPosts();
          blogUrls = posts.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: 'weekly',
            lastmod: new Date(p.date).toISOString().slice(0, 10),
          }));
        }

        const sitemap = buildWorldCupSitemapXml({
          baseUrl: base,
          blogUrls,
          staticUrls,
        });

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });
      },
    },
  },
});
