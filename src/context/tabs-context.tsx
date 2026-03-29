import { pair as dutch } from '@echecs/swiss';
import { Tournament } from '@echecs/tournament';
import { nanoid } from 'nanoid';
import { createContext, useCallback, useMemo, useRef, useState } from 'react';

import { openTournament, saveTournament } from '@/lib/file.js';
import { DEFAULT_TIEBREAK_IDS, resolveTiebreaks } from '@/lib/tiebreaks.js';
import type { Screen } from '@/types/index.js';

import type {
  Game,
  PairingResult,
  Player,
  Standing,
} from '@echecs/tournament';
import type { Tournament as TrfTournament } from '@echecs/trf';
import type { JSX, ReactNode } from 'react';

/* ── Types ── */

interface TournamentMetadata {
  createdAt: string;
  name: string;
}

interface PlayerEntry {
  federation: string;
  id: string;
  name: string;
  rating: number;
}

interface TabState {
  currentPairings: PairingResult | undefined;
  id: string;
  metadata: TournamentMetadata | undefined;
  players: PlayerEntry[];
  screen: Screen;
  selectedTiebreaks: string[];
  viewingRound: number;
}

/* ── Mutable refs per tab (not in React state) ── */

interface TabReferences {
  tournament: Tournament | undefined;
  trfSource: TrfTournament | undefined;
}

/* ── Context ── */

interface TabsContextValue {
  /* Tab management */
  activeTab: TabState | undefined;
  closeTab: (id: string) => void;
  createTab: () => string;
  selectTab: (id: string) => void;
  tabs: TabState[];

  /* Navigation (active tab) */
  navigate: (screen: Screen) => void;

