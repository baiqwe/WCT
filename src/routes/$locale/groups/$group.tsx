import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import {
  defaultLocale,
  getGroupPredictionBySlug,
  getGroupPredictionPath,
  getLocaleConfig,
  getPagePath,
  getWorldCupContent,
  normalizeLocale,
  publicLocales,
  sampleGroups,
  type Locale,
} from '@/lib/world-cup-content';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { getGroupMatches, getTeamStrength, type WorldCupMatch } from '@/lib/world-cup-data';
import { IconArrowLeft, IconArrowRight, IconChartBar, IconTargetArrow } from '@tabler/icons-react';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

type GroupScore = WorldCupMatch & {
  awayScore: number;
  homeScore: number;
  userPredicted?: boolean;
};

type GroupStanding = {
  team: string;
  played: number;
  points: number;
  goalDifference: number;
  goalsFor: number;
  rank: number;
};

export const Route = createFileRoute('/$locale/groups/$group')({
  beforeLoad: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const group = getGroupPredictionBySlug(params.group);
    if (!group) throw notFound();

    const canonicalPath = getGroupPredictionPath(locale, group.slug);
    if (`/${params.locale}/groups/${params.group}` !== canonicalPath) {
      throw redirect({ to: canonicalPath });
    }
  },
  head: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const group = getGroupPredictionBySlug(params.group);
    if (!group) return {};

    const copy = getGroupPredictionCopy(locale, group.group);
    const path = getGroupPredictionPath(locale, group.slug);
    const metadata = seo(path, {
      title: copy.title,
      description: copy.description,
      keywords: copy.keywords,
    });
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: websiteConfig.metadata?.name ?? 'World Cup 2026 Simulator',
          item: getCanonicalUrl(getPagePath(defaultLocale, 'home')),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: copy.h1,
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
          href: getCanonicalUrl(getGroupPredictionPath(candidate, group.slug)),
        })),
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: getCanonicalUrl(getGroupPredictionPath(defaultLocale, group.slug)),
        },
      ],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(faqJsonLd) },
        { type: 'application/ld+json', children: JSON.stringify(breadcrumbJsonLd) },
      ],
    };
  },
  component: GroupPredictionPage,
});

