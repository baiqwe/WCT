import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import {
  defaultLocale,
  getGroupPredictionPath,
  getLocaleConfig,
  getPagePath,
  getTeamBySlug,
  getTeamPath,
  getWorldCupContent,
  normalizeLocale,
  publicLocales,
  sampleGroups,
  teamPages,
} from '@/lib/world-cup-content';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { getTeamMatches, getTeamProfile } from '@/lib/world-cup-data';
import { IconArrowRight, IconChartBar, IconRouteSquare, IconTrophy } from '@tabler/icons-react';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const Route = createFileRoute('/$locale/teams/$team')({
  beforeLoad: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const team = getTeamBySlug(params.team);
    if (!team) throw notFound();

    const canonicalPath = getTeamPath(locale, team.slug);
    if (`/${params.locale}/teams/${params.team}` !== canonicalPath) {
      throw redirect({ to: canonicalPath });
    }
  },
  head: ({ params }) => {
    const locale = normalizeLocale(params.locale);
    const team = getTeamBySlug(params.team);
    if (!team) return {};

    const path = getTeamPath(locale, team.slug);
    const copy = getTeamPageCopy(locale, team.name, team.group, team.seed);
    const metadata = seo(path, {
      title: copy.title,
      description: copy.description,
      keywords: copy.keywords,
    });

    const teamJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsTeam',
      name: team.name,
      sport: 'Soccer',
      description: copy.description,
    };
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
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
          name: team.name,
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
          href: getCanonicalUrl(getTeamPath(candidate, team.slug)),
        })),
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: getCanonicalUrl(getTeamPath(defaultLocale, team.slug)),
        },
      ],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(teamJsonLd) },
        { type: 'application/ld+json', children: JSON.stringify(breadcrumbJsonLd) },
        { type: 'application/ld+json', children: JSON.stringify(faqJsonLd) },
      ],
    };
  },
  component: TeamPage,
});

