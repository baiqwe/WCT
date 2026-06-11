# World Cup Page SEO Layout

## Public URL Strategy

- Use language folders, not country folders: `/en`, `/es`, `/pt`, `/fr`, `/de`, `/it`, `/nl`, `/ja`, `/ko`, `/zh`.
- Redirect country variants to the language canonical path, for example `/en-us/world-cup-simulator` to `/en/world-cup-simulator`.
- Every indexable page needs canonical, hreflang alternates, visible H1, descriptive intro copy, internal links, and structured data where appropriate.

## Tool Pages

| Page | Primary intent | Visible SEO layout | Schema |
| --- | --- | --- | --- |
| World Cup Simulator | world cup simulator / world cup 2026 simulator | Hero, full path composer, best-third-place table, page intent block, tool links, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |
| World Cup Predictor | world cup predictor | Hero, manual pick board, sharing block, page intent block, related tools, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |
| Bracket Predictor | world cup bracket predictor | Hero, full knockout route, round-by-round path, page intent block, related tools, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |
| Group Stage Simulator | world cup group stage simulator | Hero, 12 group score editor, standings, page intent block, related tools, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |
| Best Third-Place Calculator | best third place teams calculator | Hero, third-place ranking table, cutoff explanation, page intent block, related tools, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |
| Monte Carlo Simulator | world cup monte carlo simulator | Hero, probability bars, simulation inputs, page intent block, related tools, FAQ | SoftwareApplication, FAQPage, BreadcrumbList |

## Team Pages

| Page family | URL pattern | Visible SEO layout | Schema |
| --- | --- | --- | --- |
| Team path pages | `/[lang]/teams/[team]` | Team H1, group facts, opponents, route to final, group match cards, qualification scenarios, related tools, FAQ | SportsTeam, FAQPage, BreadcrumbList |

Team pages are now generated for all 48 teams in the current 2026 group data. Each page should be kept indexable only while it has real utility: group opponents, editable scores, qualification logic, and links into the simulator.

## Data Notes

- Current group data was updated on June 10, 2026 from public 2026 World Cup group references.
- Static tournament data now lives in `src/lib/world-cup-data.ts`: groups, teams, team profile facts, group-stage matches, dates, venues, qualification route, FIFA rank, and derived strength score.
- Odds should not be hard-coded because they change frequently. Keep an odds-provider adapter separate from the static data module and cache snapshots with a visible updated date.
- Squads, injuries, odds, and official live standings should be connected as dynamic data modules before launch content is finalized.
- When official match APIs are connected, team pages should add match-specific canonical sections such as `Brazil vs Morocco prediction` only when the match detail has enough unique content.

## Data Module Contract

| Module export | Purpose | Consumed by |
| --- | --- | --- |
| `worldCupGroups` | 12 groups and 48 teams | Tool pages, team pages, sitemap |
| `worldCupTeams` | Team facts, ranking, strength score | Team pages, probability view |
| `worldCupGroupStageMatches` | 72 group matches with date and venue | Score editor, team schedule cards |
| `getTeamMatches(team)` | Per-team schedule lookup | Team pages |
| `getTeamStrength(team)` | Deterministic strength input | Default scores, Monte Carlo preview |
