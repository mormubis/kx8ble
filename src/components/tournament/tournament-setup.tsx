import { useState } from 'react';

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
import type {
  PairingSystemId,
  TimeControlType,
  TournamentType,
} from '@/types/index.js';

import type { JSX } from 'react';

function TournamentSetup(): JSX.Element {
  const { metadata, players, round, rounds } = useTabs();

  // ── Local state for fields not yet backed by context (wired in Task 9) ──

  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [federation, setFederation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [tournamentType, setTournamentType] =
    useState<TournamentType>('individual-swiss');
  const [timeControl, setTimeControl] = useState('');
  const [timeType, setTimeType] = useState<TimeControlType>('standard');
  const [pairingSystem, setPairingSystem] = useState<PairingSystemId>('dutch');

  const [director, setDirector] = useState('');
  const [arbiter, setArbiter] = useState('');
  const [fideRated, setFideRated] = useState<'yes' | 'no'>('no');
  const [nationallyRated, setNationallyRated] = useState<'yes' | 'no'>('no');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-section-title text-text-primary">Tournament Setup</h2>

      {/* ── Basic Information ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Tournament Name — backed by metadata.name (Task 9: wire to updateMetadata) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                placeholder="e.g. City Open 2026"
                value={metadata?.name ?? ''}
                onChange={() => {
                  // TODO: wire to updateMetadata when context is extended
                }}
              />
            </div>

            {/* Organizer — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                placeholder="e.g. City Chess Club"
                value={organizer}
                onChange={(event) => {
                  setOrganizer(event.target.value);
                }}
              />
            </div>

            {/* Location — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. City Hall, Room 3"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
              />
            </div>

            {/* Federation — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="federation">Federation</Label>
              <Input
                id="federation"
                placeholder="e.g. FRA"
                value={federation}
                onChange={(event) => {
                  setFederation(event.target.value);
                }}
              />
            </div>

            {/* Start Date — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
              />
            </div>

            {/* End Date — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
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
            {/* Tournament Type — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tournament-type">Tournament Type</Label>
              <Select
                value={tournamentType}
                onValueChange={(value) => {
                  setTournamentType(value as TournamentType);
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

            {/* Time Control — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="time-control">Time Control</Label>
              <Input
                id="time-control"
                placeholder="e.g. 90min + 30sec/move"
                value={timeControl}
                onChange={(event) => {
                  setTimeControl(event.target.value);
                }}
              />
            </div>

            {/* Time Type — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="time-type">Time Type</Label>
              <Select
                value={timeType}
                onValueChange={(value) => {
                  setTimeType(value as TimeControlType);
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

            {/* Pairing System — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pairing-system">Pairing System</Label>
              <Select
                value={pairingSystem}
                onValueChange={(value) => {
                  setPairingSystem(value as PairingSystemId);
                }}
              >
                <SelectTrigger id="pairing-system" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dutch">Dutch (FIDE C.04.3)</SelectItem>
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

      {/* ── Officials & Rating ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Officials &amp; Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Tournament Director — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="director">Tournament Director</Label>
              <Input
                id="director"
                placeholder="e.g. John Smith"
                value={director}
                onChange={(event) => {
                  setDirector(event.target.value);
                }}
              />
            </div>

            {/* Chief Arbiter — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="arbiter">Chief Arbiter</Label>
              <Input
                id="arbiter"
                placeholder="e.g. Jane Doe"
                value={arbiter}
                onChange={(event) => {
                  setArbiter(event.target.value);
                }}
              />
            </div>

            {/* FIDE Rated — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fide-rated">FIDE Rated</Label>
              <Select
                value={fideRated}
                onValueChange={(value) => {
                  setFideRated(value as 'yes' | 'no');
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

            {/* Nationally Rated — local state, connect to context in Task 9 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nationally-rated">Nationally Rated</Label>
              <Select
                value={nationallyRated}
                onValueChange={(value) => {
                  setNationallyRated(value as 'yes' | 'no');
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
              <span className="text-sm text-text-secondary">Current Round</span>
              <span className="text-2xl font-mono tabular-nums text-text-primary">
                {round}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { TournamentSetup };
