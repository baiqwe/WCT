import { ClarityAnalytics } from './clarity-analytics';
import { DataFastAnalytics } from './data-fast-analytics';
import { GoogleAnalytics } from './google-analytics';
import { PlausibleAnalytics } from './plausible-analytics';
import { UmamiAnalytics } from './umami-analytics';

/**
 * Unified analytics: renders all script-based analytics (only in production, when env vars are set).
 * Uses import.meta.env.PROD (Vite built-in) — not in clientEnv because clientPrefix is VITE_* only.
 */
export function Analytics({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {import.meta.env.PROD && (
        <>
          <GoogleAnalytics />
          <UmamiAnalytics />
          <PlausibleAnalytics />
          <DataFastAnalytics />
          <ClarityAnalytics />
        </>
      )}
    </>
  );
}