  /* Tournament (active tab) */
  addPlayer: (player: PlayerEntry) => void;
  addTiebreak: (id: string) => void;
  allResultsRecorded: boolean;
  currentPairings: PairingResult | undefined;
  isComplete: boolean;
  loadFromFile: () => Promise<boolean>;
  metadata: TournamentMetadata | undefined;
  pairRound: () => void;
  players: PlayerEntry[];
  recordResult: (game: Game) => void;
  removePlayer: (id: string) => void;
  removeTiebreak: (id: string) => void;
  reorderTiebreak: (id: string, direction: 'up' | 'down') => void;
  round: number;
  rounds: number;
  saveToFile: () => Promise<boolean>;
  screen: Screen;
  selectedTiebreaks: string[];
  setViewingRound: (round: number) => void;
  standings: Standing[];
  startTournament: (metadata: TournamentMetadata, rounds: number) => void;
  tournament: Tournament | undefined;
  updatePlayer: (player: PlayerEntry) => void;
  viewingRound: number;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function makeTab(): TabState {
  return {
    currentPairings: undefined,
    id: nanoid(),
    metadata: undefined,
    players: [],
    screen: 'home',
    selectedTiebreaks: DEFAULT_TIEBREAK_IDS,
    viewingRound: 0,
  };
}

interface TabsProviderProperties {
  children: ReactNode;
}

function TabsProvider({ children }: TabsProviderProperties): JSX.Element {
  const [tabs, setTabs] = useState<TabState[]>(() => {
    const initial = makeTab();
    return [initial];
  });
  const [activeTabId, setActiveTabId] = useState(() => tabs[0]?.id ?? '');
  const [version, setVersion] = useState(0);

  // Mutable refs keyed by tab ID
  const referencesMap = useRef<Map<string, TabReferences>>(new Map());

  const bump = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const getReferences = useCallback((tabId: string): TabReferences => {
    let references = referencesMap.current.get(tabId);

    if (!references) {
      references = { tournament: undefined, trfSource: undefined };
      referencesMap.current.set(tabId, references);
    }

    return references;
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  /* ── Updater for active tab ── */
  const updateActiveTab = useCallback(
    (updater: (tab: TabState) => TabState) => {
      setTabs((previous) =>
        previous.map((t) => (t.id === activeTabId ? updater(t) : t)),
      );
    },
    [activeTabId],
  );

  /* ── Tab management ── */

  const createTab = useCallback((): string => {
    const tab = makeTab();
    getReferences(tab.id);
    setTabs((previous) => [...previous, tab]);
    setActiveTabId(tab.id);
    return tab.id;
  }, [getReferences]);

  const closeTab = useCallback(
    (id: string) => {
      referencesMap.current.delete(id);
      setTabs((previous) => {
        const next = previous.filter((t) => t.id !== id);

        if (next.length === 0) {
          setActiveTabId('');
          return [];
        }

        if (id === activeTabId) {
          const closedIndex = previous.findIndex((t) => t.id === id);
          const newActive =
            next[Math.min(closedIndex, next.length - 1)]?.id ?? next[0]?.id;

          if (newActive) {
            setActiveTabId(newActive);
          }
        }

        return next;
      });
    },
    [activeTabId, getReferences],
  );

  const selectTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  /* ── Navigation ── */

  const navigate = useCallback(
    (screen: Screen) => {
      updateActiveTab((t) => ({ ...t, screen }));
    },
    [updateActiveTab],
  );

  /* ── Tournament operations (all on active tab) ── */

  const addPlayer = useCallback(
    (player: PlayerEntry) => {
      updateActiveTab((t) => ({ ...t, players: [...t.players, player] }));
    },
    [updateActiveTab],
  );

  const removePlayer = useCallback(
    (id: string) => {
      updateActiveTab((t) => ({
        ...t,
        players: t.players.filter((p) => p.id !== id),
      }));
    },
    [updateActiveTab],
  );

  const updatePlayer = useCallback(
    (player: PlayerEntry) => {
      updateActiveTab((t) => ({
        ...t,
        players: t.players.map((p) => (p.id === player.id ? player : p)),
      }));
    },
    [updateActiveTab],
  );

  const startTournament = useCallback(
    (meta: TournamentMetadata, rounds: number) => {
      const references = getReferences(activeTabId);

      // Read current players from state synchronously
      const currentTab = tabs.find((t) => t.id === activeTabId);

      if (!currentTab) {
        return;
      }

      const tournamentPlayers: Player[] = currentTab.players.map((p) => ({
        id: p.id,
        rating: p.rating || undefined,
      }));

      references.tournament = new Tournament({
        pairingSystem: dutch,
        players: tournamentPlayers,
        rounds,
      });
      references.trfSource = undefined;

      updateActiveTab((t) => ({
        ...t,
        currentPairings: undefined,
        metadata: meta,
        viewingRound: 0,
      }));
      bump();
    },
    [activeTabId, bump, getReferences, tabs, updateActiveTab],
  );

  const pairRound = useCallback(() => {
    const references = getReferences(activeTabId);
    const t = references.tournament;

    if (!t) {
      return;
    }

    const pairings = t.pairRound();

    updateActiveTab((tab) => ({
      ...tab,
      currentPairings: pairings,
      viewingRound: t.currentRound,
    }));
    bump();
  }, [activeTabId, bump, getReferences, updateActiveTab]);

  const recordResult = useCallback(
    (game: Game) => {
      const references = getReferences(activeTabId);
      const t = references.tournament;

      if (!t) {
        return;
      }

      // The library appends games instead of replacing. If a result already
      // exists for this pairing, reconstruct the tournament with the updated
      // result to avoid duplicates.
      const currentRoundGames = t.games[t.currentRound - 1] ?? [];
      const alreadyRecorded = currentRoundGames.some(
        (g) => g.white === game.white && g.black === game.black,
      );

      if (alreadyRecorded) {
        const snapshot = t.toJSON();
        const roundIndex = t.currentRound - 1;

        snapshot.games[roundIndex] = snapshot.games[roundIndex].map((g) =>
          g.white === game.white && g.black === game.black
            ? { ...g, result: game.result }
            : g,
        );

        references.tournament = Tournament.fromJSON(snapshot, dutch);
      } else {
        t.recordResult(game);
      }

      bump();
    },
    [activeTabId, bump, getReferences],
  );

  const setViewingRound = useCallback(
    (round: number) => {
      updateActiveTab((t) => ({ ...t, viewingRound: round }));
    },
    [updateActiveTab],
  );

  const addTiebreak = useCallback(
    (id: string) => {
      updateActiveTab((tab) => {
        if (tab.selectedTiebreaks.includes(id)) return tab;
        return { ...tab, selectedTiebreaks: [...tab.selectedTiebreaks, id] };
      });
    },
    [updateActiveTab],
  );

  const removeTiebreak = useCallback(
    (id: string) => {
      updateActiveTab((tab) => ({
        ...tab,
        selectedTiebreaks: tab.selectedTiebreaks.filter((t) => t !== id),
      }));
    },
    [updateActiveTab],
  );

  const reorderTiebreak = useCallback(
    (id: string, direction: 'up' | 'down') => {
      updateActiveTab((tab) => {
        const list = [...tab.selectedTiebreaks];
        const index = list.indexOf(id);
        if (index === -1) return tab;
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= list.length) return tab;
        [list[index], list[target]] = [list[target], list[index]];
        return { ...tab, selectedTiebreaks: list };
      });
    },
    [updateActiveTab],
  );

  const saveToFile = useCallback(async (): Promise<boolean> => {
    const references = getReferences(activeTabId);
    const t = references.tournament;

    if (!t || !activeTab?.metadata) {
      return false;
    }

    const path = await saveTournament(
      t,
      activeTab.metadata,
      activeTab.players,
      references.trfSource,
    );

    return path !== undefined;
  }, [activeTab?.metadata, activeTab?.players, activeTabId, getReferences]);

  const loadFromFile = useCallback(async (): Promise<boolean> => {
    const result = await openTournament();

    if (!result) {
      return false;
    }

    // Create a new tab for the loaded tournament
    const tab = makeTab();
    const references = getReferences(tab.id);
    references.tournament = result.tournament;
    references.trfSource = result.trfSource;

    // Restore currentPairings from the loaded tournament's current round
    const snapshot = result.tournament.toJSON();
    const currentRoundPairings =
      snapshot.roundPairings[String(snapshot.currentRound)];

    setTabs((previous) => [
      ...previous,
      {
        ...tab,
        currentPairings: currentRoundPairings,
        metadata: result.metadata,
        players: result.players,
        screen: 'round' as Screen,
        viewingRound: snapshot.currentRound,
      },
    ]);
    setActiveTabId(tab.id);
    bump();

    return true;
  }, [bump, getReferences]);

  /* ── Derived values from active tab ── */

  const activeReferences = activeTabId ? getReferences(activeTabId) : undefined;
  const tournament = activeReferences?.tournament;

  const standings = useMemo<Standing[]>(() => {
    if (!tournament) {
      return [];
    }

    const tiebreakFns = resolveTiebreaks(activeTab?.selectedTiebreaks ?? []);
    return tournament.standings(tiebreakFns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab?.selectedTiebreaks, tournament, version]);

  const round = tournament?.currentRound ?? 0;
  const rounds = tournament?.rounds ?? 0;
  const isComplete = tournament?.isComplete ?? false;

  const allResultsRecorded = useMemo(() => {
    const pairings = activeTab?.currentPairings;

    if (!pairings || !tournament) {
      return false;
    }

    const roundGames = tournament.games[tournament.currentRound - 1] ?? [];

    return roundGames.length === pairings.pairings.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab?.currentPairings, tournament, version]);

  const value = useMemo<TabsContextValue>(
    () => ({
      activeTab,
      addPlayer,
      addTiebreak,
      allResultsRecorded,
      closeTab,
      createTab,
      currentPairings: activeTab?.currentPairings,
      isComplete,
      loadFromFile,
      metadata: activeTab?.metadata,
      navigate,
      pairRound,
      players: activeTab?.players ?? [],
      recordResult,
      removePlayer,
      removeTiebreak,
      reorderTiebreak,
      round,
      rounds,
      saveToFile,
      screen: activeTab?.screen ?? 'home',
      selectTab,
      selectedTiebreaks: activeTab?.selectedTiebreaks ?? [],
      setViewingRound,
      standings,
      startTournament,
      tabs,
      tournament,
      updatePlayer,
      viewingRound: activeTab?.viewingRound ?? 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      activeTab,
      addPlayer,
      addTiebreak,
      allResultsRecorded,
      closeTab,
      createTab,
      isComplete,
      loadFromFile,
      navigate,
      pairRound,
      recordResult,
      removePlayer,
      removeTiebreak,
      reorderTiebreak,
      round,
      rounds,
      saveToFile,
      selectTab,
      setViewingRound,
      standings,
      startTournament,
      tabs,
      tournament,
      updatePlayer,
      version,
    ],
  );

  return <TabsContext value={value}>{children}</TabsContext>;
}

export { TabsContext, TabsProvider };
export type { PlayerEntry, TabsContextValue, TabState, TournamentMetadata };
