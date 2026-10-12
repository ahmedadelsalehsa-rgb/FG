import { useId, useMemo, useState } from 'react';
import { MIN_PLAYERS_PER_TEAM, TEAM_COUNT_OPTIONS } from '../config';
import { isRanked, type Player } from '../types';
import { teamSizes } from '../utils/teamBalancer';
import { RankBadge } from './RankBadge';

interface TeamSelectionProps {
  players: Player[];
  teamCount: number;
  selectedIds: Set<string>;
  onTeamCountChange: (count: number) => void;
  onSelectionChange: (ids: Set<string>) => void;
  onGenerate: () => void;
  onManagePlayers: () => void;
}

export function minimumPlayers(teamCount: number): number {
  return teamCount * MIN_PLAYERS_PER_TEAM;
}

export function TeamSelection({
  players,
  teamCount,
  selectedIds,
  onTeamCountChange,
  onSelectionChange,
  onGenerate,
  onManagePlayers,
}: TeamSelectionProps) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const countHelpId = useId();

  const sorted = useMemo(
    () => [...players].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name)),
    [players],
  );
  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? sorted.filter((p) => p.name.toLocaleLowerCase().includes(q)) : sorted;
  }, [sorted, query]);

  const selectedCount = players.filter((p) => isRanked(p) && selectedIds.has(p.id)).length;
  const rankedCount = players.filter(isRanked).length;
  const unranked = players.length - rankedCount;
  const min = minimumPlayers(teamCount);
  const tooFew = selectedCount < min;
  const sizes = teamSizes(selectedCount, teamCount);
  const sizeText =
    sizes[0] === sizes[sizes.length - 1]
      ? `${teamCount} teams of ${sizes[0]}`
      : `team sizes ${sizes.join(', ')}`;

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const setMany = (ids: string[], on: boolean) => {
    const next = new Set(selectedIds);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    onSelectionChange(next);
  };

  if (players.length === 0) {
    return (
      <div className="empty card">
        <div className="empty-icon" aria-hidden="true">
          📋
        </div>
        <h2>No saved players</h2>
        <p className="muted">Add players on the Players page first, then come back here to sort teams.</p>
        <button type="button" className="btn btn-primary" onClick={onManagePlayers}>
          Go to Players
        </button>
      </div>
    );
  }

  return (
    <div className="steps">
      <section className="card step" aria-labelledby="step-a">
        <h2 id="step-a" className="step-title">
          <span className="step-num" aria-hidden="true">
            1
          </span>
          How many teams?
        </h2>
        <div className="segmented" role="radiogroup" aria-labelledby="step-a">
          {TEAM_COUNT_OPTIONS.map((n) => (
            <label key={n} className={`segment${teamCount === n ? ' selected' : ''}`}>
              <input
                type="radio"
                name="team-count"
                value={n}
                checked={teamCount === n}
                onChange={() => onTeamCountChange(n)}
              />
              <span className="segment-num">{n}</span>
              <span className="segment-label">teams</span>
            </label>
          ))}
        </div>
      </section>

      <section className="card step" aria-labelledby="step-b">
        <h2 id="step-b" className="step-title">
          <span className="step-num" aria-hidden="true">
            2
          </span>
          Who is playing today?
        </h2>

        <div className="toolbar">
          <div className="field inline grow">
            <label htmlFor={searchId} className="sr-only">
              Search players
            </label>
            <input
              id={searchId}
              type="search"
              placeholder="Search players…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="toolbar-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMany(visible.filter(isRanked).map((p) => p.id), true)}
            >
              Select All{query ? ' shown' : ''}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMany(query ? visible.map((p) => p.id) : players.map((p) => p.id), false)}
            >
              Deselect All{query ? ' shown' : ''}
            </button>
          </div>
        </div>

        <span id={`${searchId}-unranked`} hidden>
          No rank yet
        </span>
        <p className="selected-count" aria-live="polite">
          <strong>{selectedCount}</strong> of {rankedCount} players selected
        </p>
        {unranked > 0 && (
          <p className="muted small">
            {unranked} player{unranked === 1 ? '' : 's'} without a rank can’t be picked yet.{' '}
            <button type="button" className="link" onClick={onManagePlayers}>
              Set ranks on the Players page
            </button>
          </p>
        )}

        {visible.length === 0 ? (
          <p className="empty-inline muted">No players match “{query}”.</p>
        ) : (
          <ul className="check-list">
            {visible.map((p) => {
              const ranked = isRanked(p);
              const checked = ranked && selectedIds.has(p.id);
              return (
                <li key={p.id}>
                  <label className={`check-item${checked ? ' checked' : ''}${ranked ? '' : ' disabled'}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!ranked}
                      aria-describedby={ranked ? undefined : `${searchId}-unranked`}
                      onChange={() => toggle(p.id)}
                    />
                    <span className="check-name">{p.name}</span>
                    <RankBadge rank={p.rank} />
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card step generate-step" aria-labelledby="step-c">
        <h2 id="step-c" className="step-title">
          <span className="step-num" aria-hidden="true">
            3
          </span>
          Generate teams
        </h2>
        {tooFew ? (
          <p id={countHelpId} className="notice notice-warn" role="status">
            {selectedCount === 0
              ? `Select the players who are playing today. You need at least ${min} players for ${teamCount} teams.`
              : `Select at least ${min} players for ${teamCount} teams (${MIN_PLAYERS_PER_TEAM} per team) — ${min - selectedCount} more needed${
                  teamCount > 2 ? ', or choose fewer teams' : ''
                }.`}
          </p>
        ) : (
          <p id={countHelpId} className="muted">
            {selectedCount} players → {sizeText}.
          </p>
        )}
        <button
          type="button"
          className="btn btn-accent btn-lg btn-block"
          disabled={tooFew}
          aria-describedby={countHelpId}
          onClick={onGenerate}
        >
          Generate Teams
        </button>
      </section>
    </div>
  );
}
