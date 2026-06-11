import { getPagePath, normalizeLocale } from '@/lib/world-cup-content';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params, location }) => {
    const pathDepth = location.pathname.split('/').filter(Boolean).length;
    if (pathDepth === 1) {
      throw redirect({ to: getPagePath(normalizeLocale(params.locale), 'home') });
    }
  },
});
