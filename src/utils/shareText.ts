import type { TeamResult } from '../types';
import { formatStrength, summarizeFairness } from './teamBalancer';

/** Plain-text version of the teams, suitable for WhatsApp or any messaging app. */
export function teamsToShareText(result: TeamResult, date: Date = new Date()): string {
  const lines: string[] = [];
  lines.push(`⚽ Teams for ${date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}`);
  for (const team of result.teams) {
    lines.push('');
    lines.push(`*${team.name}* (${team.players.length} players)`);
    team.players.forEach((p, i) => lines.push(`${i + 1}. ${p.name}`));
  }
  lines.push('');
  const fairness = summarizeFairness(result);
  lines.push(
    `Balance: ${fairness.label} — strength difference ${formatStrength(result.strengthDifference)} pts`,
  );
  return lines.join('\n');
}
