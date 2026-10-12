import { RANK_OPTIONS } from '../config';
import { formatRank } from '../utils/ratings';

const MIN = RANK_OPTIONS[0];
const MAX = RANK_OPTIONS[RANK_OPTIONS.length - 1];

/** 0 for the strongest rank … 1 for the weakest, used to shade the badge. Works for averaged ranks too. */
function rankPosition(rank: number): number {
  return Math.min(1, Math.max(0, (rank - MIN) / Math.max(1, MAX - MIN)));
}

export function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) {
    return (
      <span className="rank-badge unranked" title="No rank yet" aria-label="No rank yet">
        ?
      </span>
    );
  }
  const strength = Math.round(100 - rankPosition(rank) * 88); // 100% → 12% pitch green
  const label = formatRank(rank);
  return (
    <span
      className={`rank-badge${label.length > 2 ? ' rank-badge-wide' : ''}`}
      style={{
        background: `color-mix(in srgb, var(--solid) ${strength}%, var(--badge-base))`,
        color: strength > 50 ? 'var(--white)' : 'var(--text)',
      }}
      title={`Rank ${label}`}
      aria-label={`Rank ${label}`}
    >
      {label}
    </span>
  );
}
