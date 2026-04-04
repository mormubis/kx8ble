import { pair as dutch } from '@echecs/swiss';
import { Tournament } from '@echecs/tournament';
import { parse, stringify } from '@echecs/trf';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

import type {
  PlayerEntry,
  TournamentMetadata,
} from '@/context/tabs-context.js';

import type {
  Game,
  PairingResult,
  TournamentSnapshot,
} from '@echecs/tournament';
import type {
  ResultCode,
  RoundResult,
  Player as TrfPlayer,
  Tournament as TrfTournament,
} from '@echecs/trf';

/* ── Result code mapping ── */

function resultCodeToNumeric(
  code: ResultCode,
  color: 'b' | 'w' | '-',
): 0 | 0.5 | 1 {
  switch (code) {
    case '1':
    case '+':
    case 'F':
    case 'W': {
      return 1;
    }

    case '=':
    case 'D':
    case 'H': {
      return 0.5;
    }

    case '0':
    case '-':
    case 'L':
    case 'U':
    case 'Z': {
      return 0;
    }

    default: {
      // Exhaustive — should never reach here
      return color === 'w' ? 0 : 0;
    }
  }
}

function numericToResultCode(result: 0 | 0.5 | 1): ResultCode {
  if (result === 1) {
    return '1';
  }

  if (result === 0.5) {
    return '=';
  }

  return '0';
}

/* ── TRF → App State ── */

interface LoadResult {
  metadata: TournamentMetadata;
  players: PlayerEntry[];
  tournament: Tournament;
  trfSource: TrfTournament;
}

function trfToPlayers(trfPlayers: TrfPlayer[]): PlayerEntry[] {
  return trfPlayers.map((p) => ({
    federation: p.federation ?? '',
    id: String(p.pairingNumber),
    name: p.name,
    rating: p.rating ?? 0,
  }));
}

function trfToGames(trfPlayers: TrfPlayer[]): Game[][] {
  const roundMap = new Map<number, Game[]>();

  for (const player of trfPlayers) {
    for (const result of player.results) {
      // Only process from white's perspective to avoid duplicates
      if (result.color !== 'w' || result.opponentId === undefined) {
        continue;
      }

      // Skip byes (no opponent)
      if (result.opponentId === null) {
        continue;
      }

      const game: Game = {
        black: String(result.opponentId),
        result: resultCodeToNumeric(result.result, 'w'),
        white: String(player.pairingNumber),
      };

      const roundGames = roundMap.get(result.round) ?? [];
      roundGames.push(game);
      roundMap.set(result.round, roundGames);
    }
  }

  if (roundMap.size === 0) {
    return [];
  }

  const maxRound = Math.max(...roundMap.keys());
  const games: Game[][] = [];

  for (let r = 1; r <= maxRound; r++) {
    games.push(roundMap.get(r) ?? []);
  }

  return games;
}

function trfToRoundPairings(
  trfPlayers: TrfPlayer[],
  totalRounds: number,
): Record<string, PairingResult> {
  const roundPairings: Record<string, PairingResult> = {};

  for (let round = 1; round <= totalRounds; round++) {
    const pairings: PairingResult['pairings'] = [];
    const byes: PairingResult['byes'] = [];
    const seen = new Set<string>();

    for (const player of trfPlayers) {
      const result = player.results.find((r) => r.round === round);

      if (!result) {
        continue;
      }

      if (result.opponentId === null) {
        byes.push({ player: String(player.pairingNumber) });
        continue;
      }

      const pairKey =
        result.color === 'w'
          ? `${player.pairingNumber}-${result.opponentId}`
          : `${result.opponentId}-${player.pairingNumber}`;

      if (seen.has(pairKey)) {
        continue;
      }

      seen.add(pairKey);

      if (result.color === 'w') {
        pairings.push({
          black: String(result.opponentId),
          white: String(player.pairingNumber),
        });
      } else {
        pairings.push({
          black: String(player.pairingNumber),
          white: String(result.opponentId),
        });
      }
    }

    if (pairings.length > 0 || byes.length > 0) {
      roundPairings[String(round)] = { byes, pairings };
    }
  }

  return roundPairings;
}

function detectCurrentRound(
  trfPlayers: TrfPlayer[],
  totalRounds: number,
): number {
  // Find the last round that has any results
  for (let round = totalRounds; round >= 1; round--) {
    const hasResults = trfPlayers.some((p) =>
      p.results.some((r) => r.round === round),
    );

    if (hasResults) {
      return round;
    }
  }

  return 0;
}

