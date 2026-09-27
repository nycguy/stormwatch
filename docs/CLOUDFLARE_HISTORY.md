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
