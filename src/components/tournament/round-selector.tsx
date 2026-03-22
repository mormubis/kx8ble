import { useTabs } from '@/hooks/use-tabs.js';
import { cn } from '@/lib/utilities.js';

import type { JSX } from 'react';

function RoundSelector(): JSX.Element {
  const { round, rounds, setViewingRound, viewingRound } = useTabs();

  if (round === 0) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: round }, (_, index) => {
        const roundNumber = index + 1;
        const isActive = roundNumber === viewingRound;
        const isCurrent = roundNumber === round;

        return (
          <button
            className={cn(
              'flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-mono transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : isCurrent
                  ? 'bg-bg-elevated text-text-primary hover:bg-accent/80 hover:text-accent-foreground'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
            )}
            key={roundNumber}
            onClick={() => {
              setViewingRound(roundNumber);
            }}
            title={`Round ${roundNumber}${isCurrent ? ' (current)' : ''}`}
            type="button"
          >
            R{roundNumber}
          </button>
        );
      })}

      {round < rounds && (
        <span className="px-1 text-xs text-text-muted">of {rounds}</span>
      )}
    </div>
  );
}

export { RoundSelector };
