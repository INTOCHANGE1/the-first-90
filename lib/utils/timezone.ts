/**
 * Shared timezone utilities.
 *
 * The dashboard's day-numbering depends on profiles.timezone being a valid
 * IANA identifier (e.g. "America/Chicago", not "Central Time" or "CDT").
 * Onboarding and /settings both import these helpers so the same picker UI
 * and the same validation guard wrap every write to profiles.timezone.
 */

/**
 * Curated short list shown above the full alphabetical IANA list. Covers the
 * brand's home market (Australia) plus the major international zones we've
 * seen on client signups so far. All four US continental zones are included
 * so a US user doesn't have to scroll into "All timezones" to find theirs.
 */
export const COMMON_TIMEZONES = [
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Adelaide",
  "Australia/Perth",
  "Australia/Hobart",
  "Australia/Darwin",
  "Pacific/Auckland",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "UTC",
];

let cachedTimezones: string[] | null = null;

/**
 * Full IANA timezone list, sorted, cached after first call. Falls back to the
 * common list on runtimes that don't expose Intl.supportedValuesOf.
 */
export function getAllTimezones(): string[] {
  if (cachedTimezones) return cachedTimezones;
  try {
    const fn = (
      Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
    ).supportedValuesOf;
    if (typeof fn === "function") {
      cachedTimezones = fn("timeZone").slice().sort();
      return cachedTimezones;
    }
  } catch {
    // fall through to the curated fallback
  }
  cachedTimezones = [...COMMON_TIMEZONES];
  return cachedTimezones;
}

/** True if the string is an IANA timezone Intl will accept. */
export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Best-effort guess of the visitor's timezone from the browser. */
export function guessTimezone(): string {
  if (typeof Intl === "undefined") return "UTC";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
