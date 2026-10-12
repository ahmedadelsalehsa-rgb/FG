import { describe, expect, it } from 'vitest';
import { rankToScore } from '../config';
import type { RankedPlayer as Player, TeamResult } from '../types';
import { createRng, shuffled } from './random';
import { balanceTeams, summarizeFairness, teamSizes, teamStrength } from './teamBalancer';

function makePlayers(ranks: number[], prefix = 'P'): Player[] {
  return ranks.map((rank, i) => ({ id: `${prefix}${i + 1}`, name: `${prefix}${i + 1}`, ratings: {}, rank }));
}

function rankCounts(result: TeamResult, rank: number): number[] {
  return result.teams.map((t) => t.players.filter((p) => Math.round(p.rank) === rank).length);
}

function sizes(result: TeamResult): number[] {
  return result.teams.map((t) => t.players.length).sort((a, b) => b - a);
}

/** Every input player appears exactly once, and nobody else appears. */
function expectExactlyOnce(result: TeamResult, players: Player[]) {
  const ids = result.teams.flatMap((t) => t.players.map((p) => p.id));
  expect(ids.length).toBe(players.length);
  expect(new Set(ids).size).toBe(players.length);
  expect([...ids].sort()).toEqual(players.map((p) => p.id).sort());
}

/** Each rank group (up to `upToRank`) is spread with at most one player difference between teams. */
function expectEvenRankSpread(result: TeamResult, players: Player[], upToRank = Infinity) {
  for (const rank of new Set(players.map((p) => p.rank))) {
    if (rank > upToRank) continue;
    const counts = rankCounts(result, rank);
    expect(Math.max(...counts) - Math.min(...counts), `rank ${rank} spread ${counts}`).toBeLessThanOrEqual(1);
  }
}

const spreadOf = (teams: Player[][]) => {
  const s = teams.map((t) => teamStrength(t));
  return Math.max(...s) - Math.min(...s);
};

/** Baseline 1: shuffle and deal players into size-balanced teams. */
function randomAllocation(players: Player[], k: number, seed: number): Player[][] {
  const order = shuffled(players, createRng(seed));
  const teams: Player[][] = Array.from({ length: k }, () => []);
  order.forEach((p, i) => teams[i % k].push(p));
  return teams;
}

/** Baseline 2: naive greedy "pick in order" — sort strongest first, deal A, B, C, A, B, C … */
function naiveRoundRobin(players: Player[], k: number): Player[][] {
  const order = [...players].sort((a, b) => a.rank - b.rank);
  const teams: Player[][] = Array.from({ length: k }, () => []);
  order.forEach((p, i) => teams[i % k].push(p));
  return teams;
}

describe('teamSizes', () => {
  it('distributes extra players as evenly as possible', () => {
    expect(teamSizes(10, 3)).toEqual([4, 3, 3]);
    expect(teamSizes(12, 3)).toEqual([4, 4, 4]);
    expect(teamSizes(11, 4)).toEqual([3, 3, 3, 2]);
  });
});

