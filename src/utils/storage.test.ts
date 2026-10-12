import { describe, expect, it } from 'vitest';
import type { Player } from '../types';
import { exportCsv, exportJson, mergePlayers, parseImportFile } from './importExport';
import { averageRank, makePlayer } from './ratings';
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
  makePlayer('a', 'Ali', { adel: 1, koshiry: 2, abdelfattah: 1 }),
  makePlayer('b', 'Bilal, Jr.', { adel: 4, koshiry: null, abdelfattah: 5 }, true),
  makePlayer('c', 'Chris "CJ" Jones', { adel: null, koshiry: 10, abdelfattah: null }),
];

describe('ratings', () => {
  it('averages the ratings that were given and ignores empty ones', () => {
    expect(averageRank({ adel: 1, koshiry: 2, abdelfattah: 1 })).toBe(1.33);
    expect(averageRank({ adel: 4, koshiry: null, abdelfattah: 5 })).toBe(4.5);
    expect(averageRank({ adel: null, koshiry: null, abdelfattah: null })).toBeNull();
  });

  it('derives the rank from ratings and drops unknown raters or invalid values', () => {
    const p = makePlayer('x', 'X', { adel: 3, koshiry: 11, someoneElse: 1 } as Player['ratings']);
    expect(p.ratings).toEqual({ adel: 3, koshiry: null, abdelfattah: null });
    expect(p.rank).toBe(3);
  });
});

describe('storage', () => {
  it('saved players survive a reload (simulated refresh)', () => {
    const store = memoryStore();
    expect(savePlayers(sample, store)).toBe(true);
    expect(loadPlayers(store)).toEqual(sample);
  });

  it('a rating change is persisted and updates the average', () => {
    const store = memoryStore();
    savePlayers(sample, store);
    const updated = loadPlayers(store).map((p) =>
      p.id === 'b' ? makePlayer(p.id, p.name, { ...p.ratings, koshiry: 3 }) : p,
    );
    savePlayers(updated, store);
    expect(loadPlayers(store).find((p) => p.id === 'b')!.rank).toBe(4);
  });

  it('recovers from corrupted or missing data', () => {
    const store = memoryStore();
    expect(loadPlayers(store)).toEqual([]);
    store.setItem(PLAYERS_KEY, '{not json');
    expect(loadPlayers(store)).toEqual([]);
    store.setItem(PLAYERS_KEY, JSON.stringify([{ name: 'Ok', ratings: { adel: 3 } }, { name: '' }, 5]));
    const loaded = loadPlayers(store);
    expect(loaded.map((p) => p.name)).toEqual(['Ok']);
    expect(loaded[0].rank).toBe(3);
    expect(loaded[0].id).toBeTruthy();
    expect(loadPlayers(null)).toEqual([]);
  });

  it('ignores the old single "rank" field', () => {
    const store = memoryStore();
    store.setItem(PLAYERS_KEY, JSON.stringify([{ id: 'o', name: 'Old', rank: 4 }]));
    expect(loadPlayers(store)[0].rank).toBeNull();
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
  const asImported = sample.map(({ name, ratings, gk }) => ({ name, ratings, gk }));

  it('round-trips JSON', () => {
    const parsed = parseImportFile('players.json', exportJson(sample));
    expect(parsed.players).toEqual(asImported);
    expect(parsed.warnings).toEqual([]);
  });

  it('round-trips CSV, including commas and quotes in names', () => {
    const csv = exportCsv(sample);
    expect(csv.split('\n')[0]).toBe('name,GK,Adel,Qoshiry,Abdelfattah,average');
    const parsed = parseImportFile('players.csv', csv);
    expect(parsed.players).toEqual(asImported);
    expect(parsed.warnings).toEqual([]);
  });

  it('reads rater columns by name in any order and case', () => {
    const parsed = parseImportFile('x.csv', 'Qoshiry,NAME,adel\n2,Sam,\n,Lee,7\n');
    expect(parsed.players).toEqual([
      { name: 'Sam', ratings: { adel: null, koshiry: 2, abdelfattah: null } },
      { name: 'Lee', ratings: { adel: 7, koshiry: null, abdelfattah: null } },
    ]);
  });

  it('reads a GK column (yes/no, 1/0, x) and leaves it unset when missing', () => {
    const parsed = parseImportFile('x.csv', 'name,GK\nA,yes\nB,no\nC,x\nD,\n');
    expect(parsed.players.map((p) => p.gk)).toEqual([true, false, true, undefined]);
    const merged = mergePlayers(sample, [{ name: 'Bilal, Jr.', ratings: {}, gk: undefined }]);
    expect(merged.find((p) => p.id === 'b')!.gk).toBe(true);
  });

  it('keeps the goalkeeper flag through storage', () => {
    const store = memoryStore();
    savePlayers(sample, store);
    expect(loadPlayers(store).map((p) => p.gk)).toEqual([false, true, false]);
  });

  it('accepts a names-only list (everything unrated)', () => {
    const parsed = parseImportFile('x.csv', 'name\nAbdelfattah\nTarek\n');
    expect(parsed.players.map((p) => p.name)).toEqual(['Abdelfattah', 'Tarek']);
    expect(parsed.players.every((p) => Object.values(p.ratings).every((v) => v === null))).toBe(true);
    const flat = parseImportFile('x.json', '[{"name":"Hassan","Adel":2}]');
    expect(flat.players[0].ratings.adel).toBe(2);
  });

  it('warns about invalid ranks and duplicate names, and rejects broken files', () => {
    const parsed = parseImportFile('x.csv', 'name,adel\nA,1\n,2\nB,11\na,3\n');
    expect(parsed.players.map((p) => p.name)).toEqual(['A', 'B']);
    expect(parsed.players[1].ratings.adel).toBeNull();
    expect(parsed.warnings).toHaveLength(3);
    expect(() => parseImportFile('x.json', '{oops')).toThrow(/valid JSON/);
    expect(() => parseImportFile('x.csv', '   ')).toThrow(/empty/);
    expect(() => parseImportFile('x.json', '{"foo":1}')).toThrow(/No player list/);
  });

  it('merges by name: fills ratings, never wipes existing ones with empty cells, adds new players', () => {
    const merged = mergePlayers(sample, [
      { name: 'ali', ratings: { adel: 3, koshiry: null, abdelfattah: null } },
      { name: 'New Guy', ratings: { adel: null, koshiry: 6, abdelfattah: null } },
    ]);
    expect(merged).toHaveLength(4);
    const ali = merged.find((p) => p.id === 'a')!;
    expect(ali.ratings).toEqual({ adel: 3, koshiry: 2, abdelfattah: 1 });
    expect(ali.rank).toBe(2);
    expect(merged.find((p) => p.name === 'New Guy')!.rank).toBe(6);
  });
});
