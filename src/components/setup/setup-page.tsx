import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useState } from 'react';

import { PlayersTable } from '@/components/setup/players-table.js';
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { useTabs } from '@/hooks/use-tabs.js';

import type { JSX } from 'react';

function SetupPage(): JSX.Element {
  const { navigate, players, startTournament } = useTabs();

  const [name, setName] = useState('');
  const [rounds, setRounds] = useState(5);
  const [step, setStep] = useState<'config' | 'players'>('config');

  const canStartTournament = players.length >= 2 && name.trim().length > 0;

  const handleStart = useCallback(() => {
    if (!canStartTournament) {
      return;
    }

    startTournament(
      { createdAt: new Date().toISOString(), name: name.trim() },
      rounds,
    );
    navigate('round');
  }, [canStartTournament, name, navigate, rounds, startTournament]);

  if (step === 'players') {
    return (
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-bg-secondary px-6 py-4">
          <Button
            onClick={() => {
              setStep('config');
            }}
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-section-title">{name || 'New Tournament'}</h1>
            <p className="text-xs text-text-secondary">
              {rounds} rounds &middot; Dutch system
            </p>
          </div>
          <Button
            disabled={!canStartTournament}
            onClick={handleStart}
            size="sm"
          >
            Start Tournament
          </Button>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <PlayersTable />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle>New Tournament</CardTitle>
          <CardDescription className="text-text-secondary">
            Configure your tournament settings
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary" htmlFor="name">
              Tournament Name
            </Label>
            <Input
              className="border-border bg-bg-primary text-text-primary placeholder:text-text-muted focus-visible:ring-accent"
              id="name"
              onChange={(event) => {
                setName(event.target.value);
              }}
              placeholder="e.g. City Open 2026"
              value={name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary" htmlFor="rounds">
              Number of Rounds
            </Label>
            <Input
              className="border-border bg-bg-primary text-text-primary placeholder:text-text-muted focus-visible:ring-accent"
              id="rounds"
              max={15}
              min={1}
              onChange={(event) => {
                setRounds(Number(event.target.value));
              }}
              type="number"
              value={rounds}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Pairing System</Label>
            <div className="rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-secondary">
              Dutch (FIDE C.04.3)
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              onClick={() => {
                navigate('home');
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={name.trim().length === 0}
              onClick={() => {
                setStep('players');
              }}
            >
              Players
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { SetupPage };
