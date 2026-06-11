# World Cup 2026 Tools Product and SEO Spec

Date: 2026-06-09

This spec turns the site into a tool-first SEO product. Every primary keyword has its own first-level locale page, and every page must expose a useful tool above the fold.

## SERP Takeaways

Current Google results show that the market is already moving from simple bracket pages to fuller prediction products:

- Competitors are ranking with full tournament prediction, XP, badges, private rooms, leaderboards, and shareable bracket flows.
- Search results contain dedicated pages for bracket predictor, group predictor, standings calculator, schedule guides, stadium guides, and full simulator hubs.
- Recent SERP snippets emphasize the 2026 format: 48 teams, 12 groups, Round of 32, best third-place teams, and match-by-match score prediction.
- The gap is not another static bracket page. The opportunity is a complete path composer: group scores -> standings -> best third-place ranking -> Round of 32 -> knockout scores -> champion -> share.

## Shared Product Architecture

All tools should use one shared state tree:

```ts
type TournamentPrediction = {
  locale: Locale;
  mode: 'manual' | 'quick' | 'hybrid' | 'monte-carlo';
  groups: GroupPrediction[];
  bestThirdTeams: RankedTeam[];
  bracket: KnockoutBracket;
  champion?: TeamId;
  picks?: UserPickMeta;
  share?: ShareMeta;
};

type GroupPrediction = {
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
  teams: TeamId[];
  matches: MatchPrediction[];
  standings: StandingRow[];
};

type MatchPrediction = {
  id: string;
  stage: 'group' | 'round32' | 'round16' | 'quarterfinal' | 'semifinal' | 'thirdPlace' | 'final';
  homeTeam: TeamId;
  awayTeam: TeamId;
  homeScore: number;
  awayScore: number;
  extraTime?: boolean;
  penalties?: { home: number; away: number };
  winner?: TeamId;
};
```

Shared engine modules:

- `group-engine`: calculates points, goal difference, goals for, ranking, and tiebreaker explanation.
- `third-place-engine`: ranks 12 third-place teams and marks the 8 qualifiers.
- `bracket-engine`: maps group rankings and best thirds into Round of 32 slots.
- `knockout-engine`: advances winners by score, extra time, or penalties.
- `share-engine`: serializes prediction state into a share URL or image.
- `monte-carlo-engine`: runs repeat simulations from team ratings and outputs probability tables.

## Page 1: World Cup Simulator

Route:

- `/en-us/world-cup-simulator`
- Localized equivalents for all 14 locales

SEO target:

- Primary: `world cup simulator`
- Secondary: `world cup 2026 simulator`, `fifa world cup simulator`, `world cup match simulator`, `world cup tournament simulator`
- Long-tail blocks: `simulate world cup from group stage to final`, `world cup simulator with scores`, `world cup 2026 full path simulator`

Search intent:

- User wants the whole tournament simulated, not only a bracket.

Above-fold tool:

- Full Path Composer
- Steps: Groups -> Best Third -> R32 -> R16 -> QF -> SF -> Final
- User can enter group scores and see live standings.
- Knockout path is generated from qualified teams.

Required UI modules:

- Mode switch: quick simulate, manual scores, hybrid picks.
- Group score editor for all 12 groups.
- Live qualification rail: top 2 and best thirds.
- Round path visualizer.
- Champion card.
- Share and reset controls.

Technical MVP:

- Generate all group matches from team groups.
- Calculate standings client-side.
- Rank best third-place teams.
- Build placeholder Round of 32 from qualifiers.
- Keep state in React first; later move to a reducer/store.

Future depth:

- Real fixture import after official data lock.
- Save prediction as compressed state.
- Generate Open Graph image from champion path.

## Page 2: World Cup Predictor

Route:

- `/en-us/world-cup-predictor`

SEO target:

- Primary: `world cup predictor`
- Secondary: `world cup 2026 predictor`, `world cup prediction game`, `world cup picks`, `world cup office pool`
- Long-tail blocks: `world cup score predictor`, `predict every world cup match`, `world cup predictor with friends`

Search intent:

- User wants to make personal picks, share them, and compare with friends.

Above-fold tool:

- Pick Board
- Manual group winner/ranking selections, confidence points, champion lock, and share action.

Required UI modules:

- Group rank pick board.
- Knockout winner pick flow.
- Scoreline picks for key matches.
- Confidence score per match.
- Upset picks marker.
- Share prediction card.
- Pool entry point.

Technical MVP:

- Separate `pick` state from score simulation state.
- Allow group winner selection for 12 groups.
- Generate pick summary and champion.
- Add share payload placeholder.

Future depth:

- Private pool leaderboard.
- Prediction scoring after live results.
- User accounts optional, anonymous share supported.

## Page 3: World Cup Bracket Predictor

Route:

- `/en-us/world-cup-bracket-predictor`

SEO target:

- Primary: `world cup bracket predictor`
- Secondary: `world cup 2026 bracket predictor`, `world cup bracket maker`, `world cup knockout bracket`, `round of 32 bracket`
- Long-tail blocks: `world cup bracket predictor with scores`, `world cup round of 32 bracket`, `world cup printable bracket predictor`

Search intent:

- User mainly wants the knockout bracket path and champion route.

Above-fold tool:

- Bracket Path Builder
- Starts with qualified teams, exposes R32/R16/QF/SF/Final path, and supports scoreline editing.

