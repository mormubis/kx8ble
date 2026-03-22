import { CheckCircle, ChevronRight, Save } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { PairingsTable } from '@/components/tournament/pairings-table.js';
import { Button } from '@/components/ui/button.js';
import { useNavigation } from '@/hooks/use-navigation.js';
import { useTournament } from '@/hooks/use-tournament.js';

import type { JSX } from 'react';

function RoundView(): JSX.Element {
  const { navigate } = useNavigation();
  const {
    currentPairings,
    isComplete,
    metadata,
    pairRound,
    round,
    rounds,
    saveToFile,
    tournament,
  } = useTournament();

  const allResultsRecorded = useMemo(() => {
    if (!currentPairings || !tournament) {
      return false;
    }

    const roundGames = tournament.games.filter(
      (g) => g.round === tournament.currentRound,
    );

    return roundGames.length === currentPairings.pairings.length;
  }, [currentPairings, tournament]);

  const needsPairing = !currentPairings && !isComplete;

  const handlePairRound = useCallback(() => {
    pairRound();
  }, [pairRound]);

  const handleSave = useCallback(() => {
    void saveToFile();
  }, [saveToFile]);

  if (!tournament) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-text-secondary">No tournament in progress.</p>
          <Button
            onClick={() => {
              navigate('home');
            }}
            variant="secondary"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b border-border bg-bg-secondary px-6 py-4">
        <div className="flex-1">
          <h1 className="text-base font-semibold">
            {metadata?.name ?? 'Tournament'}
          </h1>
          <p className="text-xs text-text-secondary">
            Round {round} of {rounds}
          </p>
        </div>

        <Button onClick={handleSave} size="sm" variant="ghost">
          <Save className="size-4" />
          Save
        </Button>

        {isComplete ? (
          <Button
            onClick={() => {
              navigate('standings');
            }}
            size="sm"
          >
            <CheckCircle className="size-4" />
            Final Standings
          </Button>
        ) : needsPairing ? (
          <Button onClick={handlePairRound} size="sm">
            Pair Round {round + 1}
          </Button>
        ) : allResultsRecorded && !isComplete ? (
          <Button onClick={handlePairRound} size="sm">
            Next Round
            <ChevronRight className="size-4" />
          </Button>
        ) : undefined}
      </header>

      <div className="flex-1 overflow-auto p-6">
        {isComplete ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <CheckCircle className="size-12 text-success" />
            <h2 className="text-lg font-semibold">Tournament Complete</h2>
            <p className="text-sm text-text-secondary">
              All {rounds} rounds have been played.
            </p>
            <Button
              onClick={() => {
                navigate('standings');
              }}
            >
              View Final Standings
            </Button>
          </div>
        ) : (
          <PairingsTable />
        )}
      </div>
    </div>
  );
}

export { RoundView };
