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


## Weather-intelligence sprint

StormWatch now supports NOAA/NWS radar and alert-area map overlays, event-specific visual states, NOAA station flood-threshold context where metadata is published, 24-hour and 72-hour fixed-window narratives, explicit alert upgrade/downgrade/extension/expiration transitions, observation freshness in source health, and additional coastal residual context. Live upstream smoke tests report public-service failures without blocking an otherwise valid deployment, while deterministic application tests remain deployment-gating.


## Forecast evolution sprint

StormWatch now compares centrally captured regional forecasts by valid period, generates concise forecast-shift narratives, exposes alert onset/expiration timing, reads shared 24-hour and 72-hour regional snapshots, captures coastal water levels in scheduled history, and displays the highest NOAA astronomical water-level prediction in the next 72 hours. Astronomical predictions are intentionally kept distinct from the observed-minus-predicted residual used as a surge signal.


## Impact and persistence sprint

Shared history is now driven by an extensible tracked-location registry rather than locations embedded in collector code, with NYC Metro added alongside nationwide coastal regions. Event timelines adapt their language to winter, flood, wind, severe, tropical, heat and cold signals. StormWatch also includes a conservative public-camera discovery registry: it identifies potential authoritative/public registries but does not promote an individual camera until geographic relevance is verified. CI now includes static browser/mobile contract tests in addition to deterministic data tests and live upstream smoke checks.


## Arbitrary-location persistence boundary

StormWatch now has an optional, vendor-neutral history API client and a runnable reference API. Selecting a location can register its normalized coordinate key with a configured backend. Exact persisted history is preferred when available; otherwise the application falls back to centrally captured regional history and then browser-local fixed-window history. The static GitHub Pages application therefore remains functional with no backend configured. See `docs/HISTORY_API.md` for the API contract. CI tests normalization, U.S. bounds, proximity lookup, fallback behavior and the reference server.
