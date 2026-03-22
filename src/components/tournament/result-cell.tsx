import { Badge } from '@/components/ui/badge.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
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
  if (value !== undefined) {
    return (
      <Badge className={cn('cursor-default text-xs', resultColor(value))}>
        {resultLabel(value)}
      </Badge>
    );
  }

  if (disabled) {
    return <span className="text-text-muted">&mdash;</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md border border-dashed border-border px-3 py-0.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-text-secondary"
          type="button"
        >
          Result
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border bg-bg-secondary">
        {RESULT_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="cursor-pointer text-text-primary hover:bg-bg-elevated focus:bg-bg-elevated"
            key={option.value}
            onClick={() => {
              onSelect(option.value);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ResultCell };
