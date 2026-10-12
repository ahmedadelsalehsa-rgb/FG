import { RANK_OPTIONS } from '../config';

/** 0 for the strongest rank … 1 for the weakest, used to shade the badge. */
function rankPosition(rank: number): number {
  const pos = RANK_OPTIONS.indexOf(rank);
  return (pos < 0 ? RANK_OPTIONS.length - 1 : pos) / Math.max(1, RANK_OPTIONS.length - 1);
}

export function RankBadge({ rank }: { rank: number }) {
  const strength = Math.round(100 - rankPosition(rank) * 88); // 100% → 12% pitch green
  return (
    <span
      className="rank-badge"
      style={{
        background: `color-mix(in srgb, var(--solid) ${strength}%, var(--badge-base))`,
        color: strength > 50 ? 'var(--white)' : 'var(--text)',
      }}
      title={`Rank ${rank}`}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
}
