import { DateTime } from 'luxon';

export interface OffsetTransition {
  /** Moment the UTC offset changes. */
  at: DateTime;
  /** UTC offset in minutes before and after the change. */
  fromOffset: number;
  toOffset: number;
}

/** Formats an offset in minutes as "+9", "-4", "+5:30". */
export function formatOffsetHours(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}` : `${sign}${h}:${String(m).padStart(2, '0')}`;
}

/** Formats an hour difference such as 13 → "13", 5.5 → "5.5". */
export function formatHourDiff(hours: number): string {
  return hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
}

/**
 * Finds the first change of a zone's UTC offset within `daysAhead` days.
 * Scans day by day, then bisects to the minute. Returns null if the zone
 * keeps a fixed offset in the window (no daylight saving time).
 */
export function findNextOffsetTransition(
  zone: string,
  from: DateTime = DateTime.now(),
  daysAhead = 400,
): OffsetTransition | null {
  const start = from.setZone(zone);
  let prev = start;
  for (let d = 1; d <= daysAhead; d++) {
    const next = start.plus({ days: d });
    if (next.offset !== prev.offset) {
      let lo = prev.toMillis();
      let hi = next.toMillis();
      const before = prev.offset;
      while (hi - lo > 60_000) {
        const mid = Math.floor((lo + hi) / 2);
        if (DateTime.fromMillis(mid, { zone }).offset === before) lo = mid;
        else hi = mid;
      }
      const at = DateTime.fromMillis(hi, { zone });
      return { at, fromOffset: before, toOffset: at.offset };
    }
    prev = next;
  }
  return null;
}

export interface DiffChange {
  at: DateTime;
  fromHours: number;
  toHours: number;
  /** Index of the zones whose clocks changed (informational). */
  zones: [string, string];
}

/**
 * Detects when the time difference between two zones will change within
 * `daysAhead` days (a daylight-saving transition in either zone).
 */
export function findNextDiffChange(
  zoneA: string,
  zoneB: string,
  from: DateTime = DateTime.now(),
  daysAhead = 45,
): DiffChange | null {
  const diffAt = (dt: DateTime) => Math.abs(dt.setZone(zoneA).offset - dt.setZone(zoneB).offset) / 60;
  const current = diffAt(from);
  const tA = findNextOffsetTransition(zoneA, from, daysAhead);
  const tB = findNextOffsetTransition(zoneB, from, daysAhead);
  const first = [tA, tB]
    .filter((t): t is OffsetTransition => t !== null)
    .sort((a, b) => a.at.toMillis() - b.at.toMillis())[0];
  if (!first) return null;
  const after = diffAt(first.at.plus({ hours: 1 }));
  if (after === current) return null;
  return { at: first.at, fromHours: current, toHours: after, zones: [zoneA, zoneB] };
}
