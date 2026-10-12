import { useEffect, useId, useState, type FormEvent } from 'react';
import { RANK_OPTIONS, RATERS } from '../config';
import type { Player, Ratings } from '../types';
import { averageRank, emptyRatings, formatRank } from '../utils/ratings';
import { Modal } from './Modal';

interface PlayerFormProps {
  open: boolean;
  /** Player being edited; undefined when adding a new player. */
  player?: Player;
  onSave: (name: string, ratings: Ratings, gk: boolean) => void;
  onClose: () => void;
  findByName: (name: string, exceptId?: string) => Player | undefined;
}

export const MAX_NAME_LENGTH = 40;

export function PlayerForm({ open, player, onSave, onClose, findByName }: PlayerFormProps) {
  const [name, setName] = useState('');
  const [ratings, setRatings] = useState<Ratings>(emptyRatings);
  const [gk, setGk] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameId = useId();
  const ratingsId = useId();

  useEffect(() => {
    if (open) {
      setName(player?.name ?? '');
      setRatings(player ? { ...player.ratings } : emptyRatings());
      setGk(player?.gk ?? false);
      setSubmitted(false);
    }
  }, [open, player]);

  const trimmed = name.trim();
  const duplicate = trimmed ? findByName(trimmed, player?.id) : undefined;
  const nameError = !trimmed
    ? 'Please enter a name.'
    : duplicate
      ? `A player called "${duplicate.name}" already exists. Use a different name (e.g. add an initial).`
      : '';
  const avg = averageRank(ratings);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError) return;
    onSave(trimmed, ratings, gk);
    onClose();
  };

  const showName = (submitted || duplicate) && nameError;

  return (
    <Modal open={open} title={player ? 'Edit player' : 'Add new player'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="form">
        <div className="field">
          <label htmlFor={nameId}>Name</label>
          <input
            id={nameId}
            type="text"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            autoFocus
            required
            aria-invalid={!!showName}
            aria-describedby={showName ? `${nameId}-err` : undefined}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ahmed"
          />
          {showName && (
            <p id={`${nameId}-err`} className="field-error" role="alert">
              {nameError}
            </p>
          )}
        </div>
        <label className="switch-field">
          <input type="checkbox" role="switch" className="switch" checked={gk} onChange={(e) => setGk(e.target.checked)} />
          <span>
            <strong>GK skills</strong>
            <span className="field-hint">Can play in goal. Teams are sorted so each gets a goalkeeper when possible.</span>
          </span>
        </label>
        <fieldset className="field rater-fields" aria-describedby={`${ratingsId}-hint`}>
          <legend>Ranks</legend>
          <div className="rater-grid">
            {RATERS.map((r) => (
              <label key={r.id} className="rater-field">
                <span>{r.name}</span>
                <select
                  value={ratings[r.id] ?? ''}
                  onChange={(e) =>
                    setRatings((cur) => ({ ...cur, [r.id]: e.target.value ? Number(e.target.value) : null }))
                  }
                >
                  <option value="">—</option>
                  {RANK_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p id={`${ratingsId}-hint`} className="field-hint">
            Rank {RANK_OPTIONS[0]} is the strongest, {RANK_OPTIONS[RANK_OPTIONS.length - 1]} the weakest. Each person
            can leave theirs empty and fill it in later. Average rank:{' '}
            <strong>{avg === null ? 'not rated yet' : formatRank(avg)}</strong>
          </p>
        </fieldset>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {player ? 'Save changes' : 'Add player'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
