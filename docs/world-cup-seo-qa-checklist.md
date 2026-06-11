# World Cup Tool SEO QA Checklist

Date: 2026-06-10
Domain: https://worldcuptool.com

## Checked Items

- Helpful content: simulator pages now put the working tool first, with clear score inputs, ranking output, and focused group detail pages instead of generic text-only SEO pages.
- Basic SEO: localized titles, descriptions, canonical links, robots meta, sitemap entries, and hreflang alternates are present for core tool pages and group prediction pages.
- Trust pages: About, Privacy Policy, Terms, Cookie Policy, and Sitemap are linked from the footer.
- Breadcrumbs: JSON-LD breadcrumbs are present on localized tool pages and group pages. Group pages also include visible breadcrumb navigation.
- Favicon: public contains favicon.ico, 16x16, 32x32, apple-touch-icon 180x180, and Android 192/512 icons. Root head and manifest reference them.
- Canonical: `seo()` emits one canonical URL per page. Locale tool routes redirect non-canonical slugs to canonical localized paths.
- Robots: public pages use `index, follow, max-image-preview:large`; robots.txt allows public pages and blocks auth/dashboard/settings/admin/share/pool paths.
- Internal links: main tool pages link to related tools and all A-L group prediction pages; group pages link back to the simulator, the group-stage simulator, and all sibling group pages.

## Follow-Up Validation

- Submit `https://worldcuptool.com/sitemap.xml` in Google Search Console after deployment.
- Use URL Inspection for one representative tool page and one group page per language cluster.
- Watch GSC for duplicate-without-user-selected-canonical, alternate-page-with-proper-canonical, and discovered-currently-not-indexed patterns.
- After impressions arrive, split pages with weak CTR into title/description tests by intent: simulator, predictor, group score, and team page.