Required UI modules:

- Round navigation.
- Bracket slot source labels: `A1`, `B2`, `3C`.
- Match score editor for knockout games.
- Penalty winner selector.
- Team path highlighter.
- Export bracket image.

Technical MVP:

- Use qualified teams from shared state.
- Render rounds as progressive arrays.
- Add knockout score inputs later as a `KnockoutMatchEditor`.

Future depth:

- True FIFA slot mapping for best third-place combinations.
- Printable bracket PDF.
- Team path pages linked from each team chip.

## Page 4: World Cup Group Stage Simulator

Route:

- `/en-us/world-cup-group-stage-simulator`

SEO target:

- Primary: `world cup group stage simulator`
- Secondary: `world cup 2026 groups simulator`, `world cup standings calculator`, `world cup group predictor`, `world cup tiebreaker calculator`
- Long-tail blocks: `world cup group stage score calculator`, `world cup 2026 group standings calculator`, `world cup group stage tiebreakers`

Search intent:

- User wants group scores and standings.

Above-fold tool:

- Group Table Workspace
- Score inputs for group matches and live standings for selected groups.

Required UI modules:

- Group tabs A-L.
- Six match score inputs per group.
- Live table with P, W, D, L, GF, GA, GD, PTS.
- Tiebreaker explanation drawer.
- Qualification status labels.
- "Impact on bracket" summary.

Technical MVP:

- Calculate standings from match score state.
- Sort by points, goal difference, goals for, then team name.
- Show the top two and third-place row.

Future depth:

- Add complete FIFA tiebreaker ladder.
- Add head-to-head mini-table when needed.
- Support score reset and quick simulate per group.

## Page 5: Best Third-Place Calculator

Route:

- `/en-us/best-third-place-calculator`

SEO target:

- Primary: `best third place calculator`
- Secondary: `world cup best third-place teams`, `world cup 2026 third place calculator`, `world cup round of 32 qualification`
- Long-tail blocks: `which third place teams qualify world cup 2026`, `world cup 2026 best third teams calculator`, `third place standings world cup`

Search intent:

- User is confused by the 2026 format and wants the 8 third-place qualifiers.

Above-fold tool:

- Best Third-Place Ranking Table
- Takes third-place rows from all groups and ranks them globally.

Required UI modules:

- 12 third-place rows.
- Cutoff line after rank 8.
- PTS/GD/GF columns.
- Bubble explanation.
- Scenario helper: "one more goal changes what?"
- Bracket impact preview.

Technical MVP:

- Use third-ranked teams from group standings.
- Sort by points, goal difference, goals for.
- Mark top 8 as qualified.

Future depth:

- Add FIFA fair-play/drawing-of-lots final fallback.
- Add scenario delta controls.
- Link each qualifying third to its Round of 32 slot.

## Page 6: Monte Carlo World Cup Simulator

Route:

- `/en-us/monte-carlo-world-cup-simulator`

SEO target:

- Primary: `world cup monte carlo simulator`
- Secondary: `world cup probability simulator`, `world cup win probability`, `world cup odds simulator`, `world cup prediction model`
- Long-tail blocks: `world cup champion probability simulator`, `world cup team odds by round`, `world cup expected bracket path`

Search intent:

- User wants probabilities, not one personal bracket.

Above-fold tool:

- Probability Run Preview
- Shows simulated champion odds and round reach rates.

Required UI modules:

- Run count selector: 100, 1,000, 10,000.
- Team rating editor.
- Home advantage and form sliders.
- Champion probability chart.
- Round reach probability table.
- Most common final pairs.
- Dark horse list.

Technical MVP:

- Static probability preview based on qualified teams.
- Add rating inputs later.

Future depth:

- Elo or market-odds baseline.
- Web worker simulation.
- Persist simulation seeds for repeatable results.

## SEO Layout Rules for Every Tool Page

Each page must include:

- Unique title and description.
- One H1 matching the primary page intent.
- Tool above the fold before any long explanatory copy.
- One short explanatory paragraph under the H1.
- Internal links to the other five tools.
- FAQ with page-specific questions, not generic FAQ only.
- JSON-LD `SoftwareApplication`, `FAQPage`, and `BreadcrumbList`.
- Hreflang across all 14 locales.
- Canonical points to the exact localized slug.

Recommended on-page keyword placement:

- Title: primary keyword + strongest modifier.
- H1: primary keyword.
- Intro paragraph: primary + one secondary.
- Tool labels: use functional long tails naturally.
- H2 section 1: workflow phrase.
- H2 section 2: rule/explanation phrase.
- FAQ: question keywords and "how to" variants.
- Footer/internal links: exact tool names, not vague labels.

## Implementation Status

Completed in current MVP:

- 14-locale routing.
- 6 first-level SEO tool pages.
- Canonical, hreflang, x-default, sitemap, robots.
- Shared group score state.
- Client-side standings calculation.
- Best third-place ranking from standings.
- Distinct above-fold tools per page.
- Full path composer preview on the simulator page.

Next engineering tasks:

1. Extract tournament logic into `src/lib/world-cup-engine.ts`.
2. Add true knockout score state and penalty logic.
3. Replace placeholder Round of 32 mapping with official 2026 slot rules.
4. Add page-specific FAQ sets per route key and locale.
5. Add share URL serialization.
6. Add office pool and prediction scoring.
