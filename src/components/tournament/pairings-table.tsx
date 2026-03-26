import { ResultCell } from '@/components/tournament/result-cell.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { useTabs } from '@/hooks/use-tabs.js';

import type { Result } from '@echecs/tournament';
import type { JSX } from 'react';

interface PairingsTableProperties {
  readonly?: boolean;
  round: number;
}

function PairingsTable({
  readonly: isReadonly = false,
  round: displayRound,
}: PairingsTableProperties): JSX.Element {
  const { currentPairings, players, recordResult, tournament } = useTabs();

  if (!tournament) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-text-muted">No pairings yet.</p>
      </div>
    );
  }

  const playerMap = new Map(players.map((p) => [p.id, p.name]));

  const games = tournament.games[displayRound - 1] ?? [];

  const gameMap = new Map(
    games.map((g) => [`${g.white}-${g.black}`, g.result]),
  );

  // For the current round, use currentPairings. For past rounds, reconstruct
  // from games.
  const isCurrentRound = displayRound === tournament.currentRound;
  const pairings = isCurrentRound
    ? (currentPairings?.pairings ?? [])
    : // Reconstruct pairings from games for past rounds
      games.map((g) => ({ black: g.black, white: g.white }));

  const byes = isCurrentRound ? (currentPairings?.byes ?? []) : [];

  if (pairings.length === 0 && byes.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-text-muted">
          Round not yet paired. Click{' '}
          <strong className="text-text-secondary">Pair Round</strong> in the
          header to generate pairings.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-16 text-center text-xs uppercase text-text-secondary">
              Board
            </TableHead>
            <TableHead className="text-xs uppercase text-text-secondary">
              White
            </TableHead>
            <TableHead className="w-24 text-center text-xs uppercase text-text-secondary">
              Result
            </TableHead>
            <TableHead className="text-xs uppercase text-text-secondary">
              Black
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairings.map((pairing, index) => {
            const result = gameMap.get(`${pairing.white}-${pairing.black}`);

            return (
              <TableRow
                className="border-border hover:bg-bg-elevated"
                key={`${pairing.white}-${pairing.black}`}
              >
                <TableCell className="text-center tabular-nums text-text-secondary">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <span className="mr-2 inline-block size-2 rounded-full bg-white-piece" />
                  {playerMap.get(pairing.white) ?? pairing.white}
                </TableCell>
                <TableCell className="text-center">
                  <ResultCell
                    disabled={isReadonly}
                    onSelect={(r: Result) => {
                      recordResult({
                        black: pairing.black,
                        result: r,
                        white: pairing.white,
                      });
                    }}
                    value={result}
                  />
                </TableCell>
                <TableCell>
                  <span className="mr-2 inline-block size-2 rounded-full bg-black-piece" />
                  {playerMap.get(pairing.black) ?? pairing.black}
                </TableCell>
              </TableRow>
            );
          })}

          {byes.map((bye) => (
            <TableRow
              className="border-border bg-bg-primary/50 hover:bg-bg-elevated"
              key={bye.player}
            >
              <TableCell className="text-center font-mono text-text-muted">
                —
              </TableCell>
              <TableCell className="text-text-secondary">
                {playerMap.get(bye.player) ?? bye.player}
              </TableCell>
              <TableCell className="text-center text-xs text-text-muted">
                BYE
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { PairingsTable };
