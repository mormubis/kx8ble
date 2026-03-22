import { buchholz, dutch } from '@echecs/swiss';
import { Tournament } from '@echecs/tournament';
import { createContext, useCallback, useMemo, useReducer } from 'react';

import { loadTournament, saveTournament } from '@/lib/file.js';

import type {
  Game,
  PairingResult,
  Player,
  Standing,
  Tiebreak,
} from '@echecs/tournament';
import type { JSX, ReactNode } from 'react';

/* ── State ── */

interface TournamentMetadata {
  createdAt: string;
  name: string;
}

interface TournamentState {
  currentPairings: PairingResult | undefined;
  metadata: TournamentMetadata | undefined;
  players: PlayerEntry[];
  tournament: Tournament | undefined;
}

/** Extended player with app-local display fields */
interface PlayerEntry {
  federation: string;
  id: string;
  name: string;
  rating: number;
}

/* ── Actions ── */

type TournamentAction =
  | { player: PlayerEntry; type: 'ADD_PLAYER' }
  | { id: string; type: 'REMOVE_PLAYER' }
  | { player: PlayerEntry; type: 'UPDATE_PLAYER' }
  | { type: 'START_TOURNAMENT'; metadata: TournamentMetadata; rounds: number }
  | { type: 'PAIR_ROUND' }
  | { game: Omit<Game, 'round'>; type: 'RECORD_RESULT' }
  | {
      metadata: TournamentMetadata;
      tournament: Tournament;
      type: 'LOAD_TOURNAMENT';
      players: PlayerEntry[];
    };

const INITIAL_STATE: TournamentState = {
  currentPairings: undefined,
  metadata: undefined,
  players: [],
  tournament: undefined,
};

function reducer(
  state: TournamentState,
  action: TournamentAction,
): TournamentState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      return { ...state, players: [...state.players, action.player] };
    }

    case 'LOAD_TOURNAMENT': {
      return {
        ...state,
        metadata: action.metadata,
        players: action.players,
        tournament: action.tournament,
      };
    }

    case 'PAIR_ROUND': {
      if (!state.tournament) {
        return state;
      }

      const pairings = state.tournament.pairRound();

      return { ...state, currentPairings: pairings };
    }

    case 'RECORD_RESULT': {
      if (!state.tournament) {
        return state;
      }

      state.tournament.recordResult(action.game);

      return { ...state };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };
    }

    case 'START_TOURNAMENT': {
      const tournamentPlayers: Player[] = state.players.map((p) => ({
        id: p.id,
        rating: p.rating || undefined,
      }));

      const tournament = new Tournament({
        pairingSystem: dutch,
        players: tournamentPlayers,
        rounds: action.rounds,
      });

      return {
        ...state,
        currentPairings: undefined,
        metadata: action.metadata,
        tournament,
      };
    }

    case 'UPDATE_PLAYER': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.player.id ? action.player : p,
        ),
      };
    }

    default: {
      return state;
    }
  }
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
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const addPlayer = useCallback((player: PlayerEntry) => {
    dispatch({ player, type: 'ADD_PLAYER' });
  }, []);

  const removePlayer = useCallback((id: string) => {
    dispatch({ id, type: 'REMOVE_PLAYER' });
  }, []);

  const updatePlayer = useCallback((player: PlayerEntry) => {
    dispatch({ player, type: 'UPDATE_PLAYER' });
  }, []);

  const startTournament = useCallback(
    (metadata: TournamentMetadata, rounds: number) => {
      dispatch({ metadata, rounds, type: 'START_TOURNAMENT' });
    },
    [],
  );

  const pairRound = useCallback(() => {
    dispatch({ type: 'PAIR_ROUND' });
  }, []);

  const recordResult = useCallback((game: Omit<Game, 'round'>) => {
    dispatch({ game, type: 'RECORD_RESULT' });
  }, []);

  const saveToFile = useCallback(async (): Promise<boolean> => {
    if (!state.tournament || !state.metadata) {
      return false;
    }

    const path = await saveTournament(
      state.tournament,
      state.metadata,
      state.players,
    );

    return path !== undefined;
  }, [state.metadata, state.players, state.tournament]);

  const loadFromFile = useCallback(async (): Promise<boolean> => {
    const result = await loadTournament();

    if (!result) {
      return false;
    }

    dispatch({
      metadata: result.metadata,
      players: result.players,
      tournament: result.tournament,
      type: 'LOAD_TOURNAMENT',
    });

    return true;
  }, []);

  const standings = useMemo(() => {
    if (!state.tournament) {
      return [];
    }

    return state.tournament.standings(DEFAULT_TIEBREAKS);
  }, [state.tournament]);

  const round = state.tournament?.currentRound ?? 0;
  const rounds = state.tournament?.rounds ?? 0;
  const isComplete = state.tournament?.isComplete ?? false;

  const value = useMemo<TournamentContextValue>(
    () => ({
      addPlayer,
      currentPairings: state.currentPairings,
      isComplete,
      loadFromFile,
      metadata: state.metadata,
      pairRound,
      players: state.players,
      recordResult,
      removePlayer,
      round,
      rounds,
      saveToFile,
      standings,
      startTournament,
      tournament: state.tournament,
      updatePlayer,
    }),
    [
      addPlayer,
      isComplete,
      loadFromFile,
      pairRound,
      recordResult,
      removePlayer,
      round,
      rounds,
      saveToFile,
      standings,
      startTournament,
      state.currentPairings,
      state.metadata,
      state.players,
      state.tournament,
      updatePlayer,
    ],
  );

  return <TournamentContext value={value}>{children}</TournamentContext>;
}

export { TournamentContext, TournamentProvider };
export type { PlayerEntry, TournamentContextValue, TournamentMetadata };
