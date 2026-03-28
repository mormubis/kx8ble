import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Plus,
  Save,
  Shuffle,
} from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button.js';
import { Card, CardContent } from '@/components/ui/card.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { useTabs } from '@/hooks/use-tabs.js';

import type { Game, Result } from '@echecs/tournament';
import type { JSX } from 'react';

/* ── Result types ── */

type ResultKey =
  | 'none'
  | '1-0'
  | '1/2-1/2'
  | '0-1'
  | '1F-0F'
  | '0F-1F'
  | '0F-0F';

interface ResultOption {
  label: string;
  value: ResultKey;
}

const RESULT_OPTIONS: ResultOption[] = [
  { label: '— Not played', value: 'none' },
  { label: '1 - 0 (White wins)', value: '1-0' },
  { label: '½ - ½ (Draw)', value: '1/2-1/2' },
  { label: '0 - 1 (Black wins)', value: '0-1' },
  { label: '1 - 0 (Forfeit)', value: '1F-0F' },
  { label: '0 - 1 (Forfeit)', value: '0F-1F' },
  { label: '0 - 0 (Double forfeit)', value: '0F-0F' },
];

/* ── Helpers ── */

function gameResultToKey(result: Result | undefined): ResultKey {
  if (result === undefined) return 'none';
  if (result === 1) return '1-0';
  if (result === 0.5) return '1/2-1/2';
  return '0-1';
}

function keyToNumericResult(key: ResultKey): Result {
  if (key === '1-0' || key === '1F-0F') return 1;
  if (key === '1/2-1/2') return 0.5;
  // '0-1', '0F-1F', '0F-0F'
  return 0;
}

function resultDisplayLabel(key: ResultKey): string {
  if (key === 'none') return '—';
  if (key === '1-0') return '1-0';
  if (key === '1/2-1/2') return '½-½';
  if (key === '0-1') return '0-1';
  if (key === '1F-0F') return '1-0F';
  if (key === '0F-1F') return '0-1F';
  if (key === '0F-0F') return '0-0F';
  return '—';
}

function resultColorClass(key: ResultKey): string {
  if (key === '1-0' || key === '1F-0F') return 'text-success';
  if (key === '0-1' || key === '0F-1F') return 'text-danger';
  if (key === '1/2-1/2') return 'text-draw';
  return 'text-muted-foreground';
}

/* ── Points calculation ── */

function calcPoints(
  playerId: string,
  games: readonly (readonly Game[])[],
): number {
  let score = 0;
  for (const round of games) {
    for (const game of round) {
      if (game.white === playerId) {
        score += game.result;
      } else if (game.black === playerId) {
        score += 1 - game.result;
      }
    }
  }
  return score;
}

/* ── Main component ── */

