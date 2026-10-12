/**
 * Fair team balancing.
 *
 * Goal: split the selected players into `teamCount` teams so that
 *   1. team sizes differ by at most one player (hard constraint),
 *   2. the estimated strength of the teams is as equal as possible, and
 *   3. every rank group (all rank-1 players, all rank-2 players, …) is spread
 *      as evenly as possible, e.g. three rank-1 players over three teams → one each.
 *
 * Approach (deterministic for a given seed, no external services):
 *   - Every player gets a strength score from `rankToScore` (config.ts).
 *   - Several starting arrangements are built: a "snake draft" over the players
 *     sorted strongest-first, a greedy "give the next-best player to the
 *     currently weakest team" allocation, and a few randomised variants
 *     (ties between equal ranks are broken by a seeded shuffle).
 *   - Each start is improved by local search: swapping two players between
 *     teams, or moving a player from a bigger team to a smaller one (which keeps
 *     the sizes balanced but changes which teams get the extra player). The best
 *     improving step is applied until no step improves the cost.
 *   - The arrangement with the lowest cost wins.
 *
 * Cost (lower is better):
 *     (strongest total − weakest total)
 *   + deviationWeight × standard deviation of team totals
 *   + Σ over rank groups of  rankSpreadWeight × score(rank) × (players beyond an even spread)
 *
 * "Even spread" for a rank group with c players over k teams means each team
 * has floor(c/k) or ceil(c/k) of them. The penalty is scaled by the rank's
 * score, so spreading strong players matters more than spreading weak ones.
 */
import { BALANCER_SETTINGS, rankToScore, StrengthScale, STRENGTH_SCALE } from '../config';
import type { Player, Team, TeamResult } from '../types';
import { createRng, shuffled } from './random';

export interface BalanceOptions {
  /** Seed for tie-breaking and randomised starts. Same input + seed → same result. */
  seed?: number;
  /** Signature of an arrangement to avoid (used by "Regenerate Teams"). */
  avoidSignature?: string;
  scale?: StrengthScale;
  restarts?: number;
}

export const DEFAULT_SEED = 1;

export function teamLabel(index: number): string {
  return `Team ${String.fromCharCode(65 + index)}`;
}

/** Sizes of each team when `playerCount` players are split into `teamCount` teams. */
export function teamSizes(playerCount: number, teamCount: number): number[] {
  const base = Math.floor(playerCount / teamCount);
  const extra = playerCount % teamCount;
  return Array.from({ length: teamCount }, (_, i) => base + (i < extra ? 1 : 0));
}

/** Order-independent description of an arrangement (team labels and player order do not matter). */
export function arrangementSignature(teams: readonly (readonly Player[])[]): string {
  return teams
    .map((t) => t.map((p) => p.id).sort().join(','))
    .sort()
    .join('|');
}

/** Sum of strength scores. */
export function teamStrength(players: readonly Player[], scale: StrengthScale = STRENGTH_SCALE): number {
  return players.reduce((sum, p) => sum + rankToScore(p.rank, scale), 0);
}

interface Problem {
  n: number;
  k: number;
  scores: number[];
  group: number[]; // rank-group index per player
  groupSize: number[];
  groupWeight: number[];
  maxSize: number; // base + 1 (only relevant when there is a remainder)
  baseSize: number;
}

interface State {
  team: number[]; // team index per player
  totals: number[];
  sizes: number[];
  counts: number[][]; // counts[team][group]
}

function buildProblem(players: readonly Player[], k: number, scale: StrengthScale): Problem {
  const ranks = [...new Set(players.map((p) => p.rank))].sort((a, b) => a - b);
  const groupOf = new Map(ranks.map((r, i) => [r, i]));
  const group = players.map((p) => groupOf.get(p.rank)!);
  const groupSize = ranks.map(() => 0);
  group.forEach((g) => groupSize[g]++);
  return {
    n: players.length,
    k,
    scores: players.map((p) => rankToScore(p.rank, scale)),
    group,
    groupSize,
    groupWeight: ranks.map((r) => rankToScore(r, scale) * BALANCER_SETTINGS.rankSpreadWeight),
    baseSize: Math.floor(players.length / k),
    maxSize: Math.ceil(players.length / k),
  };
}

