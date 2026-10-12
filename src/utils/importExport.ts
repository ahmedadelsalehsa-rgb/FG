import { RANK_OPTIONS, RATERS } from '../config';
import type { Player, Ratings } from '../types';
import { cleanRatings, emptyRatings, formatRank, isValidRank, makePlayer } from './ratings';
import { newId } from './storage';

export interface ImportedPlayer {
  name: string;
  /** Per-rater ranks; empty cells become null and can be filled in later in the app. */
  ratings: Ratings;
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
      version: 2,
      exportedAt: new Date().toISOString(),
      raters: RATERS.map((r) => r.name),
      players: players.map(({ name, ratings, rank }) => ({ name, ratings, averageRank: rank })),
    },
    null,
    2,
  );
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV with one column per rater plus the average (the average is ignored on import). */
export function exportCsv(players: Player[]): string {
  const header = ['name', ...RATERS.map((r) => r.name), 'average'].join(',');
  const rows = players.map((p) =>
    [csvCell(p.name), ...RATERS.map((r) => p.ratings[r.id] ?? ''), p.rank === null ? '' : formatRank(p.rank)].join(','),
  );
  return [header, ...rows].join('\n') + '\n';
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

/** Finds the rater a column/key belongs to, by id or display name (case-insensitive). */
function raterFor(key: string): string | undefined {
  const k = key.trim().toLowerCase();
  return RATERS.find((r) => r.id === k || r.name.toLowerCase() === k)?.id;
}

interface RawEntry {
  name: unknown;
  ratings: Record<string, unknown>;
  where: string;
}

function collect(entries: RawEntry[]): ParseResult {
  const players: ImportedPlayer[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  const range = `${RANK_OPTIONS[0]}–${RANK_OPTIONS[RANK_OPTIONS.length - 1]}`;
  for (const { name, ratings: raw, where } of entries) {
    const n = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
    if (!n) {
      warnings.push(`${where}: missing name — skipped.`);
      continue;
    }
    const ratings = emptyRatings();
    for (const r of RATERS) {
      const v = raw[r.id];
      if (v == null || (typeof v === 'string' && v.trim() === '')) continue;
      const num = typeof v === 'string' ? Number(v.trim()) : v;
      if (isValidRank(num)) ratings[r.id] = num;
      else warnings.push(`${where}: ${r.name}'s rank for "${n}" (${String(v)}) is not ${range} — left empty.`);
    }
    const key = normalizeName(n);
    if (seen.has(key)) {
      warnings.push(`${where}: "${n}" appears more than once in the file — only the first entry was kept.`);
      continue;
    }
    seen.add(key);
    players.push({ name: n, ratings });
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
  if (!list) throw new Error('No player list found. Expected an array of { "name", "ratings" } objects.');
  return collect(
    list.map((item, i) => {
      const o = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
      // Ratings may be nested ({ ratings: { adel: 2 } }) or flat ({ Adel: 2 }).
      const source = { ...o, ...(o.ratings && typeof o.ratings === 'object' ? (o.ratings as object) : {}) };
      const ratings: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(source)) {
        const id = raterFor(k);
        if (id) ratings[id] = v;
      }
      return { name: o.name, ratings, where: `Entry ${i + 1}` };
    }),
  );
}

export function parseCsv(text: string): ParseResult {
  const rows = parseCsvRows(text.replace(/^﻿/, ''));
  if (!rows.length) throw new Error('The CSV file is empty.');
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = header.includes('name');
  const nameCol = hasHeader ? header.indexOf('name') : 0;
  const raterCols = hasHeader
    ? header.map((h, i) => [raterFor(h), i] as const).filter((x): x is readonly [string, number] => !!x[0])
    : RATERS.map((r, i) => [r.id, i + 1] as const);
  const start = hasHeader ? 1 : 0;
  return collect(
    rows.slice(start).map((row, i) => ({
      name: row[nameCol],
      ratings: Object.fromEntries(raterCols.map(([id, col]) => [id, row[col]])),
      where: `Row ${i + start + 1}`,
    })),
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
 * (case-insensitive) get the imported ratings (empty cells never wipe an
 * existing rating); new names are added.
 */
export function mergePlayers(existing: Player[], imported: ImportedPlayer[]): Player[] {
  const result = existing.map((p) => ({ ...p }));
  const byName = new Map(result.map((p, i) => [normalizeName(p.name), i]));
  for (const imp of imported) {
    const i = byName.get(normalizeName(imp.name));
    if (i === undefined) {
      result.push(makePlayer(newId(), imp.name, imp.ratings));
      continue;
    }
    const merged = { ...result[i].ratings };
    for (const r of RATERS) if (imp.ratings[r.id] != null) merged[r.id] = imp.ratings[r.id];
    result[i] = makePlayer(result[i].id, result[i].name, cleanRatings(merged));
  }
  return result;
}

export function replacePlayers(imported: ImportedPlayer[]): Player[] {
  return imported.map((p) => makePlayer(newId(), p.name, p.ratings));
}
