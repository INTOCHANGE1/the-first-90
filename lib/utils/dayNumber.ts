/**
 * Day numbering for THE FIRST 90.
 *
 * Day 1 = the calendar day the user first signed up, in *their* timezone.
 * Subsequent days advance at midnight in their timezone. If they miss days,
 * the count keeps advancing — they can backfill but the calendar is real.
 *
 * Phase 1: days 1-28
 * Phase 2: days 29-56
 * Phase 3: days 57-84
 *
 * After day 84 the user is past the journal proper and lands in back matter.
 */

export const PHASE_LENGTH_DAYS = 28;
export const TOTAL_DAYS = PHASE_LENGTH_DAYS * 3; // 84

export type DayInfo = {
  /** 1..84 if inside the journal, > 84 once finished, null if started_at is missing. */
  dayNumber: number | null;
  weekNumber: number | null; // 1..12
  phase: 1 | 2 | 3 | null;
  /** 1..28; the day-of-phase index used by habit grids. */
  dayInPhase: number | null;
  /** ISO date "YYYY-MM-DD" in the user's timezone. */
  todayLocal: string;
  /** Whether the user has already finished the 84 days. */
  finished: boolean;
};

/**
 * Format a Date as "YYYY-MM-DD" in the given IANA timezone.
 * en-CA Intl format reliably produces ISO-style YYYY-MM-DD output.
 *
 * Falls back to UTC if the supplied timezone string isn't a valid IANA
 * identifier (e.g. "Queensland" instead of "Australia/Brisbane"). Without
 * this guard, a bad value persisted on profiles.timezone would throw a
 * RangeError on every dashboard load and lock the user out of /journal.
 */
function isoDateInTZ(d: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }
}

/** Calendar days between two YYYY-MM-DD strings, treating both as UTC midnights. */
function daysBetween(startISO: string, endISO: string): number {
  const a = Date.UTC(
    Number(startISO.slice(0, 4)),
    Number(startISO.slice(5, 7)) - 1,
    Number(startISO.slice(8, 10)),
  );
  const b = Date.UTC(
    Number(endISO.slice(0, 4)),
    Number(endISO.slice(5, 7)) - 1,
    Number(endISO.slice(8, 10)),
  );
  return Math.floor((b - a) / 86_400_000);
}

export function computeDayInfo(input: {
  startedAt: string | null | undefined;
  timezone: string | null | undefined;
  /** Optional override for testing; defaults to now. */
  now?: Date;
}): DayInfo {
  const tz = input.timezone || "UTC";
  const now = input.now ?? new Date();
  const todayLocal = isoDateInTZ(now, tz);

  if (!input.startedAt) {
    return {
      dayNumber: null,
      weekNumber: null,
      phase: null,
      dayInPhase: null,
      todayLocal,
      finished: false,
    };
  }

  const startedLocal = isoDateInTZ(new Date(input.startedAt), tz);
  const elapsed = daysBetween(startedLocal, todayLocal);
  const dayNumber = elapsed + 1; // Day 1 = signup day

  if (dayNumber < 1) {
    // Clock skew or future-dated start — treat as day 1.
    return {
      dayNumber: 1,
      weekNumber: 1,
      phase: 1,
      dayInPhase: 1,
      todayLocal,
      finished: false,
    };
  }

  if (dayNumber > TOTAL_DAYS) {
    return {
      dayNumber,
      weekNumber: 12,
      phase: 3,
      dayInPhase: PHASE_LENGTH_DAYS,
      todayLocal,
      finished: true,
    };
  }

  const phase = (dayNumber <= 28 ? 1 : dayNumber <= 56 ? 2 : 3) as 1 | 2 | 3;
  const weekNumber = Math.ceil(dayNumber / 7);
  const dayInPhase = ((dayNumber - 1) % PHASE_LENGTH_DAYS) + 1;

  return {
    dayNumber,
    weekNumber,
    phase,
    dayInPhase,
    todayLocal,
    finished: false,
  };
}

/** True if `todayLocal` (YYYY-MM-DD in user's TZ) falls on a Sunday. */
export function isSundayInTZ(todayLocal: string): boolean {
  const [y, m, d] = todayLocal.split("-").map(Number);
  // 0 = Sunday in Date#getUTCDay()
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 0;
}

/** Day-of-week label ("Monday", "Tuesday", …) in the user's local frame. */
export function dayLabelInTZ(todayLocal: string): string {
  const [y, m, d] = todayLocal.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    timeZone: "UTC",
  });
}
