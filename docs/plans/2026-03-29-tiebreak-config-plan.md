# Tiebreak Configuration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace hardcoded Buchholz tiebreak with a configurable, ordered list of tiebreak systems that arbiters can manage from the Tournament Setup screen, with tiebreak values displayed as columns in the Standings table.

**Architecture:** Create a tiebreak registry module that maps string IDs to tiebreak functions and metadata. Store selected tiebreak IDs in the tab state. Add a Tiebreaks card to Tournament Setup with add/remove/reorder. Update Standings to show dynamic tiebreak columns.

**Tech Stack:** React 19, TypeScript, `@echecs/tournament` Tiebreak type, 8 `@echecs/*` tiebreak packages from npm.

---

## Task 1: Install Tiebreak Packages

Install the 7 missing tiebreak packages from npm.

**Step 1: Install packages**

```bash
pnpm add @echecs/sonneborn-berger @echecs/progressive @echecs/direct-encounter @echecs/number-of-wins @echecs/performance-rating @echecs/koya @echecs/average-rating
```

**Step 2: Verify**

```bash
pnpm lint && pnpm build
```

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: install all tiebreak packages"
```

---

## Task 2: Create Tiebreak Registry

**Files:**
- Create: `src/lib/tiebreaks.ts`

Create a static registry that maps tiebreak IDs to their functions and display metadata. This is the single source of truth for all available tiebreak systems.

```typescript
import { buchholz } from '@echecs/buchholz';
import { sonnebornBerger } from '@echecs/sonneborn-berger';
import { directEncounter } from '@echecs/direct-encounter';
import { numberOfWins } from '@echecs/number-of-wins';
import { progressive } from '@echecs/progressive';
import { tournamentPerformanceRating } from '@echecs/performance-rating';
import { koya } from '@echecs/koya';
import { averageRatingOfOpponents } from '@echecs/average-rating';

import type { Tiebreak } from '@echecs/tournament';

interface TiebreakDefinition {
  abbr: string;
  description: string;
  fn: Tiebreak;
  id: string;
  name: string;
}

const TIEBREAK_REGISTRY: TiebreakDefinition[] = [
  { abbr: 'BH', description: 'Sum of opponents\' scores', fn: buchholz, id: 'buchholz', name: 'Buchholz' },
  { abbr: 'SB', description: 'Weighted score by opponents\' scores', fn: sonnebornBerger, id: 'sonneborn-berger', name: 'Sonneborn-Berger' },
  { abbr: 'DE', description: 'Results between tied players', fn: directEncounter, id: 'direct-encounter', name: 'Direct Encounter' },
  { abbr: 'Wins', description: 'Total number of wins', fn: numberOfWins, id: 'number-of-wins', name: 'Number of Wins' },
  { abbr: 'Prog', description: 'Cumulative score round by round', fn: progressive, id: 'progressive', name: 'Progressive Score' },
  { abbr: 'Perf', description: 'Tournament performance rating', fn: tournamentPerformanceRating, id: 'performance-rating', name: 'Performance Rating' },
  { abbr: 'Koya', description: 'Score against top-half opponents', fn: koya, id: 'koya', name: 'Koya System' },
  { abbr: 'AvgR', description: 'Average rating of opponents', fn: averageRatingOfOpponents, id: 'average-rating', name: 'Avg. Rating of Opponents' },
];

const DEFAULT_TIEBREAK_IDS: string[] = [
  'buchholz',
  'sonneborn-berger',
  'direct-encounter',
  'number-of-wins',
];

function getTiebreakById(id: string): TiebreakDefinition | undefined {
  return TIEBREAK_REGISTRY.find((t) => t.id === id);
}

function resolveTiebreaks(ids: string[]): Tiebreak[] {
  return ids
    .map((id) => getTiebreakById(id))
    .filter((t): t is TiebreakDefinition => t !== undefined)
    .map((t) => t.fn);
}