function makeState(pb: Problem, team: number[]): State {
  const totals = new Array(pb.k).fill(0);
  const sizes = new Array(pb.k).fill(0);
  const counts = Array.from({ length: pb.k }, () => new Array(pb.groupSize.length).fill(0));
  team.forEach((t, i) => {
    totals[t] += pb.scores[i];
    sizes[t]++;
    counts[t][pb.group[i]]++;
  });
  return { team, totals, sizes, counts };
}

function strengthCost(totals: number[]): number {
  let max = -Infinity;
  let min = Infinity;
  let sum = 0;
  for (const t of totals) {
    if (t > max) max = t;
    if (t < min) min = t;
    sum += t;
  }
  const mean = sum / totals.length;
  let sq = 0;
  for (const t of totals) sq += (t - mean) * (t - mean);
  return max - min + BALANCER_SETTINGS.deviationWeight * Math.sqrt(sq / totals.length);
}

function groupPenalty(pb: Problem, st: State, g: number): number {
  const lo = Math.floor(pb.groupSize[g] / pb.k);
  const hi = Math.ceil(pb.groupSize[g] / pb.k);
  let excess = 0;
  for (let t = 0; t < pb.k; t++) {
    const c = st.counts[t][g];
    if (c > hi) excess += c - hi;
    else if (c < lo) excess += lo - c;
  }
  return excess * pb.groupWeight[g];
}

function totalRankPenalty(pb: Problem, st: State): number {
  let sum = 0;
  for (let g = 0; g < pb.groupSize.length; g++) sum += groupPenalty(pb, st, g);
  return sum;
}

function cost(pb: Problem, st: State): number {
  return strengthCost(st.totals) + totalRankPenalty(pb, st);
}

/** Move player i to team `to`, updating the incremental state. */
function move(pb: Problem, st: State, i: number, to: number): void {
  const from = st.team[i];
  st.totals[from] -= pb.scores[i];
  st.totals[to] += pb.scores[i];
  st.sizes[from]--;
  st.sizes[to]++;
  st.counts[from][pb.group[i]]--;
  st.counts[to][pb.group[i]]++;
  st.team[i] = to;
}

/**
 * Best-improvement local search over single swaps and size-preserving moves.
 * Each step evaluates cost changes incrementally (only the affected rank groups
 * are re-scored), so a full search stays fast even for large squads.
 */
function improve(pb: Problem, st: State): number {
  const EPS = 1e-9;
  let current = cost(pb, st);
  let rankPen = totalRankPenalty(pb, st);
  const maxSteps = pb.n * pb.n + 10;

  for (let step = 0; step < maxSteps; step++) {
    let bestCost = current - EPS;
    let bestOp: [number, number] | null = null; // [i, j] swap, or [i, -1 - team] move

    for (let i = 0; i < pb.n; i++) {
      const a = st.team[i];
      const gi = pb.group[i];

      // Swaps
      for (let j = i + 1; j < pb.n; j++) {
        const b = st.team[j];
        if (a === b) continue;
        const gj = pb.group[j];
        if (gi === gj) continue; // same rank → identical cost
        const before = groupPenalty(pb, st, gi) + groupPenalty(pb, st, gj);
        move(pb, st, i, b);
        move(pb, st, j, a);
        const after = groupPenalty(pb, st, gi) + groupPenalty(pb, st, gj);
        const c = strengthCost(st.totals) + rankPen - before + after;
        move(pb, st, j, b);
        move(pb, st, i, a);
        if (c < bestCost) {
          bestCost = c;
          bestOp = [i, j];
        }
      }

      // Moves from a bigger team to a smaller one (keeps sizes within one of each other)
      if (st.sizes[a] === pb.maxSize && pb.maxSize > pb.baseSize) {
        for (let b = 0; b < pb.k; b++) {
          if (b === a || st.sizes[b] !== pb.baseSize) continue;
          const before = groupPenalty(pb, st, gi);
          move(pb, st, i, b);
          const after = groupPenalty(pb, st, gi);
          const c = strengthCost(st.totals) + rankPen - before + after;
          move(pb, st, i, a);
          if (c < bestCost) {
            bestCost = c;
            bestOp = [i, -1 - b];
          }
        }
      }
    }

    if (!bestOp) break;
    const [i, j] = bestOp;
    if (j >= 0) {
      const a = st.team[i];
      move(pb, st, i, st.team[j]);
      move(pb, st, j, a);
    } else {
      move(pb, st, i, -1 - j);
    }
    rankPen = totalRankPenalty(pb, st);
    current = cost(pb, st);
  }
  return current;
}

