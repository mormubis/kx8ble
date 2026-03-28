import { useEffect } from 'react';

import { useTabs } from '@/hooks/use-tabs.js';

function useKeyboardShortcuts(): void {
  const {
    activeTab,
    closeTab,
    createTab,
    loadFromFile,
    navigate,
    saveToFile,
    tournament,
  } = useTabs();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const isModule = event.metaKey || event.ctrlKey;

      if (!isModule) {
        return;
      }

      switch (event.key) {
        case 'n': {
          event.preventDefault();
          createTab();
          navigate('setup');
          break;
        }

        case 'o': {
          event.preventDefault();
          void loadFromFile();
          break;
        }

        case 's': {
          event.preventDefault();

          if (tournament) {
            void saveToFile();
          }

          break;
        }

        case 'w': {
          event.preventDefault();

          if (activeTab) {
            // TODO: check for unsaved changes and confirm before closing
            closeTab(activeTab.id);
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeTab,
    closeTab,
    createTab,
    loadFromFile,
    navigate,
    saveToFile,
    tournament,
  ]);
}

export { useKeyboardShortcuts };
