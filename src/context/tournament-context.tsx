import { buchholz, dutch } from '@echecs/swiss';
import { Tournament } from '@echecs/tournament';
import { createContext, useCallback, useMemo, useRef, useState } from 'react';

import { openTournament, saveTournament } from '@/lib/file.js';

import type {
  Game,
  PairingResult,
  Player,
  Standing,
  Tiebreak,
} from '@echecs/tournament';
import type { Tournament as TrfTournament } from '@echecs/trf';
import type { JSX, ReactNode } from 'react';

/* ── Types ── */

interface TournamentMetadata {
  createdAt: string;
  name: string;
}

/** Extended player with app-local display fields */
interface PlayerEntry {
  federation: string;
  id: string;
  name: string;
  rating: number;
}

/* ── Context ── */

interface TournamentContextValue {
  addPlayer: (player: PlayerEntry) => void;
  currentPairings: PairingResult | undefined;
  isComplete: boolean;
  loadFromFile: () => Promise<boolean>;
  metadata: TournamentMetadata | undefined;
  pairRound: () => void;
  players: PlayerEntry[];
  recordResult: (game: Omit<Game, 'round'>) => void;
  removePlayer: (id: string) => void;
  round: number;
  rounds: number;
  saveToFile: () => Promise<boolean>;
  standings: Standing[];
  startTournament: (metadata: TournamentMetadata, rounds: number) => void;
  tournament: Tournament | undefined;
  updatePlayer: (player: PlayerEntry) => void;
}

const TournamentContext = createContext<TournamentContextValue | undefined>(
  undefined,
);

const DEFAULT_TIEBREAKS: Tiebreak[] = [buchholz];

interface TournamentProviderProperties {
  children: ReactNode;
}

function TournamentProvider({
  children,
}: TournamentProviderProperties): JSX.Element {
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [metadata, setMetadata] = useState<TournamentMetadata>();
  const [currentPairings, setCurrentPairings] = useState<PairingResult>();

  // Tournament is a mutable object — keep in a ref and use a version counter
  // to signal React when it changes.
  const tournamentReference = useRef<Tournament | undefined>(undefined);
  const trfSourceReference = useRef<TrfTournament | undefined>(undefined);
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const tournament = tournamentReference.current;

  const addPlayer = useCallback((player: PlayerEntry) => {
    setPlayers((previous) => [...previous, player]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((previous) => previous.filter((p) => p.id !== id));
  }, []);

  const updatePlayer = useCallback((player: PlayerEntry) => {
    setPlayers((previous) =>
      previous.map((p) => (p.id === player.id ? player : p)),
    );
  }, []);

  const startTournament = useCallback(
    (meta: TournamentMetadata, rounds: number) => {
      setPlayers((current) => {
        const tournamentPlayers: Player[] = current.map((p) => ({
          id: p.id,
          rating: p.rating || undefined,
        }));

        tournamentReference.current = new Tournament({
          pairingSystem: dutch,
          players: tournamentPlayers,
          rounds,
        });

        return current;
      });

      trfSourceReference.current = undefined;
      setMetadata(meta);
      setCurrentPairings(undefined);
      bump();
    },
    [bump],
  );

  const pairRound = useCallback(() => {
    const t = tournamentReference.current;

    if (!t) {
      return;
    }

    const pairings = t.pairRound();
    setCurrentPairings(pairings);
    bump();
  }, [bump]);

  const recordResult = useCallback(
    (game: Omit<Game, 'round'>) => {
      const t = tournamentReference.current;

      if (!t) {
        return;
      }

      t.recordResult(game);
      bump();
    },
    [bump],
  );

  const saveToFile = useCallback(async (): Promise<boolean> => {
    const t = tournamentReference.current;

    if (!t || !metadata) {
      return false;
    }

    const path = await saveTournament(
      t,
      metadata,
      players,
      trfSourceReference.current,
    );

    return path !== undefined;
  }, [metadata, players]);

  const loadFromFile = useCallback(async (): Promise<boolean> => {
    const result = await openTournament();

    if (!result) {
      return false;
    }

    tournamentReference.current = result.tournament;
    trfSourceReference.current = result.trfSource;
    setMetadata(result.metadata);
    setPlayers(result.players);
    setCurrentPairings(undefined);
    bump();

    return true;
  }, [bump]);

  const standings = useMemo<Standing[]>(() => {
    if (!tournament) {
      return [];
    }

    return tournament.standings(DEFAULT_TIEBREAKS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament, version]);

  const round = tournament?.currentRound ?? 0;
  const rounds = tournament?.rounds ?? 0;
  const isComplete = tournament?.isComplete ?? false;

  const value = useMemo<TournamentContextValue>(
    () => ({
      addPlayer,
      currentPairings,
      isComplete,
      loadFromFile,
      metadata,
      pairRound,
      players,
      recordResult,
      removePlayer,
      round,
      rounds,
      saveToFile,
      standings,
      startTournament,
      tournament,
      updatePlayer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      addPlayer,
      currentPairings,
      isComplete,
      loadFromFile,
      metadata,
      pairRound,
      players,
      recordResult,
      removePlayer,
      round,
      rounds,
      saveToFile,
      standings,
      startTournament,
      tournament,
      updatePlayer,
      version,
    ],
  );

  return <TournamentContext value={value}>{children}</TournamentContext>;
}

export { TournamentContext, TournamentProvider };
export type { PlayerEntry, TournamentContextValue, TournamentMetadata };
