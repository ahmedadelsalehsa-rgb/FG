import { DEFAULT_TEAM_COUNT, TEAM_COUNT_OPTIONS } from '../config';
import type { Player } from '../types';
import { makePlayer } from './ratings';

export { isValidRank } from './ratings';

export const PLAYERS_KEY = 'fftg.players.v2';
export const SESSION_KEY = 'fftg.session.v1';

export interface SavedSession {
  teamCount: number;
  selectedIds: string[];
}

/** Minimal subset of the Storage API so tests can pass an in-memory implementation. */
export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStore(): KeyValueStore | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // e.g. storage disabled by privacy settings
  }
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Keeps only well-formed player records; drops anything malformed. The average
 * `rank` is always recomputed from `ratings` (an old single `rank` field from
 * earlier versions is ignored).
 */
export function sanitizePlayers(value: unknown): Player[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: Player[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const { id, name, ratings } = item as Record<string, unknown>;
    if (typeof name !== 'string' || !name.trim()) continue;
    let pid = typeof id === 'string' && id ? id : newId();
    if (seen.has(pid)) pid = newId();
    seen.add(pid);
    out.push(makePlayer(pid, name.trim(), (ratings ?? {}) as Player['ratings']));
  }
  return out;
}

export function loadPlayers(store: KeyValueStore | null = defaultStore()): Player[] {
  if (!store) return [];
  try {
    const raw = store.getItem(PLAYERS_KEY);
    return raw ? sanitizePlayers(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

/** Returns false when the browser refused to save (quota, private mode, …). */
export function savePlayers(players: Player[], store: KeyValueStore | null = defaultStore()): boolean {
  if (!store) return false;
  try {
    store.setItem(PLAYERS_KEY, JSON.stringify(players));
    return true;
  } catch {
    return false;
  }
}

export function loadSession(store: KeyValueStore | null = defaultStore()): SavedSession {
  const fallback: SavedSession = { teamCount: DEFAULT_TEAM_COUNT, selectedIds: [] };
  if (!store) return fallback;
  try {
    const raw = store.getItem(SESSION_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SavedSession>;
    return {
      teamCount:
        typeof parsed.teamCount === 'number' && TEAM_COUNT_OPTIONS.includes(parsed.teamCount)
          ? parsed.teamCount
          : DEFAULT_TEAM_COUNT,
      selectedIds: Array.isArray(parsed.selectedIds)
        ? parsed.selectedIds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return fallback;
  }
}

export function saveSession(session: SavedSession, store: KeyValueStore | null = defaultStore()): void {
  if (!store) return;
  try {
    store.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Non-critical: the selection simply won't survive a refresh.
  }
}
