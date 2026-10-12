/** One rank (1 = strongest) per rater id; null = that rater has not rated the player yet. */
export type Ratings = Record<string, number | null>;

export interface Player {
  id: string;
  name: string;
  ratings: Ratings;
  /**
   * Average of the ratings given so far — always derived from `ratings`, never
   * edited directly. null = nobody has rated the player yet; such a player
   * cannot join a game.
   */
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