describe('balanceTeams — acceptance scenarios', () => {
  it('9 players / 3 teams with three rank-1 players → one rank-1 player per team', () => {
    const players = makePlayers([1, 1, 1, 2, 4, 5, 6, 8, 9]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(rankCounts(result, 1)).toEqual([1, 1, 1]);
    expect(sizes(result)).toEqual([3, 3, 3]);
  });

  it('spreads several rank-2 and rank-3 players fairly', () => {
    const players = makePlayers([1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 5, 7, 8]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(rankCounts(result, 2)).toEqual([2, 2, 2]);
    expect(Math.max(...rankCounts(result, 3)) - Math.min(...rankCounts(result, 3))).toBeLessThanOrEqual(1);
    expectEvenRankSpread(result, players);
  });

  it('10 players / 3 teams → sizes 4, 3, 3', () => {
    const players = makePlayers([1, 2, 3, 3, 4, 5, 6, 7, 8, 10]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(sizes(result)).toEqual([4, 3, 3]);
  });

  it('12 players / 3 teams → sizes 4, 4, 4', () => {
    const players = makePlayers([1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(sizes(result)).toEqual([4, 4, 4]);
  });

  it('only the selected subset of saved players appears in the result', () => {
    const saved = makePlayers([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9]);
    const selected = saved.filter((_, i) => i % 2 === 0); // 8 of 15
    const result = balanceTeams(selected, 2);
    expectExactlyOnce(result, selected);
    const outIds = new Set(result.teams.flatMap((t) => t.players.map((p) => p.id)));
    for (const p of saved) expect(outIds.has(p.id)).toBe(selected.includes(p));
  });

  it('fewer rank-1 players than teams → each goes to a different team', () => {
    const players = makePlayers([1, 1, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 9, 10]);
    const result = balanceTeams(players, 4);
    expectExactlyOnce(result, players);
    expect(rankCounts(result, 1).filter((c) => c > 0)).toEqual([1, 1]);
  });

  it('more rank-1 players than teams → spread as evenly as possible', () => {
    const players = makePlayers([1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect([...rankCounts(result, 1)].sort()).toEqual([1, 2, 2]);
  });

  it('handles uneven rank distributions', () => {
    const players = makePlayers([1, 4, 4, 4, 4, 4, 4, 4, 9, 9, 10, 10, 10, 2]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expectEvenRankSpread(result, players);
    expect(sizes(result)).toEqual([5, 5, 4]);
    expect(result.strengthDifference).toBeLessThanOrEqual(20);
  });

  it('all players with the same rank → equal strength, even sizes', () => {
    const players = makePlayers(Array(11).fill(5));
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(sizes(result)).toEqual([4, 4, 3]);
    // With equal ranks the only difference comes from the extra player.
    expect(result.strengthDifference).toBe(rankToScore(5));
  });

  it('with uneven sizes, the bigger team gets weaker players so strengths stay close', () => {
    const players = makePlayers([1, 1, 1, 3, 3, 3, 6, 6, 6, 10]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    const big = result.teams.find((t) => t.players.length === 4)!;
    expect(big.players.some((p) => p.rank === 10)).toBe(true);
    expect(result.strengthDifference).toBeLessThanOrEqual(10);
  });

  it('changing a player rank changes subsequent results', () => {
    const players = makePlayers([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const before = balanceTeams(players, 3);
    const changed = players.map((p) => (p.id === 'P9' ? { ...p, rank: 1 } : p));
    const after = balanceTeams(changed, 3);
    expectExactlyOnce(after, changed);
    expect(rankCounts(after, 1).sort()).toEqual([0, 1, 1]);
    expect(after.signature).not.toBe(before.signature);
    const p9Team = after.teams.find((t) => t.players.some((p) => p.id === 'P9'))!;
    expect(p9Team.players.some((p) => p.id === 'P1')).toBe(false);
  });

  it('works for every supported team count with no duplicates or missing players', () => {
    const rng = createRng(42);
    for (let k = 2; k <= 5; k++) {
      for (let n = k * 2; n <= 30; n += 3) {
        const players = makePlayers(Array.from({ length: n }, () => 1 + Math.floor(rng() * 10)), `T${k}-${n}-`);
        const result = balanceTeams(players, k);
        expect(result.teams).toHaveLength(k);
        expectExactlyOnce(result, players);
        const s = sizes(result);
        expect(s[0] - s[s.length - 1]).toBeLessThanOrEqual(1);
        // Strong rank groups are always spread evenly; weaker groups may be bent
        // only when that buys a clearly smaller strength gap.
        expectEvenRankSpread(result, players, 3);
      }
    }
  });

  it('handles an empty selection and invalid team counts', () => {
    expect(balanceTeams([], 3).teams.every((t) => t.players.length === 0)).toBe(true);
    expect(() => balanceTeams(makePlayers([1, 2]), 0)).toThrow();
    const p = makePlayers([1, 2]);
    expect(() => balanceTeams([p[0], p[0]], 2)).toThrow();
  });
});

describe('balanceTeams — determinism and regeneration', () => {
  const players = makePlayers([1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9]);

  it('is deterministic for the same input and seed', () => {
    expect(balanceTeams(players, 3, { seed: 7 }).signature).toBe(balanceTeams(players, 3, { seed: 7 }).signature);
  });

  it('regeneration gives a different, still fair arrangement with the same players', () => {
    const first = balanceTeams(players, 3);
    let previous = first;
    for (let seed = 2; seed < 8; seed++) {
      const next = balanceTeams(players, 3, { seed, avoidSignature: previous.signature });
      expect(next.signature).not.toBe(previous.signature);
      expectExactlyOnce(next, players);
      expect(rankCounts(next, 1)).toEqual([1, 1, 1]);
      expect(next.strengthDifference).toBeLessThanOrEqual(first.strengthDifference + 10);
      previous = next;
    }
  });
});

describe('balanceTeams vs naive allocations', () => {
  it('is at least as fair as random and round-robin allocation, and far better on average', () => {
    const rng = createRng(2024);
    let oursTotal = 0;
    let randomTotal = 0;
    let naiveTotal = 0;
    let bestRandomTotal = 0;
    const trials = 40;
    for (let trial = 0; trial < trials; trial++) {
      const k = 2 + (trial % 4);
      const n = k * 3 + (trial % 5);
      const players = makePlayers(Array.from({ length: n }, () => 1 + Math.floor(rng() * 10)), `R${trial}-`);
      const ours = balanceTeams(players, k).strengthDifference;
      const naive = spreadOf(naiveRoundRobin(players, k));
      const randoms = Array.from({ length: 20 }, (_, s) => spreadOf(randomAllocation(players, k, trial * 100 + s)));
      const bestRandom = Math.min(...randoms);
      const avgRandom = randoms.reduce((a, b) => a + b, 0) / randoms.length;

      expect(ours).toBeLessThanOrEqual(naive + 1e-9);
      expect(ours).toBeLessThanOrEqual(avgRandom);

      oursTotal += ours;
      bestRandomTotal += bestRandom;
      randomTotal += avgRandom;
      naiveTotal += naive;
    }
    // Report so the improvement is visible in the test output.
    console.info(
      `Average strength gap over ${trials} scenarios — optimised: ${(oursTotal / trials).toFixed(1)}, ` +
        `naive round-robin: ${(naiveTotal / trials).toFixed(1)}, ` +
        `random: ${(randomTotal / trials).toFixed(1)}, best of 20 random: ${(bestRandomTotal / trials).toFixed(1)}`,
    );
    expect(oursTotal).toBeLessThan(naiveTotal * 0.5);
    expect(oursTotal).toBeLessThan(randomTotal * 0.25);
    // Even cherry-picking the best of 20 shuffles per scenario is not better on average.
    expect(oursTotal).toBeLessThanOrEqual(bestRandomTotal);
  });

  it('a lucky shuffle can stack the strongest players; the balancer never does', () => {
    const players = makePlayers([1, 1, 1, 5, 5, 5, 9, 9, 9]);
    // Deal the three rank-1 players to the same team — what an unlucky shuffle can produce.
    const stacked = [players.slice(0, 3), players.slice(3, 6), players.slice(6, 9)];
    expect(spreadOf(stacked)).toBeGreaterThan(100);
    const result = balanceTeams(players, 3);
    expect(result.strengthDifference).toBe(0);
    expect(rankCounts(result, 1)).toEqual([1, 1, 1]);
  });
});

describe('averaged (fractional) ranks', () => {
  it('spreads players by their nearest whole rank and balances exact strength', () => {
    const players = makePlayers([1, 1.33, 0.67 + 0.33, 2.5, 2.67, 3, 4.33, 5, 5.5, 7, 8.67, 9]);
    const result = balanceTeams(players, 3);
    expectExactlyOnce(result, players);
    expect(rankCounts(result, 1)).toEqual([1, 1, 1]);
    expect(result.strengthDifference).toBeLessThanOrEqual(15);
  });
});

describe('summarizeFairness', () => {
  it('labels perfectly balanced teams', () => {
    const result = balanceTeams(makePlayers([1, 1, 2, 2]), 2);
    const summary = summarizeFairness(result);
    expect(summary.level).toBe('excellent');
    expect(summary.message).toMatch(/same estimated strength/);
  });
});

describe('performance', () => {
  it('balances a large squad quickly', () => {
    const rng = createRng(9);
    const players = makePlayers(Array.from({ length: 60 }, () => 1 + Math.floor(rng() * 10)));
    const start = performance.now();
    const result = balanceTeams(players, 5);
    expectExactlyOnce(result, players);
    expect(performance.now() - start).toBeLessThan(2000);
  });
});
