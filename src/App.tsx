import { useCallback, useEffect, useRef, useState } from 'react';
import { PlayerList } from './components/PlayerList';
import { SortTeams, type SortStep } from './components/SortTeams';
import { minimumPlayers } from './components/TeamSelection';
import { DEFAULT_TEAM_COUNT } from './config';
import { usePlayers } from './hooks/usePlayers';
import { isRanked, type TeamResult } from './types';
import { loadSession, saveSession } from './utils/storage';
import { balanceTeams, DEFAULT_SEED } from './utils/teamBalancer';

type View = 'players' | 'sort';

interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error';
}

export default function App() {
  const [view, setView] = useState<View>('players');

  const [initialSession] = useState(loadSession);
  const [teamCount, setTeamCount] = useState(initialSession.teamCount);
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialSession.selectedIds));
  const [step, setStep] = useState<SortStep>('select');
  const [result, setResult] = useState<TeamResult | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const mainRef = useRef<HTMLElement>(null);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), kind === 'error' ? 6000 : 3000);
  }, []);
  const api = usePlayers(useCallback((message: string) => notify(message, 'error'), [notify]));
  const { players } = api;

  // Remember the team count and today's selection across refreshes.
  useEffect(() => {
    saveSession({ teamCount, selectedIds: [...selectedIds] });
  }, [teamCount, selectedIds]);

  // Move focus/scroll to the top whenever the screen changes.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [view, step]);

  const generate = (seed: number, avoidSignature?: string) => {
    // Always use the current player data, so rank changes are reflected immediately.
    const picked = players.filter((p) => selectedIds.has(p.id));
    const unranked = picked.filter((p) => !isRanked(p));
    if (unranked.length) {
      notify(`Set a rank for ${unranked.map((p) => p.name).join(', ')} before generating teams.`, 'error');
      setStep('select');
      return;
    }
    const chosen = picked.filter(isRanked);
    if (chosen.length < minimumPlayers(teamCount)) {
      notify(`Select at least ${minimumPlayers(teamCount)} players for ${teamCount} teams.`, 'error');
      setStep('select');
      return;
    }
    try {
      setResult(balanceTeams(chosen, teamCount, { seed, avoidSignature }));
      setStep('results');
    } catch (err) {
      notify(`Could not generate teams: ${(err as Error).message}`, 'error');
    }
  };

  const startOver = () => {
    setSelectedIds(new Set());
    setTeamCount(DEFAULT_TEAM_COUNT);
    setResult(null);
    setStep('select');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <button type="button" className="brand" onClick={() => setView('players')} aria-label="Fair Football Team Generator — Players">
            <span className="brand-ball" aria-hidden="true">
              ⚽
            </span>
            <span className="brand-text">
              <span className="brand-name">Fair Football</span>
              <span className="brand-sub">Team Generator</span>
            </span>
          </button>
          <nav className="nav" aria-label="Main">
            <button
              type="button"
              className={`nav-link${view === 'players' ? ' active' : ''}`}
              aria-current={view === 'players' ? 'page' : undefined}
              onClick={() => setView('players')}
            >
              Players <span className="nav-count">{players.length}</span>
            </button>
            <button
              type="button"
              className={`nav-cta${view === 'sort' ? ' active' : ''}`}
              aria-current={view === 'sort' ? 'page' : undefined}
              onClick={() => setView('sort')}
            >
              Sort Teams
            </button>
          </nav>
        </div>
      </header>

      {api.mode === 'local' && !api.saveOk && (
        <div className="notice notice-error banner" role="alert">
          Your browser blocked saving. Changes will be lost when you close this page — export your players to keep a
          copy.
        </div>
      )}

      <main ref={mainRef} tabIndex={-1} className="main">
        {view === 'players' ? (
          <PlayerList api={api} onSortTeams={() => setView('sort')} notify={notify} />
        ) : (
          <SortTeams
            players={players}
            step={step}
            teamCount={teamCount}
            selectedIds={selectedIds}
            result={result}
            onTeamCountChange={setTeamCount}
            onSelectionChange={setSelectedIds}
            onGenerate={() => generate(DEFAULT_SEED)}
            onRegenerate={() => result && generate(result.seed + 1, result.signature)}
            onBack={() => setStep('select')}
            onStartOver={startOver}
            onManagePlayers={() => setView('players')}
            notify={notify}
          />
        )}
      </main>

      <footer className="app-footer muted">
        Teams are balanced on your device from the ranks you enter.{' '}
        {api.mode === 'shared'
          ? 'The player list is shared with everyone who has access to this page.'
          : 'Your player list is saved in this browser.'}
      </footer>

      <div className="toast-region" aria-live="polite" role="status">
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.kind}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