/* ── App State → TRF ── */

function appToTrf(
  tournament: Tournament,
  metadata: TournamentMetadata,
  players: PlayerEntry[],
  trfSource?: TrfTournament,
): TrfTournament {
  const allRoundGames = tournament.games;

  const trfPlayers: TrfPlayer[] = players.map((p, index) => {
    const pairingNumber = index + 1;

    const results: RoundResult[] = [];

    for (const [roundIndex, allRoundGame] of allRoundGames.entries()) {
      const roundNumber = roundIndex + 1;
      const roundGames = allRoundGame ?? [];

      for (const g of roundGames) {
        if (g.white !== p.id && g.black !== p.id) {
          continue;
        }

        const isWhite = g.white === p.id;
        const opponentId = isWhite ? g.black : g.white;
        const opponentPlayer = players.findIndex((op) => op.id === opponentId);
        const result = isWhite
          ? g.result
          : g.result === 1
            ? 0
            : g.result === 0
              ? 1
              : 0.5;

        results.push({
          color: (isWhite ? 'w' : 'b') as 'b' | 'w',
          opponentId: opponentPlayer + 1,
          result: numericToResultCode(result as 0 | 0.5 | 1),
          round: roundNumber,
        });
      }
    }

    const standings = tournament.standings();
    const standing = standings.find((s) => s.player === p.id);

    return {
      federation: p.federation || undefined,
      name: p.name,
      pairingNumber,
      points: standing?.score ?? 0,
      rank: standing?.rank ?? pairingNumber,
      rating: p.rating || undefined,
      results,
    };
  });

  return {
    ...trfSource,
    name: metadata.name,
    players: trfPlayers,
    rounds: tournament.rounds,
    version: trfSource?.version ?? 'TRF16',
  };
}

/* ── File I/O ── */

async function openTournament(): Promise<LoadResult | undefined> {
  const filePath = await open({
    filters: [{ extensions: ['trf'], name: 'FIDE Tournament Report File' }],
    multiple: false,
    title: 'Open Tournament',
  });

  if (!filePath) {
    return undefined;
  }

  const content = await readTextFile(filePath);
  const trfTournament = parse(content);

  if (!trfTournament) {
    throw new Error('Failed to parse TRF file');
  }

  const players = trfToPlayers(trfTournament.players);
  const games = trfToGames(trfTournament.players);
  const roundPairings = trfToRoundPairings(
    trfTournament.players,
    trfTournament.rounds,
  );
  const currentRound = detectCurrentRound(
    trfTournament.players,
    trfTournament.rounds,
  );

  const snapshot: TournamentSnapshot = {
    currentRound,
    games,
    players: players.map((p) => ({
      id: p.id,
      rating: p.rating || undefined,
    })),
    roundPairings,
    rounds: trfTournament.rounds,
  };

  const tournament = Tournament.fromJSON(snapshot, dutch);

  return {
    metadata: {
      arbiter: trfTournament.chiefArbiter ?? '',
      director: '',
      endDate: trfTournament.endDate ?? '',
      federation: trfTournament.federation ?? '',
      fideRated: false,
      location: trfTournament.city ?? '',
      name: trfTournament.name ?? 'Unnamed Tournament',
      nationallyRated: false,
      organizer: '',
      pairingSystem: 'dutch',
      startDate: trfTournament.startDate ?? '',
      timeControl: trfTournament.timeControl ?? '',
      timeControlType: 'standard',
      tournamentType: 'individual-swiss',
    },
    players,
    tournament,
    trfSource: trfTournament,
  };
}

async function saveTournament(
  tournament: Tournament,
  metadata: TournamentMetadata,
  players: PlayerEntry[],
  trfSource?: TrfTournament,
): Promise<string | undefined> {
  const filePath = await save({
    defaultPath: `${metadata.name.replaceAll(/\s+/g, '-')}.trf`,
    filters: [{ extensions: ['trf'], name: 'FIDE Tournament Report File' }],
    title: 'Save Tournament',
  });

  if (!filePath) {
    return undefined;
  }

  const trfTournament = appToTrf(tournament, metadata, players, trfSource);
  const content = stringify(trfTournament);

  await writeTextFile(filePath, content);

  return filePath;
}

export { openTournament, saveTournament };
export type { LoadResult };
