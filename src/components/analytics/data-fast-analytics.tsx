import { clientEnv } from '@/env/client';
import { ScriptInject } from './script-inject';

/**
 * DataFast Analytics
 * https://datafa.st
 */
export function DataFastAnalytics() {
  if (!import.meta.env.PROD) return null;
  const domain = clientEnv.VITE_DATAFAST_DOMAIN;
  const websiteId = clientEnv.VITE_DATAFAST_WEBSITE_ID;
  if (!domain || !websiteId) return null;

  return (
    <ScriptInject
      src="https://datafa.st/js/script.js"
      defer
      dataAttributes={{ websiteId, domain }}
    />
  );
}
