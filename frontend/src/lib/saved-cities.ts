const KEY = 'th:my-cities';

/** Reads the device-saved city list (IANA identifiers). Safe on the server and without storage. */
export function loadSavedCities(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function saveCities(identifiers: string[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(identifiers));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedCities(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear without storage.
  }
}
