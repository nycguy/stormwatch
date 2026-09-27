CREATE TABLE IF NOT EXISTS locations (
  key TEXT PRIMARY KEY,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  last_captured_at TEXT,
  capture_failures INTEGER NOT NULL DEFAULT 0,
  last_capture_error TEXT,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_key TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  payload TEXT NOT NULL,
  FOREIGN KEY(location_key) REFERENCES locations(key),
  UNIQUE(location_key,captured_at)
);
CREATE INDEX IF NOT EXISTS idx_snapshots_location_time ON snapshots(location_key,captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_seen ON locations(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_capture_due ON locations(active,last_captured_at,last_seen_at);
