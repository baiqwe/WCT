export type WorldCupGroupId =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L';

export type WorldCupTeam = {
  bestFinish: string;
  confederation: string;
  fifaRank: number;
  group: WorldCupGroupId;
  name: string;
  qualification: string;
  seed: number;
  slug: string;
  strength: number;
};

export type WorldCupGroup = {
  group: WorldCupGroupId;
  teams: readonly [string, string, string, string];
};

export type WorldCupMatch = {
  away: string;
  awayScore?: number;
  date: string;
  group: WorldCupGroupId;
  home: string;
  homeScore?: number;
  id: string;
  matchday: 1 | 2 | 3;
  source?: string;
  status?: 'scheduled' | 'live' | 'finished';
  time?: string;
  venue: string;
};

export const worldCupGroups = [
  { group: 'A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czechia'] },
  { group: 'B', teams: ['Canada', 'Qatar', 'Switzerland', 'Bosnia-Herzegovina'] },
  { group: 'C', teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { group: 'D', teams: ['United States', 'Paraguay', 'Australia', 'Turkey'] },
  { group: 'E', teams: ['Germany', 'Curacao', 'Ivory Coast', 'Ecuador'] },
  { group: 'F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { group: 'G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  { group: 'H', teams: ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'] },
  { group: 'I', teams: ['France', 'Senegal', 'Iraq', 'Norway'] },
  { group: 'J', teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { group: 'K', teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'] },
  { group: 'L', teams: ['England', 'Croatia', 'Ghana', 'Panama'] },
] as const satisfies readonly WorldCupGroup[];

const teamFacts: Record<
  string,
  Omit<WorldCupTeam, 'group' | 'name' | 'seed' | 'slug' | 'strength'>
> = {
  Algeria: { confederation: 'CAF', fifaRank: 35, bestFinish: 'Round of 16', qualification: 'CAF Group G winner' },
  Argentina: { confederation: 'CONMEBOL', fifaRank: 2, bestFinish: 'Winners', qualification: 'CONMEBOL winner' },
  Australia: { confederation: 'AFC', fifaRank: 26, bestFinish: 'Round of 16', qualification: 'AFC runner-up' },
  Austria: { confederation: 'UEFA', fifaRank: 24, bestFinish: 'Third place', qualification: 'UEFA Group H winner' },
  Belgium: { confederation: 'UEFA', fifaRank: 8, bestFinish: 'Third place', qualification: 'UEFA Group J winner' },
  'Bosnia-Herzegovina': { confederation: 'UEFA', fifaRank: 63, bestFinish: 'Group stage', qualification: 'UEFA play-off winner' },
  Brazil: { confederation: 'CONMEBOL', fifaRank: 5, bestFinish: 'Winners', qualification: 'CONMEBOL fifth place' },
  Canada: { confederation: 'CONCACAF', fifaRank: 31, bestFinish: 'Group stage', qualification: 'Co-host' },
  'Cape Verde': { confederation: 'CAF', fifaRank: 68, bestFinish: 'Debut', qualification: 'CAF Group D winner' },
  Colombia: { confederation: 'CONMEBOL', fifaRank: 13, bestFinish: 'Quarter-finals', qualification: 'CONMEBOL third place' },
  Curacao: { confederation: 'CONCACAF', fifaRank: 82, bestFinish: 'Debut', qualification: 'CONCACAF Group B winner' },
  Czechia: { confederation: 'UEFA', fifaRank: 44, bestFinish: 'Runners-up', qualification: 'UEFA play-off winner' },
  'DR Congo': { confederation: 'CAF', fifaRank: 56, bestFinish: 'Group stage', qualification: 'Inter-confederation play-off winner' },
  Ecuador: { confederation: 'CONMEBOL', fifaRank: 23, bestFinish: 'Round of 16', qualification: 'CONMEBOL runner-up' },
  Egypt: { confederation: 'CAF', fifaRank: 34, bestFinish: 'Group stage', qualification: 'CAF Group A winner' },
  England: { confederation: 'UEFA', fifaRank: 4, bestFinish: 'Winners', qualification: 'UEFA Group K winner' },
  France: { confederation: 'UEFA', fifaRank: 3, bestFinish: 'Winners', qualification: 'UEFA Group D winner' },
  Germany: { confederation: 'UEFA', fifaRank: 9, bestFinish: 'Winners', qualification: 'UEFA Group A winner' },
  Ghana: { confederation: 'CAF', fifaRank: 66, bestFinish: 'Quarter-finals', qualification: 'CAF Group I winner' },
  Haiti: { confederation: 'CONCACAF', fifaRank: 84, bestFinish: 'Group stage', qualification: 'CONCACAF Group C winner' },
  Iran: { confederation: 'AFC', fifaRank: 20, bestFinish: 'Group stage', qualification: 'AFC Group A winner' },
  Iraq: { confederation: 'AFC', fifaRank: 58, bestFinish: 'Group stage', qualification: 'Inter-confederation play-off winner' },
  'Ivory Coast': { confederation: 'CAF', fifaRank: 42, bestFinish: 'Group stage', qualification: 'CAF Group F winner' },
  Japan: { confederation: 'AFC', fifaRank: 18, bestFinish: 'Round of 16', qualification: 'AFC Group C winner' },
  Jordan: { confederation: 'AFC', fifaRank: 62, bestFinish: 'Debut', qualification: 'AFC Group B runner-up' },
  Mexico: { confederation: 'CONCACAF', fifaRank: 15, bestFinish: 'Quarter-finals', qualification: 'Co-host' },
  Morocco: { confederation: 'CAF', fifaRank: 11, bestFinish: 'Fourth place', qualification: 'CAF Group E winner' },
  Netherlands: { confederation: 'UEFA', fifaRank: 7, bestFinish: 'Runners-up', qualification: 'UEFA Group G winner' },
  'New Zealand': { confederation: 'OFC', fifaRank: 86, bestFinish: 'Group stage', qualification: 'OFC winner' },
  Norway: { confederation: 'UEFA', fifaRank: 33, bestFinish: 'Round of 16', qualification: 'UEFA Group I winner' },
  Panama: { confederation: 'CONCACAF', fifaRank: 30, bestFinish: 'Group stage', qualification: 'CONCACAF Group A winner' },
  Paraguay: { confederation: 'CONMEBOL', fifaRank: 39, bestFinish: 'Quarter-finals', qualification: 'CONMEBOL sixth place' },
  Portugal: { confederation: 'UEFA', fifaRank: 6, bestFinish: 'Third place', qualification: 'UEFA Group F winner' },
  Qatar: { confederation: 'AFC', fifaRank: 53, bestFinish: 'Group stage', qualification: 'AFC fourth round winner' },
  'Saudi Arabia': { confederation: 'AFC', fifaRank: 59, bestFinish: 'Round of 16', qualification: 'AFC fourth round winner' },
  Scotland: { confederation: 'UEFA', fifaRank: 36, bestFinish: 'Group stage', qualification: 'UEFA Group C winner' },
  Senegal: { confederation: 'CAF', fifaRank: 19, bestFinish: 'Quarter-finals', qualification: 'CAF Group B winner' },
  'South Africa': { confederation: 'CAF', fifaRank: 61, bestFinish: 'Group stage', qualification: 'CAF Group C winner' },
  'South Korea': { confederation: 'AFC', fifaRank: 22, bestFinish: 'Fourth place', qualification: 'AFC Group B winner' },
  Spain: { confederation: 'UEFA', fifaRank: 1, bestFinish: 'Winners', qualification: 'UEFA Group E winner' },
  Sweden: { confederation: 'UEFA', fifaRank: 43, bestFinish: 'Runners-up', qualification: 'UEFA play-off winner' },
  Switzerland: { confederation: 'UEFA', fifaRank: 16, bestFinish: 'Quarter-finals', qualification: 'UEFA Group B winner' },
  Tunisia: { confederation: 'CAF', fifaRank: 40, bestFinish: 'Group stage', qualification: 'CAF Group H winner' },
  Turkey: { confederation: 'UEFA', fifaRank: 25, bestFinish: 'Third place', qualification: 'UEFA play-off winner' },
  'United States': { confederation: 'CONCACAF', fifaRank: 14, bestFinish: 'Third place', qualification: 'Co-host' },
  Uruguay: { confederation: 'CONMEBOL', fifaRank: 17, bestFinish: 'Winners', qualification: 'CONMEBOL fourth place' },
  Uzbekistan: { confederation: 'AFC', fifaRank: 55, bestFinish: 'Debut', qualification: 'AFC runner-up' },
};

export const worldCupTeams: WorldCupTeam[] = worldCupGroups.flatMap((group) =>
  group.teams.map((team, index) => {
    const facts = teamFacts[team];
    const fifaRank = facts?.fifaRank ?? 75;
    return {
      bestFinish: facts?.bestFinish ?? 'To be confirmed',
      confederation: facts?.confederation ?? 'TBD',
      fifaRank,
      group: group.group,
      name: team,
      qualification: facts?.qualification ?? 'Qualified',
      seed: index + 1,
      slug: slugifyTeam(team),
      strength: rankToStrength(fifaRank),
    };
  })
);

export const worldCupGroupStageMatches: WorldCupMatch[] = [
  match('A-1', 'A', 1, 'Mexico', 'South Africa', '2026-06-11', 'Mexico City Stadium', 'finished', 2, 0, 'https://www.theguardian.com/football/2026/jun/11/mexico-south-africa-world-cup-2026'),
  match('A-2', 'A', 1, 'South Korea', 'Czechia', '2026-06-11', 'Estadio Guadalajara'),
  match('A-3', 'A', 2, 'Czechia', 'South Africa', '2026-06-18', 'Atlanta Stadium'),
  match('A-4', 'A', 2, 'Mexico', 'South Korea', '2026-06-18', 'Estadio Guadalajara'),
  match('A-5', 'A', 3, 'Czechia', 'Mexico', '2026-06-24', 'Mexico City Stadium'),
  match('A-6', 'A', 3, 'South Africa', 'South Korea', '2026-06-24', 'Estadio Monterrey'),

  match('B-1', 'B', 1, 'Canada', 'Bosnia-Herzegovina', '2026-06-12', 'Toronto Stadium'),
  match('B-2', 'B', 1, 'Qatar', 'Switzerland', '2026-06-13', 'San Francisco Bay Area Stadium'),
  match('B-3', 'B', 2, 'Switzerland', 'Bosnia-Herzegovina', '2026-06-18', 'Los Angeles Stadium'),
  match('B-4', 'B', 2, 'Canada', 'Qatar', '2026-06-18', 'BC Place Vancouver'),
  match('B-5', 'B', 3, 'Switzerland', 'Canada', '2026-06-24', 'BC Place Vancouver'),
  match('B-6', 'B', 3, 'Bosnia-Herzegovina', 'Qatar', '2026-06-24', 'Seattle Stadium'),

  match('C-1', 'C', 1, 'Haiti', 'Scotland', '2026-06-13', 'Boston Stadium', 'finished', 0, 1, 'https://www.theguardian.com/football/2026/jun/14/scotland-entend-unbeaten-world-cup-run-27-years-11-months-19-days-football-daily'),
  match('C-2', 'C', 1, 'Brazil', 'Morocco', '2026-06-13', 'New York New Jersey Stadium', 'finished', 1, 1, 'https://www.theguardian.com/football/live/2026/jun/13/brazil-v-morocco-world-cup-2026-live'),
  match('C-3', 'C', 2, 'Brazil', 'Haiti', '2026-06-19', 'Philadelphia Stadium'),
  match('C-4', 'C', 2, 'Scotland', 'Morocco', '2026-06-19', 'Boston Stadium'),
  match('C-5', 'C', 3, 'Scotland', 'Brazil', '2026-06-24', 'Miami Stadium'),
  match('C-6', 'C', 3, 'Morocco', 'Haiti', '2026-06-24', 'Atlanta Stadium'),

  match('D-1', 'D', 1, 'United States', 'Paraguay', '2026-06-12', 'Los Angeles Stadium', 'finished', 4, 1, 'https://www.theguardian.com/football/live/2026/jun/12/usa-v-paraguay-world-cup-2026-live'),
  match('D-2', 'D', 1, 'Australia', 'Turkey', '2026-06-13', 'BC Place Vancouver', 'finished', 0, 2, 'https://www.theguardian.com/football/live/2026/jun/14/world-cup-2026-news-scotland-react-to-first-world-cup-victory-in-36-years-as-australia-beat-turkey'),
  match('D-3', 'D', 2, 'Turkey', 'Paraguay', '2026-06-19', 'San Francisco Bay Area Stadium'),
  match('D-4', 'D', 2, 'United States', 'Australia', '2026-06-19', 'Seattle Stadium'),
  match('D-5', 'D', 3, 'Turkey', 'United States', '2026-06-25', 'Los Angeles Stadium'),
  match('D-6', 'D', 3, 'Paraguay', 'Australia', '2026-06-25', 'San Francisco Bay Area Stadium'),

  match('E-1', 'E', 1, 'Ivory Coast', 'Ecuador', '2026-06-14', 'Philadelphia Stadium', 'finished', 1, 0, 'https://www.theguardian.com/football/live/2026/jun/14/cote-d-ivoire-v-ecuador-world-cup-2026-live'),
  match('E-2', 'E', 1, 'Germany', 'Curacao', '2026-06-14', 'Houston Stadium', 'finished', 7, 1, 'https://www.theguardian.com/football/live/2026/jun/14/germany-v-curacao-world-cup-2026-live'),
  match('E-3', 'E', 2, 'Germany', 'Ivory Coast', '2026-06-20', 'Toronto Stadium'),
  match('E-4', 'E', 2, 'Ecuador', 'Curacao', '2026-06-20', 'Kansas City Stadium'),
  match('E-5', 'E', 3, 'Curacao', 'Ivory Coast', '2026-06-25', 'Philadelphia Stadium'),
  match('E-6', 'E', 3, 'Ecuador', 'Germany', '2026-06-25', 'New York New Jersey Stadium'),

  match('F-1', 'F', 1, 'Netherlands', 'Japan', '2026-06-14', 'Dallas Stadium', 'finished', 2, 2, 'https://www.theguardian.com/football/live/2026/jun/14/netherlands-v-japan-world-cup-2026-live'),
  match('F-2', 'F', 1, 'Sweden', 'Tunisia', '2026-06-14', 'Estadio Monterrey', 'finished', 5, 1, 'https://www.theguardian.com/football/live/2026/jun/15/fifa-world-cup-2026-live-sweden-v-tunisia-updates-swe-vs-tun-group-f-match-score-latest'),
  match('F-3', 'F', 2, 'Netherlands', 'Sweden', '2026-06-20', 'Houston Stadium'),
  match('F-4', 'F', 2, 'Tunisia', 'Japan', '2026-06-20', 'Estadio Monterrey'),
  match('F-5', 'F', 3, 'Japan', 'Sweden', '2026-06-25', 'Dallas Stadium'),
  match('F-6', 'F', 3, 'Tunisia', 'Netherlands', '2026-06-25', 'Kansas City Stadium'),

  match('G-1', 'G', 1, 'Iran', 'New Zealand', '2026-06-15', 'Los Angeles Stadium'),
  match('G-2', 'G', 1, 'Belgium', 'Egypt', '2026-06-15', 'Seattle Stadium'),
  match('G-3', 'G', 2, 'Belgium', 'Iran', '2026-06-21', 'Los Angeles Stadium'),
  match('G-4', 'G', 2, 'New Zealand', 'Egypt', '2026-06-21', 'BC Place Vancouver'),
  match('G-5', 'G', 3, 'Egypt', 'Iran', '2026-06-26', 'Seattle Stadium'),
  match('G-6', 'G', 3, 'New Zealand', 'Belgium', '2026-06-26', 'BC Place Vancouver'),

  match('H-1', 'H', 1, 'Saudi Arabia', 'Uruguay', '2026-06-15', 'Miami Stadium'),
  match('H-2', 'H', 1, 'Spain', 'Cape Verde', '2026-06-15', 'Atlanta Stadium'),
  match('H-3', 'H', 2, 'Uruguay', 'Cape Verde', '2026-06-21', 'Miami Stadium'),
  match('H-4', 'H', 2, 'Spain', 'Saudi Arabia', '2026-06-21', 'Atlanta Stadium'),
  match('H-5', 'H', 3, 'Cape Verde', 'Saudi Arabia', '2026-06-26', 'Houston Stadium'),
  match('H-6', 'H', 3, 'Uruguay', 'Spain', '2026-06-26', 'Estadio Guadalajara'),

  match('I-1', 'I', 1, 'France', 'Senegal', '2026-06-16', 'New York New Jersey Stadium'),
  match('I-2', 'I', 1, 'Iraq', 'Norway', '2026-06-16', 'Boston Stadium'),
  match('I-3', 'I', 2, 'Norway', 'Senegal', '2026-06-22', 'New York New Jersey Stadium'),
  match('I-4', 'I', 2, 'France', 'Iraq', '2026-06-22', 'Philadelphia Stadium'),
  match('I-5', 'I', 3, 'Norway', 'France', '2026-06-26', 'Boston Stadium'),
  match('I-6', 'I', 3, 'Senegal', 'Iraq', '2026-06-26', 'Toronto Stadium'),

  match('J-1', 'J', 1, 'Argentina', 'Algeria', '2026-06-16', 'Kansas City Stadium'),
  match('J-2', 'J', 1, 'Austria', 'Jordan', '2026-06-16', 'San Francisco Bay Area Stadium'),
  match('J-3', 'J', 2, 'Argentina', 'Austria', '2026-06-22', 'Dallas Stadium'),
  match('J-4', 'J', 2, 'Jordan', 'Algeria', '2026-06-22', 'San Francisco Bay Area Stadium'),
  match('J-5', 'J', 3, 'Algeria', 'Austria', '2026-06-27', 'Kansas City Stadium'),
  match('J-6', 'J', 3, 'Jordan', 'Argentina', '2026-06-27', 'Dallas Stadium'),

  match('K-1', 'K', 1, 'Portugal', 'DR Congo', '2026-06-17', 'Houston Stadium'),
  match('K-2', 'K', 1, 'Uzbekistan', 'Colombia', '2026-06-17', 'Mexico City Stadium'),
  match('K-3', 'K', 2, 'Portugal', 'Uzbekistan', '2026-06-23', 'Houston Stadium'),
  match('K-4', 'K', 2, 'Colombia', 'DR Congo', '2026-06-23', 'Estadio Guadalajara'),
  match('K-5', 'K', 3, 'Colombia', 'Portugal', '2026-06-27', 'Miami Stadium'),
  match('K-6', 'K', 3, 'DR Congo', 'Uzbekistan', '2026-06-27', 'Atlanta Stadium'),

  match('L-1', 'L', 1, 'Ghana', 'Panama', '2026-06-17', 'Toronto Stadium'),
  match('L-2', 'L', 1, 'England', 'Croatia', '2026-06-17', 'Dallas Stadium'),
  match('L-3', 'L', 2, 'England', 'Ghana', '2026-06-23', 'Boston Stadium'),
  match('L-4', 'L', 2, 'Panama', 'Croatia', '2026-06-23', 'Toronto Stadium'),
  match('L-5', 'L', 3, 'Panama', 'England', '2026-06-27', 'New York New Jersey Stadium'),
  match('L-6', 'L', 3, 'Croatia', 'Ghana', '2026-06-27', 'Philadelphia Stadium'),
];

function match(
  id: string,
  group: WorldCupGroupId,
  matchday: 1 | 2 | 3,
  home: string,
  away: string,
  date: string,
  venue: string,
  status: WorldCupMatch['status'] = 'scheduled',
  homeScore?: number,
  awayScore?: number,
  source?: string
): WorldCupMatch {
  return {
    away,
    awayScore,
    date,
    group,
    home,
    homeScore,
    id,
    matchday,
    source,
    status,
    venue,
  };
}

export function getTeamProfile(teamName?: string) {
  return worldCupTeams.find((team) => team.name === teamName);
}

export function getTeamProfileBySlug(teamSlug?: string) {
  return worldCupTeams.find((team) => team.slug === teamSlug);
}

export function getTeamMatches(teamName: string) {
  return worldCupGroupStageMatches.filter(
    (match) => match.home === teamName || match.away === teamName
  );
}

export function getGroupMatches(group: WorldCupGroupId | string) {
  return worldCupGroupStageMatches.filter((match) => match.group === group);
}

export function getTeamStrength(teamName: string) {
  return getTeamProfile(teamName)?.strength ?? 55;
}

function rankToStrength(rank: number) {
  return Math.max(35, Math.min(96, Math.round(98 - rank * 0.72)));
}

function slugifyTeam(team: string) {
  return team
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
