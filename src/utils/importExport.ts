import { RANK_OPTIONS } from '../config';
import type { Player } from '../types';
import { isValidRank, newId } from './storage';

export interface ImportedPlayer {
  name: string;
  rank: number;
}

export interface ParseResult {
  players: ImportedPlayer[];
  /** Human-readable problems with individual rows that were skipped. */
  warnings: string[];
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function exportJson(players: Player[]): string {
  return JSON.stringify(
    {
      app: 'fair-football-team-generator',
      version: 1,
      exportedAt: new Date().toISOString(),
      players: players.map(({ name, rank }) => ({ name, rank })),
    },
    null,
    2,
  );
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function exportCsv(players: Player[]): string {
  return ['name,rank', ...players.map((p) => `${csvCell(p.name)},${p.rank}`)].join('\n') + '\n';
}

/** Splits CSV text into rows of cells, honouring quoted cells. */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',' || ch === ';') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

function collect(entries: { name: unknown; rank: unknown; where: string }[]): ParseResult {
  const players: ImportedPlayer[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const { name, rank, where } of entries) {
    const n = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
    const r = typeof rank === 'string' ? Number(rank.trim()) : rank;
    if (!n) {
      warnings.push(`${where}: missing name — skipped.`);
      continue;
    }
    if (!isValidRank(r)) {
      warnings.push(
        `${where}: "${n}" has an invalid rank (${String(rank)}); allowed ranks are ${RANK_OPTIONS[0]}–${RANK_OPTIONS[RANK_OPTIONS.length - 1]} — skipped.`,
      );
      continue;
    }
    const key = normalizeName(n);
    if (seen.has(key)) {
      warnings.push(`${where}: "${n}" appears more than once in the file — only the first entry was kept.`);
      continue;
    }
    seen.add(key);
    players.push({ name: n, rank: r });
  }
  return { players, warnings };
}

export function parseJson(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('The file is not valid JSON.');
  }
  const list = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { players?: unknown }).players)
      ? (data as { players: unknown[] }).players
      : null;
  if (!list) throw new Error('No player list found. Expected an array of { "name", "rank" } objects.');
  return collect(
    list.map((item, i) => {
      const o = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
      return { name: o.name, rank: o.rank, where: `Entry ${i + 1}` };
    }),
  );
}

export function parseCsv(text: string): ParseResult {
  const rows = parseCsvRows(text.replace(/^﻿/, ''));
  if (!rows.length) throw new Error('The CSV file is empty.');
  let nameCol = 0;
  let rankCol = 1;
  let start = 0;
  const header = rows[0].map((c) => c.trim().toLowerCase());
  if (header.includes('name') || header.includes('rank')) {
    nameCol = header.indexOf('name');
    rankCol = header.indexOf('rank');
    if (nameCol < 0 || rankCol < 0) throw new Error('The CSV header must contain "name" and "rank" columns.');
    start = 1;
  }
  return collect(
    rows.slice(start).map((r, i) => ({ name: r[nameCol], rank: r[rankCol], where: `Row ${i + start + 1}` })),
  );
}

export function parseImportFile(fileName: string, text: string): ParseResult {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('The file is empty.');
  const looksJson = /\.json$/i.test(fileName) || trimmed.startsWith('[') || trimmed.startsWith('{');
  return looksJson ? parseJson(trimmed) : parseCsv(text);
}

/**
 * Merge imported players into the existing list: players with the same name
 * (case-insensitive) get the imported rank, new names are added.
 */
export function mergePlayers(existing: Player[], imported: ImportedPlayer[]): Player[] {
  const byName = new Map(existing.map((p) => [normalizeName(p.name), p]));
  const result = existing.map((p) => ({ ...p }));
  for (const imp of imported) {
    const match = byName.get(normalizeName(imp.name));
    if (match) {
      const target = result.find((p) => p.id === match.id)!;
      target.rank = imp.rank;
    } else {
      result.push({ id: newId(), name: imp.name, rank: imp.rank });
    }
  }
  return result;
}

export function replacePlayers(imported: ImportedPlayer[]): Player[] {
  return imported.map((p) => ({ id: newId(), name: p.name, rank: p.rank }));
}
