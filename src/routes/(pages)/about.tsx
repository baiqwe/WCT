import Container from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { cn } from '@/lib/utils';
import {
  IconChartBar,
  IconMailFilled,
  IconRouteSquare,
  IconShieldCheck,
  IconTrophy,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(pages)/about')({
  head: () =>
    seo('/about', {
      title: `About ${websiteConfig.metadata?.name}`,
      description:
        'Learn how World Cup 2026 Simulator builds free group stage, bracket, team path, and goal prediction tools for football fans.',
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Independent football prediction tools
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            About {websiteConfig.metadata?.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            World Cup 2026 Simulator is a free toolkit for football fans who
            want to test tournament paths before the real matches happen. The
            site focuses on practical tools: group score prediction, live group
            tables, best third-place calculations, Round of 32 bracket paths,
            team pages, and multilingual goal prediction pages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/en/world-cup-simulator"
              className={cn(buttonVariants(), 'rounded-lg')}
            >
              <IconTrophy className="mr-1 size-4" />
              Open the simulator
            </a>
            <a
              href="/contact"
              className={cn(buttonVariants({ variant: 'outline' }), 'rounded-lg')}
            >
              <IconMailFilled className="mr-1 size-4" />
              Contact us
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <AboutCard
            icon={<IconRouteSquare className="size-5" />}
            title="Built around the full tournament path"
            body="The simulator connects group rankings, third-place qualification, knockout seeding, finalists, and champion paths instead of showing isolated score boxes."
          />
          <AboutCard
            icon={<IconChartBar className="size-5" />}
            title="Designed for useful prediction intent"
            body="Each group and team page is meant to answer a concrete search task: predict goals, compare standings, review opponents, and continue into the bracket."
          />
          <AboutCard
            icon={<IconShieldCheck className="size-5" />}
            title="Independent and transparent"
            body="This is not an official FIFA or federation website. Predictions are for entertainment and analysis, not betting advice or guaranteed outcomes."
          />
        </div>

        <div className="mt-12 grid gap-8 border-t pt-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">How the tools work</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The site combines a static tournament structure with browser-side
              score inputs and deterministic ranking rules. When you change
              scores, the table updates by points, goal difference, goals
              scored, and stable seed values when a simulated table is still
              tied.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              'Group pages focus on six-match score and goal prediction.',
              'Best third-place tools compare the third-ranked teams across all groups.',
              'Team pages explain group opponents, route scenarios, and bracket context.',
              'Multilingual pages are built to help fans in different markets use the same tournament logic.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-card p-6">
          <h2 className="text-2xl font-semibold">Editorial and data notes</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            We aim to keep the tournament structure, page copy, and prediction
            flows clear and current. Because tournament information can change,
            pages may be updated as official groups, venues, schedules, or
            qualification details are confirmed. If you notice an error or want
            to suggest a better simulation flow, please use the contact page.
          </p>
        </div>
      </div>
    </Container>
  );
}

function AboutCard({
  body,
  icon,
  title,
}: {
  body: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
    </article>
  );
}
