import { Badge } from '@/components/ui/badge.js';
import { cn } from '@/lib/utilities.js';

import type { Result } from '@echecs/tournament';
import type { JSX } from 'react';

interface ResultCellProperties {
  disabled?: boolean;
  onSelect: (result: Result) => void;
  value: Result | undefined;
}

const RESULT_OPTIONS: { label: string; value: Result }[] = [
  { label: '1-0', value: 1 },
  { label: '\u00BD-\u00BD', value: 0.5 },
  { label: '0-1', value: 0 },
];

function resultLabel(value: Result): string {
  if (value === 1) {
    return '1-0';
  }

  if (value === 0.5) {
    return '\u00BD-\u00BD';
  }

  return '0-1';
}

function resultColor(value: Result): string {
  if (value === 1) {
    return 'bg-success text-white';
  }

  if (value === 0) {
    return 'bg-danger text-white';
  }

  return 'bg-draw text-bg-tertiary';
}

function ResultCell({
  disabled = false,
  onSelect,
  value,
}: ResultCellProperties): JSX.Element {
  if (disabled) {
    if (value !== undefined) {
      return (
        <Badge className={cn('cursor-default text-xs', resultColor(value))}>
          {resultLabel(value)}
        </Badge>
      );
    }

    return <span className="text-text-muted">&mdash;</span>;
  }

  return (
    <div className="inline-flex rounded-md border border-border">
      {RESULT_OPTIONS.map((option, index) => (
        <button
          className={cn(
            'px-2.5 py-0.5 text-xs font-medium transition-colors',
            index === 0 && 'rounded-l-md',
            index === RESULT_OPTIONS.length - 1 && 'rounded-r-md',
            index > 0 && 'border-l border-border',
            value === option.value
              ? resultColor(option.value)
              : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
          )}
          key={option.value}
          onClick={() => {
            onSelect(option.value);
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export { ResultCell };
