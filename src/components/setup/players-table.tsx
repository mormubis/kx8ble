import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { useTournament } from '@/hooks/use-tournament.js';

import type { JSX } from 'react';

function PlayersTable(): JSX.Element {
  const { addPlayer, players, removePlayer } = useTournament();

  const [name, setName] = useState('');
  const [rating, setRating] = useState('');

  const handleAdd = useCallback(() => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    addPlayer({
      federation: '',
      id: nanoid(),
      name: trimmedName,
      rating: rating ? Number(rating) : 0,
    });

    setName('');
    setRating('');
  }, [addPlayer, name, rating]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-text-secondary" htmlFor="player-name">
            Name
          </label>
          <Input
            className="border-border bg-bg-primary text-text-primary placeholder:text-text-muted focus-visible:ring-accent"
            id="player-name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAdd();
              }
            }}
            placeholder="Player name"
            value={name}
          />
        </div>
        <div className="flex w-28 flex-col gap-1">
          <label
            className="text-xs text-text-secondary"
            htmlFor="player-rating"
          >
            Rating
          </label>
          <Input
            className="border-border bg-bg-primary text-text-primary placeholder:text-text-muted focus-visible:ring-accent"
            id="player-rating"
            onChange={(event) => {
              setRating(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAdd();
              }
            }}
            placeholder="ELO"
            type="number"
            value={rating}
          />
        </div>
        <Button
          disabled={name.trim().length === 0}
          onClick={handleAdd}
          size="sm"
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {players.length > 0 ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12 text-text-secondary">#</TableHead>
                <TableHead className="text-text-secondary">Name</TableHead>
                <TableHead className="w-24 text-right text-text-secondary">
                  Rating
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player, index) => (
                <TableRow
                  className="border-border hover:bg-bg-elevated"
                  key={player.id}
                >
                  <TableCell className="font-mono text-text-secondary">
                    {index + 1}
                  </TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    {player.rating || '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="text-text-muted hover:text-danger"
                      onClick={() => {
                        removePlayer(player.id);
                      }}
                      size="icon-xs"
                      variant="ghost"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-text-muted">
            No players yet. Add at least 2 players to start.
          </p>
        </div>
      )}

      <p className="text-xs text-text-secondary">
        {players.length} player{players.length === 1 ? '' : 's'} registered
      </p>
    </div>
  );
}

export { PlayersTable };
