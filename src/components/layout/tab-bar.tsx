import { Plus, X } from 'lucide-react';

import { useTabs } from '@/hooks/use-tabs.js';
import { cn } from '@/lib/utilities.js';

import type { JSX } from 'react';

function TabBar(): JSX.Element {
  const { activeTab, closeTab, createTab, navigate, selectTab, tabs } =
    useTabs();

  if (tabs.length <= 1 && activeTab?.screen === 'home') {
    return <></>;
  }

  return (
    <div className="flex h-9 items-center border-b border-border bg-bg-tertiary">
      <div className="flex flex-1 items-center overflow-x-auto">
        {tabs.map((tab) => (
          <button
            className={cn(
              'group flex h-9 min-w-0 max-w-48 items-center gap-1.5 border-r border-border px-3 text-xs transition-colors',
              tab.id === activeTab?.id
                ? 'bg-bg-secondary text-text-primary'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-primary',
            )}
            key={tab.id}
            onClick={() => {
              selectTab(tab.id);
            }}
            type="button"
          >
            <span className="truncate">
              {tab.metadata?.name ?? 'New Tournament'}
            </span>
            <button
              className="ml-auto flex-shrink-0 rounded p-0.5 text-text-muted opacity-0 transition-opacity hover:bg-bg-elevated hover:text-text-primary group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab.id);
              }}
              type="button"
            >
              <X className="size-3" />
            </button>
          </button>
        ))}
      </div>

      <button
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-text-muted transition-colors hover:bg-bg-primary hover:text-text-secondary"
        onClick={() => {
          createTab();
          navigate('home');
        }}
        title="New Tab"
        type="button"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export { TabBar };
