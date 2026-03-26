import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { useTabs } from '@/hooks/use-tabs.js';
import { cn } from '@/lib/utilities.js';

import type { JSX } from 'react';

function StandingsTable(): JSX.Element {
  const { metadata, players, round, rounds, standings } = useTabs();

  const playerMap = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b border-border bg-bg-secondary px-6 py-4">
        <div className="flex-1">
          <h1 className="text-section-title">
            {metadata?.name ?? 'Standings'}
          </h1>
          <p className="text-xs text-text-secondary">
            After round {round} of {rounds}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {standings.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
            <p className="text-sm text-text-muted">
              Standings appear here after the first round is complete.
            </p>
            <p className="text-xs text-text-muted">
              Go to Rounds to pair and record results.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-16 text-center text-xs uppercase text-text-secondary">
                    Rank
                  </TableHead>
                  <TableHead className="text-xs uppercase text-text-secondary">
                    Player
                  </TableHead>
                  <TableHead className="w-20 text-right text-xs uppercase text-text-secondary">
                    Rating
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs uppercase text-text-secondary">
                    Score
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs uppercase text-text-secondary">
                    Buchholz
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((standing) => {
                  const player = playerMap.get(standing.playerId);

                  return (
                    <TableRow
                      className={cn(
                        'border-border hover:bg-bg-elevated',
                        standing.rank === 1 && 'border-l-2 border-l-accent',
                      )}
                      key={standing.playerId}
                    >
                      <TableCell className="text-center tabular-nums text-text-secondary">
                        {standing.rank}
                      </TableCell>
                      <TableCell className="font-medium">
                        {player?.name ?? standing.playerId}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-text-secondary">
                        {player?.rating || '—'}
                      </TableCell>
                      <TableCell className="text-center tabular-nums font-semibold">
                        {standing.score}
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-text-secondary">
                        {standing.tiebreaks[0]?.toFixed(1) ?? '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export { StandingsTable };
