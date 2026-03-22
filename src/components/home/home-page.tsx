import { FolderOpen, Plus, Trophy } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button.js';
import { useTabs } from '@/hooks/use-tabs.js';

import type { JSX } from 'react';

function HomePage(): JSX.Element {
  const { loadFromFile, navigate } = useTabs();

  const handleOpen = useCallback(async () => {
    await loadFromFile();
  }, [loadFromFile]);

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
