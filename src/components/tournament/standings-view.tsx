import { Trophy } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card.js';
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

import type { Game } from '@echecs/tournament';
import type { JSX } from 'react';

/* ── Per-round result for a player ── */

type RoundResult = '1' | '½' | '0' | 'B' | '*' | '—';

function getPlayerResult(
  games: readonly Game[],
  playerId: string,
  roundIndex: number,
  currentRound: number,
): RoundResult {
  // Round not yet played
  if (roundIndex + 1 > currentRound) {
    return '*';
  }

  const game = games.find((g) => g.white === playerId || g.black === playerId);

  if (!game) {
    return '—';
  }

  // Bye game kinds
  if (
    game.kind === 'full-bye' ||
    game.kind === 'half-bye' ||
    game.kind === 'pairing-bye' ||
    game.kind === 'zero-bye'
  ) {
    return 'B';
  }

  const isWhite = game.white === playerId;

  if (game.result === 1) {
    return isWhite ? '1' : '0';
  }

  if (game.result === 0) {
    return isWhite ? '0' : '1';
  }

  // 0.5 draw
  return '½';
}

function resultColor(result: RoundResult): string {
  switch (result) {
    case '1': {
      return 'text-success';
    }
    case '0': {
      return 'text-danger';
    }
    case '½': {
      return 'text-draw';
    }
    default: {
      return 'text-text-muted';
    }
  }
}

/* ── Stats helpers ── */

const TITLE_PREFIXES = ['GM', 'IM', 'FM', 'WGM', 'WIM', 'WFM', 'CM', 'WCM'];

