import { describe, expect, it } from 'vitest';
import type { Player } from '../types';
import { exportCsv, exportJson, mergePlayers, parseImportFile } from './importExport';
import { loadPlayers, loadSession, PLAYERS_KEY, savePlayers, saveSession, type KeyValueStore } from './storage';

function memoryStore(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
}

const sample: Player[] = [
  { id: 'a', name: 'Ali', rank: 1 },
  { id: 'b', name: 'Bilal, Jr.', rank: 4 },
  { id: 'c', name: 'Chris "CJ" Jones', rank: 10 },
];

describe('storage', () => {
  it('saved players survive a reload (simulated refresh)', () => {
    const store = memoryStore();
    expect(savePlayers(sample, store)).toBe(true);
    // A refresh = a fresh read from the same storage.
    expect(loadPlayers(store)).toEqual(sample);
  });

  it('a rank change is persisted', () => {
    const store = memoryStore();
    savePlayers(sample, store);
    const updated = loadPlayers(store).map((p) => (p.id === 'b' ? { ...p, rank: 2 } : p));
    savePlayers(updated, store);
    expect(loadPlayers(store).find((p) => p.id === 'b')!.rank).toBe(2);
  });

  it('recovers from corrupted or missing data', () => {
    const store = memoryStore();
    expect(loadPlayers(store)).toEqual([]);
    store.setItem(PLAYERS_KEY, '{not json');
    expect(loadPlayers(store)).toEqual([]);
    store.setItem(PLAYERS_KEY, JSON.stringify([{ name: 'Ok', rank: 3 }, { name: '', rank: 2 }, { name: 'Bad', rank: 99 }]));
    const loaded = loadPlayers(store);
    expect(loaded.map((p) => p.name)).toEqual(['Ok']);
    expect(loaded[0].id).toBeTruthy();
    expect(loadPlayers(null)).toEqual([]);
  });

  it('reports failure when storage refuses to save', () => {
    const broken: KeyValueStore = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(savePlayers(sample, broken)).toBe(false);
  });

  it('stores the team count and selection', () => {
    const store = memoryStore();
    expect(loadSession(store)).toEqual({ teamCount: 3, selectedIds: [] });
    saveSession({ teamCount: 4, selectedIds: ['a', 'b'] }, store);
    expect(loadSession(store)).toEqual({ teamCount: 4, selectedIds: ['a', 'b'] });
  });
});

describe('import / export', () => {
  it('round-trips JSON', () => {
    const parsed = parseImportFile('players.json', exportJson(sample));
    expect(parsed.players).toEqual(sample.map(({ name, rank }) => ({ name, rank })));
    expect(parsed.warnings).toEqual([]);
  });

  it('round-trips CSV, including commas and quotes in names', () => {
    const parsed = parseImportFile('players.csv', exportCsv(sample));
    expect(parsed.players).toEqual(sample.map(({ name, rank }) => ({ name, rank })));
  });

  it('accepts a plain JSON array and headerless CSV', () => {
    expect(parseImportFile('x.json', '[{"name":"A","rank":2}]').players).toEqual([{ name: 'A', rank: 2 }]);
    expect(parseImportFile('x.csv', 'Sam,3\r\nLee,5\r\n').players).toEqual([
      { name: 'Sam', rank: 3 },
      { name: 'Lee', rank: 5 },
    ]);
  });

  it('skips invalid rows with warnings and rejects broken files', () => {
    const parsed = parseImportFile('x.csv', 'name,rank\nA,1\n,2\nB,11\na,3\n');
    expect(parsed.players).toEqual([{ name: 'A', rank: 1 }]);
    expect(parsed.warnings).toHaveLength(3);
    expect(() => parseImportFile('x.json', '{oops')).toThrow(/valid JSON/);
    expect(() => parseImportFile('x.csv', '   ')).toThrow(/empty/);
    expect(() => parseImportFile('x.json', '{"foo":1}')).toThrow(/No player list/);
  });

  it('merges by name (case-insensitive), updating ranks and adding new players', () => {
    const merged = mergePlayers(sample, [
      { name: 'ali', rank: 3 },
      { name: 'New Guy', rank: 6 },
    ]);
    expect(merged).toHaveLength(4);
    expect(merged.find((p) => p.id === 'a')!.rank).toBe(3);
    expect(merged.find((p) => p.name === 'New Guy')!.rank).toBe(6);
  });
});
