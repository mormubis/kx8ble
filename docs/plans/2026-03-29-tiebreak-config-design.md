# Tiebreak Configuration — Design

## Goal

Allow arbiters to select, order, and manage tiebreak systems per tournament. Replace the hardcoded Buchholz-only tiebreak with a configurable list.

## Data Model

### Tiebreak Registry

A static registry maps string IDs to tiebreak functions and display metadata:

```typescript
interface TiebreakDefinition {
  id: string;
  name: string;
  abbr: string;
  description: string;
  fn: Tiebreak;
}
```

All 8 available systems:

| ID | Name | Abbr | Package |
|----|------|------|---------|
| `buchholz` | Buchholz | BH | `@echecs/buchholz` |
| `sonneborn-berger` | Sonneborn-Berger | SB | `@echecs/sonneborn-berger` |
| `direct-encounter` | Direct Encounter | DE | `@echecs/direct-encounter` |
| `number-of-wins` | Number of Wins | Wins | `@echecs/number-of-wins` |
| `progressive` | Progressive Score | Prog | `@echecs/progressive` |
| `performance-rating` | Performance Rating | Perf | `@echecs/performance-rating` |
| `koya` | Koya System | Koya | `@echecs/koya` |
| `average-rating` | Avg. Rating of Opponents | AvgR | `@echecs/average-rating` |

### Per-Tournament State

Each tab stores `selectedTiebreaks: string[]` — an ordered array of tiebreak IDs.

Default for new tournaments: `['buchholz', 'sonneborn-berger', 'direct-encounter', 'number-of-wins']` (FIDE-aligned).

## UI

### Tournament Setup — New "Tiebreaks" Card

Placed after the "Tournament Format" card in `tournament-setup.tsx`.

**Available tiebreaks** (top section):
- List of tiebreak systems not yet selected
- Each row: name + short description
- Click to add to selected list

**Selected tiebreaks** (bottom section):
- Label: "Selected tiebreaks (in priority order)"
- Ordered list: position number + name + up/down/remove buttons
- Empty state: "No tiebreaks selected. Click a tiebreak above to add it."

Editable at any point during the tournament (tiebreaks affect standings display, not pairings).

### Standings Table — Dynamic Tiebreak Columns

One column per selected tiebreak, inserted after "Points" and before per-round results:
- Header uses abbreviation (BH, SB, DE, etc.)
- Values from `Standing.tiebreaks[]` array, displayed with `tabular-nums` and 1 decimal place
- Columns appear/disappear based on selected tiebreaks

## Context Changes

- Add `selectedTiebreaks: string[]` to `TabState`
- Add context functions: `addTiebreak(id)`, `removeTiebreak(id)`, `reorderTiebreak(id, direction: 'up' | 'down')`
- Replace `DEFAULT_TIEBREAKS` constant with per-tab computed tiebreak functions
- `standings` computation: map `selectedTiebreaks` IDs through the registry to get `Tiebreak[]`, pass to `tournament.standings()`

## Dependencies

Install from npm:
- `@echecs/sonneborn-berger`
- `@echecs/progressive`
- `@echecs/direct-encounter`
- `@echecs/number-of-wins`
- `@echecs/performance-rating`
- `@echecs/koya`
- `@echecs/average-rating`

## Not In Scope

- Buchholz parameter variants (cut-1, cut-2, median) — requires library changes
- Manual tiebreak input (drawing of lots) — future feature
- Tiebreak persistence in TRF export — future feature
