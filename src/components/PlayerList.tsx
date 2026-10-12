import { useId, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { RANK_OPTIONS, RATERS } from '../config';
import type { PlayersApi } from '../hooks/usePlayers';
import type { Player } from '../types';
import {
  exportCsv,
  exportJson,
  mergePlayers,
  parseImportFile,
  replacePlayers,
  type ParseResult,
} from '../utils/importExport';
import { getDownloads } from '../platform';
import { formatRank, ratingCount } from '../utils/ratings';
import { ConfirmDialog, Modal } from './Modal';
import { PlayerForm } from './PlayerForm';

interface PlayerListProps {
  api: PlayersApi;
  onSortTeams: () => void;
  notify: (message: string, kind?: 'success' | 'error') => void;
}


async function download(fileName: string, content: string, type: string) {
  const downloads = await getDownloads();
  if (downloads) {
    try {
      await downloads.save({ filename: fileName, data: content });
    } catch {
      // Declined or unavailable: nothing to do.
    }
    return;
  }
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PlayerList({ api, onSortTeams, notify }: PlayerListProps) {
  const { players, updatePlayer, deletePlayer, addPlayer, replaceAll, findByName, mode, readOnly } = api;
  const [query, setQuery] = useState('');
  const [rankFilter, setRankFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Player | undefined>();
  const [toDelete, setToDelete] = useState<Player | undefined>();
  const [pendingImport, setPendingImport] = useState<(ParseResult & { fileName: string }) | undefined>();
  const fileInput = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const filterId = useId();

  const distribution = useMemo(
    () =>
      RANK_OPTIONS.map((r) => ({
        rank: r,
        count: players.filter((p) => p.rank !== null && Math.round(p.rank) === r).length,
      })),
    [players],
  );
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));
  const unrankedCount = players.filter((p) => p.rank === null).length;

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return players
      .filter(
        (p) =>
          (!q || p.name.toLocaleLowerCase().includes(q)) &&
          (!rankFilter ||
            (rankFilter === 'none' ? p.rank === null : p.rank !== null && Math.round(p.rank) === Number(rankFilter))),
      )
      // Always strongest first (rank 1 at the top); players without a rank go last.
      .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name));
  }, [players, query, rankFilter]);

  const openAdd = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = parseImportFile(file.name, await file.text());
      if (!parsed.players.length) {
        notify(`No valid players found in ${file.name}.${parsed.warnings.length ? ' ' + parsed.warnings[0] : ''}`, 'error');
        return;
      }
      setPendingImport({ ...parsed, fileName: file.name });
    } catch (err) {
      notify(`Could not import ${file.name}: ${(err as Error).message}`, 'error');
    }
  };

  const applyImport = (mode: 'merge' | 'replace') => {
    if (!pendingImport) return;
    replaceAll(mode === 'merge' ? mergePlayers(players, pendingImport.players) : replacePlayers(pendingImport.players));
    notify(`Imported ${pendingImport.players.length} player${pendingImport.players.length === 1 ? '' : 's'}.`);
    setPendingImport(undefined);
  };

  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <section className="page" aria-labelledby="players-title">
      <div className="page-head">
        <div>
          <h1 id="players-title">Players</h1>
          <p className="muted">
            Each of {RATERS.map((r) => r.name).join(', ')} ranks every player (1 = strongest,{' '}
            {RANK_OPTIONS[RANK_OPTIONS.length - 1]} = weakest). Rank is the average.
          </p>
        </div>
        <div className="page-head-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={openAdd} disabled={readOnly}>
            <span aria-hidden="true">＋</span> Add New Player
          </button>
          <button type="button" className="btn btn-accent btn-lg" onClick={onSortTeams} disabled={players.length < 2}>
            <span aria-hidden="true">⚽</span> Sort Teams
          </button>
        </div>
      </div>

      {players.length > 0 && (
        <div className="stats card">
          <div className="stat">
            <span className="stat-value">{players.length}</span>
            <span className="stat-label">player{players.length === 1 ? '' : 's'}</span>
          </div>
          <div className="distribution" role="img" aria-label={`Rank distribution: ${distribution.filter((d) => d.count).map((d) => `rank ${d.rank}: ${d.count}`).join(', ')}`}>
            {distribution.map((d) => (
              <button
                type="button"
                key={d.rank}
                className={`dist-col${rankFilter === String(d.rank) ? ' active' : ''}`}
                onClick={() => setRankFilter(rankFilter === String(d.rank) ? '' : String(d.rank))}
                title={`Rank ${d.rank}: ${d.count} player${d.count === 1 ? '' : 's'} — click to filter`}
                aria-hidden="true"
                tabIndex={-1}
              >
                <span className="dist-count">{d.count || ''}</span>
                <span className="dist-bar" style={{ height: `${(d.count / maxCount) * 100}%` }} />
                <span className="dist-rank">{d.rank}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {unrankedCount > 0 && (
        <p className="notice notice-warn rank-needed">
          {unrankedCount} player{unrankedCount === 1 ? ' has' : 's have'} no rank yet. At least one person needs to rank{' '}
          {unrankedCount === 1 ? 'them' : 'each of them'} before they can be picked for games.{' '}
          {rankFilter !== 'none' && (
            <button type="button" className="link" onClick={() => setRankFilter('none')}>
              Show them
            </button>
          )}
        </p>
      )}

      {players.length === 0 && mode === 'connecting' ? (
        <div className="empty card" aria-busy="true">
          <p className="muted">Loading the player list…</p>
        </div>
      ) : players.length === 0 ? (
        <div className="empty card">
          <div className="empty-icon" aria-hidden="true">
            ⚽
          </div>
          <h2>No players yet</h2>
          <p className="muted">
            Add the people who usually play, give each a rank, and you are ready to sort fair teams.
            {mode === 'shared' && ' Everyone you share this page with sees the same list.'}
          </p>
          <div className="empty-actions">
            <button type="button" className="btn btn-primary" onClick={openAdd} disabled={readOnly}>
              Add your first player
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInput.current?.click()}
              disabled={readOnly}
            >
              Import a list
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="toolbar">
            <div className="field inline grow">
              <label htmlFor={searchId} className="sr-only">
                Search players
              </label>
              <input
                id={searchId}
                type="search"
                placeholder="Search by name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="field inline">
              <label htmlFor={filterId} className="sr-only">
                Filter by rank
              </label>
              <select id={filterId} value={rankFilter} onChange={(e) => setRankFilter(e.target.value)}>
                <option value="">All ranks</option>
                {unrankedCount > 0 && <option value="none">No rank yet ({unrankedCount})</option>}
                {RANK_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    Rank {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="empty-inline muted">
              No players match your search.{' '}
              <button
                type="button"
                className="link"
                onClick={() => {
                  setQuery('');
                  setRankFilter('');
                }}
              >
                Clear filters
              </button>
            </p>
          ) : (
            <div className="table-wrap">
              <table className="players-table">
                <thead>
                  <tr>
                    <th scope="col">Player</th>
                    <th scope="col" className="gk-col">
                      GK
                    </th>
                    {RATERS.map((r) => (
                      <th scope="col" key={r.id} className="rater-col">
                        {r.name}
                      </th>
                    ))}
                    <th scope="col" className="avg-col" aria-sort="ascending">
                      Rank <span aria-hidden="true">▲</span>
                    </th>
                    <th scope="col" className="actions-col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id}>
                      <td className="name-td">
                        <div className="name-cell">
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="gk-col" data-label="GK">
                        <label className="gk-toggle" title="Goalkeeper skills">
                          <input
                            type="checkbox"
                            role="switch"
                            className="switch"
                            checked={p.gk}
                            disabled={readOnly}
                            aria-label={`${p.name} has goalkeeper skills`}
                            onChange={(e) => updatePlayer(p.id, { gk: e.target.checked })}
                          />
                          <span className="gk-toggle-text" aria-hidden="true">
                            GK
                          </span>
                        </label>
                      </td>
                      {RATERS.map((r) => (
                        <td key={r.id} className="rater-col" data-label={r.name}>
                          <select
                            className="rank-select"
                            value={p.ratings[r.id] ?? ''}
                            disabled={readOnly}
                            aria-label={`${r.name}'s rank for ${p.name}`}
                            onChange={(e) =>
                              updatePlayer(p.id, {
                                ratings: { [r.id]: e.target.value ? Number(e.target.value) : null },
                              })
                            }
                          >
                            <option value="">—</option>
                            {RANK_OPTIONS.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                      <td className="avg-col" data-label="Rank">
                        {p.rank === null ? (
                          <span className="muted">—</span>
                        ) : (
                          <span className="avg-rank">
                            <strong>{formatRank(p.rank)}</strong>
                            {ratingCount(p.ratings) < RATERS.length && (
                              <span className="avg-count">
                                {ratingCount(p.ratings)}/{RATERS.length}
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="actions-col">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={readOnly}
                            onClick={() => {
                              setEditing(p);
                              setFormOpen(true);
                            }}
                            aria-label={`Edit ${p.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost-danger btn-sm"
                            disabled={readOnly}
                            onClick={() => setToDelete(p)}
                            aria-label={`Delete ${p.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {visible.length > 0 && visible.length < players.length && (
            <p className="table-foot muted">
              Showing {visible.length} of {players.length} players.
            </p>
          )}
        </div>
      )}

      <div className="data-tools">
        <span className={`sync-status sync-${mode}`}>
          {mode === 'shared'
            ? readOnly
              ? 'Shared list · view only'
              : 'Shared list · saved automatically for everyone with access'
            : mode === 'connecting'
              ? 'Connecting…'
              : 'Saved automatically in this browser'}
        </span>
        <div className="data-buttons">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={readOnly}
            onClick={() => fileInput.current?.click()}
          >
            Import JSON/CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!players.length}
            onClick={() => download(`players-${stamp}.json`, exportJson(players), 'application/json')}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!players.length}
            onClick={() => download(`players-${stamp}.csv`, exportCsv(players), 'text/csv')}
          >
            Export CSV
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,.csv,application/json,text/csv"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFile}
        />
      </div>

      <PlayerForm
        open={formOpen}
        player={editing}
        findByName={findByName}
        onClose={() => setFormOpen(false)}
        onSave={(name, ratings, gk) => {
          if (editing) {
            updatePlayer(editing.id, { name, ratings, gk });
            notify(`Updated ${name}.`);
          } else {
            addPlayer(name, ratings, gk);
            notify(`Added ${name}.`);
          }
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete player?"
        message={
          <p>
            Remove <strong>{toDelete?.name}</strong> from your player list? This cannot be undone.
          </p>
        }
        confirmLabel="Delete"
        danger
        onCancel={() => setToDelete(undefined)}
        onConfirm={() => {
          if (toDelete) {
            deletePlayer(toDelete.id);
            notify(`Deleted ${toDelete.name}.`);
          }
          setToDelete(undefined);
        }}
      />

      <Modal
        open={!!pendingImport}
        title="Import players"
        onClose={() => setPendingImport(undefined)}
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setPendingImport(undefined)}>
              Cancel
            </button>
            {players.length > 0 && (
              <button type="button" className="btn btn-danger" onClick={() => applyImport('replace')}>
                Replace list
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={() => applyImport(players.length ? 'merge' : 'replace')}>
              {players.length ? 'Merge' : 'Import'}
            </button>
          </>
        }
      >
        {pendingImport && (
          <>
            <p>
              Found <strong>{pendingImport.players.length}</strong> valid player
              {pendingImport.players.length === 1 ? '' : 's'} in <em>{pendingImport.fileName}</em>.
            </p>
            {players.length > 0 && (
              <p className="muted">
                <strong>Merge</strong> adds new names and updates the rank of players you already have.{' '}
                <strong>Replace</strong> deletes your current {players.length} player{players.length === 1 ? '' : 's'} first.
              </p>
            )}
            {pendingImport.warnings.length > 0 && (
              <details className="warnings">
                <summary>
                  {pendingImport.warnings.length} row{pendingImport.warnings.length === 1 ? ' was' : 's were'} skipped
                </summary>
                <ul>
                  {pendingImport.warnings.slice(0, 20).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </Modal>
    </section>
  );
}
