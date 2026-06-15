import type { ComponentType } from 'react';
import {
  IconChartBar,
  IconFriends,
  IconRouteSquare,
  IconShieldCheck,
} from '@tabler/icons-react';
import {
  getTeamProfileBySlug,
  worldCupGroups,
  worldCupTeams,
} from './world-cup-data';

export const pageKeys = [
  'home',
  'predictor',
  'bracket',
  'groupStage',
  'thirdPlace',
  'monteCarlo',
] as const;

export type PageKey = (typeof pageKeys)[number];

export const supportedLocales = [
  'en-us',
  'en-gb',
  'en-ca',
  'es-mx',
  'es-es',
  'pt-br',
  'pt-pt',
  'fr-fr',
  'de-de',
  'it-it',
  'nl-nl',
  'ja-jp',
  'ko-kr',
  'zh-cn',
] as const;

export type Locale = (typeof supportedLocales)[number];

export const publicLocales = [
  'en-us',
  'es-mx',
  'pt-br',
  'fr-fr',
  'de-de',
  'it-it',
  'nl-nl',
  'ja-jp',
  'ko-kr',
  'zh-cn',
] as const satisfies readonly Locale[];

export type PublicLocale = (typeof publicLocales)[number];

export const languageSegments: Record<PublicLocale, string> = {
  'en-us': 'en',
  'es-mx': 'es',
  'pt-br': 'pt',
  'fr-fr': 'fr',
  'de-de': 'de',
  'it-it': 'it',
  'nl-nl': 'nl',
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'zh-cn': 'zh',
};

const localeAliases: Record<string, Locale> = {
  en: 'en-us',
  'en-us': 'en-us',
  'en-gb': 'en-us',
  'en-ca': 'en-us',
  es: 'es-mx',
  'es-mx': 'es-mx',
  'es-es': 'es-mx',
  pt: 'pt-br',
  'pt-br': 'pt-br',
  'pt-pt': 'pt-br',
  fr: 'fr-fr',
  'fr-fr': 'fr-fr',
  de: 'de-de',
  'de-de': 'de-de',
  it: 'it-it',
  'it-it': 'it-it',
  nl: 'nl-nl',
  'nl-nl': 'nl-nl',
  ja: 'ja-jp',
  'ja-jp': 'ja-jp',
  ko: 'ko-kr',
  'ko-kr': 'ko-kr',
  zh: 'zh-cn',
  'zh-cn': 'zh-cn',
};

type LocaleConfig = {
  code: Locale;
  label: string;
  market: string;
  htmlLang: string;
  languageGroup: 'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'nl' | 'ja' | 'ko' | 'zh';
  slugs: Record<PageKey, string>;
};

export const localeConfigs: Record<Locale, LocaleConfig> = {
  'en-us': {
    code: 'en-us',
    label: 'United States',
    market: 'United States',
    htmlLang: 'en-US',
    languageGroup: 'en',
    slugs: {
      home: 'world-cup-simulator',
      predictor: 'world-cup-predictor',
      bracket: 'world-cup-bracket-predictor',
      groupStage: 'world-cup-group-stage-simulator',
      thirdPlace: 'best-third-place-calculator',
      monteCarlo: 'monte-carlo-world-cup-simulator',
    },
  },
  'en-gb': {
    code: 'en-gb',
    label: 'United Kingdom',
    market: 'United Kingdom',
    htmlLang: 'en-GB',
    languageGroup: 'en',
    slugs: {
      home: 'world-cup-simulator',
      predictor: 'world-cup-predictor',
      bracket: 'world-cup-bracket-predictor',
      groupStage: 'world-cup-group-stage-simulator',
      thirdPlace: 'best-third-place-calculator',
      monteCarlo: 'monte-carlo-world-cup-simulator',
    },
  },
  'en-ca': {
    code: 'en-ca',
    label: 'Canada',
    market: 'Canada',
    htmlLang: 'en-CA',
    languageGroup: 'en',
    slugs: {
      home: 'world-cup-simulator',
      predictor: 'world-cup-predictor',
      bracket: 'world-cup-bracket-predictor',
      groupStage: 'world-cup-group-stage-simulator',
      thirdPlace: 'best-third-place-calculator',
      monteCarlo: 'monte-carlo-world-cup-simulator',
    },
  },
  'es-mx': {
    code: 'es-mx',
    label: 'Mexico',
    market: 'Mexico',
    htmlLang: 'es-MX',
    languageGroup: 'es',
    slugs: {
      home: 'simulador-mundial-2026',
      predictor: 'predictor-mundial-2026',
      bracket: 'bracket-mundial-2026',
      groupStage: 'simulador-fase-de-grupos',
      thirdPlace: 'calculadora-mejores-terceros',
      monteCarlo: 'simulador-monte-carlo-mundial',
    },
  },
  'es-es': {
    code: 'es-es',
    label: 'Spain',
    market: 'Spain',
    htmlLang: 'es-ES',
    languageGroup: 'es',
    slugs: {
      home: 'simulador-mundial-2026',
      predictor: 'predictor-mundial-2026',
      bracket: 'bracket-mundial-2026',
      groupStage: 'simulador-fase-de-grupos',
      thirdPlace: 'calculadora-mejores-terceros',
      monteCarlo: 'simulador-monte-carlo-mundial',
    },
  },
  'pt-br': {
    code: 'pt-br',
    label: 'Brasil',
    market: 'Brazil',
    htmlLang: 'pt-BR',
    languageGroup: 'pt',
    slugs: {
      home: 'simulador-copa-do-mundo-2026',
      predictor: 'previsor-copa-do-mundo-2026',
      bracket: 'chaveamento-copa-do-mundo-2026',
      groupStage: 'simulador-fase-de-grupos',
      thirdPlace: 'calculadora-melhores-terceiros',
      monteCarlo: 'simulador-monte-carlo-copa',
    },
  },
  'pt-pt': {
    code: 'pt-pt',
    label: 'Portugal',
    market: 'Portugal',
    htmlLang: 'pt-PT',
    languageGroup: 'pt',
    slugs: {
      home: 'simulador-mundial-2026',
      predictor: 'previsor-mundial-2026',
      bracket: 'chaveamento-mundial-2026',
      groupStage: 'simulador-fase-de-grupos',
      thirdPlace: 'calculadora-melhores-terceiros',
      monteCarlo: 'simulador-monte-carlo-mundial',
    },
  },
  'fr-fr': {
    code: 'fr-fr',
    label: 'France',
    market: 'France',
    htmlLang: 'fr-FR',
    languageGroup: 'fr',
    slugs: {
      home: 'simulateur-coupe-du-monde-2026',
      predictor: 'pronostic-coupe-du-monde-2026',
      bracket: 'tableau-coupe-du-monde-2026',
      groupStage: 'simulateur-phase-de-groupes',
      thirdPlace: 'calculateur-meilleurs-troisiemes',
      monteCarlo: 'simulateur-monte-carlo-coupe-du-monde',
    },
  },
  'de-de': {
    code: 'de-de',
    label: 'Deutschland',
    market: 'Germany',
    htmlLang: 'de-DE',
    languageGroup: 'de',
    slugs: {
      home: 'wm-2026-simulator',
      predictor: 'wm-2026-predictor',
      bracket: 'wm-2026-turnierbaum',
      groupStage: 'wm-gruppenphase-simulator',
      thirdPlace: 'beste-dritte-rechner',
      monteCarlo: 'wm-monte-carlo-simulator',
    },
  },
  'it-it': {
    code: 'it-it',
    label: 'Italia',
    market: 'Italy',
    htmlLang: 'it-IT',
    languageGroup: 'it',
    slugs: {
      home: 'simulatore-mondiali-2026',
      predictor: 'pronostico-mondiali-2026',
      bracket: 'tabellone-mondiali-2026',
      groupStage: 'simulatore-fase-a-gironi',
      thirdPlace: 'calcolatore-migliori-terze',
      monteCarlo: 'simulatore-monte-carlo-mondiali',
    },
  },
  'nl-nl': {
    code: 'nl-nl',
    label: 'Nederland',
    market: 'Netherlands',
    htmlLang: 'nl-NL',
    languageGroup: 'nl',
    slugs: {
      home: 'wk-2026-simulator',
      predictor: 'wk-2026-voorspeller',
      bracket: 'wk-2026-speelschema-voorspeller',
      groupStage: 'wk-groepsfase-simulator',
      thirdPlace: 'beste-derde-plaatsen-calculator',
      monteCarlo: 'wk-monte-carlo-simulator',
    },
  },
  'ja-jp': {
    code: 'ja-jp',
    label: '日本',
    market: 'Japan',
    htmlLang: 'ja-JP',
    languageGroup: 'ja',
    slugs: {
      home: 'ワールドカップ-2026-シミュレーター',
      predictor: 'ワールドカップ-2026-予想',
      bracket: 'ワールドカップ-2026-トーナメント表',
      groupStage: 'ワールドカップ-グループステージ-シミュレーター',
      thirdPlace: 'ベスト3位-計算機',
      monteCarlo: 'ワールドカップ-モンテカルロ-シミュレーター',
    },
  },
  'ko-kr': {
    code: 'ko-kr',
    label: '한국',
    market: 'South Korea',
    htmlLang: 'ko-KR',
    languageGroup: 'ko',
    slugs: {
      home: '월드컵-2026-시뮬레이터',
      predictor: '월드컵-2026-예측',
      bracket: '월드컵-2026-대진표',
      groupStage: '월드컵-조별리그-시뮬레이터',
      thirdPlace: '최고-3위-계산기',
      monteCarlo: '월드컵-몬테카를로-시뮬레이터',
    },
  },
  'zh-cn': {
    code: 'zh-cn',
    label: '中国',
    market: 'China',
    htmlLang: 'zh-CN',
    languageGroup: 'zh',
    slugs: {
      home: '世界杯模拟器',
      predictor: '世界杯预测器',
      bracket: '世界杯对阵预测器',
      groupStage: '世界杯小组赛模拟器',
      thirdPlace: '最佳第三名计算器',
      monteCarlo: '世界杯蒙特卡洛模拟器',
    },
  },
};