function RoundsView(): JSX.Element {
  const {
    allResultsRecorded,
    currentPairings,
    isComplete,
    loadFromFile,
    navigate,
    pairRound,
    players,
    recordResult,
    round,
    rounds,
    saveToFile,
    setViewingRound,
    tournament,
    viewingRound,
  } = useTabs();

  /* ── Derived state ── */

  // Resolve which round number we are actually looking at (0 = current)
  const displayRound = viewingRound === 0 ? round : viewingRound;
  const isViewingCurrent = viewingRound === 0 || viewingRound === round;

  const playerMap = new Map(players.map((p) => [p.id, p]));

  /* ── Pairings for the displayed round ── */

  let displayPairings: { white: string; black: string }[] = [];
  let displayByes: { player: string }[] = [];
  const gameMap = new Map<string, Result>();

  if (tournament) {
    const snapshot = tournament.toJSON();

    if (isViewingCurrent) {
      displayPairings = currentPairings?.pairings ?? [];
      displayByes = currentPairings?.byes ?? [];
    } else {
      // Past round — reconstruct pairings from roundPairings snapshot
      const pastPairings = snapshot.roundPairings[String(displayRound)];
      displayPairings = pastPairings?.pairings ?? [];
      displayByes = pastPairings?.byes ?? [];
    }

    // Build game map for this round
    const roundGames = tournament.games[displayRound - 1] ?? [];
    for (const g of roundGames) {
      gameMap.set(`${g.white}-${g.black}`, g.result);
    }
  }

  /* ── Event handlers ── */

  const handlePairRound = useCallback(() => {
    pairRound();
  }, [pairRound]);

  const handleSave = useCallback(() => {
    void saveToFile();
  }, [saveToFile]);

  const handlePrevious = useCallback(() => {
    const target = displayRound - 1;
    if (target >= 1) setViewingRound(target);
  }, [displayRound, setViewingRound]);

  const handleNext = useCallback(() => {
    const target = displayRound + 1;
    if (target <= round) setViewingRound(target);
  }, [displayRound, round, setViewingRound]);

  const handleResultChange = useCallback(
    (white: string, black: string, key: ResultKey) => {
      if (key === 'none') return;

      if (key === '1F-0F' || key === '0F-1F' || key === '0F-0F') {
        // TODO: forfeit support — library does not yet support forfeit game kinds
        // Map to equivalent numeric result for now
        const numericResult = keyToNumericResult(key);
        recordResult({ black, result: numericResult, white });
        return;
      }

      const numericResult = keyToNumericResult(key);
      recordResult({ black, result: numericResult, white });
    },
    [recordResult],
  );

  /* ── Empty states ── */

  if (!tournament) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-text-secondary">No active tournament.</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                navigate('setup');
              }}
              size="sm"
            >
              <Plus className="size-4" />
              New Tournament
            </Button>
            <Button
              onClick={() => {
                void loadFromFile();
              }}
              size="sm"
              variant="secondary"
            >
              <FolderOpen className="size-4" />
              Open File
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasPairings = displayPairings.length > 0 || displayByes.length > 0;
  const notYetPaired = isViewingCurrent && !hasPairings && !isComplete;
  const tooFewPlayers = players.length < 2;

  /* ── Stats for footer ── */

  const totalBoards = displayPairings.length;
  const resultsEntered = displayPairings.filter((p) =>
    gameMap.has(`${p.white}-${p.black}`),
  ).length;
  const pending = totalBoards - resultsEntered;

  /* ── Render ── */

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <header className="flex items-center gap-4 border-b border-border bg-bg-secondary px-6 py-4">
        <div className="flex-1">
          <h1 className="text-section-title text-text-primary">
            Rounds &amp; Pairings
          </h1>
        </div>

        {/* Round navigation */}
        {round > 0 && (
          <div className="flex items-center gap-1">
            <Button
              aria-label="Previous round"
              disabled={displayRound <= 1}
              onClick={handlePrevious}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[120px] text-center text-sm font-medium tabular-nums">
              Round {displayRound} of {rounds}
            </span>
            <Button
              aria-label="Next round"
              disabled={displayRound >= round}
              onClick={handleNext}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Action buttons */}
        {isViewingCurrent && notYetPaired && !tooFewPlayers && (
          <Button onClick={handlePairRound} size="sm">
            <Shuffle className="size-4" />
            Pair Round {round + 1}
          </Button>
        )}

        {allResultsRecorded && !isComplete && (
          <Button onClick={handlePairRound} size="sm">
            Next Round
            <ChevronRight className="size-4" />
          </Button>
        )}

        <Button onClick={handleSave} size="sm" variant="ghost">
          <Save className="size-4" />
          Save
        </Button>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Empty: too few players */}
        {tooFewPlayers && isViewingCurrent && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-warning">
              Add at least 2 players to pair a round.
            </p>
          </div>
        )}

        {/* Empty: round not yet paired */}
        {!tooFewPlayers && notYetPaired && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-text-secondary">
              Round {round + 1} has not been paired yet.
            </p>
            <Button onClick={handlePairRound} size="sm">
              <Shuffle className="size-4" />
              Pair Round {round + 1}
            </Button>
          </div>
        )}

        {/* Pairings table */}
        {hasPairings && (
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-14 text-center text-xs uppercase text-text-secondary">
                      Board
                    </TableHead>
                    <TableHead className="text-xs uppercase text-text-secondary">
                      White
                    </TableHead>
                    <TableHead className="w-20 text-right text-xs uppercase text-text-secondary">
                      Rating
                    </TableHead>
                    <TableHead className="w-16 text-right text-xs uppercase text-text-secondary">
                      Pts
                    </TableHead>
                    <TableHead className="w-44 text-center text-xs uppercase text-text-secondary">
                      Result
                    </TableHead>
                    <TableHead className="w-16 text-right text-xs uppercase text-text-secondary">
                      Pts
                    </TableHead>
                    <TableHead className="w-20 text-right text-xs uppercase text-text-secondary">
                      Rating
                    </TableHead>
                    <TableHead className="text-xs uppercase text-text-secondary">
                      Black
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPairings.map((pairing, index) => {
                    const whitePlayer = playerMap.get(pairing.white);
                    const blackPlayer = playerMap.get(pairing.black);
                    const gameResult = gameMap.get(
                      `${pairing.white}-${pairing.black}`,
                    );
                    const currentKey = gameResultToKey(gameResult);

                    const whitePoints = tournament
                      ? calcPoints(pairing.white, tournament.games)
                      : 0;
                    const blackPoints = tournament
                      ? calcPoints(pairing.black, tournament.games)
                      : 0;

                    return (
                      <TableRow
                        className="border-border hover:bg-bg-elevated"
                        key={`${pairing.white}-${pairing.black}`}
                      >
                        {/* Board */}
                        <TableCell className="text-center tabular-nums text-text-secondary">
                          {index + 1}
                        </TableCell>

                        {/* White player */}
                        <TableCell>
                          <span className="mr-2 inline-block size-2 rounded-full bg-white-piece" />
                          {whitePlayer?.name ?? pairing.white}
                        </TableCell>

                        {/* White rating */}
                        <TableCell className="text-right tabular-nums text-text-secondary">
                          {whitePlayer?.rating ?? '—'}
                        </TableCell>

                        {/* White points */}
                        <TableCell className="text-right tabular-nums text-text-secondary">
                          {whitePoints % 1 === 0
                            ? whitePoints
                            : whitePoints.toFixed(1)}
                        </TableCell>

                        {/* Result select */}
                        <TableCell className="text-center">
                          <Select
                            disabled={!isViewingCurrent}
                            value={currentKey}
                            onValueChange={(value) => {
                              handleResultChange(
                                pairing.white,
                                pairing.black,
                                value as ResultKey,
                              );
                            }}
                          >
                            <SelectTrigger
                              className={`w-full text-xs ${resultColorClass(currentKey)}`}
                            >
                              <SelectValue>
                                <span className={resultColorClass(currentKey)}>
                                  {resultDisplayLabel(currentKey)}
                                </span>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {RESULT_OPTIONS.filter(
                                (option) =>
                                  option.value !== 'none' ||
                                  currentKey === 'none',
                              ).map((option) => (
                                <SelectItem
                                  className={
                                    option.value === 'none'
                                      ? ''
                                      : resultColorClass(option.value)
                                  }
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Black points */}
                        <TableCell className="text-right tabular-nums text-text-secondary">
                          {blackPoints % 1 === 0
                            ? blackPoints
                            : blackPoints.toFixed(1)}
                        </TableCell>

                        {/* Black rating */}
                        <TableCell className="text-right tabular-nums text-text-secondary">
                          {blackPlayer?.rating ?? '—'}
                        </TableCell>

                        {/* Black player */}
                        <TableCell>
                          <span className="mr-2 inline-block size-2 rounded-full bg-black-piece" />
                          {blackPlayer?.name ?? pairing.black}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Bye rows */}
                  {displayByes.map((bye) => {
                    const byePlayer = playerMap.get(bye.player);
                    return (
                      <TableRow
                        className="border-border bg-bg-primary/50 hover:bg-bg-elevated"
                        key={`bye-${bye.player}`}
                      >
                        <TableCell className="text-center tabular-nums text-text-muted">
                          —
                        </TableCell>
                        <TableCell className="text-text-secondary">
                          <span className="mr-2 inline-block size-2 rounded-full bg-white-piece opacity-40" />
                          {byePlayer?.name ?? bye.player}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-text-muted">
                          {byePlayer?.rating ?? '—'}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-center text-xs font-medium text-text-muted">
                          BYE
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── Footer cards ── */}
        {hasPairings && (
          <div className="flex gap-4">
            {/* Keyboard shortcuts */}
            <Card className="flex-1 p-4">
              <p className="mb-2 text-xs font-medium text-text-secondary uppercase">
                Keyboard Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    1
                  </kbd>
                  <span className="text-text-secondary">= 1-0</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    2
                  </kbd>
                  <span className="text-text-secondary">= ½-½</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    3
                  </kbd>
                  <span className="text-text-secondary">= 0-1</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    0
                  </kbd>
                  <span className="text-text-secondary">= Clear</span>
                </div>
              </div>
            </Card>

            {/* Round status */}
            <Card className="flex-1 p-4">
              <p className="mb-2 text-xs font-medium text-text-secondary uppercase">
                Round Status
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total boards</span>
                  <span className="tabular-nums font-medium">
                    {totalBoards}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Results entered</span>
                  <span className="tabular-nums font-medium text-success">
                    {resultsEntered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pending</span>
                  <span
                    className={`tabular-nums font-medium ${pending > 0 ? 'text-warning' : 'text-text-muted'}`}
                  >
                    {pending}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export { RoundsView };
