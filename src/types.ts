export interface Player {
  id: string;
  name: string;
  /** null = not ranked yet (e.g. imported without a rank). Unranked players cannot join a game. */
  rank: number | null;
}

export type RankedPlayer = Player & { rank: number };

export function isRanked(p: Player): p is RankedPlayer {
  return p.rank !== null;
}

export interface Team {
  name: string;
  players: RankedPlayer[];
  strength: number;
}

export interface TeamResult {
  teams: Team[];
  /** Strongest team total minus weakest team total. */
  strengthDifference: number;
  averageStrength: number;
  /** Canonical description of the arrangement, used to avoid repeating it on regenerate. */
  signature: string;
  seed: number;
}
