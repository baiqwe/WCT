# World Cup 2026 Simulator SEO Build TODO

This document turns the site strategy into executable tasks. The main positioning is:

- Primary keyword: `world cup simulator`
- Secondary keyword: `world cup predictor`
- Product title pattern: `World Cup 2026 Simulator - Bracket Predictor & Group Stage Calculator`
- Product promise: simulate groups, calculate best third-place teams, generate the Round of 32 bracket, and share predictions.

## 0. Strategic Rules

- Build a tool-first site, not a blog-first site.
- Use `simulator` as the homepage and architecture umbrella.
- Use `predictor`, `bracket predictor`, `group stage simulator`, and `best third place calculator` as supporting tool pages.
- Every indexable page must have a visible useful tool or data component above the fold.
- Every locale must have unique title, description, H1, FAQ, canonical, and hreflang.
- Prediction-result share URLs should be `noindex`.
- Team and match pages should be indexable only when they contain unique localized content and real useful state.

## 1. Locale Plan

### 1.1 Required 14 Locale Targets

| Priority | Country/Region | Locale | Primary Local Keyword | Homepage Slug |
|---:|---|---|---|---|
| 1 | United States | `en-us` | world cup simulator | `/en-us/world-cup-simulator` |
| 2 | United Kingdom | `en-gb` | world cup simulator | `/en-gb/world-cup-simulator` |
| 3 | Canada | `en-ca` | world cup 2026 simulator | `/en-ca/world-cup-simulator` |
| 4 | Mexico | `es-mx` | simulador mundial 2026 | `/es-mx/simulador-mundial-2026` |
| 5 | Spain | `es-es` | simulador mundial 2026 | `/es-es/simulador-mundial-2026` |
| 6 | Brazil | `pt-br` | simulador copa do mundo 2026 | `/pt-br/simulador-copa-do-mundo-2026` |
| 7 | Portugal | `pt-pt` | simulador mundial 2026 | `/pt-pt/simulador-mundial-2026` |
| 8 | France | `fr-fr` | simulateur coupe du monde 2026 | `/fr-fr/simulateur-coupe-du-monde-2026` |
| 9 | Germany | `de-de` | wm 2026 simulator | `/de-de/wm-2026-simulator` |
| 10 | Italy | `it-it` | simulatore mondiali 2026 | `/it-it/simulatore-mondiali-2026` |
| 11 | Netherlands | `nl-nl` | wk 2026 simulator | `/nl-nl/wk-2026-simulator` |
| 12 | Japan | `ja-jp` | ワールドカップ 2026 シミュレーター | `/ja-jp/ワールドカップ-2026-シミュレーター` |
| 13 | South Korea | `ko-kr` | 월드컵 2026 시뮬레이터 | `/ko-kr/월드컵-2026-시뮬레이터` |
| 14 | China | `zh-cn` | 世界杯模拟器 | `/zh-cn/世界杯模拟器` |

### 1.2 Locale Implementation TODO

- [x] Create the 14 locale definitions in `src/lib/world-cup-content.ts`.
- [x] Create localized slug mapping in `src/lib/world-cup-content.ts`.
- [x] Generate hreflang alternate links for every core page.
- [x] Replace current `en/zh/es` temporary locale model with the 14 target locales.
- [x] Add locale-aware `<html lang>` mapping:
  - `en-US`, `en-GB`, `en-CA`
  - `es-MX`, `es-ES`
  - `pt-BR`, `pt-PT`
  - `fr-FR`, `de-DE`, `it-IT`, `nl-NL`
  - `ja-JP`, `ko-KR`, `zh-CN`
- [ ] Add localized nav labels for all 14 locales.
- [ ] Add localized footer labels for all 14 locales.
- [x] Add `x-default` to `/en-us/world-cup-simulator`.
- [x] Redirect `/` to `/en-us/world-cup-simulator` or make `/` a locale selector with `noindex`.

## 2. Core Page Matrix

Each locale needs the same page types. Slugs should be localized where natural, while preserving a stable internal route key.

### 2.1 Page Types

