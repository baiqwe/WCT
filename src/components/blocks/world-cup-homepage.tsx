import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getGroupPredictionPath,
  getPagePath,
  getTeamPath,
  getWorldCupContent,
  languageLabels,
  normalizeLocale,
  pageKeys,
  sampleGroups,
  teamPages,
  type Locale,
  type PageKey,
} from '@/lib/world-cup-content';
import {
  getTeamStrength,
  worldCupGroupStageMatches,
} from '@/lib/world-cup-data';
import { cn } from '@/lib/utils';
import {
  IconArrowRight,
  IconChevronDown,
  IconChevronUp,
  IconRefresh,
  IconShare2,
  IconTrophy,
} from '@tabler/icons-react';
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type WorldCupHomePageProps = {
  locale?: Locale | string;
  pageKey?: PageKey;
};

type WorldCupContent = ReturnType<typeof getWorldCupContent>;
type ToolUiCopy = ReturnType<typeof getToolUiCopy>;
type Picks = Record<string, string>;
type GroupRankings = Record<string, string[]>;
type DetailedGroups = Record<string, boolean>;
type MatchScore = {
  away: string;
  awayScore: number;
  date: string;
  group: string;
  home: string;
  homeScore: number;
  id: string;
  venue: string;
};
type StandingRow = {
  team: string;
  group: string;
  played: number;
  points: number;
  goalDifference: number;
  goalsFor: number;
  rank: number;
  source: 'ranking' | 'scores';
};

