# World Cup Live Data Updates

The site now reads live schedule/results from:

```text
/api/world-cup-live
```

The endpoint checks R2 first:

```text
world-cup-live.json
```

If the R2 object is missing or unavailable, it falls back to bundled schedule and known results in `src/lib/world-cup-data.ts`.

## JSON Shape

```json
{
  "generatedAt": "2026-06-16T03:00:00.000Z",
  "source": "manual-official-results",
  "matches": [
    {
      "id": "A-1",
      "status": "finished",
      "homeScore": 2,
      "awayScore": 0,
      "source": "https://example.com/match-report"
    },
    {
      "id": "G-1",
      "status": "live",
      "homeScore": 1,
      "awayScore": 1
    },
    {
      "id": "I-1",
      "status": "scheduled",
      "date": "2026-06-16",
      "venue": "New York New Jersey Stadium"
    }
  ]
}
```

## Match IDs

Group-stage match IDs use:

```text
<GROUP>-<NUMBER>
```

Examples:

- `A-1`: Mexico vs South Africa
- `F-2`: Sweden vs Tunisia
- `H-2`: Spain vs Cape Verde

## Update Flow

1. Upload or replace `world-cup-live.json` in the configured R2 bucket.
2. The API serves the R2 file with `Cache-Control: public, max-age=60`.
3. Frontend pages call `/api/world-cup-live` on load and merge new scores/status into the simulator.
4. Finished matches are included in standings automatically.
5. Scheduled matches are not counted in standings unless the user manually enters a prediction.