/** Players sorted strongest-first; equal scores are ordered by a seeded shuffle. */
function strongestFirst(pb: Problem, rng: () => number): number[] {
  const order = shuffled(
    Array.from({ length: pb.n }, (_, i) => i),
    rng,
  );
  return order.sort((x, y) => pb.scores[y] - pb.scores[x]);
}

/** Snake draft: A B C C B A A B C … over the strongest-first order. */
function snakeStart(pb: Problem, rng: () => number): number[] {
  const team = new Array(pb.n).fill(0);
  const teamOrder = shuffled(
    Array.from({ length: pb.k }, (_, i) => i),
    rng,
  );
  strongestFirst(pb, rng).forEach((p, pos) => {
    const round = Math.floor(pos / pb.k);
    const idx = pos % pb.k;
    team[p] = teamOrder[round % 2 === 0 ? idx : pb.k - 1 - idx];
  });
  return team;
}

/** Greedy: each next-strongest player joins the weakest team that still has room. */
function greedyStart(pb: Problem, rng: () => number): number[] {
  const team = new Array(pb.n).fill(0);
  const totals = new Array(pb.k).fill(0);
  const sizes = new Array(pb.k).fill(0);
  const extra = pb.n % pb.k;
  const tieBreak = shuffled(
    Array.from({ length: pb.k }, (_, i) => i),
    rng,
  );
  for (const p of strongestFirst(pb, rng)) {
    const full = sizes.filter((s) => s === pb.maxSize).length;
    let best = -1;
    for (const t of tieBreak) {
      const room = sizes[t] < pb.baseSize || (sizes[t] === pb.baseSize && extra > 0 && full < extra);
      if (!room) continue;
      if (
        best === -1 ||
        totals[t] < totals[best] ||
        (totals[t] === totals[best] && sizes[t] < sizes[best])
      ) {
        best = t;
      }
    }
    team[p] = best;
    totals[best] += pb.scores[p];
    sizes[best]++;
  }
  return team;
}

/** Fully random but size-balanced start, to diversify the search. */
function randomStart(pb: Problem, rng: () => number): number[] {
  const team = new Array(pb.n).fill(0);
  const sizes = shuffled(teamSizes(pb.n, pb.k), rng);
  const slots: number[] = [];
  sizes.forEach((s, t) => {
    for (let x = 0; x < s; x++) slots.push(t);
  });
  shuffled(slots, rng).forEach((t, i) => (team[i] = t));
  return team;
}

/**
 * Re-deals players *within* each rank group across the slots that group occupies.
 * Cost is unchanged (same ranks per team), but the names differ — used to offer
 * an alternative, equally fair arrangement when regenerating.
 */
function shuffleWithinRanks(pb: Problem, team: number[], rng: () => number): number[] {
  const out = team.slice();
  for (let g = 0; g < pb.groupSize.length; g++) {
    const members = out.map((_, i) => i).filter((i) => pb.group[i] === g);
    const slots = shuffled(
      members.map((i) => team[i]),
      rng,
    );
    members.forEach((i, x) => (out[i] = slots[x]));
  }
  return out;
}

function toResult(players: readonly Player[], k: number, team: number[], seed: number, scale: StrengthScale): TeamResult {
  const groups: Player[][] = Array.from({ length: k }, () => []);
  team.forEach((t, i) => groups[t].push(players[i]));
  // Present bigger teams first, then stronger teams, for a stable, readable layout.
  const ordered = groups
    .map((ps) => ({ ps, strength: teamStrength(ps, scale) }))
    .sort((x, y) => y.ps.length - x.ps.length || y.strength - x.strength);
  const teams: Team[] = ordered.map(({ ps, strength }, i) => ({
    name: teamLabel(i),
    players: ps.slice().sort((x, y) => x.rank - y.rank || x.name.localeCompare(y.name)),
    strength,
  }));
  const strengths = teams.map((t) => t.strength);
  const total = strengths.reduce((a, b) => a + b, 0);
  return {
    teams,
    strengthDifference: teams.length ? Math.max(...strengths) - Math.min(...strengths) : 0,
    averageStrength: teams.length ? total / teams.length : 0,
    signature: arrangementSignature(teams.map((t) => t.players)),
    seed,
  };
}

/**
 * Split `players` into `teamCount` balanced teams.
 * Every player appears in exactly one team.
 */
