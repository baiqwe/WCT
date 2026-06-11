# World Cup Simulator Global Usability Audit

## Current Fixes

- Public multilingual paths now use language folders: `/en`, `/es`, `/pt`, `/fr`, `/de`, `/it`, `/nl`, `/ja`, `/ko`, `/zh`.
- Country-style legacy paths such as `/en-us/world-cup-simulator` redirect to the language canonical path.
- Core tool pages cover 10 public languages and 6 SEO landing intents: simulator, predictor, bracket, group stage, best third-place calculator, and Monte Carlo simulator.
- The group-stage tool now exposes all 12 groups and all 72 sample group matches instead of a partial preview.
- The predictor board now covers all 12 groups instead of only the first 6.
- The knockout path now renders a complete 32-team route through Round of 32, Round of 16, quarter-finals, semi-finals, and final.
- Team pages are available at `/[lang]/teams/[team]` for 48 teams, with localized metadata and page UI.
- Sitemap generation has been extracted into a testable function and validated for 60 tool URLs plus 480 team URLs.
- Static tournament data is connected through `src/lib/world-cup-data.ts`: groups, teams, qualification facts, FIFA rank, derived strength score, match dates, and group-stage venues where available.

## Verification

- `pnpm exec tsx scripts/validate-world-cup-locales.ts`
- `pnpm run build`
- Local route spot checks on `http://localhost:3001/`:
  - `/en/world-cup-simulator` returns 200.
  - `/en-us/world-cup-simulator` redirects to `/en/world-cup-simulator`.
  - `/zh/世界杯模拟器` returns 200.
  - `/en/teams/brazil` returns 200.

## Known Limits

- Squads, odds, injuries, and live standings still need dynamic provider adapters before launch content is finalized.
- Odds should remain dynamic and timestamped. Do not hard-code betting prices into SEO pages without an updated-at label and source attribution.
- Dynamic server endpoints such as `/sitemap.xml`, `/robots.txt`, and `/manifest.json` show inconsistent GET behavior in the local TanStack/Cloudflare dev adapter, even though the sitemap generator itself is validated and production build succeeds.
- Monte Carlo output is currently deterministic from seeded standings, not a true randomized simulation engine.
- Share links, private pools, saved predictions, and official tiebreaker edge cases still need persistent backend implementation.

## Team Page SEO Recommendation

Team pages are worth doing, but only if each page has enough unique utility. A good team page should include the team group, opponents, editable score scenarios, qualification routes for first/second/third place, likely Round of 32 lane, related tool links, FAQ, and SportsTeam/Breadcrumb schema. Thin static pages for every team should not be indexed unless real fixture data or useful simulator state is present.
