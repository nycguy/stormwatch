# StormWatch History API Contract

StormWatch remains fully usable as a static GitHub Pages application. An optional history service can add arbitrary-location persistence without coupling the UI to a specific vendor.

## POST /locations
JSON body: `{"key":"41.20,-73.73","lat":41.2043,"lon":-73.7271,"label":"Mount Kisco, NY"}`.

The service should normalize/deduplicate coordinates, enforce U.S. bounds, rate-limit registrations, and return `{"registered":true,"key":"41.20,-73.73"}`. Registration is idempotent.

## GET /history?lat=41.2043&lon=-73.7271
Returns the nearest registered-location history when within the service tolerance:

`{"key":"41.20,-73.73","distanceKm":0.4,"current":{...},"h24":{...},"h72":{...}}`

Return 404 when no persisted location is sufficiently close. The browser then uses GitHub-hosted regional history and local fixed-window history.

## Snapshot semantics
Capture at a fixed cadence independent of site visits. Store source timestamps and forecast valid times. Retain enough data for at least 72-hour comparisons. Never interpret a user's last-open time as a comparison window.