| Route Key | Intent | Template | Index? |
|---|---|---|---|
| `home` | main simulator | Full simulator landing | Yes |
| `predictor` | manual picks | Predictor tool page | Yes |
| `bracket` | bracket making | Bracket predictor page | Yes |
| `group-stage` | group standings | Group simulator page | Yes |
| `third-place` | best third teams | Calculator page | Yes |
| `monte-carlo` | probabilities | Monte Carlo simulator | Yes |
| `teams/[team]` | team path | Team path simulator | Yes |
| `matches/[match]` | match prediction | Match prediction page | Yes after fixtures are stable |
| `share/[id]` | user share result | Shared bracket result | Noindex |
| `pool/[id]` | private pools | Office pool page | Noindex unless public |

### 2.2 Build Order

- [x] Phase 1: home, predictor, bracket, group-stage, third-place.
- [ ] Phase 2: monte-carlo, teams.
- [ ] Phase 3: matches, share, pool.
- [ ] Phase 4: live scoring and post-match updates.

## 3. Page SEO Designs

### 3.1 Homepage: World Cup 2026 Simulator

Target route:

- `/en-us/world-cup-simulator`
- localized equivalent for all 14 locales

SEO:

- Primary keyword: `world cup simulator`
- Secondary keywords:
  - `world cup 2026 simulator`
  - `world cup predictor`
  - `world cup bracket predictor`
  - `world cup group stage simulator`
- Search intent: user wants to simulate the tournament and understand likely paths.
- Title:
  - `World Cup 2026 Simulator - Bracket Predictor & Group Stage Calculator`
- Meta description:
  - `Simulate the World Cup 2026 tournament, rank every group, calculate the best third-place teams, generate the Round of 32 bracket, and share your prediction.`
- H1:
  - `World Cup 2026 Simulator`
- Above-fold tool:
  - Quick simulator with group winners and champion path.
- Required sections:
  - Hero simulator
  - 12 groups overview
  - Best third-place calculator teaser
  - Round of 32 bracket preview
  - Country/team path entry points
  - FAQ
- Schema:
  - `SoftwareApplication`
  - `FAQPage`
  - `BreadcrumbList`
- Internal links:
  - bracket page
  - group-stage page
  - third-place page
  - Monte Carlo page
  - top 12 team pages

Tasks:

- [x] Rename current product metadata from predictor-first to simulator-first.
- [x] Update homepage H1 and hero copy.
- [x] Add simulator-first title and description for all locales.
- [ ] Add a localized FAQ block with 4 questions per locale.
- [x] Add visible links to the five core tool pages.
- [x] Add locale-aware SoftwareApplication schema.
- [x] Add hreflang for all 14 locales.

### 3.2 Predictor Page: World Cup 2026 Predictor

Target route:

- `/en-us/world-cup-predictor`

SEO:

- Primary keyword: `world cup predictor`
- Secondary keywords:
  - `world cup 2026 predictor`
  - `world cup prediction game`
  - `world cup picks`
  - `world cup office pool`
- Search intent: user wants to make picks and share/compete.
- Title:
  - `World Cup 2026 Predictor - Make Your Picks & Share Your Bracket`
- Meta description:
  - `Create your World Cup 2026 prediction, pick every group and knockout winner, save your champion, and share your picks with friends.`
- H1:
  - `World Cup 2026 Predictor`
- Above-fold tool:
  - Pick mode with group rankings and knockout winners.
- Required sections:
  - Manual pick flow
  - Quick-pick mode
  - Full bracket mode
  - Share result
  - Office pool CTA
  - FAQ
- Schema:
  - `SoftwareApplication`
  - `FAQPage`
- Internal links:
  - homepage simulator
  - bracket page
  - office pool section
  - share result docs

Tasks:

- [x] Create predictor route and page component.
- [x] Reuse simulator state engine.
- [ ] Add quick-pick mode.
- [ ] Add share URL generation.
- [ ] Add localized predictor SEO copy for 14 locales.
- [ ] Add `noindex` for generated individual result pages.

### 3.3 Bracket Page: World Cup 2026 Bracket Predictor

