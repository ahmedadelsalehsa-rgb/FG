export interface Player {
  id: string;
  name: string;
  rank: number;
}

export interface Team {
  name: string;
  players: Player[];
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
