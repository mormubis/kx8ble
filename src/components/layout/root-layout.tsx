import {
  BarChart3,
  FileText,
  FolderOpen,
  Grid3x3,
  Plus,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button.js';
import { useTabs } from '@/hooks/use-tabs.js';
import { cn } from '@/lib/utilities.js';
import type { Screen } from '@/types/index.js';

import type { JSX, ReactNode } from 'react';

interface NavItem {
  icon: typeof FileText;
  label: string;
  screen: Screen;
}

const NAV_ITEMS: NavItem[] = [
  { icon: FileText, label: 'Setup', screen: 'setup' },
  { icon: Users, label: 'Players', screen: 'players' },
  { icon: Grid3x3, label: 'Rounds', screen: 'round' },
  { icon: BarChart3, label: 'Standings', screen: 'standings' },
];

interface RootLayoutProperties {
  children?: ReactNode;
}

function RootLayout({ children }: RootLayoutProperties): JSX.Element {
  const {
    activeTab,
    closeTab,
    createTab,
    loadFromFile,
    navigate,
    screen,
    selectTab,
    tabs,
  } = useTabs();

  function handleNewTournament() {
    createTab();
    navigate('setup');
  }

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar — brand + tournament tabs + actions */}
      <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="mr-1 text-sm font-semibold text-text-primary">
          Kx8ble
        </span>

        {/* Tournament tabs */}
        {tabs.map((tab) => (
          <button
            className={cn(
              'group relative flex shrink-0 items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition-colors',
              tab.id === activeTab?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
            )}
            key={tab.id}
            onClick={() => {
              selectTab(tab.id);
            }}
            type="button"
          >
            <span className="max-w-40 truncate">
              {tab.metadata?.name ?? 'Untitled'}
            </span>
            <span
              className={cn(
                'ml-1 flex size-4 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100',
                tab.id === activeTab?.id
                  ? 'hover:bg-primary-foreground/20'
                  : 'hover:bg-bg-elevated',
              )}
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                  closeTab(tab.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <X className="size-3" />
            </span>
          </button>
        ))}

        {/* Tab actions */}
        <Button
          className="size-7"
          onClick={handleNewTournament}
          size="icon"
          variant="ghost"
        >
          <Plus className="size-4" />
        </Button>

        <div className="flex-1" />

        <Button
          onClick={() => {
            void loadFromFile();
          }}
          size="sm"
          variant="ghost"
        >
          <FolderOpen className="size-4" />
          Open
        </Button>
      </header>

      {/* Navigation bar — show when any tab is active */}
      {activeTab !== undefined && (
        <nav className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-4">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.screen}
              onClick={() => {
                navigate(item.screen);
              }}
              size="sm"
              variant={screen === item.screen ? 'secondary' : 'ghost'}
            >
              <item.icon className="size-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      )}

      {/* Content area */}
      <main className="flex flex-1 flex-col overflow-auto">
        {activeTab === undefined ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-section-title text-text-primary">
                No tournaments open
              </h2>
              <p className="text-sm text-text-secondary">
                Create a new tournament to get started
              </p>
            </div>
            <Button onClick={handleNewTournament}>
              <Plus className="size-4" />
              New Tournament
            </Button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export { RootLayout };
