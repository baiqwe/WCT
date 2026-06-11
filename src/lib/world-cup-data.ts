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
  date: string;
  group: WorldCupGroupId;
  home: string;
  id: string;
  matchday: 1 | 2 | 3;
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

const matchdayDates: Record<WorldCupGroupId, [string, string, string]> = {
  A: ['2026-06-11', '2026-06-18', '2026-06-24'],
  B: ['2026-06-12', '2026-06-18', '2026-06-24'],
  C: ['2026-06-13', '2026-06-19', '2026-06-24'],
  D: ['2026-06-12', '2026-06-19', '2026-06-25'],
  E: ['2026-06-14', '2026-06-20', '2026-06-25'],
  F: ['2026-06-14', '2026-06-20', '2026-06-25'],
  G: ['2026-06-15', '2026-06-21', '2026-06-26'],
  H: ['2026-06-15', '2026-06-21', '2026-06-26'],
  I: ['2026-06-16', '2026-06-22', '2026-06-26'],
  J: ['2026-06-16', '2026-06-22', '2026-06-27'],
  K: ['2026-06-17', '2026-06-23', '2026-06-27'],
  L: ['2026-06-17', '2026-06-23', '2026-06-27'],
};

const openingVenues: Record<string, string> = {
  'A-1': 'Mexico City Stadium',
  'A-2': 'Estadio Guadalajara',
  'B-1': 'Toronto Stadium',
  'B-2': 'San Francisco Bay Area Stadium',
  'C-1': 'Boston Stadium',
  'C-2': 'New York New Jersey Stadium',
  'D-1': 'Los Angeles Stadium',
  'D-2': 'BC Place Vancouver',
  'E-1': 'Houston Stadium',
  'E-2': 'Philadelphia Stadium',
  'F-1': 'Dallas Stadium',
  'F-2': 'Estadio Monterrey',
  'G-1': 'Seattle Stadium',
  'G-2': 'Los Angeles Stadium',
  'H-1': 'Atlanta Stadium',
  'H-2': 'Miami Stadium',
  'I-1': 'New York New Jersey Stadium',
  'I-2': 'Boston Stadium',
  'J-1': 'Kansas City Stadium',
  'J-2': 'San Francisco Bay Area Stadium',
  'K-1': 'Houston Stadium',
  'K-2': 'Mexico City Stadium',
  'L-1': 'Dallas Stadium',
  'L-2': 'Toronto Stadium',
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

export const worldCupGroupStageMatches: WorldCupMatch[] = worldCupGroups.flatMap(
  (group) => {
    const [team1, team2, team3, team4] = group.teams;
    const pairings = [
      [team1, team2],
      [team3, team4],
      [team1, team3],
      [team4, team2],
      [team4, team1],
      [team2, team3],
    ] as const;
    return pairings.map(([home, away], index) => {
      const matchday = (index < 2 ? 1 : index < 4 ? 2 : 3) as 1 | 2 | 3;
      const openingVenueKey = `${group.group}-${index + 1}`;
      return {
        away,
        date: matchdayDates[group.group][matchday - 1],
        group: group.group,
        home,
        id: `${group.group}-${index + 1}`,
        matchday,
        venue: openingVenues[openingVenueKey] ?? 'Venue to be confirmed',
      };
    });
  }
);

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