Target route:

- `/en-us/world-cup-bracket-predictor`

SEO:

- Primary keyword: `world cup bracket predictor`
- Secondary keywords:
  - `world cup 2026 bracket predictor`
  - `world cup bracket maker`
  - `world cup knockout bracket`
  - `round of 32 bracket`
- Search intent: user wants a bracket visual and winner path.
- Title:
  - `World Cup 2026 Bracket Predictor - Build the Round of 32 Bracket`
- Meta description:
  - `Build a World Cup 2026 bracket from the group stage to the final, including Round of 32 paths and best third-place qualifiers.`
- H1:
  - `World Cup 2026 Bracket Predictor`
- Above-fold tool:
  - Empty/generated bracket with clickable winners.
- Required sections:
  - Round of 32
  - Round of 16
  - Quarter-finals
  - Semi-finals
  - Final
  - Download/share bracket
- Schema:
  - `SoftwareApplication`
  - `FAQPage`
- Internal links:
  - third-place calculator
  - group-stage simulator
  - printable bracket

Tasks:

- [ ] Create bracket route and page component.
- [ ] Build bracket data model for R32 to final.
- [ ] Add clickable winner selection.
- [ ] Add responsive bracket layout.
- [ ] Add share image placeholder task.
- [ ] Add localized bracket SEO copy for 14 locales.

### 3.4 Group Stage Page: World Cup 2026 Group Stage Simulator

Target route:

- `/en-us/world-cup-group-stage-simulator`

SEO:

- Primary keyword: `world cup group stage simulator`
- Secondary keywords:
  - `world cup 2026 groups simulator`
  - `world cup group predictor`
  - `world cup standings calculator`
  - `world cup tiebreaker calculator`
- Search intent: user wants group rankings and qualification outcomes.
- Title:
  - `World Cup 2026 Group Stage Simulator - Calculate Standings & Qualifiers`
- Meta description:
  - `Simulate all 12 World Cup 2026 groups, enter scores or rankings, calculate standings, tiebreakers, and teams that qualify for the Round of 32.`
- H1:
  - `World Cup 2026 Group Stage Simulator`
- Above-fold tool:
  - Group selector with standings table.
- Required sections:
  - 12 group tables
  - score mode
  - ranking mode
  - tiebreaker explanation
  - qualification output
- Schema:
  - `SoftwareApplication`
  - `FAQPage`
  - optional `Table` markup in rendered HTML
- Internal links:
  - third-place calculator
  - bracket predictor

Tasks:

- [ ] Create group-stage route.
- [ ] Build group standings data model.
- [ ] Add score input mode.
- [ ] Add ranking drag/drop or simple move controls.
- [ ] Implement FIFA tiebreaker order.
- [ ] Add localized group-stage SEO copy for 14 locales.

### 3.5 Third-Place Page: Best Third-Place Teams Calculator

Target route:

- `/en-us/best-third-place-calculator`

SEO:

- Primary keyword: `best third place teams calculator`
- Secondary keywords:
  - `world cup third place calculator`
  - `world cup 2026 best third place teams`
  - `world cup round of 32 qualification`
  - `best 3rd place teams world cup`
- Search intent: user wants to understand which third-place teams qualify.
- Title:
  - `Best Third-Place Teams Calculator - World Cup 2026 Round of 32`
- Meta description:
  - `Calculate the eight best third-place teams at World Cup 2026 and see how they enter the Round of 32 bracket.`
- H1:
  - `Best Third-Place Teams Calculator`
- Above-fold tool:
  - Ranked third-place table.
- Required sections:
  - third-place table
  - qualification rules
  - tie-breaker rules
  - bracket slot mapping
  - examples
- Schema:
  - `SoftwareApplication`
  - `FAQPage`
- Internal links:
  - group-stage simulator
  - bracket predictor
  - FIFA format explainer

Tasks:

- [ ] Create third-place route.
- [ ] Build best-third ranking algorithm.
- [ ] Add points, goal difference, goals scored, fair play placeholder.
- [ ] Add 495 combination mapping task for Annex C bracket paths.
- [ ] Add localized third-place SEO copy for 14 locales.
- [ ] Add examples for three realistic scenarios.

