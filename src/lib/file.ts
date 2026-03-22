import { dutch } from '@echecs/swiss';
import { Tournament } from '@echecs/tournament';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

import type {
  PlayerEntry,
  TournamentMetadata,
} from '@/context/tournament-context.js';

import type { TournamentSnapshot } from '@echecs/tournament';

/** File format version */
const FILE_VERSION = 1;

interface EchecsFile {
  metadata: TournamentMetadata;
  players: PlayerEntry[];
  tournament: TournamentSnapshot;
  version: number;
}

interface LoadResult {
  metadata: TournamentMetadata;
  players: PlayerEntry[];
  tournament: Tournament;
}

async function saveTournament(
  tournament: Tournament,
  metadata: TournamentMetadata,
  players: PlayerEntry[],
): Promise<string | undefined> {
  const filePath = await save({
    defaultPath: `${metadata.name.replaceAll(/\s+/g, '-')}.echecs`,
    filters: [{ extensions: ['echecs'], name: 'Echecs Tournament' }],
    title: 'Save Tournament',
  });

  if (!filePath) {
    return undefined;
  }

  const data: EchecsFile = {
    metadata,
    players,
    tournament: tournament.toJSON(),
    version: FILE_VERSION,
  };

  await writeTextFile(filePath, JSON.stringify(data, undefined, 2));

  return filePath;
}

async function loadTournament(): Promise<LoadResult | undefined> {
  const filePath = await open({
    filters: [{ extensions: ['echecs'], name: 'Echecs Tournament' }],
    multiple: false,
    title: 'Open Tournament',
  });

  if (!filePath) {
    return undefined;
  }

  const content = await readTextFile(filePath);
  const data = JSON.parse(content) as EchecsFile;

  if (data.version !== FILE_VERSION) {
    throw new RangeError(`Unsupported file version: ${String(data.version)}`);
  }

  const tournament = Tournament.fromJSON(data.tournament, dutch);

  return {
    metadata: data.metadata,
    players: data.players,
    tournament,
  };
}

export { loadTournament, saveTournament };
