import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseImportFile } from './importExport';

describe('share/players-import.csv', () => {
  it('imports all 21 players unrated and without warnings', () => {
    const parsed = parseImportFile('players-import.csv', readFileSync('share/players-import.csv', 'utf8'));
    expect(parsed.warnings).toEqual([]);
    expect(parsed.players).toHaveLength(21);
    expect(parsed.players.every((p) => Object.values(p.ratings).every((v) => v === null))).toBe(true);
  });
});
