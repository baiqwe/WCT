import { getFile } from '@/storage';
import { worldCupGroupStageMatches } from '@/lib/world-cup-data';
import { createFileRoute } from '@tanstack/react-router';

const LIVE_DATA_KEY = 'world-cup-live.json';

export const Route = createFileRoute('/api/world-cup-live')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const file = await getFile(LIVE_DATA_KEY);
          if (file) {
            return new Response(file.body, {
              headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                'Content-Type': file.contentType || 'application/json',
                'X-World-Cup-Data-Source': 'r2',
              },
            });
          }
        } catch {
          // Fall back to bundled data if R2 is unavailable or the object is missing.
        }

        return Response.json(
          {
            generatedAt: new Date().toISOString(),
            source: 'bundled',
            matches: worldCupGroupStageMatches,
          },
          {
            headers: {
              'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
              'X-World-Cup-Data-Source': 'bundled',
            },
          }
        );
      },
    },
  },
});