### 3.6 Monte Carlo Page: World Cup 2026 Monte Carlo Simulator

Target route:

- `/en-us/monte-carlo-world-cup-simulator`

SEO:

- Primary keyword: `world cup monte carlo simulator`
- Secondary keywords:
  - `world cup probability simulator`
  - `world cup 2026 odds simulator`
  - `world cup win probability`
  - `world cup elo simulator`
- Search intent: user wants probabilities, not one manual bracket.
- Title:
  - `World Cup 2026 Monte Carlo Simulator - Run Tournament Probabilities`
- Meta description:
  - `Run thousands of World Cup 2026 simulations using team strength ratings and see each team's probability of reaching every round.`
- H1:
  - `World Cup 2026 Monte Carlo Simulator`
- Above-fold tool:
  - Simulation controls and probability table.
- Required sections:
  - ranking source selector
  - simulation count selector
  - probability table
  - methodology
  - limitations
- Schema:
  - `SoftwareApplication`
  - `Dataset` if probability outputs are published
  - `FAQPage`
- Internal links:
  - team path pages
  - simulator homepage

Tasks:

- [ ] Create Monte Carlo route.
- [ ] Add team rating data source interface.
- [ ] Implement deterministic seeded simulations.
- [ ] Add simulation count presets.
- [ ] Add probability table by round.
- [ ] Add localized Monte Carlo SEO copy for 14 locales.

### 3.7 Team Path Pages

Target route pattern:

- `/en-us/teams/argentina-world-cup-path`
- `/en-us/teams/usa-world-cup-path`

SEO:

- Primary keyword pattern:
  - `{team} world cup path`
  - `{team} world cup 2026 prediction`
  - `{team} world cup bracket path`
- Search intent: user wants one nation's possible route.
- Title pattern:
  - `{Team} World Cup 2026 Path - Group, Knockout Route & Prediction`
- Meta description pattern:
  - `See {Team}'s possible World Cup 2026 path, group-stage scenarios, Round of 32 opponents, knockout bracket routes, and champion probability.`
- H1 pattern:
  - `{Team} World Cup 2026 Path`
- Above-fold tool:
  - Team path card and possible knockout opponents.
- Required sections:
  - group fixtures
  - finish 1st/2nd/3rd scenarios
  - possible R32 opponents
  - route to final
  - probability snapshot
  - related teams
- Schema:
  - `SportsTeam`
  - `BreadcrumbList`
  - `FAQPage`
- Internal links:
  - group page
  - bracket page
  - match pages involving the team

Tasks:

- [ ] Create team route template.
- [ ] Create team dataset with localized names.
- [ ] Generate top 48 team pages per locale.
- [ ] Add unique intro text per team and locale.
- [ ] Add team-specific path simulator state.
- [ ] Add canonical and hreflang for every team page.
- [ ] Add `noindex` guard for teams without enough unique data.

### 3.8 Match Prediction Pages

Target route pattern:

- `/en-us/matches/usa-vs-paraguay-prediction`

SEO:

- Primary keyword pattern:
  - `{team a} vs {team b} prediction`
  - `{team a} vs {team b} world cup 2026`
- Search intent: user wants matchup prediction, odds context, kickoff details.
- Title pattern:
  - `{Team A} vs {Team B} Prediction - World Cup 2026 Match Simulator`
- Meta description pattern:
  - `Preview {Team A} vs {Team B} at World Cup 2026 with match simulation, team strength, predicted score, and group-stage impact.`
- H1 pattern:
  - `{Team A} vs {Team B} Prediction`
- Above-fold tool:
  - Match simulator card.
- Required sections:
  - kickoff time and venue
  - predicted score
  - win/draw/loss probabilities
  - group table impact
  - head-to-head if available
  - related matches
- Schema:
  - `SportsEvent`
  - `FAQPage`
  - `BreadcrumbList`
- Internal links:
  - both team pages
  - group page
  - simulator homepage

Tasks:

