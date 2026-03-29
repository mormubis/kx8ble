import { tiebreak as averageRating } from '@echecs/average-rating';
import { tiebreak as buchholz } from '@echecs/buchholz';
import { tiebreak as directEncounter } from '@echecs/direct-encounter';
import { tiebreak as koya } from '@echecs/koya';
import { tiebreak as numberOfWins } from '@echecs/number-of-wins';
import { tiebreak as performanceRating } from '@echecs/performance-rating';
import { tiebreak as progressive } from '@echecs/progressive';
import { tiebreak as sonnebornBerger } from '@echecs/sonneborn-berger';

import type { Tiebreak } from '@echecs/tournament';

interface TiebreakDefinition {
  abbr: string;
  description: string;
  fn: Tiebreak;
  id: string;
  name: string;
}

const TIEBREAK_REGISTRY: TiebreakDefinition[] = [
  { abbr: 'BH', description: "Sum of opponents' scores", fn: buchholz, id: 'buchholz', name: 'Buchholz' },
  { abbr: 'SB', description: "Weighted score by opponents' scores", fn: sonnebornBerger, id: 'sonneborn-berger', name: 'Sonneborn-Berger' },
  { abbr: 'DE', description: 'Results between tied players', fn: directEncounter, id: 'direct-encounter', name: 'Direct Encounter' },
  { abbr: 'Wins', description: 'Total number of wins', fn: numberOfWins, id: 'number-of-wins', name: 'Number of Wins' },
  { abbr: 'Prog', description: 'Cumulative score round by round', fn: progressive, id: 'progressive', name: 'Progressive Score' },
  { abbr: 'Perf', description: 'Tournament performance rating', fn: performanceRating, id: 'performance-rating', name: 'Performance Rating' },
  { abbr: 'Koya', description: 'Score against top-half opponents', fn: koya, id: 'koya', name: 'Koya System' },
  { abbr: 'AvgR', description: 'Average rating of opponents', fn: averageRating, id: 'average-rating', name: 'Avg. Rating of Opponents' },
];

const DEFAULT_TIEBREAK_IDS: string[] = [
  'buchholz',
  'sonneborn-berger',
  'direct-encounter',
  'number-of-wins',
];

function getTiebreakById(id: string): TiebreakDefinition | undefined {
  return TIEBREAK_REGISTRY.find((t) => t.id === id);
}

function resolveTiebreaks(ids: string[]): Tiebreak[] {
  return ids
    .map((id) => getTiebreakById(id))
    .filter((t): t is TiebreakDefinition => t !== undefined)
    .map((t) => t.fn);
}

export { DEFAULT_TIEBREAK_IDS, getTiebreakById, resolveTiebreaks, TIEBREAK_REGISTRY };
export type { TiebreakDefinition };
