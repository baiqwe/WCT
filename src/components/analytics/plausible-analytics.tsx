import { clientEnv } from '@/env/client';
import { ScriptInject } from './script-inject';

/**
 * Plausible Analytics
 * https://plausible.io
 */
export function PlausibleAnalytics() {
  if (!import.meta.env.PROD) return null;
  const domain = clientEnv.VITE_PLAUSIBLE_DOMAIN;
  const script = clientEnv.VITE_PLAUSIBLE_SCRIPT;
  if (!domain || !script) return null;

  return <ScriptInject src={script} defer dataAttributes={{ domain }} />;
}
