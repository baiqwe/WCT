import { defaultLocale, getPagePath } from '@/lib/world-cup-content';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: getPagePath(defaultLocale, 'home') });
  },
});
