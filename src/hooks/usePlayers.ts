import { useCallback, useEffect, useRef, useState } from 'react';
import { canWriteShared, getSharedDb, type CollectionRef, type DbError } from '../platform';
import type { Player } from '../types';
import { normalizeName } from '../utils/importExport';
import { loadPlayers, newId, sanitizePlayers, savePlayers } from '../utils/storage';

/**
 * Where the player list lives:
 *  - `local`: this browser's localStorage only (dev server, static hosting).
 *  - `shared`: the claude.ai Artifact database, live-synced for everyone the page is shared with.
 */
export type StorageMode = 'connecting' | 'local' | 'shared';

export interface PlayersApi {
  players: Player[];
  mode: StorageMode;
  /** True when the list is shared but this viewer may only look at it. */
  readOnly: boolean;
  /** False when the browser refused to save (private mode, storage full, …). */
  saveOk: boolean;
  addPlayer: (name: string, rank: number) => void;
  updatePlayer: (id: string, changes: Partial<Omit<Player, 'id'>>) => void;
  deletePlayer: (id: string) => void;
  replaceAll: (players: Player[]) => void;
  /** Returns the existing player with this name (case/whitespace-insensitive), if any. */
  findByName: (name: string, exceptId?: string) => Player | undefined;
}

const COLLECTION = 'players';

const cleanName = (name: string) => name.trim().replace(/\s+/g, ' ');

export function usePlayers(onError: (message: string) => void): PlayersApi {
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());
  const [mode, setMode] = useState<StorageMode>('connecting');
  const [readOnly, setReadOnly] = useState(false);
  const [saveOk, setSaveOk] = useState(true);
  const collection = useRef<CollectionRef | null>(null);
  const playersRef = useRef(players);
  playersRef.current = players;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Connect to the shared database when running as a claude.ai Artifact.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const db = await getSharedDb();
      if (cancelled) return;
      if (!db) {
        setMode('local');
        return;
      }
      const col = db.collection(COLLECTION);
      collection.current = col;
      unsubscribe = col.onSnapshot(
        (snap) => {
          const next = sanitizePlayers(snap.docs.filter((d) => d.exists).map((d) => ({ ...d.data(), id: d.id })));
          setPlayers(next);
          setMode('shared');
          savePlayers(next); // offline copy for this viewer
        },
        (err: DbError) => {
          if (err.code === 'revoked') setReadOnly(true);
          else onErrorRef.current('Lost the connection to the shared list. Reload the page to reconnect.');
        },
      );
      const allowed = await canWriteShared();
      if (!cancelled && allowed === false) setReadOnly(true);
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // Local mode: persist every change, and keep several open tabs in sync.
  const firstSave = useRef(true);
  useEffect(() => {
    if (mode !== 'local') return;
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    setSaveOk(savePlayers(players));
  }, [players, mode]);

  useEffect(() => {
    if (mode !== 'local') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith('fftg.players')) setPlayers(loadPlayers());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [mode]);

  /** Runs shared-database writes in order and reports failures. */
  const write = useCallback(async (ops: ((col: CollectionRef) => Promise<void>)[]) => {
    const col = collection.current;
    if (!col) return;
    try {
      for (const op of ops) await op(col);
    } catch (e) {
      const code = (e as DbError)?.code;
      if (code === 'invalid_argument' || code === 'not_granted') {
        setReadOnly(true);
        onErrorRef.current('You can view this list but not change it. Ask the owner for edit access.');
      } else if (code === 'quota_exceeded') {
        onErrorRef.current('The shared list is full. Delete some players and try again.');
      } else {
        onErrorRef.current('Could not save the change. Check your connection and try again.');
      }
    }
  }, []);

  const shared = () => mode === 'shared' && collection.current;

  const addPlayer = (name: string, rank: number) => {
    const player = { id: newId(), name: cleanName(name), rank };
    if (shared()) void write([(c) => c.doc(player.id).set({ name: player.name, rank })]);
    else setPlayers((ps) => [...ps, player]);
  };

  const updatePlayer = (id: string, changes: Partial<Omit<Player, 'id'>>) => {
    const current = playersRef.current.find((p) => p.id === id);
    if (!current) return;
    const next = { ...current, ...changes, name: cleanName(changes.name ?? current.name) };
    if (shared()) void write([(c) => c.doc(id).set({ name: next.name, rank: next.rank })]);
    else setPlayers((ps) => ps.map((p) => (p.id === id ? next : p)));
  };

  const deletePlayer = (id: string) => {
    if (shared()) void write([(c) => c.doc(id).delete()]);
    else setPlayers((ps) => ps.filter((p) => p.id !== id));
  };

  const replaceAll = (next: Player[]) => {
    if (!shared()) {
      setPlayers(next);
      return;
    }
    const before = new Map(playersRef.current.map((p) => [p.id, p]));
    const keep = new Set(next.map((p) => p.id));
    const ops: ((col: CollectionRef) => Promise<void>)[] = [];
    for (const p of playersRef.current) if (!keep.has(p.id)) ops.push((c) => c.doc(p.id).delete());
    for (const p of next) {
      const old = before.get(p.id);
      if (!old || old.name !== p.name || old.rank !== p.rank) {
        ops.push((c) => c.doc(p.id).set({ name: p.name, rank: p.rank }));
      }
    }
    void write(ops);
  };

  const findByName = useCallback(
    (name: string, exceptId?: string) => {
      const key = normalizeName(name);
      return players.find((p) => p.id !== exceptId && normalizeName(p.name) === key);
    },
    [players],
  );

  return { players, mode, readOnly, saveOk, addPlayer, updatePlayer, deletePlayer, replaceAll, findByName };
}
