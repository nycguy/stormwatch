# Cloudflare deployment

The repository contains a deployable Worker + D1 implementation for arbitrary-location history. It is intentionally **not deployed automatically** until a StormWatch-specific Cloudflare target is authorized.

## Resources

- Worker: `worker/history-worker.js`
- D1 schema: `worker/schema.sql`
- Wrangler config: `wrangler.toml`
- Cron: twice hourly, offset from the GitHub regional collector
- Retention: 8 days
- Capture limit: 250 most recently used active normalized locations per run

## First deployment

1. Create a D1 database named `stormwatch-history`.
2. Put its real database ID in `wrangler.toml`.
3. Apply `worker/schema.sql` to the D1 database.
4. Deploy the Worker.
5. Set `StormWatchConfig.historyApi` in `js/config.js` to the deployed Worker origin.
6. Verify `/health`, register a test location, allow snapshots to accumulate, and verify `/history`.
7. Only after those checks should the frontend backend URL be committed.

No API token, account ID, database ID or secret belongs in source control.


## Capture safety and scaling

The scheduled collector is intentionally safe for the Workers Free external-subrequest ceiling. It processes at most 15 locations per five-minute invocation. Each location uses three NWS HTTP requests (point metadata, alerts, forecast), so capture work is bounded at 45 external requests before D1 operations. Locations are selected with never-captured and oldest-captured records first.

The D1 schema stores last capture time, failure count, and last error. Locations not requested for 30 days are deactivated. New normalized locations are also subject to a 5,000-active-location capacity guard so an unauthenticated public registration endpoint cannot grow the active capture set without bound. Existing normalized locations remain idempotent and can refresh their last-seen timestamp. Snapshot rows are unique by location and capture timestamp. History proximity lookup first applies an indexed coordinate bounding box and then uses Haversine distance on the small candidate set.

On a paid Workers plan, the batch size/cadence can be revisited after observing real usage. Do not increase it merely because the paid subrequest ceiling is higher; upstream NWS load and D1 write volume should remain bounded.
