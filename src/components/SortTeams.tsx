import type { Player, TeamResult } from '../types';
import { TeamResults } from './TeamResults';
import { TeamSelection } from './TeamSelection';

export type SortStep = 'select' | 'results';

interface SortTeamsProps {
  players: Player[];
  step: SortStep;
  teamCount: number;
  selectedIds: Set<string>;
  result: TeamResult | null;
  onTeamCountChange: (count: number) => void;
  onSelectionChange: (ids: Set<string>) => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onBack: () => void;
  onStartOver: () => void;
  onManagePlayers: () => void;
  notify: (message: string, kind?: 'success' | 'error') => void;
}

/** The Sort Teams workflow: choose team count → pick players → generate → results. */
export function SortTeams(props: SortTeamsProps) {
  const showResults = props.step === 'results' && props.result;
  return (
    <section className="page" aria-labelledby="sort-title">
      <div className="page-head">
        <div>
          <h1 id="sort-title">Sort Teams</h1>
          <p className="muted">
            {showResults
              ? 'Here are your balanced teams.'
              : 'Pick the number of teams and today’s players, then generate fair teams.'}
          </p>
        </div>
        <ol className="progress" aria-label="Progress">
          <li className={!showResults ? 'current' : 'done'} aria-current={!showResults ? 'step' : undefined}>
            Select
          </li>
          <li className={showResults ? 'current' : ''} aria-current={showResults ? 'step' : undefined}>
            Results
          </li>
        </ol>
      </div>
      {showResults ? (
        <TeamResults
          result={props.result!}
          onRegenerate={props.onRegenerate}
          onBack={props.onBack}
          onStartOver={props.onStartOver}
          notify={props.notify}
        />
      ) : (
        <TeamSelection
          players={props.players}
          teamCount={props.teamCount}
          selectedIds={props.selectedIds}
          onTeamCountChange={props.onTeamCountChange}
          onSelectionChange={props.onSelectionChange}
          onGenerate={props.onGenerate}
          onManagePlayers={props.onManagePlayers}
        />
      )}
    </section>
  );
}
