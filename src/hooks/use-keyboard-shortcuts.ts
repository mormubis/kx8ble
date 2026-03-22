import { useEffect } from 'react';

import { useTabs } from '@/hooks/use-tabs.js';

function useKeyboardShortcuts(): void {
  const { createTab, navigate, saveToFile, tournament } = useTabs();

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

        case 's': {
          event.preventDefault();

          if (tournament) {
            void saveToFile();
          }

          break;
        }

        case 't': {
          event.preventDefault();
          createTab();
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
  }, [createTab, navigate, saveToFile, tournament]);
}

export { useKeyboardShortcuts };
