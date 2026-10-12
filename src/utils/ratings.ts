import { RANK_OPTIONS, RATERS } from '../config';
import type { Player, Ratings } from '../types';

export function isValidRank(rank: unknown): rank is number {
  return typeof rank === 'number' && RANK_OPTIONS.includes(rank);
}

/** Keeps only known raters with valid ranks; every rater gets a key (null = not rated yet). */
export function cleanRatings(value: unknown): Ratings {
  const src = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const out: Ratings = {};
  for (const r of RATERS) out[r.id] = isValidRank(src[r.id]) ? (src[r.id] as number) : null;
  return out;
}

export function emptyRatings(): Ratings {
  return cleanRatings({});
}

/** Average of the ratings given so far (rounded to 2 decimals), or null when nobody rated the player. */
export function averageRank(ratings: Ratings): number | null {
  const given = RATERS.map((r) => ratings[r.id]).filter((v): v is number => typeof v === 'number');
  if (!given.length) return null;
  return Math.round((given.reduce((a, b) => a + b, 0) / given.length) * 100) / 100;
}

export function ratingCount(ratings: Ratings): number {
  return RATERS.filter((r) => typeof ratings[r.id] === 'number').length;
}

export function makePlayer(id: string, name: string, ratings: Ratings): Player {
  const clean = cleanRatings(ratings);
  return { id, name, ratings: clean, rank: averageRank(clean) };
}

/** "2", "2.5", "2.33" — compact display of an averaged rank. */
export function formatRank(rank: number): string {
  return String(Math.round(rank * 100) / 100);
}
