import { FolderOpen, Plus, Trophy } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button.js';
import { useNavigation } from '@/hooks/use-navigation.js';
import { useTournament } from '@/hooks/use-tournament.js';

import type { JSX } from 'react';

function HomePage(): JSX.Element {
  const { navigate } = useNavigation();
  const { loadFromFile } = useTournament();

  const handleOpen = useCallback(async () => {
    const loaded = await loadFromFile();

    if (loaded) {
      navigate('round');
    }
  }, [loadFromFile, navigate]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Trophy className="size-16 text-accent" />
        <h1 className="text-2xl font-semibold">Kx8ble</h1>
        <p className="text-sm text-text-secondary">Chess Tournament Manager</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          className="w-64 gap-2"
          onClick={() => {
            navigate('setup');
          }}
          size="lg"
        >
          <Plus className="size-4" />
          New Tournament
        </Button>
        <Button
          className="w-64 gap-2"
          onClick={() => {
            void handleOpen();
          }}
          size="lg"
          variant="secondary"
        >
          <FolderOpen className="size-4" />
          Open Tournament
        </Button>
      </div>
    </div>
  );
}

export { HomePage };