export const defaultLocale: Locale = 'en-us';

export function normalizeLocale(locale?: string): Locale {
  const value = locale?.toLowerCase();
  if (value && localeAliases[value]) return localeAliases[value];
  if (supportedLocales.includes(value as Locale)) return value as Locale;
  return defaultLocale;
}

export function getLocaleConfig(locale?: string) {
  return localeConfigs[normalizeLocale(locale)];
}

export function getPageKey(locale: Locale, slug?: string): PageKey {
  const config = localeConfigs[locale];
  if (!slug) return 'home';
  const match = pageKeys.find((key) => config.slugs[key] === slug);
  return match ?? 'home';
}

export function getPagePath(locale: Locale, pageKey: PageKey): string {
  const config = localeConfigs[locale];
  return `/${getLocaleSegment(locale)}/${config.slugs[pageKey]}`;
}

export function getLocaleSegment(locale: Locale): string {
  const publicLocale =
    publicLocales.find(
      (candidate) =>
        localeConfigs[candidate].languageGroup === localeConfigs[locale].languageGroup
    ) ?? defaultLocale;
  return languageSegments[publicLocale];
}

export const localePaths: Record<Locale, string> = Object.fromEntries(
  supportedLocales.map((locale) => [locale, getPagePath(locale, 'home')])
) as Record<Locale, string>;

export const languageLabels: Record<PublicLocale, string> = {
  'en-us': 'English',
  'es-mx': 'Español',
  'pt-br': 'Português',
  'fr-fr': 'Français',
  'de-de': 'Deutsch',
  'it-it': 'Italiano',
  'nl-nl': 'Nederlands',
  'ja-jp': '日本語',
  'ko-kr': '한국어',
  'zh-cn': '中文',
};

type PageSeo = {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  eyebrow: string;
  body: string;
};

type SeoDeepDive = {
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string;
    links?: Array<{ label: string; pageKey: PageKey }>;
  }>;
};

type LanguageCopy = {
  nav: Record<PageKey | 'faq' | 'pools', string>;
  cta: string;
  secondaryCta: string;
  statLabel: string;
  statValue: string;
  sampleNote: string;
  liveIntent: string;
  predictor: {
    title: string;
    body: string;
    reset: string;
    champion: string;
    finalist: string;
    round32: string;
  };
  thirdPlace: {
    title: string;
    body: string;
    columns: string[];
  };
  features: Array<{
    icon: ComponentType<{ className?: string }>;
    title: string;
    body: string;
  }>;
  seoPlan: {
    title: string;
    body: string;
    items: Array<[string, string]>;
  };
  seoDeepDive: SeoDeepDive;
  faq: Array<{ q: string; a: string }>;
  pages: Record<PageKey, PageSeo>;
};

const englishCopy: LanguageCopy = {
  nav: {
    home: 'Simulator',
    predictor: 'Predictor',
    bracket: 'Bracket',
    groupStage: 'Groups',
    thirdPlace: 'Third-place',
    monteCarlo: 'Monte Carlo',
    pools: 'Office pools',
    faq: 'FAQ',
  },
  cta: 'Open the simulator',
  secondaryCta: 'See how it works',
  statLabel: 'Format ready',
  statValue: '48 teams / 104 matches',
  sampleNote: 'Demo seed data shown. Swap in official fixtures when final data is locked.',
  liveIntent: 'Simulator + Predictor',
  predictor: {
    title: 'Interactive group stage simulator',
    body: 'Tap a group winner or edit scores to shape the knockout path. The controls make the 48-team format understandable before you share a prediction.',
    reset: 'Reset picks',
    champion: 'Champion pick',
    finalist: 'Finalist',
    round32: 'Round of 32 auto-fill',
  },
  thirdPlace: {
    title: 'Best third-place calculator',
    body: 'The 2026 format makes third-place qualification hard to follow. This calculator keeps the cutoff visible and explains the table rules step by step.',
    columns: ['Team', 'Grp', 'Pts', 'GD', 'GF', 'Status'],
  },
  features: [
    {
      icon: IconRouteSquare,
      title: 'Tool-first prediction pages',
      body: 'Dedicated pages for the simulator, predictor, bracket, group stage, third-place calculator, Monte Carlo view, group pages, and team paths.',
    },
    {
      icon: IconChartBar,
      title: 'Probability mode',
      body: 'Layer Elo-style ratings, form, and odds into an auto-simulate button so users can start with a smart baseline.',
    },
    {
      icon: IconFriends,
      title: 'Private pools',
      body: 'Let friends and coworkers join a pool, compare scorecards, and return after every matchday.',
    },
    {
      icon: IconShieldCheck,
      title: 'Format guardrails',
      body: 'Encode the 2026 rules once: 12 groups, 8 best third-place teams, and a 32-team knockout bracket.',
    },
  ],
  seoPlan: {
    title: 'Built around clear rules and useful tools',
    body: 'Every page combines an interactive prediction surface with tournament rules, transparent assumptions, related tools, and links to the next step.',
    items: [
      ['Working tools', 'group tables, score inputs, bracket paths, probability preview, and team pages'],
      ['Transparent rules', 'points, goal difference, goals scored, best-third-place cutoff, and knockout flow'],
      ['Independent note', 'fan-made simulator, not affiliated with FIFA or any tournament organizer'],
      ['Privacy-friendly use', 'core predictions work without an account and can be explored before sharing'],
    ],
  },
  seoDeepDive: {
    title: 'World Cup simulator search guide',
    intro: 'The tool is built for fans who want a working World Cup 2026 simulator, not a static article. You can start with quick group rankings, open exact score predictions only when needed, and continue into the Round of 32, quarter-finals, semi-finals, final, and champion pick.',
    sections: [
      {
        title: 'World Cup 2026 simulator',
        body: 'Use the simulator when you want the full tournament path in one place. Rank each group first, then refine the prediction with scorelines, goal totals, best third-place teams, and knockout winners. This keeps the first visit fast while still supporting detailed score prediction for users who want to test every match.',
        links: [
          { label: 'Group stage simulator', pageKey: 'groupStage' },
          { label: 'Best third-place calculator', pageKey: 'thirdPlace' },
        ],
      },
      {
        title: 'Bracket predictor and score predictor',
        body: 'The bracket predictor starts from qualified teams instead of asking users to fill a blank chart. Group winners, runners-up, and the best third-place teams feed the Round of 32, then each later round can be adjusted. Score prediction pages are available for every group, so exact goal picks support the table instead of slowing down casual users.',
        links: [
          { label: 'Bracket predictor', pageKey: 'bracket' },
          { label: 'World Cup predictor', pageKey: 'predictor' },
        ],
      },
      {
        title: 'Transparent assumptions',
        body: 'World Cup Tool is an independent fan-made simulator. It explains the 48-team format, the 12 group tables, the best third-place cutoff, and the knockout flow on the page so users can understand how each prediction moves through the tournament.',
      },
    ],
  },
  faq: [
    {
      q: 'Is this a real simulator or only a landing page?',
      a: 'This demo includes working UI flows for group winners, bracket projection, and third-place ranking. The scoring engine can be expanded behind the same components.',
    },
    {
      q: 'Why target best third-place teams?',
      a: 'The 2026 format makes third-place qualification confusing. The calculator shows the cutoff table directly so users can see why a team is in or out.',
    },
    {
      q: 'Why are there multiple language pages?',
      a: 'World Cup fans search and predict in different languages. Each language version localizes the tool labels, page titles, explanations, and related links.',
    },
  ],
  pages: {
    home: {
      title: 'World Cup 2026 Simulator - Group Stage, Bracket and Score Predictor',
      description: 'Use a free World Cup 2026 simulator to rank groups, predict scores, calculate best third-place teams, build the Round of 32 bracket, and choose a champion.',
      keywords: 'world cup simulator, world cup 2026 simulator, world cup score predictor, world cup bracket predictor, world cup group stage simulator',
      h1: 'World Cup 2026 Simulator',
      eyebrow: 'World Cup 2026 Simulator',
      body: 'Rank every group, predict scores only when you want details, and build a full path from the group stage to the World Cup Final.',
    },
    predictor: {
      title: 'World Cup 2026 Predictor - Make Your Picks & Share Your Bracket',
      description: 'Create your World Cup 2026 prediction, pick every group and knockout winner, save your champion, and share your picks with friends.',
      keywords: 'world cup predictor, world cup 2026 predictor, world cup prediction game, world cup picks, world cup office pool',
      h1: 'World Cup 2026 Predictor',
      eyebrow: 'Prediction game',
      body: 'Make manual picks for every group and knockout round, then share a finished champion bracket with friends or an office pool.',
    },
    bracket: {
      title: 'World Cup 2026 Bracket Predictor - Build the Round of 32 Bracket',
      description: 'Build a World Cup 2026 bracket from the group stage to the final, including Round of 32 paths and best third-place qualifiers.',
      keywords: 'world cup bracket predictor, world cup 2026 bracket predictor, world cup bracket maker, round of 32 bracket',
      h1: 'World Cup 2026 Bracket Predictor',
      eyebrow: 'Round of 32 bracket',
      body: 'Generate a knockout bracket from group standings, advance winners round by round, and see a complete path to the final.',
    },
    groupStage: {
      title: 'World Cup 2026 Group Stage Simulator - Calculate Standings & Qualifiers',
      description: 'Simulate all 12 World Cup 2026 groups, enter scores or rankings, calculate standings, tiebreakers, and teams that qualify for the Round of 32.',
      keywords: 'world cup group stage simulator, world cup 2026 groups simulator, world cup group predictor, world cup standings calculator',
      h1: 'World Cup 2026 Group Stage Simulator',
      eyebrow: '12 group standings',
      body: 'Model every group table, move teams up and down, and send winners, runners-up, and the best third-place teams into the bracket.',
    },
    thirdPlace: {
      title: 'Best Third-Place Teams Calculator - World Cup 2026 Round of 32',
      description: 'Calculate the eight best third-place teams at World Cup 2026 and see how they enter the Round of 32 bracket.',
      keywords: 'best third place teams calculator, world cup third place calculator, world cup 2026 best third place teams, world cup round of 32 qualification',
      h1: 'Best Third-Place Teams Calculator',
      eyebrow: 'Best third-place calculator',
      body: 'Rank all third-place teams by points, goal difference, and goals scored, then see which eight survive into the Round of 32.',
    },
    monteCarlo: {
      title: 'World Cup 2026 Monte Carlo Simulator - Run Tournament Probabilities',
      description: 'Run thousands of World Cup 2026 simulations using team strength ratings and see each team probability of reaching every round.',
      keywords: 'world cup monte carlo simulator, world cup probability simulator, world cup 2026 odds simulator, world cup win probability',
      h1: 'World Cup 2026 Monte Carlo Simulator',
      eyebrow: 'Probability simulator',
      body: 'Run repeatable tournament simulations, compare champion probabilities, and turn one bracket into a probability table.',
    },
  },
};

