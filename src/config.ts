/**
 * Central configuration for the Fair Football Team Generator.
 *
 * Everything that is likely to be tuned later (rank options, the rank → strength
 * mapping, team-count options, balancing weights) lives here so it can be
 * changed in one place.
 */

/** Ranks each rater can give a player. 1 = strongest. */
export const RANK_OPTIONS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * The people who rate every player. Each gets their own column of rank
 * dropdowns; a player's Rank is the average of the ratings given so far.
 * `id` is the storage key — keep it stable when renaming `name`.
 */
export const RATERS: readonly { id: string; name: string }[] = [
  { id: 'adel', name: 'Adel' },
  { id: 'koshiry', name: 'Koshiry' },
  { id: 'abdelfattah', name: 'Abdelfattah' },
];

/** Team-count options offered in the Sort Teams workflow. */
export const TEAM_COUNT_OPTIONS: readonly number[] = [2, 3, 4, 5];
export const DEFAULT_TEAM_COUNT = 3;

/** Fewer selected players than `teamCount * MIN_PLAYERS_PER_TEAM` blocks generation. */
export const MIN_PLAYERS_PER_TEAM = 2;

/**
 * Rank → strength score mappings.
 *
 * Assumptions:
 *  - Rank 1 is the strongest player and always gets the highest score.
 *  - Scores only matter relative to each other; totals are compared between teams.
 *
 *  - Ranks may be fractional (an average of several ratings, e.g. 2.33); every
 *    mapping below is continuous, so 2.33 scores between 2 and 3.
 *
 * `linear` (default): score = 10 × (maxRank + 1 − rank) → 100, 90, 80 … 10.
 *   Every rank step is worth the same, which matches how most organisers think
 *   about a 1–10 rating ("one level better"). It keeps weaker players relevant:
 *   two rank-6 players (2 × 50) equal one rank-1 player (100).
 *
 * `inverse`: score = 100 / rank → 100, 50, 33.3, 25 … 10.
 *   Very steep at the top (rank 1 is worth double rank 2) and almost flat at the
 *   bottom (rank 9 vs 10 differs by 1.1). It over-emphasises the single best
 *   player, so it is offered as an option rather than the default.
 *
 * `gentle`: score = 100 × 0.85^(rank − 1) → 100, 85, 72 … 23.
 *   A middle ground: the top of the scale counts a bit more than the bottom.
 */
export type StrengthScale = 'linear' | 'inverse' | 'gentle';

export const STRENGTH_SCALE: StrengthScale = 'linear';

const MAX_RANK = Math.max(...RANK_OPTIONS);

export function rankToScore(rank: number, scale: StrengthScale = STRENGTH_SCALE): number {
  const r = Math.min(Math.max(1, rank), MAX_RANK);
  switch (scale) {
    case 'inverse':
      return 100 / r;
    case 'gentle':
      return 100 * Math.pow(0.85, r - 1);
    case 'linear':
    default:
      return 10 * (MAX_RANK + 1 - r);
  }
}

/** Tuning knobs for the balancing algorithm (see utils/teamBalancer.ts). */
export const BALANCER_SETTINGS = {
  /** Number of starting arrangements that are each improved by local search. */
  restarts: 24,
  /**
   * Penalty per player that breaks the "even spread" of a rank group, expressed
   * as a fraction of that rank's score. With 1.0, a rank group is only split
   * unevenly when doing so narrows the strength gap by more than that player's
   * own score — e.g. two rank-1 players are never stacked to save a few points,
   * while two rank-10 players may share a team if that removes a large gap.
   * Higher values enforce rank spreading more strictly at the cost of a slightly
   * larger strength gap; lower values do the opposite.
   */
  rankSpreadWeight: 1,
  /** Small weight on the standard deviation of team totals (tie-breaker for 3+ teams). */
  deviationWeight: 0.25,
  /**
   * When regenerating, any arrangement whose cost is within this many points of
   * the best arrangement found counts as "equally fair" and may be shown.
   */
  regenerateTolerance: 2,
} as const;
