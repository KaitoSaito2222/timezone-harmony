import { DateTime } from 'luxon';

export interface ZoneTime {
  /** Local time in the zone, "HH:mm". */
  from: string;
  /** End of the window in the same zone; equals `from` for single moments. */
  to: string;
}

export type BusinessOverlap =
  | { kind: 'overlap'; windows: ZoneTime[] }
  | { kind: 'compromise'; times: string[] };

const STEP = 15; // minutes
const SLOTS = (24 * 60) / STEP;

/** True when `minutes` (since local midnight) falls in [startH, endH). */
function inBusinessHours(minutes: number, startH: number, endH: number): boolean {
  return minutes >= startH * 60 && minutes < endH * 60;
}

/** Minutes outside the business window on a 24h circle; 0 only when inside. */
function distanceFromBusinessHours(minutes: number, startH: number, endH: number): number {
  if (inBusinessHours(minutes, startH, endH)) return 0;
  const circ = (a: number, b: number) => {
    const d = Math.abs(a - b);
    return Math.min(d, 1440 - d);
  };
  // Exactly at closing time is already outside, so never report 0 here.
  return Math.max(1, Math.min(circ(minutes, startH * 60), circ(minutes, endH * 60)));
}

/**
 * Finds when the business hours of every zone overlap. If they never do,
 * returns the moment with the least total distance from business hours.
 * `windows` is in the same order as `zones`.
 */
export function findBusinessOverlap(
  zones: string[],
  now: DateTime = DateTime.now(),
  startH = 9,
  endH = 17,
): BusinessOverlap {
  const base = now.setZone('UTC').startOf('day');
  const localMinutes = (slot: number, zone: string) => {
    const t = base.plus({ minutes: slot * STEP }).setZone(zone);
    return t.hour * 60 + t.minute;
  };
  const fmt = (slot: number, zone: string) =>
    base.plus({ minutes: slot * STEP }).setZone(zone).toFormat('HH:mm');

  const inAll = Array.from({ length: SLOTS }, (_, slot) =>
    zones.every(z => inBusinessHours(localMinutes(slot, z), startH, endH)),
  );

  if (inAll.some(Boolean)) {
    // Longest run of overlapping slots, treating the UTC day as a circle.
    let bestStart = -1;
    let bestLen = 0;
    for (let s = 0; s < SLOTS; s++) {
      if (!inAll[s] || inAll[(s + SLOTS - 1) % SLOTS]) continue;
      let len = 0;
      while (inAll[(s + len) % SLOTS] && len < SLOTS) len++;
      if (len > bestLen) {
        bestLen = len;
        bestStart = s;
      }
    }
    return {
      kind: 'overlap',
      windows: zones.map(z => ({ from: fmt(bestStart, z), to: fmt(bestStart + bestLen, z) })),
    };
  }

  let bestSlot = 0;
  let bestCost = Infinity;
  for (let slot = 0; slot < SLOTS; slot++) {
    const cost = zones.reduce(
      (sum, z) => sum + distanceFromBusinessHours(localMinutes(slot, z), startH, endH),
      0,
    );
    if (cost < bestCost) {
      bestCost = cost;
      bestSlot = slot;
    }
  }
  return { kind: 'compromise', times: zones.map(z => fmt(bestSlot, z)) };
}