const localizedOverrides: Partial<Record<Locale, Partial<LanguageCopy>>> = {
  'en-gb': englishRegionalCopy('UK', 'United Kingdom'),
  'en-ca': englishRegionalCopy('Canada', 'Canadian'),
  'es-mx': spanishCopy(),
  'es-es': spanishCopy(),
  'pt-br': portugueseCopy('Copa do Mundo'),
  'pt-pt': portugueseCopy('Mundial'),
  'fr-fr': simpleCopy('fr'),
  'de-de': simpleCopy('de'),
  'it-it': simpleCopy('it'),
  'nl-nl': simpleCopy('nl'),
  'ja-jp': simpleCopy('ja'),
  'ko-kr': simpleCopy('ko'),
  'zh-cn': simpleCopy('zh'),
};

function englishRegionalCopy(regionLabel: string, adjective: string): Partial<LanguageCopy> {
  return {
    pages: {
      home: {
        ...englishCopy.pages.home,
        title: `World Cup 2026 Simulator for ${regionLabel} Fans - Bracket & Group Calculator`,
        description: `Simulate the World Cup 2026 tournament with a ${adjective} audience in mind: group scores, best third-place teams, Round of 32 bracket, and champion path.`,
        body: `A World Cup simulator for ${adjective} fans, built around the real 48-team format: group scores, best third-place ranking, Round of 32 flow, and shareable predictions.`,
      },
      predictor: {
        ...englishCopy.pages.predictor,
        title: `World Cup 2026 Predictor for ${regionLabel} Fans - Make Picks & Share`,
        description: `Create a World Cup 2026 prediction for ${adjective} pools, pick group rankings and knockout winners, then share your champion path.`,
        body: `Make group and knockout picks for a ${adjective} prediction pool, then save a finished champion bracket to share.`,
      },
      bracket: {
        ...englishCopy.pages.bracket,
        title: `World Cup 2026 Bracket Predictor for ${regionLabel} Fans`,
        description: `Build a World Cup 2026 bracket for ${adjective} fans, from group qualifiers through the Round of 32, semi-finals, final, and champion.`,
        body: `Generate a knockout bracket from group standings and trace a ${adjective} fan-friendly champion path to the final.`,
      },
      groupStage: {
        ...englishCopy.pages.groupStage,
        title: `World Cup 2026 Group Stage Simulator for ${regionLabel} Fans`,
        description: `Enter World Cup 2026 group scores, calculate standings and tiebreakers, and see qualifiers from a ${adjective} fan perspective.`,
        body: `Model every group table, scoreline, and qualification bubble with a ${adjective} fan view of the 2026 format.`,
      },
      thirdPlace: {
        ...englishCopy.pages.thirdPlace,
        title: `Best Third-Place Teams Calculator for World Cup 2026 ${regionLabel} Fans`,
        description: `Calculate the eight best third-place teams at World Cup 2026 and see how the cutoff affects ${adjective} bracket predictions.`,
        body: `Rank all third-place teams by points, goal difference, and goals scored, then see how the cutoff changes a ${adjective} prediction bracket.`,
      },
      monteCarlo: {
        ...englishCopy.pages.monteCarlo,
        title: `World Cup 2026 Monte Carlo Simulator for ${regionLabel} Fans`,
        description: `Run World Cup 2026 probability simulations for ${adjective} fans and compare each team path to the final and champion odds.`,
        body: `Run repeatable tournament simulations with a ${adjective} fan lens, comparing champion probabilities and round-by-round reach rates.`,
      },
    },
  };
}

export function getWorldCupContent(locale?: string, pageKey: PageKey = 'home') {
  const normalized = normalizeLocale(locale);
  const override = localizedOverrides[normalized] ?? {};
  const copy = mergeCopy(englishCopy, override);
  return {
    ...copy,
    locale: normalized,
    config: localeConfigs[normalized],
    seo: copy.pages[pageKey],
    activePage: pageKey,
  };
}

export const content = Object.fromEntries(
  supportedLocales.map((locale) => [locale, getWorldCupContent(locale)])
) as Record<Locale, ReturnType<typeof getWorldCupContent>>;

export const sampleGroups = worldCupGroups;

export type TeamPage = {
  name: string;
  slug: string;
  group: string;
  seed: number;
  headline: string;
};

export type GroupPredictionPage = {
  group: string;
  slug: string;
  headline: string;
};

export const teamPages: TeamPage[] = sampleGroups
  .flatMap((group) =>
    group.teams.map((team, index) => {
      const profile = worldCupTeams.find((candidate) => candidate.name === team);
      return {
        name: team,
        slug: profile?.slug ?? slugifyTeam(team),
        group: group.group,
        seed: index + 1,
        headline: `${team} World Cup 2026 path, group outlook, and bracket prediction`,
      };
    })
  );

export const groupPredictionPages: GroupPredictionPage[] = sampleGroups.map((group) => ({
  group: group.group,
  slug: `group-${group.group.toLowerCase()}-goal-prediction`,
  headline: `Group ${group.group} goal prediction, score picks, and ranking simulator`,
}));

export function getTeamPath(locale: Locale, teamSlug: string): string {
  return `/${getLocaleSegment(locale)}/teams/${teamSlug}`;
}

export function getGroupPredictionPath(locale: Locale, groupSlug: string): string {
  return `/${getLocaleSegment(locale)}/groups/${groupSlug}`;
}

export function getTeamBySlug(teamSlug?: string) {
  const profile = getTeamProfileBySlug(teamSlug);
  return teamPages.find((team) => team.slug === profile?.slug || team.slug === teamSlug);
}

export function getGroupPredictionBySlug(groupSlug?: string) {
  return groupPredictionPages.find(
    (group) =>
      group.slug === groupSlug ||
      group.group.toLowerCase() === groupSlug?.toLowerCase() ||
      `group-${group.group.toLowerCase()}` === groupSlug?.toLowerCase()
  );
}