function StandingsView(): JSX.Element {
  const { metadata, players, round, rounds, standings, tournament } = useTabs();

  /* ── Derived data ── */

  // Map player id → seed (index in original players list, 1-based)
  const seedMap = new Map(players.map((p, index) => [p.id, index + 1]));

  // Map player id → PlayerEntry for name/rating/federation
  const playerEntryMap = new Map(players.map((p) => [p.id, p]));

  // Map player id → tournament Player for rating via tournament.players
  const tournamentPlayerMap = new Map(
    (tournament?.players ?? []).map((p) => [p.id, p]),
  );

  // Number of rounds played so far (columns to show)
  const roundsPlayed = round;

  // Stats
  const totalPlayers = players.length;

  const ratedPlayers = players.filter((p) => p.rating && p.rating > 0);
  const averageRating =
    ratedPlayers.length > 0
      ? Math.round(
          ratedPlayers.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
            ratedPlayers.length,
        )
      : undefined;

  const titledCount = players.filter((p) =>
    TITLE_PREFIXES.some((t) => p.name.startsWith(t + ' ')),
  ).length;

  const federationCount = new Set(
    players.map((p) => p.federation).filter(Boolean),
  ).size;

  /* ── Rank assignment (ties get same rank) ── */
  const displayRanks: number[] = standings.map((standing, index) => {
    if (index === 0) {
      return 1;
    }
    const previous = standings[index - 1];
    return previous && previous.score !== standing.score
      ? index + 1
      : standings.slice(0, index).findIndex((s) => s.score === standing.score) +
          1;
  });

  const isLeader = (index: number): boolean =>
    displayRanks[index] === 1 && (standings[index]?.score ?? 0) > 0;

  /* ── Empty state ── */
  if (standings.length === 0) {
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

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-12">
            <p className="text-sm text-text-muted">
              Standings appear after the first round is complete.
            </p>
            <p className="text-xs text-text-muted">
              Go to Rounds to pair and record results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
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
        {/* ── Standings Table ── */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-14 text-center text-xs uppercase text-text-secondary">
                  Rank
                </TableHead>
                <TableHead className="w-14 text-center text-xs uppercase text-text-secondary">
                  Seed
                </TableHead>
                <TableHead className="text-xs uppercase text-text-secondary">
                  Name
                </TableHead>
                <TableHead className="w-16 text-xs uppercase text-text-secondary">
                  Title
                </TableHead>
                <TableHead className="w-20 text-xs uppercase text-text-secondary">
                  Fed.
                </TableHead>
                <TableHead className="w-20 text-right text-xs uppercase text-text-secondary">
                  Rating
                </TableHead>
                <TableHead className="w-20 text-center text-xs uppercase text-text-secondary">
                  Points
                </TableHead>
                {Array.from({ length: roundsPlayed }, (_, index) => (
                  <TableHead
                    className="w-10 text-center text-xs uppercase text-text-secondary"
                    key={index + 1}
                  >
                    R{index + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {standings.map((standing, index) => {
                const entry = playerEntryMap.get(standing.player);
                const tp = tournamentPlayerMap.get(standing.player);
                const seed = seedMap.get(standing.player) ?? '—';
                const rank = displayRanks[index] ?? index + 1;
                const leader = isLeader(index);

                // Derive title from name prefix
                const name = entry?.name ?? standing.player;
                const titleMatch = TITLE_PREFIXES.find((t) =>
                  name.startsWith(t + ' '),
                );
                const displayTitle = titleMatch ?? '';
                const displayName = titleMatch
                  ? name.slice(titleMatch.length + 1)
                  : name;

                const rating = entry?.rating ?? tp?.rating;

                return (
                  <TableRow
                    className={cn(
                      'border-border hover:bg-bg-elevated',
                      leader && 'bg-primary/5',
                    )}
                    key={standing.player}
                  >
                    {/* Rank */}
                    <TableCell className="text-center tabular-nums text-text-secondary">
                      <div className="flex items-center justify-center gap-1">
                        {leader && <Trophy className="size-3.5 text-accent" />}
                        <span>{rank}</span>
                      </div>
                    </TableCell>

                    {/* Seed */}
                    <TableCell className="text-center tabular-nums text-text-muted">
                      {seed}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium">{displayName}</TableCell>

                    {/* Title */}
                    <TableCell className="text-xs font-semibold text-accent">
                      {displayTitle}
                    </TableCell>

                    {/* Federation */}
                    <TableCell className="text-text-secondary">
                      {entry?.federation || '—'}
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="text-right tabular-nums text-text-secondary">
                      {rating ?? '—'}
                    </TableCell>

                    {/* Points */}
                    <TableCell className="text-center tabular-nums text-lg font-semibold">
                      {standing.score}
                    </TableCell>

                    {/* Per-round results */}
                    {Array.from({ length: roundsPlayed }, (_, rIndex) => {
                      const roundGames =
                        tournament?.games[rIndex] ?? ([] as Game[]);
                      const result = getPlayerResult(
                        roundGames,
                        standing.player,
                        rIndex,
                        round,
                      );

                      return (
                        <TableCell
                          className={cn(
                            'text-center font-mono text-sm tabular-nums',
                            resultColor(result),
                          )}
                          key={rIndex}
                        >
                          {result}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ── Stats Cards ── */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <Card className="gap-2 py-4">
            <CardContent className="px-5">
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Total Players
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                {totalPlayers}
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 py-4">
            <CardContent className="px-5">
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Average Rating
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                {averageRating ?? '—'}
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 py-4">
            <CardContent className="px-5">
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Titled Players
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                {titledCount}
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 py-4">
            <CardContent className="px-5">
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Federations
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                {federationCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Result Legend ── */}
        <Card className="mt-4 gap-0 py-4">
          <CardContent className="px-5">
            <p className="mb-3 text-xs uppercase tracking-wide text-text-secondary">
              Result Legend
            </p>
            <div className="grid grid-cols-6 gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-success">
                  1
                </span>
                <span className="text-text-secondary">Win</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-draw">
                  ½
                </span>
                <span className="text-text-secondary">Draw</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-danger">
                  0
                </span>
                <span className="text-text-secondary">Loss</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-text-muted">
                  B
                </span>
                <span className="text-text-secondary">Bye</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-text-muted">
                  *
                </span>
                <span className="text-text-secondary">Not played</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-text-muted">
                  —
                </span>
                <span className="text-text-secondary">Not paired</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { StandingsView };
