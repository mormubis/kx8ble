import { ResultCell } from '@/components/tournament/result-cell.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { useTournament } from '@/hooks/use-tournament.js';

import type { Result } from '@echecs/tournament';
import type { JSX } from 'react';

function PairingsTable(): JSX.Element {
  const { currentPairings, players, recordResult, tournament } =
    useTournament();

  if (!currentPairings || !tournament) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-text-muted">No pairings yet.</p>
      </div>
    );
  }

  const playerMap = new Map(players.map((p) => [p.id, p.name]));

  const games = tournament.games.filter(
    (g) => g.round === tournament.currentRound,
  );

  const gameMap = new Map(
    games.map((g) => [`${g.whiteId}-${g.blackId}`, g.result]),
  );

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
          {currentPairings.pairings.map((pairing, index) => {
            const result = gameMap.get(`${pairing.whiteId}-${pairing.blackId}`);

            return (
              <TableRow
                className="border-border hover:bg-bg-elevated"
                key={`${pairing.whiteId}-${pairing.blackId}`}
              >
                <TableCell className="text-center font-mono text-text-secondary">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <span className="mr-2 inline-block size-2 rounded-full bg-white-piece" />
                  {playerMap.get(pairing.whiteId) ?? pairing.whiteId}
                </TableCell>
                <TableCell className="text-center">
                  <ResultCell
                    onSelect={(r: Result) => {
                      recordResult({
                        blackId: pairing.blackId,
                        result: r,
                        whiteId: pairing.whiteId,
                      });
                    }}
                    value={result}
                  />
                </TableCell>
                <TableCell>
                  <span className="mr-2 inline-block size-2 rounded-full bg-black-piece" />
                  {playerMap.get(pairing.blackId) ?? pairing.blackId}
                </TableCell>
              </TableRow>
            );
          })}

          {currentPairings.byes.map((bye) => (
            <TableRow
              className="border-border bg-bg-primary/50 hover:bg-bg-elevated"
              key={bye.playerId}
            >
              <TableCell className="text-center font-mono text-text-muted">
                —
              </TableCell>
              <TableCell className="text-text-secondary">
                {playerMap.get(bye.playerId) ?? bye.playerId}
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
