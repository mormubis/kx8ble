import { ErrorBoundary } from '@/components/error-boundary.js';
import { RootLayout } from '@/components/layout/root-layout.js';
import { PlayerManagement } from '@/components/tournament/player-management.js';
import { RoundsView } from '@/components/tournament/rounds-view.js';
import { StandingsView } from '@/components/tournament/standings-view.js';
import { TournamentSetup } from '@/components/tournament/tournament-setup.js';
import { TabsProvider } from '@/context/tabs-context.js';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts.js';
import { useTabs } from '@/hooks/use-tabs.js';
import type { Screen } from '@/types/index.js';

import type { JSX } from 'react';

const SCREENS: Record<Screen, () => JSX.Element> = {
  home: TournamentSetup,
  players: PlayerManagement,
  round: RoundsView,
  setup: TournamentSetup,
  standings: StandingsView,
};

function AppContent(): JSX.Element {
  const { screen } = useTabs();
  const CurrentScreen = SCREENS[screen];

  useKeyboardShortcuts();

  return (
    <RootLayout>
      <CurrentScreen />
    </RootLayout>
  );
}

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <TabsProvider>
        <AppContent />
      </TabsProvider>
    </ErrorBoundary>
  );
}

export default App;
