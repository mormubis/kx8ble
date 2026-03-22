import { useEffect } from 'react';

import { useNavigation } from '@/hooks/use-navigation.js';
import { useTournament } from '@/hooks/use-tournament.js';

function useKeyboardShortcuts(): void {
  const { navigate } = useNavigation();
  const { saveToFile, tournament } = useTournament();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const isModule = event.metaKey || event.ctrlKey;

      if (!isModule) {
        return;
      }

      switch (event.key) {
        case 'n': {
          event.preventDefault();
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

        default: {
          break;
        }
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, saveToFile, tournament]);
}

export { useKeyboardShortcuts };
