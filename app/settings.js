// Persisted app settings.
//
// Deliberately tolerant on read and strict on write: a hand-edited or
// half-written settings file must not stop the app from opening, but it must
// also never silently discard a key it did not recognise.

import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export const DIR = path.join(homedir(), ".koshersync");
const FILE = path.join(DIR, "settings.json");

export const DEFAULTS = {
  projectsRoot: path.join(homedir(), "projects"),
  controlPort: 7900,
};

export function read() {
  let stored = {};

  try {
    stored = JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    // Missing or corrupt: fall back to defaults rather than refusing to start.
    return { ...DEFAULTS };
  }

  return { ...DEFAULTS, ...stored };
}

export function write(settings) {
  mkdirSync(DIR, { recursive: true });

  // Write-then-rename, so a crash mid-write cannot leave a truncated file that
  // the next start would silently reset to defaults.
  const temporary = `${FILE}.tmp`;
  writeFileSync(temporary, JSON.stringify(settings, null, 2));
  renameSync(temporary, FILE);

  return settings;
}

export function update(patch) {
  return write({ ...read(), ...patch });
}
