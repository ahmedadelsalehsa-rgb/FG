import { useCallback, useEffect, useRef, useState } from 'react';
import type { Player } from '../types';
import { normalizeName } from '../utils/importExport';
import { loadPlayers, newId, savePlayers } from '../utils/storage';

export interface PlayersApi {
  players: Player[];
  /** False when the browser refused to save (private mode, storage full, …). */
  saveOk: boolean;
  addPlayer: (name: string, rank: number) => void;
  updatePlayer: (id: string, changes: Partial<Omit<Player, 'id'>>) => void;
  deletePlayer: (id: string) => void;
  replaceAll: (players: Player[]) => void;
  /** Returns the existing player with this name (case/whitespace-insensitive), if any. */
  findByName: (name: string, exceptId?: string) => Player | undefined;
}

export function usePlayers(): PlayersApi {
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());
  const [saveOk, setSaveOk] = useState(true);
  const first = useRef(true);

  // Persist on every change (skip the initial load to avoid a redundant write).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaveOk(savePlayers(players));
  }, [players]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith('fftg.players')) setPlayers(loadPlayers());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addPlayer = useCallback((name: string, rank: number) => {
    setPlayers((ps) => [...ps, { id: newId(), name: name.trim().replace(/\s+/g, ' '), rank }]);
  }, []);

  const updatePlayer = useCallback((id: string, changes: Partial<Omit<Player, 'id'>>) => {
    setPlayers((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, ...changes, name: (changes.name ?? p.name).trim().replace(/\s+/g, ' ') }
          : p,
      ),
    );
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setPlayers((ps) => ps.filter((p) => p.id !== id));
  }, []);

  const replaceAll = useCallback((next: Player[]) => setPlayers(next), []);

  const findByName = useCallback(
    (name: string, exceptId?: string) => {
      const key = normalizeName(name);
      return players.find((p) => p.id !== exceptId && normalizeName(p.name) === key);
    },
    [players],
  );

  return { players, saveOk, addPlayer, updatePlayer, deletePlayer, replaceAll, findByName };
}
