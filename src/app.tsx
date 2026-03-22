import { HomePage } from '@/components/home/home-page.js';
import { Sidebar } from '@/components/layout/sidebar.js';
import { SetupPage } from '@/components/setup/setup-page.js';
import { RoundView } from '@/components/tournament/round-view.js';
import { StandingsTable } from '@/components/tournament/standings-table.js';
import { NavigationProvider } from '@/context/navigation-context.js';
import { TournamentProvider } from '@/context/tournament-context.js';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts.js';
import { useNavigation } from '@/hooks/use-navigation.js';
import type { Screen } from '@/types/index.js';

import type { JSX } from 'react';

const SCREENS: Record<Screen, () => JSX.Element> = {
  home: HomePage,
  players: SetupPage,
  round: RoundView,
  setup: SetupPage,
  standings: StandingsTable,
};

function AppContent(): JSX.Element {
  const { screen } = useNavigation();
  const CurrentScreen = SCREENS[screen];

  useKeyboardShortcuts();

  const showSidebar = screen !== 'home' && screen !== 'setup';

  return (
    <div className="flex h-full">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <CurrentScreen />
      </main>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <TournamentProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </TournamentProvider>
  );
}

export default App;