export function WorldCupHomePage({ locale, pageKey = 'home' }: WorldCupHomePageProps) {
  const activeLocale = normalizeLocale(locale);
  const t = getWorldCupContent(activeLocale, pageKey);
  const ui = getToolUiCopy(t.config.languageGroup);
  const initialPicks = useMemo(
    () =>
      Object.fromEntries(
        sampleGroups.map((group) => [group.group, group.teams[0]])
      ) as Record<string, string>,
    []
  );
  const [picks, setPicks] = useState(initialPicks);
  const initialScores = useMemo(() => createInitialGroupScores(), []);
  const [scores, setScores] = useState(initialScores);
  const initialGroupRankings = useMemo(() => createInitialGroupRankings(), []);
  const [groupRankings, setGroupRankings] = useState(initialGroupRankings);
  const [detailedGroups, setDetailedGroups] = useState<DetailedGroups>({});

  useEffect(() => {
    const stored = loadStoredTournamentScores(initialScores);
    if (Object.keys(stored.detailedGroups).length === 0) return;
    setScores(stored.scores);
    setDetailedGroups(stored.detailedGroups);
  }, [initialScores]);

  const projectedWinners = Object.values(picks);
  const standings = useMemo(
    () => calculateStandings(scores, groupRankings, detailedGroups),
    [scores, groupRankings, detailedGroups]
  );
  const allGroupIds = useMemo(() => sampleGroups.map((group) => group.group), []);
  const thirdRankings = useMemo(() => getThirdPlaceRankings(standings), [standings]);
  const qualifiedTeams = useMemo(
    () => getQualifiedTeams(standings, thirdRankings),
    [standings, thirdRankings]
  );
  const champion =
    qualifiedTeams[4]?.team ?? projectedWinners[2] ?? projectedWinners[0];
  const finalist =
    qualifiedTeams[9]?.team ?? projectedWinners[3] ?? projectedWinners[1];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050907] text-[#f3f8ee]">
      <section className="relative border-b border-white/10">
        <FieldTexture />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 md:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24 lg:pt-16">
          <div className="flex min-h-[560px] flex-col justify-between gap-10">
            <div>
              <div className="mb-8 flex flex-wrap items-center gap-2">
                {Object.entries(languageLabels).map(([key, label]) => (
                  <a
                    key={key}
                    href={getPagePath(key as Locale, pageKey)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition',
                      activeLocale === key
                        ? 'border-[#c7ff57]/70 bg-[#c7ff57] text-[#071007]'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white'
                    )}
                  >
                    {label}
                  </a>
                ))}
              </div>
              <nav
                aria-label="Breadcrumb"
                className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/42"
              >
                <a
                  className="transition hover:text-[#d8ff80]"
                  href={getPagePath(activeLocale, 'home')}
                >
                  {ui.breadcrumbHome}
                </a>
                <span aria-hidden="true">/</span>
                <span className="text-white/68">{t.seo.h1}</span>
              </nav>
              <Badge className="mb-5 border-[#c7ff57]/30 bg-[#c7ff57]/10 text-[#d8ff80]">
                {t.seo.eyebrow}
              </Badge>
              <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-normal text-white md:text-7xl">
                {t.seo.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/68">
                {t.seo.body}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {pageKeys.map((key) => (
                  <a
                    key={key}
                    href={getPagePath(activeLocale, key)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition',
                      key === pageKey
                        ? 'border-white/25 bg-white/12 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white'
                    )}
                  >
                    {t.nav[key]}
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#predictor"
                  className={buttonVariants({
                    className:
                      'h-11 rounded-md bg-[#c7ff57] px-5 text-sm font-semibold text-[#071007] hover:bg-[#d8ff80]',
                  })}
                >
                  {t.cta}
                  <IconArrowRight className="size-4" />
                </a>
                <a
                  href="#method"
                  className={buttonVariants({
                    variant: 'outline',
                    className:
                      'h-11 rounded-md border-white/12 bg-white/[0.03] px-5 text-white hover:bg-white/10',
                  })}
                >
                  {t.secondaryCta}
                </a>
              </div>
            </div>

            <div className="grid max-w-xl grid-cols-2 gap-3">
              <Metric label={t.statLabel} value={t.statValue} />
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <p className="text-xs uppercase text-white/42">
                  {ui.liveIntentLabel}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {t.liveIntent}
                </p>
              </div>
            </div>
          </div>

          <PrimaryToolPanel
            champion={champion}
            finalist={finalist}
            initialPicks={initialPicks}
            pageKey={pageKey}
            picks={picks}
            qualifiedTeams={qualifiedTeams}
            scores={scores}
            setPicks={setPicks}
            setScores={setScores}
            setGroupRankings={setGroupRankings}
            setDetailedGroups={setDetailedGroups}
            allGroupIds={allGroupIds}
            activeLocale={activeLocale}
            detailedGroups={detailedGroups}
            groupRankings={groupRankings}
            standings={standings}
            thirdRankings={thirdRankings}
            t={t}
            ui={ui}
          />
        </div>
      </section>

      <PageFocusSection
        champion={champion}
        finalist={finalist}
        pageKey={pageKey}
        projectedWinners={projectedWinners}
        qualifiedTeams={qualifiedTeams}
        standings={standings}
        thirdRankings={thirdRankings}
        t={t}
        ui={ui}
      />

      <ToolSeoSection activeLocale={activeLocale} pageKey={pageKey} t={t} ui={ui} />

      <SearchIntentSection activeLocale={activeLocale} t={t} ui={ui} />

      <section className="bg-[#050907] px-4 py-16 md:px-6" id="bracket">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 md:grid-cols-4">
            {t.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-white/[0.025] p-5"
              >
                <feature.icon className="size-6 text-[#c7ff57]" />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/10 bg-[#e9f5df] px-4 py-16 text-[#071007] md:px-6"
        id="method"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase text-[#24512e]">
              Method and transparency
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              {t.seoPlan.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#213629]/75">
              {t.seoPlan.body}
            </p>
          </div>
          <div className="grid gap-3">
            {t.seoPlan.items.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 rounded-lg border border-[#071007]/10 bg-white/55 p-4 md:grid-cols-[180px_1fr]"
              >
                <span className="font-mono text-xs uppercase text-[#24512e]/70">
                  {label}
                </span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050907] px-4 py-16 md:px-6" id="faq">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-3">
            {t.faq.map((item) => (
              <details
                key={item.q}
                className="rounded-lg border border-white/10 bg-white/[0.025] p-5 open:bg-white/[0.045]"
              >
                <summary className="cursor-pointer text-base font-semibold text-white">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-6 text-white/58">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PrimaryToolPanel({
  champion,
  finalist,
  allGroupIds,
  activeLocale,
  initialPicks,
  pageKey,
  picks,
  qualifiedTeams,
  scores,
  setPicks,
  setScores,
  setGroupRankings,
  setDetailedGroups,
  standings,
  detailedGroups,
  groupRankings,
  thirdRankings,
  t,
  ui,
}: {
  champion: string;
  finalist: string;
  initialPicks: Picks;
  pageKey: PageKey;
  picks: Picks;
  qualifiedTeams: StandingRow[];
  scores: MatchScore[];
  setPicks: Dispatch<SetStateAction<Picks>>;
  setScores: Dispatch<SetStateAction<MatchScore[]>>;
  setGroupRankings: Dispatch<SetStateAction<GroupRankings>>;
  setDetailedGroups: Dispatch<SetStateAction<DetailedGroups>>;
  allGroupIds: string[];
  activeLocale: Locale;
  detailedGroups: DetailedGroups;
  groupRankings: GroupRankings;
  standings: StandingRow[];
  thirdRankings: StandingRow[];
  t: WorldCupContent;
  ui: ToolUiCopy;
}) {
  if (pageKey === 'bracket') {
    return (
      <ToolShell note={t.sampleNote}>
        <div className="mb-5">
          <p className="font-mono text-xs uppercase text-[#c7ff57]/75">
            {ui.bracket.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {ui.bracket.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            {ui.bracket.body}
          </p>
        </div>
        <ToolWorkflow pageKey={pageKey} ui={ui} />
        <div className="grid gap-3">
          {buildKnockoutRounds(qualifiedTeams, champion, finalist, ui).map(({ round, teams }) => (
            <div
              key={round}
              className="grid gap-2 rounded-lg border border-white/8 bg-white/[0.025] p-3 md:grid-cols-[130px_1fr]"
            >
              <span className="font-mono text-xs uppercase text-white/42">
                {round}
              </span>
              <div className="flex flex-wrap gap-2">
                {teams.map((team) => (
                  <span
                    key={`${round}-${team}`}
                    className="rounded-md border border-[#c7ff57]/20 bg-[#c7ff57]/10 px-2.5 py-1 text-xs text-[#e7ffad]"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ResultTile label={ui.bracket.modeLabel} value={ui.bracket.modeValue} />
          <ResultTile label={ui.bracket.pathLabel} value={champion} />
          <ResultTile label={ui.bracket.exportLabel} value={ui.bracket.exportValue} />
        </div>
      </ToolShell>
    );
  }

  if (pageKey === 'groupStage') {
    return (
      <ToolShell note={t.sampleNote}>
        <PanelHeader
          eyebrow={ui.groupStage.eyebrow}
          title={ui.groupStage.title}
          body={ui.groupStage.body}
        />
        <ToolWorkflow pageKey={pageKey} ui={ui} />
        <GroupScoreEditor
          activeGroups={allGroupIds}
          scores={scores}
          setDetailedGroups={setDetailedGroups}
          setScores={setScores}
          ui={ui}
        />
        <StandingsGrid groups={allGroupIds} standings={standings} ui={ui} />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ResultTile label={ui.groupStage.tablesLabel} value={ui.groupStage.tablesValue} />
          <ResultTile label={ui.groupStage.autoLabel} value={ui.groupStage.autoValue} />
          <ResultTile
            label={ui.groupStage.bubbleLabel}
            value={`${thirdRankings[7]?.team ?? ui.groupStage.cutoffFallback} ${ui.groupStage.cutoffLabel}`}
          />
        </div>
      </ToolShell>
    );
  }

  if (pageKey === 'thirdPlace') {
    return (
      <ToolShell note={t.sampleNote}>
        <PanelHeader
          eyebrow={ui.thirdPlace.eyebrow}
          title={t.thirdPlace.title}
          body={ui.thirdPlace.body}
        />
        <ToolWorkflow pageKey={pageKey} ui={ui} />
        <DynamicThirdPlaceTable rankings={thirdRankings} t={t} ui={ui} />
      </ToolShell>
    );
  }

  if (pageKey === 'monteCarlo') {
    const probabilities = createProbabilityRows(qualifiedTeams, champion, finalist);
    return (
      <ToolShell note={t.sampleNote}>
        <PanelHeader
          eyebrow={ui.monteCarlo.eyebrow}
          title={ui.monteCarlo.title}
          body={ui.monteCarlo.body}
        />
        <ToolWorkflow pageKey={pageKey} ui={ui} />
        <div className="grid gap-3">
          {probabilities.map(({ team, value, reachFinal }) => (
            <div
              key={team}
              className="rounded-lg border border-white/8 bg-white/[0.025] p-3"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-white">{team}</span>
                <span className="font-mono text-[#d8ff80]">
                  {ui.monteCarlo.championOdds}: {value}% · {ui.monteCarlo.finalOdds}: {reachFinal}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[#c7ff57]"
                  style={{ width: `${Math.min(value * 4, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ResultTile label={ui.monteCarlo.runsLabel} value="10,000" />
          <ResultTile label={ui.monteCarlo.inputsLabel} value={ui.monteCarlo.inputsValue} />
          <ResultTile label={ui.monteCarlo.outputLabel} value={ui.monteCarlo.outputValue} />
        </div>
      </ToolShell>
    );
  }

  return (
    <ToolShell note={t.sampleNote}>
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-mono text-xs uppercase text-[#c7ff57]/75">
            {t.predictor.round32}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {pageKey === 'predictor'
              ? ui.predictor.manualTitle
              : t.predictor.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            {pageKey === 'predictor'
              ? ui.predictor.manualBody
              : t.predictor.body}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10"
          onClick={() => setPicks(initialPicks)}
        >
          <IconRefresh className="size-4" />
          {t.predictor.reset}
        </Button>
      </div>

      <ToolWorkflow pageKey={pageKey} ui={ui} />

      {pageKey === 'home' ? (
        <FullPathComposer
          champion={champion}
          finalist={finalist}
          qualifiedTeams={qualifiedTeams}
          allGroupIds={allGroupIds}
          activeLocale={activeLocale}
          standings={standings}
          detailedGroups={detailedGroups}
          groupRankings={groupRankings}
          scores={scores}
          setGroupRankings={setGroupRankings}
          ui={ui}
        />
      ) : (
        <PickBoard picks={picks} setPicks={setPicks} ui={ui} />
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ResultTile
          label={t.predictor.champion}
          value={champion}
          icon={<IconTrophy className="size-5 text-[#c7ff57]" />}
        />
        <ResultTile label={t.predictor.finalist} value={finalist} />
        <ResultTile
          label={pageKey === 'predictor' ? ui.sharePicks : ui.share}
          value={pageKey === 'predictor' ? ui.predictionLink : ui.bracketImage}
          icon={<IconShare2 className="size-5 text-white/65" />}
        />
      </div>
    </ToolShell>
  );
}

function FullPathComposer({
  champion,
  finalist,
  qualifiedTeams,
  allGroupIds,
  activeLocale,
  detailedGroups,
  groupRankings,
  scores,
  setGroupRankings,
  standings,
  ui,
}: {
  champion: string;
  finalist: string;
  qualifiedTeams: StandingRow[];
  allGroupIds: string[];
  activeLocale: Locale;
  detailedGroups: DetailedGroups;
  groupRankings: GroupRankings;
  scores: MatchScore[];
  setGroupRankings: Dispatch<SetStateAction<GroupRankings>>;
  standings: StandingRow[];
  ui: ToolUiCopy;
}) {
  const columns = createPathColumns(qualifiedTeams, champion, finalist, ui);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(199,255,87,0.11),rgba(255,255,255,0.025)_34%,rgba(43,101,255,0.10))] p-3 shadow-[0_18px_70px_rgba(0,0,0,0.36)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="relative mb-3 flex flex-col gap-2 border-b border-white/10 pb-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#c7ff57]/80">
            {ui.pathCanvas.groupsTitle}
          </p>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-white/54">
            {ui.pathCanvas.groupsBody}
          </p>
        </div>
        <span className="w-fit rounded-full border border-[#c7ff57]/25 bg-[#c7ff57]/10 px-3 py-1 font-mono text-[10px] uppercase text-[#e7ffad]">
          12 groups / 32 teams / champion
        </span>
      </div>
      <div className="relative overflow-x-auto pb-2">
        <div className="grid min-w-[1120px] grid-cols-[248px_repeat(6,154px)] gap-3">
          <div className="rounded-lg border border-[#c7ff57]/25 bg-[#071007]/82 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mt-3 grid gap-2">
            {allGroupIds.map((group) => (
              <GroupRankCard
                key={group}
                activeLocale={activeLocale}
                detailedGroups={detailedGroups}
                group={group}
                groupRankings={groupRankings}
                scores={scores}
                setGroupRankings={setGroupRankings}
                standings={standings}
                ui={ui}
              />
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <PathColumn key={column.title} column={column} ui={ui} />
        ))}
        </div>
      </div>
    </div>
  );
}

function GroupRankCard({
  activeLocale,
  detailedGroups,
  group,
  groupRankings,
  scores,
  setGroupRankings,
  standings,
  ui,
}: {
  activeLocale: Locale;
  detailedGroups: DetailedGroups;
  group: string;
  groupRankings: GroupRankings;
  scores: MatchScore[];
  setGroupRankings: Dispatch<SetStateAction<GroupRankings>>;
  standings: StandingRow[];
  ui: ToolUiCopy;
}) {
  const rows = standings.filter((row) => row.group === group).slice(0, 4);
  const groupSlug = `group-${group.toLowerCase()}-goal-prediction`;
  const isDetailed = Boolean(detailedGroups[group]);
  const groupScores = scores.filter((match) => match.group === group);
  const ranking = groupRankings[group] ?? rows.map((row) => row.team);

  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#c7ff57]/35 hover:bg-[#c7ff57]/8">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-[#c7ff57]/60 opacity-0 transition group-hover:opacity-100"
      />
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase text-white/45">
          {ui.groupLabel} {group}
        </span>
        <span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] text-white/46">
          {isDetailed ? ui.pathCanvas.scoreMode : ui.pathCanvas.rankMode}
        </span>
      </div>
      <div className="grid gap-1.5">
        {rows.map((row, index) => (
          <div
            key={row.team}
            className="grid grid-cols-[18px_1fr_52px] items-center gap-2 text-xs"
          >
            <span className="font-mono text-white/40">{row.rank}</span>
            <span className="truncate font-medium text-white/78">{row.team}</span>
            {isDetailed ? (
              <span className="text-right font-mono text-[#d8ff80]/80">
                {row.points} {ui.pointsShort}
              </span>
            ) : (
              <span className="flex justify-end gap-1">
                <button
                  aria-label={`${ui.moveUp} ${row.team}`}
                  className="grid size-5 place-items-center rounded border border-white/8 bg-black/25 text-white/42 transition hover:border-[#c7ff57]/30 hover:text-[#d8ff80] disabled:pointer-events-none disabled:opacity-25"
                  disabled={index === 0}
                  onClick={() =>
                    moveGroupTeam(setGroupRankings, group, row.team, -1)
                  }
                  type="button"
                >
                  <IconChevronUp className="size-3" />
                </button>
                <button
                  aria-label={`${ui.moveDown} ${row.team}`}
                  className="grid size-5 place-items-center rounded border border-white/8 bg-black/25 text-white/42 transition hover:border-[#c7ff57]/30 hover:text-[#d8ff80] disabled:pointer-events-none disabled:opacity-25"
                  disabled={index === ranking.length - 1}
                  onClick={() =>
                    moveGroupTeam(setGroupRankings, group, row.team, 1)
                  }
                  type="button"
                >
                  <IconChevronDown className="size-3" />
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
      {isDetailed ? (
        <div className="mt-3 grid gap-1 border-t border-white/8 pt-2">
          {groupScores.slice(0, 2).map((match) => (
            <div
              key={match.id}
              className="grid grid-cols-[1fr_38px_1fr] items-center gap-1 text-[10px] text-white/42"
            >
              <span className="truncate text-right">{match.home}</span>
              <span className="rounded bg-black/25 px-1.5 py-0.5 text-center font-mono text-[#d8ff80]/75">
                {match.homeScore}-{match.awayScore}
              </span>
              <span className="truncate">{match.away}</span>
            </div>
          ))}
          {groupScores.length > 2 ? (
            <span className="text-right text-[10px] text-white/32">
              +{groupScores.length - 2} {ui.moreMatches}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 border-t border-white/8 pt-2 text-[11px] leading-4 text-white/36">
          {ui.pathCanvas.rankOnly}
        </p>
      )}
      <a
        className="mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-[#c7ff57] hover:text-[#e7ffad]"
        href={getGroupPredictionPath(activeLocale, groupSlug)}
      >
        {ui.details}
        <IconArrowRight className="size-3" />
      </a>
    </article>
  );
}

function PathColumn({
  column,
  ui,
}: {
  column: { title: string; subtitle: string; items: string[]; accent?: boolean };
  ui: ToolUiCopy;
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-lg border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        column.accent
          ? 'border-[#c7ff57]/35 bg-[#c7ff57]/12'
          : 'border-white/10 bg-[#071007]/70'
      )}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7ff57]/40 to-transparent"
      />
      <p className="font-mono text-[11px] uppercase text-[#c7ff57]/72">
        {column.title}
      </p>
      <p className="mt-1 min-h-8 text-xs leading-4 text-white/45">
        {column.subtitle}
      </p>
      <div className="mt-3 grid gap-2">
        {column.items.map((item, index) => (
          <div
            key={`${column.title}-${item}-${index}`}
            className="rounded-lg border border-white/8 bg-black/28 px-2.5 py-2 transition hover:border-white/20 hover:bg-black/35"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-white/78">
                {item}
              </span>
              <span className="font-mono text-[10px] text-[#d8ff80]/80">
                {scoreSeed(item, index)}
              </span>
            </div>
            <a
              className="mt-1 block text-right text-[10px] font-semibold text-white/36 hover:text-[#c7ff57]"
              href="#bracket"
            >
              {ui.details}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function PickBoard({
  picks,
  setPicks,
  ui,
}: {
  picks: Picks;
  setPicks: Dispatch<SetStateAction<Picks>>;
  ui: ToolUiCopy;
}) {
  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-[#c7ff57]/18 bg-[#c7ff57]/8 px-3 py-2 text-sm leading-6 text-[#e7ffad]">
        {ui.predictor.boardHint}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {sampleGroups.map((group) => (
          <div
            key={group.group}
            className="rounded-lg border border-white/8 bg-white/[0.025] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-white/45">
                {ui.groupLabel.toUpperCase()} {group.group}
              </span>
              <span className="rounded-full bg-[#c7ff57]/12 px-2 py-0.5 text-xs text-[#d8ff80]">
                {picks[group.group]}
              </span>
            </div>
            <div className="grid gap-2">
              {group.teams.map((team, index) => (
                <button
                  key={team}
                  type="button"
                  onClick={() =>
                    setPicks((current) => ({
                      ...current,
                      [group.group]: team,
                    }))
                  }
                  className={cn(
                    'flex h-10 items-center justify-between rounded-md border px-3 text-left text-sm transition',
                    picks[group.group] === team
                      ? 'border-[#c7ff57]/60 bg-[#c7ff57]/12 text-white'
                      : 'border-white/8 bg-black/20 text-white/58 hover:border-white/25 hover:text-white'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-white/8 font-mono text-[10px] text-white/50">
                      {index + 1}
                    </span>
                    {team}
                  </span>
                  <span className="font-mono text-xs text-white/35">
                    {picks[group.group] === team ? ui.winnerShort : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupScoreEditor({
  activeGroups,
  scores,
  setDetailedGroups,
  setScores,
  ui,
}: {
  activeGroups: string[];
  scores: MatchScore[];
  setDetailedGroups: Dispatch<SetStateAction<DetailedGroups>>;
  setScores: Dispatch<SetStateAction<MatchScore[]>>;
  ui: ToolUiCopy;
}) {
  const [selectedGroup, setSelectedGroup] = useState(activeGroups[0] ?? '');
  const currentGroup = activeGroups.includes(selectedGroup)
    ? selectedGroup
    : activeGroups[0];
  const groupsToShow = currentGroup ? [currentGroup] : activeGroups;
  const visibleMatches = scores
    .filter((match) => groupsToShow.includes(match.group))
    .slice(0, groupsToShow.length * 6);
  return (
    <div className="grid gap-2">
      {activeGroups.length > 1 ? (
        <div className="mb-2 rounded-lg border border-white/8 bg-white/[0.025] p-3">
          <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#c7ff57]/72">
                {ui.editingGroupLabel} {currentGroup}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/48">
                {ui.visibleGroupHelp}
              </p>
            </div>
            <span className="w-fit rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/55">
              {visibleMatches.length} {ui.matchesLabel}
            </span>
          </div>
          <div
            aria-label={ui.groupTabsLabel}
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
          >
            {activeGroups.map((group) => (
              <button
                key={group}
                aria-selected={group === currentGroup}
                className={cn(
                  'min-w-10 rounded-md border px-3 py-2 font-mono text-xs transition',
                  group === currentGroup
                    ? 'border-[#c7ff57]/60 bg-[#c7ff57] text-[#071007]'
                    : 'border-white/10 bg-black/20 text-white/55 hover:border-white/25 hover:text-white'
                )}
                onClick={() => setSelectedGroup(group)}
                role="tab"
                type="button"
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {visibleMatches.map((match) => (
        <div
          key={match.id}
          className="grid gap-2 rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-sm md:grid-cols-[96px_1fr_44px_18px_44px_1fr_140px] md:items-center"
        >
          <span className="font-mono text-[11px] uppercase text-white/35">
            {formatMatchDate(match.date)}
          </span>
          <span className="truncate text-right text-white/75">{match.home}</span>
          <ScoreInput
            value={match.homeScore}
            label={ui.scoreLabel}
            onChange={(value) =>
              updateScore(setScores, setDetailedGroups, match.id, match.group, 'homeScore', value)
            }
          />
          <span className="text-center text-white/35">-</span>
          <ScoreInput
            value={match.awayScore}
            label={ui.scoreLabel}
            onChange={(value) =>
              updateScore(setScores, setDetailedGroups, match.id, match.group, 'awayScore', value)
            }
          />
          <span className="truncate text-white/75">{match.away}</span>
          <span className="truncate font-mono text-[11px] text-white/32">
            {match.venue}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScoreInput({
  onChange,
  value,
  label,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <input
      aria-label={label}
      className="h-9 rounded-md border border-white/10 bg-white/[0.04] text-center font-mono text-sm text-white outline-none focus:border-[#c7ff57]/70"
      max={12}
      min={0}
      type="number"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

function StandingsGrid({
  groups,
  standings,
  ui,
}: {
  groups: string[];
  standings: StandingRow[];
  ui: ToolUiCopy;
}) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {groups.map((group) => (
        <MiniStanding key={group} group={group} standings={standings} ui={ui} />
      ))}
    </div>
  );
}

function MiniStanding({
  group,
  standings,
  ui,
}: {
  group: string;
  standings: StandingRow[];
  ui: ToolUiCopy;
}) {
  const rows = standings.filter((row) => row.group === group);
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.025] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs uppercase text-white/45">
          {ui.groupLabel} {group}
        </span>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/45">
          {ui.pointsGoalDiff}
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.team}
          className="grid grid-cols-[24px_1fr_38px_38px] items-center border-t border-white/6 py-2 text-sm first:border-0"
        >
          <span className="font-mono text-xs text-white/40">{row.rank}</span>
          <span className="truncate font-medium text-white">{row.team}</span>
          <span className="text-white/65">{row.points}</span>
          <span className="text-white/45">
            {row.goalDifference > 0 ? '+' : ''}
            {row.goalDifference}
          </span>
        </div>
      ))}
    </div>
  );
}

function KnockoutPath({
  champion,
  finalist,
  qualifiedTeams,
  ui,
}: {
  champion: string;
  finalist: string;
  qualifiedTeams: StandingRow[];
  ui: ToolUiCopy;
}) {
  const rounds = [
    ...buildKnockoutRounds(qualifiedTeams, champion, finalist, ui),
  ];
  return (
    <div className="grid gap-2">
      {rounds.map(({ round, teams }) => (
        <div
          key={round}
          className="grid gap-2 rounded-lg border border-white/8 bg-white/[0.025] p-3 md:grid-cols-[120px_1fr]"
        >
          <span className="font-mono text-xs uppercase text-white/42">
            {round}
          </span>
          <div className="flex flex-wrap gap-2">
            {teams.map((team, index) => (
              <span
                key={`${round}-${team}`}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs',
                  index === 0
                    ? 'border-[#c7ff57]/40 bg-[#c7ff57]/12 text-[#e7ffad]'
                    : 'border-white/10 bg-black/20 text-white/58'
                )}
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DynamicThirdPlaceTable({
  compact,
  rankings,
  t,
  ui,
}: {
  compact?: boolean;
  rankings: StandingRow[];
  t: WorldCupContent;
  ui: ToolUiCopy;
}) {
  const rows = rankings.slice(0, compact ? 8 : 12);
  return (
    <div className="grid gap-3">
      {!compact ? (
        <div className="rounded-lg border border-[#c7ff57]/18 bg-[#c7ff57]/8 px-4 py-3">
          <p className="font-mono text-xs uppercase text-[#d8ff80]">
            {ui.thirdPlace.ruleTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {ui.thirdPlace.ruleBody}
          </p>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
        <div className="grid grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.9fr] border-b border-white/10 bg-black/20 px-4 py-3 font-mono text-xs uppercase text-white/42">
          {t.thirdPlace.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {rows.map((row, index) => (
          <Fragment key={`${row.group}-${row.team}`}>
            <div className="grid grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.9fr] items-center border-b border-white/6 px-4 py-3 text-sm last:border-0">
              <span className="font-medium text-white">{row.team}</span>
              <span className="text-white/55">{row.group}</span>
              <span className="text-white/70">{row.points}</span>
              <span className="text-white/70">{row.goalDifference}</span>
              <span className="text-white/70">{row.goalsFor}</span>
              <span
                className={cn(
                  'w-fit rounded-full px-2 py-0.5 text-xs',
                  index < 8
                    ? 'bg-[#c7ff57]/14 text-[#d8ff80]'
                    : 'bg-white/8 text-white/45'
                )}
              >
                {index < 8 ? ui.qualified : ui.out}
              </span>
            </div>
            {!compact && index === 7 && rows.length > 8 ? (
              <div className="border-b border-[#c7ff57]/20 bg-[#c7ff57]/8 px-4 py-2 text-xs font-medium text-[#e7ffad]">
                {ui.thirdPlace.cutLine}
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ToolWorkflow({
  pageKey,
  ui,
}: {
  pageKey: PageKey;
  ui: ToolUiCopy;
}) {
  const steps = ui.workflow[pageKey] ?? ui.workflow.home;

  return (
    <div className="mb-5 grid gap-2 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="rounded-lg border border-white/8 bg-white/[0.025] p-3"
        >
          <span className="font-mono text-[11px] uppercase text-[#c7ff57]/70">
            {ui.stepLabel} {index + 1}
          </span>
          <p className="mt-2 text-sm font-semibold text-white">{step.title}</p>
          <p className="mt-1 text-xs leading-5 text-white/48">{step.body}</p>
        </div>
      ))}
    </div>
  );
}

function ToolShell({
  children,
  note,
}: {
  children: ReactNode;
  note: string;
}) {
  return (
    <div
      id="predictor"
      className="rounded-xl border border-white/10 bg-[#0c120e]/90 p-3 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <div className="rounded-lg border border-white/8 bg-black/30 p-4 md:p-5">
        {children}
      </div>
      <p className="px-2 pt-3 text-xs text-white/38">{note}</p>
    </div>
  );
}

function PanelHeader({
  body,
  eyebrow,
  title,
}: {
  body: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="font-mono text-xs uppercase text-[#c7ff57]/75">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{body}</p>
    </div>
  );
}

function PageFocusSection({
  champion,
  finalist,
  pageKey,
  projectedWinners,
  qualifiedTeams,
  standings,
  thirdRankings,
  t,
  ui,
}: {
  champion: string;
  finalist: string;
  pageKey: PageKey;
  projectedWinners: string[];
  qualifiedTeams: StandingRow[];
  standings: StandingRow[];
  thirdRankings: StandingRow[];
  t: WorldCupContent;
  ui: ToolUiCopy;
}) {
  if (pageKey === 'home') {
    return (
      <section className="border-b border-white/10 bg-[#07100b] px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionIntro
            eyebrow={ui.homeFocus.eyebrow}
            title={t.thirdPlace.title}
            body={t.thirdPlace.body}
          />
          <DynamicThirdPlaceTable compact rankings={thirdRankings} t={t} ui={ui} />
        </div>
      </section>
    );
  }

  const focus = {
    predictor: {
      eyebrow: ui.focus.predictor.eyebrow,
      title: ui.focus.predictor.title,
      body: ui.focus.predictor.body,
      cards: ui.focus.predictor.cards,
    },
    bracket: {
      eyebrow: ui.focus.bracket.eyebrow,
      title: ui.focus.bracket.title,
      body: ui.focus.bracket.body,
      cards: [
        ['R32', `${projectedWinners.length} ${ui.focus.bracket.seededTeams}`],
        ['SF', `${champion} ${ui.versus} ${finalist}`],
        [ui.rounds.final, `${champion} ${ui.focus.bracket.championPath}`],
      ],
    },
    groupStage: {
      eyebrow: ui.focus.groupStage.eyebrow,
      title: ui.focus.groupStage.title,
      body: ui.focus.groupStage.body,
      cards: [
        ['12', ui.focus.groupStage.groupTables],
        ['24', `${standings.filter((row) => row.rank <= 2).length} ${ui.focus.groupStage.autoQualifiers}`],
        ['8', `${thirdRankings.slice(0, 8).length} ${ui.focus.groupStage.thirdSlots}`],
      ],
    },
    thirdPlace: {
      eyebrow: ui.focus.thirdPlace.eyebrow,
      title: ui.focus.thirdPlace.title,
      body: ui.focus.thirdPlace.body,
      cards: ui.focus.thirdPlace.cards,
    },
    monteCarlo: {
      eyebrow: ui.focus.monteCarlo.eyebrow,
      title: ui.focus.monteCarlo.title,
      body: ui.focus.monteCarlo.body,
      cards: [
        ['10k', ui.focus.monteCarlo.repeatSimulations],
        ['48', `${qualifiedTeams.length} ${ui.focus.monteCarlo.qualifiedInputs}`],
        ['6', ui.focus.monteCarlo.roundColumns],
      ],
    },
  }[pageKey];

  return (
    <section className="border-b border-white/10 bg-[#07100b] px-4 py-16 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro
          eyebrow={focus.eyebrow}
          title={focus.title}
          body={focus.body}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {focus.cards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
                {label}
              </p>
              <p className="mt-4 text-lg font-semibold leading-6 text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolSeoSection({
  activeLocale,
  pageKey,
  t,
  ui,
}: {
  activeLocale: Locale;
  pageKey: PageKey;
  t: WorldCupContent;
  ui: ToolUiCopy;
}) {
  const labels = getSeoLayoutLabels(t.config.languageGroup);
  const cards = getToolSeoCards(pageKey, t, ui, labels);
  const relatedPages = pageKeys.filter((key) => key !== pageKey).slice(0, 4);
  return (
    <section className="border-b border-white/10 bg-[#050907] px-4 py-16 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
            {labels.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            {t.seo.h1} {labels.headingSuffix}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/62">
            {t.seo.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {relatedPages.map((key) => (
              <a
                key={key}
                href={getPagePath(activeLocale, key)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/58 transition hover:border-[#c7ff57]/40 hover:text-white"
              >
                {t.nav[key]}
              </a>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#c7ff57]/18 bg-[#c7ff57]/8 p-4">
            <p className="font-mono text-xs uppercase text-[#d8ff80]">
              {labels.groupLinksTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {labels.groupLinksBody}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sampleGroups.map((group) => (
                <a
                  key={group.group}
                  href={getGroupPredictionPath(
                    activeLocale,
                    `group-${group.group.toLowerCase()}-goal-prediction`
                  )}
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-[#c7ff57]/35 hover:text-white"
                >
                  {labels.groupPrefix} {group.group}
                </a>
              ))}
            </div>
          </div>
          <TeamDirectory activeLocale={activeLocale} labels={labels} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={cn(
                'rounded-lg border p-5',
                index === 0
                  ? 'border-[#c7ff57]/30 bg-[#c7ff57]/10'
                  : 'border-white/10 bg-white/[0.025]'
              )}
            >
              <p className="font-mono text-xs uppercase text-[#c7ff57]/72">
                {card.label}
              </p>
              <h3 className="mt-4 text-lg font-semibold leading-6 text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/56">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchIntentSection({
  activeLocale,
  t,
  ui,
}: {
  activeLocale: Locale;
  t: WorldCupContent;
  ui: ToolUiCopy;
}) {
  return (
    <section className="border-b border-white/10 bg-[#07100b] px-4 py-16 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionIntro
          eyebrow={ui.searchIntentEyebrow}
          title={t.seoDeepDive.title}
          body={t.seoDeepDive.intro}
        />
        <div className="grid gap-3">
          {t.seoDeepDive.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-white/10 bg-white/[0.028] p-5"
            >
              <h2 className="text-xl font-semibold leading-7 text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                {section.body}
              </p>
              {section.links?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.links.map((link) => (
                    <a
                      key={link.pageKey}
                      href={getPagePath(activeLocale, link.pageKey)}
                      className="rounded-md border border-[#c7ff57]/22 bg-[#c7ff57]/8 px-3 py-2 text-xs font-semibold text-[#d8ff80] transition hover:border-[#c7ff57]/45 hover:bg-[#c7ff57]/12"
                    >
                      {ui.relatedToolLabel}: {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamDirectory({
  activeLocale,
  labels,
}: {
  activeLocale: Locale;
  labels: ReturnType<typeof getSeoLayoutLabels>;
}) {
  const teamsByGroup = sampleGroups.map((group) => ({
    group: group.group,
    teams: group.teams
      .map((name) => teamPages.find((team) => team.name === name))
      .filter(Boolean),
  }));

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="font-mono text-xs uppercase text-[#d8ff80]">
        {labels.teamLinksTitle}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/58">
        {labels.teamLinksBody}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {teamsByGroup.map((group) => (
          <div
            key={group.group}
            className="rounded-lg border border-white/8 bg-black/20 p-3"
          >
            <p className="mb-2 font-mono text-[11px] uppercase text-white/42">
              {labels.groupPrefix} {group.group}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {group.teams.map((team) => (
                <a
                  key={team!.slug}
                  href={getTeamPath(activeLocale, team!.slug)}
                  className="truncate rounded-md border border-white/8 bg-white/[0.025] px-2.5 py-2 text-xs font-medium text-white/62 transition hover:border-[#c7ff57]/35 hover:text-white"
                >
                  {team!.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({
  body,
  eyebrow,
  title,
}: {
  body: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/62">{body}</p>
    </div>
  );
}

function getToolSeoCards(
  pageKey: PageKey,
  t: WorldCupContent,
  ui: ToolUiCopy,
  labels: ReturnType<typeof getSeoLayoutLabels>
) {
  const shared = {
    home: [
      [labels.stepOne, ui.groupStage.title, t.predictor.body],
      [labels.stepTwo, t.thirdPlace.title, t.thirdPlace.body],
      [labels.stepThree, ui.bracket.title, ui.bracket.body],
    ],
    predictor: [
      [labels.stepOne, ui.predictor.manualTitle, ui.predictor.manualBody],
      [labels.stepTwo, t.predictor.champion, labels.predictorChampion],
      [labels.stepThree, ui.sharePicks, labels.predictorShare],
    ],
    bracket: [
      [labels.stepOne, ui.bracket.title, ui.bracket.body],
      [labels.stepTwo, ui.rounds.round32, labels.bracketRound32],
      [labels.stepThree, ui.rounds.final, labels.bracketFinal],
    ],
    groupStage: [
      [labels.stepOne, ui.groupStage.title, ui.groupStage.body],
      [labels.stepTwo, ui.groupStage.autoLabel, ui.groupStage.autoValue],
      [labels.stepThree, ui.groupStage.bubbleLabel, labels.groupStageBubble],
    ],
    thirdPlace: [
      [labels.stepOne, t.thirdPlace.title, ui.thirdPlace.body],
      [labels.stepTwo, ui.qualified, labels.thirdPlaceQualified],
      [labels.stepThree, ui.rounds.round32, labels.thirdPlaceRound32],
    ],
    monteCarlo: [
      [labels.stepOne, ui.monteCarlo.title, ui.monteCarlo.body],
      [labels.stepTwo, ui.monteCarlo.inputsLabel, ui.monteCarlo.inputsValue],
      [labels.stepThree, ui.monteCarlo.outputLabel, ui.monteCarlo.outputValue],
    ],
  } satisfies Record<PageKey, string[][]>;

  return shared[pageKey].map(([label, title, body]) => ({ label, title, body }));
}

function getSeoLayoutLabels(group: WorldCupContent['config']['languageGroup']) {
  const labels = {
    en: {
      eyebrow: 'How this tool works',
      headingSuffix: 'prediction workflow',
      stepOne: 'Start',
      stepTwo: 'Decision',
      stepThree: 'Next step',
      predictorChampion: 'Lock a champion after the group and knockout choices are consistent.',
      predictorShare: 'Turn the completed picks into a URL, image, or pool entry.',
      bracketRound32: 'Check every qualifier before moving into the later rounds.',
      bracketFinal: 'Keep the champion path visible so the page answers the main search intent.',
      groupStageBubble: 'Compare the eighth best third-place line against every group table.',
      thirdPlaceQualified: 'The cutoff separates the eight advancing third-place teams from the four eliminated teams.',
      thirdPlaceRound32: 'Send the qualified third-place teams into the Round of 32 lane.',
      groupLinksTitle: 'Group prediction hub',
      groupLinksBody: 'Open a focused score and goal prediction page for each group.',
      groupPrefix: 'Group',
      teamLinksTitle: 'Team path directory',
      teamLinksBody: 'Open any team page to review its group opponents, qualification routes, match list, and bracket path.',
    },
    es: {
      eyebrow: 'Como funciona',
      headingSuffix: 'flujo de prediccion',
      stepOne: 'Inicio',
      stepTwo: 'Decision',
      stepThree: 'Siguiente paso',
      predictorChampion: 'Bloquea campeon cuando grupos y eliminatorias sean coherentes.',
      predictorShare: 'Convierte los picks en enlace, imagen o entrada de porra.',
      bracketRound32: 'Revisa cada clasificado antes de avanzar rondas.',
      bracketFinal: 'Mantiene visible el camino del campeon para responder la busqueda.',
      groupStageBubble: 'Compara la linea del octavo mejor tercero contra todas las tablas.',
      thirdPlaceQualified: 'El corte separa ocho terceros clasificados de cuatro eliminados.',
      thirdPlaceRound32: 'Envia los terceros clasificados a la ronda de 32.',
      groupLinksTitle: 'Hub de grupos',
      groupLinksBody: 'Abre una pagina enfocada para predecir goles y marcadores por grupo.',
      groupPrefix: 'Grupo',
      teamLinksTitle: 'Directorio de equipos',
      teamLinksBody: 'Abre la pagina de cada equipo para revisar rivales, rutas de clasificacion, partidos y camino del bracket.',
    },
    pt: {
      eyebrow: 'Como funciona',
      headingSuffix: 'fluxo de previsao',
      stepOne: 'Inicio',
      stepTwo: 'Decisao',
      stepThree: 'Proximo passo',
      predictorChampion: 'Fixe o campeao quando grupos e mata-mata estiverem coerentes.',
      predictorShare: 'Transforme os palpites em link, imagem ou entrada de bolao.',
      bracketRound32: 'Confira cada classificado antes de avancar as fases.',
      bracketFinal: 'Mantenha o caminho do campeao visivel para responder a busca.',
      groupStageBubble: 'Compare a linha do oitavo melhor terceiro com todas as tabelas.',
      thirdPlaceQualified: 'O corte separa oito terceiros classificados de quatro eliminados.',
      thirdPlaceRound32: 'Envie os terceiros classificados para a ronda de 32.',
      groupLinksTitle: 'Hub dos grupos',
      groupLinksBody: 'Abra uma pagina dedicada para prever gols e placares de cada grupo.',
      groupPrefix: 'Grupo',
      teamLinksTitle: 'Diretorio das selecoes',
      teamLinksBody: 'Abra a pagina de cada selecao para ver rivais, rotas de classificacao, jogos e caminho no chaveamento.',
    },
    zh: {
      eyebrow: '使用方法',
      headingSuffix: '预测流程',
      stepOne: '第一步',
      stepTwo: '关键判断',
      stepThree: '下一步',
      predictorChampion: '当小组和淘汰赛选择一致后，锁定冠军预测。',
      predictorShare: '把完成的预测变成链接、图片或竞猜池记录。',
      bracketRound32: '先确认每支出线球队，再推进到后续轮次。',
      bracketFinal: '始终让冠军路径可见，直接回答搜索意图。',
      groupStageBubble: '用所有小组积分榜对比第 8 个最佳第三名晋级线。',
      thirdPlaceQualified: '晋级线会把 8 支晋级第三名和 4 支出局第三名分开。',
      thirdPlaceRound32: '把晋级的第三名球队送入 32 强路径。',
      groupLinksTitle: '小组预测页面集群',
      groupLinksBody: '每个小组都有独立的比分、进球和排名预测页，方便逐组调整比分并查看排名变化。',
      groupPrefix: '小组',
      teamLinksTitle: '球队路径目录',
      teamLinksBody: '进入任意球队页，查看同组对手、出线路径、小组赛列表和淘汰赛路径。',
    },
  };
  const derived = {
    fr: labels.es,
    de: labels.en,
    it: labels.es,
    nl: labels.en,
    ja: labels.zh,
    ko: labels.zh,
  } as const;
  return labels[group as keyof typeof labels] ?? derived[group as keyof typeof derived] ?? labels.en;
}

export function getToolUiCopy(group: WorldCupContent['config']['languageGroup']) {
  const ui = {
    en: {
      liveIntentLabel: 'Live intent',
      breadcrumbHome: 'Home',
      searchIntentEyebrow: 'Search intent',
      relatedToolLabel: 'Related tool',
      groupLabel: 'Group',
      scoreLabel: 'Score',
      pointsGoalDiff: 'Pts / GD',
      pointsShort: 'pts',
      winnerShort: 'W',
      moveUp: 'Move up',
      moveDown: 'Move down',
      moreMatches: 'more',
      qualified: 'Qualified',
      out: 'Out',
      versus: 'vs',
      share: 'Share',
      sharePicks: 'Share picks',
      predictionLink: 'Prediction link',
      bracketImage: 'Bracket image',
      details: 'Details',
      stepLabel: 'Step',
      editingGroupLabel: 'Editing group',
      visibleGroupHelp: 'Change the six scores in this group; the standings and third-place table update immediately below.',
      matchesLabel: 'matches',
      groupTabsLabel: 'Choose group to edit',
      stages: ['Groups', 'Best 3rd', 'R32', 'R16', 'QF', 'Final'],
      pathCanvas: {
        groupsTitle: 'Group ranking cards',
        groupsBody: 'Start by ranking each group. Scorelines stay hidden until you open a group detail page or edit match scores.',
        rankOnly: 'Rank the group first; add exact scores only when you need detail.',
        rankMode: 'ranking',
        scoreMode: 'scores',
        round32Body: 'Auto-filled from group winners, runners-up, and best third-place teams.',
        round16Body: 'Advance your Round of 32 picks into the next lane.',
        quarterBody: 'Keep only the strongest paths alive.',
        semiBody: 'Four teams remain before the final.',
        finalBody: 'Predict the final pair before opening match details.',
        championTitle: 'Champion',
        championBody: 'Final result from your full path.',
      },
      rounds: {
        round32: 'Round of 32',
        round16: 'Round of 16',
        quarterFinals: 'Quarter-finals',
        semiFinals: 'Semi-finals',
        final: 'Final',
      },
      bracket: {
        eyebrow: 'Knockout path builder',
        title: 'Round-by-round bracket',
        body: 'Start from qualified group winners, then trace every knockout step to a champion instead of editing group tables.',
        modeLabel: 'Bracket mode',
        modeValue: 'Knockout-first',
        pathLabel: 'Champion path',
        exportLabel: 'Export',
        exportValue: 'Shareable bracket',
      },
      groupStage: {
        eyebrow: 'Group table workspace',
        title: '12 groups, standings first',
        body: 'This version keeps the group-stage table above the fold, because that searcher wants standings, tiebreakers, and qualifiers before a bracket.',
        tablesLabel: 'Tables',
        tablesValue: '12 groups',
        autoLabel: 'Auto-qualify',
        autoValue: '24 top-two teams',
        bubbleLabel: 'Bubble',
        cutoffFallback: '8th line',
        cutoffLabel: 'cutoff',
      },
      thirdPlace: {
        eyebrow: 'Best-third-place calculator',
        body: 'The calculator is the whole page: compare points, goal difference, goals scored, and bubble status before the Round of 32 bracket is generated.',
        ruleTitle: 'How the cutoff works',
        ruleBody: 'The top two teams from each group qualify first. Then all twelve third-place teams are ranked together by points, goal difference, and goals scored; only the best eight advance.',
        cutLine: 'Qualification line: teams above this line advance, teams below it are currently out.',
      },
      monteCarlo: {
        eyebrow: 'Probability model',
        title: 'Monte Carlo run preview',
        body: 'This page focuses on repeat simulation output: champion odds, final probability, and round reach rates rather than manual picks.',
        championOdds: 'Champion',
        finalOdds: 'Final',
        runsLabel: 'Runs',
        inputsLabel: 'Inputs',
        inputsValue: 'Ratings + form',
        outputLabel: 'Output',
        outputValue: 'Round odds',
      },
      predictor: {
        manualTitle: 'Manual pick board',
        manualBody: 'This page is tuned for people who want to make and share picks: choose winners group by group, lock a champion, then export the bracket.',
        boardHint: 'Use this quick board when you only want to pick group winners. For score-by-score simulation, use the simulator or group-stage calculator page.',
      },
      workflow: {
        home: [
          { title: 'Edit scores', body: 'Open one group tab, enter match scores, and let the table recalculate.' },
          { title: 'Check qualifiers', body: 'Top two teams qualify automatically; the third-place table decides the last eight slots.' },
          { title: 'Read the path', body: 'The bracket preview turns the qualified teams into a champion path.' },
        ],
        predictor: [
          { title: 'Pick winners', body: 'Choose a likely winner for every group without entering every score.' },
          { title: 'Compare the board', body: 'The selected winners feed the champion and finalist preview.' },
          { title: 'Share later', body: 'Use the completed picks as a lightweight pool entry or quick prediction link.' },
        ],
        bracket: [
          { title: 'Start from qualifiers', body: 'The bracket page begins after the group-stage calculation.' },
          { title: 'Scan rounds', body: 'Round of 32, Round of 16, quarters, semis, and final stay visible.' },
          { title: 'Follow champion', body: 'The highlighted path answers who reaches the final and wins.' },
        ],
        groupStage: [
          { title: 'Choose a group', body: 'Use A-L tabs so you only edit six matches at a time.' },
          { title: 'Update scores', body: 'Every score changes points, goal difference, and goals scored.' },
          { title: 'Watch the bubble', body: 'The eighth third-place team is the key cutoff for 2026.' },
        ],
        thirdPlace: [
          { title: 'Rank third teams', body: 'Only teams finishing third in their group enter this table.' },
          { title: 'Apply tiebreakers', body: 'Points come first, then goal difference, then goals scored.' },
          { title: 'Find the line', body: 'The top eight third-place teams advance into the Round of 32.' },
        ],
        monteCarlo: [
          { title: 'Use current teams', body: 'The probability preview starts from the current qualified-team list.' },
          { title: 'Read two odds', body: 'Each row separates champion probability from final probability.' },
          { title: 'Compare contenders', body: 'The strongest paths rise to the top after repeated simulation.' },
        ],
      },
      homeFocus: { eyebrow: 'Best-third-place wedge' },
      focus: {
        predictor: {
          eyebrow: 'Pick workflow',
          title: 'Built for saving and sharing predictions',
          body: 'The predictor page should make picks feel deliberate: group ranking, knockout winner, champion lock, then a shareable result.',
          cards: [
            ['1', 'Pick group rankings'],
            ['2', 'Advance knockout winners'],
            ['3', 'Save champion bracket'],
          ],
        },
        bracket: {
          eyebrow: 'Bracket output',
          title: 'Knockout view before everything else',
          body: 'The bracket page puts visual progression, round labels, and champion path at the center.',
          seededTeams: 'seeded teams',
          championPath: 'champion path',
        },
        groupStage: {
          eyebrow: 'Standings logic',
          title: 'Tables, tiebreakers, and qualification state',
          body: 'The group-stage page answers who qualifies, who is on the bubble, and which table rules changed the bracket.',
          groupTables: 'group tables',
          autoQualifiers: 'auto qualifiers',
          thirdSlots: 'best third-place slots',
        },
        thirdPlace: {
          eyebrow: 'Tiebreaker ladder',
          title: 'The 2026 format problem gets its own calculator',
          body: 'This page targets the confusing part of the new format: ranking third-place teams across groups.',
          cards: [
            ['PTS', 'points first'],
            ['GD', 'goal difference next'],
            ['GF', 'goals scored after that'],
          ],
        },
        monteCarlo: {
          eyebrow: 'Simulation output',
          title: 'Probability tables, not manual bracket editing',
          body: 'The Monte Carlo page feels analytical: run count, probability bars, and round reach rates matter more than individual picks.',
          repeatSimulations: 'repeat simulations',
          qualifiedInputs: 'qualified-team inputs',
          roundColumns: 'round probability columns',
        },
      },
    },
    es: {
      liveIntentLabel: 'Intencion activa',
      breadcrumbHome: 'Inicio',
      searchIntentEyebrow: 'Intencion de busqueda',
      relatedToolLabel: 'Herramienta relacionada',
      groupLabel: 'Grupo',
      scoreLabel: 'Marcador',
      pointsGoalDiff: 'Pts / DG',
      pointsShort: 'pts',
      winnerShort: 'G',
      moveUp: 'Subir',
      moveDown: 'Bajar',
      moreMatches: 'mas',
      qualified: 'Clasificado',
      out: 'Fuera',
      versus: 'vs',
      share: 'Compartir',
      sharePicks: 'Compartir picks',
      predictionLink: 'Enlace de prediccion',
      bracketImage: 'Imagen del bracket',
      details: 'Detalles',
      stepLabel: 'Paso',
      editingGroupLabel: 'Editando grupo',
      visibleGroupHelp: 'Cambia los seis marcadores de este grupo; tabla y terceros se recalculan al instante.',
      matchesLabel: 'partidos',
      groupTabsLabel: 'Elegir grupo para editar',
      stages: ['Grupos', 'Mejores 3os', 'R32', 'R16', 'CF', 'Final'],
      pathCanvas: {
        groupsTitle: 'Ranking de grupos',
        groupsBody: 'Empieza ordenando cada grupo. Los marcadores aparecen solo cuando abres detalles o editas partidos.',
        rankOnly: 'Ordena el grupo primero; agrega marcadores exactos solo si necesitas detalle.',
        rankMode: 'ranking',
        scoreMode: 'marcadores',
        round32Body: 'Se completa con primeros, segundos y mejores terceros.',
        round16Body: 'Avanza tus picks de R32 a la siguiente columna.',
        quarterBody: 'Mantiene vivas las rutas mas fuertes.',
        semiBody: 'Quedan cuatro equipos antes de la final.',
        finalBody: 'Predice la pareja final antes de abrir detalles.',
        championTitle: 'Campeon',
        championBody: 'Resultado final de tu ruta completa.',
      },
      rounds: {
        round32: 'Ronda de 32',
        round16: 'Octavos',
        quarterFinals: 'Cuartos',
        semiFinals: 'Semifinales',
        final: 'Final',
      },
      bracket: {
        eyebrow: 'Constructor de eliminatorias',
        title: 'Bracket ronda por ronda',
        body: 'Parte de los clasificados y sigue cada cruce hasta el campeon, con menos peso en las tablas.',
        modeLabel: 'Modo bracket',
        modeValue: 'Eliminatorias primero',
        pathLabel: 'Camino del campeon',
        exportLabel: 'Exportar',
        exportValue: 'Bracket compartible',
      },
      groupStage: {
        eyebrow: 'Mesa de grupos',
        title: '12 grupos y tablas primero',
        body: 'Esta pagina prioriza marcadores, clasificaciones, desempates y clasificados antes del bracket.',
        tablesLabel: 'Tablas',
        tablesValue: '12 grupos',
        autoLabel: 'Clasificacion directa',
        autoValue: '24 equipos top 2',
        bubbleLabel: 'Burbuja',
        cutoffFallback: 'linea 8',
        cutoffLabel: 'corte',
      },
      thirdPlace: {
        eyebrow: 'Calculadora de terceros',
        body: 'Compara puntos, diferencia de goles, goles a favor y estado antes de generar la ronda de 32.',
        ruleTitle: 'Como funciona el corte',
        ruleBody: 'Primero clasifican los dos mejores de cada grupo. Luego los doce terceros se ordenan por puntos, diferencia de goles y goles a favor; solo avanzan los ocho mejores.',
        cutLine: 'Linea de clasificacion: los equipos arriba avanzan, los de abajo quedan fuera por ahora.',
      },
      monteCarlo: {
        eyebrow: 'Modelo de probabilidad',
        title: 'Vista de simulacion Monte Carlo',
        body: 'Esta pagina se centra en probabilidades: campeon, final y avance por ronda, no en picks manuales.',
        championOdds: 'Campeon',
        finalOdds: 'Final',
        runsLabel: 'Corridas',
        inputsLabel: 'Datos',
        inputsValue: 'Ratings + forma',
        outputLabel: 'Salida',
        outputValue: 'Probabilidad por ronda',
      },
      predictor: {
        manualTitle: 'Tablero de picks manuales',
        manualBody: 'Elige ganadores grupo por grupo, bloquea campeon y comparte tu prediccion.',
        boardHint: 'Usa este tablero rapido si solo quieres elegir ganadores de grupo. Para simular marcador por marcador, entra al simulador o a la calculadora de grupos.',
      },
      workflow: {
        home: [
          { title: 'Editar marcadores', body: 'Abre un grupo, cambia partidos y deja que la tabla se recalcule.' },
          { title: 'Revisar clasificados', body: 'Los dos primeros pasan directo y la tabla de terceros decide ocho cupos.' },
          { title: 'Leer el camino', body: 'La vista de bracket convierte clasificados en ruta de campeon.' },
        ],
        predictor: [
          { title: 'Elegir ganadores', body: 'Marca un ganador probable por grupo sin introducir cada marcador.' },
          { title: 'Comparar tablero', body: 'Los ganadores alimentan la vista de campeon y finalista.' },
          { title: 'Compartir despues', body: 'Esta pagina sirve para pools, predicciones y picks rapidos.' },
        ],
        bracket: [
          { title: 'Partir de clasificados', body: 'El bracket empieza despues del calculo de fase de grupos.' },
          { title: 'Ver rondas', body: 'R32, octavos, cuartos, semifinales y final quedan visibles.' },
          { title: 'Seguir campeon', body: 'La ruta destacada responde quien llega a la final y gana.' },
        ],
        groupStage: [
          { title: 'Elegir grupo', body: 'Usa las pestanas A-L para editar seis partidos por vez.' },
          { title: 'Actualizar marcadores', body: 'Cada marcador cambia puntos, diferencia y goles a favor.' },
          { title: 'Mirar la burbuja', body: 'El octavo mejor tercero es el corte clave de 2026.' },
        ],
        thirdPlace: [
          { title: 'Ordenar terceros', body: 'Solo entran aqui los equipos terceros de cada grupo.' },
          { title: 'Aplicar desempates', body: 'Puntos primero, luego diferencia y goles a favor.' },
          { title: 'Encontrar linea', body: 'Los ocho mejores terceros avanzan a la ronda de 32.' },
        ],
        monteCarlo: [
          { title: 'Usar clasificados', body: 'La probabilidad parte de la lista actual de clasificados.' },
          { title: 'Leer dos cuotas', body: 'Cada fila separa probabilidad de campeon y de final.' },
          { title: 'Comparar candidatos', body: 'Las rutas mas fuertes suben tras simulaciones repetidas.' },
        ],
      },
      homeFocus: { eyebrow: 'Entrada mejores terceros' },
      focus: {
        predictor: {
          eyebrow: 'Flujo de picks',
          title: 'Pensado para guardar y compartir predicciones',
          body: 'El predictor hace que cada pick sea claro: ranking de grupos, ganadores, campeon y resultado compartible.',
          cards: [
            ['1', 'Elegir ranking de grupos'],
            ['2', 'Avanzar ganadores'],
            ['3', 'Guardar bracket campeon'],
          ],
        },
        bracket: {
          eyebrow: 'Salida del bracket',
          title: 'La vista eliminatoria primero',
          body: 'El bracket centra la progresion visual, las rondas y el camino al titulo.',
          seededTeams: 'equipos sembrados',
          championPath: 'camino campeon',
        },
        groupStage: {
          eyebrow: 'Logica de tablas',
          title: 'Clasificaciones, desempates y estado',
          body: 'La pagina de grupos responde quien clasifica, quien esta en burbuja y que regla cambia el bracket.',
          groupTables: 'tablas de grupo',
          autoQualifiers: 'clasificados directos',
          thirdSlots: 'cupos de terceros',
        },
        thirdPlace: {
          eyebrow: 'Escalera de desempate',
          title: 'El problema del formato 2026 tiene calculadora propia',
          body: 'Esta pagina ordena terceros entre grupos, la parte mas confusa del nuevo formato.',
          cards: [
            ['PTS', 'puntos primero'],
            ['DG', 'diferencia despues'],
            ['GF', 'goles a favor luego'],
          ],
        },
        monteCarlo: {
          eyebrow: 'Salida de simulacion',
          title: 'Tablas de probabilidad, no edicion manual',
          body: 'Monte Carlo prioriza corridas, barras de probabilidad y avance por ronda.',
          repeatSimulations: 'simulaciones repetidas',
          qualifiedInputs: 'equipos clasificados',
          roundColumns: 'columnas de probabilidad',
        },
      },
    },
    pt: {
      liveIntentLabel: 'Intencao ativa',
      breadcrumbHome: 'Inicio',
      searchIntentEyebrow: 'Intencao de busca',
      relatedToolLabel: 'Ferramenta relacionada',
      groupLabel: 'Grupo',
      scoreLabel: 'Placar',
      pointsGoalDiff: 'Pts / SG',
      pointsShort: 'pts',
      winnerShort: 'V',
      moveUp: 'Subir',
      moveDown: 'Descer',
      moreMatches: 'mais',
      qualified: 'Classificado',
      out: 'Fora',
      versus: 'vs',
      share: 'Compartilhar',
      sharePicks: 'Compartilhar palpites',
      predictionLink: 'Link da previsao',
      bracketImage: 'Imagem do chaveamento',
      details: 'Detalhes',
      stepLabel: 'Passo',
      editingGroupLabel: 'Editando grupo',
      visibleGroupHelp: 'Altere os seis placares deste grupo; tabela e terceiros mudam imediatamente.',
      matchesLabel: 'jogos',
      groupTabsLabel: 'Escolher grupo para editar',
      stages: ['Grupos', 'Melhores 3os', 'R32', 'R16', 'QF', 'Final'],
      pathCanvas: {
        groupsTitle: 'Ranking dos grupos',
        groupsBody: 'Comece ordenando cada grupo. Os placares aparecem so quando voce abre detalhes ou edita jogos.',
        rankOnly: 'Ordene o grupo primeiro; adicione placares exatos so quando precisar.',
        rankMode: 'ranking',
        scoreMode: 'placares',
        round32Body: 'Preenchido por primeiros, segundos e melhores terceiros.',
        round16Body: 'Avance seus palpites da R32 para a proxima coluna.',
        quarterBody: 'Mantenha vivas as rotas mais fortes.',
        semiBody: 'Quatro selecoes seguem antes da final.',
        finalBody: 'Preveja a final antes de abrir detalhes.',
        championTitle: 'Campeao',
        championBody: 'Resultado final do caminho completo.',
      },
      rounds: {
        round32: 'Ronda de 32',
        round16: 'Oitavas',
        quarterFinals: 'Quartas',
        semiFinals: 'Semifinais',
        final: 'Final',
      },
      bracket: {
        eyebrow: 'Construtor do mata-mata',
        title: 'Chaveamento rodada por rodada',
        body: 'Comece pelos classificados e acompanhe cada confronto ate o campeao.',
        modeLabel: 'Modo chave',
        modeValue: 'Mata-mata primeiro',
        pathLabel: 'Caminho do campeao',
        exportLabel: 'Exportar',
        exportValue: 'Chave compartilhavel',
      },
      groupStage: {
        eyebrow: 'Area de grupos',
        title: '12 grupos e tabelas primeiro',
        body: 'A pagina prioriza placares, classificacao, desempates e vagas antes do chaveamento.',
        tablesLabel: 'Tabelas',
        tablesValue: '12 grupos',
        autoLabel: 'Classificacao direta',
        autoValue: '24 selecoes top 2',
        bubbleLabel: 'Bolha',
        cutoffFallback: 'linha 8',
        cutoffLabel: 'corte',
      },
      thirdPlace: {
        eyebrow: 'Calculadora de terceiros',
        body: 'Compare pontos, saldo, gols marcados e status antes de gerar a ronda de 32.',
        ruleTitle: 'Como funciona o corte',
        ruleBody: 'Primeiro passam os dois melhores de cada grupo. Depois os doze terceiros sao ordenados por pontos, saldo e gols marcados; so os oito melhores avancam.',
        cutLine: 'Linha de classificacao: equipes acima avancam, equipes abaixo ficam fora por enquanto.',
      },
      monteCarlo: {
        eyebrow: 'Modelo de probabilidade',
        title: 'Previa Monte Carlo',
        body: 'Esta pagina mostra probabilidades de titulo, final e avanco por fase, nao apenas palpites manuais.',
        championOdds: 'Campeao',
        finalOdds: 'Final',
        runsLabel: 'Rodadas',
        inputsLabel: 'Entradas',
        inputsValue: 'Ratings + forma',
        outputLabel: 'Saida',
        outputValue: 'Probabilidades por fase',
      },
      predictor: {
        manualTitle: 'Quadro de palpites manuais',
        manualBody: 'Escolha vencedores por grupo, fixe o campeao e compartilhe sua previsao.',
        boardHint: 'Use este quadro rapido se voce quer apenas escolher vencedores de grupo. Para simular placar por placar, use o simulador ou a calculadora de grupos.',
      },
      workflow: {
        home: [
          { title: 'Editar placares', body: 'Abra um grupo, altere jogos e deixe a tabela recalcular.' },
          { title: 'Conferir vagas', body: 'Os dois primeiros passam direto; a tabela de terceiros decide oito vagas.' },
          { title: 'Ler o caminho', body: 'O chaveamento transforma classificados em caminho de campeao.' },
        ],
        predictor: [
          { title: 'Escolher vencedores', body: 'Marque um vencedor provavel por grupo sem preencher todos os placares.' },
          { title: 'Comparar quadro', body: 'Os vencedores alimentam a previa de campeao e finalista.' },
          { title: 'Compartilhar depois', body: 'Esta pagina atende pools, previsoes e palpites rapidos.' },
        ],
        bracket: [
          { title: 'Partir dos classificados', body: 'O chaveamento comeca depois do calculo da fase de grupos.' },
          { title: 'Ver fases', body: 'R32, oitavas, quartas, semis e final ficam visiveis.' },
          { title: 'Seguir campeao', body: 'O caminho destacado mostra quem chega a final e vence.' },
        ],
        groupStage: [
          { title: 'Escolher grupo', body: 'Use as abas A-L para editar seis jogos por vez.' },
          { title: 'Atualizar placares', body: 'Cada placar muda pontos, saldo e gols marcados.' },
          { title: 'Ver a bolha', body: 'O oitavo melhor terceiro e a linha-chave de 2026.' },
        ],
        thirdPlace: [
          { title: 'Ordenar terceiros', body: 'So entram aqui as equipes terceiras de cada grupo.' },
          { title: 'Aplicar desempates', body: 'Pontos primeiro, depois saldo e gols marcados.' },
          { title: 'Encontrar linha', body: 'Os oito melhores terceiros avancam para a ronda de 32.' },
        ],
        monteCarlo: [
          { title: 'Usar classificados', body: 'A probabilidade parte da lista atual de classificados.' },
          { title: 'Ler duas chances', body: 'Cada linha separa chance de titulo e chance de final.' },
          { title: 'Comparar favoritos', body: 'Os caminhos mais fortes sobem apos simulacoes repetidas.' },
        ],
      },
      homeFocus: { eyebrow: 'Entrada melhores terceiros' },
      focus: {
        predictor: {
          eyebrow: 'Fluxo de palpites',
          title: 'Feito para salvar e compartilhar previsoes',
          body: 'O previsor organiza ranking de grupos, vencedores, campeao e resultado compartilhavel.',
          cards: [
            ['1', 'Escolher ranking dos grupos'],
            ['2', 'Avancar vencedores'],
            ['3', 'Salvar chave campea'],
          ],
        },
        bracket: {
          eyebrow: 'Saida do chaveamento',
          title: 'Mata-mata antes de tudo',
          body: 'O chaveamento centraliza progressao visual, fases e caminho ao titulo.',
          seededTeams: 'selecoes posicionadas',
          championPath: 'caminho campeao',
        },
        groupStage: {
          eyebrow: 'Logica de tabelas',
          title: 'Classificacao, desempates e vagas',
          body: 'A pagina de grupos mostra quem passa, quem esta na bolha e qual regra muda o chaveamento.',
          groupTables: 'tabelas de grupo',
          autoQualifiers: 'classificados diretos',
          thirdSlots: 'vagas de terceiros',
        },
        thirdPlace: {
          eyebrow: 'Ordem de desempate',
          title: 'O formato 2026 tem calculadora propria',
          body: 'Esta pagina ordena terceiros entre grupos, a parte mais confusa do novo formato.',
          cards: [
            ['PTS', 'pontos primeiro'],
            ['SG', 'saldo depois'],
            ['GF', 'gols marcados depois'],
          ],
        },
        monteCarlo: {
          eyebrow: 'Saida de simulacao',
          title: 'Tabelas de probabilidade, nao edicao manual',
          body: 'Monte Carlo prioriza rodadas, barras de probabilidade e avanco por fase.',
          repeatSimulations: 'simulacoes repetidas',
          qualifiedInputs: 'selecoes classificadas',
          roundColumns: 'colunas de probabilidade',
        },
      },
    },
  } as const;

  const fallback = ui.en;
  const extra = {
    fr: makeDerivedUi(ui.es, {
      liveIntentLabel: 'Intention active',
      breadcrumbHome: 'Accueil',
      searchIntentEyebrow: 'Intention de recherche',
      relatedToolLabel: 'Outil lie',
      groupLabel: 'Groupe',
      scoreLabel: 'Score',
      pointsShort: 'pts',
      moveUp: 'Monter',
      moveDown: 'Descendre',
      moreMatches: 'autres',
      qualified: 'Qualifie',
      out: 'Elimine',
      share: 'Partager',
      sharePicks: 'Partager les pronostics',
      predictionLink: 'Lien du pronostic',
      bracketImage: 'Image du tableau',
      groupStage: { cutoffFallback: 'ligne 8', cutoffLabel: 'seuil' },
    }),
    de: makeDerivedUi(ui.en, {
      liveIntentLabel: 'Aktive Absicht',
      breadcrumbHome: 'Startseite',
      searchIntentEyebrow: 'Suchintention',
      relatedToolLabel: 'Verwandtes Tool',
      groupLabel: 'Gruppe',
      scoreLabel: 'Ergebnis',
      pointsShort: 'Pkt',
      moveUp: 'Nach oben',
      moveDown: 'Nach unten',
      moreMatches: 'mehr',
      qualified: 'Qualifiziert',
      out: 'Aus',
      share: 'Teilen',
      sharePicks: 'Tipps teilen',
      predictionLink: 'Vorhersage-Link',
      bracketImage: 'Turnierbaum-Bild',
      groupStage: { cutoffFallback: 'Linie 8', cutoffLabel: 'Grenze' },
    }),
    it: makeDerivedUi(ui.es, {
      liveIntentLabel: 'Intento attivo',
      breadcrumbHome: 'Home',
      searchIntentEyebrow: 'Intento di ricerca',
      relatedToolLabel: 'Strumento correlato',
      groupLabel: 'Girone',
      scoreLabel: 'Risultato',
      pointsShort: 'pt',
      moveUp: 'Su',
      moveDown: 'Giu',
      moreMatches: 'altre',
      qualified: 'Qualificata',
      out: 'Fuori',
      share: 'Condividi',
      sharePicks: 'Condividi pronostici',
      predictionLink: 'Link pronostico',
      bracketImage: 'Immagine tabellone',
      groupStage: { cutoffFallback: 'linea 8', cutoffLabel: 'taglio' },
    }),
    nl: makeDerivedUi(ui.en, {
      liveIntentLabel: 'Actieve intentie',
      breadcrumbHome: 'Home',
      searchIntentEyebrow: 'Zoekintentie',
      relatedToolLabel: 'Gerelateerde tool',
      groupLabel: 'Groep',
      scoreLabel: 'Score',
      pointsShort: 'pt',
      moveUp: 'Omhoog',
      moveDown: 'Omlaag',
      moreMatches: 'meer',
      qualified: 'Geplaatst',
      out: 'Uit',
      share: 'Delen',
      sharePicks: 'Voorspelling delen',
      predictionLink: 'Voorspellingslink',
      bracketImage: 'Schema-afbeelding',
      groupStage: { cutoffFallback: 'lijn 8', cutoffLabel: 'grens' },
    }),
    ja: makeDerivedUi(ui.en, {
      liveIntentLabel: '現在の目的',
      breadcrumbHome: 'ホーム',
      searchIntentEyebrow: '検索意図',
      relatedToolLabel: '関連ツール',
      groupLabel: 'グループ',
      scoreLabel: 'スコア',
      pointsGoalDiff: '勝点 / 得失点',
      pointsShort: '点',
      winnerShort: '勝',
      moveUp: '上へ',
      moveDown: '下へ',
      moreMatches: '試合',
      qualified: '通過',
      out: '敗退',
      versus: '対',
      share: '共有',
      sharePicks: '予想を共有',
      predictionLink: '予想リンク',
      bracketImage: 'トーナメント画像',
      details: '詳細',
      stepLabel: 'ステップ',
      editingGroupLabel: '編集中のグループ',
      pathCanvas: {
        groupsTitle: 'グループ順位カード',
        groupsBody: 'まず順位だけを調整できます。詳細でスコアを入力したグループだけ、カードに試合スコアが表示されます。',
        rankOnly: 'まず順位を決め、必要な時だけ詳細でスコアを入力します。',
        rankMode: '順位',
        scoreMode: 'スコア',
      },
      matchesLabel: '試合',
      groupTabsLabel: '編集するグループを選択',
      groupStage: { cutoffFallback: '8位ライン', cutoffLabel: '通過ライン' },
      stages: ['グループ', '3位通過', '32強', '16強', '準々決勝', '決勝'],
    }),
    ko: makeDerivedUi(ui.en, {
      liveIntentLabel: '현재 목적',
      breadcrumbHome: '홈',
      searchIntentEyebrow: '검색 의도',
      relatedToolLabel: '관련 도구',
      groupLabel: '조',
      scoreLabel: '스코어',
      pointsGoalDiff: '승점 / 득실',
      pointsShort: '점',
      winnerShort: '승',
      moveUp: '위로',
      moveDown: '아래로',
      moreMatches: '경기',
      qualified: '진출',
      out: '탈락',
      versus: '대',
      share: '공유',
      sharePicks: '예측 공유',
      predictionLink: '예측 링크',
      bracketImage: '대진표 이미지',
      details: '상세',
      stepLabel: '단계',
      editingGroupLabel: '편집 중인 조',
      pathCanvas: {
        groupsTitle: '조별 순위 카드',
        groupsBody: '먼저 순위만 조정할 수 있습니다. 상세에서 스코어를 입력한 조만 카드에 경기 스코어가 표시됩니다.',
        rankOnly: '먼저 조 순위를 정하고, 필요할 때만 상세에서 스코어를 입력하세요.',
        rankMode: '순위',
        scoreMode: '스코어',
      },
      matchesLabel: '경기',
      groupTabsLabel: '편집할 조 선택',
      groupStage: { cutoffFallback: '8위 라인', cutoffLabel: '컷오프' },
      stages: ['조별리그', '3위', '32강', '16강', '8강', '결승'],
    }),
    zh: makeDerivedUi(ui.en, {
      liveIntentLabel: '当前意图',
      breadcrumbHome: '首页',
      searchIntentEyebrow: '搜索意图',
      relatedToolLabel: '相关工具',
      groupLabel: '小组',
      scoreLabel: '比分',
      pointsGoalDiff: '积分 / 净胜球',
      pointsShort: '分',
      winnerShort: '胜',
      moveUp: '上移',
      moveDown: '下移',
      moreMatches: '场',
      qualified: '晋级',
      out: '出局',
      versus: '对',
      share: '分享',
      sharePicks: '分享预测',
      predictionLink: '预测链接',
      bracketImage: '对阵图',
      details: '详情',
      stepLabel: '步骤',
      editingGroupLabel: '正在编辑小组',
      visibleGroupHelp: '先改当前小组 6 场比分，下方积分榜和最佳第三名会同步变化。',
      matchesLabel: '场比赛',
      groupTabsLabel: '选择要编辑的小组',
      stages: ['小组赛', '最佳第三名', '32强', '16强', '8强', '决赛'],
      pathCanvas: {
        groupsTitle: '小组排名卡片',
        groupsBody: '可以先只调整每个小组的排名。只有进入详情维护过比分后，卡片才显示具体比分。',
        rankOnly: '先排小组名次；需要精细预测时再进详情填比分。',
        rankMode: '排名模式',
        scoreMode: '比分模式',
        round32Body: '由小组前二和最佳第三名自动生成。',
        round16Body: '把 32 强预测结果继续推进到下一列。',
        quarterBody: '只保留更强的晋级路径。',
        semiBody: '决赛前只剩 4 支球队。',
        finalBody: '先确定决赛双方，再进入单场详情预测。',
        championTitle: '冠军',
        championBody: '完整路径推演后的最终结果。',
      },
      rounds: {
        round32: '32 强',
        round16: '16 强',
        quarterFinals: '四分之一决赛',
        semiFinals: '半决赛',
        final: '决赛',
      },
      bracket: {
        eyebrow: '淘汰赛路径生成器',
        title: '逐轮生成对阵路径',
        body: '从小组出线队开始，逐轮推进到冠军，而不是只停留在小组表。',
        modeLabel: '对阵模式',
        modeValue: '淘汰赛优先',
        pathLabel: '冠军路径',
        exportLabel: '导出',
        exportValue: '可分享对阵表',
      },
      groupStage: {
        eyebrow: '小组赛工作区',
        title: '先看 12 个小组和积分榜',
        body: '小组赛页面优先展示比分、积分榜、出线状态和影响对阵的规则。',
        tablesLabel: '积分榜',
        tablesValue: '12 个小组',
        autoLabel: '直接晋级',
        autoValue: '24 支前二球队',
        bubbleLabel: '边缘线',
        cutoffFallback: '第 8 名',
        cutoffLabel: '晋级线',
      },
      thirdPlace: {
        ruleTitle: '晋级线怎么算',
        ruleBody: '每个小组前两名先直接晋级，然后 12 个小组第三放在一起比较：先看积分，再看净胜球，再看进球数，前 8 个进入 32 强。',
        cutLine: '晋级线：这条线以上暂时晋级，线以下暂时出局。',
      },
      monteCarlo: {
        championOdds: '冠军',
        finalOdds: '决赛',
      },
      predictor: {
        manualTitle: '手动预测面板',
        manualBody: '逐组选择胜者，锁定冠军，并分享你的完整预测。',
        boardHint: '如果你只想快速选每组第一，用这个面板就够了；如果想按每场比分推演，请用模拟器或小组赛计算器页面。',
      },
      workflow: {
        home: [
          { title: '填写比分', body: '先选一个小组，只改这组 6 场比赛，页面会自动重算积分。' },
          { title: '看谁出线', body: '每组前二直接晋级，最佳第三名表决定剩下 8 个名额。' },
          { title: '生成路径', body: '出线名单会进入淘汰赛预览，形成冠军路线。' },
        ],
        predictor: [
          { title: '选择小组第一', body: '不用填每场比分，直接为每个小组选一个最可能的头名。' },
          { title: '查看预测结果', body: '页面会把选择汇总成冠军和决赛对阵预览。' },
          { title: '用于分享', body: '这个页面更适合承接预测、竞猜、快速 picks 相关搜索。' },
        ],
        bracket: [
          { title: '从出线队开始', body: '对阵图页面默认接收小组赛计算后的晋级球队。' },
          { title: '逐轮查看', body: '32 强、16 强、8 强、半决赛和决赛会按轮次展示。' },
          { title: '追踪冠军', body: '高亮路径帮助用户理解谁进决赛、谁最终夺冠。' },
        ],
        groupStage: [
          { title: '选择小组', body: '用 A-L 标签切换，每次只处理一个小组的 6 场比赛。' },
          { title: '修改比分', body: '比分会影响积分、净胜球、进球数和小组排名。' },
          { title: '观察边缘线', body: '第 8 个最佳第三名就是 2026 赛制最关键的晋级线。' },
        ],
        thirdPlace: [
          { title: '只看小组第三', body: '这个表只收集 12 个小组排名第三的球队。' },
          { title: '套用规则', body: '排序逻辑是积分优先，其次净胜球，再其次进球数。' },
          { title: '找到晋级线', body: '前 8 名进入 32 强，后 4 名出局。' },
        ],
        monteCarlo: [
          { title: '读取当前出线队', body: '概率预览基于当前小组赛计算出来的晋级名单。' },
          { title: '区分两个概率', body: '每行分别展示夺冠概率和进入决赛概率。' },
          { title: '比较热门队', body: '路径更强的球队会在重复模拟后排到前面。' },
        ],
      },
    }),
  } as const;

  return ({ ...fallback, ...(ui[group as keyof typeof ui] ?? extra[group as keyof typeof extra] ?? {}) });
}

function makeDerivedUi(base: Record<string, any>, patch: Record<string, any>) {
  return {
    ...base,
    ...patch,
    rounds: { ...base.rounds, ...patch.rounds },
    bracket: { ...base.bracket, ...patch.bracket },
    groupStage: { ...base.groupStage, ...patch.groupStage },
    thirdPlace: { ...base.thirdPlace, ...patch.thirdPlace },
    monteCarlo: { ...base.monteCarlo, ...patch.monteCarlo },
    predictor: { ...base.predictor, ...patch.predictor },
    pathCanvas: { ...base.pathCanvas, ...patch.pathCanvas },
    homeFocus: { ...base.homeFocus, ...patch.homeFocus },
    workflow: {
      ...base.workflow,
      ...patch.workflow,
    },
    focus: {
      ...base.focus,
      ...patch.focus,
    },
  };
}

function FieldTexture() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_12%,rgba(199,255,87,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:auto,42px_42px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7ff57]/60 to-transparent" />
      <div className="absolute right-[-12rem] top-16 size-[34rem] rounded-full border border-[#c7ff57]/20" />
      <div className="absolute right-[-4rem] top-44 size-[18rem] rounded-full border border-white/10" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase text-white/42">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ResultTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase text-white/40">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function buildKnockoutRounds(
  qualifiedTeams: StandingRow[],
  champion: string,
  finalist: string,
  ui: ToolUiCopy
) {
  const seeds = qualifiedTeams.map((row) => row.team);
  const round32 = padTeams(seeds, 32, ui.groupStage.cutoffFallback);
  const round16 = selectRoundTeams(round32, 16, [champion, finalist]);
  const quarterFinals = selectRoundTeams(round16, 8, [champion, finalist]);
  const semiFinals = selectRoundTeams(quarterFinals, 4, [champion, finalist]);
  const final = uniqueTeams([champion, finalist]).slice(0, 2);
  return [
    { round: ui.rounds.round32, teams: round32 },
    { round: ui.rounds.round16, teams: round16 },
    { round: ui.rounds.quarterFinals, teams: quarterFinals },
    { round: ui.rounds.semiFinals, teams: semiFinals },
    { round: ui.rounds.final, teams: final.length > 0 ? final : [champion] },
  ];
}

function createPathColumns(
  qualifiedTeams: StandingRow[],
  champion: string,
  finalist: string,
  ui: ToolUiCopy
) {
  const rounds = buildKnockoutRounds(qualifiedTeams, champion, finalist, ui);
  return [
    {
      title: ui.rounds.round32,
      subtitle: ui.pathCanvas.round32Body,
      items: rounds[0].teams.slice(0, 12),
    },
    {
      title: ui.rounds.round16,
      subtitle: ui.pathCanvas.round16Body,
      items: rounds[1].teams.slice(0, 8),
    },
    {
      title: ui.rounds.quarterFinals,
      subtitle: ui.pathCanvas.quarterBody,
      items: rounds[2].teams.slice(0, 6),
    },
    {
      title: ui.rounds.semiFinals,
      subtitle: ui.pathCanvas.semiBody,
      items: rounds[3].teams.slice(0, 4),
    },
    {
      title: ui.rounds.final,
      subtitle: ui.pathCanvas.finalBody,
      items: uniqueTeams([champion, finalist]).slice(0, 2),
      accent: true,
    },
    {
      title: ui.pathCanvas.championTitle,
      subtitle: ui.pathCanvas.championBody,
      items: [champion],
      accent: true,
    },
  ];
}

function scoreSeed(team: string, index: number) {
  if (!team || team.startsWith('TBD')) return '--';
  const strength = getTeamStrength(team);
  return `${Math.max(1, Math.round(strength / 12) - (index % 3))}`;
}

function selectRoundTeams(
  teams: string[],
  count: number,
  priorityTeams: string[]
) {
  return padTeams(uniqueTeams([...priorityTeams, ...teams]), count, 'TBD').slice(0, count);
}

function padTeams(teams: string[], count: number, fallback: string) {
  const unique = uniqueTeams(teams);
  while (unique.length < count) {
    unique.push(`${fallback} ${unique.length + 1}`);
  }
  return unique.slice(0, count);
}

function uniqueTeams(teams: string[]) {
  return teams.filter((team, index, source) => team && source.indexOf(team) === index);
}

function createProbabilityRows(
  qualifiedTeams: StandingRow[],
  champion: string,
  finalist: string
) {
  const contenders = uniqueTeams([
    champion,
    finalist,
    ...qualifiedTeams.slice(0, 10).map((row) => row.team),
  ]).slice(0, 10);
  return contenders.map((team, index) => {
    const seedBoost =
      qualifiedTeams.find((row) => row.team === team)?.points ?? Math.max(8 - index, 1);
    const strengthBoost = Math.round((getTeamStrength(team) - 50) / 8);
    const value = Math.max(4, Math.min(32, 18 - index * 2 + seedBoost + strengthBoost));
    return {
      team,
      value,
      reachFinal: Math.max(value + 9, 12),
    };
  });
}

function createInitialGroupScores(): MatchScore[] {
  return worldCupGroupStageMatches.map((match) => {
    const homeStrength = getTeamStrength(match.home);
    const awayStrength = getTeamStrength(match.away);
    const diff = homeStrength - awayStrength;
    const homeScore = diff > 12 ? 2 : diff < -12 ? 0 : 1;
    const awayScore = diff < -12 ? 2 : diff > 12 ? 0 : 1;
    return {
      ...match,
      homeScore,
      awayScore,
    };
  });
}

function createInitialGroupRankings(): GroupRankings {
  return Object.fromEntries(
    sampleGroups.map((group) => [group.group, [...group.teams]])
  ) as GroupRankings;
}

function updateScore(
  setScores: Dispatch<SetStateAction<MatchScore[]>>,
  setDetailedGroups: Dispatch<SetStateAction<DetailedGroups>>,
  id: string,
  group: string,
  key: 'homeScore' | 'awayScore',
  value: number
) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(12, value)) : 0;
  setDetailedGroups((current) => ({ ...current, [group]: true }));
  setScores((current) => {
    const next = current.map((match) =>
      match.id === id ? { ...match, [key]: safeValue } : match
    );
    saveGroupScores(group, next.filter((match) => match.group === group));
    return next;
  });
}

function moveGroupTeam(
  setGroupRankings: Dispatch<SetStateAction<GroupRankings>>,
  group: string,
  team: string,
  direction: -1 | 1
) {
  setGroupRankings((current) => {
    const currentRanking =
      current[group] ??
      sampleGroups.find((item) => item.group === group)?.teams ??
      [];
    const ranking = [...currentRanking];
    const index = ranking.indexOf(team);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ranking.length) {
      return current;
    }
    [ranking[index], ranking[nextIndex]] = [ranking[nextIndex], ranking[index]];
    return { ...current, [group]: ranking };
  });
}

function calculateStandings(
  scores: MatchScore[],
  rankings: GroupRankings,
  detailedGroups: DetailedGroups
): StandingRow[] {
  return sampleGroups.flatMap((group) => {
    if (!detailedGroups[group.group]) {
      return createRankingStandings(group.group, rankings[group.group] ?? group.teams);
    }
    return calculateScoreStandings(
      scores.filter((match) => match.group === group.group)
    );
  });
}

function calculateScoreStandings(scores: MatchScore[]): StandingRow[] {
  const tables = new Map<string, Map<string, Omit<StandingRow, 'rank'>>>();
  for (const match of scores) {
    if (!tables.has(match.group)) {
      tables.set(match.group, new Map());
    }
    const table = tables.get(match.group);
    if (!table) continue;
    ensureTeam(table, match.group, match.home);
    ensureTeam(table, match.group, match.away);

    const home = table.get(match.home);
    const away = table.get(match.away);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    away.goalsFor += match.awayScore;
    home.goalDifference += match.homeScore - match.awayScore;
    away.goalDifference += match.awayScore - match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.points += 3;
    } else if (match.homeScore < match.awayScore) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  }

  return Array.from(tables.values()).flatMap((table) =>
    Array.from(table.values())
      .sort(compareStandingRows)
      .map((row, index) => ({ ...row, rank: index + 1, source: 'scores' as const }))
  );
}

function createRankingStandings(group: string, ranking: readonly string[]): StandingRow[] {
  return ranking.map((team, index) => ({
    team,
    group,
    played: 0,
    points: index === 0 ? 9 : index === 1 ? 6 : index === 2 ? 4 : 1,
    goalDifference: 0,
    goalsFor: 0,
    rank: index + 1,
    source: 'ranking',
  }));
}

function getGroupScoreStorageKey(group: string) {
  return `wct:group-scores:${group}`;
}

function saveGroupScores(group: string, groupScores: MatchScore[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getGroupScoreStorageKey(group),
      JSON.stringify(
        groupScores.map((match) => ({
          awayScore: match.awayScore,
          homeScore: match.homeScore,
          id: match.id,
        }))
      )
    );
  } catch {
    // Local storage is optional; the simulator still works without persistence.
  }
}

function loadStoredTournamentScores(initialScores: MatchScore[]) {
  if (typeof window === 'undefined') {
    return { scores: initialScores, detailedGroups: {} as DetailedGroups };
  }

  const detailedGroups: DetailedGroups = {};
  const scoreById = new Map(
    initialScores.map((match) => [match.id, { ...match }])
  );

  for (const group of sampleGroups) {
    try {
      const raw = window.localStorage.getItem(getGroupScoreStorageKey(group.group));
      if (!raw) continue;
      const stored = JSON.parse(raw) as Array<{
        awayScore?: number;
        homeScore?: number;
        id?: string;
      }>;
      if (!Array.isArray(stored)) continue;

      let applied = false;
      for (const item of stored) {
        if (!item.id || !scoreById.has(item.id)) continue;
        const match = scoreById.get(item.id);
        if (!match) continue;
        match.homeScore = sanitizeScoreValue(item.homeScore);
        match.awayScore = sanitizeScoreValue(item.awayScore);
        scoreById.set(item.id, match);
        applied = true;
      }
      if (applied) detailedGroups[group.group] = true;
    } catch {
      continue;
    }
  }

  return {
    scores: Array.from(scoreById.values()),
    detailedGroups,
  };
}

function sanitizeScoreValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(12, value))
    : 0;
}

function ensureTeam(
  table: Map<string, Omit<StandingRow, 'rank'>>,
  group: string,
  team: string
) {
  if (!table.has(team)) {
    table.set(team, {
      team,
      group,
      played: 0,
      points: 0,
      goalDifference: 0,
      goalsFor: 0,
      source: 'scores',
    });
  }
}

function compareStandingRows(
  a: Omit<StandingRow, 'rank'>,
  b: Omit<StandingRow, 'rank'>
) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.team.localeCompare(b.team)
  );
}

function getThirdPlaceRankings(standings: StandingRow[]) {
  return standings
    .filter((row) => row.rank === 3)
    .sort(compareStandingRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function getQualifiedTeams(
  standings: StandingRow[],
  thirdRankings: StandingRow[]
) {
  const automatic = standings
    .filter((row) => row.rank <= 2)
    .sort((a, b) => a.group.localeCompare(b.group) || a.rank - b.rank);
  return [...automatic, ...thirdRankings.slice(0, 8)];
}

function formatMatchDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  });
}
