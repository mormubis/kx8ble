import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { useTabs } from '@/hooks/use-tabs.js';
import { TIEBREAK_REGISTRY } from '@/lib/tiebreaks.js';
import type {
  PairingSystemId,
  TimeControlType,
  TournamentType,
} from '@/types/index.js';

import type { JSX } from 'react';

function TournamentSetup(): JSX.Element {
  const {
    addTiebreak,
    metadata,
    players,
    removeTiebreak,
    reorderTiebreak,
    round,
    rounds,
    selectedTiebreaks,
    updateMetadata,
  } = useTabs();

  const availableTiebreaks = TIEBREAK_REGISTRY.filter(
    (t) => !selectedTiebreaks.includes(t.id),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-section-title text-text-primary">Tournament Setup</h2>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ── Basic Information ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Tournament Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. City Open 2026"
                  value={metadata?.name ?? ''}
                  onChange={(event) => {
                    updateMetadata({ name: event.target.value });
                  }}
                />
              </div>

              {/* Organizer */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  placeholder="e.g. City Chess Club"
                  value={metadata?.organizer ?? ''}
                  onChange={(event) => {
                    updateMetadata({ organizer: event.target.value });
                  }}
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. City Hall, Room 3"
                  value={metadata?.location ?? ''}
                  onChange={(event) => {
                    updateMetadata({ location: event.target.value });
                  }}
                />
              </div>

              {/* Federation */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="federation">Federation</Label>
                <Input
                  id="federation"
                  placeholder="e.g. FRA"
                  value={metadata?.federation ?? ''}
                  onChange={(event) => {
                    updateMetadata({ federation: event.target.value });
                  }}
                />
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={metadata?.startDate ?? ''}
                  onChange={(event) => {
                    updateMetadata({ startDate: event.target.value });
                  }}
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={metadata?.endDate ?? ''}
                  onChange={(event) => {
                    updateMetadata({ endDate: event.target.value });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tournament Format ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tournament Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Tournament Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tournament-type">Tournament Type</Label>
                <Select
                  value={metadata?.tournamentType ?? 'individual-swiss'}
                  onValueChange={(value) => {
                    updateMetadata({ tournamentType: value as TournamentType });
                  }}
                >
                  <SelectTrigger id="tournament-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual-swiss">
                      Individual Swiss
                    </SelectItem>
                    <SelectItem value="individual-rr">
                      Individual Round-Robin
                    </SelectItem>
                    <SelectItem value="team-swiss">Team Swiss</SelectItem>
                    <SelectItem value="team-rr">Team Round-Robin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Rounds — backed by context (rounds), read-only after tournament starts */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="num-rounds">Number of Rounds</Label>
                <Input
                  id="num-rounds"
                  type="number"
                  value={rounds}
                  disabled
                  readOnly
                />
              </div>

              {/* Time Control */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-control">Time Control</Label>
                <Input
                  id="time-control"
                  placeholder="e.g. 90min + 30sec/move"
                  value={metadata?.timeControl ?? ''}
                  onChange={(event) => {
                    updateMetadata({ timeControl: event.target.value });
                  }}
                />
              </div>

              {/* Time Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-type">Time Type</Label>
                <Select
                  value={metadata?.timeControlType ?? 'standard'}
                  onValueChange={(value) => {
                    updateMetadata({
                      timeControlType: value as TimeControlType,
                    });
                  }}
                >
                  <SelectTrigger id="time-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="rapid">Rapid</SelectItem>
                    <SelectItem value="blitz">Blitz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pairing System */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="pairing-system">Pairing System</Label>
                <Select
                  value={metadata?.pairingSystem ?? 'dutch'}
                  onValueChange={(value) => {
                    updateMetadata({ pairingSystem: value as PairingSystemId });
                  }}
                >
                  <SelectTrigger id="pairing-system" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dutch">Dutch</SelectItem>
                    <SelectItem value="dubov">Dubov</SelectItem>
                    <SelectItem value="burstein">Burstein</SelectItem>
                    <SelectItem value="lim">Lim</SelectItem>
                    <SelectItem value="double-swiss">Double Swiss</SelectItem>
                    <SelectItem value="swiss-team">Swiss Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tiebreaks ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiebreaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Available tiebreaks */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-secondary">
                Available
              </p>
              {availableTiebreaks.length === 0 ? (
                <p className="text-sm text-text-muted">
                  All tiebreak systems selected.
                </p>
              ) : (
                <div className="space-y-1">
                  {availableTiebreaks.map((tb) => (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => addTiebreak(tb.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-bg-elevated"
                    >
                      <Plus className="size-4 shrink-0 text-text-muted" />
                      <span className="font-medium">{tb.name}</span>
                      <span className="text-text-muted">
                        — {tb.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected tiebreaks */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-secondary">
                Selected (in priority order)
              </p>
              {selectedTiebreaks.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No tiebreaks selected.
                </p>
              ) : (
                <div className="space-y-1">
                  {selectedTiebreaks.map((id, index) => {
                    const tiebreak = TIEBREAK_REGISTRY.find((t) => t.id === id);
                    if (!tiebreak) return;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
                      >
                        <span className="w-6 text-center text-xs tabular-nums text-text-muted">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {tiebreak.name}
                          <span className="ml-1 text-text-muted">
                            ({tiebreak.abbr})
                          </span>
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          disabled={index === 0}
                          onClick={() => reorderTiebreak(id, 'up')}
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          disabled={index === selectedTiebreaks.length - 1}
                          onClick={() => reorderTiebreak(id, 'down')}
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => removeTiebreak(id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ── Officials & Rating ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Officials &amp; Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Tournament Director */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="director">Tournament Director</Label>
                <Input
                  id="director"
                  placeholder="e.g. John Smith"
                  value={metadata?.director ?? ''}
                  onChange={(event) => {
                    updateMetadata({ director: event.target.value });
                  }}
                />
              </div>

              {/* Chief Arbiter */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="arbiter">Chief Arbiter</Label>
                <Input
                  id="arbiter"
                  placeholder="e.g. Jane Doe"
                  value={metadata?.arbiter ?? ''}
                  onChange={(event) => {
                    updateMetadata({ arbiter: event.target.value });
                  }}
                />
              </div>

              {/* FIDE Rated */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fide-rated">FIDE Rated</Label>
                <Select
                  value={metadata?.fideRated ? 'yes' : 'no'}
                  onValueChange={(value) => {
                    updateMetadata({ fideRated: value === 'yes' });
                  }}
                >
                  <SelectTrigger id="fide-rated" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nationally Rated */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="nationally-rated">Nationally Rated</Label>
                <Select
                  value={metadata?.nationallyRated ? 'yes' : 'no'}
                  onValueChange={(value) => {
                    updateMetadata({ nationallyRated: value === 'yes' });
                  }}
                >
                  <SelectTrigger id="nationally-rated" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary (read-only, backed by context) ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-secondary">Players</span>
                <span className="text-2xl font-mono tabular-nums text-text-primary">
                  {players.length}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-secondary">Rounds</span>
                <span className="text-2xl font-mono tabular-nums text-text-primary">
                  {rounds}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-secondary">
                  Current Round
                </span>
                <span className="text-2xl font-mono tabular-nums text-text-primary">
                  {round}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { TournamentSetup };
