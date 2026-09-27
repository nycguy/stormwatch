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
