# StormWatch

Nationwide U.S. weather and coastal-intelligence dashboard.

StormWatch starts from the user's current location or a manually selected city, ZIP code, or place. It resolves that location into official weather geography, then dynamically discovers relevant public data sources instead of relying on Saco-, Maine-, station-, buoy-, webcam-, timezone-, or map-specific hard coding.

## Architecture

- Static, privacy-conscious browser application deployable to GitHub Pages.
- OpenStreetMap/Nominatim for manual place search.
- Browser Geolocation API for optional current-location focus.
- NWS API for point metadata, forecast office/grid, zones, forecasts, observations, and active alerts.
- NOAA/NOS and NDBC adapters are designed as dynamic discovery layers for coastal and marine locations.
- MapLibre GL JS with free/open basemap styling.
- Fixed-window briefing/history model. Comparisons are based on durable timestamps, never on a visitor's last-open time.
- Source-health metadata is first-class so missing or stale feeds degrade gracefully.

## Initial milestone

The first production slice implements location selection, NWS point resolution, dynamic forecast/alerts, map focus, source health, and a modular adapter boundary for nationwide expansion.

No changes are made to `nycguy/saco-coast-watch`.


Deployment trigger: GitHub Pages enabled for the public repository.


## Current production capabilities

StormWatch now includes dynamic NWS point/office/zone discovery, forecasts, observations and alerts; adaptive event classification; an impact timeline; location-scoped fixed-window history and change briefings; and dynamic NOAA CO-OPS/NDBC marine discovery that stays out of the primary experience when no nearby source qualifies.

## Validation

CI performs JavaScript syntax validation, deterministic module tests, architecture guards, and Saco-specific hard-coding guards before the Pages deployment job. See `docs/VALIDATION.md` for the nationwide geographic test matrix.


## Production intelligence sprint

- NWS forecast-grid analysis now derives 24-hour precipitation, snow and gust metrics for adaptive event displays.
- NHC active-storm data provides conservative tropical context; local NWS alerts remain authoritative for local tropical event promotion.
- A scheduled GitHub Actions collector captures representative nationwide weather snapshots every 30 minutes into `data/history/`, providing durable history independent of browser visits.
- Deployment CI now runs deterministic unit tests, JavaScript syntax validation, architecture/hard-coding guards, and live upstream smoke tests against NWS, NHC, NOAA CO-OPS and NDBC.


## Extended roadmap sprint

The application now includes alert lifecycle transitions, saved and shareable locations, PWA/offline shell support, coastal station relevance scoring, observed-minus-predicted tide residuals, improved high-tide selection, richer winter/severe/rain/temperature metrics, source freshness utilities, forecast-evolution comparison utilities, shared regional-history lookup, richer scheduled forecast snapshots, mobile/accessibility hardening, and CI guards covering these capabilities.

Shared history remains a hybrid design: representative regions are captured centrally every 30 minutes, while arbitrary user-selected locations retain local timestamped history until a scalable arbitrary-location backend is introduced.