- [ ] Create match route template.
- [ ] Add fixtures data source.
- [ ] Generate match slugs.
- [ ] Add match simulator component.
- [ ] Add `SportsEvent` schema.
- [ ] Publish only confirmed fixtures.
- [ ] Add `lastmod` updates as scores and odds change.

### 3.9 Share Result Pages

Target route pattern:

- `/share/[id]`

SEO:

- Indexing: `noindex, follow`
- Purpose: viral sharing, not organic landing.
- Title pattern:
  - `{User}'s World Cup 2026 Bracket Prediction`
- Required metadata:
  - Open Graph image
  - Twitter card image
  - canonical to main simulator

Tasks:

- [ ] Create share route.
- [ ] Add serialized prediction state.
- [ ] Add `noindex`.
- [ ] Add OG image generation.
- [ ] Add CTA back to simulator.

### 3.10 Office Pool Pages

Target route pattern:

- `/pool/[id]`

SEO:

- Private pools: `noindex`
- Public landing page: indexable at `/world-cup-office-pool`
- Primary keyword:
  - `world cup office pool`
  - `world cup pick em`
- Title for public page:
  - `World Cup 2026 Office Pool - Create a Private Prediction Game`
- Meta description:
  - `Create a private World Cup 2026 office pool, invite friends or coworkers, compare brackets, and track scores through the tournament.`

Tasks:

- [ ] Create public office pool landing page.
- [ ] Create private pool route with `noindex`.
- [ ] Add invite links.
- [ ] Add leaderboard model.
- [ ] Add scoring rules page.

## 4. Technical SEO TODO

- [x] Generate XML sitemap per locale.
- [x] Include only indexable canonical pages in sitemap.
- [ ] Add `lastmod` for team and match pages.
- [x] Generate hreflang alternates for every locale variant.
- [x] Add robots rules:
  - allow core pages
  - disallow or noindex share pages
  - noindex private pools
- [x] Add canonical URL builder with locale support.
- [x] Add metadata builder per route key.
- [x] Add core page schema builders:
  - `SoftwareApplication`
  - `FAQPage`
  - `BreadcrumbList`
- [ ] Add team and match schema builders:
  - `SportsTeam`
  - `SportsEvent`
- [ ] Add Open Graph image templates:
  - homepage
  - bracket
  - team path
  - match prediction
- [ ] Add JSON-LD validation step to QA checklist.
- [ ] Add page-level word count checks for indexable pages.

## 5. Product Engine TODO

### 5.1 Tournament Data

- [ ] Create `src/lib/world-cup/data/teams.ts`.
- [ ] Create `src/lib/world-cup/data/groups.ts`.
- [ ] Create `src/lib/world-cup/data/fixtures.ts`.
- [ ] Create `src/lib/world-cup/data/venues.ts`.
- [ ] Create `src/lib/world-cup/data/localized-team-names.ts`.
- [ ] Add data update notes and source timestamps.

### 5.2 Group Simulation

- [ ] Implement ranking mode.
- [ ] Implement score mode.
- [ ] Calculate points.
- [ ] Calculate goal difference.
- [ ] Calculate goals scored.
- [ ] Add fair-play placeholder.
- [ ] Add drawing-of-lots fallback placeholder.
- [ ] Return qualified teams.

### 5.3 Best Third-Place Logic

- [ ] Extract third-placed team from each group.
- [ ] Sort by points, goal difference, goals scored, fair play.
- [ ] Select top 8.
- [ ] Mark bottom 4 as eliminated.
- [ ] Display rank movement after edits.
- [ ] Add scenario examples.

### 5.4 Knockout Bracket Logic

- [ ] Implement static slots for group winners and runners-up.
- [ ] Implement third-place assignment mapping.
- [ ] Add Annex C / 495 combination mapping.
- [ ] Generate Round of 32.
- [ ] Advance winners through all rounds.
- [ ] Store bracket state in URL.

### 5.5 Monte Carlo Logic

