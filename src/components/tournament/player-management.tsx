import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button.js';
import { Card } from '@/components/ui/card.js';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import type { PlayerEntry } from '@/context/tabs-context.js';
import { useTabs } from '@/hooks/use-tabs.js';

import type { JSX } from 'react';

/* ── Types for the extended UI form (future-proofing) ── */

interface PlayerFormData {
  club: string;
  dateOfBirth: string;
  federation: string;
  fideId: string;
  firstName: string;
  internationalRating: string;
  nationalId: string;
  nationalRating: string;
  sex: string;
  surname: string;
  title: string;
}

const EMPTY_FORM: PlayerFormData = {
  club: '',
  dateOfBirth: '',
  federation: '',
  fideId: '',
  firstName: '',
  internationalRating: '',
  nationalId: '',
  nationalRating: '',
  sex: '',
  surname: '',
  title: '',
};

/* ── Helpers ── */

/** Split a stored "Surname, FirstName" back into parts for the edit form. */
function parseName(name: string): { firstName: string; surname: string } {
  const commaIndex = name.indexOf(',');

  if (commaIndex === -1) {
    return { firstName: '', surname: name };
  }

  return {
    firstName: name.slice(commaIndex + 1).trim(),
    surname: name.slice(0, commaIndex).trim(),
  };
}

/* ── Player Form ── */

interface PlayerFormProperties {
  initialData?: PlayerFormData;
  onCancel: () => void;
  onSubmit: (data: PlayerFormData) => void;
  submitLabel: string;
}

