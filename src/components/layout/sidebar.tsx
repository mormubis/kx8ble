import { Home, ListOrdered, Swords, Trophy } from 'lucide-react';

import { useNavigation } from '@/hooks/use-navigation.js';
import { cn } from '@/lib/utilities.js';
import type { Screen } from '@/types/index.js';

import type { JSX } from 'react';

interface NavItem {
  icon: typeof Home;
  label: string;
  screen: Screen;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: 'Home', screen: 'home' },
  { icon: Swords, label: 'Rounds', screen: 'round' },
  { icon: ListOrdered, label: 'Standings', screen: 'standings' },
];

function Sidebar(): JSX.Element {
  const { navigate, screen } = useNavigation();

  return (
    <aside className="flex h-full w-14 flex-col border-r border-border bg-bg-tertiary">
      <div className="flex h-12 items-center justify-center border-b border-border">
        <Trophy className="size-5 text-accent" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => (
          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md transition-colors',
              screen === item.screen
                ? 'bg-bg-secondary text-accent'
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
            )}
            key={item.screen}
            onClick={() => {
              navigate(item.screen);
            }}
            title={item.label}
            type="button"
          >
            <item.icon className="size-5" />
          </button>
        ))}
      </nav>
    </aside>
  );
}

export { Sidebar };