- [ ] Add team strength model.
- [ ] Add Elo/FIFA ranking weighting.
- [ ] Add random seed.
- [ ] Add simulation loop.
- [ ] Aggregate round probabilities.
- [ ] Add browser performance budget.
- [ ] Add web worker if simulations block UI.

## 6. Content TODO

- [ ] Write localized homepage FAQ for 14 locales.
- [ ] Write localized format explainer for 14 locales.
- [ ] Write third-place rule explainer for 14 locales.
- [ ] Write tiebreaker explainer for 14 locales.
- [ ] Write scoring rules for predictor/pool.
- [ ] Write methodology page for Monte Carlo.
- [ ] Write disclaimers:
  - independent fan tool
  - not affiliated with FIFA
  - predictions are informational

## 7. Internal Linking TODO

- [ ] Homepage links to all core tool pages.
- [ ] Each tool page links back to homepage.
- [ ] Group-stage page links to third-place and bracket pages.
- [ ] Third-place page links to group-stage and bracket pages.
- [ ] Team pages link to group page and match pages.
- [ ] Match pages link to team pages.
- [ ] Footer links to core tools and locale selector.
- [ ] Add related country/team cards on locale homepages.

## 8. Launch Sequence

### 8.1 MVP Launch

- [ ] Ship `/en-us/world-cup-simulator`.
- [ ] Ship `/en-us/world-cup-predictor`.
- [ ] Ship `/en-us/world-cup-bracket-predictor`.
- [ ] Ship `/en-us/world-cup-group-stage-simulator`.
- [ ] Ship `/en-us/best-third-place-calculator`.
- [ ] Add sitemap and robots.
- [ ] Submit to Google Search Console.

### 8.2 Multilingual Expansion

- [ ] Add 13 additional locales.
- [ ] Translate metadata and UI.
- [ ] Add hreflang.
- [ ] Add localized slugs.
- [ ] Add localized sitemap entries.
- [ ] Validate no hreflang return-tag errors.

### 8.3 Long-Tail Expansion

- [ ] Generate team path pages for 48 teams.
- [ ] Generate match pages for confirmed fixtures.
- [ ] Generate team comparison pages if search demand appears.
- [ ] Add related pages modules.

### 8.4 Viral/Product Expansion

- [ ] Add share image export.
- [ ] Add share URL.
- [ ] Add office pool creation.
- [ ] Add leaderboard.
- [ ] Add prediction scoring.

## 9. QA Checklist

- [ ] Every indexable page has exactly one H1.
- [ ] Every indexable page has localized title under 60 characters where possible.
- [ ] Every indexable page has localized description under 155 characters where possible.
- [ ] Every locale page has canonical to itself.
- [ ] Every locale page has hreflang alternates to all 14 locales.
- [ ] `x-default` points to `en-us`.
- [ ] No share page appears in sitemap.
- [ ] No private pool page appears in sitemap.
- [ ] Home and core tool pages render useful content server-side.
- [ ] Mobile layout has no horizontal overflow.
- [ ] Bracket remains usable on mobile.
- [ ] Structured data validates.
- [ ] Core Web Vitals are acceptable on mobile.
- [ ] JavaScript-disabled fallback includes intro, FAQ, and links.

## 10. Recommended Next Engineering Task Order

1. [x] Rename current site from predictor-first to simulator-first.
2. [x] Replace temporary locale model with 14 locale registry.
3. [x] Implement localized slug routing.
4. [x] Implement metadata and hreflang builders.
5. [x] Create core route templates.
6. [x] Extract current homepage simulator UI into reusable tool components.
7. [ ] Build group-stage engine.
8. [ ] Build third-place calculator.
9. [ ] Build knockout bracket generator.
10. [x] Generate sitemap.
11. [x] Add 14 locale homepages.
12. [x] Add 5 core tool pages for `en-us`.
13. [ ] Localize 5 core tool pages to all 14 locales.
14. [ ] Add 48 team path pages.
15. [ ] Add match prediction pages.
16. [ ] Add share result pages with `noindex`.
17. [ ] Add office pool public landing and private pages.
18. [ ] Add Monte Carlo page.
19. [ ] Add OG image generation.
20. [ ] Run full SEO QA.