function TeamPage() {
  const { locale, team: teamSlug } = Route.useParams();
  const normalizedLocale = normalizeLocale(locale);
  const team = getTeamBySlug(teamSlug);
  if (!team) throw notFound();

  const t = getWorldCupContent(normalizedLocale, 'home');
  const copy = getTeamPageCopy(normalizedLocale, team.name, team.group, team.seed);
  const group = sampleGroups.find((item) => item.group === team.group);
  const profile = getTeamProfile(team.name);
  const groupOpponents = group?.teams.filter((name) => name !== team.name) ?? [];
  const groupPredictionPath = getGroupPredictionPath(
    normalizedLocale,
    `group-${team.group.toLowerCase()}-goal-prediction`
  );
  const relatedTeams =
    group?.teams
      .filter((name) => name !== team.name)
      .map((name) => teamPages.find((candidate) => candidate.name === name))
      .filter(Boolean) ?? [];
  const groupMatches = createTeamMatchCards(team.name, copy);
  const bracketRoute = [
    { round: copy.rounds.groupStage, value: copy.routeValues.groupStage },
    { round: copy.rounds.round32, value: copy.routeValues.round32 },
    { round: copy.rounds.round16, value: copy.routeValues.round16 },
    { round: copy.rounds.quarterFinals, value: copy.routeValues.quarterFinals },
    { round: copy.rounds.final, value: copy.routeValues.final },
  ];

  return (
    <main className="min-h-screen bg-[#050907] text-[#f3f8ee]">
      <section className="border-b border-white/10 px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
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
                href={getPagePath(normalizedLocale, 'groupStage')}
                className={buttonVariants({
                  className:
                    'h-11 rounded-md bg-[#c7ff57] px-5 text-sm font-semibold text-[#071007] hover:bg-[#d8ff80]',
                })}
              >
                {copy.openGroup}
                <IconArrowRight className="size-4" />
              </a>
              <a
                href={getPagePath(normalizedLocale, 'bracket')}
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-md border-white/12 bg-white/[0.03] px-5 text-white hover:bg-white/10',
                })}
              >
                {copy.viewBracket}
              </a>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
                {copy.relatedLinks}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={groupPredictionPath}
                  className="rounded-md border border-[#c7ff57]/25 bg-[#c7ff57]/10 px-3 py-2 text-xs font-semibold text-[#e7ffad] transition hover:border-[#c7ff57]/50"
                >
                  {copy.groupDetail}
                </a>
                {relatedTeams.map((relatedTeam) => (
                  <a
                    key={relatedTeam!.slug}
                    href={getTeamPath(normalizedLocale, relatedTeam!.slug)}
                    className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/58 transition hover:border-white/25 hover:text-white"
                  >
                    {relatedTeam!.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0c120e]/90 p-4 shadow-2xl shadow-black/40">
            <div className="grid gap-3 md:grid-cols-3">
              <TeamStat icon={<IconTrophy className="size-5" />} label={copy.statGroup} value={team.group} />
              <TeamStat icon={<IconRouteSquare className="size-5" />} label={copy.statSeed} value={`#${team.seed}`} />
              <TeamStat icon={<IconChartBar className="size-5" />} label={copy.statRank} value={profile ? `#${profile.fifaRank}` : copy.scenario} />
            </div>
            <div className="mt-5 rounded-lg border border-white/8 bg-black/25 p-4">
              <p className="font-mono text-xs uppercase text-[#c7ff57]/75">
                {copy.opponents}
              </p>
              <div className="mt-3 grid gap-2">
                {groupOpponents.map((opponent, index) => (
                  <div
                    key={opponent}
                    className="grid grid-cols-[28px_1fr_48px_48px] items-center rounded-md border border-white/8 bg-white/[0.025] px-3 py-2 text-sm"
                  >
                    <span className="font-mono text-xs text-white/40">{index + 1}</span>
                    <span className="font-medium text-white">{opponent}</span>
                    <span className="text-white/55">0</span>
                    <span className="text-white/55">0</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <MiniFact label={copy.confederation} value={profile?.confederation ?? 'TBD'} />
              <MiniFact label={copy.bestFinish} value={profile?.bestFinish ?? 'TBD'} />
              <MiniFact label={copy.strength} value={profile ? `${profile.strength}/100` : 'TBD'} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
              {copy.sectionEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {copy.sectionTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/62">
              {copy.sectionBody}
            </p>
          </div>
          <div className="grid gap-3">
            {bracketRoute.map((item, index) => (
              <div
                key={item.round}
                className={cn(
                  'grid gap-2 rounded-lg border p-4 md:grid-cols-[150px_1fr]',
                  index === 0
                    ? 'border-[#c7ff57]/40 bg-[#c7ff57]/10'
                    : 'border-white/10 bg-white/[0.025]'
                )}
              >
                <span className="font-mono text-xs uppercase text-[#c7ff57]/75">
                  {item.round}
                </span>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#07100b] px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
              {copy.matchesEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {copy.matchesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/62">
              {copy.matchesBody}
            </p>
          </div>
          <div className="grid gap-3">
            {groupMatches.map((match) => (
              <article
                key={`${match.matchday}-${match.home}-${match.away}`}
                className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 md:grid-cols-[120px_1fr_90px]"
              >
                <p className="font-mono text-xs uppercase text-[#c7ff57]/72">
                  {match.matchday}
                </p>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {match.home} {copy.versus} {match.away}
                  </h3>
                  <p className="mt-1 text-sm text-white/52">{match.note}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-center font-mono text-xs text-white/48">
                  {match.date}
                </span>
                <p className="md:col-start-2 md:col-span-2 font-mono text-[11px] uppercase text-white/35">
                  {match.venue}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050907] px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-2xl">
            <p className="font-mono text-xs uppercase text-[#c7ff57]/70">
              {copy.scenariosEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {copy.scenariosTitle}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {copy.scenarios.map((scenario, index) => (
              <article
                key={scenario.title}
                className={cn(
                  'rounded-lg border p-5',
                  index === 0
                    ? 'border-[#c7ff57]/35 bg-[#c7ff57]/10'
                    : 'border-white/10 bg-white/[0.025]'
                )}
              >
                <p className="font-mono text-xs uppercase text-[#c7ff57]/72">
                  {scenario.label}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {scenario.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  {scenario.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#e9f5df] px-4 py-14 text-[#071007] md:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <a href={getPagePath(normalizedLocale, 'home')} className="rounded-lg border border-[#071007]/10 bg-white/55 p-5">
            <p className="font-mono text-xs uppercase text-[#24512e]/70">{t.nav.home}</p>
            <p className="mt-3 text-lg font-semibold">{copy.fullPath}</p>
          </a>
          <a href={getPagePath(normalizedLocale, 'thirdPlace')} className="rounded-lg border border-[#071007]/10 bg-white/55 p-5">
            <p className="font-mono text-xs uppercase text-[#24512e]/70">{t.nav.thirdPlace}</p>
            <p className="mt-3 text-lg font-semibold">{copy.thirdCutoff}</p>
          </a>
          <a href={getPagePath(normalizedLocale, 'monteCarlo')} className="rounded-lg border border-[#071007]/10 bg-white/55 p-5">
            <p className="font-mono text-xs uppercase text-[#24512e]/70">{t.nav.monteCarlo}</p>
            <p className="mt-3 text-lg font-semibold">{copy.probabilityView}</p>
          </a>
        </div>
      </section>

      <section className="bg-[#050907] px-4 py-16 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-3">
            {copy.faq.map((item) => (
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
    </main>
  );
}

function TeamStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between text-[#c7ff57]">
        <span className="font-mono text-xs uppercase text-white/42">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.025] p-3">
      <p className="font-mono text-[11px] uppercase text-white/38">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function getTeamPageCopy(
  locale: string,
  teamName: string,
  group: string,
  seed: number
) {
  const languageGroup = getLocaleConfig(locale).languageGroup;
  const base = {
    title: `${teamName} World Cup 2026 Path - Group, Bracket & Prediction`,
    description: `Explore ${teamName}'s World Cup 2026 path: group outlook, score simulator, best third-place scenarios, Round of 32 route, and champion prediction.`,
    keywords: `${teamName} world cup 2026, ${teamName} world cup path, ${teamName} bracket predictor, ${teamName} group stage`,
    h1: `${teamName} World Cup 2026 Path`,
    badge: 'Team path simulator',
    lead: `Build a prediction path for ${teamName}: group matches, standings, best third-place scenarios, Round of 32 route, and knockout picks.`,
    openGroup: 'Open group simulator',
    viewBracket: 'View bracket',
    statGroup: 'Group',
    statSeed: 'Seed',
    statPath: 'Path type',
    statRank: 'FIFA rank',
    scenario: 'Scenario',
    confederation: 'Confederation',
    bestFinish: 'Best finish',
    strength: 'Strength',
    opponents: 'Group opponents',
    relatedLinks: 'Related team paths',
    groupDetail: `Group ${group} goal prediction`,
    sectionEyebrow: 'Team route guide',
    sectionTitle: `${teamName} route to the final`,
    sectionBody: `This team page answers who ${teamName} plays, how the group table can change, and what bracket lane opens if they finish first, second, or third.`,
    fullPath: 'Full tournament path',
    thirdCutoff: 'Best third-place cutoff',
    probabilityView: 'Probability view',
    matchesEyebrow: 'Group matches',
    matchesTitle: `${teamName} group-stage schedule`,
    matchesBody: `${teamName} plays three group matches. Enter scorelines in the simulator, then watch the table and third-place cutoff update before building the knockout path.`,
    scenariosEyebrow: 'Qualification scenarios',
    scenariosTitle: `${teamName} qualification routes`,
    versus: 'vs',
    scoreSeed: '0-0',
    matchday: 'Matchday',
    scenarios: [
      {
        label: '1st',
        title: 'Win the group',
        body: `${teamName} enters the Round of 32 as a group winner and gets the strongest bracket lane control.`,
      },
      {
        label: '2nd',
        title: 'Finish runner-up',
        body: `${teamName} still advances automatically, but the Round of 32 opponent changes immediately.`,
      },
      {
        label: '3rd',
        title: 'Chase the best third-place line',
        body: `${teamName} must compare points, goal difference, and goals scored against every other third-place team.`,
      },
    ],
    faq: [
      {
        q: `Who is in ${teamName}'s World Cup 2026 group?`,
        a: `${teamName} is in Group ${group}. This page lists the opponents and links into the group-stage simulator.`,
      },
      {
        q: `Can ${teamName} qualify in third place?`,
        a: `Yes, if ${teamName} finishes third and ranks among the eight best third-place teams across all groups.`,
      },
      {
        q: `How do I predict ${teamName}'s knockout path?`,
        a: `Start with group scores, check whether ${teamName} finishes first, second, or third, then send the result into the bracket predictor.`,
      },
    ],
    rounds: {
      groupStage: 'Group stage',
      round32: 'Round of 32',
      round16: 'Round of 16',
      quarterFinals: 'Quarter-finals',
      final: 'Final',
    },
    routeValues: {
      groupStage: `Group ${group}, seed ${seed}`,
      round32: `${teamName} vs projected qualifier`,
      round16: 'Winner enters regional bracket lane',
      quarterFinals: 'Projected top-eight checkpoint',
      final: 'Champion path scenario',
    },
  };
  const localized: Record<
    string,
    Partial<typeof base> & {
      routeValues?: Partial<typeof base.routeValues>;
      rounds?: Partial<typeof base.rounds>;
    }
  > = {
    es: {
      title: `${teamName} Mundial 2026 - Grupo, Bracket y Prediccion`,
      description: `Explora el camino de ${teamName} en el Mundial 2026: grupo, simulador de marcadores, mejores terceros, ronda de 32 y prediccion.`,
      keywords: `${teamName} mundial 2026, camino ${teamName} mundial, predictor ${teamName}, grupo ${teamName}`,
      h1: `${teamName} Mundial 2026`,
      badge: 'Simulador por equipo',
      lead: `Construye el camino de ${teamName}: partidos de grupo, tabla, mejores terceros, ronda de 32 y picks de eliminatorias.`,
      openGroup: 'Abrir grupos',
      viewBracket: 'Ver bracket',
      statGroup: 'Grupo',
      statSeed: 'Cabeza',
      statPath: 'Tipo de ruta',
      statRank: 'Ranking FIFA',
      scenario: 'Escenario',
      confederation: 'Confederacion',
      bestFinish: 'Mejor resultado',
      strength: 'Fuerza',
      opponents: 'Rivales de grupo',
      relatedLinks: 'Rutas relacionadas',
      groupDetail: `Prediccion de goles del Grupo ${group}`,
      sectionEyebrow: 'Guia del equipo',
      sectionTitle: `Ruta de ${teamName} a la final`,
      sectionBody: `La pagina responde contra quien juega ${teamName}, como cambia la tabla y que camino se abre si queda primero, segundo o tercero.`,
      fullPath: 'Camino completo',
      thirdCutoff: 'Corte de mejores terceros',
      probabilityView: 'Vista de probabilidades',
      matchesEyebrow: 'Partidos de grupo',
      matchesTitle: `Calendario de grupo de ${teamName}`,
      matchesBody: `${teamName} juega tres partidos de grupo. Introduce marcadores, revisa la tabla y actualiza el corte de mejores terceros.`,
      scenariosEyebrow: 'Escenarios de clasificacion',
      scenariosTitle: `Rutas de clasificacion de ${teamName}`,
      versus: 'vs',
      scoreSeed: '0-0',
    },
    pt: {
      title: `${teamName} Copa do Mundo 2026 - Grupo, Chave e Previsao`,
      description: `Explore o caminho de ${teamName} na Copa do Mundo 2026: grupo, placares, melhores terceiros, ronda de 32 e previsao.`,
      keywords: `${teamName} copa do mundo 2026, caminho ${teamName}, previsao ${teamName}, grupo ${teamName}`,
      h1: `${teamName} Copa do Mundo 2026`,
      badge: 'Simulador por selecao',
      lead: `Monte o caminho de ${teamName}: jogos de grupo, tabela, melhores terceiros, ronda de 32 e palpites do mata-mata.`,
      openGroup: 'Abrir grupos',
      viewBracket: 'Ver chave',
      statGroup: 'Grupo',
      statSeed: 'Seed',
      statPath: 'Tipo de caminho',
      statRank: 'Ranking FIFA',
      scenario: 'Cenario',
      confederation: 'Confederacao',
      bestFinish: 'Melhor campanha',
      strength: 'Forca',
      opponents: 'Rivais do grupo',
      relatedLinks: 'Caminhos relacionados',
      groupDetail: `Previsao de gols do Grupo ${group}`,
      sectionEyebrow: 'Guia da selecao',
      sectionTitle: `Caminho de ${teamName} ate a final`,
      sectionBody: `A pagina mostra contra quem ${teamName} joga, como a tabela muda e qual chave abre se terminar em primeiro, segundo ou terceiro.`,
      fullPath: 'Caminho completo',
      thirdCutoff: 'Corte dos melhores terceiros',
      probabilityView: 'Probabilidades',
      matchesEyebrow: 'Jogos do grupo',
      matchesTitle: `Calendario de grupo de ${teamName}`,
      matchesBody: `${teamName} joga tres partidas de grupo. Digite placares, confira a tabela e atualize o corte dos melhores terceiros.`,
      scenariosEyebrow: 'Cenarios de classificacao',
      scenariosTitle: `Rotas de classificacao de ${teamName}`,
      versus: 'vs',
      scoreSeed: '0-0',
    },
    fr: {
      title: `${teamName} Coupe du Monde 2026 - Groupe, Tableau et Pronostic`,
      description: `Analysez le parcours de ${teamName}: groupe, scores, meilleurs troisiemes, ronde de 32 et pronostic.`,
      h1: `${teamName} Coupe du Monde 2026`,
      badge: 'Simulateur par equipe',
      lead: `Construisez le parcours de ${teamName}: matchs de groupe, classement, meilleurs troisiemes, ronde de 32 et tableau final.`,
      openGroup: 'Ouvrir les groupes',
      viewBracket: 'Voir le tableau',
      statGroup: 'Groupe',
      statSeed: 'Tete',
      statPath: 'Type de parcours',
      statRank: 'Classement FIFA',
      scenario: 'Scenario',
      opponents: 'Adversaires du groupe',
      sectionTitle: `Parcours de ${teamName} vers la finale`,
      matchesEyebrow: 'Matchs du groupe',
      matchesTitle: `Calendrier de groupe de ${teamName}`,
      scenariosEyebrow: 'Scenarios de qualification',
      scenariosTitle: `Routes de qualification de ${teamName}`,
    },
    de: {
      title: `${teamName} WM 2026 Weg - Gruppe, Turnierbaum und Prognose`,
      description: `Pruefe den WM-2026-Weg von ${teamName}: Gruppe, Ergebnisse, beste Dritte, Runde der 32 und Prognose.`,
      h1: `${teamName} WM 2026 Weg`,
      badge: 'Team-Simulator',
      openGroup: 'Gruppen offnen',
      viewBracket: 'Turnierbaum ansehen',
      statGroup: 'Gruppe',
      statSeed: 'Setzung',
      statPath: 'Wegtyp',
      statRank: 'FIFA-Rang',
      opponents: 'Gruppengegner',
      sectionTitle: `${teamName} Weg ins Finale`,
      matchesEyebrow: 'Gruppenspiele',
      matchesTitle: `${teamName} Gruppenspielplan`,
      scenariosEyebrow: 'Qualifikationsszenarien',
      scenariosTitle: `${teamName} Qualifikationswege`,
    },
    it: {
      title: `${teamName} Mondiali 2026 - Girone, Tabellone e Pronostico`,
      description: `Esplora il percorso di ${teamName}: girone, risultati, migliori terze, 32 squadre e pronostico.`,
      h1: `${teamName} Mondiali 2026`,
      badge: 'Simulatore squadra',
      openGroup: 'Apri gironi',
      viewBracket: 'Vedi tabellone',
      statGroup: 'Girone',
      statSeed: 'Seed',
      statRank: 'Ranking FIFA',
      opponents: 'Avversarie del girone',
      sectionTitle: `Percorso di ${teamName} verso la finale`,
      matchesEyebrow: 'Partite del girone',
      matchesTitle: `Calendario del girone di ${teamName}`,
      scenariosEyebrow: 'Scenari di qualificazione',
      scenariosTitle: `Percorsi di qualificazione di ${teamName}`,
    },
    nl: {
      title: `${teamName} WK 2026 Route - Groep, Schema en Voorspelling`,
      description: `Bekijk de WK-route van ${teamName}: groep, uitslagen, beste derden, ronde van 32 en voorspelling.`,
      h1: `${teamName} WK 2026 Route`,
      badge: 'Teamsimulator',
      openGroup: 'Groepen openen',
      viewBracket: 'Schema bekijken',
      statGroup: 'Groep',
      statSeed: 'Seed',
      statRank: 'FIFA-rang',
      opponents: 'Groepstegenstanders',
      sectionTitle: `${teamName} route naar de finale`,
      matchesEyebrow: 'Groepswedstrijden',
      matchesTitle: `${teamName} groepsschema`,
      scenariosEyebrow: 'Kwalificatiescenario’s',
      scenariosTitle: `${teamName} kwalificatieroutes`,
    },
    ja: {
      title: `${teamName} ワールドカップ2026 - グループとトーナメント予想`,
      description: `${teamName} のワールドカップ2026の道のり、グループ、スコア、3位通過、32強ルートを確認できます。`,
      h1: `${teamName} ワールドカップ2026`,
      badge: 'チーム別シミュレーター',
      lead: `${teamName} のグループ戦、順位、3位通過、32強以降のルートを組み立てます。`,
      openGroup: 'グループを見る',
      viewBracket: 'トーナメント表',
      statGroup: 'グループ',
      statSeed: 'シード',
      statPath: 'ルート',
      statRank: 'FIFA順位',
      scenario: 'シナリオ',
      confederation: '連盟',
      bestFinish: '最高成績',
      strength: '強さ',
      opponents: '同組の相手',
      relatedLinks: '関連チーム',
      groupDetail: `グループ${group} 得点予想`,
      sectionTitle: `${teamName} の決勝までの道`,
      fullPath: '大会全体のルート',
      thirdCutoff: '3位通過ライン',
      probabilityView: '確率表示',
      matchesEyebrow: 'グループ戦',
      matchesTitle: `${teamName} のグループ日程`,
      matchesBody: `${teamName} の3試合のスコアを入力し、順位と3位通過ラインを確認できます。`,
      scenariosEyebrow: '通過シナリオ',
      scenariosTitle: `${teamName} の通過ルート`,
      versus: '対',
      scoreSeed: '0-0',
    },
    ko: {
      title: `${teamName} 월드컵 2026 - 조별리그와 대진 예측`,
      description: `${teamName}의 월드컵 2026 경로, 조별리그, 스코어, 3위 진출, 32강 루트를 확인하세요.`,
      h1: `${teamName} 월드컵 2026`,
      badge: '팀별 시뮬레이터',
      lead: `${teamName}의 조별 경기, 순위, 3위 진출 가능성, 32강 이후 경로를 구성합니다.`,
      openGroup: '조별리그 열기',
      viewBracket: '대진표 보기',
      statGroup: '조',
      statSeed: '시드',
      statPath: '경로',
      statRank: 'FIFA 랭킹',
      scenario: '시나리오',
      confederation: '연맹',
      bestFinish: '최고 성적',
      strength: '전력',
      opponents: '조별 상대',
      relatedLinks: '관련 팀 경로',
      groupDetail: `${group}조 득점 예측`,
      sectionTitle: `${teamName} 결승까지의 경로`,
      fullPath: '전체 대회 경로',
      thirdCutoff: '3위 진출선',
      probabilityView: '확률 보기',
      matchesEyebrow: '조별 경기',
      matchesTitle: `${teamName} 조별리그 일정`,
      matchesBody: `${teamName}의 세 경기 스코어를 입력하고 순위와 3위 진출선을 확인하세요.`,
      scenariosEyebrow: '진출 시나리오',
      scenariosTitle: `${teamName} 진출 경로`,
      versus: '대',
      scoreSeed: '0-0',
    },
    zh: {
      title: `${teamName} 世界杯 2026 路径 - 小组、对阵和预测`,
      description: `查看 ${teamName} 在 2026 世界杯的小组形势、比分模拟、最佳第三名、32 强路径和冠军预测。`,
      keywords: `${teamName} 世界杯 2026, ${teamName} 世界杯路径, ${teamName} 世界杯预测, ${teamName} 小组赛`,
      h1: `${teamName} 世界杯 2026 路径`,
      badge: '球队路径模拟器',
      lead: `为 ${teamName} 编排完整路径：小组赛比分、积分榜、最佳第三名、32 强路线和淘汰赛预测。`,
      openGroup: '打开小组赛模拟器',
      viewBracket: '查看对阵表',
      statGroup: '小组',
      statSeed: '种子',
      statPath: '路径类型',
      statRank: 'FIFA 排名',
      scenario: '情景',
      confederation: '所属洲',
      bestFinish: '历史最佳',
      strength: '实力评分',
      opponents: '同组对手',
      relatedLinks: '相关球队路径',
      groupDetail: `${group} 组进球预测`,
      sectionEyebrow: '球队路径指南',
      sectionTitle: `${teamName} 通往决赛的路径`,
      sectionBody: `这个球队页回答 ${teamName} 会踢谁、小组积分如何变化，以及第一、第二或第三名出线时会进入哪条淘汰赛路线。`,
      fullPath: '完整赛事路径',
      thirdCutoff: '最佳第三名晋级线',
      probabilityView: '概率视图',
      matchesEyebrow: '小组赛赛程',
      matchesTitle: `${teamName} 小组赛路径`,
      matchesBody: `${teamName} 有三场小组赛。输入比分后，可以查看积分榜、最佳第三名晋级线和后续淘汰赛路径。`,
      scenariosEyebrow: '出线情景',
      scenariosTitle: `${teamName} 的三种出线路径`,
      versus: '对',
      scoreSeed: '0-0',
      matchday: '比赛日',
      scenarios: [
        {
          label: '第一名',
          title: '小组第一出线',
          body: `${teamName} 以小组第一进入 32 强，对淘汰赛路径拥有最大主动权。`,
        },
        {
          label: '第二名',
          title: '小组第二出线',
          body: `${teamName} 仍然直接晋级，但 32 强对手和后续路径会立即变化。`,
        },
        {
          label: '第三名',
          title: '争夺最佳第三名',
          body: `${teamName} 需要和所有小组第三比较积分、净胜球和进球数。`,
        },
      ],
      faq: [
        {
          q: `${teamName} 在 2026 世界杯哪个小组？`,
          a: `${teamName} 位于 ${group} 组，本页面列出同组对手并链接到小组赛模拟器。`,
        },
        {
          q: `${teamName} 能以第三名出线吗？`,
          a: `可以，如果 ${teamName} 获得小组第三，并在所有第三名球队中排进前八。`,
        },
        {
          q: `如何预测 ${teamName} 的淘汰赛路径？`,
          a: `先输入小组比分，确认 ${teamName} 是第一、第二还是第三名出线，再进入对阵预测器。`,
        },
      ],
      rounds: {
        groupStage: '小组赛',
        round32: '32 强',
        round16: '16 强',
        quarterFinals: '四分之一决赛',
        final: '决赛',
      },
      routeValues: {
        groupStage: `${group} 组，第 ${seed} 档`,
        round32: `${teamName} 对阵预测晋级队`,
        round16: '胜者进入对应淘汰赛分区',
        quarterFinals: '预计八强节点',
        final: '冠军路径情景',
      },
    },
  } as const;
  return {
    ...base,
    ...(localized[languageGroup as keyof typeof localized] ?? {}),
    rounds: {
      ...base.rounds,
      ...(localized[languageGroup as keyof typeof localized]?.rounds ?? {}),
    },
    routeValues: {
      ...base.routeValues,
      ...(localized[languageGroup as keyof typeof localized]?.routeValues ?? {}),
    },
  };
}

function createTeamMatchCards(teamName: string, copy: ReturnType<typeof getTeamPageCopy>) {
  return getTeamMatches(teamName).map((match, index) => ({
    matchday: `${copy.matchday} ${match.matchday}`,
    home: match.home,
    away: match.away,
    date: formatMatchDate(match.date),
    venue: match.venue,
    note:
      index === 0
        ? copy.routeValues.groupStage
        : index === 1
          ? copy.routeValues.round32
          : copy.routeValues.final,
  }));
}

function formatMatchDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  });
}