function slugifyTeam(team: string) {
  return team
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const thirdPlaceTable = [
  { team: 'Japan', group: 'A', pts: 4, gd: 2, gf: 5, status: 'Qualified' },
  { team: 'Ghana', group: 'B', pts: 4, gd: 1, gf: 4, status: 'Qualified' },
  { team: 'South Korea', group: 'C', pts: 4, gd: 0, gf: 3, status: 'Qualified' },
  { team: 'Nigeria', group: 'D', pts: 3, gd: 1, gf: 4, status: 'Bubble' },
  { team: 'Egypt', group: 'E', pts: 3, gd: 0, gf: 2, status: 'Bubble' },
  { team: 'Serbia', group: 'F', pts: 2, gd: -1, gf: 2, status: 'Out' },
] as const;

function mergeCopy(base: LanguageCopy, override: Partial<LanguageCopy>): LanguageCopy {
  return {
    ...base,
    ...override,
    nav: { ...base.nav, ...override.nav },
    predictor: { ...base.predictor, ...override.predictor },
    thirdPlace: { ...base.thirdPlace, ...override.thirdPlace },
    seoPlan: { ...base.seoPlan, ...override.seoPlan },
    seoDeepDive: override.seoDeepDive ?? base.seoDeepDive,
    pages: { ...base.pages, ...override.pages },
  };
}

function spanishCopy(): Partial<LanguageCopy> {
  return {
    ...commonLocalizedCopy('es'),
    nav: {
      home: 'Simulador',
      predictor: 'Predictor',
      bracket: 'Bracket',
      groupStage: 'Grupos',
      thirdPlace: 'Terceros',
      monteCarlo: 'Monte Carlo',
      pools: 'Porras',
      faq: 'FAQ',
    },
    pages: {
      home: {
        title: 'Simulador Mundial 2026 - Grupos, Goles, Tabla y Eliminatorias',
        description: 'Simula el Mundial 2026 con goles: ordena grupos, predice marcadores, calcula mejores terceros, genera la ronda de 32 y elige campeon.',
        keywords: 'simulador mundial 2026, simulador mundial 2026 con goles, calculadora mundial 2026, predictor mundial 2026, bracket mundial',
        h1: 'Simulador del Mundial 2026',
        eyebrow: 'Simulador Mundial 2026',
        body: 'Empieza ordenando cada grupo y agrega goles solo cuando quieras detalle. El simulador calcula tablas, mejores terceros, ronda de 32, eliminatorias y campeon.',
      },
      predictor: localizedPage(
        'Predictor Mundial 2026',
        'Crea tu prediccion del Mundial 2026, elige grupos y ganadores del cuadro, guarda tu campeon y comparte tus picks.',
        'predictor mundial 2026, pronosticos mundial, picks mundial, porra mundial'
      ),
      bracket: localizedPage(
        'Bracket Mundial 2026',
        'Construye el bracket del Mundial 2026 desde la fase de grupos hasta la final, con ronda de 32 y mejores terceros.',
        'bracket mundial 2026, cuadro mundial, eliminatorias mundial, ronda de 32 mundial'
      ),
      groupStage: localizedPage(
        'Simulador Fase de Grupos Mundial 2026',
        'Simula los 12 grupos del Mundial 2026, calcula posiciones, desempates y clasificados a la ronda de 32.',
        'simulador fase de grupos mundial, grupos mundial 2026, tabla posiciones mundial'
      ),
      thirdPlace: localizedPage(
        'Calculadora de Mejores Terceros Mundial 2026',
        'Calcula los ocho mejores terceros del Mundial 2026 y mira como entran en la ronda de 32.',
        'mejores terceros mundial 2026, calculadora terceros mundial, clasificacion ronda de 32'
      ),
      monteCarlo: localizedPage(
        'Simulador Monte Carlo Mundial 2026',
        'Ejecuta miles de simulaciones del Mundial 2026 y compara probabilidades de campeon, final y cada ronda.',
        'simulador monte carlo mundial, probabilidades mundial 2026, prediccion probabilistica mundial'
      ),
    },
    seoDeepDive: {
      title: 'Guia del simulador del Mundial 2026',
      intro: 'Esta pagina esta pensada para busquedas como simulador mundial 2026, simulador del mundial con goles y calculadora mundial 2026. Puedes empezar rapido con el ranking de grupos o entrar en cada detalle para predecir goles y marcadores.',
      sections: [
        {
          title: 'Simulador Mundial 2026 con goles',
          body: 'El flujo no obliga a rellenar todos los partidos desde el primer minuto. Primero ordenas cada grupo, ves los clasificados y despues, si quieres precision, abres la pagina del grupo para poner goles partido por partido. Asi la tabla cambia con marcadores reales sin hacer pesada la primera visita.',
          links: [
            { label: 'Simulador de fase de grupos', pageKey: 'groupStage' },
            { label: 'Calculadora de mejores terceros', pageKey: 'thirdPlace' },
          ],
        },
        {
          title: 'Calculadora Mundial 2026',
          body: 'La calculadora conecta puntos, diferencia de goles, goles a favor, mejores terceros y ronda de 32. El objetivo es que el usuario entienda por que un equipo avanza, queda en la burbuja o cae eliminado antes de modificar el bracket.',
          links: [
            { label: 'Bracket Mundial 2026', pageKey: 'bracket' },
            { label: 'Predictor Mundial 2026', pageKey: 'predictor' },
          ],
        },
        {
          title: 'Independiente y facil de revisar',
          body: 'World Cup Tool es una herramienta hecha por fans, sin afiliacion con FIFA. Las reglas del formato 2026 se explican junto al producto para que cada prediccion sea verificable y facil de compartir.',
        },
      ],
    },
  };
}

function portugueseCopy(name: string): Partial<LanguageCopy> {
  return {
    ...commonLocalizedCopy('pt'),
    nav: {
      home: 'Simulador',
      predictor: 'Previsor',
      bracket: 'Chaveamento',
      groupStage: 'Grupos',
      thirdPlace: 'Terceiros',
      monteCarlo: 'Monte Carlo',
      pools: 'Bolao',
      faq: 'FAQ',
    },
    pages: {
      home: {
        title: `Simulador ${name} 2026 - Chaveamento e Fase de Grupos`,
        description: `Simule a ${name} 2026, organize grupos, calcule os melhores terceiros, gere a fase eliminatoria e compartilhe sua previsao.`,
        keywords: `simulador ${name.toLowerCase()} 2026, previsor copa do mundo, chaveamento copa do mundo, simulador fase de grupos`,
        h1: `Simulador ${name} 2026`,
        eyebrow: `Simulador ${name} 2026`,
        body: 'Um simulador multilingue para o formato real de 48 selecoes: grupos, melhores terceiros, fase eliminatoria, bolao privado e previsoes compartilhaveis.',
      },
      predictor: localizedPage(
        `Previsor ${name} 2026`,
        `Crie sua previsao da ${name} 2026, escolha grupos, vencedores do mata-mata, campeao e compartilhe seus palpites.`,
        `previsor ${name.toLowerCase()} 2026, palpites copa do mundo, bolao copa do mundo`
      ),
      bracket: localizedPage(
        `Chaveamento ${name} 2026`,
        `Monte o chaveamento da ${name} 2026 da fase de grupos ate a final, incluindo ronda de 32 e melhores terceiros.`,
        `chaveamento ${name.toLowerCase()} 2026, tabela eliminatoria copa do mundo, bracket copa`
      ),
      groupStage: localizedPage(
        `Simulador Fase de Grupos ${name} 2026`,
        `Simule os 12 grupos da ${name} 2026, calcule classificacao, criterios de desempate e vagas para a fase eliminatoria.`,
        `simulador fase de grupos ${name.toLowerCase()}, grupos copa do mundo 2026, calculadora classificacao`
      ),
      thirdPlace: localizedPage(
        `Calculadora Melhores Terceiros ${name} 2026`,
        `Calcule os oito melhores terceiros da ${name} 2026 e veja como eles entram na ronda de 32.`,
        `melhores terceiros copa do mundo 2026, calculadora terceiros, classificacao ronda de 32`
      ),
      monteCarlo: localizedPage(
        `Simulador Monte Carlo ${name} 2026`,
        `Rode milhares de simulacoes da ${name} 2026 e compare probabilidades de titulo, final e cada fase.`,
        `simulador monte carlo copa do mundo, probabilidades copa do mundo 2026`
      ),
    },
  };
}

function simpleCopy(group: LocaleConfig['languageGroup']): Partial<LanguageCopy> {
  const map = {
    fr: ['Simulateur Coupe du Monde 2026', 'Simulez les groupes, les meilleurs troisiemes et le tableau final de la Coupe du Monde 2026.'],
    de: ['WM 2026 Simulator', 'Simuliere Gruppen, beste Drittplatzierte und den K.o.-Baum der WM 2026.'],
    it: ['Simulatore Mondiali 2026', 'Simula gironi, migliori terze e tabellone a eliminazione diretta dei Mondiali 2026.'],
    nl: ['WK 2026 Simulator', 'Simuleer groepen, beste derde plaatsen en het knock-out schema van het WK 2026.'],
    ja: ['ワールドカップ 2026 シミュレーター', 'グループ順位、3位通過チーム、決勝トーナメント表をシミュレーションできます。'],
    ko: ['월드컵 2026 시뮬레이터', '조별 순위, 3위 진출 팀, 토너먼트 대진을 시뮬레이션하세요.'],
    zh: ['2026 世界杯模拟器', '模拟小组排名、最佳第三名和 32 强淘汰赛路径，并分享你的预测。'],
  } as const;
  const [h1, description] = map[group as keyof typeof map] ?? map.fr;
  const pages = simpleLocalizedPages(group, h1, description);
  if (group === 'de') {
    return {
      ...commonLocalizedCopy(group),
      pages,
      seoDeepDive: {
        title: 'WM 2026 Simulator und Baum Rechner',
        intro: 'Diese Seite ist fur Suchanfragen wie WM 2026 Simulator, WM Baum Rechner, WM Plan Rechner und WM Tipp Simulator aufgebaut. Du kannst zuerst nur die Gruppen sortieren und den Turnierbaum sehen, ohne sofort jedes Ergebnis einzutragen.',
        sections: [
          {
            title: 'WM 2026 Gruppenphase simulieren',
            body: 'Der schnelle Einstieg beginnt mit der Reihenfolge jeder Gruppe. Gewinner, Zweite und beste Drittplatzierte werden automatisch in die Runde der 32 ubernommen. Wer genauer tippen mochte, offnet die Detailseite einer Gruppe und tragt Tore fur jedes Spiel ein.',
            links: [
              { label: 'WM Gruppenphase Simulator', pageKey: 'groupStage' },
              { label: 'Beste Dritte Rechner', pageKey: 'thirdPlace' },
            ],
          },
          {
            title: 'WM Baum Rechner mit K.o.-Runde',
            body: 'Der Turnierbaum wird nicht als leere Grafik gezeigt. Er entsteht aus den Gruppentabellen, dem Drittplatzierten-Vergleich und deinen Tipps fur jede K.o.-Runde. Dadurch bleibt nachvollziehbar, warum ein Team im Achtelfinale, Viertelfinale, Halbfinale oder Finale steht.',
            links: [
              { label: 'WM Baum Rechner', pageKey: 'bracket' },
              { label: 'WM Tipp Simulator', pageKey: 'predictor' },
            ],
          },
          {
            title: 'Transparente Regeln',
            body: 'World Cup Tool ist ein unabhangiger Fan-Simulator. Die Seite erklart Punkte, Tordifferenz, erzielte Tore, die acht besten Drittplatzierten und den Weg zur K.o.-Phase direkt neben dem Tool.',
          },
        ],
      },
    };
  }
  return {
    ...commonLocalizedCopy(group),
    pages,
  };
}

function commonLocalizedCopy(
  group: LocaleConfig['languageGroup']
): Partial<LanguageCopy> {
  const copy = {
    en: {
      nav: englishCopy.nav,
      cta: englishCopy.cta,
      secondaryCta: englishCopy.secondaryCta,
      statLabel: englishCopy.statLabel,
      statValue: englishCopy.statValue,
      sampleNote: englishCopy.sampleNote,
      liveIntent: englishCopy.liveIntent,
      predictor: englishCopy.predictor,
      thirdPlace: englishCopy.thirdPlace,
      featureTitles: [
        'Tool-first prediction pages',
        'Probability mode',
        'Private pools',
        'Format guardrails',
      ],
      featureBodies: [
        'Dedicated pages for simulator, predictor, bracket, group stage, third-place calculator, Monte Carlo, and team paths.',
        'Layer Elo-style ratings, form, and odds into an auto-simulate button so users can start with a smart baseline.',
        'Let friends and coworkers join a pool, compare scorecards, and return after every matchday.',
        'Encode the 2026 rules once: 12 groups, 8 best third-place teams, and a 32-team knockout bracket.',
      ],
      seoPlan: englishCopy.seoPlan,
      faq: englishCopy.faq,
    },
    es: {
      nav: {
        home: 'Simulador',
        predictor: 'Predictor',
        bracket: 'Bracket',
        groupStage: 'Grupos',
        thirdPlace: 'Terceros',
        monteCarlo: 'Monte Carlo',
        pools: 'Porras',
        faq: 'FAQ',
      },
      cta: 'Abrir simulador',
      secondaryCta: 'Ver como funciona',
      statLabel: 'Formato listo',
      statValue: '48 equipos / 104 partidos',
      sampleNote: 'Datos de demostracion. Sustituyelos por el calendario oficial cuando este confirmado.',
      liveIntent: 'Simulador + Predictor',
      predictor: {
        title: 'Simulador interactivo de grupos',
        body: 'Introduce marcadores, calcula tablas y genera el camino de eliminatorias desde la fase de grupos.',
        reset: 'Reiniciar picks',
        champion: 'Campeon elegido',
        finalist: 'Finalista',
        round32: 'Ronda de 32 automatica',
      },
      thirdPlace: {
        title: 'Calculadora de mejores terceros',
        body: 'Compara puntos, diferencia de goles y goles a favor para encontrar los ocho terceros que avanzan.',
        columns: ['Equipo', 'Grp', 'Pts', 'DG', 'GF', 'Estado'],
      },
      featureTitles: ['Paginas utiles por herramienta', 'Modo probabilidades', 'Porras privadas', 'Reglas del formato'],
      featureBodies: [
        'Cada herramienta tiene una pagina propia: simulador, predictor, bracket, grupos, terceros y Monte Carlo.',
        'Usa ratings, forma y probabilidades como punto de partida para simulaciones rapidas.',
        'Comparte predicciones con amigos, grupos o porras privadas.',
        'El formato 2026 se calcula una vez: 12 grupos, mejores terceros y ronda de 32.',
      ],
      seoPlan: {
        title: 'Reglas claras dentro del producto',
        body: 'Cada pagina combina una herramienta usable, explicaciones del formato, preguntas frecuentes y enlaces al siguiente paso.',
        items: [
          ['Herramienta principal', 'simulador mundial 2026'],
          ['Herramientas', 'predictor, bracket, fase de grupos'],
          ['Regla clave', 'calculadora de mejores terceros'],
          ['Compartir', 'predicciones compartibles y porras privadas'],
        ],
      },
      faq: [
        {
          q: 'Puedo simular todo el Mundial 2026?',
          a: 'Si. Puedes introducir marcadores de grupos, ver clasificaciones, calcular terceros y proyectar el cuadro eliminatorio.',
        },
        {
          q: 'Que calcula la pagina de mejores terceros?',
          a: 'Ordena los terceros por puntos, diferencia de goles y goles a favor, y marca los ocho clasificados.',
        },
        {
          q: 'Cada idioma esta localizado?',
          a: 'Si. Cada version traduce titulos, descripciones, controles, preguntas frecuentes y enlaces relacionados.',
        },
      ],
    },
    pt: {
      nav: {
        home: 'Simulador',
        predictor: 'Previsor',
        bracket: 'Chaveamento',
        groupStage: 'Grupos',
        thirdPlace: 'Terceiros',
        monteCarlo: 'Monte Carlo',
        pools: 'Boloes',
        faq: 'FAQ',
      },
      cta: 'Abrir simulador',
      secondaryCta: 'Ver como funciona',
      statLabel: 'Formato pronto',
      statValue: '48 selecoes / 104 jogos',
      sampleNote: 'Dados de demonstracao. Troque pelo calendario oficial quando estiver confirmado.',
      liveIntent: 'Simulador + Previsor',
      predictor: {
        title: 'Simulador interativo de grupos',
        body: 'Digite placares, calcule tabelas e gere o caminho eliminatorio desde a fase de grupos.',
        reset: 'Reiniciar palpites',
        champion: 'Campeao escolhido',
        finalist: 'Finalista',
        round32: 'Ronda de 32 automatica',
      },
      thirdPlace: {
        title: 'Calculadora dos melhores terceiros',
        body: 'Compare pontos, saldo de gols e gols marcados para encontrar os oito terceiros classificados.',
        columns: ['Selecao', 'Grp', 'Pts', 'SG', 'GF', 'Estado'],
      },
      featureTitles: ['Paginas uteis por ferramenta', 'Modo probabilidades', 'Boloes privados', 'Regras do formato'],
      featureBodies: [
        'Cada ferramenta tem sua propria pagina: simulador, previsor, chaveamento, grupos, terceiros e Monte Carlo.',
        'Use ratings, forma e probabilidades como base para uma simulacao rapida.',
        'Compartilhe previsoes com amigos, equipes ou boloes privados.',
        'O formato 2026 fica codificado: 12 grupos, melhores terceiros e ronda de 32.',
      ],
      seoPlan: {
        title: 'Regras claras dentro do produto',
        body: 'Cada pagina combina uma ferramenta utilizavel, explicacoes do formato, perguntas frequentes e links para o proximo passo.',
        items: [
          ['Ferramenta principal', 'simulador copa do mundo 2026'],
          ['Ferramentas', 'previsor, chaveamento, fase de grupos'],
          ['Regra-chave', 'calculadora melhores terceiros'],
          ['Compartilhamento', 'previsoes compartilhaveis e boloes privados'],
        ],
      },
      faq: [
        {
          q: 'Posso simular toda a Copa do Mundo 2026?',
          a: 'Sim. Voce pode inserir placares de grupos, ver tabelas, calcular terceiros e projetar o mata-mata.',
        },
        {
          q: 'Como funciona a calculadora de melhores terceiros?',
          a: 'Ela ordena os terceiros por pontos, saldo de gols e gols marcados, marcando os oito classificados.',
        },
        {
          q: 'Cada idioma esta localizado?',
          a: 'Sim. Cada versao traduz titulos, descricoes, controles, perguntas frequentes e links relacionados.',
        },
      ],
    },
    fr: {
      nav: {
        home: 'Simulateur',
        predictor: 'Pronostic',
        bracket: 'Tableau',
        groupStage: 'Groupes',
        thirdPlace: 'Troisiemes',
        monteCarlo: 'Monte Carlo',
        pools: 'Pools prives',
        faq: 'FAQ',
      },
      cta: 'Ouvrir le simulateur',
      secondaryCta: 'Voir la methode',
      statLabel: 'Format pret',
      statValue: '48 equipes / 104 matchs',
      sampleNote: 'Donnees de demonstration. Remplacez-les par le calendrier officiel confirme.',
      liveIntent: 'Simulateur + Pronostic',
      predictor: {
        title: 'Simulateur interactif des groupes',
        body: 'Saisissez les scores, calculez les classements et generezez le chemin vers le tableau final.',
        reset: 'Reinitialiser',
        champion: 'Champion choisi',
        finalist: 'Finaliste',
        round32: 'Ronde de 32 automatique',
      },
      thirdPlace: {
        title: 'Calculateur des meilleurs troisiemes',
        body: 'Comparez points, difference de buts et buts marques pour trouver les huit troisiemes qualifies.',
        columns: ['Equipe', 'Grp', 'Pts', 'DB', 'BP', 'Statut'],
      },
      featureTitles: ['Pages utiles par outil', 'Mode probabilites', 'Pools prives', 'Regles du format'],
      featureBodies: [
        'Chaque outil a sa propre page: simulateur, pronostic, tableau, groupes, troisiemes et Monte Carlo.',
        'Ajoutez des notes de force, la forme et les probabilites pour creer un point de depart.',
        'Partagez les pronostics avec des amis ou des pools prives.',
        'Le format 2026 est encode: 12 groupes, meilleurs troisiemes et ronde de 32.',
      ],
      seoPlan: {
        title: 'Regles claires dans le produit',
        body: 'Chaque page associe un outil utilisable, les regles du format, des questions frequentes et des liens vers la suite.',
        items: [
          ['Outil principal', 'simulateur coupe du monde 2026'],
          ['Outils', 'pronostic, tableau, phase de groupes'],
          ['Regle cle', 'calculateur meilleurs troisiemes'],
          ['Partage', 'resultats partageables et pools prives'],
        ],
      },
      faq: [
        {
          q: 'Puis-je simuler toute la Coupe du Monde 2026?',
          a: 'Oui. Vous pouvez saisir les scores des groupes, calculer les classements, les troisiemes et le tableau final.',
        },
        {
          q: 'Comment les meilleurs troisiemes sont-ils classes?',
          a: 'Par points, difference de buts, buts marques, puis par les criteres restants du format.',
        },
        {
          q: 'Chaque langue est-elle localisee?',
          a: 'Oui. Chaque version traduit les titres, descriptions, controles, FAQ et liens associes.',
        },
      ],
    },
    de: {
      nav: {
        home: 'Simulator',
        predictor: 'Tipps',
        bracket: 'Turnierbaum',
        groupStage: 'Gruppen',
        thirdPlace: 'Dritte',
        monteCarlo: 'Monte Carlo',
        pools: 'Private Tippspiele',
        faq: 'FAQ',
      },
      cta: 'Simulator offnen',
      secondaryCta: 'Methode ansehen',
      statLabel: 'Format bereit',
      statValue: '48 Teams / 104 Spiele',
      sampleNote: 'Demo-Daten. Nach Bestatigung kann der offizielle Spielplan eingesetzt werden.',
      liveIntent: 'Simulator + Tipps',
      predictor: {
        title: 'Interaktiver Gruppensimulator',
        body: 'Trage Ergebnisse ein, berechne Tabellen und erstelle den Weg in die K.o.-Phase.',
        reset: 'Tipps zurucksetzen',
        champion: 'Champion-Tipp',
        finalist: 'Finalist',
        round32: 'Runde der 32 automatisch',
      },
      thirdPlace: {
        title: 'Rechner fur die besten Drittplatzierten',
        body: 'Vergleiche Punkte, Tordifferenz und Tore, um die acht besten Drittplatzierten zu finden.',
        columns: ['Team', 'Grp', 'Pkt', 'TD', 'TF', 'Status'],
      },
      featureTitles: ['Nutzliche Tool-Seiten', 'Wahrscheinlichkeitsmodus', 'Private Tippspiele', 'Formatregeln'],
      featureBodies: [
        'Jedes Tool hat eine eigene Seite: Simulator, Tipps, Turnierbaum, Gruppen, Dritte und Monte Carlo.',
        'Ratings, Form und Quoten liefern einen schnellen Startpunkt.',
        'Teile Vorhersagen mit Freunden oder privaten Tippspielen.',
        'Das 2026-Format wird abgebildet: 12 Gruppen, beste Dritte und Runde der 32.',
      ],
      seoPlan: {
        title: 'Klare Regeln direkt im Produkt',
        body: 'Jede Seite verbindet ein nutzbares Tool mit Formatregeln, FAQ, transparenten Annahmen und Links zum nachsten Schritt.',
        items: [
          ['Haupttool', 'wm 2026 simulator'],
          ['Tools', 'tipps, turnierbaum, gruppenphase'],
          ['Wichtige Regel', 'beste dritte rechner'],
          ['Sharing', 'teilbare Vorhersagen und private Tippspiele'],
        ],
      },
      faq: [
        {
          q: 'Kann ich die ganze WM 2026 simulieren?',
          a: 'Ja. Ergebnisse, Tabellen, beste Drittplatzierte und der K.o.-Weg konnen simuliert werden.',
        },
        {
          q: 'Wie werden die besten Dritten berechnet?',
          a: 'Nach Punkten, Tordifferenz und erzielten Toren, danach nach weiteren Kriterien.',
        },
        {
          q: 'Ist jede Sprache lokalisiert?',
          a: 'Ja. Jede Version ubersetzt Titel, Beschreibungen, Steuerelemente, FAQ und verwandte Links.',
        },
      ],
    },
    it: {
      nav: {
        home: 'Simulatore',
        predictor: 'Pronostici',
        bracket: 'Tabellone',
        groupStage: 'Gironi',
        thirdPlace: 'Terze',
        monteCarlo: 'Monte Carlo',
        pools: 'Gruppi privati',
        faq: 'FAQ',
      },
      cta: 'Apri simulatore',
      secondaryCta: 'Vedi il metodo',
      statLabel: 'Formato pronto',
      statValue: '48 squadre / 104 partite',
      sampleNote: 'Dati demo. Sostituiscili con il calendario ufficiale quando sara confermato.',
      liveIntent: 'Simulatore + Pronostici',
      predictor: {
        title: 'Simulatore interattivo dei gironi',
        body: 'Inserisci risultati, calcola classifiche e crea il percorso verso il tabellone finale.',
        reset: 'Reimposta scelte',
        champion: 'Campione scelto',
        finalist: 'Finalista',
        round32: 'Sedicesimi automatici',
      },
      thirdPlace: {
        title: 'Calcolatore migliori terze',
        body: 'Confronta punti, differenza reti e gol fatti per trovare le otto migliori terze.',
        columns: ['Squadra', 'Grp', 'Pt', 'DR', 'GF', 'Stato'],
      },
      featureTitles: ['Pagine utili per strumento', 'Modalita probabilita', 'Gruppi privati', 'Regole del formato'],
      featureBodies: [
        'Ogni strumento ha una pagina dedicata: simulatore, pronostici, tabellone, gironi, terze e Monte Carlo.',
        'Rating, forma e quote danno una base rapida alla simulazione.',
        'Condividi pronostici con amici o gruppi privati.',
        'Il formato 2026 e codificato: 12 gironi, migliori terze e sedicesimi.',
      ],
      seoPlan: {
        title: 'Regole chiare dentro il prodotto',
        body: 'Ogni pagina unisce uno strumento utilizzabile, regole del formato, FAQ, ipotesi trasparenti e link al passo successivo.',
        items: [
          ['Strumento principale', 'simulatore mondiali 2026'],
          ['Strumenti', 'pronostici, tabellone, fase a gironi'],
          ['Regola chiave', 'calcolatore migliori terze'],
          ['Condivisione', 'pronostici condivisibili e gruppi privati'],
        ],
      },
      faq: [
        {
          q: 'Posso simulare tutti i Mondiali 2026?',
          a: 'Si. Puoi inserire risultati dei gironi, calcolare classifiche, migliori terze e tabellone.',
        },
        {
          q: 'Come si calcolano le migliori terze?',
          a: 'Per punti, differenza reti e gol fatti, con ulteriori criteri in caso di parita.',
        },
        {
          q: 'Ogni lingua e localizzata?',
          a: 'Si. Ogni versione traduce titoli, descrizioni, controlli, FAQ e link correlati.',
        },
      ],
    },
    nl: {
      nav: {
        home: 'Simulator',
        predictor: 'Voorspeller',
        bracket: 'Schema',
        groupStage: 'Groepen',
        thirdPlace: 'Derden',
        monteCarlo: 'Monte Carlo',
        pools: 'Privepools',
        faq: 'FAQ',
      },
      cta: 'Open simulator',
      secondaryCta: 'Bekijk de methode',
      statLabel: 'Format klaar',
      statValue: '48 teams / 104 wedstrijden',
      sampleNote: 'Demodata. Vervang dit door het officiele schema zodra het vaststaat.',
      liveIntent: 'Simulator + Voorspeller',
      predictor: {
        title: 'Interactieve groepssimulator',
        body: 'Vul scores in, bereken standen en maak de route naar de knock-outfase.',
        reset: 'Keuzes resetten',
        champion: 'Kampioen keuze',
        finalist: 'Finalist',
        round32: 'Ronde van 32 automatisch',
      },
      thirdPlace: {
        title: 'Calculator beste derde plaatsen',
        body: 'Vergelijk punten, doelsaldo en goals voor om de acht beste derden te vinden.',
        columns: ['Team', 'Grp', 'Pnt', 'DS', 'DV', 'Status'],
      },
      featureTitles: ['Nuttige toolpagina’s', 'Kansenmodus', 'Privepools', 'Formatregels'],
      featureBodies: [
        'Elke tool krijgt een eigen pagina: simulator, voorspeller, schema, groepen, derden en Monte Carlo.',
        'Ratings, vorm en kansen maken een snelle simulatiebasis.',
        'Deel voorspellingen met vrienden of privepools.',
        'Het 2026-format is ingebouwd: 12 groepen, beste derden en ronde van 32.',
      ],
      seoPlan: {
        title: 'Heldere regels in het product',
        body: 'Elke pagina combineert een bruikbare tool met formatregels, FAQ, transparante aannames en links naar de volgende stap.',
        items: [
          ['Hoofdtool', 'wk 2026 simulator'],
          ['Tools', 'voorspeller, schema, groepsfase'],
          ['Belangrijke regel', 'beste derde plaatsen calculator'],
          ['Delen', 'deelbare voorspellingen en privepools'],
        ],
      },
      faq: [
        {
          q: 'Kan ik het hele WK 2026 simuleren?',
          a: 'Ja. Je kunt groepsscores, standen, beste derden en het knock-outschema simuleren.',
        },
        {
          q: 'Hoe worden beste derde plaatsen berekend?',
          a: 'Op punten, doelsaldo en doelpunten voor, daarna met aanvullende criteria.',
        },
        {
          q: 'Is elke taal gelokaliseerd?',
          a: 'Ja. Elke versie vertaalt titels, beschrijvingen, bediening, FAQ en gerelateerde links.',
        },
      ],
    },
    ja: {
      nav: {
        home: 'シミュレーター',
        predictor: '予想',
        bracket: 'トーナメント表',
        groupStage: 'グループ',
        thirdPlace: '3位通過',
        monteCarlo: 'モンテカルロ',
        pools: 'プライベート予想',
        faq: 'FAQ',
      },
      cta: 'シミュレーターを開く',
      secondaryCta: '計算方法を見る',
      statLabel: '形式対応',
      statValue: '48チーム / 104試合',
      sampleNote: 'デモデータです。公式日程が確定したら差し替えてください。',
      liveIntent: 'シミュレーター + 予想',
      predictor: {
        title: 'グループステージ シミュレーター',
        body: 'スコアを入力し、順位表と決勝トーナメントへの道筋を計算できます。',
        reset: '予想をリセット',
        champion: '優勝予想',
        finalist: '決勝進出',
        round32: '32強を自動生成',
      },
      thirdPlace: {
        title: 'ベスト3位 計算機',
        body: '勝点、得失点差、得点で3位チームを比較し、通過する8チームを確認できます。',
        columns: ['チーム', '組', '点', '差', '得', '状態'],
      },
      featureTitles: ['使いやすいツールページ', '確率モード', 'プライベート予想', '大会形式ルール'],
      featureBodies: [
        'シミュレーター、予想、トーナメント表、グループ、3位通過、モンテカルロをそれぞれ専用ページで扱います。',
        'レーティング、調子、確率を使って素早くシミュレーションできます。',
        '友人やグループと予想を共有できます。',
        '2026年形式の12グループ、ベスト3位、32強を反映します。',
      ],
      seoPlan: {
        title: 'ルールと計算方法を明確に表示',
        body: '各ページは使えるツール、形式ルール、FAQ、前提条件、次に進むリンクをまとめています。',
        items: [
          ['主要ツール', 'ワールドカップ 2026 シミュレーター'],
          ['ツール', '予想、トーナメント表、グループステージ'],
          ['重要ルール', 'ベスト3位 計算機'],
          ['共有', '共有可能な予想とプライベート予想'],
        ],
      },
      faq: [
        {
          q: '2026年ワールドカップ全体をシミュレーションできますか?',
          a: 'はい。グループのスコア、順位、ベスト3位、決勝トーナメントを計算できます。',
        },
        {
          q: 'ベスト3位はどう計算しますか?',
          a: '勝点、得失点差、得点の順に比較し、上位8チームを通過扱いにします。',
        },
        {
          q: '各言語はローカライズされていますか?',
          a: 'はい。各言語版でタイトル、説明、操作ラベル、FAQ、関連リンクを翻訳しています。',
        },
      ],
    },
    ko: {
      nav: {
        home: '시뮬레이터',
        predictor: '예측',
        bracket: '대진표',
        groupStage: '조별리그',
        thirdPlace: '3위 진출',
        monteCarlo: '몬테카를로',
        pools: '비공개 풀',
        faq: 'FAQ',
      },
      cta: '시뮬레이터 열기',
      secondaryCta: '계산 방식 보기',
      statLabel: '포맷 준비',
      statValue: '48팀 / 104경기',
      sampleNote: '데모 데이터입니다. 공식 일정 확정 후 교체하세요.',
      liveIntent: '시뮬레이터 + 예측',
      predictor: {
        title: '조별리그 인터랙티브 시뮬레이터',
        body: '스코어를 입력하고 순위표와 토너먼트 경로를 계산하세요.',
        reset: '예측 초기화',
        champion: '우승 예측',
        finalist: '결승 진출',
        round32: '32강 자동 생성',
      },
      thirdPlace: {
        title: '최고 3위 팀 계산기',
        body: '승점, 골득실, 득점으로 3위 팀을 비교하고 8개 진출팀을 확인하세요.',
        columns: ['팀', '조', '승점', '득실', '득점', '상태'],
      },
      featureTitles: ['사용하기 쉬운 도구 페이지', '확률 모드', '비공개 풀', '포맷 규칙'],
      featureBodies: [
        '시뮬레이터, 예측, 대진표, 조별리그, 3위 진출, 몬테카를로를 각각 전용 페이지로 제공합니다.',
        '레이팅, 최근 폼, 확률을 기반으로 빠르게 시뮬레이션합니다.',
        '친구나 비공개 풀과 예측을 공유합니다.',
        '2026년 포맷의 12개 조, 최고 3위, 32강을 반영합니다.',
      ],
      seoPlan: {
        title: '규칙과 계산 방식을 명확하게 표시',
        body: '각 페이지는 실제 도구, 대회 규칙, FAQ, 투명한 가정, 다음 단계 링크를 함께 제공합니다.',
        items: [
          ['메인 도구', '월드컵 2026 시뮬레이터'],
          ['도구', '예측, 대진표, 조별리그'],
          ['핵심 규칙', '최고 3위 팀 계산기'],
          ['공유', '공유 가능한 예측과 비공개 풀'],
        ],
      },
      faq: [
        {
          q: '월드컵 2026 전체를 시뮬레이션할 수 있나요?',
          a: '네. 조별 스코어, 순위표, 최고 3위, 토너먼트 경로를 계산할 수 있습니다.',
        },
        {
          q: '최고 3위 팀은 어떻게 계산하나요?',
          a: '승점, 골득실, 득점 순으로 비교하고 상위 8팀을 진출로 표시합니다.',
        },
        {
          q: '각 언어가 현지화되어 있나요?',
          a: '네. 각 언어 버전은 제목, 설명, 조작 라벨, FAQ, 관련 링크를 번역합니다.',
        },
      ],
    },
    zh: {
      nav: {
        home: '模拟器',
        predictor: '预测器',
        bracket: '对阵表',
        groupStage: '小组赛',
        thirdPlace: '最佳第三名',
        monteCarlo: '蒙特卡洛',
        pools: '私人预测池',
        faq: 'FAQ',
      },
      cta: '打开模拟器',
      secondaryCta: '查看计算方法',
      statLabel: '赛制已适配',
      statValue: '48 支球队 / 104 场比赛',
      sampleNote: '当前为演示数据。官方赛程确认后可替换为真实赛程。',
      liveIntent: '模拟器 + 预测器',
      predictor: {
        title: '交互式小组赛模拟器',
        body: '输入比分，自动计算积分榜、最佳第三名和淘汰赛晋级路径。',
        reset: '重置预测',
        champion: '冠军预测',
        finalist: '决赛队伍',
        round32: '自动生成 32 强',
      },
      thirdPlace: {
        title: '最佳第三名计算器',
        body: '按积分、净胜球和进球数比较各组第三名，找出晋级 32 强的 8 支球队。',
        columns: ['球队', '组', '积分', '净胜球', '进球', '状态'],
      },
      featureTitles: ['实用工具页面', '概率模式', '私人预测池', '赛制规则'],
      featureBodies: [
        '模拟器、预测器、对阵表、小组赛、最佳第三名、蒙特卡洛都有独立页面，方便按任务进入。',
        '用球队强度、近期状态和概率作为快速模拟的起点。',
        '和朋友、同事或私人预测池分享预测结果。',
        '一次性编码 2026 赛制：12 个小组、最佳第三名和 32 强淘汰赛。',
      ],
      seoPlan: {
        title: '把规则、工具和说明做清楚',
        body: '每个页面都提供可操作工具、赛制解释、常见问题、透明假设和下一步入口。',
        items: [
          ['核心工具', '世界杯模拟器 / 2026 世界杯模拟器'],
          ['工具页面', '预测器、对阵表、小组赛'],
          ['关键规则', '最佳第三名计算器'],
          ['分享闭环', '可分享预测结果和私人预测池'],
        ],
      },
      faq: [
        {
          q: '可以模拟完整的 2026 世界杯吗?',
          a: '可以。你可以输入小组赛比分，计算积分榜、最佳第三名，并生成淘汰赛路径。',
        },
        {
          q: '最佳第三名怎么算?',
          a: '先按积分排序，再看净胜球和进球数，并把前 8 名标记为晋级。',
        },
        {
          q: '每种语言都完成本地化了吗?',
          a: '是的。各语言版本会翻译标题、描述、按钮、工具说明、FAQ 和相关页面入口。',
        },
      ],
    },
  } as const;

  const selected = copy[group] ?? copy.en;
  return {
    nav: selected.nav,
    cta: selected.cta,
    secondaryCta: selected.secondaryCta,
    statLabel: selected.statLabel,
    statValue: selected.statValue,
    sampleNote: selected.sampleNote,
    liveIntent: selected.liveIntent,
    predictor: selected.predictor,
    thirdPlace: selected.thirdPlace,
    features: englishCopy.features.map((feature, index) => ({
      icon: feature.icon,
      title: selected.featureTitles[index] ?? feature.title,
      body: selected.featureBodies[index] ?? feature.body,
    })),
    seoPlan: selected.seoPlan,
    faq: selected.faq,
  };
}

function localizedPage(
  h1: string,
  description: string,
  keywords: string
): PageSeo {
  return {
    title: h1,
    description,
    keywords,
    h1,
    eyebrow: h1,
    body: description,
  };
}

function simpleLocalizedPages(
  group: LocaleConfig['languageGroup'],
  h1: string,
  description: string
): Record<PageKey, PageSeo> {
  const labels = {
    fr: [
      ['Pronostic Coupe du Monde 2026', 'Creez vos pronostics pour les groupes, le tableau final et le champion de la Coupe du Monde 2026.'],
      ['Tableau Coupe du Monde 2026', 'Construisez le tableau de la Coupe du Monde 2026 avec la ronde de 32, les huitiemes, les demies et la finale.'],
      ['Simulateur Phase de Groupes Coupe du Monde 2026', 'Simulez les 12 groupes, les classements, les criteres de departage et les qualifies.'],
      ['Calculateur des Meilleurs Troisiemes', 'Classez les troisiemes de groupe et trouvez les huit equipes qualifiees pour la ronde de 32.'],
      ['Simulateur Monte Carlo Coupe du Monde 2026', 'Lancez des simulations repetees et comparez les probabilites de chaque equipe.'],
    ],
    de: [
      ['WM 2026 Tipp Simulator', 'Erstelle deine WM 2026 Tipps fur Gruppen, K.o.-Runden, Finalisten und Champion.'],
      ['WM Baum Rechner 2026', 'Baue den WM 2026 Turnierbaum von der Gruppenphase bis zum Finale und verfolge jede K.o.-Runde.'],
      ['WM 2026 Gruppenphase Simulator', 'Simuliere alle 12 Gruppen, Tabellen, Tie-Breaker, beste Drittplatzierte und qualifizierte Teams.'],
      ['Beste Dritte Rechner', 'Berechne die acht besten Drittplatzierten fur die Runde der 32.'],
      ['WM 2026 Monte Carlo Simulator', 'Fuhre viele Simulationen aus und vergleiche Titel- und Rundenwahrscheinlichkeiten.'],
    ],
    it: [
      ['Pronostico Mondiali 2026', 'Crea pronostici per gironi, tabellone, finalisti e campione dei Mondiali 2026.'],
      ['Tabellone Mondiali 2026', 'Costruisci il tabellone dei Mondiali 2026 dalla fase a gironi alla finale.'],
      ['Simulatore Fase a Gironi Mondiali 2026', 'Simula i 12 gironi, classifiche, spareggi e qualificate.'],
      ['Calcolatore Migliori Terze', 'Classifica le terze e trova le otto squadre qualificate ai sedicesimi.'],
      ['Simulatore Monte Carlo Mondiali 2026', 'Esegui simulazioni ripetute e confronta le probabilita di ogni squadra.'],
    ],
    nl: [
      ['WK 2026 Voorspeller', 'Maak voorspellingen voor groepen, knock-out rondes, finalisten en kampioen.'],
      ['WK 2026 Speelschema Voorspeller', 'Bouw het WK 2026 schema van groepsfase tot finale.'],
      ['WK 2026 Groepsfase Simulator', 'Simuleer alle 12 groepen, standen, tiebreakers en geplaatste teams.'],
      ['Beste Derde Plaatsen Calculator', 'Rangschik derde plaatsen en vind de acht teams voor de knock-out fase.'],
      ['WK 2026 Monte Carlo Simulator', 'Draai herhaalde simulaties en vergelijk kansen per ronde.'],
    ],
    ja: [
      ['ワールドカップ 2026 予想', 'グループ、決勝トーナメント、ファイナリスト、優勝国を予想できます。'],
      ['ワールドカップ 2026 トーナメント表', 'グループステージから決勝まで、32強のトーナメント表を作成できます。'],
      ['ワールドカップ 2026 グループステージ シミュレーター', '12グループの順位、タイブレーク、通過チームをシミュレーションできます。'],
      ['ベスト3位 計算機', '各グループ3位を順位付けし、32強へ進む8チームを確認できます。'],
      ['ワールドカップ 2026 モンテカルロ シミュレーター', '多数のシミュレーションで各チームの勝ち上がり確率を比較できます。'],
    ],
    ko: [
      ['월드컵 2026 예측기', '조별리그, 토너먼트, 결승 진출 팀, 우승 팀을 예측하세요.'],
      ['월드컵 2026 대진표 예측기', '조별리그부터 결승까지 32강 토너먼트 대진을 만드세요.'],
      ['월드컵 2026 조별리그 시뮬레이터', '12개 조 순위, 타이브레이커, 진출 팀을 시뮬레이션하세요.'],
      ['최고 3위 팀 계산기', '각 조 3위 팀을 순위화하고 32강에 오를 8팀을 확인하세요.'],
      ['월드컵 2026 몬테카를로 시뮬레이터', '반복 시뮬레이션으로 팀별 라운드 진출 확률을 비교하세요.'],
    ],
    zh: [
      ['2026 世界杯预测器', '预测小组赛、淘汰赛、决赛队伍和冠军，并分享你的世界杯 picks。'],
      ['2026 世界杯对阵预测器', '从小组赛到决赛生成 32 强淘汰赛对阵表，包含最佳第三名晋级路径。'],
      ['2026 世界杯小组赛模拟器', '模拟 12 个小组的积分榜、出线名额和晋级 32 强的规则。'],
      ['世界杯最佳第三名计算器', '按积分、净胜球和进球数计算 2026 世界杯晋级 32 强的 8 支最佳第三名球队。'],
      ['2026 世界杯蒙特卡洛模拟器', '运行多次世界杯模拟，比较每支球队夺冠和晋级各轮的概率。'],
    ],
  } as const;
  const selected = labels[group as keyof typeof labels] ?? labels.fr;
  if (group === 'de') {
    return {
      home: {
        title: 'WM 2026 Simulator & Baum Rechner - Gruppen, K.o.-Runde und Finale tippen',
        description: 'Simuliere die WM 2026 mit Gruppenphase, besten Drittplatzierten, K.o.-Runde, Ergebnissen und Turnierbaum. Kostenloser WM 2026 Rechner.',
        keywords: 'wm 2026 simulator, wm baum rechner, wm plan rechner, wm tipp simulator, wm gruppenphase simulator',
        h1: 'WM 2026 Simulator und Turnierbaum Rechner',
        eyebrow: 'WM 2026 Simulator',
        body: 'Sortiere zuerst die Gruppen, berechne die besten Drittplatzierten und baue danach den kompletten WM-Baum bis zum Finale.',
      },
      predictor: localizedPage(selected[0][0], selected[0][1], 'wm tipp simulator, wm 2026 predictor, wm tipps, wm vorhersage'),
      bracket: localizedPage(selected[1][0], selected[1][1], 'wm baum rechner, wm 2026 turnierbaum, wm plan rechner, wm k.o.-runde'),
      groupStage: localizedPage(selected[2][0], selected[2][1], 'wm gruppenphase simulator, wm 2026 gruppen rechner, wm tabellen rechner'),
      thirdPlace: localizedPage(selected[3][0], selected[3][1], 'beste dritte rechner, wm 2026 beste drittplatzierte, runde der 32 rechner'),
      monteCarlo: localizedPage(selected[4][0], selected[4][1], 'wm monte carlo simulator, wm wahrscheinlichkeiten, wm 2026 simulation'),
    };
  }
  return {
    home: localizedPage(h1, description, `${h1}, ${description}`),
    predictor: localizedPage(selected[0][0], selected[0][1], `${selected[0][0]}, ${selected[0][1]}`),
    bracket: localizedPage(selected[1][0], selected[1][1], `${selected[1][0]}, ${selected[1][1]}`),
    groupStage: localizedPage(selected[2][0], selected[2][1], `${selected[2][0]}, ${selected[2][1]}`),
    thirdPlace: localizedPage(selected[3][0], selected[3][1], `${selected[3][0]}, ${selected[3][1]}`),
    monteCarlo: localizedPage(selected[4][0], selected[4][1], `${selected[4][0]}, ${selected[4][1]}`),
  };
}
