import { ErrorBoundary } from '@/components/error-boundary.js';
import { HomePage } from '@/components/home/home-page.js';
import { Sidebar } from '@/components/layout/sidebar.js';
import { TabBar } from '@/components/layout/tab-bar.js';
import { SetupPage } from '@/components/setup/setup-page.js';
import { RoundView } from '@/components/tournament/round-view.js';
import { StandingsTable } from '@/components/tournament/standings-table.js';
import { TabsProvider } from '@/context/tabs-context.js';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts.js';
import { useTabs } from '@/hooks/use-tabs.js';
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
  const { screen, tournament } = useTabs();
  const CurrentScreen = SCREENS[screen];

  useKeyboardShortcuts();

  // Show sidebar when inside a tournament (even on home/setup screens),
  // so the user can always navigate back to rounds/standings.
  const showSidebar =
    tournament !== undefined && screen !== 'setup' && screen !== 'players';

  return (
    <div className="flex h-full flex-col">
      <TabBar />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <CurrentScreen />
        </main>
      </div>
    </div>
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