function PlayerForm({
  initialData = EMPTY_FORM,
  onCancel,
  onSubmit,
  submitLabel,
}: PlayerFormProperties): JSX.Element {
  const [formData, setFormData] = useState<PlayerFormData>(initialData);

  const set =
    (field: keyof PlayerFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Surname */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-surname">Surname</Label>
          <Input
            id="pm-surname"
            required
            value={formData.surname}
            onChange={set('surname')}
          />
        </div>

        {/* First Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-firstName">First Name</Label>
          <Input
            id="pm-firstName"
            required
            value={formData.firstName}
            onChange={set('firstName')}
          />
        </div>

        {/* FIDE ID */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-fideId">FIDE ID</Label>
          <Input
            id="pm-fideId"
            value={formData.fideId}
            onChange={set('fideId')}
          />
        </div>

        {/* National ID */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-nationalId">National ID</Label>
          <Input
            id="pm-nationalId"
            value={formData.nationalId}
            onChange={set('nationalId')}
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-title">Title</Label>
          <Select
            value={formData.title}
            onValueChange={(value) => {
              setFormData((previous) => ({ ...previous, title: value }));
            }}
          >
            <SelectTrigger id="pm-title" className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="GM">GM</SelectItem>
              <SelectItem value="IM">IM</SelectItem>
              <SelectItem value="FM">FM</SelectItem>
              <SelectItem value="WGM">WGM</SelectItem>
              <SelectItem value="WIM">WIM</SelectItem>
              <SelectItem value="WFM">WFM</SelectItem>
              <SelectItem value="CM">CM</SelectItem>
              <SelectItem value="WCM">WCM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Federation */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-federation">Federation</Label>
          <Input
            id="pm-federation"
            placeholder="USA"
            value={formData.federation}
            onChange={set('federation')}
          />
        </div>

        {/* International Rating */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-intRating">International Rating</Label>
          <Input
            id="pm-intRating"
            type="number"
            value={formData.internationalRating}
            onChange={set('internationalRating')}
          />
        </div>

        {/* National Rating */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-natRating">National Rating</Label>
          <Input
            id="pm-natRating"
            type="number"
            value={formData.nationalRating}
            onChange={set('nationalRating')}
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-dob">Date of Birth</Label>
          <Input
            id="pm-dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={set('dateOfBirth')}
          />
        </div>

        {/* Sex */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-sex">Sex</Label>
          <Select
            value={formData.sex}
            onValueChange={(value) => {
              setFormData((previous) => ({ ...previous, sex: value }));
            }}
          >
            <SelectTrigger id="pm-sex" className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Club — full width */}
        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="pm-club">Club</Label>
          <Input id="pm-club" value={formData.club} onChange={set('club')} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}

/* ── Main component ── */

function PlayerManagement(): JSX.Element {
  const {
    addPlayer,
    metadata,
    players,
    removePlayer,
    rounds,
    startTournament,
    tournament,
    updatePlayer,
  } = useTabs();

  const [showAdd, setShowAdd] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerEntry | undefined>();

  /* ── Handlers ── */

  const handleAdd = (data: PlayerFormData) => {
    const name = data.firstName
      ? `${data.surname}, ${data.firstName}`
      : data.surname;

    addPlayer({
      federation: data.federation,
      id: crypto.randomUUID(),
      name,
      rating: data.internationalRating ? Number(data.internationalRating) : 0,
    });
    setShowAdd(false);
  };

  const handleUpdate = (data: PlayerFormData) => {
    if (!editingPlayer) return;

    const name = data.firstName
      ? `${data.surname}, ${data.firstName}`
      : data.surname;

    updatePlayer({
      ...editingPlayer,
      federation: data.federation,
      name,
      rating: data.internationalRating
        ? Number(data.internationalRating)
        : editingPlayer.rating,
    });
    setEditingPlayer(undefined);
  };

  const handleDelete = (id: string) => {
    if (globalThis.confirm('Are you sure you want to remove this player?')) {
      removePlayer(id);
    }
  };

  const handleStartTournament = () => {
    const meta = metadata ?? {
      arbiter: '',
      director: '',
      endDate: '',
      federation: '',
      fideRated: false,
      location: '',
      name: '',
      nationallyRated: false,
      organizer: '',
      pairingSystem: 'dutch',
      startDate: '',
      timeControl: '',
      timeControlType: 'standard',
      tournamentType: 'individual-swiss',
    };
    startTournament(meta, rounds);
  };

  /* ── Edit form initial data ── */

  const editInitialData = (): PlayerFormData => {
    if (!editingPlayer) return EMPTY_FORM;

    const { firstName, surname } = parseName(editingPlayer.name);

    return {
      ...EMPTY_FORM,
      federation: editingPlayer.federation ?? '',
      firstName,
      internationalRating: editingPlayer.rating
        ? String(editingPlayer.rating)
        : '',
      surname,
    };
  };

  /* ── Render ── */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-section-title text-text-primary">
          Player Management
        </h2>
        <div className="flex items-center gap-2">
          {tournament === undefined && players.length >= 2 && (
            <Button variant="outline" onClick={handleStartTournament}>
              Start Tournament
            </Button>
          )}
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="size-4" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Player table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-right">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-16">Title</TableHead>
              <TableHead className="w-20">Federation</TableHead>
              <TableHead className="w-28 text-right">Int. Rating</TableHead>
              <TableHead className="w-28 text-right">Nat. Rating</TableHead>
              <TableHead className="w-28">FIDE ID</TableHead>
              <TableHead>Club</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-muted-foreground"
                >
                  No players added yet. Click &lsquo;Add Player&rsquo; to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              [...players].map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  {/* Title — not yet in PlayerEntry; placeholder until model is extended */}
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell>{player.federation ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {player.rating || '—'}
                  </TableCell>
                  {/* National rating — not yet in PlayerEntry */}
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    —
                  </TableCell>
                  {/* FIDE ID — not yet in PlayerEntry */}
                  <TableCell className="tabular-nums text-muted-foreground">
                    —
                  </TableCell>
                  {/* Club — not yet in PlayerEntry */}
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${player.name}`}
                        onClick={() => setEditingPlayer(player)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove ${player.name}`}
                        onClick={() => handleDelete(player.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Player Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Player</DialogTitle>
          </DialogHeader>
          <PlayerForm
            submitLabel="Add Player"
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog
        open={editingPlayer !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditingPlayer(undefined);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <PlayerForm
              key={editingPlayer.id}
              initialData={editInitialData()}
              submitLabel="Update Player"
              onSubmit={handleUpdate}
              onCancel={() => setEditingPlayer(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { PlayerManagement };
