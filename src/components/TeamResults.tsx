import { useMemo } from 'react';
import type { TeamResult } from '../types';
import { teamsToShareText } from '../utils/shareText';
import { formatStrength, summarizeFairness } from '../utils/teamBalancer';
import { RankBadge } from './RankBadge';

interface TeamResultsProps {
  result: TeamResult;
  onRegenerate: () => void;
  onBack: () => void;
  onStartOver: () => void;
  notify: (message: string, kind?: 'success' | 'error') => void;
}

const TEAM_COLORS = ['team-a', 'team-b', 'team-c', 'team-d', 'team-e'];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async clipboard API.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

export function TeamResults({ result, onRegenerate, onBack, onStartOver, notify }: TeamResultsProps) {
  const fairness = summarizeFairness(result);
  const shareText = useMemo(() => teamsToShareText(result), [result]);
  const maxStrength = Math.max(1, ...result.teams.map((t) => t.strength));
  const totalPlayers = result.teams.reduce((n, t) => n + t.players.length, 0);

  const copy = async () => {
    if (await copyText(shareText)) notify('Teams copied — paste them into WhatsApp or any chat.');
    else notify('Copying failed. Select the text in the preview below and copy it manually.', 'error');
  };

  return (
    <div className="results">
      <section className={`card fairness fairness-${fairness.level}`} aria-labelledby="fairness-title">
        <div className="fairness-head">
          <h2 id="fairness-title">{fairness.label}</h2>
          <span className="fairness-diff">
            Difference: <strong>{formatStrength(result.strengthDifference)}</strong> pts
          </span>
        </div>
        <p>{fairness.message}</p>

        <div className="comparison" role="list" aria-label="Team strength comparison">
          {result.teams.map((t, i) => (
            <div className="comparison-row" role="listitem" key={t.name}>
              <span className="comparison-name">{t.name}</span>
              <span className="comparison-track">
                <span
                  className={`comparison-bar ${TEAM_COLORS[i % TEAM_COLORS.length]}`}
                  style={{ width: `${(t.strength / maxStrength) * 100}%` }}
                />
              </span>
              <span className="comparison-value">{formatStrength(t.strength)}</span>
            </div>
          ))}
        </div>
        <p className="disclaimer">
          Strength is an estimate calculated from the player ranks you entered (rank 1 = highest score). It is not a
          guarantee that the teams are equal on the pitch — form, positions and teamwork still matter.
        </p>
      </section>

      <div className="team-grid" data-count={result.teams.length}>
        {result.teams.map((team, i) => (
          <section key={team.name} className={`card team-card ${TEAM_COLORS[i % TEAM_COLORS.length]}`} aria-label={team.name}>
            <header className="team-head">
              <h3>{team.name}</h3>
              <div className="team-meta">
                <span>{team.players.length} players</span>
                <span>Strength {formatStrength(team.strength)}</span>
              </div>
            </header>
            <ol className="team-players">
              {team.players.map((p) => (
                <li key={p.id}>
                  <span className="team-player-name">{p.name}</span>
                  <RankBadge rank={p.rank} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="result-actions card">
        <button type="button" className="btn btn-accent btn-lg" onClick={copy}>
          Copy Teams
        </button>
        <a
          className="btn btn-whatsapp btn-lg"
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp
        </a>
        <button type="button" className="btn btn-primary btn-lg" onClick={onRegenerate}>
          Regenerate Teams
        </button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={onBack}>
          Back to Player Selection
        </button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={onStartOver}>
          Start Over
        </button>
      </div>

      <details className="card share-preview">
        <summary>Preview the text that will be copied ({totalPlayers} players)</summary>
        <pre>{shareText}</pre>
      </details>
    </div>
  );
}