export function balanceTeams(players: readonly Player[], teamCount: number, options: BalanceOptions = {}): TeamResult {
  if (!Number.isInteger(teamCount) || teamCount < 1) {
    throw new Error('Number of teams must be a positive whole number.');
  }
  const ids = new Set(players.map((p) => p.id));
  if (ids.size !== players.length) {
    throw new Error('Each player can only be selected once.');
  }

  const seed = options.seed ?? DEFAULT_SEED;
  const scale = options.scale ?? STRENGTH_SCALE;
  const restarts = Math.max(2, options.restarts ?? BALANCER_SETTINGS.restarts);
  const rng = createRng(seed);
  const pb = buildProblem(players, teamCount, scale);

  if (pb.n === 0) return toResult(players, teamCount, [], seed, scale);

  // Build and improve several starting arrangements; keep the distinct results.
  const found = new Map<string, { team: number[]; cost: number }>();
  for (let r = 0; r < restarts; r++) {
    const start =
      r % 3 === 0 ? snakeStart(pb, rng) : r % 3 === 1 ? greedyStart(pb, rng) : randomStart(pb, rng);
    const st = makeState(pb, start);
    const c = improve(pb, st);
    const sig = signatureOf(players, pb.k, st.team);
    const prev = found.get(sig);
    if (!prev || c < prev.cost) found.set(sig, { team: st.team.slice(), cost: c });
  }

  const candidates = [...found.entries()]
    .map(([sig, v]) => ({ sig, ...v }))
    .sort((x, y) => x.cost - y.cost);
  const bestCost = candidates[0].cost;

  if (!options.avoidSignature) {
    return toResult(players, teamCount, candidates[0].team, seed, scale);
  }

  // Regenerating: choose a different arrangement that is (almost) as fair as the best.
  const tolerance = BALANCER_SETTINGS.regenerateTolerance + 1e-9;
  const pool = candidates.filter((c) => c.cost <= bestCost + tolerance);
  for (let attempt = 0; attempt < 12; attempt++) {
    const pick = pool[Math.floor(rng() * pool.length)];
    const team = shuffleWithinRanks(pb, pick.team, rng);
    if (signatureOf(players, pb.k, team) !== options.avoidSignature) {
      return toResult(players, teamCount, team, seed, scale);
    }
  }
  // No equally fair alternative exists: fall back to the next-best different arrangement.
  const alternative = candidates.find((c) => c.sig !== options.avoidSignature);
  return toResult(players, teamCount, (alternative ?? candidates[0]).team, seed, scale);
}

function signatureOf(players: readonly Player[], k: number, team: number[]): string {
  const groups: Player[][] = Array.from({ length: k }, () => []);
  team.forEach((t, i) => groups[t].push(players[i]));
  return arrangementSignature(groups);
}

export type FairnessLevel = 'excellent' | 'good' | 'fair' | 'uneven';

export interface FairnessSummary {
  level: FairnessLevel;
  label: string;
  /** Difference between strongest and weakest team as a % of the average team strength. */
  percentOfAverage: number;
  message: string;
}

export function summarizeFairness(result: TeamResult): FairnessSummary {
  const pct = result.averageStrength > 0 ? (result.strengthDifference / result.averageStrength) * 100 : 0;
  const diff = formatStrength(result.strengthDifference);
  if (pct <= 5) {
    return {
      level: 'excellent',
      label: 'Very balanced',
      percentOfAverage: pct,
      message:
        result.strengthDifference < 1e-9
          ? 'All teams have exactly the same estimated strength.'
          : `The strongest and weakest teams differ by only ${diff} points (${pct.toFixed(1)}% of an average team).`,
    };
  }
  if (pct <= 10) {
    return {
      level: 'good',
      label: 'Balanced',
      percentOfAverage: pct,
      message: `The strongest and weakest teams differ by ${diff} points (${pct.toFixed(1)}% of an average team).`,
    };
  }
  if (pct <= 20) {
    return {
      level: 'fair',
      label: 'Fairly balanced',
      percentOfAverage: pct,
      message: `The strongest and weakest teams differ by ${diff} points (${pct.toFixed(1)}%). This is the closest split found that still spreads players of each rank across the teams.`,
    };
  }
  return {
    level: 'uneven',
    label: 'Hard to balance',
    percentOfAverage: pct,
    message: `The strongest and weakest teams differ by ${diff} points (${pct.toFixed(1)}%). This is the closest split found that still spreads each rank group — try a different number of teams for a closer split.`,
  };
}

export function formatStrength(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