function GroupPredictionPage() {
  const { locale, group: groupSlug } = Route.useParams();
  const activeLocale = normalizeLocale(locale);
  const groupPage = getGroupPredictionBySlug(groupSlug);
  if (!groupPage) throw notFound();

  const copy = getGroupPredictionCopy(activeLocale, groupPage.group);
  const t = getWorldCupContent(activeLocale, 'home');
  const group = sampleGroups.find((item) => item.group === groupPage.group);
  const initialScores = useMemo(
    () => createInitialScores(groupPage.group),
    [groupPage.group]
  );
  const [scores, setScores] = useState(initialScores);
  useEffect(() => {
    const storedScores = loadGroupScores(groupPage.group, initialScores);
    if (storedScores) setScores(storedScores);
  }, [groupPage.group, initialScores]);
  useEffect(() => {
    let isMounted = true;
    fetch('/api/world-cup-live')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { matches?: Partial<GroupScore>[] } | null) => {
        if (!isMounted || !payload?.matches?.length) return;
        setScores((current) =>
          current.map((match) => {
            const liveMatch = payload.matches?.find((item) => item.id === match.id);
            if (!liveMatch) return match;
            return {
              ...match,
              awayScore:
                typeof liveMatch.awayScore === 'number'
                  ? liveMatch.awayScore
                  : match.awayScore,
              date: liveMatch.date ?? match.date,
              homeScore:
                typeof liveMatch.homeScore === 'number'
                  ? liveMatch.homeScore
                  : match.homeScore,
              source: liveMatch.source ?? match.source,
              status: liveMatch.status ?? match.status,
              userPredicted:
                liveMatch.status === 'finished' ? true : match.userPredicted,
              venue: liveMatch.venue ?? match.venue,
            };
          })
        );
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, []);
  const standings = useMemo(
    () => calculateGroupStandings(scores, group?.teams ?? []),
    [scores, group?.teams]
  );
  const projectedGoals = scores.reduce(
    (sum, match) => sum + match.homeScore + match.awayScore,
    0
  );

  return (
    <main className="min-h-screen bg-[#050907] text-[#f3f8ee]">
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-10 md:px-6 md:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(199,255,87,0.18),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(57,114,255,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%)]"
        />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/48">
            <a className="transition hover:text-white" href={getPagePath(defaultLocale, 'home')}>
              {websiteConfig.metadata?.name ?? 'World Cup 2026 Simulator'}
            </a>
            <span>/</span>
            <a className="transition hover:text-white" href={getPagePath(activeLocale, 'home')}>
              {copy.breadcrumbSimulator}
            </a>
            <span>/</span>
            <span className="text-[#d8ff80]">{copy.h1}</span>
          </nav>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge className="mb-5 border-[#c7ff57]/30 bg-[#c7ff57]/10 text-[#d8ff80]">
              {copy.badge}
            </Badge>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] text-white md:text-7xl">
              {copy.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/68">
              {copy.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className={buttonVariants({
                  className:
                    'h-11 rounded-md bg-[#c7ff57] px-5 text-sm font-semibold text-[#071007] hover:bg-[#d8ff80]',
                })}
                href={getPagePath(activeLocale, 'home')}
              >
                <IconArrowLeft className="size-4" />
                {copy.backToSimulator}
              </a>
              <a
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-md border-white/12 bg-white/[0.03] px-5 text-white hover:bg-white/10',
                })}
                href={getPagePath(activeLocale, 'bracket')}
              >
                {copy.openBracket}
                <IconArrowRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c120e]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="grid gap-3 md:grid-cols-3">
              <MetricCard icon={<IconTargetArrow className="size-5" />} label={copy.groupLabel} value={copy.groupValue} />
              <MetricCard icon={<IconChartBar className="size-5" />} label={copy.goalsLabel} value={`${projectedGoals}`} />
              <MetricCard icon={<IconArrowRight className="size-5" />} label={copy.qualifierLabel} value={standings[0]?.team ?? 'TBD'} />
            </div>
            <div className="mt-5 rounded-xl border border-white/8 bg-black/25 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#c7ff57]/75">
                {copy.rankingTitle}
              </p>
              <div className="mt-3 grid gap-2">
                {standings.map((row) => (
                  <div
                    key={row.team}
                    className={cn(
                      'grid grid-cols-[28px_1fr_42px_42px_42px] items-center rounded-lg border px-3 py-2 text-sm',
                      row.rank <= 2
                        ? 'border-[#c7ff57]/25 bg-[#c7ff57]/10'
                        : 'border-white/8 bg-white/[0.025]'
                    )}
                  >
                    <span className="font-mono text-xs text-white/45">{row.rank}</span>
                    <span className="truncate font-medium text-white">{row.team}</span>
                    <span className="text-white/65">{row.points}</span>
                    <span className="text-white/45">
                      {row.goalDifference > 0 ? '+' : ''}
                      {row.goalDifference}
                    </span>
                    <span className="text-white/45">{row.goalsFor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
              {copy.detailEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {copy.detailTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/62">
              {copy.detailBody}
            </p>
            <div className="mt-6 grid gap-3">
              <article className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                <h3 className="text-base font-semibold text-white">{copy.methodTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{copy.methodBody}</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                <h3 className="text-base font-semibold text-white">{copy.sourceTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{copy.sourceBody}</p>
              </article>
            </div>
          </div>
          <div className="grid gap-3">
            {scores.map((match) => (
              <article
                key={match.id}
                className="group rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-[#c7ff57]/30 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-[#c7ff57]/20 bg-[#c7ff57]/10 px-2.5 py-1 font-mono text-xs uppercase text-[#c7ff57]/72">
                    {copy.matchday} {match.matchday}
                  </span>
                  <span className="text-xs text-white/38">{match.venue}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr_72px_24px_72px_1fr] md:items-center">
                  <span className="truncate rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-right font-semibold text-white">
                    {match.home}
                  </span>
                  <ScoreBox
                    label={`${match.home} ${copy.goals}`}
                    value={match.homeScore}
                    onChange={(value) =>
                      setScores((current) => {
                        const next = updateGroupScore(
                          current,
                          match.id,
                          'homeScore',
                          value
                        );
                        saveGroupScores(groupPage.group, next);
                        return next;
                      })
                    }
                  />
                  <span className="text-center font-mono text-white/35">-</span>
                  <ScoreBox
                    label={`${match.away} ${copy.goals}`}
                    value={match.awayScore}
                    onChange={(value) =>
                      setScores((current) => {
                        const next = updateGroupScore(
                          current,
                          match.id,
                          'awayScore',
                          value
                        );
                        saveGroupScores(groupPage.group, next);
                        return next;
                      })
                    }
                  />
                  <span className="truncate rounded-lg border border-white/8 bg-black/20 px-3 py-2 font-semibold text-white">{match.away}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050907] px-4 py-14 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
                {copy.relatedEyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {copy.relatedTitle}
              </h2>
            </div>
            <a className="text-sm font-semibold text-[#c7ff57] hover:text-[#e7ffad]" href={getPagePath(activeLocale, 'groupStage')}>
              {copy.groupStageLink}
            </a>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sampleGroups.map((item) => (
              <a
                key={item.group}
                className={cn(
                  'rounded-xl border p-4 transition',
                  item.group === groupPage.group
                    ? 'border-[#c7ff57]/35 bg-[#c7ff57]/10 text-white'
                    : 'border-white/10 bg-white/[0.025] text-white/62 hover:border-[#c7ff57]/30 hover:text-white'
                )}
                href={getGroupPredictionPath(
                  activeLocale,
                  `group-${item.group.toLowerCase()}-goal-prediction`
                )}
              >
                <span className="font-mono text-xs uppercase text-[#c7ff57]/72">
                  {copy.groupLabel} {item.group}
                </span>
                <span className="mt-2 block truncate text-sm font-semibold">
                  {item.teams.slice(0, 2).join(' / ')}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#07100b] px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {copy.faq.map((item) => (
            <article
              key={item.q}
              className="rounded-lg border border-white/10 bg-white/[0.025] p-5"
            >
              <h3 className="text-lg font-semibold text-white">{item.q}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between text-[#c7ff57]">
        <p className="font-mono text-xs uppercase text-white/42">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ScoreBox({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <input
      aria-label={label}
      className="h-11 rounded-md border border-white/10 bg-black/25 text-center font-mono text-base text-white outline-none focus:border-[#c7ff57]/70"
      max={12}
      min={0}
      onChange={(event) => onChange(Number(event.target.value))}
      type="number"
      value={value}
    />
  );
}

function createInitialScores(group: string): GroupScore[] {
  return getGroupMatches(group).map((match) => {
    const homeStrength = getTeamStrength(match.home);
    const awayStrength = getTeamStrength(match.away);
    return {
      ...match,
      homeScore:
        match.homeScore ?? Math.max(0, Math.round((homeStrength - awayStrength + 18) / 18)),
      awayScore:
        match.awayScore ?? Math.max(0, Math.round((awayStrength - homeStrength + 14) / 20)),
      userPredicted: match.status === 'finished',
    };
  });
}

function updateGroupScore(
  scores: GroupScore[],
  matchId: string,
  field: 'awayScore' | 'homeScore',
  value: number
) {
  return scores.map((match) =>
    match.id === matchId
      ? { ...match, [field]: Number.isFinite(value) ? Math.max(0, Math.min(12, value)) : 0, userPredicted: true }
      : match
  );
}

function getGroupScoreStorageKey(group: string) {
  return `wct:group-scores:${group}`;
}

function saveGroupScores(group: string, scores: GroupScore[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getGroupScoreStorageKey(group),
      JSON.stringify(
        scores.map((match) => ({
          awayScore: match.awayScore,
          homeScore: match.homeScore,
          id: match.id,
          userPredicted: match.userPredicted,
        }))
      )
    );
  } catch {
    // Persistence is optional; score editing still works in memory.
  }
}

function loadGroupScores(group: string, fallbackScores: GroupScore[]) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getGroupScoreStorageKey(group));
    if (!raw) return null;
    const stored = JSON.parse(raw) as Array<{
      awayScore?: number;
      homeScore?: number;
      id?: string;
      userPredicted?: boolean;
    }>;
    if (!Array.isArray(stored)) return null;
    const byId = new Map(fallbackScores.map((match) => [match.id, { ...match }]));
    let applied = false;
    for (const item of stored) {
      if (!item.id || !byId.has(item.id)) continue;
      const match = byId.get(item.id);
      if (!match) continue;
      match.homeScore = sanitizeScoreValue(item.homeScore);
      match.awayScore = sanitizeScoreValue(item.awayScore);
      match.userPredicted = item.userPredicted !== false;
      byId.set(item.id, match);
      applied = true;
    }
    return applied ? Array.from(byId.values()) : null;
  } catch {
    return null;
  }
}

function sanitizeScoreValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(12, value))
    : 0;
}

function calculateGroupStandings(
  scores: GroupScore[],
  teams: readonly string[]
): GroupStanding[] {
  const table = new Map<string, Omit<GroupStanding, 'rank'>>();
  teams.forEach((team) => {
    table.set(team, {
      team,
      played: 0,
      points: 0,
      goalDifference: 0,
      goalsFor: 0,
    });
  });

  scores
    .filter((match) => match.status === 'finished' || match.userPredicted)
    .forEach((match) => {
    const home = table.get(match.home);
    const away = table.get(match.away);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    away.goalsFor += match.awayScore;
    home.goalDifference += match.homeScore - match.awayScore;
    away.goalDifference += match.awayScore - match.homeScore;

    if (match.homeScore > match.awayScore) home.points += 3;
    else if (match.homeScore < match.awayScore) away.points += 3;
    else {
      home.points += 1;
      away.points += 1;
    }
  });

  return Array.from(table.values())
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        getTeamStrength(b.team) - getTeamStrength(a.team)
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function getGroupPredictionCopy(locale: Locale, group: string) {
  const languageGroup = getLocaleConfig(locale).languageGroup;
  const en = {
    title: `Group ${group} Goal Prediction - World Cup 2026 Score Simulator`,
    description: `Predict every goal in World Cup 2026 Group ${group}, enter match scores, calculate standings, and send the ranked teams into the simulator bracket.`,
    keywords: `group ${group} goal prediction, world cup group ${group} prediction, world cup 2026 group ${group} scores, group ${group} standings simulator`,
    badge: `Group ${group} goal prediction`,
    h1: `Group ${group} Goal Prediction`,
    lead: `Open the detail layer for Group ${group}: predict the six match scorelines, update goals, and watch the ranking card that feeds the main World Cup simulator.`,
    breadcrumbSimulator: 'Simulator',
    backToSimulator: 'Back to simulator',
    openBracket: 'Open bracket',
    groupLabel: 'Group',
    groupValue: group,
    goalsLabel: 'Projected goals',
    qualifierLabel: 'Current winner',
    rankingTitle: 'Live group ranking',
    detailEyebrow: 'Match score detail',
    detailTitle: `Predict every Group ${group} score`,
    detailBody: 'The main simulator only shows the group ranking card. This detail page is where you predict every match score, goals for, goal difference, and qualification order.',
    methodTitle: 'Ranking method',
    methodBody: 'The table follows the standard group logic users expect: points first, then goal difference, then goals scored. Team strength is only used as a deterministic final seed when the simulated table is still tied.',
    sourceTitle: 'How to use this page',
    sourceBody: 'Use this page as the score detail layer for the main simulator. Start with realistic goals, check the ranking card, then return to the full path to see how the group affects the Round of 32.',
    relatedEyebrow: 'Internal links',
    relatedTitle: 'More group goal prediction pages',
    groupStageLink: 'Open full group stage simulator',
    matchday: 'Matchday',
    goals: 'goals',
    faq: [
      {
        q: `How does Group ${group} goal prediction work?`,
        a: 'Enter a score for each of the six group matches. The table updates by points, goal difference, goals scored, and team strength as a final seed tiebreaker.',
      },
      {
        q: `Does Group ${group} affect the 32-team bracket?`,
        a: 'Yes. The top two teams qualify automatically, while the third-place team can still reach the Round of 32 through the best third-place table.',
      },
      {
        q: 'Why does each group have its own page?',
        a: 'Group-level score and goal predictions are easier to use when the six matches, ranking table, and qualification notes stay together.',
      },
    ],
  };

  if (languageGroup === 'zh') {
    return {
      ...en,
      title: `${group} 组进球预测 - 2026 世界杯小组比分模拟器`,
      description: `预测 2026 世界杯 ${group} 组每场进球数和比分，自动计算积分、净胜球、进球数和小组排名。`,
      keywords: `${group}组进球预测, 世界杯${group}组预测, 2026世界杯${group}组比分, 世界杯小组排名模拟器`,
      badge: `${group} 组进球预测`,
      h1: `${group} 组进球预测`,
      lead: `这里是 ${group} 组详情层：预测 6 场小组赛比分和进球数，自动生成小组排名，再回到主模拟器推进 32 强路径。`,
      breadcrumbSimulator: '世界杯模拟器',
      backToSimulator: '返回模拟器',
      openBracket: '查看对阵表',
      groupLabel: '小组',
      goalsLabel: '预计进球',
      qualifierLabel: '当前头名',
      rankingTitle: '实时小组排名',
      detailEyebrow: '单场比分详情',
      detailTitle: `预测 ${group} 组每场比分`,
      detailBody: '主模拟器只展示小组排名卡片；这个详情页负责逐场预测比分、进球数、净胜球和最终出线顺序。',
      methodTitle: '排名计算规则',
      methodBody: '积分榜按常见小组赛逻辑计算：先看积分，再看净胜球和进球数；如果模拟结果仍然完全相同，再使用球队强度作为稳定排序种子。',
      sourceTitle: '这个页面怎么用',
      sourceBody: '把这里当成主模拟器的小组详情层：先输入每场进球数，检查实时排名，再返回完整路径查看该小组如何影响 32 强。',
      relatedEyebrow: '站内链接',
      relatedTitle: '更多小组进球预测页面',
      groupStageLink: '打开完整小组赛模拟器',
      matchday: '比赛日',
      goals: '进球',
      faq: [
        {
          q: `${group} 组进球预测怎么算？`,
          a: '填写 6 场小组赛比分后，系统按积分、净胜球、进球数和球队强度生成排名。',
        },
        {
          q: `${group} 组会影响 32 强对阵吗？`,
          a: '会。小组前二直接进入 32 强，小组第三还会进入最佳第三名晋级线计算。',
        },
        {
          q: '为什么每个小组都有单独页面？',
          a: '每个小组只有 6 场比赛，单独页面更适合逐场改比分、看进球数、检查排名和出线影响。',
        },
      ],
    };
  }

  const localized = {
    es: {
      title: `Prediccion de goles Grupo ${group} - Simulador Mundial 2026`,
      description: `Predice goles y marcadores del Grupo ${group} del Mundial 2026, calcula puntos, diferencia de goles y ranking del grupo.`,
      keywords: `prediccion goles grupo ${group}, prediccion mundial grupo ${group}, marcadores grupo ${group} mundial 2026`,
      badge: `Prediccion de goles Grupo ${group}`,
      h1: `Prediccion de goles Grupo ${group}`,
      lead: `Capa de detalle del Grupo ${group}: predice los seis marcadores, actualiza goles y revisa el ranking que alimenta el simulador principal.`,
      breadcrumbSimulator: 'Simulador',
      backToSimulator: 'Volver al simulador',
      openBracket: 'Abrir bracket',
      groupLabel: 'Grupo',
      goalsLabel: 'Goles previstos',
      qualifierLabel: 'Lider actual',
      rankingTitle: 'Ranking en vivo',
      detailEyebrow: 'Detalle de marcadores',
      detailTitle: `Predice cada marcador del Grupo ${group}`,
      detailBody: 'El simulador principal solo muestra la tarjeta de ranking; esta pagina permite ajustar cada partido, goles a favor, diferencia y orden de clasificacion.',
      methodTitle: 'Metodo de ranking',
      methodBody: 'La tabla usa puntos, diferencia de goles y goles anotados. La fuerza del equipo solo se usa como semilla final si la tabla simulada sigue empatada.',
      sourceTitle: 'Como usar esta pagina',
      sourceBody: 'Usala como capa de detalle del simulador principal: escribe goles realistas, revisa el ranking y vuelve a la ruta completa.',
      relatedEyebrow: 'Enlaces internos',
      relatedTitle: 'Mas paginas de prediccion por grupo',
      groupStageLink: 'Abrir simulador de grupos',
      matchday: 'Jornada',
      goals: 'goles',
    },
    pt: {
      title: `Previsao de gols Grupo ${group} - Simulador Copa 2026`,
      description: `Preveja gols e placares do Grupo ${group} da Copa 2026, calcule pontos, saldo de gols e classificacao.`,
      keywords: `previsao gols grupo ${group}, copa 2026 grupo ${group}, placares grupo ${group}`,
      badge: `Previsao de gols Grupo ${group}`,
      h1: `Previsao de gols Grupo ${group}`,
      lead: `Camada de detalhe do Grupo ${group}: preveja os seis placares, atualize gols e veja a tabela que alimenta o simulador principal.`,
      breadcrumbSimulator: 'Simulador',
      backToSimulator: 'Voltar ao simulador',
      openBracket: 'Abrir chave',
      groupLabel: 'Grupo',
      goalsLabel: 'Gols previstos',
      qualifierLabel: 'Lider atual',
      rankingTitle: 'Classificacao ao vivo',
      detailEyebrow: 'Detalhe dos jogos',
      detailTitle: `Preveja cada placar do Grupo ${group}`,
      detailBody: 'O simulador principal mostra apenas a tabela resumida; esta pagina ajusta cada jogo, gols, saldo e ordem de classificacao.',
      methodTitle: 'Metodo de classificacao',
      methodBody: 'A tabela usa pontos, saldo de gols e gols marcados. A forca do time entra apenas como semente final em empates persistentes.',
      sourceTitle: 'Como usar esta pagina',
      sourceBody: 'Use como camada de detalhe do simulador: insira gols, confira a tabela e volte ao caminho completo.',
      relatedEyebrow: 'Links internos',
      relatedTitle: 'Mais paginas de previsao por grupo',
      groupStageLink: 'Abrir simulador da fase de grupos',
      matchday: 'Rodada',
      goals: 'gols',
    },
    fr: {
      title: `Pronostic buts Groupe ${group} - Simulateur Coupe du Monde 2026`,
      description: `Pronostiquez les buts et scores du Groupe ${group}, calculez points, difference de buts et classement.`,
      keywords: `pronostic buts groupe ${group}, coupe du monde 2026 groupe ${group}, scores groupe ${group}`,
      badge: `Pronostic buts Groupe ${group}`,
      h1: `Pronostic buts Groupe ${group}`,
      lead: `Detail du Groupe ${group}: pronostiquez les six scores, ajustez les buts et suivez le classement qui alimente le simulateur.`,
      breadcrumbSimulator: 'Simulateur',
      backToSimulator: 'Retour au simulateur',
      openBracket: 'Ouvrir le tableau',
      groupLabel: 'Groupe',
      goalsLabel: 'Buts prevus',
      qualifierLabel: 'Leader actuel',
      rankingTitle: 'Classement en direct',
      detailEyebrow: 'Detail des scores',
      detailTitle: `Pronostiquer chaque score du Groupe ${group}`,
      detailBody: 'Le simulateur principal affiche le classement; cette page permet de regler chaque match, les buts et l ordre de qualification.',
      methodTitle: 'Methode de classement',
      methodBody: 'Le tableau utilise points, difference de buts et buts marques. La force d equipe sert seulement de derniere graine en cas d egalite.',
      sourceTitle: 'Comment utiliser cette page',
      sourceBody: 'Entrez les buts, verifiez le classement, puis retournez au chemin complet du simulateur.',
      relatedEyebrow: 'Liens internes',
      relatedTitle: 'Autres pages de pronostic par groupe',
      groupStageLink: 'Ouvrir le simulateur de groupes',
      matchday: 'Journee',
      goals: 'buts',
    },
    de: {
      title: `Gruppe ${group} Tore Prognose - WM 2026 Simulator`,
      description: `Tippe Tore und Ergebnisse fur Gruppe ${group} der WM 2026 und berechne Punkte, Tordifferenz und Tabelle.`,
      keywords: `gruppe ${group} tore prognose, wm 2026 gruppe ${group}, gruppe ${group} ergebnisse`,
      badge: `Gruppe ${group} Tore Prognose`,
      h1: `Gruppe ${group} Tore Prognose`,
      lead: `Detailansicht fur Gruppe ${group}: tippe sechs Ergebnisse, aktualisiere Tore und sieh die Tabelle fur den Hauptsimulator.`,
      breadcrumbSimulator: 'Simulator',
      backToSimulator: 'Zuruck zum Simulator',
      openBracket: 'Turnierbaum offnen',
      groupLabel: 'Gruppe',
      goalsLabel: 'Prognose-Tore',
      qualifierLabel: 'Aktueller Sieger',
      rankingTitle: 'Live-Tabelle',
      detailEyebrow: 'Spielergebnisse',
      detailTitle: `Jedes Ergebnis der Gruppe ${group} tippen`,
      detailBody: 'Der Hauptsimulator zeigt nur die Tabelle; diese Seite steuert Spielstande, Tore, Tordifferenz und Qualifikationsreihenfolge.',
      methodTitle: 'Tabellenmethode',
      methodBody: 'Sortierung nach Punkten, Tordifferenz und erzielten Toren. Teamstarke dient nur als letzte stabile Sortierung bei Gleichstand.',
      sourceTitle: 'So nutzt du die Seite',
      sourceBody: 'Trage Tore ein, prufe die Tabelle und kehre dann zum kompletten Pfad zuruck.',
      relatedEyebrow: 'Interne Links',
      relatedTitle: 'Weitere Gruppen-Prognosen',
      groupStageLink: 'Gruppenphase-Simulator offnen',
      matchday: 'Spieltag',
      goals: 'Tore',
    },
    it: {
      title: `Pronostico gol Gruppo ${group} - Simulatore Mondiali 2026`,
      description: `Pronostica gol e risultati del Gruppo ${group}, calcola punti, differenza reti e classifica.`,
      keywords: `pronostico gol gruppo ${group}, mondiali 2026 gruppo ${group}, risultati gruppo ${group}`,
      badge: `Pronostico gol Gruppo ${group}`,
      h1: `Pronostico gol Gruppo ${group}`,
      lead: `Dettaglio del Gruppo ${group}: pronostica i sei risultati, aggiorna gol e classifica per il simulatore principale.`,
      breadcrumbSimulator: 'Simulatore',
      backToSimulator: 'Torna al simulatore',
      openBracket: 'Apri tabellone',
      groupLabel: 'Gruppo',
      goalsLabel: 'Gol previsti',
      qualifierLabel: 'Leader attuale',
      rankingTitle: 'Classifica live',
      detailEyebrow: 'Dettaglio risultati',
      detailTitle: `Pronostica ogni risultato del Gruppo ${group}`,
      detailBody: 'Il simulatore principale mostra solo la classifica; questa pagina regola partite, gol, differenza reti e ordine di qualificazione.',
      methodTitle: 'Metodo classifica',
      methodBody: 'La tabella usa punti, differenza reti e gol fatti. La forza squadra e solo un seme finale in caso di parita persistente.',
      sourceTitle: 'Come usare questa pagina',
      sourceBody: 'Inserisci i gol, controlla la classifica e torna al percorso completo.',
      relatedEyebrow: 'Link interni',
      relatedTitle: 'Altre pagine per gruppo',
      groupStageLink: 'Apri simulatore fase a gironi',
      matchday: 'Giornata',
      goals: 'gol',
    },
    nl: {
      title: `Groep ${group} doelpunten voorspelling - WK 2026 Simulator`,
      description: `Voorspel doelpunten en scores voor Groep ${group}, bereken punten, doelsaldo en stand.`,
      keywords: `groep ${group} doelpunten voorspelling, wk 2026 groep ${group}, scores groep ${group}`,
      badge: `Groep ${group} doelpunten voorspelling`,
      h1: `Groep ${group} doelpunten voorspelling`,
      lead: `Detailpagina voor Groep ${group}: voorspel zes uitslagen, pas doelpunten aan en bekijk de stand voor de simulator.`,
      breadcrumbSimulator: 'Simulator',
      backToSimulator: 'Terug naar simulator',
      openBracket: 'Open bracket',
      groupLabel: 'Groep',
      goalsLabel: 'Verwachte goals',
      qualifierLabel: 'Huidige koploper',
      rankingTitle: 'Live stand',
      detailEyebrow: 'Wedstrijdscores',
      detailTitle: `Voorspel elke score van Groep ${group}`,
      detailBody: 'De hoofdsimulator toont de stand; deze pagina beheert wedstrijden, goals, doelsaldo en kwalificatievolgorde.',
      methodTitle: 'Rangschikking',
      methodBody: 'De stand gebruikt punten, doelsaldo en gemaakte goals. Teamsterkte is alleen een laatste stabiele sortering bij gelijke stand.',
      sourceTitle: 'Zo gebruik je deze pagina',
      sourceBody: 'Vul goals in, controleer de stand en keer terug naar het volledige pad.',
      relatedEyebrow: 'Interne links',
      relatedTitle: 'Meer groepsvoorspellingen',
      groupStageLink: 'Open groepsfase simulator',
      matchday: 'Speeldag',
      goals: 'goals',
    },
    ja: {
      title: `グループ${group} 得点予想 - ワールドカップ2026シミュレーター`,
      description: `グループ${group}の得点とスコアを予想し、勝点、得失点差、順位を計算します。`,
      keywords: `グループ${group} 得点予想, ワールドカップ2026 グループ${group}, グループ${group} スコア`,
      badge: `グループ${group} 得点予想`,
      h1: `グループ${group} 得点予想`,
      lead: `グループ${group}の詳細ページです。6試合のスコアを入力し、順位表を更新してメインシミュレーターへ反映します。`,
      breadcrumbSimulator: 'シミュレーター',
      backToSimulator: 'シミュレーターへ戻る',
      openBracket: 'ブラケットを見る',
      groupLabel: 'グループ',
      goalsLabel: '予想得点',
      qualifierLabel: '現在の首位',
      rankingTitle: 'ライブ順位',
      detailEyebrow: '試合スコア詳細',
      detailTitle: `グループ${group}の全試合を予想`,
      detailBody: 'メイン画面は順位カードのみ表示します。このページで各試合の得点、得失点差、通過順を調整します。',
      methodTitle: '順位計算',
      methodBody: '勝点、得失点差、総得点で順位を計算します。同点が残る場合のみチーム強度を安定した並び替えに使います。',
      sourceTitle: '使い方',
      sourceBody: '得点を入力し、順位表を確認してから全体シミュレーターに戻ります。',
      relatedEyebrow: '内部リンク',
      relatedTitle: '他のグループ得点予想',
      groupStageLink: 'グループステージを開く',
      matchday: '試合日',
      goals: '得点',
    },
    ko: {
      title: `${group}조 득점 예측 - 월드컵 2026 시뮬레이터`,
      description: `${group}조 경기 득점과 스코어를 예측하고 승점, 골득실, 순위를 계산합니다.`,
      keywords: `${group}조 득점 예측, 월드컵 2026 ${group}조, ${group}조 스코어`,
      badge: `${group}조 득점 예측`,
      h1: `${group}조 득점 예측`,
      lead: `${group}조 상세 페이지입니다. 6경기 스코어를 입력하고 순위를 확인한 뒤 메인 시뮬레이터에 반영합니다.`,
      breadcrumbSimulator: '시뮬레이터',
      backToSimulator: '시뮬레이터로 돌아가기',
      openBracket: '브래킷 열기',
      groupLabel: '조',
      goalsLabel: '예상 득점',
      qualifierLabel: '현재 1위',
      rankingTitle: '실시간 순위',
      detailEyebrow: '경기 스코어 상세',
      detailTitle: `${group}조 모든 경기 예측`,
      detailBody: '메인 시뮬레이터는 순위 카드만 보여줍니다. 이 페이지에서 경기별 득점, 골득실, 진출 순서를 조정합니다.',
      methodTitle: '순위 계산 방식',
      methodBody: '승점, 골득실, 다득점 순으로 계산하며 동률이 계속될 때만 팀 강도를 마지막 정렬값으로 사용합니다.',
      sourceTitle: '사용 방법',
      sourceBody: '득점을 입력하고 순위를 확인한 뒤 전체 경로 시뮬레이터로 돌아가세요.',
      relatedEyebrow: '내부 링크',
      relatedTitle: '다른 조 득점 예측',
      groupStageLink: '조별리그 시뮬레이터 열기',
      matchday: '경기일',
      goals: '득점',
    },
  } satisfies Partial<Record<typeof languageGroup, Partial<typeof en>>>;

  return { ...en, ...(localized[languageGroup] ?? {}) };
}
