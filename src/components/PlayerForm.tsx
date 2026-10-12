import { useEffect, useId, useState, type FormEvent } from 'react';
import { RANK_OPTIONS } from '../config';
import type { Player } from '../types';
import { Modal } from './Modal';

interface PlayerFormProps {
  open: boolean;
  /** Player being edited; undefined when adding a new player. */
  player?: Player;
  onSave: (name: string, rank: number) => void;
  onClose: () => void;
  findByName: (name: string, exceptId?: string) => Player | undefined;
}

export const MAX_NAME_LENGTH = 40;

export function PlayerForm({ open, player, onSave, onClose, findByName }: PlayerFormProps) {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameId = useId();
  const rankId = useId();

  useEffect(() => {
    if (open) {
      setName(player?.name ?? '');
      setRank(player?.rank != null ? String(player.rank) : '');
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
  const rankError = rank ? '' : 'Please choose a rank.';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || rankError) return;
    onSave(trimmed, Number(rank));
    onClose();
  };

  const showName = (submitted || duplicate) && nameError;
  const showRank = submitted && rankError;

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
        <div className="field">
          <label htmlFor={rankId}>Rank</label>
          <select
            id={rankId}
            value={rank}
            required
            aria-invalid={!!showRank}
            aria-describedby={`${rankId}-hint${showRank ? ` ${rankId}-err` : ''}`}
            onChange={(e) => setRank(e.target.value)}
          >
            <option value="" disabled>
              Choose a rank…
            </option>
            {RANK_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
                {r === RANK_OPTIONS[0] ? ' (strongest)' : r === RANK_OPTIONS[RANK_OPTIONS.length - 1] ? ' (weakest)' : ''}
              </option>
            ))}
          </select>
          <p id={`${rankId}-hint`} className="field-hint">
            Rank 1 is the strongest player; higher numbers are weaker.
          </p>
          {showRank && (
            <p id={`${rankId}-err`} className="field-error" role="alert">
              {rankError}
            </p>
          )}
        </div>
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
