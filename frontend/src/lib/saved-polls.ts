const KEY = 'th:my-polls';
const MAX_ENTRIES = 20;

export interface SavedPoll {
  id: string;
  title: string;
  /** True when this device created the poll, false when it only voted in it. */
  created: boolean;
  savedAt: string;
}

/** Reads polls remembered on this device. Safe on the server and without storage. */
export function loadSavedPolls(): SavedPoll[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is SavedPoll =>
        !!p && typeof p.id === 'string' && typeof p.title === 'string' && typeof p.savedAt === 'string',
    );
  } catch {
    return [];
  }
}

function write(polls: SavedPoll[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(polls.slice(0, MAX_ENTRIES)));
  } catch {
    // Remembering polls is a convenience only.
  }
}

/** Adds or refreshes a poll, keeping the "created" flag once it has been set. */
export function rememberPoll(poll: { id: string; title: string }, created: boolean): void {
  if (typeof window === 'undefined') return;
  const existing = loadSavedPolls();
  const prev = existing.find(p => p.id === poll.id);
  const entry: SavedPoll = {
    id: poll.id,
    title: poll.title,
    created: created || (prev?.created ?? false),
    savedAt: new Date().toISOString(),
  };
  write([entry, ...existing.filter(p => p.id !== poll.id)]);
}

export function forgetPoll(id: string): void {
  if (typeof window === 'undefined') return;
  write(loadSavedPolls().filter(p => p.id !== id));
}
