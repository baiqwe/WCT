import { clientEnv } from '@/env/client';
import { ScriptInject } from './script-inject';

/**
 * Umami Analytics
 * https://umami.is
 */
export function UmamiAnalytics() {
  if (!import.meta.env.PROD) return null;
  const websiteId = clientEnv.VITE_UMAMI_WEBSITE_ID;
  const script = clientEnv.VITE_UMAMI_SCRIPT;
  if (!websiteId || !script) return null;

  return <ScriptInject src={script} async dataAttributes={{ websiteId }} />;
}