export { DEFAULT_TIEBREAK_IDS, getTiebreakById, resolveTiebreaks, TIEBREAK_REGISTRY };
export type { TiebreakDefinition };
```

IMPORTANT: Check the actual export names from each package before using them. Run `node --input-type=module -e "import * as m from '@echecs/sonneborn-berger'; console.log(Object.keys(m))"` etc. to verify the function names match.

**Verify:** `pnpm lint && pnpm build`

**Commit:** `feat: create tiebreak registry with all 8 systems`

---

## Task 3: Add Tiebreak State to Context

**Files:**
- Modify: `src/context/tabs-context.tsx`

**Step 1: Add `selectedTiebreaks` to `TabState`**

In the `TabState` interface (line 34), add:
```typescript
selectedTiebreaks: string[];
```

In `makeTab()` (line 90), add to the return object:
```typescript
selectedTiebreaks: DEFAULT_TIEBREAK_IDS,
```

Import `DEFAULT_TIEBREAK_IDS` and `resolveTiebreaks` from `@/lib/tiebreaks.js`.

**Step 2: Add tiebreak management functions to context**

Add to `TabsContextValue` interface:
```typescript
addTiebreak: (id: string) => void;
removeTiebreak: (id: string) => void;
reorderTiebreak: (id: string, direction: 'up' | 'down') => void;
selectedTiebreaks: string[];
```

Implement the three callbacks using `updateActiveTab`:

- `addTiebreak`: append id to `selectedTiebreaks` array (if not already present)
- `removeTiebreak`: filter out the id
- `reorderTiebreak`: swap the id with its neighbor in the specified direction

**Step 3: Replace `DEFAULT_TIEBREAKS` in standings computation**

Replace line 381:
```typescript
return tournament.standings(DEFAULT_TIEBREAKS);
```
with:
```typescript
const tiebreakFns = resolveTiebreaks(activeTab?.selectedTiebreaks ?? []);
return tournament.standings(tiebreakFns);
```

Remove the old `DEFAULT_TIEBREAKS` constant and the `buchholz` import (now handled by registry).

**Step 4: Add new values to the context value object and its dependency array**

**Step 5: Ensure loaded tournaments get default tiebreaks**

In `loadFromFile` (around line 340), ensure the new tab includes `selectedTiebreaks: DEFAULT_TIEBREAK_IDS`.

**Verify:** `pnpm lint && pnpm build`

**Commit:** `feat: add configurable tiebreak state to tournament context`

---

## Task 4: Tiebreaks Card in Tournament Setup

**Files:**
- Modify: `src/components/tournament/tournament-setup.tsx`

Add a new Card section after the "Tournament Format" card. The card contains:

**Top section — Available tiebreaks:**
- Import `TIEBREAK_REGISTRY` and `useTabs` context (for `selectedTiebreaks`, `addTiebreak`)
- Filter registry to show only tiebreaks NOT in `selectedTiebreaks`
- Render each as a clickable row: name + description, with a `+` button or click-to-add
- When none available: show "All tiebreak systems selected."

**Bottom section — Selected tiebreaks:**
- Import `removeTiebreak`, `reorderTiebreak` from context
- Show ordered list with index number
- Each row: `#N  Name (Abbr)  [ArrowUp] [ArrowDown] [X]`
- ArrowUp disabled on first item, ArrowDown disabled on last
- Empty state: "No tiebreaks selected."
- Use `Button` with `variant="ghost"` and `size="icon"` for action buttons
- Icons: `Plus`, `ChevronUp`, `ChevronDown`, `X` from lucide-react

Use the same Card/CardHeader/CardTitle/CardContent pattern as the other cards on the page.

**Verify:** `pnpm lint && pnpm build`

**Commit:** `feat: add tiebreak configuration card to tournament setup`

---

## Task 5: Tiebreak Columns in Standings Table

**Files:**
- Modify: `src/components/tournament/standings-view.tsx`

**Step 1: Import tiebreak metadata**

Import `getTiebreakById` from `@/lib/tiebreaks.js`. Get `selectedTiebreaks` from `useTabs()`.

**Step 2: Add tiebreak column headers**

After the "Points" `<TableHead>` and before the per-round `R1, R2...` headers, add:
```tsx
{selectedTiebreaks.map((id) => {
  const def = getTiebreakById(id);
  return (
    <TableHead key={id} className="text-center text-xs uppercase w-16">
      {def?.abbr ?? id}
    </TableHead>
  );
})}
```

**Step 3: Add tiebreak value cells**

In each player row, after the Points `<TableCell>` and before the per-round cells, add:
```tsx
{standing.tiebreaks.map((value, index) => (
  <TableCell key={index} className="text-center tabular-nums text-text-secondary">
    {Number.isInteger(value) ? value : value.toFixed(1)}
  </TableCell>
))}
```

Note: `standing.tiebreaks` is already ordered to match the tiebreak functions passed to `standings()`, so the indices align with `selectedTiebreaks`.

**Step 4: Update the empty header row colspan**

The empty state `<TableCell colSpan={...}>` needs to account for the dynamic tiebreak columns.

**Verify:** `pnpm lint && pnpm build`

**Verify visually:** `pnpm dev` — create tournament, add players, pair, enter results, check standings shows BH, SB, DE, Wins columns with values.

**Commit:** `feat: display tiebreak columns in standings table`

---

## Execution Notes

- **Task order is sequential**: 1 → 2 → 3 → 4 → 5. Each depends on the previous.
- **Task 1** is just npm install.
- **Task 2** is pure library code with no UI.
- **Task 3** is context plumbing — the critical integration point.
- **Tasks 4 and 5** are independent UI work once Task 3 is done (but should still be sequential to avoid git conflicts).
- After Task 5, verify the full flow: Setup → select tiebreaks → Players → Rounds → Standings shows correct columns and values.
