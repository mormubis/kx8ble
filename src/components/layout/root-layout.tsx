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
      {/* Header bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-primary">Kx8ble</span>
          <Button onClick={handleNewTournament} size="sm">
            <Plus className="size-4" />
            New Tournament
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              void loadFromFile();
            }}
            size="sm"
            variant="secondary"
          >
            <FolderOpen className="size-4" />
            Open
          </Button>
        </div>
      </header>

      {/* Tournament tabs row */}
      {tabs.length > 0 && (
        <div className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-2">
          {tabs.map((tab) => (
            <button
              className={cn(
                'group relative flex shrink-0 items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
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
                {tab.metadata?.name ?? 'New Tournament'}
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
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }
                }}
              >
                <X className="size-3" />
              </span>
            </button>
          ))}
        </div>
      )}

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
